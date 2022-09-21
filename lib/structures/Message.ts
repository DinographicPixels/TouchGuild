import { Client } from './Client';
import { Channel } from './Channel';
import { Member } from './Member';
import { Guild } from './Guild';

import * as endpoints from '../rest/endpoints';
import { call } from '../Utils';
import { MentionsType } from './ListItem';

const calls = new call();

/** Message component, with all its methods and declarations. */
export class Message {
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
    content: string|undefined; 
    /** Old content of the message, if edited. */
    oldContent:string|null; 
    /** Array of message embed. */
    embeds: []|undefined; 
    /** The IDs of the message replied by the message. */
    replyMessageIds: string[]; 
    /**  */
    isPrivate: boolean|undefined; 
    /**  */
    isSilent: boolean|undefined;
    /** object containing all mentioned users. */
    mentions: MentionsType;
    /** ID of the message author. */
    memberID: string; 
    /** ID of the webhook used to send this message. (if sent by a webhook) */
    webhookID: string|undefined;

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
    private _originalMessageBool: boolean;

    constructor(data: any, client:Client, params?:{oldMessage?: object, originalMessageID?: string|null}){
        this._data = data;
        this._client = client;
        // warning: Message could be splitted into GuildMessage and Message, this action will be taken when Guilded allows bots to chat in DMs.
        this.id = data.id
        this.type = data.type
        this.guildID = data.serverId ?? null
        this.channelID = data.channelId
        this.content = data.content ?? '';
        this.embeds = data.embeds ?? []
        this.replyMessageIds = data.replyMessageIds ?? []
        this.isPrivate = data.isPrivate ?? false
        this.isSilent = data.isSilent ?? false
        this.mentions = data.mentions ?? null
        this._createdAt = Date.parse(data.createdAt);
        this._updatedAt = data.updatedAt ? Date.parse(data.updatedAt): null;
        this.memberID = data.createdBy
        this.webhookID = data.createdByWebhookId ?? null
        this._deletedAt = data.deletedAt ? Date.parse(data.deletedAt): null;
        this._lastMessageID = null;
        this._originalMessageID = params?.originalMessageID ?? null;
        this._originalMessageBool = false;
        this.oldContent = params?.oldMessage?.['content' as keyof object] ?? null // taken from cache.
        //Object.keys(this).forEach(key => this[key as keyof object] === undefined ? delete this[key as keyof object] : {});
        this.setCache.bind(this); this.setCache();
        // data, fulldata, client, id, type
    }

    /** string representation of the _createdAt timestamp. */
    get createdAt(): Date{
        return new Date(this._createdAt);
    }

    /** string representation of the _updatedAt timestamp. */
    get updatedAt(): Date|void{
        if (this._updatedAt !== null){
            return new Date(this._updatedAt);
        }else return;
    }

    /** string representation of the _deletedAt timestamp. */
    get deletedAt(): Date|void{
        if (this._deletedAt !== null){
            return new Date(this._deletedAt);
        }else return;
    }

    /** Get the member component, which returns Member when message guildID and memberID is defined or if Member is cached. */
    get member(): Member|undefined {
        if (this.memberID && this.guildID){
                return calls.syncGetMember(this.guildID, this.memberID, this._client) as Member;
        }else if (this._client.cache.has(`messageComponent_${this.id}`)){
            var component = this._client.cache.get(`messageComponent_${this.id}`);
            if (component.guildID && component.createdBy){
                return calls.syncGetMember(component.guildID, component.createdBy, this._client) as Member;
            }
        }
    }

    /** Get the Guild component. */
    get guild(): Guild{
        if (!this.guildID) throw new TypeError("Couldn't get Guild, 'guildID' is not defined. You're probably using a modified version of the Message component.");
        return calls.syncGetGuild(this.guildID, this._client) as Guild
    }

    /** Get the Channel component. */
    get channel(): Channel{
        if (!this.channelID) throw new TypeError("Couldn't get Channel, 'channelID' is not defined. You're probably using a modified version of the Message component.");
        return calls.syncGetChannel(this.channelID, this._client) as Channel;
    }

    private async setCache(){
        await this._client.cache.set(`guildComponent_${this.guildID}`, this.guild);
        await this._client.cache.set(`guildMember_${this.memberID}`, this.member);
    }

    /** Used to create a message on the same channel as the message. */
    async createMessage(options: MessageOptions): Promise<Message>{
        if (typeof options !== 'object') throw new TypeError('message options should be an object.');
        let response:any = await calls.post(endpoints.CHANNEL_MESSAGES(this.channelID), this._client.token, options)
        this._lastMessageID = response.data.message.id; 
        if (this._originalMessageBool == false){
            this._originalMessageBool = true;
            this._originalMessageID = response.data.message.id
        }
        var message = new Message(response.data.message, this._client, {originalMessageID: this._originalMessageID});
        return message;
    }

    /** Edit message. */
    async edit(newMessage: {content?: string, embeds?: Array<EmbedOptions>}): Promise<Message>{
        if (typeof newMessage !== 'object') throw new TypeError("newMessage should be an Object. (example: {content: 'heyo!'})")
        let response:any = await calls.put(endpoints.CHANNEL_MESSAGE(this.channelID, this.id), this._client.token, newMessage);
        return new Message(response.data.message, this._client, {originalMessageID: this._originalMessageID});
    }

    /** Delete message. */
    async delete(){
        await calls.delete(endpoints.CHANNEL_MESSAGE(this.channelID, this.id), this._client.token);
    }


    /** Edit the last message sent with the message itself. */
    async editLastMessage(newMessage: {content?: string, embeds?: Array<EmbedOptions>}): Promise<Message>{
        if (typeof newMessage !== 'object') throw new TypeError("newMessage should be an object. (example: {content: 'heyo!'})")
        if (!this._lastMessageID) throw new TypeError("Can't edit last message if it does not exist.")
        let response:any = await calls.put(endpoints.CHANNEL_MESSAGE(this.channelID, this._lastMessageID), this._client.token, newMessage);
        return new Message(response.data.message, this._client);
    }

    /** Delete the last message sent with the message itself. */
    async deleteLastMessage(): Promise<Boolean>{
        if (!this._lastMessageID) throw new TypeError("Can't delete last message if it does not exist.");
        await calls.delete(endpoints.CHANNEL_MESSAGE(this.channelID, this._lastMessageID), this._client.token);
        return true;
    }

    /** Edit the message's original response message. */
    async editOriginalMessage(newMessage: {content?: string, embeds?: Array<EmbedOptions>}): Promise<Message>{
        if (typeof newMessage !== 'object') throw new TypeError("newMessage should be an object. (example: {content: 'heyo!'})")
        if (!this._originalMessageID) throw new TypeError("Can't edit original message if it does not exist.")
        let response:any = await calls.put(endpoints.CHANNEL_MESSAGE(this.channelID, this._originalMessageID), this._client.token, newMessage);
        return new Message(response.data.message, this._client, {originalMessageID: this._originalMessageID});
    }

    /** Delete the message's original response message. */
    async deleteOriginalMessage(): Promise<Boolean>{
        if (!this._originalMessageID) throw new TypeError("Can't delete original message if it does not exist.");
        await calls.delete(endpoints.CHANNEL_MESSAGE(this.channelID, this._originalMessageID), this._client.token);
        return true;
    }

    /** Add a reaction to the message */
    async addReaction(reaction: number): Promise<void>{
        await calls.put(endpoints.CHANNEL_MESSAGE_CONTENT_EMOTE(this.channelID, this.id, reaction), this._client.token, {});
    }

    /** Remove a reaction from the message. */
    async removeReaction(reaction: number): Promise<void>{
        await calls.delete(endpoints.CHANNEL_MESSAGE_CONTENT_EMOTE(this.channelID, this.id, reaction), this._client.token);
    }
}

/** Embed types. */
export interface EmbedOptions {
    title?: string,
    description?: string,
    url?: string,
    color?: number,
    footer?: {
        icon_url?: string,
        text?: string
    },
    timestamp?: string,
    thumbnail?: {
        url?: string
    },
    image?: {
        url?: string
    },
    author?: {
        name?: string,
        url?: string,
        icon_url?: string
    },
    fields?: Array<EmbedField>
} // ik partial exists


/** Types for an embed field. */
export interface EmbedField {
    name: string,
    value: string,
    inline?: boolean
}

/** Types for message options. */
export interface MessageOptions {
    content?: string,
    embeds?: Array<EmbedOptions>,
    replyMessageIds?: Array<string>,
    isSilent?: boolean,
    isPrivate?: boolean
}