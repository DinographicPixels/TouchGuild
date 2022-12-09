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
    raw: GatewayEvent_ChannelMessageReactionAdded | GatewayEvent_ChannelMessageReactionDeleted | GatewayEvent_ForumTopicReactionCreated | GatewayEvent_ForumTopicReactionDeleted;
    /** Channel where the reaction was added/removed. */
    channelID: string;
    /** ID of the user who added the reaction. */
    reactorID: string;
    /** Emote. */
    emoji: APIEmote;
    /**
     * @param data raw data.
     * @param client client.
     */
    constructor(data: GatewayEvent_ChannelMessageReactionAdded | GatewayEvent_ChannelMessageReactionDeleted | GatewayEvent_ForumTopicReactionCreated | GatewayEvent_ForumTopicReactionDeleted, client: Client){
        this.raw = data;
        this.channelID = data.reaction.channelId;
        this.reactorID = data.reaction.createdBy;
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
        return this.client.getGuild(this.raw.serverId as string)?.members.get(this.raw.reaction.createdBy) ?? {
            id: this.raw.reaction.createdBy
        };
    }
}
