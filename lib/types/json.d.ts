import { Member } from "../structures/Member";
import { User } from "../structures/User";
import { Guild } from "../structures/Guild";
import { APICalendarEvent } from "guildedapi-types.ts/v1";

export interface JSONBase<ID= string | number> {
    // createdAt: number;
    id: ID;
}

export interface JSONMessage extends JSONBase<string> {
    /** Message type. */
    type: string;
    /** ID of the server on which the message was sent. */
    guildID: string | null;
    /** ID of the channel on which the message was sent. */
    channelID: string;
    /** Content of the message. */
    content: string | null;
    /** Array of message embed. */
    embeds?: Array<APIEmbedOptions> | [];
    /** The IDs of the message replied by the message. */
    replyMessageIds: Array<string>;
    /** If true, the message appears as private. */
    isPrivate: boolean;
    /** If true, the message didn't mention anyone. */
    isSilent: boolean;
    /** object containing all mentioned users. */
    mentions: APIMentions;
    /** ID of the message author. */
    memberID: string;
    /** ID of the webhook used to send this message. (if sent by a webhook) */
    webhookID?: string | null;
    /** When the message was created. */
    createdAt: Date;
    /** Timestamp at which this message was last edited. */
    editedTimestamp: Date | null;
    /** When the message was deleted. */
    deletedAt: Date | null;
}

export interface JSONForumThreadComment extends JSONBase<number> {
    /** The content of the forum thread comment */
    content: string;
    /** The ISO 8601 timestamp that the forum thread comment was created at */
    createdAt: Date;
    /** The ISO 8601 timestamp that the forum thread comment was updated at, if relevant */
    updatedAt: Date | null;
    /** The ID of the forum thread */
    threadID: number;
    /** The ID of the user who sent this comment. */
    memberID: string;
    /** ID of the forum thread's server, if provided. */
    guildID: string | null;
    /** ID of the forum channel containing this thread. */
    channelID: string;
    /** Mentions in this thread comment. */
    mentions: APIMentions | null;
}

export interface JSONDoc extends JSONBase<number> {
    /** Guild/server id */
    guildID: string;
    /** ID of the 'docs' channel. */
    channelID: string;
    /** Doc name */
    name: string;
    /** Content of the doc */
    content: string;
    /** Doc mentions  */
    mentions: APIMentions;
    /** When the doc has been created. */
    createdAt: Date;
    /** ID of the member who created this doc. */
    memberID: string;
    /** When the doc has been updated. */
    editedTimestamp: Date | null;
    /** ID of the member who updated the doc. */
    updatedBy: string | null;
}

export interface JSONChannel extends JSONBase<string> {
    /** Channel type */
    type: string;
    /** Channel name */
    name: string | null;
}

export interface JSONGuildChannel extends JSONBase<string> {
    /** Channel type */
    type: string;
    /** Channel name */
    name: string;
    /** Channel description */
    description: string | null;
    /** When this channel was created. */
    createdAt: Date;
    /** ID of the member who created this channel. */
    creatorID: string;
    /** Timestamp at which this channel was last edited. */
    editedTimestamp: Date | null;
    /** Server ID */
    guildID: string;
    /** ID of the parent category. */
    parentID: string | null;
    /** ID of the category the channel is in. */
    categoryID: number | null;
    /** ID of the group the channel is in. */
    groupID: string;
    isPublic: boolean;
    /** ID of the member that archived the channel (if archived) */
    archivedBy: string | null;
    /** When the channel was last archived. */
    archivedAt: Date | null;
}

export interface JSONTextChannel extends JSONGuildChannel {
    /** Cached messages. */
    messages: Array<JSONMessage>;
}

export interface JSONForumChannel extends JSONGuildChannel {
    /** Cached threads. */
    threads: Array<JSONForumThread>;
}

export interface JSONDocChannel extends JSONGuildChannel {
    /** Cached docs. */
    docs: Array<JSONDoc>;
}

export interface JSONCalendarChannel extends JSONGuildChannel {
    /** Cached scheduled events. */
    scheduledEvents: Array<JSONCalendarEvent>;
}

export type AnyJSONChannel = JSONTextChannel | JSONDocChannel | JSONForumChannel | JSONGuildChannel | JSONCalendarChannel;

export interface JSONCalendarEvent extends JSONBase<number> {
    /** Raw data */
    data: APICalendarEvent;
    /** Guild/server ID */
    guildID: string;
    /** ID of the channel the event was created on. */
    channelID: string;
    /** Name of the event */
    name: string;
    /** Event's description */
    description: string | null;
    /** Event user-specified location */
    location: string | null;
    /** Event user-specified url */
    url: string | null;
    /** Event color in calendar. */
    color: number | null;
    /** Limit of event entry. */
    rsvpLimit: number | null;
    /** Timestamp (unix epoch time) of the event starting time.*/
    startsAt: Date | null;
    /** Duration in *ms* of the event. */
    duration: number;
    /** If true, this event is private. */
    isPrivate: boolean;
    /** Mentions in this calendar event. */
    mentions: APIMentions | null;
    /** When the event was created. */
    createdAt: Date | null;
    /** ID of the owner of this event. */
    ownerID: string;
    /** Details about event cancelation (if canceled) */
    cancelation: APICalendarEvent["cancellation"] | null;
    /** Cached RSVPS. */
    rsvps: Array<JSONCalendarEventRSVP>;
}

export interface JSONCalendarEventRSVP extends JSONBase<number> {
    /** Guild/server ID. */
    guildID: string;
    /** Calendar channel id. */
    channelID: string;
    /** ID of the entity assigned to this Event RSVP. */
    entityID: string;
    /** Status of the RSVP */
    status: APICalendarEventRSVPStatuses;
    /** When the RSVP was created. */
    createdAt: Date | null;
    /** ID of the user who created this RSVP. */
    creatorID: string;
    /** When the RSVP was updated. */
    updatedAt: Date | null;
    /** ID of the member who updated the rsvp, if updated. */
    updatedBy?: string | null;
}

export interface JSONBannedMember extends JSONBase<string> {
    /** Server ID. */
    guildID: string;
    /** Information about the banned member (object) */
    ban: {
        /** Reason of the ban */
        reason?: string;
        /** When the member has been banned. */
        createdAt: Date | null;
        /** ID of the member who banned this member. */
        bannedBy: string;
    };
}

export interface JSONForumThread extends JSONBase<number> {
    /** Guild/server id */
    guildID: string;
    /** Forum channel id */
    channelID: string;
    /** Name of the thread */
    name: string;
    /** When this forum thread was created. */
    createdAt: Date;
    /** Owner of this thread, if cached. */
    owner: T extends Guild ? Member : Member | User | Promise<Member> | undefined;
    /** The ID of the owner of this thread. */
    ownerID: string;
    /** ID of the webhook that created the thread (if created by webhook) */
    webhookID: string | null;
    /** Timestamp at which this channel was last edited. */
    editedTimestamp: Date | null;
    /** Timestamp (unix epoch time) that the forum thread was bumped at. */
    bumpedAt: Date | null;
    /** Content of the thread */
    content: string;
    /** Thread mentions */
    mentions: APIMentions | null;
    /** Cached comments. */
    comments: Array<JSONForumThreadComment>;
    /** If true, the thread is locked. */
    isLocked: boolean;
    /** If true, the thread is pinned. */
    isPinned: boolean;
}

export interface JSONUser extends JSONBase<string> {
    /** User type */
    type: UserTypes | null;
    /** User's username. */
    username: string;
    /** Current avatar url of the user. */
    avatarURL: string | null;
    /** Current banned url of the user. */
    bannerURL: string | null;
    /** When the user account was created. */
    createdAt: Date; // user
    /** If true, the user is a bot. */
    bot: boolean;
}

export interface JSONMember extends JSONUser {
    /** When this member joined the guild. */
    joinedAt: Date | null;
    /** Array of member's roles. */
    roles: Array<number>;
    /** Member's server nickname. */
    nickname: string | null;
    /** Tells you if the member is the server owner. */
    isOwner: boolean;
    /** Server ID. */
    guildID: string; // member
}

export interface JSONGuild extends JSONBase<string> {
    /** ID of the guild owner. */
    ownerID: string;
    /** Guild type. */
    type?: string;
    /** The name of the guild. */
    name: string;
    /** The URL of the guild. */
    url?: string;
    /** Guild description. */
    description?: string;
    /** Guild icon URL. */
    iconURL?: string | null;
    /** Guild banner URL. */
    bannerURL?: string | null;
    /** Guild's timezone. */
    timezone?: string;
    /** Default channel of the guild. */
    defaultChannelID?: string;
    /** When this guild was created. */
    createdAt: Date;
    /** If true, the guild is verified. */
    verified: boolean;
    /** Cached guild channels. */
    channels: Array<AnyJSONChannel>;
    /** Cached guild members. */
    members: Array<JSONMember>;
}

export interface JSONUserClient extends JSONBase<string> {
    /** Client User Bot ID */
    botID: string;
    /** User type (user, bot) */
    type: string;
    /** User's name */
    username: string;
    /** When the bot client was created. */
    createdAt: Date;
    /** ID of the bot's owner. */
    ownerID: string;
}

export interface JSONWebhook extends JSONBase<string> {
    /** ID of the guild, where the webhook comes from. */
    guildID: string;
    /** ID of the channel, where the webhook comes from. */
    channelID: string;
    /** Username of the webhook. */
    username: string;
    /** When the webhook was created. */
    createdAt: Date;
    /** ID of the webhook's owner. */
    ownerID: string;
    /** When the webhook was deleted. */
    deletedAt: Date | null;
    /** Token of the webhook. */
    token: string | null;
}

export interface JSONListItem extends JSONBase<string> {
    /** Guild id */
    guildID: string;
    /** ID of the 'docs' channel. */
    channelID: string;
    /** Content of the doc */
    content: string;
    mentions: APIMentions | null;
    /** When the item was created. */
    createdAt: Date | null;
    /** ID of the member who created the doc. */
    memberID: string;
    /** ID of the webhook that created the list item (if it was created by a webhook) */
    webhookID: string | null;
    /** Timestamp at which the item was updated. */
    editedTimestamp: Date | null;
    /** ID of the member who updated the doc. (if updated) */
    updatedBy: string | null;
    /** The ID of the parent list item if this list item is nested */
    parentListItemID: string | null;
    /** When the list item was marked as "completed". */
    completedAt: Date | null;
    /** ID of the member that completed the item, if completed. */
    completedBy: string | null;
}
