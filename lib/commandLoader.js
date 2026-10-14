const fs = require('fs');
const path = require('path');

function loadCommands() {
    const commands = new Map();
    const commandsPath = path.join(__dirname, '..', 'commands');
    if (!fs.existsSync(commandsPath)) return commands;
    
    const files = fs.readdirSync(commandsPath).filter(f => f.endsWith('.js'));
    for (const file of files) {
        try {
            const cmdPath = path.join(commandsPath, file);
            delete require.cache[require.resolve(cmdPath)];
            const cmd = require(cmdPath);
            if (cmd.name) commands.set(cmd.name, cmd);
        } catch (e) {
            console.log(`[SKIP] Commande buguée: ${file} - ${e.message}`);
        }
    }
    return commands;
}
module.exports = { loadCommands };