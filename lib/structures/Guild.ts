import { Client } from './Client';
import { Message } from './Message';

export class Guild {
    /** Client */
    client: Client;
    /** Guild/server id */
    id: string;
    /** ID of the sever owner */
    ownerID: string; 
    /** Guild type */
    type: string; 
    /** Guild name */
    name: string; 
    /** Guild url */
    url: string; 
    /** Guild's about/description */
    about: string; 
    /** Guild's about/description */
    description: string; 
    /** Guild icon */
    iconURL: string; 
    bannerURL: string; 
    timezone: string; 
    defaultChannelID: string; 
    _createdAt: number;

    constructor(data: {id: string, ownerId: string,type: string,name: string,url: string, about: string, avatar: string, banner: string, timezone: string, defaultChannelId: string, createdAt: string}, client:Client){
        this.client = client;
        this.id = data.id
        this.ownerID = data.ownerId
        this.type = data.type
        this.name = data.name
        this.url = data.url
        this.about = data.about // same but with
        this.description = data.about //   two types.
        this.iconURL = data.avatar
        this.bannerURL = data.banner
        this.timezone = data.timezone
        this.defaultChannelID = data.defaultChannelId
        this._createdAt = Date.parse(data.createdAt)
    }

    get createdAt(): Date{
        return new Date(this._createdAt);
    }
}
