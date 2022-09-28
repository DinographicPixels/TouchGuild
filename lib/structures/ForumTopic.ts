import { Client } from './Client';
import { Channel } from './Channel';
import { Guild } from './Guild';
import { Member } from './Member';
import * as endpoints from '../rest/endpoints';
import { call } from '../Utils';
import { MentionsType } from '../Types';

const calls = new call()

export class ForumTopic {
    //userdata: any; fulldata: object;
    /** Client */
    _client: Client;
    /** Forum topic id */
    id: number; 
    /** Guild/server id */
    guildID: string; 
    /** Forum channel id */
    channelID: string; 
    /** Topic name/title */
    name: string; 
    /** Topic name/title */
    title: string; 
    /** Timestamp (unix epoch time) of the topic's creation. */
    _createdAt: number; 
    /** ID of the member who created the topic */
    memberID: string;
    /** ID of the webhook that created the topic (if created by webhook) */
    webhookID: string; 
    /** Timestamp (unix epoch time) of when the topic got updated. (if updated) */
    _updatedAt: number|null; 
    /** Timestamp (unix epoch time) that the forum topic was bumped at. */
    bumpedAt: string;
    /** Content of the topic */ 
    content: string; 
    /** Topic mentions */
    mentions: MentionsType;

    constructor(data: any, client:any){
        //this.userdata = data.user;  // basically member > user
        //this.fulldata = data // basically the whole data
        this._client = client;
        this.id = data.id // topic ID
        this.guildID = data.serverId
        this.channelID = data.channelId // forum channel id
        this.name = data.title
        this.title = data.title;
        this._createdAt = Date.parse(data.createdAt)
        this.memberID = data.createdBy
        this.webhookID = data.createdByWebhookId ?? null;
        this._updatedAt = data.updatedAt ? Date.parse(data.updatedAt): null;
        this.bumpedAt = data.bumpedAt ?? null
        this.content = data.content
        this.mentions = data.mentions ?? null
    }

    /** Guild/server the topic is in */
    get guild(): Guild{
        return calls.syncGetGuild(this.guildID, this._client) as Guild;
    }

    /** Member who created the topic */
    get member(): Member{
        return calls.syncGetMember(this.guildID, this.memberID, this._client) as Member;
    }

    /** The forum channel, where the topic is in */
    get channel(): Channel{
        return calls.syncGetChannel(this.channelID, this._client) as Channel;
    }

    /** string representation of the _createdAt timestamp */
    get createdAt(): Date{
        return new Date(this._createdAt);
    }

    /** string representation of the _updatedAt timestamp */
    get updatedAt(): Date|null{
        return this._updatedAt ? new Date(this._updatedAt):null;
    }

    /** Boolean that tells you if the forum topic was created by a webhook or not. */
    get createdByWebhook(): boolean{
        if (this.webhookID){
            return true;
        }else{
            return false;
        }
    }

    /** Edit the forum topic. */
    async edit(options: {title?: string, content?: string}): Promise<ForumTopic>{
        let response:any = await calls.patch(endpoints.FORUM_TOPIC(this.channelID, this.id), this._client.token, options);
        return new ForumTopic(response.data.forumTopic, this);
    }

    /** Delete the forum topic. */
    async delete(): Promise<void>{
        await calls.delete(endpoints.FORUM_TOPIC(this.channelID, this.id), this._client.token);
    }

    /** Pin the forum topic. */
    async pin(): Promise<void>{
        await calls.put(endpoints.FORUM_TOPIC_PIN(this.channelID, this.id), this._client.token, {});
    }

    /** Unpin the forum topic. */
    async unpin(): Promise<void>{
        await calls.delete(endpoints.FORUM_TOPIC_PIN(this.channelID, this.id), this._client.token);
    }

    /** Locks the forum topic. */
    async lock(): Promise<void>{
        await calls.put(endpoints.FORUM_TOPIC_LOCK(this.channelID, this.id), this._client.token, {});
    }

    /** Unlocks the forum topic. */
    async unlock(): Promise<void>{
        await calls.delete(endpoints.FORUM_TOPIC_LOCK(this.channelID, this.id), this._client.token);
    }
}