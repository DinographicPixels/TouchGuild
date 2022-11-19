/** @module ForumThreadReactionInfo */
import { ReactionInfo } from "./ReactionInfo";
import { Client } from "./Client";
import { forumThreadReactionInfo } from "../types/types";
import { GatewayEvent_ForumTopicReactionCreated, GatewayEvent_ForumTopicReactionDeleted } from "../Constants";

/** Information about a ForumThread's reaction. */
export class ForumThreadReactionInfo extends ReactionInfo {
    private threadID: number;
    /**
     * @param data raw data.
     * @param client client.
     */
    constructor(data: GatewayEvent_ForumTopicReactionCreated | GatewayEvent_ForumTopicReactionDeleted, client: Client){
        super(data, client);
        this.threadID = data.reaction.forumTopicId;
    }

    /** The forum thread where the reaction has been added.
     * If the thread is cached, it'll return a ForumThread component,
     * otherwise it'll return basic information about this thread.
     */
    get thread(): forumThreadReactionInfo["thread"] {
        return this.client.cache.forumThreads.get(this.threadID) ?? {
            id:    this.threadID,
            guild: this.client.cache.guilds.get(this.data.serverId as string) ?? {
                id: this.data.serverId
            },
            channelID: this.data.reaction.channelId
        };
    }
}
