import { Guild } from "./structures/Guild"
import { Member } from "./structures/Member"
import { Message } from "./structures/Message"

export declare type MentionsType = {
    users?: Array<object>,
    channels?: Array<object>,
    roles?: Array<object>,
    everyone?: boolean,
    here?: boolean
}

export declare type ListItemNoteTypes = {
    createdAt: number,
    createdBy: string,
    updatedAt?: number,
    updatedBy?: string,
    mentions?: MentionsType,
    content: string
}

/* Channel edit types */
export type ChannelEditTypes = {
    name?: string,
    topic?: string,
    isPublic?: boolean
}

export type ChannelCategories = 'announcement'|'chat'|'calendar'|'forums'|'media'|'docs'|'voice'|'list'|'scheduling'|'stream';

/** Message Reaction Raw data types */
export type messageReactionRawTypes = {
    serverId: string,
    reaction: {
        channelId: string,
        messageId: string,
        createdBy: string,
        emote: {
            id: number|string,
            name: string,
            url: string
        }
    }
}

/** TouchGuild's message reaction types */
export type messageReactionTypes = {
    message: Message|{
        id: string,
        guild: Guild | {
            id: string
        },
        channelID: string
    }, 
    emoji: emojiTypes,
    reactor: Member| {
        id: string
    }
}

export type emojiTypes = {
    id: number|string,
    name: string,
    url: string
}

/** social link types */
export type socialLinkTypes = {
    memberUsername: string,
    serviceID: string,
    type: string
}

export type UserClientTypes = {
    id: string,
    botID: string,
    username: string,
    createdAt: Number,
    createdBy: string
}