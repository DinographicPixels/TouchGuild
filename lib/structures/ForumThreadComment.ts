/** @module ForumThreadComment */
import { Client } from "./Client";
import { Base } from "./Base";
import { APIForumTopicComment } from "../Constants";
import { CreateForumCommentOptions, EditForumCommentOptions, ConstructorForumThreadOptions } from "../types/forumThreadComment";

/** Represents a comment coming from a ForumThread. */
export class ForumThreadComment extends Base {
    /** The content of the forum thread comment */
    content: string;
    /** The ISO 8601 timestamp that the forum thread comment was created at */
    createdAt: string;
    /** The ISO 8601 timestamp that the forum thread comment was updated at, if relevant */
    updatedAt?: string;
    /** The ID of the forum thread */
    threadID: number;
    /** The ID of the user who created this forum thread comment (Note: If this event has createdByWebhookId present, this field will still be populated, but can be ignored. In this case, the value of this field will always be Ann6LewA) */
    createdBy: string;
    /** ID of the forum thread's server, if provided. */
    guildID: string | null;
    /** ID of the forum channel, if provided. */
    channelID: string | null;

    constructor(data: APIForumTopicComment, client: Client, options?: ConstructorForumThreadOptions){
        super(data.id, client);
        this.content = data.content;
        this.createdAt = data.createdAt;
        this.updatedAt = data.updatedAt;
        this.threadID = data.forumTopicId;
        this.createdBy = data.createdBy;
        this.guildID = options?.guildID ?? null;
        this.channelID = options?.channelID ?? null;
    }

    /** Add a comment to the same forum thread as this comment.
     * @param channelID ID of a "Forums" channel.
     * @param options New comment's options.
     */
    async createForumComment(channelID: string, options: CreateForumCommentOptions): Promise<ForumThreadComment> {
        if (typeof channelID !== "string") throw new TypeError("The channelID property is needed as a string.");
        return this.client.rest.channels.createForumComment(channelID, this.threadID, options);
    }

    /** Edit this forum thread's comment.
     * @param channelID ID of a "Forums" channel.
     * @param options Edit options.
     */
    async edit(channelID: string, options?: EditForumCommentOptions): Promise<ForumThreadComment>{
        if (typeof channelID !== "string") throw new TypeError("The channelID property is needed as a string.");
        return this.client.rest.channels.editForumComment(channelID, this.threadID, this.id as number, { content: options?.content });
    }

    /** Delete this forum thread comment.
     * @param channelID ID of a "Forums" channel.
     */
    async delete(channelID: string): Promise<void>{
        if (typeof channelID !== "string") throw new TypeError("The channelID property is needed as a string.");
        return this.client.rest.channels.deleteForumComment(channelID, this.threadID, this.id as number);
    }
}
