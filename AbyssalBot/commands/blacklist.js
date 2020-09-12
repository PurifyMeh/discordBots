module.exports = {
    name: 'blacklist',
    description: 'Add blacklisted words',
    execute(message, args, blacklist, blacklistedWords, prefix, commands) {
        if (message.member.hasPermission('KICK_MEMBERS')) {
            if (!args.length) {
                if (blacklist) {
                    blacklist = false;
                    message.channel.send("I will not delete blacklisted words now <@" + message.author + "> ! `" + prefix + commands[3] + " help` for more options!");
                } else if (!blacklist) {
                    blacklist = true;
                    message.channel.send("I will delete blacklisted words now <@" + message.author + "> ! `" + prefix + commands[3] + " help` for more options!");
                }
            } else if (args[0] === "help") {
                message.channel.send("Options available are `" + prefix + commands[3] + " [ add | remove | list | status | help ]` <@" + message.author + "> !");
            } else if (args[0] === "add") {
                if (args[1] === undefined) {
                    message.channel.send("Usage is `" + prefix + commands[3] + " add <word>` <@" + message.author + "> ! You can see the blacklisted words by doing `" + prefix + commands[3] + " list`");
                } else {
                    blacklistedWords.push(args[1]);
                    message.channel.send("Successfully added `" + args[1] + "` into the blacklist <@" + message.author + "> !");
                }
            } else if (args[0] === "remove") {
                if (args[1] === undefined) {
                    message.channel.send("Usage is `" + prefix + commands[3] + " remove <index>` <@" + message.author + "> ! You can find the index using `" + prefix + commands[3] + " list`");
                } else {
                    if (isInt(args[1])) {
                        if (args[1] <= blacklistedWords.length && args[1] > 0) {
                            message.channel.send("Successfully removed `" + blacklistedWords[args[1]-1] + "` from the blacklist");
                            blacklistedWords.splice(args[1]-1, 1);
                        } else {
                            message.channel.send("Index out of range! Please try again <@" + message.author + "> !");
                        }
                    } else {
                        message.channel.send("Invalid index! Please try again <@" + message.author + "> !");
                    }
                }
            } else if (args[0] === "list") {
                var showList = "";
                for (var i = 0; i < blacklistedWords.length; i++) {
                    showList += ("(" + (i+1) + ") `" + blacklistedWords[i] + "` \n");
                }
                message.channel.send("Here are the blacklisted words <@" + message.author + "> :\n(Index) `word`\n" + showList);
            } else if (args[0] === "status") {
                if (blacklist) message.channel.send("Blacklist is on <@" + message.author + "> !");
                else if (!blacklist) message.channel.send("Blacklist is off <@" + message.author + "> !");
            } else {
                message.channel.send("Invalid argument <@" + message.author + "> ! Usage is `" + prefix + commands[3] + " [ add | remove | list | status ]`");
            }
            return {
                blacklistedWords,
                blacklist
            }
        } else {
            message.channel.send("You don't have permission to use the blacklist <@" + message.author + "> !");
        }
    }
}

function isInt(value) {
	var x;
	return isNaN(value) ? !1 : (x = parseFloat(value), (0 | x) === x);
}