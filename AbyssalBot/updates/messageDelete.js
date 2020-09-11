const { footer } = require('../config.json');

module.exports = {
    name: 'messageDelete',
    async execute(Discord, client, message, updatesChannel, oneWord, threeWord, prefix) {
        if (message.partial) {
            try {
                await message.fetch();
            } catch (error) {
                console.log("Something wrong while fetching uncached messages!", error);
            }
        }
        if (message.channel.name.indexOf("suggestion") !== -1) return;
        if (message.channel.name.indexOf("announcement") !== -1) return;
        if (message.channel.name.indexOf("update") !== -1) return;
        if (message.channel.name.indexOf(oneWord) !== -1) return;
        if (message.channel.name.indexOf(threeWord) !== -1) return;
        if (message.author.bot) return;
        if (message.content.startsWith(prefix)) return;
        const ch = client.channels.cache.get(updatesChannel);
        if (!ch) return;
        if (message.content === undefined) {
            message.content = "Embedded message";
            message.id = "NULL";
        }
        const change = new Discord.MessageEmbed();
        try {
            change.setColor('#ff0000');
            change.addFields(
                { name: "A message was deleted!", value: message.content, inline: false},
                { name: 'From user', value: ("<@" + message.author.id + ">"), inline: true },
                { name: 'Under channel', value: ("<#" + message.channel.id + ">"), inline: true },
                { name: 'Message ID', value: message.id, inline: true }
            );
            change.setFooter(footer);
            ch.send(change);
        } catch(error) {
            console.log("Something wrong happened when logging a deleted message!", error);
        }
    }
}