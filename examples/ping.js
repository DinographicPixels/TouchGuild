const { Client } = require("touchguild");

const client = new Client({ token: 'TOKEN' });

client.on("ready", () => {
    console.log('Ready as', client.user.username);
})

client.on("error", (err) => {
    console.error(err);
});

client.on("messageCreate", async (message) => {
    if (message.content == '!ping'){
        var GettingPing = "Checkin' ya ping..";
        var PingResultText1 = "your ping: `";
        var PingResultText2 = "ms`";

        await message.createMessage({ content: GettingPing });
        let ping = Date.now() - message.createdAt;
        await message.editOriginalMessage({ content: PingResultText1 + ping + PingResultText2 });
    }
})

client.connect();
