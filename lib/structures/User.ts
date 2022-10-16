import { Client } from './Client';

export class User {
    //userdata: any; fulldata: object;
    _client: Client;
    id: string; type: string|any; username: string; avatarURL: string|any; bannerURL: string|any; _createdAt: number // user
    bot: boolean;

    constructor(data: any, client:any){
        //this.userdata = data.user;  // basically member > user
        //this.fulldata = data // basically the whole data
        this._client = client;
        this.id = data.id
        this.type = data.type
        this.username = data.name
        this._createdAt = Date.parse(data.createdAt)
        this.avatarURL = data.avatar ?? null
        this.bannerURL = data.banner ?? null

        if (!this.type) this.type = 'user' // since it's only defined when it's a bot..
        if (this.type == 'bot'){this.bot = true }else{this.bot = false}
    }

    get createdAt(): Date{
        return new Date(this._createdAt);
    }
}