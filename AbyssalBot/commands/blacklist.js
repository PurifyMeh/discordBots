module.exports = {
    name: 'blacklist',
    description: 'Add blacklisted words',
    execute(message, args, blacklist, blacklistedWords, prefix, command) {
        if (!args.length) {
            if (message.member.hasPermission('KICK_MEMBERS')) {
                if (blacklist) {
                    blacklist = false;
                    message.channel.send("I will not delete blacklisted words now <@" + message.author + "> ! `" + prefix + command + " help` for more options!");
                } else if (!blacklist) {
                    blacklist = true;
                    message.channel.send("I will delete blacklisted words now <@" + message.author + "> ! `" + prefix + command + " help` for more options!");
                }
            } else {
                message.channel.send("You don't have permission to use toggle blacklist <@" + message.author + "> ! You can use `" + prefix + command + " [ list | status ]` instead!");
            }
        } else if (args[0] === "help") {
            message.channel.send("Options available are `" + prefix + command + " [ add | remove | list | status | help ]` <@" + message.author + "> !");
        } else if (args[0] === "add") {
            if (message.member.hasPermission('KICK_MEMBERS')) {
                if (args[1] === undefined) {
                    message.channel.send("Usage is `" + prefix + command + " add <word>` <@" + message.author + "> ! You can see the blacklisted words by doing `" + prefix + command + " list`");
                } else {
                    blacklistedWords.push(args[1]);
                    message.channel.send("Successfully added `" + args[1] + "` into the blacklist <@" + message.author + "> !");
                }
            } else {
                message.channel.send("You don't have permission to add to the blacklist <@" + message.author + "> ! You can use `" + prefix + command + " [ list | status ]` instead!");
            }
        } else if (args[0] === "remove") {
            if (message.member.hasPermission('KICK_MEMBERS')) {
                if (args[1] === undefined) {
                    message.channel.send("Usage is `" + prefix + command + " remove <index>` <@" + message.author + "> ! You can find the index using `" + prefix + command + " list`");
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
            } else {
                message.channel.send("You don't have permission to remove from the blacklist <@" + message.author + "> ! You can use `" + prefix + command + " [ list | status ]` instead!");
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
            message.channel.send("Invalid argument <@" + message.author + "> ! Usage is `" + prefix + command + " [ add | remove | list | status ]`");
        }
        return {
            blacklistedWords,
            blacklist
        }
    }
}

function isInt(value) {
	var x;
	return isNaN(value) ? !1 : (x = parseFloat(value), (0 | x) === x);
}