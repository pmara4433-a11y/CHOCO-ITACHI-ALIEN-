const fs = require('fs');
const path = require('path');

function loadCommands() {
    const commands = new Map();
    const commandsPath = path.join(__dirname, '..', 'commands');
    if (!fs.existsSync(commandsPath)) {
        console.log('No commands folder');
        return commands;
    }
    const files = fs.readdirSync(commandsPath).filter(f => f.endsWith('.js'));
    console.log(`Found ${files.length} commands`);
    for (const file of files) {
        try {
            const cmdPath = path.join(commandsPath, file);
            delete require.cache[require.resolve(cmdPath)];
            const cmd = require(cmdPath);
            if (cmd.name) {
                commands.set(cmd.name, cmd);
            }
        } catch (e) {
            console.log(`[SKIP] ${file} bug: ${e.message}`);
        }
    }
    return commands;
}

// Supporte les deux: require()() et require().loadCommands()
module.exports = loadCommands;
module.exports.loadCommands = loadCommands;