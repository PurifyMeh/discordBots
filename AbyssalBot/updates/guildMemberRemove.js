const { footer } = require('../config.json');

module.exports = {
    name: 'guildMemberRemove',
    async execute(Discord, client, member, updatesChannel, memberCountChannel) {
        const ch = client.channels.cache.get(updatesChannel);
        if (!ch) return;
        const change = new Discord.MessageEmbed();
        change.setDescription(`Member ${member} has left the discord!`);
        change.setFooter(footer);
        ch.send(change);
    }
}