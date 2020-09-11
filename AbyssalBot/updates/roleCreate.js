const { footer } = require('../config.json');

module.exports = {
    name: 'roleCreate',
    execute(Discord, client, role, updatesChannel) {
        const ch = client.channels.cache.get(updatesChannel);
        if (!ch) return;
        const change = new Discord.MessageEmbed();
        change.setColor('#00ff00');
        change.addFields(
            { name: ("A role was created!"), value: ("<@&"+role.id+">"), inline: false},
            { name: 'Role Name', value: role.name, inline: false },
            { name: 'Role ID', value: role.id, inline: true }
        );
        change.setFooter(footer);
        ch.send(change);
    }
}