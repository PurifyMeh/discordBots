const Discord = require('discord.js');
const client = new Discord.Client();
const { token, version } = require('./config.json');
const { Member } = require('discord.io');
const Keyv = require('keyv');
const footer = '---------------------------------------------\nbot by dest™#9640';

var globalAnnouncement = '0';
var oneWord = '0';
var oneWordSimple = '0';
var prefix = '-';
var openImage = true;
var story = " ";
var firstWord = true;
var previousAuthorAdv = '0';
var previousAuthorSim = '0';
var previousStory;
var joinChannel = '0';

client.once('ready', () => {
    console.log('ready to be used');
    console.log(`version ${version}`);
	client.user.setActivity('depression', { type: 'WATCHING'});
});

client.on('guildMemberAdd', async member => {
	var options1 = ["name1", "name2", "name3"];
	var options2 = ["name4", "name5", "name6"];
	var options3 = ["name7", "name8", "name9"];
	var options4 = ["name10", "name11", "name12"];
	var options5 = ["name13", "name14", "name15"];
	var response1 = options1[Math.floor(Math.random()*options1.length)];
	var response2 = options2[Math.floor(Math.random()*options2.length)];
	var response3 = options3[Math.floor(Math.random()*options3.length)];
	var response4 = options4[Math.floor(Math.random()*options4.length)];
	var response5 = options5[Math.floor(Math.random()*options5.length)];
	const simpJoin = new Discord.MessageEmbed();
		simpJoin.setTitle(`new member`);
		simpJoin.setDescription(`welcome to simpcraft, you have 3 free girls to simp on: ${response1}, ${response2}, ${response3} \npremium girls are ${response4} and ${response5}, it will cost $5 paypal to {insert paypal link}`);
		const channel = member.guild.channels.cache.find(ch => ch.name === joinChannel);
		if (!channel) return;
		channel.send(simpJoin);
});

client.login(token);

client.on('message', async message => {
	msg = message.content.toLowerCase();
	if (!message.content.startsWith(prefix) || message.author.bot) {
		if ((msg == 'no') || (msg == 'perhaps') || (msg == 'maybe') || (msg == 'well yes but actually no') || 
		(msg == 'well yes but no') || (msg == 'f') || (msg == 'e') || (msg == 'bruh') || (msg == 'ee') || 
		(msg == 'eee') || (msg == 'no u') || (msg == 'nou') || (msg == 'oof') || (msg == 'its time') || 
		(msg == 'its time to stop') || (msg == 'your welcome') || (msg == 'youre welcome')) {
            if (openImage == true) {
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
        } else if (message.channel.id === globalAnnouncement) {
			if (!message.author.bot) {
				message.delete()
				const announceEmbedd = new Discord.MessageEmbed();
				announceEmbedd.setColor('#ff0000');
				announceEmbedd.setTitle('**ANNOUNCEMENT **');
				announceEmbedd.setAuthor(message.author.username);
				announceEmbedd.setDescription(message.content);
                announceEmbedd.setFooter(footer);
                message.channel.send(announceEmbedd);
			}
		} else if ((msg == 'nword alert') || (msg == 'n-word alert')) {
			if (message.member.hasPermission('KICK_MEMBERS')) {
				message.delete()
				const announceEmbedd = new Discord.MessageEmbed();
				announceEmbedd.setColor('#000000');
				announceEmbedd.setTitle('**!!!!!!!!!! N-WORD ALERT !!!!!!!!!!**');
				announceEmbedd.setDescription(`**HALT. RACIST REMARKS OR INSULTS WILL NOT BE TOLERATED, EVEN IF YOU ARE ACTUALLY OF THAT COLOR**\n**WEE WOO WEE WOO WEE WOO WEE WOO WEE WOO WEE WOO WEE WOO WEE WOO WEE WOO WEE WOO WEE WOO WEE WOO WEE WOO WEE WOO WEE WOO WEE WOO WEE WOO WEE WOO WEE WOO WEE WOO WEE WOO WEE WOO WEE WOO WEE WOO WEE WOO WEE WOO WEE WOO WEE WOO WEE WOO WEE WOO WEE WOO WEE WOO WEE WOO WEE WOO WEE WOO WEE WOO**`);
				announceEmbedd.setFooter(footer);
				message.channel.send(announceEmbedd);
			} 
		} else if (message.channel.id === oneWord) {
            if (!message.author.bot) {
                var word = message.content;
                var x;
                var notWord = false;
                for (x of word) {
                    if (x == " ") {
                        var notWord = true;
                    }
                }
                if (notWord == false) {
                    console.log(word);
                    message.delete();
                    if (firstWord == true) {
                        var storyEmbed = new Discord.MessageEmbed();
                            storyEmbed.setDescription(`${word}`);
                            storyEmbed.setFooter(`${footer}`);
						message.channel.send(storyEmbed);
						previousStory = storyEmbed;
                        firstWord = false;
                        story = `${word}`;
                    } else if (firstWord == false) {
                        if ((word == '.') || (word == '!') || (word == '?') || (word == ',')) {
                            var newStory = `${story}` + `${word}`;
                        } else {
                            var newStory = `${story}` + " " + `${word}`;
						}
						previousAuthorAdv = message.author;
                        var editStory = new Discord.MessageEmbed().setDescription(`${newStory}`).setFooter(`${footer}`);
						message.delete(previousStory);
						message.channel.send(editStory);
						previousStory = editStory;
                        story = `${newStory}`;
                        if ((word == '.') || (word == '!') || (word == '?')) {
                            firstWord = true;
                        }
                    }
                } else {
                    message.delete();
                }
            } else {
				var msgid = message.fetch();
				message.channel.send(`${msgid}`);
			}
		} else if (message.channel.id === oneWordSimple) {
			if ((!message.author.bot) && (message.author !== previousAuthorSim)) {
				if ((message.author.username == 'Gilford') && (message.author.discriminator == '2194')) {
					message.delete();
				} else {
					var word = message.content;
					var x;
					var notWord = false;
					for (x of word) {
						if (x == " ") {
							var notWord = true;
						}
					}
					if (notWord == true) {
						message.delete();
						return;
					}
					previousAuthorSim = message.author;
				}
			} else {
				message.delete();
			}
		}
	} else {
		console.log(message.content);
		const args = message.content.slice(prefix.length).split(' ');
		const command = args.shift().toLowerCase();
		if (command === 'gae') {
			if (!args.length) {
				message.channel.send(`you fucking stupid isit? ${message.author} \n>>> -gae <name>`);
			} else if ((args[0] == 'dest') || (args[0] == 'des') || (args[0] == 'destial') || (args[0] == '<@!237492876374704128>')) {
				message.reply(`wrong`);
			} else {
				message.channel.send(`yup, ${args[0]} is 100% gay, ${message.author}`);
			}
		} else if (command === 'stfu') {
			const taggedUser = message.mentions.users.first();
			if (!args.length) {
				message.channel.send(`**stfu ${message.author}**`);
			} else if (args[0] == 'bot') {
				openImage = false;
				message.channel.send(`;-; i will no longer send images ${message.author}`);
			} else if (args[0] == 'stop') {
				openImage = true;
				message.channel.send(`yay im gonna annoy you with images now ${message.author}`);
			} else {
				message.channel.send(`**stfu ${args[0]}**`);
			}
		} else if ((command === 'avatar') || (command == 'pfp')) {
			message.channel.send(`${message.author}: ${message.author.displayAvatarURL()}`);
		} else if (command === 'invitelink') {
			message.channel.createInvite()
				.then(invite => message.reply(`server invite link: https://discord.gg/${invite.code}`))
				.catch(console.error);
		} else if (command === 'botlink') {
			message.channel.send(`u want this bot? na https://discord.com/oauth2/authorize?client_id=726637123738009611&scope=bot&permissions=2147483607 ${message.author}`);
		} else if (command === 'helpme') {
			if (!args.length) {
				message.channel.send(`nah here ${message.author} \n>>> ${prefix}helpme cmds \n${prefix}helpme mod`);
			} else if (args[0] == 'cmds') {
				message.channel.send(`your gay commands ${message.author}: \n>>> ${prefix}gae \n${prefix}calc \n${prefix}blow \n${prefix}fuck \n${prefix}piak \n${prefix}spank \n${prefix}botlink \n${prefix}invitelink \n${prefix}avatar \n${prefix}stfu \n${prefix}ask`);
			} else if (args[0] == 'mod') {
                if (message.member.hasPermission('KICK_MEMBERS')) {
                    message.channel.send(`ah a mod ${message.author}: \n>>> ${prefix}announce \n${prefix}poll \n${prefix}kick \n${prefix}ban \n${prefix}setup`);
                } else {
                    message.channel.send(`u think u got perms ah? ${message.author}`);
                }
			} else {
				message.channel.send(`you think you smart ah? ${message.author} \n>>> ${prefix}helpme cmds \n${prefix}helpme mod`);
			}
		} else if (command === 'blow') {
			if (!args.length) {
				message.channel.send(`give blowjob to what? chair ah? ${message.author} \n> **${prefix}blow <@username>**`);
			} else if (!message.mentions.users.size) {
				message.channel.send(`oi must be user or else dick stuck in toaster, ${message.author}!`);
			} else {
				message.channel.send(`${message.author} gave the good succ to ${args[0]}`);
			}
		} else if (command === 'piak') {
			if (!args.length) {
				message.channel.send(`smack what? sword ah, ${message.author} \n> **${prefix}piak <@username>**`);
			} else if (!message.mentions.users.size) {
				message.channel.send(`oi must be user or else piak ur cock, ${message.author}!`);
			} else {
				message.channel.send(`${message.author} fucking slapped the shit out of ${args[0]}`);
			}
		} else if (command === 'spank') {
			if (!args.length) {
				message.channel.send(`knn spank urself isit? ${message.author} \n> **${prefix}spank <@username>**`);
			} else if (!message.mentions.users.size) {
				message.channel.send(`ey you retarded try spank objects isit? this not hentai lah you fucking degenerate ${message.author}!`);
			} else {
				message.channel.send(`${message.author} went full on out and spanked the life out of ${args[0]}. you kinky little shit`);
			}
		} else if (command === 'fuck') {
			if (!args.length) {
				message.channel.send(`you think u got dick and vag ah ${message.author} \n> **${prefix}fuck <@username>**`);
			} else if (!message.mentions.users.size) {
				message.channel.send(`bruh you wanna fuck inanimate objects isit? you fucking weeb ${message.author}!`);
			} else {
				message.channel.send(`${message.author} just fucked ${args[0]} so hard both of their dicks fell out`);
			}
		} else if (command === 'ask') {
			if (!args.length) {
				message.reply(`woi no question then how to answer`);
			} else {
				var options = ["suck my balls", "definitely yes", "fuck no", "eat my ass you fuck", 
								" i bet you 5 cents that its true", "8ball says yes", "wrong", "right",
								"maybe", "eh its a 50/50 chance", "can you fucking not", "yes, now leave",
								"its possible", "impossible", "i guess so", "idk", "does it matter?", "no",
								"i dont give a fuck", "fuck you", "yep", "ya, now fuck off", "100% legit",
								"yes, daddy", "and also a trap", "and abit gay", "and abit racist", "mhm"];
				var response = options[Math.floor(Math.random()*options.length)];
				message.channel.send(`${response}`);
			}
		} else if (command === 'calc') {
			if (!args.length) {
				message.channel.send(`just because im asian doesnt mean i know everything ${message.author} \n> **${prefix}calc <number> <+ - x /> <number>**`);
			} else {
				var num1 = Number(args[0]);
				var num2 = Number(args[2]);
				if ((num1 != NaN) && (num2 != NaN)) {
					if (args[1] == '+') {
						var answer = num1 + num2;
						if (answer == 19){
							answer = 21;
						}
						message.channel.send(`answer is ${answer} ${message.author}`);
					} else if (args[1] == '-') {
						var answer = num1 - num2;
						message.channel.send(`answer is ${answer} ${message.author}`);
					} else if (args[1] == 'x') {
						var answer = num1 * num2;
						message.channel.send(`answer is ${answer} ${message.author}`);
					} else if (args[1] == '/') {
						var answer = num1 / num2;
						message.channel.send(`answer is ${answer} ${message.author}`);
					} else {
						message.channel.send(`oi can use correctly or not ${message.author} \n> **${prefix}calc <number> <+ - x /> <number>`);
					}
				} else {
					message.channel.send(`you retard isit? ${message.author} \n> **${prefix}calc <number> <+ - x /> <number>`);
				}
			}
		} else if (command === 'announce') {
			if (message.member.hasPermission('KICK_MEMBERS')) {
				if (!args.length) {
					message.channel.send(`your brain broken isit? announce what? ${message.author} \n> **${prefix}announce <message>**`);
				} else {
					var announcementMsg = args.join(" ");
					message.delete()
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
		} else if (command === 'setup') {
			if (message.member.hasPermission('KICK_MEMBERS')) {
				if (!args.length) {
					message.channel.send(`your brain broken isit? setup what? ${message.author} \n> **${prefix}setup <announcement | onewordadv |  onewordsimp | join | prefix> <channelID | joinchannelName | prefix>**`);
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
					} else if (args[0] == 'onewordadv') {
						var newOneWord = args[1];
                        oneWord = newOneWord;
                        message.reply(`there now that channel is one word stories only`);
                        client.channels.cache.get(oneWord).send(`here`);
					} else if (args[0] == 'onewordsimp'){
						var newOneWordSimple = args[1];
						oneWordSimple = newOneWordSimple;
						previousAuthorSim = '0';
						message.reply(`there now that channel uses simple one word checks`);
					} else if (args[0] == 'join') {
						joinChannel = args[1];
						message.reply(`set`);
					}
				}
			} else {
				message.channel.send(`you think u got permission ah? ${message.author}`);
			}
		} else if (command === 'poll') {
			if (message.member.hasPermission('KICK_MEMBERS')) {
				if (!args.length) {
					message.channel.send(`poll what? ${message.author} \n> **${prefix}poll <message>**`);
				} else {
					var pollMsg = args.join(" ");
					message.delete()
					const pollEmbed = new Discord.MessageEmbed();
					pollEmbed.setColor('#00ff00');
					pollEmbed.setTitle('**POLL**');
					pollEmbed.setAuthor(message.author.username);
					pollEmbed.setDescription(pollMsg);
					pollEmbed.setFooter(footer);
					pollEmbed.setTimestamp();
					message.channel.send(pollEmbed)
                        .then(message => message.react('✅'))
                        .then(message => message.react('❎'))
						.catch(console.error);
				}
			} else {
				message.channel.send(`you think u got permission ah? ${message.author}`);
			}
		} else if (command === 'kick') {
			if (message.member.hasPermission('KICK_MEMBERS')) {
				const taggedUser = message.mentions.users.first();
				if (!args.length) {
					message.channel.send(`u wan kick wall isit?${message.author} \n> **${prefix}kick <@username>**`);
				} else if (!message.mentions.users.size) {
					message.channel.send(`bruh how to kick if u say no one ${message.author}!`);
				} else {
					const member = message.guild.member(taggedUser)
					if (member) {
						member
						  .kick()
						  .then(() => {
							message.channel.send(`kicked ${member} from the face of the earth, ${message.author}`);
						  })
						  .catch(error => {
							message.channel.send(`person got more power than you lmao ${message.author}`);
							console.error(error);
						  });
					} else {
						message.channel.send(`idk wtf u just typed ${message.author}`);
					}
				}
			} else {
				message.channel.send(`who say you can kick? ${message.author}`);
			}
		} else if (command === 'ban') {
			if (message.member.hasPermission('BAN_MEMBERS')) {
				const taggedUser = message.mentions.users.first();
				if (!args.length) {
					message.channel.send(`u wan ban ur mom isit?${message.author} \n> **${prefix}ban <@username>**`);
				} else if (!message.mentions.users.size) {
					message.channel.send(`bruh how to ban if u say no one ${message.author}!`);
				} else {
					const member = message.guild.member(taggedUser)
					if (member) {
						member
						  .ban()
						  .then(() => {
							message.channel.send(`banned ${member} forever, ${message.author}`);
						  })
						  .catch(error => {
							message.channel.send(`person got more power than you lmao ${message.author}`);
							console.error(error);
						  });
					} else {
						message.channel.send(`idk wtf u just typed ${message.author}`);
					}
				}
			} else {
				message.channel.send(`who say you can kick? ${message.author}`);
			}
		} else if (command === 'mute') {
			if (message.member.hasPermission('MUTE_MEMBERS')) {
				const taggedUser = message.mentions.users.first();
				if (!args.length) {
					message.channel.send(`mute isit?${message.author} \n> **${prefix}mute <@username>**`);
				} else if (!message.mentions.users.size) {
					message.channel.send(`go mute urself la ${message.author}!`);
				} else {
					const member = message.guild.member(taggedUser)
					if (member) {
						member
						  .mute()
						  .then(() => {
							message.channel.send(`muted ${member} forever, ${message.author}`);
						  })
						  .catch(error => {
							message.channel.send(`person got more power than you lmao ${message.author}`);
							console.error(error);
						  });
					} else {
						message.channel.send(`idk wtf u just typed ${message.author}`);
					}
				}
			} else if (command === 'unmute') {
				if (message.member.hasPermission('MUTE_MEMBERS')) {
					const taggedUser = message.mentions.users.first();
					if (!args.length) {
						message.channel.send(`unmute isit?${message.author} \n> **${prefix}unmute <@username>**`);
					} else if (!message.mentions.users.size) {
						message.channel.send(`just shut your mouth la ${message.author}!`);
					} else {
						const member = message.guild.member(taggedUser)
						if (member) {
							member
							  .mute()
							  .then(() => {
								message.channel.send(`unmuted ${member}, ${message.author}`);
							  })
							  .catch(error => {
								message.channel.send(`person got more power than you lmao ${message.author}`);
								console.error(error);
							  });
						} else {
							message.channel.send(`idk wtf u just typed ${message.author}`);
						}
					}
				}
			}
		}
	}
});