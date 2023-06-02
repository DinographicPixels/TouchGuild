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
import { AnnouncementHandler } from "./events/AnnouncementHandler";
import { UserHandler } from "./events/UserHandler";
import { Client } from "../structures/Client";

import type {
    GATEWAY_EVENTS,
    GatewayEvent_ChannelMessageReactionCreated,
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
    GatewayEvent_BotServerMembershipDeleted,
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
    GatewayEvent_ForumTopicLocked,
    GatewayEvent_ForumTopicCommentReactionDeleted,
    GatewayEvent_ForumTopicCommentReactionCreated,
    GatewayEvent_CalendarEventCommentReactionDeleted,
    GatewayEvent_CalendarEventCommentReactionCreated,
    GatewayEvent_CalendarEventReactionCreated,
    GatewayEvent_CalendarEventReactionDeleted,
    GatewayEvent_CalendarEventCommentCreated,
    GatewayEvent_CalendarEventCommentDeleted,
    GatewayEvent_CalendarEventCommentUpdated,
    GatewayEvent_ServerMemberSocialLinkCreated,
    GatewayEvent_ServerMemberSocialLinkUpdated,
    GatewayEvent_ServerMemberSocialLinkDeleted,
    GatewayEvent_DocReactionCreated,
    GatewayEvent_DocReactionDeleted,
    GatewayEvent_DocCommentReactionCreated,
    GatewayEvent_DocCommentReactionDeleted,
    GatewayEvent_DocCommentDeleted,
    GatewayEvent_DocCommentUpdated,
    GatewayEvent_DocCommentCreated,
    GatewayEvent_AnnouncementCreated,
    GatewayEvent_AnnouncementDeleted,
    GatewayEvent_AnnouncementUpdated,
    GatewayEvent_AnnouncementCommentDeleted,
    GatewayEvent_AnnouncementCommentUpdated,
    GatewayEvent_AnnouncementCommentCreated,
    GatewayEvent_AnnouncementReactionCreated,
    GatewayEvent_AnnouncementReactionDeleted,
    GatewayEvent_AnnouncementCommentReactionDeleted,
    GatewayEvent_AnnouncementCommentReactionCreated,
    GatewayEvent_ChannelMessageReactionManyDeleted,
    GatewayEvent_GroupDeleted,
    GatewayEvent_GroupUpdated,
    GatewayEvent_GroupCreated,
    GatewayEvent_UserStatusCreated,
    GatewayEvent_UserStatusDeleted,
    GatewayEvent_RoleCreated,
    GatewayEvent_RoleUpdated,
    GatewayEvent_RoleDeleted
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
    announcementHandler = new AnnouncementHandler(this.client);
    userHandler = new UserHandler(this.client);

    readonly toHandlerMap: Record<keyof GATEWAY_EVENTS, (data: object) => void> = {
        // Messages
        ChatMessageCreated:                  data => this.messageHandler.messageCreate(data as GatewayEvent_ChatMessageCreated),
        ChatMessageUpdated:                  data => this.messageHandler.messageUpdate(data as GatewayEvent_ChatMessageUpdated),
        ChatMessageDeleted:                  data => this.messageHandler.messageDelete(data as GatewayEvent_ChatMessageDeleted),
        ChannelMessageReactionCreated:       data => this.messageHandler.messageReactionAdd(data as GatewayEvent_ChannelMessageReactionCreated),
        ChannelMessageReactionDeleted:       data => this.messageHandler.messageReactionRemove(data as GatewayEvent_ChannelMessageReactionDeleted),
        ChannelMessageReactionManyDeleted:   data => this.messageHandler.messageReactionBulkRemove(data as GatewayEvent_ChannelMessageReactionManyDeleted),
        // Channels
        ServerChannelCreated:                data => this.channelHandler.channelCreate(data as GatewayEvent_ServerChannelCreated),
        ServerChannelUpdated:                data => this.channelHandler.channelUpdate(data as GatewayEvent_ServerChannelUpdated),
        ServerChannelDeleted:                data => this.channelHandler.channelDelete(data as GatewayEvent_ServerChannelDeleted),
        // Forum Topics
        ForumTopicCreated:                   data => this.forumThreadHandler.forumThreadCreate(data as GatewayEvent_ForumTopicCreated),
        ForumTopicUpdated:                   data => this.forumThreadHandler.forumThreadUpdate(data as GatewayEvent_ForumTopicUpdated),
        ForumTopicDeleted:                   data => this.forumThreadHandler.forumThreadDelete(data as GatewayEvent_ForumTopicDeleted),
        ForumTopicPinned:                    data => this.forumThreadHandler.forumThreadPin(data as GatewayEvent_ForumTopicPinned),
        ForumTopicUnpinned:                  data => this.forumThreadHandler.forumThreadUnpin(data as GatewayEvent_ForumTopicUnpinned),
        ForumTopicLocked:                    data => this.forumThreadHandler.forumThreadLock(data as GatewayEvent_ForumTopicLocked),
        ForumTopicUnlocked:                  data => this.forumThreadHandler.forumThreadUnlock(data as GatewayEvent_ForumTopicUnlocked),
        ForumTopicReactionCreated:           data => this.forumThreadHandler.forumThreadReactionAdd(data as GatewayEvent_ForumTopicReactionCreated),
        ForumTopicReactionDeleted:           data => this.forumThreadHandler.forumThreadReactionRemove(data as GatewayEvent_ForumTopicReactionDeleted),
        ForumTopicCommentCreated:            data => this.forumThreadHandler.forumThreadCommentCreate(data as GatewayEvent_ForumTopicCommentCreated),
        ForumTopicCommentUpdated:            data => this.forumThreadHandler.forumThreadCommentUpdate(data as GatewayEvent_ForumTopicCommentUpdated),
        ForumTopicCommentDeleted:            data => this.forumThreadHandler.forumThreadCommentDelete(data as GatewayEvent_ForumTopicCommentDeleted),
        ForumTopicCommentReactionCreated:    data => this.forumThreadHandler.forumThreadCommentReactionAdd(data as GatewayEvent_ForumTopicCommentReactionCreated),
        ForumTopicCommentReactionDeleted:    data => this.forumThreadHandler.forumThreadCommentReactionRemove(data as GatewayEvent_ForumTopicCommentReactionDeleted),
        // Guilds
        ServerMemberBanned:                  data => this.guildHandler.guildBanAdd(data as GatewayEvent_ServerMemberBanned),
        ServerMemberUnbanned:                data => this.guildHandler.guildBanRemove(data as GatewayEvent_ServerMemberUnbanned),
        ServerMemberJoined:                  data => this.guildHandler.guildMemberAdd(data as GatewayEvent_ServerMemberJoined),
        ServerMemberRemoved:                 data => this.guildHandler.guildMemberRemove(data as GatewayEvent_ServerMemberRemoved),
        ServerMemberUpdated:                 data => this.guildHandler.guildMemberUpdate(data as GatewayEvent_ServerMemberUpdated),
        ServerRolesUpdated:                  data => this.guildHandler.guildMemberRoleUpdate(data as GatewayEvent_ServerRolesUpdated),
        ServerMemberSocialLinkCreated:       data => this.guildHandler.guildMemberSocialLinkCreate(data as GatewayEvent_ServerMemberSocialLinkCreated),
        ServerMemberSocialLinkUpdated:       data => this.guildHandler.guildMemberSocialLinkUpdate(data as GatewayEvent_ServerMemberSocialLinkUpdated),
        ServerMemberSocialLinkDeleted:       data => this.guildHandler.guildMemberSocialLinkDelete(data as GatewayEvent_ServerMemberSocialLinkDeleted),
        BotServerMembershipCreated:          data => this.guildHandler.guildCreate(data as GatewayEvent_BotServerMembershipCreated),
        BotServerMembershipDeleted:          data => this.guildHandler.guildDelete(data as GatewayEvent_BotServerMembershipDeleted),
        // Guild groups
        GroupCreated:                        data => this.guildHandler.guildGroupCreate(data as GatewayEvent_GroupCreated),
        GroupUpdated:                        data => this.guildHandler.guildGroupUpdate(data as GatewayEvent_GroupUpdated),
        GroupDeleted:                        data => this.guildHandler.guildGroupDelete(data as GatewayEvent_GroupDeleted),
        // Guild roles
        RoleCreated:                         data => this.guildHandler.guildRoleCreate(data as GatewayEvent_RoleCreated),
        RoleUpdated:                         data => this.guildHandler.guildRoleUpdate(data as GatewayEvent_RoleUpdated),
        RoleDeleted:                         data => this.guildHandler.guildRoleDelete(data as GatewayEvent_RoleDeleted),
        // Webhooks
        ServerWebhookCreated:                data => this.webhookHandler.webhooksCreate(data as GatewayEvent_ServerWebhookCreated),
        ServerWebhookUpdated:                data => this.webhookHandler.webhooksUpdate(data as GatewayEvent_ServerWebhookUpdated),
        // Docs
        DocCreated:                          data => this.docHandler.docCreate(data as GatewayEvent_DocCreated),
        DocUpdated:                          data => this.docHandler.docUpdate(data as GatewayEvent_DocUpdated),
        DocDeleted:                          data => this.docHandler.docDelete(data as GatewayEvent_DocDeleted),
        DocReactionCreated:                  data => this.docHandler.docReactionAdd(data as GatewayEvent_DocReactionCreated),
        DocReactionDeleted:                  data => this.docHandler.docReactionRemove(data as GatewayEvent_DocReactionDeleted),
        DocCommentCreated:                   data => this.docHandler.docCommentCreate(data as GatewayEvent_DocCommentCreated),
        DocCommentUpdated:                   data => this.docHandler.docCommentUpdate(data as GatewayEvent_DocCommentUpdated),
        DocCommentDeleted:                   data => this.docHandler.docCommentDelete(data as GatewayEvent_DocCommentDeleted),
        DocCommentReactionCreated:           data => this.docHandler.docCommentReactionAdd(data as GatewayEvent_DocCommentReactionCreated),
        DocCommentReactionDeleted:           data => this.docHandler.docCommentReactionRemove(data as GatewayEvent_DocCommentReactionDeleted),
        // Calendars
        CalendarEventCreated:                data => this.calendarHandler.calendarEventCreate(data as GatewayEvent_CalendarEventCreated),
        CalendarEventUpdated:                data => this.calendarHandler.calendarEventUpdate(data as GatewayEvent_CalendarEventUpdated),
        CalendarEventDeleted:                data => this.calendarHandler.calendarEventDelete(data as GatewayEvent_CalendarEventDeleted),
        CalendarEventReactionCreated:        data => this.calendarHandler.calendarEventReactionAdd(data as GatewayEvent_CalendarEventReactionCreated),
        CalendarEventReactionDeleted:        data => this.calendarHandler.calendarEventReactionRemove(data as GatewayEvent_CalendarEventReactionDeleted),
        CalendarEventCommentCreated:         data => this.calendarHandler.calendarCommentCreate(data as GatewayEvent_CalendarEventCommentCreated),
        CalendarEventCommentUpdated:         data => this.calendarHandler.calendarCommentUpdate(data as GatewayEvent_CalendarEventCommentUpdated),
        CalendarEventCommentDeleted:         data => this.calendarHandler.calendarCommentDelete(data as GatewayEvent_CalendarEventCommentDeleted),
        CalendarEventCommentReactionCreated: data => this.calendarHandler.calendarCommentReactionAdd(data as GatewayEvent_CalendarEventCommentReactionCreated),
        CalendarEventCommentReactionDeleted: data => this.calendarHandler.calendarCommentReactionRemove(data as GatewayEvent_CalendarEventCommentReactionDeleted),
        CalendarEventRsvpUpdated:            data => this.calendarHandler.calendarRsvpUpdate(data as GatewayEvent_CalendarEventRsvpUpdated),
        CalendarEventRsvpManyUpdated:        () => this.calendarHandler.calendarRsvpManyUpdated(),
        CalendarEventRsvpDeleted:            data => this.calendarHandler.calendarRsvpDelete(data as GatewayEvent_CalendarEventRsvpDeleted),
        // Lists
        ListItemCreated:                     data => this.listItemHandler.listItemCreate(data as GatewayEvent_ListItemCreated),
        ListItemUpdated:                     data => this.listItemHandler.listItemUpdate(data as GatewayEvent_ListItemUpdated),
        ListItemDeleted:                     data => this.listItemHandler.listItemDelete(data as GatewayEvent_ListItemDeleted),
        ListItemCompleted:                   data => this.listItemHandler.listItemComplete(data as GatewayEvent_ListItemCompleted),
        ListItemUncompleted:                 data => this.listItemHandler.listItemUncomplete(data as GatewayEvent_ListItemUncompleted),
        // Announcements (messages & comments)
        AnnouncementCreated:                 data => this.announcementHandler.announcementCreate(data as GatewayEvent_AnnouncementCreated),
        AnnouncementUpdated:                 data => this.announcementHandler.announcementUpdate(data as GatewayEvent_AnnouncementUpdated),
        AnnouncementDeleted:                 data => this.announcementHandler.announcementDelete(data as GatewayEvent_AnnouncementDeleted),
        AnnouncementCommentCreated:          data => this.announcementHandler.announcementCommentCreate(data as GatewayEvent_AnnouncementCommentCreated),
        AnnouncementCommentUpdated:          data => this.announcementHandler.announcementCommentUpdate(data as GatewayEvent_AnnouncementCommentUpdated),
        AnnouncementCommentDeleted:          data => this.announcementHandler.announcementCommentDelete(data as GatewayEvent_AnnouncementCommentDeleted),
        AnnouncementReactionCreated:         data => this.announcementHandler.announcementReactionAdd(data as GatewayEvent_AnnouncementReactionCreated),
        AnnouncementReactionDeleted:         data => this.announcementHandler.announcementReactionRemove(data as GatewayEvent_AnnouncementReactionDeleted),
        AnnouncementCommentReactionCreated:  data => this.announcementHandler.announcementCommentReactionAdd(data as GatewayEvent_AnnouncementCommentReactionCreated),
        AnnouncementCommentReactionDeleted:  data => this.announcementHandler.announcementCommentReactionRemove(data as GatewayEvent_AnnouncementCommentReactionDeleted),
        // Users
        UserStatusCreated:                   data => this.userHandler.userStatusCreate(data as GatewayEvent_UserStatusCreated),
        UserStatusDeleted:                   data => this.userHandler.userStatusDelete(data as GatewayEvent_UserStatusDeleted)
    };

    async handleMessage(eventType: keyof GATEWAY_EVENTS, eventData: object): Promise<void> {
        if (eventType as keyof GATEWAY_EVENTS){
            const serverId = "serverId" as keyof object;
            if (eventData[serverId] && this.client.guilds.has(eventData[serverId]) === false) {
                // eslint-disable-next-line @typescript-eslint/no-floating-promises
                this.client.guilds.add(await this.client.rest.guilds.getGuild(eventData[serverId]));
            }
            if (eventData["message" as keyof object] && eventData["message" as keyof object]["type" as keyof object] === "system") return; // system sending fake messages, haha :)
            this.toHandlerMap[eventType]?.(eventData);
        }
    }
}
