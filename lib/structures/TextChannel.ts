/** @module TextChannel */
import { Client } from "./Client";

import { Message } from "./Message";
import { GuildChannel } from "./GuildChannel";
import { AnyTextableChannel } from "../types/channel";
import type { APIChatMessage, APIGuildChannel } from "../Constants";
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

    override toJSON(): JSONTextChannel {
        return {
            ...super.toJSON(),
            messages: this.messages
        };
    }
}
