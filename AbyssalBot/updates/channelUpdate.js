const { footer } = require('../config.json');

module.exports = {
    name: 'channelUpdate',
    execute(Discord, client, oldChannel, newChannel, updatesChannel) {
        if (oldChannel.name === newChannel.name) return;
        const ch = client.channels.cache.get(updatesChannel);
        if (!ch) return;
        const change = new Discord.MessageEmbed();
        change.setColor('#ffa500');
        change.addFields(
            { name: ("A `" + oldChannel.type +" channel` was edited!"), value: ("<#" + oldChannel.id + ">"), inline: false},
            { name: 'Old Name', value: oldChannel.name, inline: true },
            { name: 'New Name', value: newChannel.name, inline: true }
        );
        change.setFooter(footer);
        ch.send(change);
    }
}