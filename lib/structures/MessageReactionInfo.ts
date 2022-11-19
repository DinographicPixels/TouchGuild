/** @module MessageReactionInfo */
import { ReactionInfo } from "./ReactionInfo";
import { Client } from "../structures/Client";
import { messageReactionInfo } from "../types/types";
import { GatewayEvent_ChannelMessageReactionAdded, GatewayEvent_ChannelMessageReactionDeleted } from "../Constants";

/** Information about a Message's reaction. */
export class MessageReactionInfo extends ReactionInfo {
    #messageID: string;
    /**
     * @param data raw data.
     * @param client client.
     */
    constructor(data: GatewayEvent_ChannelMessageReactionAdded | GatewayEvent_ChannelMessageReactionDeleted, client: Client){
        super(data, client);
        this.#messageID = data.reaction.messageId;
    }

    /** The message where the reaction has been added.
     * If the message is cached, it'll return a Message component,
     * otherwise it'll return basic information about this message.
     */
    get message(): messageReactionInfo["message"] {
        return this.client.cache.messages.get(this.#messageID) ?? {
            id:    this.#messageID,
            guild: this.client.cache.guilds.get(this.data.serverId as string) ?? {
                id: this.data.serverId
            },
            channelID: this.data.reaction.channelId
        };
    }
}
