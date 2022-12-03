/** @module UserClient */
import { Client } from "./Client";
import { Base } from "./Base";
import { APIBotUser } from "../Constants";
import { JSONUserClient } from "../types/json";

/** UserClient represents the logged bot's user. */
export class UserClient extends Base<string> {
    /** Client User Bot ID */
    botID: string;
    /** User type (user, bot) */
    type: string;
    /** User's name */
    username: string;
    /** When the bot client was created. */
    createdAt: Date;
    /** ID of the bot's owner. */
    ownerID: string;
    /**
     * @param data raw data.
     * @param client client.
     */
    constructor(data: APIBotUser["user"], client: Client){
        super(data.id, client);
        this.botID = data.botId;
        this.type = "bot";
        this.username = data.name;
        this.createdAt = new Date(data.createdAt);
        this.ownerID = data.createdBy;
        this.update(data);
    }

    override toJSON(): JSONUserClient {
        return {
            ...super.toJSON(),
            botID:     this.botID,
            type:      this.type,
            username:  this.username,
            createdAt: this.createdAt,
            ownerID:   this.ownerID
        };
    }

    protected override update(data: APIBotUser["user"]): void {
        if (data.botId !== undefined) {
            this.botID = data.botId;
        }
        if (data.createdAt !== undefined) {
            this.createdAt = new Date(data.createdAt);
        }
        if (data.createdBy !== undefined) {
            this.ownerID = data.createdBy;
        }
        if (data.id !== undefined) {
            this.id = data.id;
        }
        if (data.name !== undefined) {
            this.username = data.name;
        }
    }

    /** Boolean that shows if the user is a bot or not.
     * @defaultValue true
     */
    get bot(): true {
        return true;
    }
}
