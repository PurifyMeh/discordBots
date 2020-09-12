const Discord = require('discord.js');
const mysql = require('mysql');
const fs = require('fs');
const client = new Discord.Client( {partials: ["MESSAGE", "REACTION", "GUILD_MEMBER", "CHANNEL", "USER"]});
const { token, version, serverID, acceptedSuggestionsChannel, upvote, downvote, footer, acceptedEmoji } = require('./config.json');
var { prefix, offenceChannel, updatesChannel, joinMessage, memberRole, status } = require('./config.json');
var defaultPrefix = prefix;
const { address, user, pass, database } = require('./mysql.json');
var activity = (status + prefix + 'help');

var previousAuthorThreeAdv = '0'; var previousAuthorAdv = '0';
var previousStoryThree = ""; var previousStory = "";
var newLineThree = false; var newLine = false;
var embThree; var emb;
var setupMode = false; var setup; var setupStep = 1;
var threeWord = " "; var oneWord = " "; var storyModeT = "s"; var storyModeO = "s";
var oneWordID = ''; var threeWordID = '';
var threeWordSetup = false; var oneWordSetup = false;
var openImage = false; var setupUser = '0';
var blacklist = true; var join = true; var auto = false;

var blacklistedWords = ["nigger", "nigga", "nazi"];
var trigger = true; var mysqlcheck = false;

var reactionTrigger = ["ayy", "ping"];
var reactionResponse = ["lmao", "<user> pong!"];

var commands = ["story", "images", "offence", "blacklist", "prefix", "help", "update", "join", "trigger", "auto"];

var commandsDesc = ["Setup story channels", "Toggle image reactions", "Setup offence-log channel", "Add words to blacklist", 
					"Change command prefix", "Display help", "Setup update channel", "Setup join message", "Add trigger words", 
					"Toggle auto embeds and suggestions"];

var namehist = []; var uuidhist = [];
var bans; var mutes;
var kicks; var warns;

var pool = mysql.createPool({
    connectionLimit : 10,
    host: address,
	user: user,
    password: pass,
    database: database
});

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
const updateFiles = fs.readdirSync('./updates').filter(file => file.endsWith('.js'));
client.updates = new Discord.Collection();
client.commands = new Discord.Collection();
for (const file of updateFiles) {
	const update = require(`./updates/${file}`);
	client.updates.set(update.name, update);
}
for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.name, command);
}

client.once('ready', () => {
    console.log('\nOnline and Ready! \nUsing version ' + version);
	client.user.setActivity(activity, { type: 'WATCHING'});
	pool.getConnection(function(err, connection) {
        if (err) {
			console.log("Error connecting to mySQL. Connection refused!");
        } else {
			console.log("Connected to mysql database!");
			mysqlcheck = true;
            pool.query("SELECT * FROM litebans_bans", function (err, res) {
                if (err) {
                    console.log('mySQL bans is not configured!');
                }
                else {
                    bans = res.length;
                    console.log('I have bans history set!');
                }
            });
            pool.query("SELECT id FROM litebans_mutes", function (err, res) {
                if (err) {
                    console.log('mySQL bans is not configured!');
                }
                else {
                    mutes = res.length;
                    console.log('I have mutes history set!');
                }
            });
            pool.query("SELECT id FROM litebans_kicks", function (err, res) {
                if (err) {
                    console.log('mySQL bans is not configured!');
                }
                else {
                    kicks = res.length;
                    console.log('I have kicks history set!');
                }
            });
            pool.query("SELECT id FROM litebans_warnings", function (err, res) {
                if (err) {
                    console.log('mySQL bans is not configured!');
                }
                else {
                    warns = res.length;
                    console.log('I have warns history set!');
                }
			});
			connection.release();
        }
	});
});

client.on('guildMemberAdd', async member => {
	client.updates.get('guildMemberAdd').execute(Discord, client, member, updatesChannel, joinMessage, join, memberRole);
});

client.login(token);

client.on('channelCreate', async channel => {
	client.updates.get('channelCreate').execute(Discord, client, channel, updatesChannel);
});

client.on('channelDelete', async channel => {
	client.updates.get('channelDelete').execute(Discord, client, channel, updatesChannel);
});

client.on('channelUpdate', async (oldChannel, newChannel) => {
	client.updates.get('channelUpdate').execute(Discord, client, oldChannel, newChannel, updatesChannel);
});

client.on('guildMemberUpdate', async (oldMember, newMember) => {
	client.updates.get('guildMemberUpdate').execute(Discord, client, oldMember, newMember, updatesChannel);
});

client.on('messageDelete', async message => {
	client.updates.get('messageDelete').execute(Discord, client, message, updatesChannel, oneWord, threeWord, prefix);
});

client.on('messageUpdate', async (oldMessage, newMessage) => {
	client.updates.get('messageUpdate').execute(Discord, client, oldMessage, newMessage, updatesChannel, oneWord, threeWord);
});

client.on('roleCreate', async role => {
	client.updates.get('roleCreate').execute(Discord, client, role, updatesChannel);
});

client.on('roleDelete', async role => {
	client.updates.get('roleDelete').execute(Discord, client, role, updatesChannel);
});

client.on('roleUpdate', async (oldRole, newRole) => {
	client.updates.get('roleUpdate').execute(Discord, client, oldRole, newRole, updatesChannel);
});

client.on('guildBanAdd', async (guild, user) => {
	client.updates.get('guildBanAdd').execute(Discord, client, guild, user, updatesChannel);
});

client.on('guildBanRemove', async (guild, user) => {
	client.updates.get('guildBanRemove').execute(Discord, client, guild, user, updatesChannel);
});

client.on('guildMemberRemove', async member => {
	client.updates.get('guildMemberRemove').execute(Discord, client, member, updatesChannel);
});

client.on('messageReactionAdd', async (react, user) => {
	if (react.partial) {
		try {
			await react.fetch();
		} catch (error) {
			console.log("Something wrong while fetching uncached messages!", error);
		}
	}
	const msg = react.message;
	if (msg.channel.name.indexOf("suggestion") !== -1) {
		if (!msg.author.bot) {
			if (react.emoji.name === acceptedEmoji) {
				const guild = client.guilds.cache.get(serverID);
				const accepter = await guild.members.fetch(user);
					if (accepter.hasPermission('KICK_MEMBERS')) {
						if (!msg.deleted) {
						msg.delete();
						msg.deleted = true;
						const ch = client.channels.cache.get(acceptedSuggestionsChannel);
						const suggestionEmbed = new Discord.MessageEmbed();
    					suggestionEmbed.setColor(Math.floor(Math.random() * 16777214) + 1);
    					suggestionEmbed.setDescription(msg.content);
						suggestionEmbed.setAuthor(msg.author.username, msg.author.displayAvatarURL());
						suggestionEmbed.addField('Accepted by', `${user.username}`, true);
    					suggestionEmbed.setFooter(footer);
						ch.send(suggestionEmbed);
					}
				}
			}
		}
	}
});

client.on('message', async message => {
	msg = message.content.toLowerCase();
	if (blacklist) {
		if (!message.author.bot) {
			if (blacklistedWords.some(word => msg.includes(word))) {
				message.delete();
			}
		}
	}
	if (trigger) {
		if (!message.author.bot) {
			for (var i = 0; i < reactionTrigger.length; i++) {
				if (msg === reactionTrigger[i]) {
					const response = reactionResponse[i].replace(/<user>/gi, getUserMention(message.author));
					message.channel.send(response);
					return;
				}
			}
		}
	}
	if (openImage) {
		if (!message.author.bot) {
			if (msg === 'no') {
				message.channel.send(`${message.author}: https://i.kym-cdn.com/photos/images/original/001/483/348/bdd.jpg`);
			} else if ((msg === 'perhaps') || (msg === 'maybe')) {
				message.channel.send(`${message.author}: https://i.kym-cdn.com/photos/images/original/001/398/111/d5a`);
			} else if ((msg === 'well yes but actually no') || (msg === 'well yes but no') || (msg === 'well yes')) {
				message.channel.send(`${message.author}: https://i.kym-cdn.com/entries/icons/original/000/028/596/dsmGaKWMeHXe9QuJtq_ys30PNfTGnMsRuHuo_MUzGCg.jpg`);
			} else if (msg === 'oof') {
				message.channel.send(`${message.author}: https://images-na.ssl-images-amazon.com/images/I/61IwNTw0fCL.png`);
			} else if (msg === 'f') {
				message.channel.send(`${message.author}: https://i.kym-cdn.com/entries/icons/original/000/028/731/cover2.jpg`);
			} else if ((msg === 'e')) {
				message.channel.send(`${message.author}: https://transom.org/wp-content/uploads/2016/10/letter-e-FEATURED-800x440.jpg`);
			} else if (msg === 'bruh') {
				message.channel.send(`${message.author}: https://i.kym-cdn.com/photos/images/newsfeed/001/517/016/cf1.jpg`);
			} else if ((msg === 'no u') || (msg === 'nou')) {
				message.channel.send(`${message.author}: https://a.wattpad.com/cover/201516290-352-k392254.jpg`);
			} else if ((msg === 'its time') || (msg === 'its time to stop')) {
				message.channel.send(`${message.author}: https://i.kym-cdn.com/photos/images/newsfeed/001/060/689/927.jpg`);
			} else if ((msg === 'your welcome') || (msg === 'youre welcome') || (msg === "you're welcome")) {
				message.channel.send(`${message.author}: https://media.tenor.com/images/dbe92dca2654c178dc490223f8a2d959/tenor.gif`);
			}
		}
	}
	var channelName = message.channel.name;
	if (auto) {
		if ((channelName.indexOf("announcement") !== -1) || (channelName.indexOf("update") !== -1) || (channelName.indexOf("event") !== -1)) {
			if (!message.author.bot) {
				const attach = getAttachment(message.attachments);
				const announceEmbedd = new Discord.MessageEmbed();
				announceEmbedd.setColor(Math.floor(Math.random() * 16777214) + 1);
				announceEmbedd.setAuthor(message.author.username, message.author.displayAvatarURL());
				announceEmbedd.setFooter(footer);
				if (message.content.startsWith("http") && (message.content.endsWith(".png") || message.content.endsWith(".jpg") || message.content.endsWith(".gif") || message.content.endsWith(".jpeg"))) {
					announceEmbedd.setImage(message.content);
				} else {
					announceEmbedd.setDescription(message.content);
				}
				announceEmbedd.setImage(attach[0]);
				message.channel.send(announceEmbedd);
				message.delete({timeout: 1000});
			}
		} else if (channelName.indexOf("suggestion") !== -1) {
			if (!message.author.bot) {
				message.react(upvote)
				.then(() => message.react(downvote));
			}
		}
	}
	if (channelName.indexOf(threeWord) !== -1) {
		if (!message.author.bot) { // && message.author !== previousAuthorThreeAdv) {
			var i = 0; var story = message.content;
			for (var x = 0; x < story.length; x++) {
				if (msg[x] === " ") {
					i++;
				}
			}
			if (i != 2) {
			    message.delete({timeout: 500});
	        } else {
				previousAuthorThreeAdv = message.author;
				if (story.startsWith(",") || story.startsWith("!") || story.startsWith("?") || story.startsWith(".")) {
					var punctuation;
					if (previousStoryThree.endsWith(",") || previousStoryThree.endsWith(".") || previousStoryThree.endsWith("!") || previousStoryThree.endsWith("?")) {
						punctuation = "";
					} else {
						punctuation = story.slice(0, 1);
					}
					var res = story.slice(1);
					if (res[0] === " ") {
						story = punctuation + res;
					} else {
						story = punctuation + " " + res;
					}
					previousStoryThree = previousStoryThree + story;
				} else {
					previousStoryThree = previousStoryThree + " " + story;
				}
	            if (previousStoryThree.endsWith(".") || previousStoryThree.endsWith("!") || previousStoryThree.endsWith("?")) {
					var punctuation = previousStoryThree[-1];
					if (previousStoryThree[-2] === " ") {
						previousStoryThree = previousStoryThree.slice(0, previousStoryThree.lastIndexOf(" ")-2) + punctuation;
					}
	                newLineThree = true;
	            }
	            message.delete({timeout: 500});
	            const storyEmbed = new Discord.MessageEmbed();
    			storyEmbed.setColor(Math.floor(Math.random() * 16777214) + 1);
    			storyEmbed.setDescription(previousStoryThree);
    			storyEmbed.setAuthor(message.member.displayName, message.author.displayAvatarURL());
				storyEmbed.setFooter(footer);
				if (storyModeT === "e") {
					if (embThree !== undefined) await embThree.edit(storyEmbed);
					else embThree = await message.channel.send(storyEmbed);
				} else if (storyModeT === "s") {
					embThree = await message.channel.send(storyEmbed);
				}
    			if (newLineThree) {
	                previousStoryThree = "";
	                embThree = undefined;
	                newLineThree = false;
	            }
	        }
	    } else if (message.author === previousAuthorThreeAdv) {
            message.delete({timeout: 500});
	    }
	} else if (channelName.indexOf(oneWord) !== -1) {
		if ((!message.author.bot) && (message.author !== previousAuthorAdv)) {
	        var story = message.content;
	        var notWord = false;
	        for (var i = 0; i < story.length; i++) {
	            if (story[i] === " ") {
	                notWord = true;
	            }
	        }
	        if (notWord) {
	            message.delete({timeout: 500});
	        } else {
	            previousAuthorAdv = message.author;
	            if (story === "," || story === "!" || story === "?" || story === ".") {
					previousStory = previousStory + story;
				} else if (story.startsWith(",") || story.startsWith("!") || story.startsWith("?") || story.startsWith(".")) {
					var punctuation;
					if (previousStory.endsWith(",") || previousStory.endsWith(".") || previousStory.endsWith("!") || previousStory.endsWith("?")) {
						punctuation = "";
					} else {
						punctuation = story.slice(0, 1);
					}
					var res = story.slice(1);
					previousStory = previousStory + punctuation + res;
	            } else {
	                previousStory = previousStory + " " + story;
	            }
	            if (previousStory.endsWith(".") || previousStory.endsWith("!") || previousStory.endsWith("?")) {
	                newLine = true;
	            }
	            message.delete({timeout: 500});
	            const storyEmbed = new Discord.MessageEmbed();
				storyEmbed.setColor(Math.floor(Math.random() * 16777214) + 1);
				storyEmbed.setDescription(previousStory);
				storyEmbed.setAuthor(message.member.displayName, message.author.displayAvatarURL());
				storyEmbed.setFooter(`${footer}`);
				if (storyModeO === "e") {
	            	if (emb !== undefined) await emb.edit(storyEmbed);
					else emb = await message.channel.send(storyEmbed);
				} else if (storyModeO === "s") {
					emb = await message.channel.send(storyEmbed);
				}
				if (newLine) {
	                previousStory = "";
	                emb = undefined;
	                newLine = false;
	            }
	        }
	    } else if (message.author === previousAuthorAdv) {
            message.delete({timeout: 500});
	    }
	}
	if (setupMode) {
		if (message.channel.id === setup) {
			if (!message.author.bot) {
				if (message.author === setupUser) {
					if (setupStep === 1) {
						if (msg === "three") {
							threeWordSetup = true;
							message.channel.send("You are setting up three-word stories " + getUserMention(message.author) + " ! Enter the channel for your three-word stories. E.g `#three-words-story`");
							setupStep++;
						} else if (msg === "one") {
							oneWordSetup = true;
							message.channel.send("You are setting up one-word stories " + getUserMention(message.author) + " ! Enter the channel for your one-word stories. E.g `#one-word-story`");
							setupStep++;
						} else if (msg === "quit") {
							setupMode = false;
							setupStep = 0;
							message.channel.send("Aborted setup of stories " + getUserMention(message.author) + " !");
							return;
						} else {
							message.channel.send("Invalid answer " + getUserMention(message.author) + " ! Answer with `three`, `one` or `quit`!");
							return;
						}
					} else if (setupStep === 2) {
						if (threeWordSetup) {
							if (msg === "quit") {
								setupMode = false;
								setupStep = 0;
								message.channel.send("Aborted setup of stories " + getUserMention(message.author) + " !");
								return;
							} else if (msg.length !== 21) {
								message.channel.send("Invalid channel! Please try again " + getUserMention(message.author) + " !");
								return;
							} else {
								threeWordID = msg.slice(2, 20);
								const channel = client.channels.cache.get(threeWordID);
								if (!channel) {
									message.channel.send("Unknown channel! Please try again " + getUserMention(message.author) + " !");
									return;
								}
								threeWord = channel.name;
								message.channel.send("You have set <#" + channel.id + "> as your three-words stories channel " + getUserMention(message.author) + " !");
								message.channel.send("Setup is complete " + getUserMention(message.author) + " !`" + prefix + commands[0] + " mode three` to change story mode!");
								setupMode = false;
								threeWordSetup = false;
							}
							setupMode = false;
						} else if (oneWordSetup) {
							if (msg === "quit") {
								setupMode = false;
								setupStep = 0;
								message.channel.send("Aborted setup of stories!");
								return;
							} else if (msg.length !== 21) {
								message.channel.send("Invalid channel! Please try again " + getUserMention(message.author) + " !");
								return;
							} else {
								oneWordID = msg.slice(2, 20);
								const channel = client.channels.cache.get(oneWordID);
								if (!channel) {
									message.channel.send("Unknown channel! Please try again " + getUserMention(message.author) + " !");
									return;
								}
								oneWord = channel.name;
								message.channel.send("You have set <#" + channel.id + "> as your one-word stories channel " + getUserMention(message.author) + " !");
								message.channel.send("Setup is complete " + getUserMention(message.author) + " ! `" + prefix + commands[0] + " mode one` to change story mode!");
								setupMode = false;
								oneWordSetup = false;
							}
						}
					}
				} else {
					message.channel.send("You don't have permissions to continue setup " + getUserMention(message.author) + " !");
				}
			}
		}
	}
	if (mysqlcheck) {
		if (message.author.bot) {
			if (msg.search("ban") !== -1) {
				getHistory();
				getBans();
			} if (msg.search("mute") !== -1) {
				getHistory();
				getMutes();
			} if (msg.search("kick") !== -1) {
				getHistory();
				getKicks();
			} if (msg.search("warn") !== -1) {
				getHistory();
				getWarns();
			}
			uuidhist = [];
			namehist = [];
		}
	}
	if (msg.startsWith(prefix)) {
		const args = message.content.slice(prefix.length).split(' ');
		const command = args.shift().toLowerCase();
		if (command === commands[0]) {		  // Stories
			if (message.member.hasPermission('KICK_MEMBERS')) {
				if (!args.length) {
					message.channel.send("Invalid arguments " + getUserMention(message.author) + " ! `" + prefix + commands[0] + " [ setup | mode ]`");
				} else if (args[0] === "setup") {
					setupUser = message.author;
					setupStep = 1;
					setupMode = true;
					setup = message.channel.id;
					message.channel.send("Story setup mode is active " + getUserMention(message.author) + " !");
					message.channel.send("Do you want to setup Three-Word or One-Word stories? Answer with `three` or `one`. Type `quit` at any point to quit setup.");
				} else if (args[0] === "mode") {
					if (args[1] === undefined) {
						message.channel.send("Usage is `" + prefix + " " + commands[0] + " mode [ one | three ]` "+ getUserMention(message.author) + " !");
					} else if (args[1] === "one") {
						if (storyModeO === "s") {
							message.channel.send("Successfully changed story mode of " + getChannelMention(oneWord) + " from `save` to `edit`, " + getUserMention(message.author) + " !");
							storyModeO = "e";
						} else if (storyModeO === "e") {
							message.channel.send("Successfully changed story mode of " + getChannelMention(oneWord) + " from `edit` to `save`, " + getUserMention(message.author) + " !");
							storyModeO = "s";
						}
					} else if (args[1] === "three") {
						if (storyModeT === "s") {
							message.channel.send("Successfully changed story mode of " + getChannelMention(threeWord) + " from `save` to `edit`, " + getUserMention(message.author) + " !");
							storyModeT = "e";
						} else if (storyModeO === "e") {
							message.channel.send("Successfully changed story mode of " + getChannelMention(threeWord) + " from `edit` to `save`, " + getUserMention(message.author) + " !");
							storyModeT = "s";
						}
					} else {
						message.channel.send("Invalid arguments " + getUserMention(message.author) + " ! `" + prefix + commands[0] + " mode [ one | three ]`");
					}
				}
			} else {
				message.channel.send("You don't have permission to setup stories " + getUserMention(message.author) + " !");
			}
		} else if (command === commands[1]) { // Images
			const returnImages = client.commands.get(commands[1]).execute(message, openImage);
			openImage = returnImages.openImage;
		} else if (command === commands[2]) { // Offence
			const returnOffence = client.commands.get(commands[2]).execute(client, message, args, offenceChannel, prefix, commands);
			offenceChannel = returnOffence.offenceChannel;
		} else if (command === commands[3]) { // Blacklist
			const returnedBlacklist = client.commands.get(commands[3]).execute(message, args, blacklist, blacklistedWords, prefix, commands);
			blacklistedWords = returnedBlacklist.blacklistedWords;
			blacklist = returnedBlacklist.blacklist;
		} else if (command === commands[4]) { // Prefix
			const returnPrefix = client.commands.get(commands[4]).execute(client, message, args, commands, prefix, defaultPrefix, activity, status);
			if (returnPrefix.prefix !== undefined) prefix = returnPrefix.prefix;
			if (returnPrefix.activity !== undefined) activity = returnPrefix.activity;
			if (returnPrefix.status !== undefined) status = returnPrefix.status;
		} else if (command === commands[5]) { // Help
			client.commands.get(commands[5]).execute(client, message, prefix, commands, commandsDesc);
		} else if (command === commands[6]) { // Update
			const returnUpdates = client.commands.get(commands[6]).execute(client, message, args, commands, prefix, updatesChannel);
			updatesChannel = returnUpdates.updatesChannel;
		} else if (command === commands[7]) { // Join
			const returnJoin = await client.commands.get(commands[7]).execute(Discord, message, args, prefix, commands, joinMessage, join, memberRole, footer);
			if (returnJoin.join !== undefined) join = returnJoin.join;
			if (returnJoin.joinMessage !== undefined) joinMessage = returnJoin.joinMessage;
			if (returnJoin.memberRole !== undefined) memberRole = returnJoin.memberRole;
		} else if (command === commands[8]) { // Trigger
			const returnTrigger = client.commands.get(commands[8]).execute(message, args, prefix, commands, trigger, reactionTrigger, reactionResponse);
			trigger = returnTrigger.trigger;
			reactionResponse = returnTrigger.reactionResponse;
			reactionTrigger = returnTrigger.reactionTrigger;
		} else if (command === commands[9]) { // Auto
			const returnAuto = client.commands.get(commands[9]).execute(message, auto);
			auto = returnAuto.auto;
		}
	}
});

function getAttachment(attachments) {
	const valid = /^.*(gif|png|jpg|jpeg)$/g
	return attachments.array()
		.filter(attachment => valid.test(attachment.proxyURL))
		.map(attachment => attachment.proxyURL);
}

function getChannelMention(channelid) {
	return ("<#" + channelid + ">");
}

function getUserMention(author) {
	return ("<@" + author.id + ">");
}

function getHistory() {
	pool.getConnection(function(err, connection) {
        if (err) {
            console.log("Lost connection to mySQL!");
        } else {
            connection.query("SELECT uuid, name FROM litebans_history", function (err, result) {
                if (err) {
                    console.log('mySQL names & UUID database is not properly configured!');
                } else {
                    for (var i = 0; i < result.length; i++) {
                        uuidhist.push(result[i].uuid);
                        namehist.push(result[i].name);
                    }
                }
                connection.release();
            });
        }
    });
}

function getBans() {
	pool.getConnection(function(err, connection) {
        if (err) {
            console.log("Lost connection to mySQL!");
        } else {
            connection.query("SELECT * FROM litebans_bans", function (err, res) {
                if (err) {
                    console.log('mySQL bans database is not properly configured!');
                }
                else {
                    if (res.length > bans) {
                        var banner = res[res.length-1].banned_by_name;
                        var reason = res[res.length-1].reason;
                        var uuid = res[res.length-1].uuid;
                        var time = res[res.length-1].time;
                        var until = res[res.length-1].until;
                        if (until == -1) {
                            duration = "Forever";
                            unitTime = "";
                        }
                        else {
                            duration = until - time;
                            seconds = duration/1000;
                            if (seconds < 60) {
                                duration = seconds;
                                unitTime = "sec";
                            }
                            if (seconds >= 60 && seconds < 3600) {
                                duration = seconds/60;
                                unitTime = "min";
                            }
                            if (seconds >= 3600) {
                                duration = (seconds/60)/60;
                                unitTime = "h";
                            }
                        }
                        for (var k = 0; k < uuidhist.length; k++) {
                            if (uuid == uuidhist[k]) {
                                const banEmbed = new Discord.MessageEmbed();
                                banEmbed.setColor('#ff0000');
                                banEmbed.setTitle(`Ban Report`);
                                banEmbed.addFields(
                                        { name: 'Banned', value: `${namehist[k]}`, inline: true },
                                        { name: 'By', value: `${banner}`, inline: true },
                                        { name: 'Duration', value: `${duration}${unitTime}`, inline: true}
                                );
                                banEmbed.addField('Reason', `${reason}`, true);
								client.channels.cache.get(offenceChannel).send(banEmbed);
								console.log(`${banner} banned ${namehist[k]} for ${duration}${unitTime} for ${reason}`);
                            }
                        }
                        bans = res.length;
                    }
                }
                connection.release();
            });
        }
    });
}

function getMutes() {
	pool.getConnection(function(err, connection){
        if (err) {
            console.log("Lost connection to mySQL!");
        } else {
            connection.query("SELECT * FROM litebans_mutes", function (err, res) {
                if (err) {
                    console.log('mySQL mutes database is not properly configured!');
                    sqlConnect();
                } else {
                    if (res.length > mutes) {
                        var muter = res[res.length-1].banned_by_name;
                        var reason = res[res.length-1].reason;
                        var uuid = res[res.length-1].uuid;
                        var time = res[res.length-1].time;
                        var until = res[res.length-1].until;
                        if (until == -1) {
                            duration = "Forever";
                            unitTime = "";
                        }
                        else {
                            duration = until - time;
                            seconds = duration/1000;
                            if (seconds < 60) {
                                duration = seconds;
                                unitTime = "sec";
                            }
                            if (seconds >= 60 && seconds < 3600) {
                                duration = seconds/60;
                                unitTime = "min";
                            }
                            if (seconds >= 3600) {
                                duration = (seconds/60)/60;
                                unitTime = "h";
                            }
                        }
                        for (var k = 0; k < uuidhist.length; k++) {
                            if (uuid == uuidhist[k]) {
                                const muteEmbed = new Discord.MessageEmbed();
                                muteEmbed.setColor('#00ff00');
                                muteEmbed.setTitle(`Mute Report`);
                                muteEmbed.addFields(
                                        { name: 'Muted', value: `${namehist[k]}`, inline: true },
                                        { name: 'By', value: `${muter}`, inline: true },
                                        { name: 'Duration', value: `${duration}${unitTime}`, inline: true}
                                );
                                muteEmbed.addField('Reason', `${reason}`, true);
								client.channels.cache.get(offenceChannel).send(muteEmbed);
								console.log(`${muter} muted ${namehist[k]} for ${duration}${unitTime} for ${reason}`);
                            }
                        }
                        mutes = res.length;
                    }
                }
                connection.release();
            });
        }
    });
}

function getKicks() {
	pool.getConnection(function(err, connection){
        if (err) {
            console.log("Lost connection to mySQL!");
        } else {
            connection.query("SELECT * FROM litebans_kicks", function (err, res) {
                if (err) {
                    console.log('mySQL kicks database is not properly configured!');
                    sqlConnect();
                }
                else {
                    if (res.length > kicks) {
                        var kicker = res[res.length-1].banned_by_name;
                        var reason = res[res.length-1].reason;
                        var uuid = res[res.length-1].uuid;
                        for (var k = 0; k < uuidhist.length; k++) {
                            if (uuid == uuidhist[k]) {
                                const kickEmbed = new Discord.MessageEmbed();
                                kickEmbed.setColor('#0000ff');
                                kickEmbed.setTitle(`Kick Report`);
                                kickEmbed.addFields(
                                        { name: 'Kicked', value: `${namehist[k]}`, inline: true },
                                        { name: 'By', value: `${kicker}`, inline: true },
                                        { name: 'Reason', value: `${reason}`, inline: true}
                                );
								client.channels.cache.get(offenceChannel).send(kickEmbed);
								console.log(`${kicker} kicked ${namehist[k]} for ${reason}`);
                            }
                        }
                        kicks = res.length;
                    }
                }
                connection.release();
            });
        }
    });
}

function getWarns() {
	pool.getConnection(function(err, connection){
        if (err) {
            console.log("Lost connection to mySQL!");
        } else {
            connection.query("SELECT * FROM litebans_warnings", function (err, res) {
                if (err) {
                    console.log('mySQL warns database is not properly configured!');
                    sqlConnect();
                } else {
                    if (res.length > warns) {
                        var warner = res[res.length-1].banned_by_name;
                        var reason = res[res.length-1].reason;
                        var uuid = res[res.length-1].uuid;
                        for (var k = 0; k < uuidhist.length; k++) {
                            if (uuid == uuidhist[k]) {
                                const warnEmbed = new Discord.MessageEmbed();
                                warnEmbed.setColor('#ffa500');
                                warnEmbed.setTitle(`Warn Report`);
                                warnEmbed.addFields(
                                        { name: 'Warned', value: `${namehist[k]}`, inline: true },
                                        { name: 'By', value: `${warner}`, inline: true },
                                        { name: 'Reason', value: `${reason}`, inline: true}
                                );
								client.channels.cache.get(offenceChannel).send(warnEmbed);
								console.log(`${warner} warned ${namehist[k]} for ${reason}`);
                            }
                        }
                        warns = res.length;
                    }
                }
                connection.release();
            });
        }
    });
}