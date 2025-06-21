import { Client } from "../../lib";
const client = new Client({ token: process.env.TOKEN as string});

const guildID = "Rpm1GWol";
const textChannelID = "72db369a-5506-4169-8c9a-44492028628e";
const announcementChannelID = "91595989-6f5c-4bf4-8787-a48acddf41cd";
const calendarChannelID = "28e022d0-e206-4e78-abb2-47b4e2bea207";
const docChannelID = "5896f92a-edc3-42bc-9806-3df79ef5e7ae";
const forumChannelID = "746d881e-67c5-44a8-b9cf-ebf846c1c1bf";
const listChannelID = "91fc5ce3-c62d-4c19-ae9d-823323b35b56";

client.on("ready", async () => {
    console.log(`Logged as ${client.user?.username}`);
    console.log("📧 Sending Message")
    let message = await client.rest.channels.createMessage(textChannelID, { content: "We love Pizza 🍕" });
    console.log("📧 The Message was sent")
    await message.pin();
    console.log("📌 The Message was pinned")
    await message.unpin();
    console.log("📌 The Message was unpinned")
    await message.edit({
        content: "We love Pizza 🍕",
        embeds: [{
            title: "Special Ingredient",
            description: "Better with pineapple 🍍",
            color: 0xFFE933
        }]
    });
    console.log("✏️ The Message was edited")
    await message.edit({
        content: "We love Pizza 🍕"
    });
    console.log("✏️ The Message was edited (embeds removed)")
    await message.createReaction(90002573)
    console.log("👍 The Reaction was created")
    await message.deleteReaction(90002573)
    console.log("👍 The Reaction was deleted")
    await message.createReaction(90002573)
    await message.createReaction(90002552)
    await message.createReaction(90002583)
    console.log("👍 The Reactions were created")
    await client.rest.channels.bulkDeleteReactions(message.channelID, "ChannelMessage", message.id)
    console.log("👍 The Reactions were deleted")
    await message.delete();
    console.log("🗑️ The Message was deleted")
    let cache = await client.getMessage(guildID, message.channelID, message.id)
    if (!cache) console.log("❌ The Message was not cached")
    if (cache) console.log("✅ The Message was cached")
    console.log("--------------------")
    console.log("📧 Sending Announcement")
    let announcement = await client.rest.channels.createAnnouncement(announcementChannelID, {title: "Pizza",content: "We love Pizza 🍕",});
    console.log("📧 The Announcement was sent")
    let comment = await client.rest.channels.createAnnouncementComment(announcement.channelID, announcement.id, {content: "With Pineapple"});
    console.log("📧 The Announcement Comment was sent")
    await announcement.createReaction(90002573)
    console.log("👍 The Reaction was created")
    await announcement.deleteReaction(90002573)
    console.log("👍 The Reaction was deleted")
    await comment.edit({content: "I like it with Nutella" });
    await announcement.edit({title: "P-I-Z-Z-A",content: "We love Pizza 🍕\nWith Nutella"});
    console.log("✏️ The Announcement was edited")
    await comment.delete();
    console.log("🗑️ The Announcement Comment was deleted")
    await announcement.delete();
    console.log("🗑️ The Announcement was deleted")
    console.log("--------------------")
    console.log("📧 Sending Calendar Event")
    let event = await client.rest.channels.createCalendarEvent(calendarChannelID, {
        name: "Pizza Party",
        description: "We love Pizza 🍕",
        color: 0xFFE933,
        autofillWaitlist: true,
        duration: 600000,
        isAllDay: true,
        isPrivate: false,
        location: "Italy",
        startsAt: `${new Date(Date.now() + 86400000).toISOString().split(".")[0]}Z`,
        url: "https://www.google.com/search?q=pizza",
    });
    console.log("📧 The Calendar Event was created")
    let Comment = await client.rest.channels.createCalendarComment(event.channelID, event.id, {content: "With Pineapple it's better"});
    console.log("📧 The Calendar Comment was sent")
    await Comment.createReaction(90002573)
    console.log("👍 The Reaction was created")
    await Comment.deleteReaction(90002573)
    console.log("👍 The Reaction was deleted")
    await Comment.edit({content: "I like it with Nutella" });
    await event.edit({
        name: "Pizza Party",
        description: "We love Pizza 🍕\nWith Nutella",
        color: 0xFFE933,
        autofillWaitlist: true,
        duration: 600000,
        isAllDay: true,
        isPrivate: false,
        location: "Italy",
        startsAt: `${new Date(Date.now() + 86400000).toISOString().split(".")[0]}Z`,
        url: "https://www.google.com/search?q=pizza",
    });
    console.log("✏️ The Calendar Event was edited")
    await Comment.delete();
    console.log("🗑️ The Calendar Comment was deleted")
    await event.delete();
    console.log("🗑️ The Calendar Event was deleted")
    console.log("--------------------")
    console.log("📧 Sending Docs")
    let doc = await client.rest.channels.createDoc(docChannelID, {"title":"The 5 Reasons Why You Should Eat Pizza (The 6th Will Shock You)","content":"So, this is the 5 reasons why you should eat pizza:\n1 » It's good\n2» It's good\n3» It's good\n4» It's good\n5» It's good"});
    console.log("📧 The Doc was sent")
    let CommentDoc = await client.rest.channels.createDocComment(doc.channelID, doc.id, {content: "With Pineapple it's better"});
    console.log("📧 The Doc Comment was sent")
    await CommentDoc.createReaction(90002573)
    console.log("👍 The Reaction was created")
    await CommentDoc.deleteReaction(90002573)
    console.log("👍 The Reaction was deleted")
    await CommentDoc.edit({content: "I like it with Nutella" });
    await doc.edit({"title":"The 5 Reasons Why You Should Eat Pizza (The 6th Will Shock You)","content":"So, this is the 5 reasons why you should eat pizza:\n1 » It's good\n2» It's good\n3» It's good\n4» It's good\n5» It's good\n6» It's good"});
    console.log("✏️ The Doc was edited")
    await CommentDoc.delete();
    console.log("🗑️ The Doc Comment was deleted")
    await doc.delete();
    console.log("🗑️ The Doc was deleted")
    console.log("--------------------")
    console.log("📧 Sending Forum Topic")
    let Thread = await client.rest.channels.createForumThread(forumChannelID, {title: "Pizza",content: "We love Pizza 🍕",});
    console.log("📧 The Forum Thread was sent")
    let CommentThread = await client.rest.channels.createForumComment(Thread.channelID, Thread.id, {content: "With Pineapple it's better"});
    console.log("📧 The Forum Comment was sent")
    await CommentThread.createReaction(90002573)
    console.log("👍 The Reaction was created")
    await CommentThread.deleteReaction(90002573)
    console.log("👍 The Reaction was deleted")
    await CommentThread.edit({content: "I like it with Nutella" });
    await Thread.edit({title: "P-I-Z-Z-A",content: "We love Pizza 🍕\nWith Nutella"});
    console.log("✏️ The Forum Thread was edited")
    await CommentThread.delete();
    console.log("🗑️ The Forum Comment was deleted")
    await Thread.delete();
    console.log("🗑️ The Forum Thread was deleted")
    console.log("--------------------")
    console.log("📧 Sending List Item")
    let Item = await client.rest.channels.createListItem(listChannelID, "Eat some Pizza", {content:"With Pineapple it's better",});
    console.log("📧 The List Item was sent")
    await client.rest.channels.completeListItem(Item.channelID, Item.id);
    console.log("📧 The List Item was completed")
    await Item.edit({content: "With Nutella" });
    console.log("✏️ The List Item was edited")
    await Item.delete()
    console.log("🗑️ The List Item was deleted")
    client.disconnect();
});

client.connect()
