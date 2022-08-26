import { Client } from './Client';
import fetch from 'node-fetch-commonjs'
import { Channel } from './Channel';

export class User {
    //userdata: any; fulldata: object;
    client: Client;
    id: string; type: string|any; username: string; avatar: string|any; banner: string|any; createdAt: string // user
    bot: boolean;

    constructor(data: any, client:any){
        //this.userdata = data.user;  // basically member > user
        //this.fulldata = data // basically the whole data
        this.client = client;
        this.id = data.user.id
        this.type = data.user.type
        this.username = data.user.name
        this.createdAt = data.user.createdAt
        this.avatar = data.user.avatar
        this.banner = data.user.banner

        if (!this.type) this.type = 'user' // since it's only defined when it's a bot..
        if (this.type == 'bot'){this.bot = true }else{this.bot = false}
    }
}