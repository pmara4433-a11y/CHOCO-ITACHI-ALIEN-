const ownerConfig = require("../config/owner");

module.exports = async function handleCommand(sock, msg, command, args, extra = {}) {
  const jid = msg.key.remoteJid;
  const sender = msg.key.participant || msg.key.remoteJid;

  const isOwner =
    (sender && sender.includes(ownerConfig.ownerNumber)) ||
    (msg.pushName && msg.pushName === ownerConfig.name);

  if (command.ownerOnly && !isOwner) {
    await sock.sendMessage(
      jid,
      { text: "❌ Cette commande est réservée au propriétaire." },
      { quoted: msg }
    );
    return;
  }

  try {
    await command.run({
      sock,
      msg,
      jid,
      sender,
      args,
      isOwner,
      ownerConfig,
      ...extra
    });
  } catch (error) {
    console.error("Erreur commande:", error);
    await sock.sendMessage(
      jid,
      { text: `❌ Erreur dans la commande: ${error.message || "inconnue"}` },
      { quoted: msg }
    );
  }
};
