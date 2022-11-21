/** @module User */
import { Client } from "./Client";
import { Base } from "./Base";
import { UserTypes, APIUser } from "../Constants";

/** Represents a user. */
export class User extends Base {
    /** User type */
    type: UserTypes | null;
    /** User's username. */
    username: string;
    /** Current avatar url of the user. */
    avatarURL: string | null;
    /** Current banned url of the user. */
    bannerURL: string | null;
    /** When the user account was created. */
    createdAt: Date; // user
    /** If true, the user is a bot. */
    bot: boolean;

    /**
     * @param data raw data.
     * @param client client.
     */
    constructor(data: APIUser, client: Client){
        super(data.id, client);
        this.type = data.type ?? null;
        this.username = data.name;
        this.createdAt = new Date(data.createdAt);
        this.avatarURL = data.avatar ?? null;
        this.bannerURL = data.banner ?? null;

        if (!this.type) this.type = "user"; // since it's only defined when it's a bot.
        this.bot = this.type === "bot" ? true : false;
    }
}
