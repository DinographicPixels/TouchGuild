/** @module GatewayHandler */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { ChannelHandler } from "./events/ChannelHandler";
import { ForumThreadHandler } from "./events/ForumThreadHandler";
import { MessageHandler } from "./events/MessageHandler";
import { GuildHandler } from "./events/GuildHandler";
import { WebhookHandler } from "./events/WebhookHandler";
import { DocHandler } from "./events/DocHandler";
import { CalendarHandler } from "./events/CalendarHandler";
import { ListItemHandler } from "./events/ListItemHandler";
import { Client } from "../structures/Client";

import type {
    GATEWAY_EVENTS,
    GatewayEvent_ChannelMessageReactionAdded,
    GatewayEvent_ChannelMessageReactionDeleted,
    GatewayEvent_ChatMessageCreated,
    GatewayEvent_ChatMessageDeleted,
    GatewayEvent_ChatMessageUpdated,
    GatewayEvent_ServerChannelCreated,
    GatewayEvent_ServerChannelUpdated,
    GatewayEvent_ServerChannelDeleted,
    GatewayEvent_ForumTopicCreated,
    GatewayEvent_ForumTopicUpdated,
    GatewayEvent_ForumTopicDeleted,
    GatewayEvent_ForumTopicPinned,
    GatewayEvent_ForumTopicUnpinned,
    GatewayEvent_ForumTopicReactionCreated,
    GatewayEvent_ForumTopicReactionDeleted,
    GatewayEvent_ForumTopicCommentCreated,
    GatewayEvent_ForumTopicCommentUpdated,
    GatewayEvent_ForumTopicCommentDeleted,
    GatewayEvent_ServerMemberBanned,
    GatewayEvent_ServerMemberUnbanned,
    GatewayEvent_ServerMemberJoined,
    GatewayEvent_ServerMemberRemoved,
    GatewayEvent_ServerMemberUpdated,
    GatewayEvent_ServerRolesUpdated,
    GatewayEvent_BotServerMembershipCreated,
    GatewayEvent_ServerWebhookCreated,
    GatewayEvent_ServerWebhookUpdated,
    GatewayEvent_DocCreated,
    GatewayEvent_DocUpdated,
    GatewayEvent_DocDeleted,
    GatewayEvent_CalendarEventCreated,
    GatewayEvent_CalendarEventUpdated,
    GatewayEvent_CalendarEventDeleted,
    GatewayEvent_CalendarEventRsvpUpdated,
    GatewayEvent_CalendarEventRsvpDeleted,
    GatewayEvent_ListItemCreated,
    GatewayEvent_ListItemUpdated,
    GatewayEvent_ListItemDeleted,
    GatewayEvent_ListItemCompleted,
    GatewayEvent_ListItemUncompleted,
    GatewayEvent_ForumTopicUnlocked,
    GatewayEvent_ForumTopicLocked
} from "../Constants";

/** Gateway handler filters every ws events. */
export class GatewayHandler {
    constructor(readonly client: Client) {}
    messageHandler = new MessageHandler(this.client);
    channelHandler = new ChannelHandler(this.client);
    forumThreadHandler = new ForumThreadHandler(this.client);
    guildHandler = new GuildHandler(this.client);
    webhookHandler = new WebhookHandler(this.client);
    docHandler = new DocHandler(this.client);
    calendarHandler = new CalendarHandler(this.client);
    listItemHandler = new ListItemHandler(this.client);

    readonly toHandlerMap: Record<keyof GATEWAY_EVENTS, (data: object) => void> = {
        // Messages
        ChatMessageCreated:            data => this.messageHandler.messageCreate(data as GatewayEvent_ChatMessageCreated),
        ChatMessageUpdated:            data => this.messageHandler.messageUpdate(data as GatewayEvent_ChatMessageUpdated),
        ChatMessageDeleted:            data => this.messageHandler.messageDelete(data as GatewayEvent_ChatMessageDeleted),
        ChannelMessageReactionCreated: data => this.messageHandler.messageReactionAdd(data as GatewayEvent_ChannelMessageReactionAdded),
        ChannelMessageReactionDeleted: data => this.messageHandler.messageReactionRemove(data as GatewayEvent_ChannelMessageReactionDeleted),
        // Channels
        ServerChannelCreated:          data => this.channelHandler.channelCreate(data as GatewayEvent_ServerChannelCreated),
        ServerChannelUpdated:          data => this.channelHandler.channelUpdate(data as GatewayEvent_ServerChannelUpdated),
        ServerChannelDeleted:          data => this.channelHandler.channelDelete(data as GatewayEvent_ServerChannelDeleted),
        // Forum Topics
        ForumTopicCreated:             data => this.forumThreadHandler.forumThreadCreate(data as GatewayEvent_ForumTopicCreated),
        ForumTopicUpdated:             data => this.forumThreadHandler.forumThreadUpdate(data as GatewayEvent_ForumTopicUpdated),
        ForumTopicDeleted:             data => this.forumThreadHandler.forumThreadDelete(data as GatewayEvent_ForumTopicDeleted),
        ForumTopicPinned:              data => this.forumThreadHandler.forumThreadPin(data as GatewayEvent_ForumTopicPinned),
        ForumTopicUnpinned:            data => this.forumThreadHandler.forumThreadUnpin(data as GatewayEvent_ForumTopicUnpinned),
        ForumTopicLocked:              data => this.forumThreadHandler.forumThreadLock(data as GatewayEvent_ForumTopicLocked), // indev
        ForumTopicUnlocked:            data => this.forumThreadHandler.forumThreadUnlock(data as GatewayEvent_ForumTopicUnlocked), // indev
        ForumTopicReactionCreated:     data => this.forumThreadHandler.forumThreadReactionAdd(data as GatewayEvent_ForumTopicReactionCreated),
        ForumTopicReactionDeleted:     data => this.forumThreadHandler.forumThreadReactionRemove(data as GatewayEvent_ForumTopicReactionDeleted),
        ForumTopicCommentCreated:      data => this.forumThreadHandler.forumThreadCommentCreate(data as GatewayEvent_ForumTopicCommentCreated),
        ForumTopicCommentUpdated:      data => this.forumThreadHandler.forumThreadCommentUpdate(data as GatewayEvent_ForumTopicCommentUpdated),
        ForumTopicCommentDeleted:      data => this.forumThreadHandler.forumThreadCommentDelete(data as GatewayEvent_ForumTopicCommentDeleted),
        // Guilds
        ServerMemberBanned:            data => this.guildHandler.guildBanAdd(data as GatewayEvent_ServerMemberBanned),
        ServerMemberUnbanned:          data => this.guildHandler.guildBanRemove(data as GatewayEvent_ServerMemberUnbanned),
        ServerMemberJoined:            data => this.guildHandler.guildMemberAdd(data as GatewayEvent_ServerMemberJoined),
        ServerMemberRemoved:           data => this.guildHandler.guildMemberRemove(data as GatewayEvent_ServerMemberRemoved),
        ServerMemberUpdated:           data => this.guildHandler.guildMemberUpdate(data as GatewayEvent_ServerMemberUpdated),
        ServerRolesUpdated:            data => this.guildHandler.guildMemberRoleUpdate(data as GatewayEvent_ServerRolesUpdated),
        BotServerMembershipCreated:    data => this.guildHandler.guildCreate(data as GatewayEvent_BotServerMembershipCreated),
        // Webhooks
        ServerWebhookCreated:          data => this.webhookHandler.webhooksCreate(data as GatewayEvent_ServerWebhookCreated),
        ServerWebhookUpdated:          data => this.webhookHandler.webhooksUpdate(data as GatewayEvent_ServerWebhookUpdated),
        // Docs
        DocCreated:                    data => this.docHandler.docCreate(data as GatewayEvent_DocCreated),
        DocUpdated:                    data => this.docHandler.docUpdate(data as GatewayEvent_DocUpdated),
        DocDeleted:                    data => this.docHandler.docDelete(data as GatewayEvent_DocDeleted),
        // Calendars
        CalendarEventCreated:          data => this.calendarHandler.calendarEventCreate(data as GatewayEvent_CalendarEventCreated),
        CalendarEventUpdated:          data => this.calendarHandler.calendarEventUpdate(data as GatewayEvent_CalendarEventUpdated),
        CalendarEventDeleted:          data => this.calendarHandler.calendarEventDelete(data as GatewayEvent_CalendarEventDeleted),
        CalendarEventRsvpUpdated:      data => this.calendarHandler.calendarRsvpUpdate(data as GatewayEvent_CalendarEventRsvpUpdated),
        CalendarEventRsvpManyUpdated:  ()   => this.calendarHandler.calendarRsvpManyUpdated(),
        CalendarEventRsvpDeleted:      data => this.calendarHandler.calendarRsvpDelete(data as GatewayEvent_CalendarEventRsvpDeleted),
        // Lists
        ListItemCreated:               data => this.listItemHandler.listItemCreate(data as GatewayEvent_ListItemCreated),
        ListItemUpdated:               data => this.listItemHandler.listItemUpdate(data as GatewayEvent_ListItemUpdated),
        ListItemDeleted:               data => this.listItemHandler.listItemDelete(data as GatewayEvent_ListItemDeleted),
        ListItemCompleted:             data => this.listItemHandler.listItemComplete(data as GatewayEvent_ListItemCompleted),
        ListItemUncompleted:           data => this.listItemHandler.listItemUncomplete(data as GatewayEvent_ListItemUncompleted)
    };

    handleMessage(eventType: keyof GATEWAY_EVENTS, eventData: object): void {
        if (this.client.identifiers[eventType as keyof object]){
            if (eventData["message" as keyof object] && eventData["message" as keyof object]["type" as keyof object] === "system") return; // system sending fake messages, haha :)
            this.toHandlerMap[eventType]?.(eventData);
        }
    }
}
