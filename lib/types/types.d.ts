/** @module Types */
import { ForumThread } from "../structures/ForumThread";
import { Guild } from "../structures/Guild";
import { Member } from "../structures/Member";
import { Message } from "../structures/Message";
import type { MessageReactionInfo } from "../structures/MessageReactionInfo";
import type { ForumThreadReactionInfo } from "../structures/ForumThreadReactionInfo";
import type { APIEmote, APIMentions } from "../Constants";

export interface MessageReactionTypes {
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

export interface ForumThreadReactionTypes {
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

export interface UserClientTypes {
    /** Client's user. */
    user: {
        /** The ID of this user. */
        id: string;
        /** The Bot ID of this user. */
        botID: string;
        /** The user */
        username: string;
        /** When the user was created. */
        createdAt: Date;
        /** The owner of this bot. */
        ownerID: string;
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
    /** The ID of the member who invited the client to the guild. */
    inviterID: string;
}

export interface GuildDeleteInfo {
    guild: Guild;
    /** The ID of the member who removed the client. */
    removerID: string;
}

export type AnyReactionInfo = MessageReactionInfo | ForumThreadReactionInfo;
export interface Uncached<ID = string | number> { id: ID; }
