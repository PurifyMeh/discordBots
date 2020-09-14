module.exports = {
    name: 'membercount',
    description: 'Displays member count in discord',
    async execute(client, message, memberCountChannel) {
        if (message.member.hasPermission('KICK_MEMBERS')) {
            if (memberCountChannel === undefined) {
                const ch = await message.member.guild.channels.create(('USER COUNT: ' + message.member.guild.memberCount), {
                    type: 'voice',
                    permissionOverwrites: [
                        {
                            id: message.member.guild.roles.everyone,
                            deny: ['CONNECT'],
                        },
                        {
                            id: client.user.id,
                            allow: ['MANAGE_CHANNELS'],
                        }
                    ],
                });
                message.channel.send("Created a member count channel " + getUserMention(message.author) + " !");
                return {
                    ch
                }
            } else {
                message.channel.send("The server currently has " + message.member.guild.memberCount + " members " + getUserMention(message.author) + " !");
            }
        } else {
            message.channel.send("You don't have permissions to setup member count " + getUserMention(message.author) + " !");
        }
    }
}

function getUserMention(author) {
	return ("<@" + author.id + ">");
}