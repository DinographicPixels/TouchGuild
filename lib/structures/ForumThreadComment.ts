/** @module ForumThreadComment */
import { Client } from "./Client";
import { Base } from "./Base";
import { Member } from "./Member";
import { User } from "./User";
import { APIForumTopicComment, APIMentions } from "../Constants";
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
    /** The ID of the user who sent this comment. */
    memberID: string;
    /** ID of the forum thread's server, if provided. */
    guildID: string | null;
    /** ID of the forum channel containing this thread. */
    channelID: string;
    /** Mentions in this thread comment. */
    mentions: APIMentions | null;

    constructor(data: APIForumTopicComment, client: Client, options?: ConstructorForumThreadOptions){
        super(data.id, client);
        this.content = data.content;
        this.createdAt = data.createdAt;
        this.updatedAt = data.updatedAt;
        this.channelID = data.channelId;
        this.threadID = data.forumTopicId;
        this.memberID = data.createdBy;
        this.guildID = options?.guildID ?? null;
        this.mentions = data.mentions ?? null;
    }

    /** Retrieve the member who sent this comment, if cached.
     * If there is no cached member or user, this will make a request which returns a Promise.
     * If the request fails, this will throw an error or return you undefined as a value.
     */
    get member(): Member | User | Promise<Member> | undefined {
        if (this.client.cache.members.get(this.memberID) && this.memberID){
            return this.client.cache.members.get(this.memberID);
        } else if (this.client.cache.users.get(this.memberID) && this.memberID){
            return this.client.cache.users.get(this.memberID);
        } else if (this.memberID && this.guildID){
            return this.client.rest.guilds.getMember(this.guildID, this.memberID);
        }
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
