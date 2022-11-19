/** @module ReactionInfo */
import { Member } from "./Member";
import { Client } from "./Client";
import {
    APIEmote,
    GatewayEvent_ChannelMessageReactionAdded,
    GatewayEvent_ChannelMessageReactionDeleted,
    GatewayEvent_ForumTopicReactionCreated,
    GatewayEvent_ForumTopicReactionDeleted
} from "../Constants";

/** Default information every other reaction has. */
export class ReactionInfo {
    client!: Client;
    data: GatewayEvent_ChannelMessageReactionAdded | GatewayEvent_ChannelMessageReactionDeleted | GatewayEvent_ForumTopicReactionCreated | GatewayEvent_ForumTopicReactionDeleted;
    /** Emote. */
    emoji: APIEmote;
    /**
     * @param data raw data.
     * @param client client.
     */
    constructor(data: GatewayEvent_ChannelMessageReactionAdded | GatewayEvent_ChannelMessageReactionDeleted | GatewayEvent_ForumTopicReactionCreated | GatewayEvent_ForumTopicReactionDeleted, client: Client){
        this.data = data;
        this.emoji = {
            id:   data.reaction.emote.id,
            name: data.reaction.emote.name,
            url:  data.reaction.emote.url
        };
        Object.defineProperty(this, "client", {
            value:        client,
            enumerable:   false,
            writable:     false,
            configurable: false
        });
    }

    /** Cached member. If member isn't cached will return an object with the member's id. */
    get reactor(): Member | { id: string; } {
        return this.client.cache.members.get(this.data.reaction.createdBy) ?? {
            id: this.data.reaction.createdBy
        };
    }
}
