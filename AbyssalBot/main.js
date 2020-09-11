const Discord = require('discord.js');
const mysql = require('mysql');
const fs = require('fs');
const client = new Discord.Client( {partials: ["MESSAGE", "REACTION", "GUILD_MEMBER", "CHANNEL", "USER"]});
const { token, version, serverID, acceptedSuggestionsChannel, upvote, downvote, footer } = require('./config.json');
var { prefix, offenceChannel, updatesChannel, joinMessage, memberRole, status } = require('./config.json');
var defaultPrefix = prefix;
const { address, user, pass, database} = require('./mysql.json');
const { updateCreateChannel } = require('./updates/channelCreate');
const { get } = require('http');
var activity = (status + prefix + 'help');

var previousAuthorThreeAdv = '0'; var previousAuthorAdv = '0';
var previousStoryThree = ""; var previousStory = "";
var newLineThree = false; var newLine = false;
var embThree; var emb;
var setupMode = false; var setup; var setupStep = 1;
var threeWord = " "; var oneWord = " "; var storyModeT = "e"; var storyModeO = "e";
var oneWordID = ''; var threeWordID = '';
var threeWordSetup = false; var oneWordSetup = false;
var openImage = false; var setupUser = '0';
var blacklist = true; var join = true; var auto = true;

var blacklistedWords = ["nigger", "nigga", "nazi"];
var trigger = true;
var reactionTrigger = ["r", "ayy", "ping"];
var reactionResponse = [`"That's rough buddy"`, "lmao", "<user> pong!"];
var commands = ["story", "images", "offence", "blacklist", "prefix", "help", "update", "join", "trigger", "auto"];

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

const updateFiles = fs.readdirSync('./updates').filter(file => file.endsWith('.js'));
client.updates = new Discord.Collection();
for (const file of updateFiles) {
	const update = require(`./updates/${file}`);
	client.updates.set(update.name, update);
}

client.once('ready', () => {
    console.log('\nOnline and Ready! \nUsing version ' + version);
	client.user.setActivity(activity, { type: 'WATCHING'});
	pool.getConnection(function(err, connection) {
        if (err) {
			console.log("Error connecting to mySQL. Connection refused!");
        } else {
            console.log("Connected to mysql database!");
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
	client.updates.get('guildMemberAdd').execute(Discord, client, member, updatesChannel, joinMessage, memberRole);
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
			if (react.emoji.name === '✅') {
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
	if (auto) {
		var channelName = message.channel.name;
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
	if (message.channel.id === threeWord) {
		if (!message.author.bot && message.author !== previousAuthorThreeAdv) {
			var i = 0; var story = message.content;
			for (var x = 0; x < story.length; x++) {
				if (msg[x] === " ") {
					i++;
				}
			}
			if (i != 2) {
			    message.delete();
	        } else {
	            previousAuthorThreeAdv = message.author;
	            previousStoryThree = previousStoryThree + " " + story;
	            if (previousStoryThree.endsWith(".") || previousStoryThree.endsWith("!") || previousStoryThree.endsWith("?")) {
	                newLineThree = true;
	            }
	            message.delete();
	            const storyEmbed = new Discord.MessageEmbed();
    			storyEmbed.setColor(Math.floor(Math.random() * 16777214) + 1);
    			storyEmbed.setDescription(previousStoryThree);
    			storyEmbed.setAuthor(message.author.username, message.author.displayAvatarURL());
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
            message.delete();
	    }
	} else if (message.channel.id === oneWord) {
		if ((!message.author.bot) && (message.author !== previousAuthorAdv)) {
	        var story = message.content;
	        var notWord = false;
	        for (var i = 0; i < story.length; i++) {
	            if (story[i] === " ") {
	                notWord = true;
	            }
	        }
	        if (notWord) {
	            message.delete();
	        } else {
	            previousAuthorAdv = message.author;
	            if (story === "," || story === "!" || story === "?") {
	                previousStory = previousStory + story;
	            } else {
	                previousStory = previousStory + " " + story;
	            }
	            if (previousStory.endsWith(".") || previousStory.endsWith("!") || previousStory.endsWith("?")) {
	                newLine = true;
	            }
	            message.delete();
	            const storyEmbed = new Discord.MessageEmbed();
				storyEmbed.setColor(Math.floor(Math.random() * 16777214) + 1);
				storyEmbed.setDescription(previousStory);
				storyEmbed.setAuthor(message.author.username, message.author.displayAvatarURL());
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
            message.delete();
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
								threeWord = msg.slice(2, 20);
								const channel = client.channels.cache.get(threeWord);
								if (!channel) {
									message.channel.send("Unknown channel! Please try again " + getUserMention(message.author) + " !");
									return;
								}
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
								oneWord = msg.slice(2, 20);
								const channel = client.channels.cache.get(oneWord);
								if (!channel) {
									message.channel.send("Unknown channel! Please try again " + getUserMention(message.author) + " !");
									return;
								}
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
							message.channel.send("Successfully changed story mode of " + getChannelMention(oneWordID) + " from `save` to `edit`, " + getUserMention(message.author) + " !");
							storyModeO = "e";
						} else if (storyModeO === "e") {
							message.channel.send("Successfully changed story mode of " + getChannelMention(oneWordID) + " from `edit` to `save`, " + getUserMention(message.author) + " !");
							storyModeO = "s";
						}
					} else if (args[1] === "three") {
						if (storyModeT === "s") {
							message.channel.send("Successfully changed story mode of " + getChannelMention(threeWordID) + " from `save` to `edit`, " + getUserMention(message.author) + " !");
							storyModeT = "e";
						} else if (storyModeO === "e") {
							message.channel.send("Successfully changed story mode of " + getChannelMention(threeWordID) + " from `edit` to `save`, " + getUserMention(message.author) + " !");
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
			if (message.member.hasPermission('KICK_MEMBERS')) {
				if (!openImage) {
					openImage = true;
					message.channel.send("I have enabled image reactions " + getUserMention(message.author) + " !");
				} else if (openImage) { 
					openImage = false;
					message.channel.send("I have disabled image reactions " + getUserMention(message.author) + " !");
				}
			} else {
				message.channel.send("You don't have permissions to toggle reactions " + getUserMention(message.author) + " !");
			}
		} else if (command === commands[2]) { // Offence
			if (!args.length) {
				message.channel.send("Invalid arguments " + getUserMention(message.author) + " ! `" + prefix + commands[2] + " [ #channel-name ]`");
			} else {
				if (args[0].length === 21) {
					offenceChannel = args[0].slice(2, 20);
					const channel = client.channels.cache.get(offenceChannel);
					if (!channel) {
						message.channel.send("Unknown channel! Please try again " + getUserMention(message.author) + " !");
						return;
					}
					message.channel.send("Successfuly set offence channel to " + getChannelMention(channel.id) + ", " + getUserMention(message.author) + " !");
				} else {
					message.channel.send("Invalid channel " + getUserMention(message.author) +" ! Usage is `" + prefix + commands[2] + " [ #channel-name ]`");
				}
			}
		} else if (command === commands[3]) { // Blacklist
			if (message.member.hasPermission('KICK_MEMBERS')) {
				if (!args.length) {
					if (blacklist) {
						blacklist = false;
						message.channel.send("I will not delete blacklisted words now " + getUserMention(message.author) + " ! `" + prefix + commands[3] + " help` for more options!");
					} else if (!blacklist) {
						blacklist = true;
						message.channel.send("I will delete blacklisted words now" + getUserMention(message.author) + " ! `" + prefix + commands[3] + " help` for more options!");
					}
				} else if (args[0] === "help") {
					message.channel.send("Options available are `" + prefix + commands[3] + " [ add | remove | list | status | help ]`" + getUserMention(message.author) + " !");
				} else if (args[0] === "add") {
					if (args[1] === undefined) {
						message.channel.send("Usage is `" + prefix + commands[3] + " add <word>` " + getUserMention(message.author) + " ! You can see the blacklisted words by doing `" + prefix + commands[3] + " list`");
					} else {
						blacklistedWords.push(args[1]);
						message.channel.send("Successfully added `" + args[1] + "` into the blacklist " + getUserMention(message.author) + " !");
					}
				} else if (args[0] === "remove") {
					if (args[1] === undefined) {
						message.channel.send("Usage is `" + prefix + commands[3] + " remove <index>` " + getUserMention(message.author) + " ! You can find the index using `" + prefix + commands[3] + " list`");
					} else {
						if (isInt(args[1])) {
							if (args[1] <= blacklistedWords.length && args[1] > 0) {
								message.channel.send("Successfully removed `" + blacklistedWords[args[1]-1] + "` from the blacklist");
								blacklistedWords.splice(args[1]-1, 1);
							} else {
								message.channel.send("Index out of range! Please try again " + getUserMention(message.author) + " !");
							}
						} else {
							message.channel.send("Invalid index! Please try again " + getUserMention(message.author) + " !");
						}
					}
				} else if (args[0] === "list") {
					var showList = "";
					for (var i = 0; i < blacklistedWords.length; i++) {
						showList += ("(" + (i+1) + ") `" + blacklistedWords[i] + "` \n");
					}
					message.channel.send("Here are the blacklisted words " + getUserMention(message.author) + ":\n(Index) `word`\n" + showList);
				} else if (args[0] === "status") {
					if (blacklist) message.channel.send("Blacklist is on " + getUserMention(message.author) + " !");
					else if (!blacklist) message.channel.send("Blacklist is off " + getUserMention(message.author) + " !");
				} else {
					message.channel.send("Invalid argument " + getUserMention(message.author) + "! Usage is `" + prefix + commands[3] + " [ add | remove | list | status ]`");
				}
			} else {
				message.channel.send("You don't have permission to use the blacklist " + getUserMention(message.author) + " !");
			}
		} else if (command === commands[4]) { // Prefix
			if (!args.length) {
				message.reply("current prefix is `" + prefix + "`\nTo change prefix, do `" + prefix + commands[4] + " set <prefix>`");
			} else if (args[0] === "set") {
				if (message.member.hasPermission('KICK_MEMBERS')) {
					if (args[1] === undefined) {
						message.reply("to change prefix, do `" + prefix + commands[4] + " set <prefix>`");
					} else {
						if (args[1].length <= 2 && args[1].length > 0) {
							prefix = args[1];
							message.reply("current prefix is now set to `" + prefix + "`\nTo reset the prefix, type `" + prefix + commands[4] + " reset`.");
							activity = (status + prefix + 'help');
							client.user.setActivity(activity, { type: 'WATCHING'});
						} else {
							message.channel.send("Prefix `" + args[1] + "` must be 2 or less characters! Please try again " + getUserMention(message.author) + " !");
						}
					}
				}
			} else if (args[0] === "reset") {
				if (message.member.hasPermission('KICK_MEMBERS')) {
					prefix = defaultPrefix;
					message.reply("current prefix has been reset to `" + prefix + "`");
					activity = (status + prefix + 'help');
					client.user.setActivity(activity, { type: 'WATCHING'});
				}
			} else {
				message.channel.send("Invalid argument " + getUserMention(message.author) + "! Usage is `" + prefix + commands[4] + " [ set | reset ]`");
			}
		} else if (command === commands[5]) { // Help
			var showHelp = "";
			for (var i = 0; i < commands.length; i++) {
				showHelp += ("`" + commands[i] + "`\n");
			}
			message.reply("here's the available commands from <@" + client.user.id + ">\nPrefix = `" + prefix + "`\n" + showHelp);
		} else if (command === commands[6]) { // Updates
			if (message.member.hasPermission('KICK_MEMBERS')) {
				if (!args.length) {
					message.reply("command usage is `" + prefix + commands[6] + " set [ #channel ]`");
				} else if (args[0] === "set") {
					if (args[1].length === 21) {
						updatesChannel = args[1].slice(2, 20);
						const channel = client.channels.cache.get(updatesChannel);
						if (!channel) {
							message.channel.send("Unknown channel! Please try again " + getUserMention(message.author) + " !");
							return;
						}
						message.channel.send("Successfuly set updates channel to " + getChannelMention(channel.id) + ", " + getUserMention(message.author) + " !");
					} else {
						message.channel.send("Invalid channel " + getUserMention(message.author) + " ! Usage is `" + prefix + commands[6] + " set [ #channel ]`");
					}
				} else {
					message.channel.send("Invalid arguments " + getUserMention(message.author) + " ! Usage is `" + prefix + commands[6] + " set [ #channel ]`");
				}
			} else {
				message.channel.send("You don't have permission to set updates channel " + getUserMention(message.author) + " !");
			}
		} else if (command === commands[7]) { // Join
			if (message.member.hasPermission('KICK_MEMBERS')) {
				if (!args.length) {
					if (join) {
						join = false;
						message.channel.send("Turned off join messages " + getUserMention(message.author) + " ! For more options, `" + prefix + commands[7] + " [ set | view | role ]`");
					} else if (!join) {
						join = true;
						message.channel.send("Turned on join messages " + getUserMention(message.author) + " ! For more options, `" + prefix + commands[7] + " [ set | view | role ]`");
					}
				} else if (args[0] === "set") {
					if (args[1] === undefined) {
						message.channel.send("Invalid arguments " + getUserMention(message.author) + " ! Usage is `" + prefix + commands[7] + " set [ message ]`");
					} else {
						args.shift();
						joinMessage = args.join(" ");
						message.channel.send("Succesfully changed join message to `" + joinMessage +"` " + getUserMention(message.author) + " !");
						const joinEmbed = new Discord.MessageEmbed();
						joinEmbed.setTitle("New Member Alert!");
						joinEmbed.setDescription(`${joinMessage}, ${message.author}!`);
						const preview = message.channel.send("This is a preview of the join message, it will be deleted in 5 seconds. \n", joinEmbed);
						(await preview).delete({timeout: 5000});
					}
				} else if (args[0] === "view") {
					const joinEmbed = new Discord.MessageEmbed();
					joinEmbed.setTitle("New Member Alert!");
					joinEmbed.setDescription(`${joinMessage}, ${message.author}!`);
					joinEmbed.setFooter(footer);
					const preview = message.channel.send("This is a preview of the join message, it will be deleted in 5 seconds. \n", joinEmbed);
					(await message).delete({timeout: 5000});
					(await preview).delete({timeout: 5000});
				} else if (args[0] === "role") {
					if (args[1] === undefined) {
						const rl = message.member.guild.roles.cache.find(role => role.id === memberRole);
						if (!rl) {
							message.channel.send("Join role is not set " + getUserMention(message.author) + " ! To set a join role, `" + prefix + commands[7] + " role [ @role ]`");
						} else {
							const joinEmbed = new Discord.MessageEmbed();
							joinEmbed.setDescription("Current join role is set to <@&" + rl.id + ">");
							joinEmbed.setFooter(footer);
							message.channel.send(joinEmbed);
						}
					}
					else if (args[1].length === 22) {
						memberRole = args[1].slice(3,21);
						const rl = message.member.guild.roles.cache.find(role => role.id === memberRole);
						message.channel.send("Successfully set <@&" + rl.id + "> as join role " + getUserMention(message.author) + " !");
					} else {
						message.channel.send("Invalid role " + getUserMention(message.author) + " ! Please try again!");
					}
				} else {
					message.channel.send("Invalid arguments " + getUserMention(message.author) + " ! Usage is `" + prefix + commands[7] + " [ set | view | role ]`");
				}
			} else {
				message.channel.send("You don't have permission to setup join messages " + getUserMention(message.author) + " !");
			}
		} else if (command === commands[8]) { // Trigger
			if (message.member.hasPermission('KICK_MEMBERS')) {
				if (!args.length) {
					if (!trigger) {
						trigger = true;
						message.channel.send("Now listening for trigger words, " + getUserMention(message.author) + ". For more options, `" + prefix + commands[8] + " [ list | add | remove | status ]`");
					} else if (trigger) {
						trigger = false;
						message.channel.send("Stopped listening for trigger words, " + getUserMention(message.author) + ". For more options, `" + prefix + commands[8] + " [ list | add | remove | status ]`");
					}
				} else {
					if (args[0] === undefined) {
						message.channel.send("Invalid argument " + getUserMention(message.author) + " ! Usage is `" + prefix + commands[8] + " [ list | add | remove | status ]`");
					} else if (args[0] === "list") {
						var showList = "";
						for (var i = 0; i < reactionTrigger.length; i++) {
							showList += ("(" + (i+1) + ") `" + reactionTrigger[i] + "` = `" + reactionResponse[i] +"`\n");
						}
						message.channel.send("Here are the triggers & their responses " + getUserMention(message.author) + ":\n(Index) `trigger` = `response`\n" + showList);
					} else if (args[0] === "add") {
						if (args[1] === undefined || args[2] === undefined) {
							message.channel.send("Usage is `" + prefix + commands[8] + " add <trigger> <response>` " + getUserMention(message.author) + " ! You can see the trigger list by doing `" + prefix + commands[8] + " list`");
						} else {
							const trigger = args[1];
							reactionTrigger.push(trigger);
							args.shift(); args.shift();
							const response = args.join(" ");
							reactionResponse.push(response);
							message.channel.send("Successfully added `" + trigger + "` with response `" + response + "`, " + getUserMention(message.author) + " !");
						}
					} else if (args[0] === "remove") {
						if (args[1] === undefined) {
							message.channel.send("Usage is `" + prefix + commands[8] + " remove <index>` " + getUserMention(message.author) + " ! You can find the index using `" + prefix + commands[8] + " list`");
						} else {
							if (isInt(args[1])) {
								if (args[1] <= reactionTrigger.length && args[1] > 0) {
									message.channel.send("Successfully removed `" + reactionTrigger[args[1]-1] + "` from the trigger list " + getUserMention(message.author) + " !");
									reactionTrigger.splice(args[1]-1, 1);
									reactionResponse.splice(args[1]-1, 1);
								} else {
									message.channel.send("Index out of range! Please try again " + getUserMention(message.author) + " !");
								}
							} else {
								message.channel.send("Invalid index! Please try again " + getUserMention(message.author) + " !");
							}
						}
					} else if (args[0] === "status") {
						if (trigger) message.channel.send("Still listening for triggers " + getUserMention(message.author) + " !");
						else if (!trigger) message.channel.send("Not listening for triggers " + getUserMention(message.author) + " !");
					}
				}
			} else {
				message.channel.send("You don't have permissions to add trigger words " + getUserMention(message.author) + " !");
			}
		} else if (command === commands[9]) { // Auto
			if (message.member.hasPermission('KICK_MEMBERS')) {
				if (auto) {
					auto = false;
					message.channel.send("Turned off auto-embeds " + getUserMention(message.author) + " !");
				} else if (!auto) {
					auto = true;
					message.channel.send("Turned on auto-embeds " + getUserMention(message.author) + " !");
				}
			} else {
				message.channel.send("You don't have permission to toggle embeds " + getUserMention(message.author) + " !");
			}
		}
	}
});

function getAttachment(attachments) {
	const valid = /^.*(gif|png|jpg|jpeg)$/g
	return attachments.array()
		.filter(attachment => valid.test(attachment.proxyURL))
		.map(attachment => attachment.proxyURL);
}

function isInt(value) {
	var x;
	return isNaN(value) ? !1 : (x = parseFloat(value), (0 | x) === x);
}

function getChannelMention(channelid) {
	return ("<#" + channelid + ">");
}

function getUserMention(author) {
	return ("<@" + author.id + ">");
}

function getHistory() {
	pool.getConnection(function(err, connection) {
        if(err){
            console.log("Lost connection to mySQL!");
        }
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
    });
}

function getBans() {
	pool.getConnection(function(err, connection) {
        if(err){
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
        if(err){
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
        if(err){
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
        if(err){
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