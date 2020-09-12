module.exports = {
    name: 'auto',
    description: 'Toggle announcements and suggestions',
    execute(message, auto) {
        if (message.member.hasPermission('KICK_MEMBERS')) {
            if (auto) {
                auto = false;
                message.channel.send("Turned off auto-embeds <@" + message.author + "> !");
            } else if (!auto) {
                auto = true;
                message.channel.send("Turned on auto-embeds <@" + message.author + "> !");
            }
            return {
                auto
            }
        } else {
            message.channel.send("You don't have permission to toggle embeds <@" + message.author + "> !");
        }
    }
}