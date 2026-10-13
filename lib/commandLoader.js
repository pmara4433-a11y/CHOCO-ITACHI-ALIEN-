const commands = require("../commands/index.js");

module.exports = function loadCommands() {
  return new Map(Object.entries(commands));
};
