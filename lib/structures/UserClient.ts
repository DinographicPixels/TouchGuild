/** @module UserClient */
import { Client } from "./Client";
import { User } from "./User";
import { APIBotUser } from "../Constants";
import { JSONUserClient } from "../types/json";

/** UserClient represents the logged bot's user. */
export class UserClient extends User {
    /** Client User Bot ID */
    botID: string;
    /** ID of the bot's owner. */
    ownerID: string;

    /** Boolean that shows if the user is a bot or not.
     * @defaultValue true
     */
    override bot: true;
    /**
     * @param data raw data.
     * @param client client.
     */
    constructor(data: APIBotUser, client: Client) {
        super(data, client);
        this.botID = data.botId;
        this.type = "bot";
        this.bot = true;
        this.ownerID = data.createdBy;
        this.update(data);
    }

    override toJSON(): JSONUserClient {
        return {
            ...super.toJSON(),
            botID:     this.botID,
            createdAt: this.createdAt,
            ownerID:   this.ownerID
        };
    }

    protected override update(data: APIBotUser): void {
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
        if (data.avatar !== undefined) {
            this.avatarURL = data.avatar;
        }
        if (data.banner !== undefined) {
            this.bannerURL = data.banner;
        }
        if (data.type !== undefined) {
            this.type = data.type;
        }
    }
}
