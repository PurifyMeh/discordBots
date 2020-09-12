module.exports = {
    name: 'prefix',
    description: 'Change prefix for commands',
    execute(client, message, args, command, prefix, defaultPrefix, activity, status) {
        if (!args.length) {
            message.reply("current prefix is `" + prefix + "`\nTo change prefix, do `" + prefix + command + " set <prefix>`");
        } else if (args[0] === "set") {
            if (message.member.hasPermission('KICK_MEMBERS')) {
                if (args[1] === undefined) {
                    message.reply("to change prefix, do `" + prefix + command + " set <prefix>`");
                } else {
                    if (args[1].length <= 2 && args[1].length > 0) {
                        prefix = args[1];
                        message.reply("current prefix is now set to `" + prefix + "`\nTo reset the prefix, type `" + prefix + command + " reset`.");
                        activity = (status + prefix + 'help');
                        client.user.setActivity(activity, { type: 'WATCHING'});
                    } else {
                        message.channel.send("Prefix `" + args[1] + "` must be 2 or less characters! Please try again <@" + message.author + "> !");
                    }
                }
            }
        } else if (args[0] === "reset") {
            if (message.member.hasPermission('KICK_MEMBERS')) {
                prefix = defaultPrefix;
                message.reply("current prefix has been reset to `" + prefix + "`");
                activity = (status + prefix + 'help');
                client.user.setActivity(activity, { type: 'WATCHING'});
            }
        } else {
            message.channel.send("Invalid argument <@" + message.author + "> ! Usage is `" + prefix + command + " [ set | reset ]`");
        }
        return {
            prefix,
            activity,
            status
        }
    }
}