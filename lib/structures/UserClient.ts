import { Client } from "./Client";
import { APIBotUser } from "guildedapi-types.ts/v1";

export class UserClient {
    /** Client. */
    _client: Client;
    /** Client User Standard ID */
    id: string;
    /** Client User Bot ID */
    botID: string;
    /** User type (user, bot) */
    type: string;
    /** User's name */
    username: string;
    /** Timestamp (unix epoch time) of the user's creation. */
    _createdAt: number; // user
    /** ID of the bot's owner. */
    createdBy: string;

    constructor(data: APIBotUser["user"], client: Client){
        // this.userdata = data.user;  // basically member > user
        // this.fulldata = data // basically the whole data
        this._client = client;
        this.id = data.id;
        this.botID = data.botId;
        this.type = "bot";
        this.username = data.name;
        this._createdAt = Date.parse(data.createdAt);
        this.createdBy = data.createdBy;
    }

    /** Boolean that shows if the user is a bot or not. */
    get bot(): boolean {
        return true;
    }

    /** Date-time string of the user's creation. */
    get createdAt(): Date{
        return new Date(this._createdAt);
    }
}
