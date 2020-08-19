const Discord = require('discord.js');
const client = new Discord.Client();
const { token, version } = require('./config.json');
const { Member } = require('discord.io');
const footer = '---------------------------------------------\nbot by dest™#9640';
const mysql = require('mysql');
const MojangAPI = require('mojang-api');

var con = mysql.createConnection({
	host: "ip.address.insert.here",
	user: "username",
    password: "password",
    database: "database"
});

var globalAnnouncement = '0';
var prefix = '-';
var openImage = true;
var suggestions = ['743046766739587113', '743131550467620906'];
var blacklistedWords = ["nigga", "nigger", ":naziflag:", ":nazism:"];
var ticketnum = 0;
var blacklist = true;
var namehist = [];
var uuidhist = [];

con.connect(function(err) {
	if (err) throw err;
    console.log("Connected to mysql database!");
    con.query("SELECT id FROM litebans_bans", function (err, res) {
        if (err) throw err;
        n = res.length;
    });
});

client.once('ready', () => {
    console.log('ready to be used');
    console.log(`version ${version}`);
	client.user.setActivity('play.abyssal.ml', { type: 'PLAYING'});
});

client.login(token);

client.on('message', async message => {
    con.query("SELECT uuid, name FROM litebans_history", function (err, result) {
        var i;
        for (i = 0; i < result.length; i ++) {
            uuidhist.push(result[i].uuid);
            namehist.push(result[i].name);
        }
    });
    con.query("SELECT * FROM litebans_bans", function (err, res) {
        if (res.length > n) {
            var banner = res[res.length-1].banned_by_name;
            var reason = res[res.length-1].reason;
            var uuid = res[res.length-1].uuid;
            var k;
            for (k = 0; k < uuidhist.length; k++) {
                if (uuid == uuidhist[k]) {
                    const banEmbed = new Discord.MessageEmbed();
                    banEmbed.setColor('#ff0000');
                	banEmbed.setAuthor(`${banner}`);
                	banEmbed.setTitle(`Banned ${namehist[k]} for:`);
                	banEmbed.setDescription(`${reason}`);
                    client.channels.cache.get('743046573432242207').send(banEmbed);
                }
            }
            n = res.length;
        }
        uuidhist = [];
        namehist = [];
    });
	msg = message.content.toLowerCase();
	if (blacklist) {
	    var b;
	    for (b = 0; b < blacklistedWords.length; b++) {
        	if (msg.includes(blacklistedWords[b])) {
        	    message.delete();
        	}
	    }
	}
	if (msg.includes("<@!743088157796597830>")) {
	    message.channel.send('dont ping me, you imbecile');
	}
	if (!message.content.startsWith(prefix) || message.author.bot) {
		if ((msg == 'no') || (msg == 'perhaps') || (msg == 'maybe') || (msg == 'well yes but actually no') || 
		(msg == 'well yes but no') || (msg == 'f') || (msg == 'e') || (msg == 'bruh') || (msg == 'ee') || 
		(msg == 'eee') || (msg == 'no u') || (msg == 'nou') || (msg == 'oof') || (msg == 'its time') || 
		(msg == 'its time to stop') || (msg == 'your welcome') || (msg == 'youre welcome')) {
            if (openImage === true) {
                if (msg == 'no') {
                    message.channel.send(`${message.author}: https://i.kym-cdn.com/photos/images/original/001/483/348/bdd.jpg`);
                } else if ((msg == 'perhaps') || (msg == 'maybe')) {
                    message.channel.send(`${message.author}: https://i.kym-cdn.com/photos/images/original/001/398/111/d5a`);
                } else if ((msg == 'well yes but actually no') || (msg == 'well yes but no')) {
                    message.channel.send(`${message.author}: https://i.kym-cdn.com/entries/icons/original/000/028/596/dsmGaKWMeHXe9QuJtq_ys30PNfTGnMsRuHuo_MUzGCg.jpg`);
                } else if (msg == 'oof') {
                    message.channel.send(`${message.author}: https://images-na.ssl-images-amazon.com/images/I/61IwNTw0fCL.png`);
                } else if (msg == 'f') {
                    message.channel.send(`${message.author}: https://i.kym-cdn.com/entries/icons/original/000/028/731/cover2.jpg`);
                } else if ((msg == 'e') || (msg == 'ee') || (msg == 'eee')) {
                    message.channel.send(`${message.author}: https://transom.org/wp-content/uploads/2016/10/letter-e-FEATURED-800x440.jpg`);
                } else if (msg == 'bruh') {
                    message.channel.send(`${message.author}: https://i.kym-cdn.com/photos/images/newsfeed/001/517/016/cf1.jpg`);
                } else if ((msg == 'no u') || (msg == 'nou')) {
                    message.channel.send(`${message.author}: https://a.wattpad.com/cover/201516290-352-k392254.jpg`);
                } else if ((msg == 'its time') || (msg == 'its time to stop')) {
					message.channel.send(`${message.author}: https://i.kym-cdn.com/photos/images/newsfeed/001/060/689/927.jpg`);
				} else if ((msg == 'your welcome') || (msg == 'youre welcome')) {
				    message.channel.send(`${message.author}: https://media.tenor.com/images/dbe92dca2654c178dc490223f8a2d959/tenor.gif`);
				}
            }
        } if (message.channel.id === globalAnnouncement) {
			if (!message.author.bot) {
				message.delete();
				const announceEmbedd = new Discord.MessageEmbed();
				announceEmbedd.setColor('#ff0000');
				announceEmbedd.setTitle('**ANNOUNCEMENT **');
				announceEmbedd.setAuthor(message.author.username);
				announceEmbedd.setDescription(message.content);
                announceEmbedd.setFooter(footer);
                message.channel.send(announceEmbedd);
			}
		}
		var k;
		for (k = 0; k < suggestions.length; k++) {
		    if (message.channel.id === suggestions[k]) {
		        if (!message.author.bot) {
		            message.react('👍')
				    .then(() => message.react('👎'));
		        }
		    }
		}
	} else {
		console.log(message.content);
		const args = message.content.slice(prefix.length).split(' ');
		const command = args.shift().toLowerCase();
		if (command === 'blacklist') {
		    if (blacklist) {
    		    blacklist = false;
    		    message.reply(`I have turned blacklisting off.`);
		    } if (!blacklist) {
		        blacklist = true;
		        message.reply(`I have turned blacklisting on.`);
		    }
		}
		if (command === 'stfu') {
			if (openImage) {
				message.reply(`I have turned image reactions off.`);
				openImage = false;
			} if (!openImage) {
				message.reply(`I have turned image reactions on.`);
				openImage = true;
			}
		} if (command === 'helpme') {
			if (!args.length) {
				message.channel.send(`${message.author} \n>>> ${prefix}helpme`);
			} else if (args[0] == 'cmds') {
				message.channel.send(`your gay commands ${message.author}: \n>>> ${prefix}stfu \n${prefix}blacklist`);
			} else if (args[0] == 'mod') {
                if (message.member.hasPermission('KICK_MEMBERS')) {
                    message.channel.send(`ah a mod ${message.author}: \n>>> ${prefix}announce \n${prefix}poll \n${prefix}kick \n${prefix}ban \n${prefix}setup`);
                } else {
                    message.channel.send(`u think u got perms ah? ${message.author}`);
                }
			} else {
				message.channel.send(`you think you smart ah? ${message.author} \n>>> ${prefix}helpme cmds \n${prefix}helpme mod`);
			}
		} if (command === 'announce') {
			if (message.member.hasPermission('KICK_MEMBERS')) {
				if (!args.length) {
					message.channel.send(`your brain broken isit? announce what? ${message.author} \n> **${prefix}announce <message>**`);
				} else {
					var announcementMsg = args.join(" ");
					message.delete();
					const announceEmbed = new Discord.MessageEmbed();
					announceEmbed.setColor('#ff0000');
					announceEmbed.setTitle(`${announcementMsg}`);
					announceEmbed.setAuthor(message.author.username);
					announceEmbed.setFooter(`${footer}`);
					message.channel.send(announceEmbed);
				}
			} else {
				message.channel.send(`you think u got power ah? ${message.author}`);
			}
		} if (command === 'setup') {
			if (message.member.hasPermission('KICK_MEMBERS')) {
				if (!args.length) {
					message.channel.send(`your brain broken isit? setup what? ${message.author} \n> **${prefix}setup <announcement | suggestions | prefix> <channelID | prefix>**`);
				} else {
					if (args[0] == 'announcement') {
						var newAnnouncement = args[1];
						globalAnnouncement = newAnnouncement;
						message.reply(`there now that channel will always send an annoucement`);
					} else if (args[0] == 'prefix') {
						if (args[1].length <= 2) {
							var newPrefix = args[1];
							prefix = newPrefix;
							message.reply(`there, prefix now ${prefix}`);
						} else {
							message.channel.send(`oi prefix too long. must be 2 or less characters ${message.author}`);
						}
					} else if (args[0] == 'suggestions') {
					    var newsugchannel = args[1];
					    suggestions.push(`${newsugchannel}`);
					    message.reply('set');
					}
				}
			} else {
				message.channel.send(`you think u got permission ah? ${message.author}`);
			}
		}
	}
});
