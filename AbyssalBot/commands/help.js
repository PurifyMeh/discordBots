module.exports = {
    name: 'help',
    description: 'Display list of commands',
    execute(client, message, prefix, commands, commandsDesc) {
        var showHelp = "";
		for (var i = 0; i < commands.length; i++) {
			showHelp += ("`" + commands[i] + "` - " + commandsDesc[i] + "\n");
		}
		message.reply("here's the available commands from <@" + client.user.id + ">\nPrefix = `" + prefix + "`\n" + showHelp);
    }
}