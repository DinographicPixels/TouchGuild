import { ChannelHandler } from "./events/ChannelHandler";
import { ForumTopicHandler } from "./events/ForumTopicHandler";
import { MessageHandler } from "./events/MessageHandler";
import { GuildHandler } from "./events/GuildHandler";
import { WebhookHandler } from "./events/WebhookHandler";
import { DocHandler } from "./events/DocHandler";
import { CalendarHandler } from "./events/CalendarHandler";
import { ListItemHandler } from "./events/ListItemHandler";
import { Client } from "../structures/Client";

export class GatewayHandler{
    constructor(readonly client: Client) {}
    messageHandler = new MessageHandler(this.client);
    channelHandler = new ChannelHandler(this.client);
    forumTopicHandler = new ForumTopicHandler(this.client);
    guildHandler = new GuildHandler(this.client);
    webhookHandler = new WebhookHandler(this.client);
    docHandler = new DocHandler(this.client);
    calendarHandler = new CalendarHandler(this.client);
    listItemHandler = new ListItemHandler(this.client);

    handleMessage(eventType: string, eventData: object): void {
        if (this.client.identifiers.Message[eventType as keyof object]){
            if (eventData["message" as keyof object] && eventData["message" as keyof object]["type" as keyof object] === "system") return; // system sending fake messages, haha :)
            switch (eventType) {
                case "ChatMessageCreated": {
                    this.messageHandler.messageCreate(eventData as keyof object);
                    break;
                }
                case "ChatMessageUpdated": {
                    this.messageHandler.messageUpdate(eventData as keyof object);
                    break;
                }
                case "ChatMessageDeleted": {
                    this.messageHandler.messageDelete(eventData as keyof object);
                    break;
                }
                case "ChannelMessageReactionCreated": {
                    this.messageHandler.messageReactionAdd(eventData as keyof object);
                    break;
                }
                case "ChannelMessageReactionDeleted": {
                    this.messageHandler.messageReactionRemove(eventData as keyof object);
                    break;
                }
            // No default
            }
            return;
        } else if (this.client.identifiers.Channel[eventType as keyof object]){
            switch (eventType) {
                case "TeamChannelCreated": {
                    this.channelHandler.channelCreate(eventData as keyof object);
                    break;
                }
                case "TeamChannelUpdated": {
                    this.channelHandler.channelUpdate(eventData as keyof object);
                    break;
                }
                case "TeamChannelDeleted": {
                    this.channelHandler.channelDelete(eventData as keyof object);
                    break;
                }
            // No default
            }
            return;
        } else if (this.client.identifiers.ForumTopic[eventType as keyof object]){
            switch (eventType) {
                case "ForumTopicCreated": {
                    this.forumTopicHandler.topicCreate(eventData as keyof object);
                    break;
                }
                case "ForumTopicUpdated": {
                    this.forumTopicHandler.topicUpdate(eventData as keyof object);
                    break;
                }
                case "ForumTopicDeleted": {
                    this.forumTopicHandler.topicDelete(eventData as keyof object);
                    break;
                }
                case "ForumTopicPinned": {
                    this.forumTopicHandler.topicPin(eventData as keyof object);
                    break;
                }
                case "ForumTopicUnpinned": {
                    this.forumTopicHandler.topicUnpin(eventData as keyof object);
                    break;
                }
                case "ForumTopicReactionCreated": {
                    this.forumTopicHandler.topicReactionAdd(eventData as keyof object);
                    break;
                }
                case "ForumTopicReactionDeleted": {
                    this.forumTopicHandler.topicReactionRemove(eventData as keyof object);
                    break;
                }
                case "ForumTopicCommentCreated": {
                    this.forumTopicHandler.topicCommentCreate(eventData as keyof object);
                    break;
                }
                case "ForumTopicCommentUpdated": {
                    this.forumTopicHandler.topicCommentUpdate(eventData as keyof object);
                    break;
                }
                case "ForumTopicCommentDeleted": {
                    this.forumTopicHandler.topicCommentDelete(eventData as keyof object);
                    break;
                }
            // No default
            }
            return;
        } else if (this.client.identifiers.Guild[eventType as keyof object]){
            // console.log(eventData)
            switch (eventType) {
                case "TeamMemberBanned": {
                    this.guildHandler.guildBanAdd(eventData as keyof object);
                    break;
                }
                case "TeamMemberUnbanned": {
                    this.guildHandler.guildBanRemove(eventData as keyof object);
                    break;
                }
                case "TeamMemberJoined": {
                    this.guildHandler.guildMemberAdd(eventData as keyof object);
                    break;
                }
                case "TeamMemberRemoved": {
                    this.guildHandler.guildBanRemove(eventData as keyof object);
                    break;
                }
                case "TeamMemberUpdated": {
                    this.guildHandler.guildMemberUpdate(eventData as keyof object);
                    break;
                }
                case "teamRolesUpdated": {
                    this.guildHandler.guildMemberRoleUpdate(eventData as keyof object);
                    break;
                }
                case "BotTeamMembershipCreated": {
                    this.guildHandler.guildCreate(eventData as keyof object);
                    break;
                }
            // No default
            }
            return;
        } else if (this.client.identifiers.Webhook[eventType as keyof object]){
            // console.log(eventData)
            switch (eventType) {
                case "TeamWebhookCreated": {
                    this.webhookHandler.webhooksCreate(eventData as keyof object);
                    break;
                }
                case "TeamWebhookUpdated": {
                    this.webhookHandler.webhooksUpdate(eventData as keyof object);
                    break;
                }
            }
            return;
        } else if (this.client.identifiers.Doc[eventType as keyof object]){
            switch (eventType) {
                case "DocCreated": {
                    this.docHandler.docCreate(eventData as keyof object);
                    break;
                }
                case "DocUpdated": {
                    this.docHandler.docUpdate(eventData as keyof object);
                    break;
                }
                case "DocDeleted": {
                    this.docHandler.docDelete(eventData as keyof object);
                    break;
                }
            // No default
            }
            return;
        } else if (this.client.identifiers.Calendar[eventType as keyof object]){
            switch (eventType) {
                case "CalendarEventCreated": {
                    this.calendarHandler.calendarEventCreate(eventData as keyof object);
                    break;
                }
                case "CalendarEventUpdated": {
                    this.calendarHandler.calendarEventUpdate(eventData as keyof object);
                    break;
                }
                case "CalendarEventDeleted": {
                    this.calendarHandler.calendarEventDelete(eventData as keyof object);
                    break;
                }
                case "CalendarEventRsvpUpdated": {
                    this.calendarHandler.calendarRsvpUpdate(eventData as keyof object);
                    break;
                }
                case "CalendarEventRsvpDeleted": {
                    this.calendarHandler.calendarRsvpDelete(eventData as keyof object);
                    break;
                }
            // No default
            }
            return;
            // CalendarEventRsvpManyUpdated.
        } else if (this.client.identifiers.List[eventType as keyof object]){
            switch (eventType) {
                case "ListItemCreated": {
                    this.listItemHandler.listItemCreate(eventData as keyof object);
                    break;
                }
                case "ListItemUpdated": {
                    this.listItemHandler.listItemUpdate(eventData as keyof object);
                    break;
                }
                case "ListItemDeleted": {
                    this.listItemHandler.listItemDelete(eventData as keyof object);
                    break;
                }
                case "ListItemCompleted": {
                    this.listItemHandler.listItemComplete(eventData as keyof object);
                    break;
                }
                case "ListItemUncompleted": {
                    this.listItemHandler.listItemUncomplete(eventData as keyof object);
                    break;
                }
            // No default
            }
            return;
        }
    }
}
