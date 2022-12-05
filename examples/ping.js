const { Client } = require("touchguild");
const client = new Client({ token: "TOKEN" });

client.on("ready", () => {
    console.log("Ready as", client.user.username);
});

client.on("error", (err) => {
    console.error(err);
});

client.on("messageCreate", async (message) => {
    if ((await message.member).bot == true) return;
    if (message.content == "!ping") {
        const GettingPing = "Please wait..";
        const PingResultText1 = "your ping: `";
        const PingResultText2 = "ms`";

        await message.createMessage({ content: GettingPing, replyMessageIds: [message.id] });
        const ping = Date.now() - message.createdAt.getTime();
        await message.editOriginal({ content: PingResultText1 + ping + PingResultText2 });
    }
});

client.connect();