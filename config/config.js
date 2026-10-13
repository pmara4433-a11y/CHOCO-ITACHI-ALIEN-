const path = require("path");

const config = {
  bot: {
    name: "CHOCO-ITACHI-ALIEN",
    version: "1.0.0",
    prefix: ".",
    language: "fr",
    mode: "public"
  },
  paths: {
    root: path.join(__dirname, ".."),
    commands: path.join(__dirname, "..", "commands"),
    lib: path.join(__dirname, "..", "lib"),
    data: path.join(__dirname, "..", "data"),
    media: path.join(__dirname, "..", "media"),
    sessions: path.join(__dirname, "..", "session")
  },
  limits: {
    maxDownloadSize: 50 * 1024 * 1024,
    commandTimeout: 120000
  },
  whatsapp: {
    usePairingCode: true,
    printQRInTerminal: false,
    syncFullHistory: false
  }
};

module.exports = config;
