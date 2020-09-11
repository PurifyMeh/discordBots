const { footer } = require('../config.json');

module.exports = {
    name: 'guildMemberAdd',
    execute(Discord, client, member, updatesChannel, joinMessage, memberRole) {
        if (join) {
            const channel = client.channels.cache.get(member.guild.systemChannelID);
            if (!channel) return;
            const joinEmbed = new Discord.MessageEmbed();
            joinEmbed.setTitle("New Member Alert!");
            joinEmbed.setDescription(`${joinMessage}, ${member}!`);
            channel.send(joinEmbed);
        }
        const ch = client.channels.cache.get(updatesChannel);
        if (!ch) return;
        const change = new Discord.MessageEmbed();
        change.setDescription(`Member ${member} has joined the discord!`);
        change.setFooter(footer);
        ch.send(change);
    
        const role = member.guild.roles.cache.find(role => role.id === memberRole);
        if (!role) return;
        member.roles.add(role);
    }
}