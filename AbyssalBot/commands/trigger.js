module.exports = {
    name: 'trigger',
    description: 'Add trigger words and responses',
    execute(message, args, prefix, commands, trigger, reactionTrigger, reactionResponse) {
        if (message.member.hasPermission('KICK_MEMBERS')) {
            if (!args.length) {
                if (!trigger) {
                    trigger = true;
                    message.channel.send("Now listening for trigger words, <@" + message.author + ">. For more options, `" + prefix + commands[8] + " [ list | add | remove | status ]`");
                } else if (trigger) {
                    trigger = false;
                    message.channel.send("Stopped listening for trigger words, <@" + message.author + ">. For more options, `" + prefix + commands[8] + " [ list | add | remove | status ]`");
                }
            } else {
                if (args[0] === undefined) {
                    message.channel.send("Invalid argument <@" + message.author + "> ! Usage is `" + prefix + commands[8] + " [ list | add | remove | status ]`");
                } else if (args[0] === "list") {
                    var showList = "";
                    for (var i = 0; i < reactionTrigger.length; i++) {
                        showList += ("(" + (i+1) + ") `" + reactionTrigger[i] + "` = `" + reactionResponse[i] +"`\n");
                    }
                    message.channel.send("Here are the triggers & their responses <@" + message.author + ">:\n(Index) `trigger` = `response`\n" + showList);
                } else if (args[0] === "add") {
                    if (args[1] === undefined || args[2] === undefined) {
                        message.channel.send("Usage is `" + prefix + commands[8] + " add <trigger> <response>` <@" + message.author + "> ! You can see the trigger list by doing `" + prefix + commands[8] + " list`");
                    } else {
                        const triggerWord = args[1];
                        reactionTrigger.push(triggerWord);
                        args.shift(); args.shift();
                        const response = args.join(" ");
                        reactionResponse.push(response);
                        message.channel.send("Successfully added `" + triggerWord + "` with response `" + response + "`, <@" + message.author + "> !");
                    }
                } else if (args[0] === "remove") {
                    if (args[1] === undefined) {
                        message.channel.send("Usage is `" + prefix + commands[8] + " remove <index>` <@" + message.author + "> ! You can find the index using `" + prefix + commands[8] + " list`");
                    } else {
                        if (isInt(args[1])) {
                            if (args[1] <= reactionTrigger.length && args[1] > 0) {
                                message.channel.send("Successfully removed `" + reactionTrigger[args[1]-1] + "` from the trigger list <@" + message.author + "> !");
                                reactionTrigger.splice(args[1]-1, 1);
                                reactionResponse.splice(args[1]-1, 1);
                            } else {
                                message.channel.send("Index out of range! Please try again <@" + message.author + "> !");
                            }
                        } else {
                            message.channel.send("Invalid index! Please try again <@" + message.author + "> !");
                        }
                    }
                } else if (args[0] === "status") {
                    if (trigger) message.channel.send("Still listening for triggers <@" + message.author + "> !");
                    else if (!trigger) message.channel.send("Not listening for triggers <@" + message.author + "> !");
                }
            }
            return {
                trigger,
                reactionTrigger,
                reactionResponse
            }
        } else {
            message.channel.send("You don't have permissions to add trigger words <@" + message.author + "> !");
        }
    }
}

function isInt(value) {
	var x;
	return isNaN(value) ? !1 : (x = parseFloat(value), (0 | x) === x);
}