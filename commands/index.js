// A generated command registry with 360 command entries plus useful bot commands.
const COMMANDS = {};

const baseCommands = {
  menu: {
    description: "Affiche le menu principal du bot.",
    ownerOnly: false,
    run: async ({ sock, jid, msg }) => {
      const list = Object.keys(COMMANDS)
        .slice(0, 25)
        .map(name => `• ${name}`)
        .join("\n");
      await sock.sendMessage(
        jid,
        { text: `🤖 Menu principal\n${list}\n\nUtilise .help pour plus d'aide.` },
        { quoted: msg }
      );
    }
  },
  help: {
    description: "Affiche l'aide du bot.",
    ownerOnly: false,
    run: async ({ sock, jid, msg }) => {
      await sock.sendMessage(
        jid,
        { text: "🤖 CHOCO ITACHI ALIEN\n\nCommandes principales: .menu, .ping, .info, .status, .owner, .qr\n\nLe bot contient une base de 360 commandes générées et prêtes à enrichir." },
        { quoted: msg }
      );
    }
  },
  ping: {
    description: "Teste la présence du bot.",
    ownerOnly: false,
    run: async ({ sock, jid, msg }) => {
      await sock.sendMessage(jid, { text: "Pong! 🤖" }, { quoted: msg });
    }
  },
  info: {
    description: "Affiche les informations du bot.",
    ownerOnly: false,
    run: async ({ sock, jid, msg, ownerConfig }) => {
      await sock.sendMessage(
        jid,
        {
          text: `🤖 Bot: ${ownerConfig.name}\nPropriétaire: ${ownerConfig.ownerNumber}\nStatut: En ligne`
        },
        { quoted: msg }
      );
    }
  },
  status: {
    description: "Affiche l'état du bot.",
    ownerOnly: false,
    run: async ({ sock, jid, msg }) => {
      await sock.sendMessage(
        jid,
        { text: "✅ Bot en ligne et prêt.\nSystème: WhatsApp Baileys\nMode: Multi-appareil" },
        { quoted: msg }
      );
    }
  },
  owner: {
    description: "Informations du propriétaire.",
    ownerOnly: false,
    run: async ({ sock, jid, msg, ownerConfig }) => {
      await sock.sendMessage(
        jid,
        { text: `👑 Propriétaire: ${ownerConfig.ownerNumber}` },
        { quoted: msg }
      );
    }
  },
  qr: {
    description: "Affiche le QR si disponible.",
    ownerOnly: false,
    run: async ({ sock, jid, msg }) => {
      await sock.sendMessage(
        jid,
        { text: "📱 Utilise la route HTTP /qr sur Render pour scanner le QR, ou relance le bot avec une session valide." },
        { quoted: msg }
      );
    }
  },
  echo: {
    description: "Répète ce qui a été dit.",
    ownerOnly: false,
    run: async ({ sock, jid, msg, args }) => {
      const text = args.join(" ") || "Aucun texte fourni.";
      await sock.sendMessage(jid, { text: `Echo: ${text}` }, { quoted: msg });
    }
  },
  time: {
    description: "Affiche l'heure actuelle.",
    ownerOnly: false,
    run: async ({ sock, jid, msg }) => {
      const now = new Date().toLocaleTimeString("fr-FR");
      await sock.sendMessage(jid, { text: `⏰ Heure: ${now}` }, { quoted: msg });
    }
  },
  date: {
    description: "Affiche la date actuelle.",
    ownerOnly: false,
    run: async ({ sock, jid, msg }) => {
      const now = new Date().toLocaleDateString("fr-FR");
      await sock.sendMessage(jid, { text: `📅 Date: ${now}` }, { quoted: msg });
    }
  },
  restart: {
    description: "Redémarre le bot.",
    ownerOnly: true,
    run: async ({ sock, jid, msg }) => {
      await sock.sendMessage(jid, { text: "🔄 Redémarrage du bot..." }, { quoted: msg });
      setTimeout(() => process.exit(0), 1000);
    }
  }
};

Object.assign(COMMANDS, baseCommands);

for (let i = 1; i <= 360; i++) {
  const name = `cmd${String(i).padStart(3, "0")}`;
  COMMANDS[name] = {
    description: `Commande générée numéro ${i} du bot.`,
    ownerOnly: false,
    run: async ({ sock, jid, msg, args }) => {
      const suffix = args.length ? `\nArguments: ${args.join(" ")}` : "";
      await sock.sendMessage(
        jid,
        {
          text: `⚙️ ${name} activée.${suffix}\nStatut: opérationnelle.\nType: command placeholder`
        },
        { quoted: msg }
      );
    }
  };
}

module.exports = COMMANDS;
