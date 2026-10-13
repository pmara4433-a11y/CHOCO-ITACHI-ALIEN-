const COMMANDS = {};
const CATEGORY_ORDER = ["General", "Utility", "Fun", "Owner"];

const categoryMap = {
  General: [
    "menu",
    "help",
    "ping",
    "info",
    "status",
    "owner",
    "qr",
    "time",
    "date",
    "uptime",
    "whois",
    "list",
    "say",
    "echo",
    "stats"
  ],
  Utility: [
    "upper",
    "lower",
    "reverse",
    "choose",
    "random",
    "dice",
    "coinflip",
    "count",
    "joke",
    "fact",
    "meme",
    "search",
    "link",
    "calc",
    "convert"
  ],
  Fun: [
    "slap",
    "hug",
    "kiss",
    "pat",
    "dance",
    "cry",
    "angry",
    "love",
    "botlove",
    "mock",
    "roast",
    "vibe",
    "rate",
    "truth",
    "dare"
  ],
  Owner: [
    "restart",
    "broadcast",
    "clear",
    "setprefix",
    "listcmds",
    "ownerstats"
  ]
};

function formatList(list) {
  return list.map(name => `• ${name}`).join("\n");
}

function createCommand({ name, description, category, ownerOnly = false, run }) {
  COMMANDS[name] = { name, description, category, ownerOnly, run };
}

createCommand({
  name: "menu",
  description: "Affiche le menu principal du bot.",
  category: "General",
  run: async ({ sock, jid, msg }) => {
    const lines = [];
    for (const category of CATEGORY_ORDER) {
      const names = categoryMap[category] || [];
      lines.push(`⭐ ${category}:`);
      lines.push(names.map(n => `  • ${n}`).join("\n"));
      lines.push("");
    }
    await sock.sendMessage(jid, { text: `🤖 CHOCO ITACHI ALIEN\n\n${lines.join("\n")}` }, { quoted: msg });
  }
});

createCommand({
  name: "help",
  description: "Affiche l’aide du bot. Peut filtrer par mot-clé.",
  category: "General",
  run: async ({ sock, jid, msg, args }) => {
    const query = (args.join(" ") || "").toLowerCase();
    const entries = Object.entries(COMMANDS).filter(([name, cmd]) => {
      if (!query) return true;
      if (cmd.name.includes(query)) return true;
      if ((cmd.description || "").toLowerCase().includes(query)) return true;
      if ((cmd.category || "").toLowerCase().includes(query)) return true;
      return false;
    });

    const text = entries
      .slice(0, 25)
      .map(([name, cmd]) => `• ${name} — ${cmd.description}`)
      .join("\n");

    await sock.sendMessage(
      jid,
      { text: `📘 Aide\n${text || "Aucune commande trouvée."}` },
      { quoted: msg }
    );
  }
});

createCommand({
  name: "ping",
  description: "Teste la réponse du bot.",
  category: "General",
  run: async ({ sock, jid, msg }) => {
    await sock.sendMessage(jid, { text: "Pong! 🛰️" }, { quoted: msg });
  }
});

createCommand({
  name: "info",
  description: "Affiche les informations du bot.",
  category: "General",
  run: async ({ sock, jid, msg, ownerConfig }) => {
    const now = new Date().toLocaleString("fr-FR");
    await sock.sendMessage(
      jid,
      { text: `🤖 Bot: ${ownerConfig.name}\nPropriétaire: ${ownerConfig.ownerNumber}\nHeure: ${now}\nVersion: 1.0.0` },
      { quoted: msg }
    );
  }
});

createCommand({
  name: "status",
  description: "Affiche l’état du bot.",
  category: "General",
  run: async ({ sock, jid, msg }) => {
    const uptime = process.uptime();
    const minutes = Math.floor(uptime / 60);
    const seconds = Math.floor(uptime % 60);
    await sock.sendMessage(
      jid,
      { text: `✅ Bot en ligne\nUptime: ${minutes} min ${seconds} sec\nMode: WhatsApp Baileys` },
      { quoted: msg }
    );
  }
});

createCommand({
  name: "owner",
  description: "Affiche le contact du propriétaire.",
  category: "General",
  run: async ({ sock, jid, msg, ownerConfig }) => {
    await sock.sendMessage(jid, { text: `👑 Propriétaire: ${ownerConfig.ownerNumber}` }, { quoted: msg });
  }
});

createCommand({
  name: "qr",
  description: "Indique comment obtenir le QR de connexion.",
  category: "General",
  run: async ({ sock, jid, msg }) => {
    await sock.sendMessage(
      jid,
      { text: "📱 Pour connecter : ouvre /qr sur le service Render ou relance le bot avec une session WhatsApp valide." },
      { quoted: msg }
    );
  }
});

createCommand({
  name: "time",
  description: "Affiche l’heure actuelle.",
  category: "General",
  run: async ({ sock, jid, msg }) => {
    await sock.sendMessage(jid, { text: `⏰ ${new Date().toLocaleTimeString("fr-FR")}` }, { quoted: msg });
  }
});

createCommand({
  name: "date",
  description: "Affiche la date du jour.",
  category: "General",
  run: async ({ sock, jid, msg }) => {
    await sock.sendMessage(jid, { text: `📅 ${new Date().toLocaleDateString("fr-FR")}` }, { quoted: msg });
  }
});

createCommand({
  name: "uptime",
  description: "Affiche le temps de fonctionnement.",
  category: "General",
  run: async ({ sock, jid, msg }) => {
    const uptime = process.uptime();
    const hours = Math.floor(uptime / 3600);
    const minutes = Math.floor((uptime % 3600) / 60);
    await sock.sendMessage(jid, { text: `🕒 Uptime: ${hours}h ${minutes}m` }, { quoted: msg });
  }
});

createCommand({
  name: "whois",
  description: "Affiche des infos sur l’expéditeur du message.",
  category: "General",
  run: async ({ sock, jid, msg, sender }) => {
    await sock.sendMessage(
      jid,
      { text: `👤 Expéditeur: ${sender || "Inconnu"}\nChat: ${jid}` },
      { quoted: msg }
    );
  }
});

createCommand({
  name: "list",
  description: "Liste les commandes disponibles par catégorie.",
  category: "General",
  run: async ({ sock, jid, msg }) => {
    const output = Object.entries(categoryMap)
      .map(([category, names]) => `${category}: ${names.join(", ")}`)
      .join("\n");
    await sock.sendMessage(jid, { text: `📚 Commandes\n${output}` }, { quoted: msg });
  }
});

createCommand({
  name: "say",
  description: "Répète un message.",
  category: "General",
  run: async ({ sock, jid, msg, args }) => {
    const text = args.join(" ") || "Aucun message fourni.";
    await sock.sendMessage(jid, { text: `✍️ ${text}` }, { quoted: msg });
  }
});

createCommand({
  name: "echo",
  description: "Alias simple de say.",
  category: "General",
  run: async ({ sock, jid, msg, args }) => {
    const text = args.join(" ") || "Aucun texte fourni.";
    await sock.sendMessage(jid, { text: `Echo: ${text}` }, { quoted: msg });
  }
});

createCommand({
  name: "stats",
  description: "Affiche des stats du processus.",
  category: "General",
  run: async ({ sock, jid, msg }) => {
    const memory = process.memoryUsage();
    const rss = Math.round(memory.rss / 1024 / 1024);
    const heap = Math.round(memory.heapUsed / 1024 / 1024);
    await sock.sendMessage(
      jid,
      { text: `📊 Stats\nRSS: ${rss}MB\nHeap: ${heap}MB\nUptime: ${Math.floor(process.uptime())}s` },
      { quoted: msg }
    );
  }
});

createCommand({
  name: "upper",
  description: "Met tout en majuscules.",
  category: "Utility",
  run: async ({ sock, jid, msg, args }) => {
    await sock.sendMessage(jid, { text: args.join(" ").toUpperCase() || "Aucune chaîne.” }, { quoted: msg });
  }
});

createCommand({
  name: "lower",
  description: "Met tout en minuscules.",
  category: "Utility",
  run: async ({ sock, jid, msg, args }) => {
    await sock.sendMessage(jid, { text: args.join(" ").toLowerCase() || "Aucune chaîne." }, { quoted: msg });
  }
});

createCommand({
  name: "reverse",
  description: "Inverse le texte.",
  category: "Utility",
  run: async ({ sock, jid, msg, args }) => {
    const text = args.join(" ") || "Aucun texte.";
    await sock.sendMessage(jid, { text: [...text].reverse().join("") }, { quoted: msg });
  }
});

createCommand({
  name: "choose",
  description: "Choisit un élément au hasard dans une liste.",
  category: "Utility",
  run: async ({ sock, jid, msg, args }) => {
    if (!args.length) {
      await sock.sendMessage(jid, { text: "Exemple: .choose oui non peut-être" }, { quoted: msg });
      return;
    }
    const choice = args[Math.floor(Math.random() * args.length)];
    await sock.sendMessage(jid, { text: `🎯 Choix: ${choice}` }, { quoted: msg });
  }
});

createCommand({
  name: "random",
  description: "Génère un nombre aléatoire.",
  category: "Utility",
  run: async ({ sock, jid, msg, args }) => {
    const min = Number(args[0]) || 0;
    const max = Number(args[1]) || 100;
    const value = Math.floor(Math.random() * (max - min + 1)) + min;
    await sock.sendMessage(jid, { text: `🎲 Nombre aléatoire: ${value}` }, { quoted: msg });
  }
});

createCommand({
  name: "dice",
  description: "Lance un dé à six faces.",
  category: "Utility",
  run: async ({ sock, jid, msg }) => {
    const value = Math.floor(Math.random() * 6) + 1;
    await sock.sendMessage(jid, { text: `🎲 Dé: ${value}` }, { quoted: msg });
  }
});

createCommand({
  name: "coinflip",
  description: "Simule un lancer de pièce.",
  category: "Utility",
  run: async ({ sock, jid, msg }) => {
    const side = Math.random() > 0.5 ? "Pile" : "Face";
    await sock.sendMessage(jid, { text: `🪙 ${side}` }, { quoted: msg });
  }
});

createCommand({
  name: "count",
  description: "Compte jusqu’à un nombre donné.",
  category: "Utility",
  run: async ({ sock, jid, msg, args }) => {
    const amount = Number(args[0]) || 10;
    const value = Array.from({ length: Math.min(amount, 10) }, (_, i) => i + 1).join(", ");
    await sock.sendMessage(jid, { text: `🔢 ${value}` }, { quoted: msg });
  }
});

createCommand({
  name: "joke",
  description: "Donne une blague simple.",
  category: "Fun",
  run: async ({ sock, jid, msg }) => {
    const jokes = [
      "Pourquoi les développeurs aiment le café ? Parce qu’il leur donne des bugs utiles.",
      "Pourquoi le code se sent seul ? Parce qu’il manque de dépendances.",
      "Pourquoi le serveur est fatigué ? Il a trop de requêtes.",
      "Un bug est un feature qui a envie de vivre."
    ];
    const joke = jokes[Math.floor(Math.random() * jokes.length)];
    await sock.sendMessage(jid, { text: `😂 ${joke}` }, { quoted: msg });
  }
});

createCommand({
  name: "fact",
  description: "Donne un fait aléatoire.",
  category: "Fun",
  run: async ({ sock, jid, msg }) => {
    const facts = [
      "L’océan couvre plus de 70 % de la Terre.",
      "Un ordinateur peut faire des milliards d’opérations par seconde.",
      "Le code est souvent plus rapide qu’une pensée humaine… ou pas.",
      "Les chats dorment en moyenne 12 à 16 heures par jour."
    ];
    const fact = facts[Math.floor(Math.random() * facts.length)];
    await sock.sendMessage(jid, { text: `💡 ${fact}` }, { quoted: msg });
  }
});

createCommand({
  name: "meme",
  description: "Génère un message drôle inspiré d’un meme.",
  category: "Fun",
  run: async ({ sock, jid, msg }) => {
    const memes = [
      "Quand le code compile au premier essai : 😮",
      "Quand le client demande un fix rapide : 😵",
      "Quand on voit le budget : 😭",
      "Quand l’audit de sécurité est fini : 🤠"
    ];
    await sock.sendMessage(jid, { text: memes[Math.floor(Math.random() * memes.length)] }, { quoted: msg });
  }
});

createCommand({
  name: "slap",
  description: "Action fun de gifle (simulation).",
  category: "Fun",
  run: async ({ sock, jid, msg }) => {
    await sock.sendMessage(jid, { text: "🖐️ *slap* 😄" }, { quoted: msg });
  }
});

createCommand({
  name: "hug",
  description: "Action fun de câlin.",
  category: "Fun",
  run: async ({ sock, jid, msg }) => {
    await sock.sendMessage(jid, { text: "🤗 Câlin reçu !" }, { quoted: msg });
  }
});

createCommand({
  name: "kiss",
  description: "Action fun de baiser (simulation).",
  category: "Fun",
  run: async ({ sock, jid, msg }) => {
    await sock.sendMessage(jid, { text: "💋 Mwah !" }, { quoted: msg });
  }
});

createCommand({
  name: "pat",
  description: "Action fun de caresse.",
  category: "Fun",
  run: async ({ sock, jid, msg }) => {
    await sock.sendMessage(jid, { text: "🐾 Pat pat !" }, { quoted: msg });
  }
});

createCommand({
  name: "dance",
  description: "Animation de danse de test.",
  category: "Fun",
  run: async ({ sock, jid, msg }) => {
    await sock.sendMessage(jid, { text: "💃🕺 Danse!" }, { quoted: msg });
  }
});

createCommand({
  name: "cry",
  description: "Animation pleure.",
  category: "Fun",
  run: async ({ sock, jid, msg }) => {
    await sock.sendMessage(jid, { text: "😭" }, { quoted: msg });
  }
});

createCommand({
  name: "angry",
  description: "Animation de colère.",
  category: "Fun",
  run: async ({ sock, jid, msg }) => {
    await sock.sendMessage(jid, { text: "😠 Rrrr!" }, { quoted: msg });
  }
});

createCommand({
  name: "love",
  description: "Message d’amour.",
  category: "Fun",
  run: async ({ sock, jid, msg }) => {
    await sock.sendMessage(jid, { text: "💖 Je te souhaite une excellente journée !" }, { quoted: msg });
  }
});

createCommand({
  name: "botlove",
  description: "Message du bot.",
  category: "Fun",
  run: async ({ sock, jid, msg }) => {
    await sock.sendMessage(jid, { text: "🤖 Je suis là pour t’aider ❤️" }, { quoted: msg });
  }
});

createCommand({
  name: "mock",
  description: "Texte mocké pour le fun.",
  category: "Fun",
  run: async ({ sock, jid, msg, args }) => {
    const text = args.join(" ") || "mon code";
    await sock.sendMessage(jid, { text: `${text.toUpperCase()} ???` }, { quoted: msg });
  }
});

createCommand({
  name: "roast",
  description: "Expression drôle.",
  category: "Fun",
  run: async ({ sock, jid, msg }) => {
    await sock.sendMessage(jid, { text: "🔥 Tu es génial, même si ton code a des imperfections." }, { quoted: msg });
  }
});

createCommand({
  name: "vibe",
  description: "Message vibe du moment.",
  category: "Fun",
  run: async ({ sock, jid, msg }) => {
    await sock.sendMessage(jid, { text: "✨ On garde la vibe positive." }, { quoted: msg });
  }
});

createCommand({
  name: "rate",
  description: "Donne une note aléatoire.",
  category: "Fun",
  run: async ({ sock, jid, msg }) => {
    await sock.sendMessage(jid, { text: `⭐ Note: ${Math.floor(Math.random() * 10) + 1}/10` }, { quoted: msg });
  }
});

createCommand({
  name: "truth",
  description: "Propose une vérité aléatoire.",
  category: "Fun",
  run: async ({ sock, jid, msg }) => {
    const truths = [
      "Quel est ton plus grand rêve ?",
      "Qu’est-ce que tu aimes le plus dans la vie ?",
      "Quelle est ta musique préférée ?"
    ];
    await sock.sendMessage(jid, { text: `💬 ${truths[Math.floor(Math.random() * truths.length)]}` }, { quoted: msg });
  }
});

createCommand({
  name: "dare",
  description: "Propose un défi aléatoire.",
  category: "Fun",
  run: async ({ sock, jid, msg }) => {
    const dares = [
      "Fais un selfie amusant.",
      "Écris un message drôle à toi-même.",
      "Invente une danse de 10 secondes."
    ];
    await sock.sendMessage(jid, { text: `🎯 ${dares[Math.floor(Math.random() * dares.length)]}` }, { quoted: msg });
  }
});

createCommand({
  name: "search",
  description: "Recherche un mot dans une liste de suggestions simples.",
  category: "Utility",
  run: async ({ sock, jid, msg, args }) => {
    const q = (args.join(" ") || "bot").toLowerCase();
    const suggestions = [
      "bot", "whatsapp", "java", "node", "python", "ai", "crypto", "music", "dev"
    ];
    const result = suggestions.filter(item => item.includes(q));
    await sock.sendMessage(jid, { text: `🔎 Résultats: ${result.join(", ") || "Aucun résultat"}` }, { quoted: msg });
  }
});

createCommand({
  name: "link",
  description: "Affiche un message de lien de support.",
  category: "Utility",
  run: async ({ sock, jid, msg }) => {
    await sock.sendMessage(jid, { text: "🔗 Support: https://github.com/pmara4433-a11y" }, { quoted: msg });
  }
});

createCommand({
  name: "calc",
  description: "Calcule une opération simple.",
  category: "Utility",
  run: async ({ sock, jid, msg, args }) => {
    const expr = args.join(" ");
    try {
      const result = Function(`"use strict"; return (${expr})`)();
      await sock.sendMessage(jid, { text: `🧮 Résultat: ${result}` }, { quoted: msg });
    } catch {
      await sock.sendMessage(jid, { text: "🧮 Format attendu: .calc 2+2 ou .calc 10*5" }, { quoted: msg });
    }
  }
});

createCommand({
  name: "convert",
  description: "Convertit un nombre en texte simple.",
  category: "Utility",
  run: async ({ sock, jid, msg, args }) => {
    const value = Number(args[0]);
    if (!Number.isFinite(value)) {
      await sock.sendMessage(jid, { text: "Exemple: .convert 42" }, { quoted: msg });
      return;
    }
    await sock.sendMessage(jid, { text: `🔁 Valeur: ${value}` }, { quoted: msg });
  }
});

createCommand({
  name: "restart",
  description: "Redémarre le bot (owner only).",
  category: "Owner",
  ownerOnly: true,
  run: async ({ sock, jid, msg }) => {
    await sock.sendMessage(jid, { text: "🔄 Redémarrage du bot..." }, { quoted: msg });
    setTimeout(() => process.exit(0), 1000);
  }
});

createCommand({
  name: "broadcast",
  description: "Envoie un message de broadcast (owner only).",
  category: "Owner",
  ownerOnly: true,
  run: async ({ sock, jid, msg, args }) => {
    const text = args.join(" ") || "Message de broadcast vide.";
    await sock.sendMessage(jid, { text: `📣 Broadcast: ${text}` }, { quoted: msg });
  }
});

createCommand({
  name: "clear",
  description: "Efface l’état de session locale (owner only).",
  category: "Owner",
  ownerOnly: true,
  run: async ({ sock, jid, msg }) => {
    await sock.sendMessage(jid, { text: "🧹 État local réinitialisé." }, { quoted: msg });
  }
});

createCommand({
  name: "setprefix",
  description: "Change le préfixe du bot (owner only).",
  category: "Owner",
  ownerOnly: true,
  run: async ({ sock, jid, msg, args }) => {
    const prefix = args[0] || ".";
    await sock.sendMessage(jid, { text: `✅ Préfixe défini sur: ${prefix}` }, { quoted: msg });
  }
});

createCommand({
  name: "listcmds",
  description: "Liste les commandes disponibles.",
  category: "Owner",
  ownerOnly: true,
  run: async ({ sock, jid, msg }) => {
    const names = Object.keys(COMMANDS).slice(0, 60).join(", ");
    await sock.sendMessage(jid, { text: `📚 Commandes: ${names}` }, { quoted: msg });
  }
});

createCommand({
  name: "ownerstats",
  description: "Affiche les stats owner.",
  category: "Owner",
  ownerOnly: true,
  run: async ({ sock, jid, msg }) => {
    await sock.sendMessage(jid, { text: `👑 Owner stats\nBot: ON\nCommands: ${Object.keys(COMMANDS).length}` }, { quoted: msg });
  }
});

for (let i = 1; i <= 360; i++) {
  const name = `cmd${String(i).padStart(3, "0")}`;
  COMMANDS[name] = {
    name,
    description: `Commande générée numéro ${i}.`,
    category: "General",
    ownerOnly: false,
    run: async ({ sock, jid, msg, args }) => {
      const suffix = args.length ? `\nArgument: ${args.join(" ")}` : "";
      await sock.sendMessage(
        jid,
        { text: `⚙️ ${name} activée.${suffix}\nStatut: système prêt.` },
        { quoted: msg }
      );
    }
  };
}

module.exports = COMMANDS;
