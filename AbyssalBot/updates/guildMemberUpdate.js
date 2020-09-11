const { footer } = require('../config.json');

module.exports = {
    name: 'guildMemberUpdate',
    execute(Discord, client, oldMember, newMember, updatesChannel) {
        if (oldMember.nickname === newMember.nickname) {
            if (oldMember.roles === newMember.roles) return;
            const ch = client.channels.cache.get(updatesChannel);
            if (!ch) return;
            const change = new Discord.MessageEmbed();
            var roles = newMember.roles.cache.array();
            roles.pop();
            if (roles[0] === undefined) roles[0] = "None";
            change.setColor('#ffa500');
            change.addFields(
                { name: "Updated roles for member", value: ("<@" + oldMember.id + ">") , inline: false },
                { name: 'Roles', value: roles, inline: false },
                { name: 'Member ID', value: oldMember.id, inline: false }
            );
            change.setFooter(footer);
            ch.send(change);
        } else {
            if (oldMember.nickname === null) oldMember.nickname = oldMember.displayName;
            if (newMember.nickname === null) newMember.nickname = newMember.displayName;
            const ch = client.channels.cache.get(updatesChannel);
            if (!ch) return;
            const change = new Discord.MessageEmbed();
            change.setColor('#ffa500');
            change.addFields(
                { name: "A user's nickname was changed!", value: ("<@" + oldMember.id + ">"), inline: false},
                { name: 'Old Name', value: oldMember.nickname, inline: true },
                { name: 'New Name', value: newMember.nickname, inline: true }
            );
            change.setFooter(footer);
            ch.send(change);
        }
    }
}