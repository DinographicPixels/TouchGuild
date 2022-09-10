import { Client } from './Client';
import { Message, MessageOptions } from './Message';
import * as endpoints from '../rest/endpoints';

import { call } from '../Utils';
import { Member } from './Member';
const calls = new call();

export class Doc {
    /** Raw data */
    data: any; 
    /** Client */
    client: Client;
    /** ID of the doc */
    id: number; 
    /** Guild/server id */
    guildID: string; 
    /** ID of the 'docs' channel. */
    channelID: string;
    /** Doc title/name */ 
    title: string; 
    /** Doc title/name */
    name: string;
    /** Content of the doc */
    content: string; 
    /** Doc mentions  */
    mentions: {
        users?: object[], // id in
        channels?: object[], // id in
        roles?: object[],
        everyone?: boolean,
        here?: boolean
    }
    /** Timestamp (unix epoch time) of the doc's creation. */
    _createdAt: number|null; 
    /** ID of the member who created the doc. */
    memberID: string; 
    /** Timestamp (unix epoch time) of when the doc was updated. (if updated) */
    _updatedAt: number|null; 
    /** ID of the member who updated the doc. (if updated) */
    updatedBy: string;

    constructor(data: any, client:any){
        this.data = data.channel;
        this.client = client;

        this.id = data.id;
        this.guildID = data.serverId;
        this.channelID = data.channelId;
        this.name = data.title ?? null;
        this.title = data.title ?? null; // same as name, different type.
        this.content = data.content ?? null;
        this.mentions = data.mentions ?? {};
        this._createdAt = data.createdAt ? Date.parse(data.createdAt): null;
        this.memberID = data.createdBy;
        this._updatedAt = data.updatedAt ? Date.parse(data.updatedAt): null;
        this.updatedBy = data.updatedBy ?? null;
    }

    get member(): Member{
        if (this.updatedBy){
            return calls.syncGetMember(this.guildID, this.updatedBy, this.client) as Member;
        }else{
            return calls.syncGetMember(this.guildID, this.memberID, this.client) as Member;
        }
    }

    get createdAt(): Date|null{
        return this._createdAt ? new Date(this._createdAt): null;
    }

    get updatedAt(): Date|null{
        return this._updatedAt ? new Date(this._updatedAt): null;
    }

    async edit(options: {title?: string, content?: string}): Promise<Doc>{
        let response:any = await calls.put(endpoints.CHANNEL_DOC(this.channelID, this.id), this.client.token, options);
        return new Doc(response.data.doc, this.client);
    }

    async delete(): Promise<void>{
        await calls.delete(endpoints.CHANNEL_DOC(this.channelID, this.id), this.client.token);
    }
}