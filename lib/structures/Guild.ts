import { Client } from './Client';
import fetch from 'node-fetch-commonjs'
import { Message } from './Message';

export class Guild {
client: Client;
id: string; ownerId: string; type: string; name: string; url: string; about: string; description: string; icon: string; banner: string; timezone: string; defaultChannelId: string; createdAt: string;

    constructor(data: { server: {id: string,ownerId: string,type: string,name: string,url: string, about: string, avatar: string, banner: string, timezone: string, defaultChannelId: string, createdAt: string}}, client:any){
        console.log(data)
        this.client = client;
        this.id = data.server.id
        this.ownerId = data.server.ownerId
        this.type = data.server.type
        this.name = data.server.name
        this.url = data.server.url
        this.about = data.server.about // same but with
        this.description = data.server.about //   two types.
        this.icon = data.server.avatar
        this.banner = data.server.banner
        this.timezone = data.server.timezone
        this.defaultChannelId = data.server.defaultChannelId
        this.createdAt = data.server.createdAt
    }
}
