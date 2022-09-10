import { Client } from './Client';
import { Channel } from './Channel';
import { User } from './User';
import { Guild } from './Guild';
import * as endpoints from '../rest/endpoints';
import { call } from '../Utils';
const calls = new call();

export class Webhook {
    _client: Client;
    id: string; guildID: string; channelID: string; username: string; _createdAt: number; createdBy: string;
    _deletedAt: number|null; token: string|null;

    constructor(data: any, client:Client){
        this._client = client;
        this.id = data.id;
        this.guildID = data.serverId;
        this.channelID = data.channelId;
        this.username = data.name;
        this._createdAt = Date.parse(data.createdAt);
        this._deletedAt = data.deletedAt ? Date.parse(data.deletedAt):null;
        this.createdBy = data.createdBy;
        this.token = data.token ?? null;
    }

    get createdAt(): Date{
        return new Date(this._createdAt);
    }

    get deletedAt(): Date|null{
        return this._deletedAt ? new Date(this._deletedAt): null;
    }

    /** Update webhook */
    async edit(options: {name: string, channelID?:string}): Promise<Webhook>{
        let response:any = await calls.put(endpoints.GUILD_WEBHOOK(this.guildID, this.id), this._client.token, {name: options.name, channelId: options.channelID});
        return new Webhook(response.data.webhook, this._client); 
    }

    /** Delete webhook */
    async delete(): Promise<void>{
        await calls.delete(endpoints.GUILD_WEBHOOK(this.guildID, this.id), this._client.token);
    }
}