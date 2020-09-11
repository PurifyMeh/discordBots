const { footer } = require('../config.json');

module.exports = {
    name: 'guildBanRemove',
    async execute(Discord, client, guild, user, updatesChannel) {
        const ch = client.channels.cache.get(updatesChannel);
        if (!ch) return;
        var reason = (await guild.fetchBan(user)).reason;
        if (reason === undefined) reason = "NULL";
        const change = new Discord.MessageEmbed();
        change.setColor('#00ff00');
        change.addFields(
            { name: ("Member @" + user.tag + " was unbanned from the discord!"), value: reason, inline: true},
            { name: 'Member ID', value: user.id, inline: true }
        );
        change.setFooter(footer);
        ch.send(change);
    }
}