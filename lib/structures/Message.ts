import { Client } from "./Client";
import { Channel } from "./Channel";
import { Member } from "./Member";
import { Guild } from "./Guild";

import * as endpoints from "../rest/endpoints";
import { call } from "../Utils";

import {
    APIChatMessage,
    APIEmbedOptions,
    APIMentions,
    APIMessageOptions,
    GETChannelMessageResponse,
    PUTChannelMessageResponse
} from "guildedapi-types.ts/v1";

const calls = new call();

/** Message component, with all its methods and declarations. */
export class Message {
    /** Raw data. */
    _data: APIChatMessage;
    /** Client */
    _client: Client;
    /** Message's id. */
    id: string;
    /** Message type. */
    type: string;
    /** ID of the server on which the message was sent. */
    guildID: string | null;
    /** ID of the channel on which the message was sent. */
    channelID: string;
    /** Content of the message. */
    content: string|undefined;
    /** Old content of the message, if edited. */
    oldContent: string|null;
    /** Array of message embed. */
    embeds?: Array<APIEmbedOptions> | [];
    /** The IDs of the message replied by the message. */
    replyMessageIds: Array<string>;
    isPrivate: boolean|undefined;
    isSilent: boolean|undefined;
    /** object containing all mentioned users. */
    mentions: APIMentions;
    /** ID of the message author. */
    memberID: string;
    /** ID of the webhook used to send this message. (if sent by a webhook) */
    webhookID?: string|null;

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

    constructor(data: APIChatMessage, client: Client, params?: {oldMessage?: object; originalMessageID?: string|null;}){
        this._data = data;
        this._client = client;
        // warning: Message could be splitted into GuildMessage and Message, this action will be taken when Guilded allows bots to chat in DMs.
        this.id = data.id;
        this.type = data.type;
        this.guildID = data.serverId ?? null;
        this.channelID = data.channelId;
        this.content = data.content ?? "";
        this.embeds = data.embeds ?? [];
        this.replyMessageIds = data.replyMessageIds ?? [];
        this.isPrivate = data.isPrivate ?? false;
        this.isSilent = data.isSilent ?? false;
        this.mentions = data.mentions as APIMentions ?? null;
        this._createdAt = Date.parse(data.createdAt);
        this._updatedAt = data.updatedAt ? Date.parse(data.updatedAt) : null;
        this.memberID = data.createdBy;
        this.webhookID = data.createdByWebhookId ?? null;
        this._deletedAt = data["deletedAt" as keyof object] ? Date.parse(data["deletedAt" as keyof object]) : null;
        this._lastMessageID = null;
        this._originalMessageID = params?.originalMessageID ?? null;
        this._originalMessageBool = false;
        this.oldContent = params?.oldMessage?.["content" as keyof object] ?? null; // taken from cache.
        // Object.keys(this).forEach(key => this[key as keyof object] === undefined ? delete this[key as keyof object] : {});
        this.setCache.bind(this); this.setCache();
        // data, fulldata, client, id, type
    }

    /** string representation of the _createdAt timestamp. */
    get createdAt(): Date{
        return new Date(this._createdAt);
    }

    /** string representation of the _updatedAt timestamp. */
    get updatedAt(): Date|void{
        return this._updatedAt !== null ? new Date(this._updatedAt) : undefined;
    }

    /** string representation of the _deletedAt timestamp. */
    get deletedAt(): Date|void{
        return this._deletedAt !== null ? new Date(this._deletedAt) : undefined;
    }

    /** Get the member component, which returns Member when message guildID and memberID is defined or if Member is cached. */
    get member(): Member|undefined {
        if (this.memberID && this.guildID){
            return calls.syncGetMember(this.guildID, this.memberID, this._client) as Member;
        } else if (this._client.cache.has(`messageComponent_${this.id}`)){
            const component = this._client.cache.get(`messageComponent_${this.id}`) as Message;
            if (component.guildID && component.memberID){
                return calls.syncGetMember(component.guildID, component.memberID, this._client) as Member;
            }
        }
    }

    /** Get the Guild component. */
    get guild(): Guild{
        if (!this.guildID) throw new TypeError("Couldn't get Guild, 'guildID' is not defined. You're probably using a modified version of the Message component.");
        return calls.syncGetGuild(this.guildID, this._client) as Guild;
    }

    /** Get the Channel component. */
    get channel(): Channel{
        if (!this.channelID) throw new TypeError("Couldn't get Channel, 'channelID' is not defined. You're probably using a modified version of the Message component.");
        return calls.syncGetChannel(this.channelID, this._client) as Channel;
    }

    private setCache(): void {
        if (this.guildID) this._client.cache.set(`guildComponent_${this.guildID}`, this.guild);
        this._client.cache.set(`guildMember_${this.memberID}`, this.member);
    }

    /** Used to create a message on the same channel as the message. */
    async createMessage(options: APIMessageOptions): Promise<Message>{
        if (typeof options !== "object") throw new TypeError("message options should be an object.");
        const response = await calls.post(endpoints.CHANNEL_MESSAGES(this.channelID), this._client.token, options);
        const resdata = response["data" as keyof object] as GETChannelMessageResponse;
        this._lastMessageID = resdata.message.id;
        if (this._originalMessageBool === false){
            this._originalMessageBool = true;
            this._originalMessageID = resdata.message.id;
        }
        const message = new Message(resdata.message, this._client, { originalMessageID: this._originalMessageID });
        return message;
    }

    /** Edit message. */
    async edit(newMessage: {content?: string; embeds?: Array<APIEmbedOptions>;}): Promise<Message>{
        if (typeof newMessage !== "object") throw new TypeError("newMessage should be an Object. (example: {content: 'heyo!'})");
        const response = await calls.put(endpoints.CHANNEL_MESSAGE(this.channelID, this.id), this._client.token, newMessage);
        return new Message((response["data" as keyof object] as PUTChannelMessageResponse).message as APIChatMessage, this._client, { originalMessageID: this._originalMessageID });
    }

    /** Delete message. */
    async delete(): Promise<void> {
        await calls.delete(endpoints.CHANNEL_MESSAGE(this.channelID, this.id), this._client.token);
    }


    /** Edit the last message sent with the message itself. */
    async editLastMessage(newMessage: {content?: string; embeds?: Array<APIEmbedOptions>;}): Promise<Message>{
        if (typeof newMessage !== "object") throw new TypeError("newMessage should be an object. (example: {content: 'heyo!'})");
        if (!this._lastMessageID) throw new TypeError("Can't edit last message if it does not exist.");
        const response = await calls.put(endpoints.CHANNEL_MESSAGE(this.channelID, this._lastMessageID), this._client.token, newMessage);
        return new Message((response["data" as keyof object] as PUTChannelMessageResponse).message as APIChatMessage, this._client);
    }

    /** Delete the last message sent with the message itself. */
    async deleteLastMessage(): Promise<boolean>{
        if (!this._lastMessageID) throw new TypeError("Can't delete last message if it does not exist.");
        await calls.delete(endpoints.CHANNEL_MESSAGE(this.channelID, this._lastMessageID), this._client.token);
        return true;
    }

    /** Edit the message's original response message. */
    async editOriginalMessage(newMessage: {content?: string; embeds?: Array<APIEmbedOptions>;}): Promise<Message>{
        if (typeof newMessage !== "object") throw new TypeError("newMessage should be an object. (example: {content: 'heyo!'})");
        if (!this._originalMessageID) throw new TypeError("Can't edit original message if it does not exist.");
        const response = await calls.put(endpoints.CHANNEL_MESSAGE(this.channelID, this._originalMessageID), this._client.token, newMessage);
        return new Message((response["data" as keyof object] as PUTChannelMessageResponse).message as APIChatMessage, this._client, { originalMessageID: this._originalMessageID });
    }

    /** Delete the message's original response message. */
    async deleteOriginalMessage(): Promise<boolean>{
        if (!this._originalMessageID) throw new TypeError("Can't delete original message if it does not exist.");
        await calls.delete(endpoints.CHANNEL_MESSAGE(this.channelID, this._originalMessageID), this._client.token);
        return true;
    }

    /** Add a reaction to the message. */
    async addReaction(reaction: number): Promise<void>{
        await calls.put(endpoints.CHANNEL_MESSAGE_CONTENT_EMOTE(this.channelID, this.id, reaction), this._client.token, {});
    }

    /** Remove a reaction from the message. */
    async removeReaction(reaction: number): Promise<void>{
        await calls.delete(endpoints.CHANNEL_MESSAGE_CONTENT_EMOTE(this.channelID, this.id, reaction), this._client.token);
    }
}
