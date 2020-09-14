const { footer } = require('../config.json');

module.exports = {
    name: 'guildBanAdd',
    async execute(Discord, client, guild, user, updatesChannel) {
        const ch = client.channels.cache.get(updatesChannel);
        if (!ch) return;
        const change = new Discord.MessageEmbed();
        change.setColor('#ff0000');
        change.addFields(
            { name: ("Member @" + user.tag + " was banned!"), value: (await guild.fetchBan(user)).reason, inline: false},
            { name: 'Member ID', value: user.id, inline: true }
        );
        change.setFooter(footer);
        ch.send(change);
    }
}