import { ForumTopic } from "../structures/ForumTopic";
import { Guild } from "../structures/Guild";
import { Member } from "../structures/Member";
import { Message } from "../structures/Message";
import { APIEmote, APIMentions } from "guildedapi-types.ts/v1";

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

export interface forumTopicReactionInfo {
    topic: ForumTopic | {
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
