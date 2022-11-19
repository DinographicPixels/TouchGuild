/** @module ForumThread */
import { Client } from "./Client";
import { Channel } from "./Channel";
import { Guild } from "./Guild";
import { Member } from "./Member";
import { Base } from "./Base";
import { User } from "./User";
import { APIForumTopic, APIMentions } from "../Constants";
import { EditForumThreadOptions } from "../types/forumThread";

/** Represents a thread/topic coming from a "Forums" channel. */
export class ForumThread extends Base {
    /** Guild/server id */
    guildID: string;
    /** Forum channel id */
    channelID: string;
    /** Thread name/title */
    name: string;
    /** Thread name/title */
    title: string;
    /** Timestamp (unix epoch time) of the thread's creation. */
    _createdAt: number;
    /** ID of the member who created the thread */
    memberID: string;
    /** ID of the webhook that created the thread (if created by webhook) */
    webhookID: string | null;
    /** Timestamp (unix epoch time) of when the thread got updated. (if updated) */
    _updatedAt: number| null;
    /** Timestamp (unix epoch time) that the forum thread was bumped at. */
    bumpedAt: string | null;
    /** Content of the thread */
    content: string;
    /** Thread mentions */
    mentions: APIMentions | null;

    /**
     * @param data raw data
     * @param client client
     */
    constructor(data: APIForumTopic, client: Client){
        super(data.id, client);
        this.guildID = data.serverId;
        this.channelID = data.channelId;
        this.name = data.title;
        this.title = data.title;
        this._createdAt = Date.parse(data.createdAt);
        this.memberID = data.createdBy;
        this.webhookID = data.createdByWebhookId ?? null;
        this._updatedAt = data.updatedAt ? Date.parse(data.updatedAt) : null;
        this.bumpedAt = data.bumpedAt ?? null;
        this.content = data.content;
        this.mentions = data.mentions ?? null;
    }

    /** Guild where this thread's owner comes from, returns Guild or a promise.
     * If guild isn't cached & the request failed, this will return you undefined.
     */
    get guild(): Guild | Promise<Guild> {
        return this.client.cache.guilds.get(this.guildID) ?? this.client.rest.guilds.getGuild(this.guildID);
    }

    /** Retrieve message's member, if cached.
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

    /** The forum channel, where the thread is in.
     * This will send a request to Guilded, a promise will be returned.
     */
    get channel(): Promise<Channel> {
        return this.client.rest.channels.getChannel(this.channelID);
    }

    /** string representation of the _createdAt timestamp. */
    get createdAt(): Date {
        return new Date(this._createdAt);
    }

    /** string representation of the _updatedAt timestamp. */
    get updatedAt(): Date|null {
        return this._updatedAt ? new Date(this._updatedAt) : null;
    }

    /** Boolean that tells you if the forum thread was created by a webhook or not. */
    get createdByWebhook(): boolean {
        return this.webhookID ? true : false;
    }

    /** Edit the forum thread.
     * @param options Edit options.
     */
    async edit(options: EditForumThreadOptions): Promise<ForumThread> {
        return this.client.rest.channels.editForumThread(this.channelID, this.id as number, options);
    }

    /** Delete this forum thread. */
    async delete(): Promise<void> {
        return this.client.rest.channels.deleteForumThread(this.channelID, this.id as number);
    }

    /** Pin this forum thread. */
    async pin(): Promise<void> {
        return this.client.rest.channels.pinForumThread(this.channelID, this.id as number);
    }

    /** Unpin this forum thread. */
    async unpin(): Promise<void> {
        return this.client.rest.channels.unpinForumThread(this.channelID, this.id as number);
    }

    /** Lock this forum thread. */
    async lock(): Promise<void> {
        return this.client.rest.channels.lockForumThread(this.channelID, this.id as number);
    }

    /** Unlock this forum thread. */
    async unlock(): Promise<void> {
        return this.client.rest.channels.unlockForumThread(this.channelID, this.id as number);
    }

    /** Add a reaction to this forum thread.
     * @param emoteID ID of the emote to be added.
     */
    async createReaction(emoteID: number): Promise<void> {
        return this.client.rest.channels.createReaction(this.channelID, "ForumThread", this.id as number, emoteID);
    }

    /** Remove a reaction from this forum thread.
     * @param emoteID ID of the emote to be added.
     */
    async deleteReaction(emoteID: number): Promise<void> {
        return this.client.rest.channels.deleteReaction(this.channelID, "ForumThread", this.id as number, emoteID);
    }
}
