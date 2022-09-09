import { Client } from './Client';
import fetch from 'node-fetch-commonjs'
import { Message, MessageOptions } from './Message';

import * as endpoints from '../rest/endpoints';

import { call } from '../Utils';

/** Guild Channel component, with all its methods and declarations */
export class Channel {
    /** Raw data */
    data: any; 
    /** Client */
    client: Client;
    /** Channel ID */
    id: string; 
    /** Channel type */
    type: string; 
    /** Channel name */
    name: string; 
    /** Channel topic/description */
    topic: string|any; 
    /** Timestamp (unix epoch time) of the channel's creation. */
    _createdAt: number;
    /** ID of the channel's creator. */
    memberID: string; 
    /** Timestamp (unix epoch time) of the channel's edition. (if edited) */
    _updatedAt: number|null; 
    /** Server ID */
    guildID: string; 
    /** ID of the parent category. */
    parentID: string|any;
    /** ID of the category the channel is in. */
    categoryID: number|any; 
    /** ID of the group the channel is in. */
    groupID: string; 
    /**  */
    isPublic: boolean|any; 
    /** ID of the member that archived the channel (if archived) */
    archivedBy: string|any;
    /** Timestamp (unix epoch time) of when the channel has been archived. */
    _archivedAt: number|null;

    constructor(data: any, client:Client){
        this.data = data;
        this.client = client;

        this.id = data.id
        this.type = data.type
        this.name = data.name
        this.topic = data.topic ?? null;
        this._createdAt = Date.parse(data.createdAt);
        this.memberID = data.createdBy
        this._updatedAt = data.updatedAt ? Date.parse(data.updatedAt): null;
        this.guildID = data.serverId
        this.parentID = data.parentId ?? null;
        this.categoryID = data.categoryId ?? null;
        this.groupID = data.groupId
        this.isPublic = data.isPublic ?? false;
        this.archivedBy = data.archivedBy ?? null;
        this._archivedAt = data.archivedAt ? Date.parse(data.archivedAt): null;
    }

    get createdAt(): Date{
        return new Date(this._createdAt);
    }

    get updatedAt(): Date|null{
        if (this._updatedAt !== null){
            return new Date(this._updatedAt);
        }else return null;
    }

    get archivedAt(): Date|null{
        if (this._archivedAt !== null){
            return new Date(this._archivedAt);
        }else return null;
    }

    /** Create a message in the channel. */
    async createMessage(options: MessageOptions): Promise<Message>{
        if (typeof options !== 'object') throw new TypeError('message options should be an object.');
        let bodyContent = JSON.stringify(options)
        // let fetching = await fetch(`https://www.guilded.gg/api/v${this.client.ws.apiversion}/channels/${this.id}/messages`, {
        //     method: 'POST',
        //     headers: {
        //       Authorization: `Bearer ${this.client.token}`,
        //       Accept: "application/json",
        //       "Content-type": "application/json",
        //     },
        //     body: bodyContent,
        //     protocol: "HTTPS"
        // });

        let response:any = await new call().post(endpoints.CHANNEL_MESSAGES(this.id), this.client.token, bodyContent);
        return new Message(response.data?.message, this.client);
    }

    /** Delete the channel. */
    async delete(): Promise<void>{
        // let fetching = await fetch(`https://www.guilded.gg/api/v${this.client.ws.apiversion}/channels/${this.id}`, {
        //     method: 'DELETE',
        //     headers: {
        //       Authorization: `Bearer ${this.client.token}`,
        //       Accept: "application/json",
        //       "Content-type": "application/json",
        //     },
        //     protocol: "HTTPS"
        // });

        await new call().delete(endpoints.CHANNEL(this.id), this.client.token);
    }

    /** Edit the channel. */
    async edit(options:editTypes): Promise<Channel>{
        // let fetching = await fetch(`https://www.guilded.gg/api/v${this.client.ws.apiversion}/channels/${this.id}`, {
        //     method: 'PATCH',
        //     headers: {
        //       Authorization: `Bearer ${this.client.token}`,
        //       Accept: "application/json",
        //       "Content-type": "application/json",
        //     },
        //     body: JSON.stringify(options),
        //     protocol: "HTTPS"
        // });

        let response:any = await new call().patch(endpoints.CHANNEL(this.id), this.client.token, JSON.stringify(options));
        return new Channel(response?.data.channel, this.client);
    }
}

/* Channel edit types */
interface editTypes {
    name?: string,
    topic?: string,
    isPublic?: boolean
}

/** CHannel create types */
export type ChannelCreateTypes = {
    guildID: string,
    groupID: string,
    categoryID: string,
    name: string,
    type: {
        announcement: string,
        chat: string,
        calendar: string,
        forums: string,
        media: string,
        docs: string,
        voice: string,
        list: string,
        scheduling: string,
        stream: string
    },
    options: {
        topic: string,
        isPublic: boolean
    }
}

export type ChannelTypes = 'announcement'|'chat'|'calendar'|'forums'|'media'|'docs'|'voice'|'list'|'scheduling'|'stream'
