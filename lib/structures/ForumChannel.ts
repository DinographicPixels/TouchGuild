/** @module ForumChannel */
import { Client } from "./Client";

import { ForumThread } from "./ForumThread";
import { GuildChannel } from "./GuildChannel";
import type { APIForumTopic, APIGuildChannel } from "../Constants";
import TypedCollection from "../util/TypedCollection";
import { JSONForumChannel } from "../types/json";

/** Represents a forum channel. */
export class ForumChannel extends GuildChannel {
    /** Cached threads. */
    threads: TypedCollection<number, APIForumTopic, ForumThread<ForumChannel>>;
    /**
     * @param data raw data
     * @param client client
     */
    constructor(data: APIGuildChannel, client: Client){
        super(data, client);
        this.threads = new TypedCollection(ForumThread, client, client.params.collectionLimits?.threads);
        this.update(data);
    }

    override toJSON(): JSONForumChannel {
        return {
            ...super.toJSON(),
            threads: this.threads.map(thread => thread.toJSON())
        };
    }
}
