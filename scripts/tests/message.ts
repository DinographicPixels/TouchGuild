import { Client } from "../../lib";
const client = new Client({ token: process.env.TOKEN as string });

let success = 0;
let maxSuccess = 5;

client.on("ready", () => {
    console.log(`Logged as ${client.user?.username}`);
    client.createMessage("74a7bc35-21ea-465d-9554-c82ccba067b7", { content: "test message" });
    client.createMessage("74a7bc35-21ea-465d-9554-c82ccba067b7", { content: "test message 2" });
    success++;
});

client.on('error', (err) => {
    console.error(err);
});

client.on("messageCreate", async (message) => {
    console.log(client.user?.id);
    if (message.memberID === client.user?.id) {
        message.edit({ content: "edited testmessage" });
        success++;
    }
});

client.on("messageUpdate", (message, oldMessage) => {
    if (message.memberID === client.user?.id) {
        message.delete();
        success++;
    }
    if (oldMessage !== null) {
        success++
        if (oldMessage.content !== message.content) success++;
    }
})

client.on("messageDelete", (message) => {
    success++;
    if (success >= maxSuccess) {
        console.log("Message test sucess.");
        client.disconnect();
    } else throw new Error("Test failed");
});


client.connect();
