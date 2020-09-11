const { footer } = require('../config.json');

module.exports = {
    name: 'roleDelete',
    execute(Discord, client, role, updatesChannel) {
        const ch = client.channels.cache.get(updatesChannel);
        if (!ch) return;
        const change = new Discord.MessageEmbed();
        change.setColor('#ff0000');
        change.addFields(
            { name: ("A role was deleted!"), value: ("@"+role.name), inline: false},
            { name: 'Role ID', value: role.id, inline: true }
        );
        change.setFooter(footer);
        ch.send(change);
    }
}