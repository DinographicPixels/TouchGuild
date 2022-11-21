/** @module Types */
import { ForumThread } from "../structures/ForumThread";
import { Guild } from "../structures/Guild";
import { Member } from "../structures/Member";
import { Message } from "../structures/Message";
import type { MessageReactionInfo } from "../structures/MessageReactionInfo";
import type { ForumThreadReactionInfo } from "../structures/ForumThreadReactionInfo";
import type { APIEmote, APIMentions } from "../Constants";

export interface messageReactionInfo {
    message: Message | {
        id: string;
        guild: Guild | {
            id?: string;
        };
        channelID: string;
    };
    emoji: APIEmote;
    reactor: Member | {
        id: string;
    };
}

export interface forumThreadReactionInfo {
    thread: ForumThread | {
        id: number;
        guild: Guild | {
            id?: string;
        };
        channelID: string;
    };
    emoji: APIEmote;
    reactor: Member | {
        id: string;
    };
}

// deprecated.
export interface UserClientTypes {
    user: {
        id: string;
        botID: string;
        username: string;
        createdAt: number;
        createdBy: string;
    };
}

export interface ListItemNoteTypes {
    /** Date of the note's creation. */
    createdAt: Date;
    /** ID of the member who created this note. */
    memberID: string;
    /** Date of the note's last edition, if edited. */
    editedTimestamp: null | Date;
    /** ID of the member who edited this note, if edited. */
    editedBy: null | string;
    /** The mentions in this note. */
    mentions: null | APIMentions;
    /** The content of the note. */
    content: string;
}

export interface GetSocialLink {
    memberUsername: string;
    serviceID: string;
    type: string;
}

export interface GuildCreateInfo {
    guild: Guild;
    /** The ID of the member who invited the bot to the guild. */
    inviterID: string;
}

export type AnyReactionInfo = MessageReactionInfo | ForumThreadReactionInfo;
