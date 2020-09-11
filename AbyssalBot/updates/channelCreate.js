const { footer } = require('../config.json');

module.exports = {
    name: 'channelCreate',
    async execute(Discord, client, channel, updatesChannel) {
        const ch = client.channels.cache.get(updatesChannel);
        if (!ch) return;
        const change = new Discord.MessageEmbed();
        change.setColor('#00ff00');
        change.addFields(
            { name: ("A `" + channel.type +" channel` was created!"), value: ("<#" + channel.id + ">"), inline: false},
            { name: "Channel Name", value: channel.name, inline: true},
            { name: "Channel ID", value: channel.id, inline: true}
        );
        change.setFooter(footer);
        ch.send(change);
    }
}