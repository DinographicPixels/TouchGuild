// Importing TouchGuild.
import * as TouchGuild from 'touchguild';

// Creating client & connecting.
const client = new TouchGuild.Client({token: 'token here', REST: true});
client.connect();

// Declaring deleted & edited message maps.
var lastDeletedMessage = new Map();
var lastEditedMessage = new Map();

// Standard command handler, message detection.
client.on('messageCreate', (message)=> {
    let args = message.content.split(' '); // array of args.

    message.content = message.content.toLowerCase();

    if (message.content.startsWith('!snipe') && args[1]){
        if (!lastDeletedMessage.has(args[1])) return message.createMessage({content: `No deleted message detected for: *${args[1]}*`});
        return message.createMessage({content: `Last deleted message content: ${lastDeletedMessage.get(args[1])}`});
    }else if (message.content == '!snipe'){
        if (!lastDeletedMessage.has(message.channelID)) return message.createMessage({content: 'No deleted message detected for the moment.'});
        return message.createMessage({content: `Last deleted message content: ${lastDeletedMessage.get(message.channelID)}`});
    }

    if (message.content.startsWith('!editsnipe') && args[1]){
        if (!lastEditedMessage.has(args[1])) return message.createMessage({content: `No edited message detected for: *${args[1]}*`});
        return message.createMessage({content: `Last edited message content: ${lastEditedMessage.get(args[1])}`});
    }else if (message.content == '!editsnipe'){
        if (!lastEditedMessage.has(message.channelID)) return message.createMessage({content: 'No edited message detected for the moment.'});
        return message.createMessage({content: `Last edited message content: ${lastEditedMessage.get(message.channelID)}`});
    }
})

// Detect when message is updated/deleted & save their content.
client.on('messageUpdate', (message)=> {
    if (!message.oldContent) return; // return if message oldContent not cached.
    lastEditedMessage.set(message.channelID, message.oldContent);
})

client.on('messageDelete', (message)=> {
    if (!message.oldContent) return; // return if message oldContent not cached.
    lastDeletedMessage.set(message.channelID, message.oldContent);
})


/**
 * Usage:
 *   !snipe (snipes the last deleted message of the current channel)
 *   !editsnipe (editsnipes the last edited message of the current channel)
 *   !snipe CHANNELID (same as snipe but custom channel id)
 *   !editsnipe CHANNELID (same as editsnipe but custom channel id)
 */

// Powered by TouchGuild.