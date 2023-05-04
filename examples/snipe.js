// This script is only working in current development builds due to Message.oldContent changes.

// Importing TouchGuild.Client
const { Client, Message } = require("touchguild");

// Creating client & connecting.
const client = new Client({
    token: "TOKEN"
});

client.on("ready", () => {
    console.log("Ready as", client.user?.username);
});

client.on("error", (err) => {
    console.log(err);
});

// Declaring deleted & edited message maps.
const lastDeletedMessage = new Map();
const lastEditedMessage = new Map();

// Standard command handler, message detection.
client.on("messageCreate", (message) => {
    const args = message.content?.split(" "); // array of args.

    message.content = message.content?.toLowerCase();

    if (message.content?.startsWith("!snipe") && args?.[1]) {
        if (!lastDeletedMessage.has(args?.[1])) return message.createMessage({ content: `No deleted message detected for: *${args?.[1]}*` });
        return message.createMessage({ content: `Last deleted message content: ${lastDeletedMessage.get(args?.[1])}` });
    } else if (message.content == "!snipe") {
        if (!lastDeletedMessage.has(message.channelID)) return message.createMessage({ content: "No deleted message detected for the moment." });
        return message.createMessage({ content: `Last deleted message content: ${lastDeletedMessage.get(message.channelID)}` });
    }

    if (message.content?.startsWith("!editsnipe") && args?.[1]) {
        if (!lastEditedMessage.has(args?.[1])) return message.createMessage({ content: `No edited message detected for: *${args?.[1]}*` });
        return message.createMessage({ content: `Last edited message content: ${lastEditedMessage.get(args?.[1])}` });
    } else if (message.content == "!editsnipe") {
        if (!lastEditedMessage.has(message.channelID)) return message.createMessage({ content: "No edited message detected for the moment." });
        return message.createMessage({ content: `Last edited message content: ${lastEditedMessage.get(message.channelID)}` });
    }
});

// Detect when message is updated/deleted & save their content.
client.on("messageUpdate", (message, oldMessage) => {
    if (!oldMessage) return; // return if message oldContent not cached.
    lastEditedMessage.set(message.channelID, oldMessage.content);
});

client.on("messageDelete", (message) => {
    if (message instanceof Message) {
        lastDeletedMessage.set(message.channelID, message.content);
    } else return;
});

client.connect();
