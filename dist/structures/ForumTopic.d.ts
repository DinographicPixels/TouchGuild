import { Client } from './Client';
import { Channel } from './Channel';
import { Guild } from './Guild';
import { Member } from './Member';
import { MentionsType } from '../Types';
export declare class ForumTopic {
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
    _updatedAt: number | null;
    /** Timestamp (unix epoch time) that the forum topic was bumped at. */
    bumpedAt: string;
    /** Content of the topic */
    content: string;
    /** Topic mentions */
    mentions: MentionsType;
    constructor(data: any, client: any);
    /** Guild/server the topic is in */
    get guild(): Guild;
    /** Member who created the topic */
    get member(): Member;
    /** The forum channel, where the topic is in */
    get channel(): Channel;
    /** string representation of the _createdAt timestamp */
    get createdAt(): Date;
    /** string representation of the _updatedAt timestamp */
    get updatedAt(): Date | null;
    /** Boolean that tells you if the forum topic was created by a webhook or not. */
    get createdByWebhook(): boolean;
    /** Edit the forum topic. */
    edit(options: {
        title?: string;
        content?: string;
    }): Promise<ForumTopic>;
    /** Delete the forum topic. */
    delete(): Promise<void>;
    /** Pin the forum topic. */
    pin(): Promise<void>;
    /** Unpin the forum topic. */
    unpin(): Promise<void>;
    /** Locks a forum topic */
    lock(): Promise<void>;
    /** Unlocks a forum topic */
    unlock(): Promise<void>;
}
