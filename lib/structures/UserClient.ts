/** @module UserClient */
import { Client } from "./Client";
import { Base } from "./Base";
import { APIBotUser } from "../Constants";

/** UserClient represents the logged bot's user. */
export class UserClient extends Base {
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
    /**
     * @param data raw data.
     * @param client client.
     */
    constructor(data: APIBotUser["user"], client: Client){
        super(data.id, client);
        this.botID = data.botId;
        this.type = "bot";
        this.username = data.name;
        this._createdAt = Date.parse(data.createdAt);
        this.createdBy = data.createdBy;
    }

    /** Boolean that shows if the user is a bot or not.
     * @defaultValue true
     */
    get bot(): true {
        return true;
    }

    /** Date-time string of the bot's creation. */
    get createdAt(): Date{
        return new Date(this._createdAt);
    }
}
