module.exports = {
    name: 'images',
    description: 'Toggle reaction images',
    execute(message, openImage) {
        if (message.member.hasPermission('KICK_MEMBERS')) {
            if (!openImage) {
                openImage = true;
                message.channel.send("I have enabled image reactions <@" + message.author + "> !");
            } else if (openImage) { 
                openImage = false;
                message.channel.send("I have disabled image reactions <@" + message.author + "> !");
            }
            return {
                openImage
            }
        } else {
            message.channel.send("You don't have permissions to toggle reactions <@" + message.author + "> !");
        }
    }
}