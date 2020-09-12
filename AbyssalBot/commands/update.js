module.exports = {
    name: 'update',
    description: 'Setup updates channel',
    execute(client, message, args, commands, prefix, updatesChannel) {
        if (message.member.hasPermission('KICK_MEMBERS')) {
            if (!args.length) {
                message.reply("command usage is `" + prefix + commands[6] + " set [ #channel ]`");
            } else if (args[0] === "set") {
                if (args[1].length === 21) {
                    updatesChannel = args[1].slice(2, 20);
                    const channel = client.channels.cache.get(updatesChannel);
                    if (!channel) {
                        message.channel.send("Unknown channel! Please try again <@" + message.author + "> !");
                        return;
                    }
                    message.channel.send("Successfuly set updates channel to <#" + channel.id + "> , <@" + message.author + "> !");
                } else {
                    message.channel.send("Invalid channel <@" + message.author + "> ! Usage is `" + prefix + commands[6] + " set [ #channel ]`");
                }
            } else {
                message.channel.send("Invalid arguments <@" + message.author + "> ! Usage is `" + prefix + commands[6] + " set [ #channel ]`");
            }
            return {
                updatesChannel
            }
        } else {
            message.channel.send("You don't have permission to set updates channel <@" + message.author + "> !");
        }
    }
}