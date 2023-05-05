/** @module TextChannel */
import { Client } from "./Client";

import { Message } from "./Message";
import { GuildChannel } from "./GuildChannel";
import { AnyTextableChannel, EditMessageOptions } from "../types/channel";
import type { APIChatMessage, APIGuildChannel, APIMessageOptions } from "../Constants";
import TypedCollection from "../util/TypedCollection";
import { JSONTextChannel } from "../types/json";

/** Represents a guild channel. */
export class TextChannel extends GuildChannel {
    /** Cached messages. */
    messages: TypedCollection<string, APIChatMessage, Message<AnyTextableChannel>>;
    /**
     * @param data raw data
     * @param client client
     */
    constructor(data: APIGuildChannel, client: Client){
        super(data, client);
        this.messages = new TypedCollection(Message, client, client.params.collectionLimits?.messages);
        this.update(data);
    }

    /** Create a message in this channel.
     * @param options Message options.
     */
    async createMessage(options: APIMessageOptions): Promise<Message<TextChannel>>{
        return this.client.rest.channels.createMessage<TextChannel>(this.id, options);
    }

    /** Edit a message from this channel.
     * @param options Message options.
     */
    async editMessage(messageID: string, options: EditMessageOptions): Promise<Message<TextChannel>>{
        return this.client.rest.channels.editMessage<TextChannel>(this.id, messageID, options);
    }

    /** Delete a message from this channel.
     * @param options Message options.
     */
    async deleteMessage(messageID: string): Promise<void> {
        return this.client.rest.channels.deleteMessage(this.id, messageID);
    }

    override toJSON(): JSONTextChannel {
        return {
            ...super.toJSON(),
            messages: this.messages.map(message => message.toJSON())
        };
    }
}
