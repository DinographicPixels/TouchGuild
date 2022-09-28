import { Message, MessageOptions } from './Message';
import { Channel, ChannelCategories } from './Channel';
import { WSManager } from '../WSManager';
import { Member } from './Member';
import { Guild } from './Guild';
import type TypedEmitter from 'typed-emitter';
import { ForumTopic } from './ForumTopic';
import { BannedMember } from './BannedMember';
import { MemberRemoveInfo, MemberRoleUpdateInfo, MemberUpdateInfo } from '../gateway/events/GuildHandler';
import { Webhook } from './Webhook';
import { Doc } from './Doc';
import { CalendarEvent } from './CalendarEvent';
import { CalendarEventRSVP } from './CalendarRSVP';
import { ListItem } from './ListItem';
import { messageReactionTypes } from '../Types';
export declare type EmitterTypes = {
    message: (message: string) => void;
    error: (error: Error) => void;
    ready: () => void;
    messageCreate: (message: Message) => void;
    messageUpdate: (message: Message) => void;
    messageDelete: (message: Message) => void;
    messageReactionAdd: (reactionInfo: messageReactionTypes) => void;
    messageReactionRemove: (reactionInfo: messageReactionTypes) => void;
    channelCreate: (channel: Channel) => void;
    channelUpdate: (channel: Channel) => void;
    channelDelete: (channel: Channel) => void;
    forumTopicCreate: (topic: ForumTopic) => void;
    forumTopicUpdate: (topic: ForumTopic) => void;
    forumTopicDelete: (topic: ForumTopic) => void;
    forumTopicPin: (topic: ForumTopic) => void;
    forumTopicUnpin: (topic: ForumTopic) => void;
    guildBanAdd: (BannedMember: BannedMember) => void;
    guildBanRemove: (BannedMember: BannedMember) => void;
    guildMemberAdd: (Member: Member) => void;
    guildMemberRemove: (MemberRemoveInfo: MemberRemoveInfo) => void;
    guildMemberUpdate: (MemberUpdateInfo: MemberUpdateInfo) => void;
    guildMemberRoleUpdate: (MemberRoleUpdateInfo: MemberRoleUpdateInfo) => void;
    docCreate: (Doc: Doc) => void;
    docUpdate: (Doc: Doc) => void;
    docDelete: (DeletedDoc: Doc) => void;
    calendarEventCreate: (CalendarEvent: CalendarEvent) => void;
    calendarEventUpdate: (CalendarEvent: CalendarEvent) => void;
    calendarEventDelete: (CalendarEvent: CalendarEvent) => void;
    calendarEventRsvpUpdate: (CalendarRSVP: CalendarEventRSVP) => void;
    calendarEventRsvpDelete: (CalendarRSVP: CalendarEventRSVP) => void;
    listItemCreate: (ListItem: ListItem) => void;
    listItemUpdate: (ListItem: ListItem) => void;
    listItemDelete: (ListItem: ListItem) => void;
    listItemComplete: (ListItem: ListItem) => void;
    listItemUncomplete: (ListItem: ListItem) => void;
    webhooksCreate: (Webhook: Webhook) => void;
    webhooksUpdate: (Webhook: Webhook) => void;
    exit: (message: string) => void;
};
declare const Client_base: new () => TypedEmitter<EmitterTypes>;
export declare class Client extends Client_base {
    params: {
        token: string;
        REST?: boolean;
    };
    ws: WSManager;
    cache: any;
    identifiers: {
        Message: {
            ChatMessageCreated: string;
            ChatMessageUpdated: string;
            ChatMessageDeleted: string;
            ChannelMessageReactionCreated: string;
            ChannelMessageReactionDeleted: string;
        };
        Channel: {
            TeamChannelCreated: string;
            TeamChannelUpdated: string;
            TeamChannelDeleted: string;
        };
        ForumTopic: {
            ForumTopicCreated: string;
            ForumTopicUpdated: string;
            ForumTopicDeleted: string;
            ForumTopicPinned: string;
            ForumTopicUnpinned: string;
        };
        Guild: {
            TeamMemberBanned: string;
            TeamMemberUnbanned: string;
            TeamMemberJoined: string;
            TeamMemberRemoved: string;
            TeamMemberUpdated: string;
            teamRolesUpdated: string;
        };
        Webhook: {
            TeamWebhookCreated: string;
            TeamWebhookUpdated: string;
        };
        Doc: {
            DocCreated: string;
            DocUpdated: string;
            DocDeleted: string;
        };
        Calendar: {
            CalendarEventCreated: string;
            CalendarEventUpdated: string;
            CalendarEventDeleted: string;
            CalendarEventRsvpUpdated: string;
            CalendarEventRsvpDeleted: string;
        };
        List: {
            ListItemCreated: string;
            ListItemUpdated: string;
            ListItemDeleted: string;
            ListItemCompleted: string;
            ListItemUncompleted: string;
        };
    };
    constructor(params: {
        token: string;
        REST?: boolean;
    });
    /** Bot's token. */
    get token(): string;
    /** Connect to the Guilded API. */
    connect(...args: any[]): void;
    /** Disconnect from the Guilded API. */
    disconnect(crashOnDisconnect?: boolean): void;
    /** RESTChannel is a Channel component with every method, params you need. */
    getRESTChannel(channelID: string): Promise<Channel>;
    /** RESTMember is a Member component with every method, params you need. */
    getRESTMember(guildID: string, memberID: string): Promise<Member>;
    /** RESTGuild is basically a Guild Component with everything you need. */
    getRESTGuild(guildID: string): Promise<Guild>;
    /** Getting RESTChannelMessages will return you an Array of multiple Message component, that process can take some time. */
    getRESTChannelMessages(channelID: string, filter?: {
        before?: string;
        after?: string;
        limit?: number;
        includePrivate?: boolean;
    }): Promise<Array<Message>>;
    /** Getting RESTChannelDocs will return you an Array of multiple Doc component, that process can take some time. */
    getRESTChannelDocs(channelID: string, filter?: {
        before?: string;
        limit?: number;
    }): Promise<Array<Doc>>;
    /** RESTChannelDoc is a Doc component. */
    getRESTChannelDoc(channelID: string, docID: number): Promise<Doc>;
    /** Getting RESTForumTopics will return you an Array of ForumTopic, that process can take some time. */
    getRESTForumTopics(channelID: string, filter?: {
        before?: string;
        limit?: number;
    }): Promise<Array<ForumTopic>>;
    /** RESTForumTopic is a ForumTopic component. */
    getRESTForumTopic(channelID: string, topicID: number): Promise<ForumTopic>;
    /** Getting RESTCalendarEvents returns you an Array of multiple CalendarEvent component, this process can take time depending on the number of calendar event. */
    getRESTCalendarEvents(channelID: string, filter?: {
        before?: string;
        after?: string;
        limit?: number;
    }): Promise<Array<CalendarEvent>>;
    /** RESTCalendarEvent is a CalendarEvent component. */
    getRESTCalendarEvent(channelID: string, eventID: number): Promise<CalendarEvent>;
    /** RESTCalendarRsvp is a CalendarEventRSVP component. */
    getRESTCalendarRsvp(channelID: string, eventID: number, memberID: string): Promise<CalendarEventRSVP>;
    /** Getting RESTCalendarRsvps will return you an Array of CalendarEventRSVP, this process can take time.*/
    getRESTCalendarRsvps(channelID: string, eventID: number): Promise<Array<CalendarEventRSVP>>;
    /** RESTListItem is a ListItem component. */
    getRESTListItem(channelID: string, itemID: string): Promise<ListItem>;
    /** Getting RESTListItems will return you an Array of ListItems, this process can take time.*/
    getRESTListItems(channelID: string): Promise<Array<ListItem>>;
    getRESTGuildWebhook(guildID: string, webhookID: string): Promise<Webhook>;
    getRESTChannelWebhooks(guildID: string, channelID: string): Promise<Array<Webhook>>;
    /** Array of object containing channel messages */
    getChannelMessages(channelID: string, filter?: {
        before?: string;
        after?: string;
        limit?: number;
        includePrivate?: boolean;
    }): Promise<Array<object>>;
    /** Array of object containing channel docs */
    getChannelDocs(channelID: string, filter?: {
        before?: string;
        limit?: number;
    }): Promise<Array<object>>;
    /** Array of object containing forum topics */
    getForumTopics(channelID: string, filter?: {
        before?: string;
        limit?: number;
    }): Promise<Array<object>>;
    /** Array of object containing calendar events */
    getCalendarEvents(channelID: string, filter?: {
        before?: string;
        after?: string;
        limit?: number;
    }): Promise<Array<object>>;
    /** Array of object containing calendar rsvps */
    getCalendarRsvps(channelID: string, eventID: number): Promise<Array<object>>;
    /** Array of object containing list items */
    getListItems(channelID: string): Promise<Array<object>>;
    /** Will return an array containing every roles the member has. */
    getMemberRoles(guildID: string, memberID: string): Promise<Array<number>>;
    /** Array of object containing guild channel webhooks. */
    getChannelWebhooks(guildID: string, channelID: string): Promise<Array<object>>;
    /** Create a channel in a specified guild. */
    createChannel(guildID: string, name: string, type: ChannelCategories, options: {
        topic?: string;
        isPublic?: boolean;
        categoryID?: number;
        groupID?: string;
    }): Promise<Channel>;
    /** Create a message in a specified channel ID */
    createMessage(channelID: string, options: MessageOptions): Promise<Message>;
    /** Edit a specific message in a specified channel ID. */
    editMessage(channelID: string, messageID: string, newMessage: object): Promise<Message>;
    /** Delete a specific message. */
    deleteMessage(channelID: string, messageID: string): Promise<void>;
    /** Add a reaction to a specified message */
    addMessageReaction(channelID: string, messageID: string, reaction: number): Promise<void>;
    /** Remove a specific reaction from a message. */
    removeMessageReaction(channelID: string, messageID: string, reaction: number): Promise<void>;
    /** Create a topic in a specified forum channel. */
    createTopic(channelID: string, options: {
        title: string;
        content: string;
    }): Promise<ForumTopic>;
    /** Edit a topic from a specified forum channel. */
    editTopic(channelID: string, topicID: number, options: {
        title?: string;
        content?: string;
    }): Promise<ForumTopic>;
    /** Delete a topic from a specific forum channel */
    deleteTopic(channelID: string, topicID: number): Promise<void>;
    /** Pin a forum topic. */
    pinTopic(channelID: string, topicID: number): Promise<void>;
    /** Unpin a forum topic. */
    unpinTopic(channelID: string, topicID: number): Promise<void>;
    /** Locks a forum topic. */
    lockTopic(channelID: string, topicID: number): Promise<void>;
    /** Unlocks a forum topic. */
    unlockTopic(channelID: string, topicID: number): Promise<void>;
    /** Create a doc in a specified 'docs' channel. */
    createDoc(channelID: string, options: {
        title: string;
        content: string;
    }): Promise<Doc>;
    /** Edit a doc from a specified 'docs' channel. */
    editDoc(channelID: string, docID: number, options: {
        title: string;
        content: string;
    }): Promise<Doc>;
    /** Delete a doc from a specified 'docs' channel. */
    deleteDoc(channelID: string, docID: number): Promise<void>;
    /** Create an event into a calendar channel. */
    createCalendarEvent(channelID: string, options: {
        name: string;
        description?: string;
        location?: string;
        startsAt?: string;
        url?: string;
        color?: number;
        rsvpLimit?: number;
        duration?: number;
        isPrivate?: boolean;
    }): Promise<CalendarEvent>;
    /** Edit an event from a calendar channel. */
    editCalendarEvent(channelID: string, eventID: number, options: {
        name?: string;
        description?: string;
        location?: string;
        startsAt?: string;
        url?: string;
        color?: number;
        rsvpLimit?: number;
        duration?: number;
        isPrivate?: boolean;
    }): Promise<CalendarEvent>;
    /** Delete an event from a calendar channel. */
    deleteCalendarEvent(channelID: string, eventID: number): Promise<void>;
    /** Add/Edit a RSVP in a calendar event. */
    editCalendarRsvp(channelID: string, eventID: number, memberID: string, options: {
        status: 'going' | 'maybe' | 'declined' | 'invited' | 'waitlisted' | 'not responded';
    }): Promise<CalendarEventRSVP>;
    /** Delete a RSVP from a calendar event. */
    deleteCalendarRsvp(channelID: string, eventID: number, memberID: string): Promise<void>;
    /** Create a new item in a list channel. */
    createListItem(channelID: string, content: string, note?: {
        content: string;
    }): Promise<ListItem>;
    /** Edit a specific item from a list channel. */
    editListItem(channelID: string, itemID: string, content: string, note?: {
        content: string;
    }): Promise<ListItem>;
    /** Delete a specific item from a list channel. */
    deleteListItem(channelID: string, itemID: string): Promise<void>;
    /** Complete (checkmark will show up) a specific item from a list channel. */
    completeListItem(channelID: string, itemID: string): Promise<void>;
    /** Uncomplete (checkmark will disappear) a specific item from a list channel. */
    uncompleteListItem(channelID: string, itemID: string): Promise<void>;
    /** Add a Guild Member to a Guild Group */
    addGuildMemberGroup(groupID: string, memberID: string): Promise<void>;
    /** Remove a Guild Member from a Guild Group */
    removeGuildMemberGroup(groupID: string, memberID: string): Promise<void>;
    /** Add a role to a guild member */
    addGuildMemberRole(guildID: string, memberID: string, roleID: number): Promise<void>;
    /** Remove a role from a guild member */
    removeGuildMemberRole(guildID: string, memberID: string, roleID: number): Promise<void>;
    /** Create a guild webhook */
    createGuildWebhook(guildID: string, channelID: string, name: string): Promise<Webhook>;
    /** Update a guild webhook */
    editGuildWebhook(guildID: string, webhookID: string, options: {
        name: string;
        channelID?: string;
    }): Promise<Webhook>;
    /** Delete a guild webhook */
    deleteGuildWebhook(guildID: string, webhookID: string): Promise<void>;
}
export {};
