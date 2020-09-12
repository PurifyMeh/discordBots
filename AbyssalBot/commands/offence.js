module.exports = {
    name: 'offence',
    description: 'Setup offence-logger for litebans',
    execute(client, message, args, offenceChannel, prefix, command) {
        if (message.member.hasPermission('KICK_MEMBERS')) {
            if (!args.length) {
                message.channel.send("Invalid arguments <@" + message.author + "> ! `" + prefix + commands[2] + " [ #channel-name ]`");
            } else {
                if (args[0].length === 21) {
                    offenceChannel = args[0].slice(2, 20);
                    const channel = client.channels.cache.get(offenceChannel);
                    if (!channel) {
                        message.channel.send("Unknown channel! Please try again <@" + message.author + "> !");
                        return;
                    }
                    message.channel.send("Successfuly set offence channel to <#" + channel.id + ">, <@" + message.author + "> !");
                } else {
                    message.channel.send("Invalid channel <@" + message.author + "> ! Usage is `" + prefix + command + " [ #channel-name ]`");
                }
            }
            return {
                offenceChannel
            }
        } else {
            message.channel.send("You don't have permissions to setup offence-logger <@" + message.author + "> !");
        }
    }
}