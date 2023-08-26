import { Client } from "../../lib";
const client = new Client({ token: process.env.TOKEN as string });

client.on("ready", async () => {
    console.log(`Logged as ${client.user?.username}`);
    var chat = await client.createChannel("NEa5J8GE", "PIZZANANAS", "chat", { description: "We love Pizza 🍕" });
    var announcement = await client.createChannel("NEa5J8GE", "PIZZANANAS", "announcements", { description: "We love Pizza 🍕" });
    var calendar = await client.createChannel("NEa5J8GE", "PIZZANANAS", "calendar", { description: "We love Pizza 🍕" });
    var forums = await client.createChannel("NEa5J8GE", "PIZZANANAS", "forums", { description: "We love Pizza 🍕" });
    var media = await client.createChannel("NEa5J8GE", "PIZZANANAS", "media", { description: "We love Pizza 🍕" });
    var voice = await client.createChannel("NEa5J8GE", "PIZZANANAS", "voice", { description: "We love Pizza 🍕" });
    var docs = await client.createChannel("NEa5J8GE", "PIZZANANAS", "docs", { description: "We love Pizza 🍕" });
    var list = await client.createChannel("NEa5J8GE", "PIZZANANAS", "list", { description: "We love Pizza 🍕" });
    var scheduling = await client.createChannel("NEa5J8GE", "PIZZANANAS", "scheduling", { description: "We love Pizza 🍕" });
    var stream = await client.createChannel("NEa5J8GE", "PIZZANANAS", "stream", { description: "We love Pizza 🍕" });
    console.log("📧 The Channels were created")
    await chat.edit({ description: "We love Pizza 🍕\nWith Nutella", isPublic: true, name:"P-I-Z-Z-A" });
    await announcement.edit({ description: "We love Pizza 🍕\nWith Nutella", isPublic: true, name:"P-I-Z-Z-A" });
    await calendar.edit({ description: "We love Pizza 🍕\nWith Nutella", isPublic: true, name:"P-I-Z-Z-A" });
    await forums.edit({ description: "We love Pizza 🍕\nWith Nutella", isPublic: true, name:"P-I-Z-Z-A" });
    await media.edit({ description: "We love Pizza 🍕\nWith Nutella", isPublic: true, name:"P-I-Z-Z-A" });
    await voice.edit({ description: "We love Pizza 🍕\nWith Nutella", isPublic: true, name:"P-I-Z-Z-A" });
    await docs.edit({ description: "We love Pizza 🍕\nWith Nutella", isPublic: true, name:"P-I-Z-Z-A" });
    await list.edit({ description: "We love Pizza 🍕\nWith Nutella", isPublic: true, name:"P-I-Z-Z-A" });
    await scheduling.edit({ description: "We love Pizza 🍕\nWith Nutella", isPublic: true, name:"P-I-Z-Z-A" });
    await stream.edit({ description: "We love Pizza 🍕\nWith Nutella", isPublic: true, name:"P-I-Z-Z-A" });
    console.log("✏️ The Channels were edited")
    await chat.archive();
    await announcement.archive();
    await calendar.archive();
    await forums.archive();
    await media.archive();
    await voice.archive();
    await docs.archive();
    await list.archive();
    await scheduling.archive();
    await stream.archive();
    console.log("📦 The Channels were archived")
    await chat.unarchive();
    await announcement.unarchive();
    await calendar.unarchive();
    await forums.unarchive();
    await media.unarchive();
    await voice.unarchive();
    await docs.unarchive();
    await list.unarchive();
    await scheduling.unarchive();
    await stream.unarchive();
    console.log("📦 The Channels were unarchived")
    await chat.delete();
    await announcement.delete();
    await calendar.delete();
    await forums.delete();
    await media.delete();
    await voice.delete();
    await docs.delete();
    await list.delete();
    await scheduling.delete();
    await stream.delete();
    console.log("🗑️ The Channels were deleted")
    client.disconnect();
});

client.connect()