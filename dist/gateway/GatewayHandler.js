"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GatewayHandler = void 0;
const ChannelHandler_1 = require("./events/ChannelHandler");
const ForumTopicHandler_1 = require("./events/ForumTopicHandler");
const MessageHandler_1 = require("./events/MessageHandler");
const GuildHandler_1 = require("./events/GuildHandler");
const WebhookHandler_1 = require("./events/WebhookHandler");
const DocHandler_1 = require("./events/DocHandler");
const CalendarHandler_1 = require("./events/CalendarHandler");
const ListItemHandler_1 = require("./events/ListItemHandler");
class GatewayHandler {
    constructor(client) {
        this.client = client;
        this.messageHandler = new MessageHandler_1.MessageHandler(this.client);
        this.channelHandler = new ChannelHandler_1.ChannelHandler(this.client);
        this.forumTopicHandler = new ForumTopicHandler_1.ForumTopicHandler(this.client);
        this.guildHandler = new GuildHandler_1.GuildHandler(this.client);
        this.webhookHandler = new WebhookHandler_1.WebhookHandler(this.client);
        this.docHandler = new DocHandler_1.DocHandler(this.client);
        this.calendarHandler = new CalendarHandler_1.CalendarHandler(this.client);
        this.listItemHandler = new ListItemHandler_1.ListItemHandler(this.client);
    }
    handleMessage(eventType, eventData) {
        if (this.client.identifiers.Message[eventType]) {
            if (eventData['message']) {
                if (eventData['message']['type'] == 'system')
                    return; // system sending fake message, haha :)
            }
            if (eventType == 'ChatMessageCreated') {
                this.messageHandler.messageCreate(eventData);
            }
            else if (eventType == 'ChatMessageUpdated') {
                this.messageHandler.messageUpdate(eventData);
            }
            else if (eventType == 'ChatMessageDeleted') {
                this.messageHandler.messageDelete(eventData);
            }
            else if (eventType == 'ChannelMessageReactionCreated') {
                this.messageHandler.messageReactionAdd(eventData);
            }
            else if (eventType == 'ChannelMessageReactionDeleted') {
                this.messageHandler.messageReactionRemove(eventData);
            }
            return;
        }
        else if (this.client.identifiers.Channel[eventType]) {
            if (eventType == 'TeamChannelCreated') {
                this.channelHandler.channelCreate(eventData);
            }
            else if (eventType == 'TeamChannelUpdated') {
                this.channelHandler.channelUpdate(eventData);
            }
            else if (eventType == 'TeamChannelDeleted') {
                this.channelHandler.channelDelete(eventData);
            }
            return;
        }
        else if (this.client.identifiers.ForumTopic[eventType]) {
            if (eventType == 'ForumTopicCreated') {
                this.forumTopicHandler.topicCreate(eventData);
            }
            else if (eventType == 'ForumTopicUpdated') {
                this.forumTopicHandler.topicUpdate(eventData);
            }
            else if (eventType == 'ForumTopicDeleted') {
                this.forumTopicHandler.topicDelete(eventData);
            }
            else if (eventType == 'ForumTopicPinned') {
                this.forumTopicHandler.topicPin(eventData);
            }
            else if (eventType == 'ForumTopicUnpinned') {
                this.forumTopicHandler.topicUnpin(eventData);
            }
            return;
        }
        else if (this.client.identifiers.Guild[eventType]) {
            //console.log(eventData)
            if (eventType == 'TeamMemberBanned') {
                this.guildHandler.guildBanAdd(eventData);
            }
            else if (eventType == 'TeamMemberUnbanned') {
                this.guildHandler.guildBanRemove(eventData);
            }
            else if (eventType == 'TeamMemberJoined') {
                this.guildHandler.guildMemberAdd(eventData);
            }
            else if (eventType == 'TeamMemberRemoved') {
                this.guildHandler.guildBanRemove(eventData);
            }
            else if (eventType == 'TeamMemberUpdated') {
                this.guildHandler.guildMemberUpdate(eventData);
            }
            else if (eventType == 'teamRolesUpdated') {
                console.log(eventData);
                this.guildHandler.guildMemberRoleUpdate(eventData);
            }
            return;
        }
        else if (this.client.identifiers.Webhook[eventType]) {
            //console.log(eventData)
            if (eventType == 'TeamWebhookCreated') {
                this.webhookHandler.webhooksCreate(eventData);
            }
            else if (eventType == 'TeamWebhookUpdated') {
                this.webhookHandler.webhooksUpdate(eventData);
            }
            return;
        }
        else if (this.client.identifiers.Doc[eventType]) {
            if (eventType == 'DocCreated') {
                this.docHandler.docCreate(eventData);
            }
            else if (eventType == 'DocUpdated') {
                this.docHandler.docUpdate(eventData);
            }
            else if (eventType == 'DocDeleted') {
                this.docHandler.docDelete(eventData);
            }
            return;
        }
        else if (this.client.identifiers.Calendar[eventType]) {
            if (eventType == 'CalendarEventCreated') {
                this.calendarHandler.calendarEventCreate(eventData);
            }
            else if (eventType == 'CalendarEventUpdated') {
                this.calendarHandler.calendarEventUpdate(eventData);
            }
            else if (eventType == 'CalendarEventDeleted') {
                this.calendarHandler.calendarEventDelete(eventData);
            }
            else if (eventType == 'CalendarEventRsvpUpdated') {
                this.calendarHandler.calendarRsvpUpdate(eventData);
            }
            else if (eventType == 'CalendarEventRsvpDeleted') {
                this.calendarHandler.calendarRsvpDelete(eventData);
            }
            return;
            // CalendarEventRsvpManyUpdated.
        }
        else if (this.client.identifiers.List[eventType]) {
            if (eventType == 'ListItemCreated') {
                this.listItemHandler.listItemCreate(eventData);
            }
            else if (eventType == 'ListItemUpdated') {
                this.listItemHandler.listItemUpdate(eventData);
            }
            else if (eventType == 'ListItemDeleted') {
                this.listItemHandler.listItemDelete(eventData);
            }
            else if (eventType == 'ListItemCompleted') {
                this.listItemHandler.listItemComplete(eventData);
            }
            else if (eventType == 'ListItemUncompleted') {
                this.listItemHandler.listItemUncomplete(eventData);
            }
            return;
        }
    }
}
exports.GatewayHandler = GatewayHandler;
