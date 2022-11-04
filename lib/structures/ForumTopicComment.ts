import { Client } from "./Client";
import * as endpoints from "../rest/endpoints";
import { call } from "../Utils";
import { APIForumTopicComment, PATCHForumTopicCommentResponse, POSTForumTopicCommentResponse } from "guildedapi-types.ts/v1";

const calls = new call();

export class ForumTopicComment {
    /** Client */
    _client: Client;
    /** The ID of the forum topic comment */
    id: number;
    /** The content of the forum topic comment */
    content: string;
    /** The ISO 8601 timestamp that the forum topic comment was created at */
    createdAt: string;
    /** The ISO 8601 timestamp that the forum topic comment was updated at, if relevant */
    updatedAt?: string;
    /** The ID of the forum topic */
    topicID: number;
    /** The ID of the user who created this forum topic comment (Note: If this event has createdByWebhookId present, this field will still be populated, but can be ignored. In this case, the value of this field will always be Ann6LewA) */
    createdBy: string;
    /** ID of the forum topic's server, if provided. */
    guildID: string | null;
    /** ID of the forum channel, if provided. */
    channelID: string | null;

    constructor(data: APIForumTopicComment, client: Client, options?: { guildID?: string | null; channelID?: string | null; }){
        this._client = client;
        this.id = data.id;
        this.content = data.content;
        this.createdAt = data.createdAt;
        this.updatedAt = data.updatedAt;
        this.topicID = data.forumTopicId;
        this.createdBy = data.createdBy;
        this.guildID = options?.guildID ?? null;
        this.channelID = options?.channelID ?? null;
    }

    /** Add a comment to the same forum topic as this comment. */
    async createTopicComment(channelID: string, options: { content: string; }): Promise<ForumTopicComment>{
        if (typeof channelID !== "string") throw new TypeError("The channelID property is needed as a string.");
        const response = await calls.post(endpoints.FORUM_TOPIC_COMMENTS(channelID, this.topicID), this._client.token, { content: options.content });
        return new ForumTopicComment((response["data" as keyof object] as POSTForumTopicCommentResponse).forumTopicComment, this._client, { guildID: this.guildID, channelID });
    }

    /** Edit this forum topic's comment. */
    async edit(channelID: string, options?: { content?: string; }): Promise<ForumTopicComment>{
        if (typeof channelID !== "string") throw new TypeError("The channelID property is needed as a string.");
        const response = await calls.patch(endpoints.FORUM_TOPIC_COMMENT(channelID, this.topicID, this.id), this._client.token, { content: options?.content });
        return new ForumTopicComment((response["data" as keyof object] as PATCHForumTopicCommentResponse).forumTopicComment, this._client, { guildID: this.guildID, channelID });
    }

    /** Delete this forum topic comment. */
    async delete(channelID: string): Promise<void>{
        if (typeof channelID !== "string") throw new TypeError("The channelID property is needed as a string.");
        await calls.delete(endpoints.FORUM_TOPIC_COMMENT(channelID, this.topicID, this.id), this._client.token);
    }
}
