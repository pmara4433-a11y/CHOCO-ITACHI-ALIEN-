module.exports = function loadCommands() {
  const commands = require("../commands/index.js");
  return new Map(Object.entries(commands));
};
