const { footer } = require('../config.json');

module.exports = {
    name: 'channelDelete',
    execute(Discord, client, channel, updatesChannel) {
        const ch = client.channels.cache.get(updatesChannel);
        if (!ch) return;
        const change = new Discord.MessageEmbed();
        change.setColor('#ff0000');
        change.addFields(
            { name: ("A `" + channel.type +" channel` was deleted!"), value: ("#" + channel.name), inline: false},
            { name: "Channel ID", value: channel.id, inline: true}
        );
        change.setFooter(footer);
        ch.send(change);
    }
}