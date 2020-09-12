module.exports = {
    name: 'trigger',
    description: 'Add trigger words and responses',
    execute(message, args, prefix, command, trigger, reactionTrigger, reactionResponse) {
        if (!args.length) {
            if (message.member.hasPermission('KICK_MEMBERS')) {
                if (!trigger) {
                    trigger = true;
                    message.channel.send("Now listening for trigger words, <@" + message.author + ">. For more options, `" + prefix + command + " [ list | add | remove | edit | status ]`");
                } else if (trigger) {
                    trigger = false;
                    message.channel.send("Stopped listening for trigger words, <@" + message.author + ">. For more options, `" + prefix + command + " [ list | add | remove | edit | status ]`");
                }
            } else {
                message.channel.send("You don't have permission to toggle triggers <@" + message.author + "> ! You can use `" + prefix + command + " [ list | status ]` instead!");
            }
        } else {
            if (args[0] === undefined) {
                message.channel.send("Invalid argument <@" + message.author + "> ! Usage is `" + prefix + command + " [ list | add | remove | edit |  status ]`");
            } else if (args[0] === "list") {
                var showList = "";
                for (var i = 0; i < reactionTrigger.length; i++) {
                    showList += ("(" + (i+1) + ") `" + reactionTrigger[i] + "` = `" + reactionResponse[i] +"`\n");
                }
                message.channel.send("Here are the triggers & their responses <@" + message.author + ">:\n(Index) `trigger` = `response`\n" + showList);
            } else if (args[0] === "add") {
                if (message.member.hasPermission('KICK_MEMBERS')) {
                    if (args[1] === undefined || args[2] === undefined) {
                        message.channel.send("Usage is `" + prefix + command + " add <trigger> <response>` <@" + message.author + "> ! You can see the trigger list by doing `" + prefix + command + " list`");
                    } else {
                        const triggerWord = args[1];
                        reactionTrigger.push(triggerWord);
                        args.shift(); args.shift();
                        const response = args.join(" ");
                        reactionResponse.push(response);
                        message.channel.send("Successfully added `" + triggerWord + "` with response `" + response + "`, <@" + message.author + "> !");
                    }
                } else {
                    message.channel.send("You don't have permissions to add trigger words <@" + message.author + "> ! You can use `" + prefix + command + " [ list | status ]` instead!");
                }
            } else if (args[0] === "remove") {
                if (message.member.hasPermission('KICK_MEMBERS')) {
                    if (args[1] === undefined) {
                        message.channel.send("Usage is `" + prefix + command + " remove <index>` <@" + message.author + "> ! You can find the index using `" + prefix + command + " list`");
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
                } else {
                    message.channel.send("You don't have permissions to remove trigger words <@" + message.author + "> ! You can use `" + prefix + command + " [ list | status ]` instead!");
                }
            } else if (args[0] === "status") {
                if (trigger) message.channel.send("Still listening for triggers <@" + message.author + "> !");
                else if (!trigger) message.channel.send("Not listening for triggers <@" + message.author + "> !");
            } else if (args[0] === "edit") {
                if (message.member.hasPermission('KICK_MEMBERS')) {
                    if (args[1] === undefined) {
                        message.channel.send("Usage is `" + prefix + command + " edit <index> [ trigger | response ] <new trigger | new response>` <@" + message.author + "> ! You can find the index using `" + prefix + command + " list`");
                    } else {
                        if (isInt(args[1])) {
                            if (args[1] <= reactionTrigger.length && args[1] > 0) {
                                const index = args[1]-1;
                                if (args[2] === "trigger") {
                                    const newT = args[3];
                                    message.channel.send("Successfully edited index " + index + " trigger from `" + reactionTrigger[index] + "` to `" + newT + "` <@" + message.author + "> !");
                                    reactionTrigger[index] = newT;
                                } else if (args[2] === "response") {
                                    const oldR = reactionResponse[index];
                                    args.shift(); args.shift(); args.shift();
                                    const newR = args.join(" ");
                                    message.channel.send("Successfully edited index " + index + " response from `" + oldR + "` to `" + newR + "` <@" + message.author + "> !");
                                    reactionResponse[index] = newR;
                                }
                            } else {
                                message.channel.send("Index out of range! Please try again <@" + message.author + "> !");
                            }
                        } else {
                            message.channel.send("Invalid index! Please try again <@" + message.author + "> !");
                        }
                    }
                } else {
                    message.channel.send("You don't have permission to edit triggers or responses <@" + message.author + "> !")
                }
            }
        }
        return {
            trigger,
            reactionTrigger,
            reactionResponse
        }
    }
}

function isInt(value) {
	var x;
	return isNaN(value) ? !1 : (x = parseFloat(value), (0 | x) === x);
}