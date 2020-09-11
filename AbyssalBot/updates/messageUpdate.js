const { footer } = require('../config.json');

module.exports = {
    name: 'messageUpdate',
    async execute(Discord, client, oldMessage, newMessage, updatesChannel, oneWord, threeWord) {
        if (oldMessage.content === newMessage.content) return;
        if (oldMessage.channel.name.indexOf(oneWord) !== -1) return;
        if (oldMessage.channel.name.indexOf(threeWord) !== -1) return;
        if (oldMessage.author.bot) return;
        const ch = client.channels.cache.get(updatesChannel);
        if (!ch) return;
        const change = new Discord.MessageEmbed();
        try {
            change.setColor('#ffa500');
            change.addFields(
                { name: "A message was edited!", value: oldMessage.content, inline: false },
                { name: "Edited message", value: newMessage.content, inline: false },
                { name: 'From user', value: ("<@" + newMessage.author + ">"), inline: true },
                { name: 'From channel', value: ("<#"+oldMessage.channel.id+">"), inline: true },
                { name: 'Message ID', value: newMessage.id, inline: false }
            );
            change.setFooter(footer);
            ch.send(change);
        } catch(error) {
            console.log("Something wrong happened when logging an edited message!", error);
        }
    }
}