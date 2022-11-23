/** @module Message */
import { Client } from "./Client";
import { Channel } from "./Channel";
import { Member } from "./Member";
import { Guild } from "./Guild";

import { Base } from "./Base";

import { User } from "./User";
import { APIChatMessage, APIEmbedOptions, APIMentions, APIMessageOptions } from "../Constants";

/** Message component, with all its methods and declarations. */
export class Message extends Base {
    /** Raw data. */
    #data: APIChatMessage;
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
    isPrivate: boolean | null;
    isSilent: boolean | null;
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

    /** ID of the last message created with the message itself. */
    _lastMessageID: string | null;
    /** ID of the message's original message. */
    #originalMessageID: string | null;
    #originalMessageBool: boolean;

    constructor(data: APIChatMessage, client: Client, params?: { originalMessageID?: string | null; }){
        super(data.id, client);
        this.#data = data;
        this.type = data.type;
        this.guildID = data.serverId ?? null;
        this.channelID = data.channelId;
        this.content = data.content ?? "";
        this.embeds = data.embeds ?? [];
        this.replyMessageIds = data.replyMessageIds ?? [];
        this.isPrivate = data.isPrivate ?? null;
        this.isSilent = data.isSilent ?? null;
        this.mentions = data.mentions as APIMentions ?? null;
        this.createdAt = new Date(data.createdAt);
        this.editedTimestamp = data.updatedAt ? new Date(data.updatedAt) : null;
        this.memberID = data.createdBy;
        this.webhookID = data.createdByWebhookId ?? null;
        this.deletedAt = data["deletedAt" as keyof object] ? new Date(data["deletedAt" as keyof object]) : null;
        this._lastMessageID = null;
        this.#originalMessageID = params?.originalMessageID ?? null;
        this.#originalMessageBool = false;
        void this.setCache.bind(this)();
    }

    /** Retrieve message's member, if cached.
     * If there is no cached member or user, this will make a request which returns a Promise.
     * If the request fails, this will throw an error or return you undefined as a value.
     */
    get member(): Member | User | Promise<Member> | undefined {
        if (this.client.cache.members.get(this.memberID) && this.memberID){
            return this.client.cache.members.get(this.memberID);
        } else if (this.client.cache.users.get(this.memberID) && this.memberID){
            return this.client.cache.users.get(this.memberID);
        } else if (this.memberID && this.guildID){
            return this.client.rest.guilds.getMember(this.guildID, this.memberID);
        } else if (this.client.cache.messages.get(this.id)){
            const message = this.client.cache.messages.get(this.id) as Message;
            if (message.guildID && message.memberID) return this.client.rest.guilds.getMember(message.guildID, message.memberID) as Promise<Member>;
        }
    }

    /** Getter used to get the message's guild
     *
     * Note: this can return a promise, make sure to await it before.
     */
    get guild(): Guild | Promise<Guild> {
        if (!this.guildID) throw new Error("Couldn't get Guild, 'guildID' is not defined. You're probably using a modified version of the Message component.");
        return this.client.cache.guilds.get(this.guildID) ?? this.client.rest.guilds.getGuild(this.guildID);
    }

    /** Getter used to get the message's channel
     *
     * Note: this returns a promise, make sure to await it before.
     */
    get channel(): Promise<Channel> {
        if (!this.channelID) throw new Error("Couldn't get Channel, 'channelID' is not defined. You're probably using a modified version of the Message component.");
        return this.client.rest.channels.getChannel(this.channelID);
    }

    private async setCache(): Promise<void> {
        if (this.guild) this.client.cache.guilds.add(await this.guild);
        if (this.member instanceof Member){
            this.client.cache.members.add(this.member);
        } else if (this.member instanceof User){
            this.client.cache.users.add(this.member);
        }
    }

    /** This method is used to create a message following this message.
     *
     * Note: this method DOES NOT reply to the current message, you have to do it yourself.
     * @param options Message options.
     */
    async createMessage(options: APIMessageOptions): Promise<Message>{
        const response = await this.client.rest.channels.createMessage(this.channelID, options, { originalMessageID: this.#originalMessageID });
        this._lastMessageID = response.id as string;
        if (this.#originalMessageBool === false){
            this.#originalMessageBool = true;
            this.#originalMessageID = response.id as string;
        }
        return response;
    }

    /** This method is used to edit the current message.
     * @param newMessage New message's options
     */
    async edit(newMessage: {content?: string; embeds?: Array<APIEmbedOptions>;}): Promise<Message>{
        return this.client.rest.channels.editMessage(this.channelID, this.id as string, newMessage, { originalMessageID: this.#originalMessageID });
    }

    /** This method is used to delete the current message. */
    async delete(): Promise<void> {
        return this.client.rest.channels.deleteMessage(this.channelID, this.id as string);
    }


    /** Edit the last message sent with the message itself.
     * @param newMessage New message's options.
     */
    async editLastMessage(newMessage: {content?: string; embeds?: Array<APIEmbedOptions>;}): Promise<Message>{
        if (!this._lastMessageID) throw new TypeError("Can't edit last message if it does not exist.");
        return this.client.rest.channels.editMessage(this.channelID, this._lastMessageID, newMessage);
    }

    /** Delete the last message sent with the message itself. */
    async deleteLastMessage(): Promise<void>{
        if (!this._lastMessageID) throw new TypeError("Can't delete last message if it does not exist.");
        return this.client.rest.channels.deleteMessage(this.channelID, this._lastMessageID);
    }

    /** Edit the message's original response message.
     * @param newMessage New message's options.
     */
    async editOriginalMessage(newMessage: { content?: string; embeds?: Array<APIEmbedOptions>; }): Promise<Message>{
        if (!this.#originalMessageID) throw new TypeError("Can't edit original message if it does not exist.");
        return this.client.rest.channels.editMessage(this.channelID, this.#originalMessageID, newMessage, { originalMessageID: this.#originalMessageID });
    }

    /** Delete the message's original response message. */
    async deleteOriginalMessage(): Promise<void>{
        if (!this.#originalMessageID) throw new TypeError("Can't delete original message if it does not exist.");
        return this.client.rest.channels.deleteMessage(this.channelID, this.#originalMessageID);
    }

    /** Add a reaction to this message.
     * @param reaction ID of a reaction/emote.
     */
    async createReaction(reaction: number): Promise<void>{
        return this.client.rest.channels.createReaction(this.channelID, "ChannelMessage", this.id as string, reaction);
    }

    /** Remove a reaction from this message.
     * @param reaction ID of a reaction/emote.
     */
    async deleteReaction(reaction: number): Promise<void>{
        return this.client.rest.channels.deleteReaction(this.channelID, "ChannelMessage", this.id as string, reaction);
    }
}
