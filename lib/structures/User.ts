import { Client } from "./Client";
import { APIUser } from "guildedapi-types.ts/v1";

export class User {
    // userdata: any; fulldata: object;
    _client: Client;
    id: string; type: string | null; username: string; avatarURL: string | null; bannerURL: string | null; _createdAt: number; // user
    bot: boolean;

    constructor(data: APIUser, client: Client){
        // this.userdata = data.user;  // basically member > user
        // this.fulldata = data // basically the whole data
        this._client = client;
        this.id = data.id;
        this.type = data.type ?? null;
        this.username = data.name;
        this._createdAt = Date.parse(data.createdAt);
        this.avatarURL = data.avatar ?? null;
        this.bannerURL = data.banner ?? null;

        if (!this.type) this.type = "user"; // since it's only defined when it's a bot.
        this.bot = this.type === "bot" ? true : false;
    }

    get createdAt(): Date{
        return new Date(this._createdAt);
    }
}
