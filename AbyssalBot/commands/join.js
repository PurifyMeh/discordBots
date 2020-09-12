module.exports = {
    name: 'join',
    description: 'Setup join channel and roles',
    async execute(Discord, message, args, prefix, command, joinMessage, join, memberRole, footer) {
        if (message.member.hasPermission('KICK_MEMBERS')) {
            if (!args.length) {
                if (join) {
                    join = false;
                    message.channel.send("Turned off join messages <@" + message.author + "> ! For more options, `" + prefix + command + " [ set | view | role ]`");
                } else if (!join) {
                    join = true;
                    message.channel.send("Turned on join messages <@" + message.author + "> ! For more options, `" + prefix + command + " [ set | view | role ]`");
                }
            } else if (args[0] === "set") {
                if (args[1] === undefined) {
                    message.channel.send("Invalid arguments <@" + message.author + "> ! Usage is `" + prefix + command + " set [ message ]`");
                } else {
                    args.shift();
                    joinMessage = args.join(" ");
                    message.channel.send("Succesfully changed join message to `" + joinMessage +"` <@" + message.author + "> !");
                    const joinEmbed = new Discord.MessageEmbed();
                    joinEmbed.setTitle("New Member Alert!");
                    joinEmbed.setDescription(`${joinMessage}, ${message.author}!`);
                    const preview = message.channel.send("This is a preview of the join message, it will be deleted in 5 seconds. \n", joinEmbed);
                    (await preview).delete({timeout: 5000});
                }
            } else if (args[0] === "view") {
                const joinEmbed = new Discord.MessageEmbed();
                joinEmbed.setTitle("New Member Alert!");
                joinEmbed.setDescription(`${joinMessage}, ${message.author}!`);
                joinEmbed.setFooter(footer);
                const preview = message.channel.send("This is a preview of the join message, it will be deleted in 5 seconds. \n", joinEmbed);
                (await message).delete({timeout: 5000});
                (await preview).delete({timeout: 5000});
            } else if (args[0] === "role") {
                if (args[1] === undefined) {
                    const rl = message.member.guild.roles.cache.find(role => role.id === memberRole);
                    if (!rl) {
                        message.channel.send("Join role is not set <@" + message.author + "> ! To set a join role, `" + prefix + commands[6] + " role [ @role ]`");
                    } else {
                        const joinEmbed = new Discord.MessageEmbed();
                        joinEmbed.setDescription("Current join role is set to <@&" + rl.id + ">");
                        joinEmbed.setFooter(footer);
                        message.channel.send(joinEmbed);
                    }
                }
                else if (args[1].length === 22) {
                    memberRole = args[1].slice(3,21);
                    const rl = message.member.guild.roles.cache.find(role => role.id === memberRole);
                    message.channel.send("Successfully set <@&" + rl.id + "> as join role <@" + message.author + "> !");
                } else {
                    message.channel.send("Invalid role <@" + message.author + "> ! Please try again!");
                }
            } else {
                message.channel.send("Invalid arguments <@" + message.author + "> ! Usage is `" + prefix + command + " [ set | view | role ]`");
            }
            return {
                join,
                joinMessage,
                memberRole
            }
        } else {
            message.channel.send("You don't have permission to setup join messages " + getUserMention(message.author) + " !");
        }
    }
}