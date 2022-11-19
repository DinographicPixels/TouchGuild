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
    createdAt: number;
    createdBy: string;
    updatedAt?: number;
    updatedBy?: string;
    mentions?: APIMentions;
    content: string;
}

export interface socialLinkTypes {
    memberUsername: string;
    serviceID: string;
    type: string;
}

export interface GuildCreateInfo {
    guild: Guild;
    /** The ID of the user who created this server membership */
    createdBy: string;
}

export type AnyReactionInfo = MessageReactionInfo | ForumThreadReactionInfo;
