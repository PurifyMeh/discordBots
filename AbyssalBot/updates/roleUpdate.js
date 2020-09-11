const { footer } = require('../config.json');

module.exports = {
    name: 'roleUpdate',
    execute(Discord, client, oldRole, newRole, updatesChannel) {
        const ch = client.channels.cache.get(updatesChannel);
        if (!ch) return;
        const change = new Discord.MessageEmbed();
        change.setColor('#ffa500');
        change.setFooter(footer);
        if (oldRole.name !== newRole.name) {
            change.addFields(
                { name: ("A role was updated!"), value: ("<@&"+oldRole.id+">"), inline: false},
                { name: 'Old Name', value: oldRole.name, inline: false },
                { name: 'New Name', value: newRole.name, inline: false },
                { name: 'Role ID', value: oldRole.id, inline: true }
            );
            ch.send(change);
        } else if (oldRole.permissions.bitfield !== newRole.permissions.bitfield) {
            change.addFields(
                { name: ("Role permissions were updated!"), value: ("<@&"+oldRole.id+">"), inline: false},
                { name: 'Role ID', value: oldRole.id, inline: true }
            );
            ch.send(change);
        }
    }
}