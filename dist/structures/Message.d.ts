import { Client } from './Client';
import { Channel } from './Channel';
import { Member } from './Member';
import { Guild } from './Guild';
import { MentionsType } from '../index';
/** Message component, with all its methods and declarations. */
export declare class Message {
    /** Raw data. */
    _data: any;
    /** Client */
    _client: Client;
    /** Message's id. */
    id: string;
    /** Message type. */
    type: string;
    /** ID of the server on which the message was sent. */
    guildID: string;
    /** ID of the channel on which the message was sent. */
    channelID: string;
    /** Content of the message. */
    content: string | undefined;
    /** Old content of the message, if edited. */
    oldContent: string | null;
    /** Array of message embed. */
    embeds: [] | undefined;
    /** The IDs of the message replied by the message. */
    replyMessageIds: string[];
    /**  */
    isPrivate: boolean | undefined;
    /**  */
    isSilent: boolean | undefined;
    /** object containing all mentioned users. */
    mentions: MentionsType;
    /** ID of the message author. */
    memberID: string;
    /** ID of the webhook used to send this message. (if sent by a webhook) */
    webhookID: string | undefined;
    /** Timestamp (unix epoch time) of the message's creation. */
    readonly _createdAt: number;
    /** Timestamp (unix epoch time) of the last message update/edition. */
    readonly _updatedAt: number | null;
    /** Timestamp (unix epoch time) of the message's deletion. */
    readonly _deletedAt: number | null;
    /** ID of the last message created with the message itself. */
    _lastMessageID: string | null;
    /** ID of the message's original message. */
    _originalMessageID: string | null;
    private _originalMessageBool;
    constructor(data: any, client: Client, params?: {
        oldMessage?: object;
        originalMessageID?: string | null;
    });
    /** string representation of the _createdAt timestamp. */
    get createdAt(): Date;
    /** string representation of the _updatedAt timestamp. */
    get updatedAt(): Date | void;
    /** string representation of the _deletedAt timestamp. */
    get deletedAt(): Date | void;
    /** Get the member component, which returns Member when message guildID and memberID is defined or if Member is cached. */
    get member(): Member | undefined;
    /** Get the Guild component. */
    get guild(): Guild;
    /** Get the Channel component. */
    get channel(): Channel;
    private setCache;
    /** Used to create a message on the same channel as the message. */
    createMessage(options: MessageOptions): Promise<Message>;
    /** Edit message. */
    edit(newMessage: {
        content?: string;
        embeds?: Array<EmbedOptions>;
    }): Promise<Message>;
    /** Delete message. */
    delete(): Promise<void>;
    /** Edit the last message sent with the message itself. */
    editLastMessage(newMessage: {
        content?: string;
        embeds?: Array<EmbedOptions>;
    }): Promise<Message>;
    /** Delete the last message sent with the message itself. */
    deleteLastMessage(): Promise<Boolean>;
    /** Edit the message's original response message. */
    editOriginalMessage(newMessage: {
        content?: string;
        embeds?: Array<EmbedOptions>;
    }): Promise<Message>;
    /** Delete the message's original response message. */
    deleteOriginalMessage(): Promise<Boolean>;
    /** Add a reaction to the message */
    addReaction(reaction: number): Promise<void>;
    /** Remove a reaction from the message. */
    removeReaction(reaction: number): Promise<void>;
}
/** Embed types. */
export interface EmbedOptions {
    title?: string;
    description?: string;
    url?: string;
    color?: number;
    footer?: {
        icon_url?: string;
        text?: string;
    };
    timestamp?: string;
    thumbnail?: {
        url?: string;
    };
    image?: {
        url?: string;
    };
    author?: {
        name?: string;
        url?: string;
        icon_url?: string;
    };
    fields?: Array<EmbedField>;
}
/** Types for an embed field. */
export interface EmbedField {
    name: string;
    value: string;
    inline?: boolean;
}
/** Types for message options. */
export interface MessageOptions {
    content?: string;
    embeds?: Array<EmbedOptions>;
    replyMessageIds?: Array<string>;
    isSilent?: boolean;
    isPrivate?: boolean;
}
