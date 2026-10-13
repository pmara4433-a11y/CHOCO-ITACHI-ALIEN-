const http = require("http");
const express = require("express");
const QRCode = require("qrcode");
const pino = require("pino");
const { default: makeWASocket, useMultiFileAuthState } = require("@whiskeysockets/baileys");
require("dotenv").config();

const config = require("./config/config");
const ownerConfig = require("./config/owner");
const sessionManager = require("./lib/sessionManager");
const loadCommands = require("./lib/commandLoader");
const handleCommand = require("./lib/commandHandler");

const commands = loadCommands();
let latestQR = null;

function startHttpServer() {
  const app = express();
  const port = Number(process.env.PORT) || 3000;

  app.get("/", (req, res) => {
    res.json({
      ok: true,
      service: config.bot.name,
      status: "running",
      timestamp: new Date().toISOString(),
      port
    });
  });

  app.get("/qr", async (req, res) => {
    if (!latestQR) {
      res.type("html").send(`
        <html>
          <body style="font-family: Arial; text-align:center; padding: 30px; background:#111; color:#fff;">
            <h2>QR non disponible encore</h2>
            <p>Le bot est en cours de connexion. Réessayez dans quelques secondes.</p>
          </body>
        </html>
      `);
      return;
    }

    try {
      const dataUrl = await QRCode.toDataURL(latestQR);
      res.type("html").send(`
        <html>
          <body style="font-family: Arial; text-align:center; background:#111; color:#fff; padding: 25px;">
            <h2>Scanner le QR</h2>
            <img src="${dataUrl}" style="max-width: 420px; width:100%; border-radius:12px;" />
            <p>Ouvre WhatsApp → Appareils connectés → Connecter un appareil → Scanner le QR.</p>
          </body>
        </html>
      `);
    } catch (error) {
      res.status(500).send("Impossible de générer le QR.");
    }
  });

  app.listen(port, "0.0.0.0", () => {
    console.log(`✅ HTTP server running on port ${port}`);
  });
}

async function startBot(phoneNumber) {
  const number = sessionManager.normalizeNumber(phoneNumber);

  if (!/^\d{8,15}$/.test(number)) {
    throw new Error("Numéro invalide. Format attendu: 224XXXXXXXXX sans +.");
  }

  const sessionPath = sessionManager.getSessionPath(number);
  const { state, saveCreds } = await useMultiFileAuthState(sessionPath);

  const sock = makeWASocket({
    auth: state,
    logger: pino({ level: "silent" }),
    printQRInTerminal: false,
    syncFullHistory: false,
    browser: [config.bot.name, "Chrome", "1.0.0"]
  });

  sock.ev.on("creds.update", saveCreds);

  sock.ev.on("connection.update", update => {
    const { connection, lastDisconnect, qr } = update;

    if (qr) {
      latestQR = qr;
      console.log("📱 QR prêt. Ouvre /qr sur ton service Render.");
    }

    if (connection === "open") {
      console.log(`✅ ${config.bot.name} connecté: ${number}`);
      latestQR = null;
    }

    if (connection === "close") {
      const statusCode = lastDisconnect?.error?.output?.statusCode;
      console.log("Connexion fermée, nouvelle tentative dans 3s...");
      if (statusCode !== 401) {
        setTimeout(() => {
          startBot(number).catch(err => console.error("Reconnect failed:", err.message));
        }, 3000);
      }
    }
  });

  if (!state.creds.registered) {
    let pairingInterval = null;

    const tryPair = async () => {
      try {
        const code = await sock.requestPairingCode(number);
        console.log(`\n🍫 CODE DE LIAISON: ${code}\n`);
        console.log("Ouvre WhatsApp > Appareils connectés > Connecter un appareil > Entrer le code.");
      } catch (error) {
        console.error("Erreur requestPairingCode:", error?.message || error);
      }
    };

    await tryPair();

    pairingInterval = setInterval(async () => {
      if (state.creds?.registered) {
        clearInterval(pairingInterval);
        return;
      }
      await tryPair();
    }, 30000);

    sock.ev.on("creds.update", () => {
      if (state.creds?.registered) {
        clearInterval(pairingInterval);
        console.log("✅ Session enregistrée. Arrêt des régénérations de code.");
      }
    });
  }

  sock.ev.on("messages.upsert", async ({ messages, type }) => {
    if (type !== "notify") return;

    for (const msg of messages) {
      if (!msg.message || msg.key.fromMe) continue;

      try {
        await handleIncomingMessage(sock, msg);
      } catch (error) {
        console.error("Erreur message:", error.message);
      }
    }
  });

  return sock;
}

async function handleIncomingMessage(sock, msg) {
  const jid = msg.key.remoteJid;
  if (!jid || jid === "status@broadcast") return;

  const text =
    msg.message?.conversation ||
    msg.message?.extendedTextMessage?.text ||
    msg.message?.imageMessage?.caption ||
    msg.message?.videoMessage?.caption ||
    "";

  const rawPrefix = config.bot.prefix || ".";
  const prefix = text.startsWith(rawPrefix) ? rawPrefix : text.startsWith("🍫") ? "🍫" : "";
  if (!prefix) return;

  const bodyWithoutPrefix = text.slice(prefix.length).trim();
  const parts = bodyWithoutPrefix.split(/\s+/).filter(Boolean);
  const commandName = (parts.shift() || "").toLowerCase();

  if (!commandName) return;

  const command = commands.get(commandName);
  if (!command) {
    await sock.sendMessage(
      jid,
      { text: `❌ Commande introuvable. Tape ${prefix}menu` },
      { quoted: msg }
    );
    return;
  }

  await handleCommand(sock, msg, command, parts, { ownerNumber: ownerConfig.ownerNumber });
}

async function main() {
  startHttpServer();

  const phoneNumber =
    process.env.PAIRING_NUMBER ||
    process.env.OWNER_NUMBER ||
    ownerConfig.ownerNumber;

  try {
    await startBot(phoneNumber);
  } catch (error) {
    console.error("Erreur de démarrage:", error.message);
    process.exitCode = 1;
  }
}

main();
