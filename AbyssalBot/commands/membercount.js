module.exports = {
    name: 'membercount',
    description: 'Displays member count in discord',
    async execute(client, message, memberCountChannel) {
        if (message.member.hasPermission('KICK_MEMBERS')) {
            if (memberCountChannel === undefined) {
                memberCountChannel = await message.member.guild.channels.create(('USER COUNT: ' + message.member.guild.memberCount), {
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
            } else {
                message.channel.send("Channel already exists " + getUserMention(message.author) + " !");
            }
        } else {
            message.channel.send("You don't have permissions to setup member count " + getUserMention(message.author) + " !");
        }
        return {
            memberCountChannel
        }
    }
}

function getUserMention(author) {
	return ("<@" + author.id + ">");
}