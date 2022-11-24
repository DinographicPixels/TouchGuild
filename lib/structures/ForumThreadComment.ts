/** @module ForumThreadComment */
import { Client } from "./Client";
import { Base } from "./Base";
import { Member } from "./Member";
import { APIForumTopicComment, APIMentions } from "../Constants";
import { CreateForumCommentOptions, EditForumCommentOptions, ConstructorForumThreadOptions } from "../types/forumThreadComment";
import { Uncached } from "../types/types";

/** Represents a comment coming from a ForumThread. */
export class ForumThreadComment extends Base {
    /** Data */
    #data: APIForumTopicComment;
    /** The content of the forum thread comment */
    content: string;
    /** The ISO 8601 timestamp that the forum thread comment was created at */
    createdAt: string;
    /** The ISO 8601 timestamp that the forum thread comment was updated at, if relevant */
    updatedAt?: string;
    /** The ID of the forum thread */
    threadID: number;
    /** ID of the forum thread's server, if provided. */
    guildID: string | null;
    /** ID of the forum channel containing this thread. */
    channelID: string;
    /** Mentions in this thread comment. */
    mentions: APIMentions | null;

    constructor(data: APIForumTopicComment, client: Client, options?: ConstructorForumThreadOptions){
        super(data.id, client);
        this.#data = data;
        this.content = data.content;
        this.createdAt = data.createdAt;
        this.updatedAt = data.updatedAt;
        this.channelID = data.channelId;
        this.threadID = data.forumTopicId;
        this.guildID = options?.guildID ?? null;
        this.mentions = data.mentions ?? null;
    }

    /** Retrieve the member who sent this comment, if cached. */
    get member(): Member | Uncached {
        return this.client.cache.members.get(this.#data.createdBy) ?? { id: this.#data.createdBy };
    }

    /** Add a comment to the same forum thread as this comment.
     * @param options New comment's options.
     */
    async createForumComment(options: CreateForumCommentOptions): Promise<ForumThreadComment> {
        return this.client.rest.channels.createForumComment(this.channelID, this.threadID, options);
    }

    /** Edit this forum thread's comment.
     * @param options Edit options.
     */
    async edit(options?: EditForumCommentOptions): Promise<ForumThreadComment>{
        return this.client.rest.channels.editForumComment(this.channelID, this.threadID, this.id as number, { content: options?.content });
    }

    /** Delete this forum thread comment. */
    async delete(): Promise<void>{
        return this.client.rest.channels.deleteForumComment(this.channelID, this.threadID, this.id as number);
    }
}
