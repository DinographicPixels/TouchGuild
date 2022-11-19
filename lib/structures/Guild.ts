/** @module Guild */
import { Client } from "./Client";
import { Base } from "./Base";
import { APIGuild } from "../Constants";

/** Represents a Guild, also called server. */
export class Guild extends Base {
    /** ID of the guild owner. */
    ownerID: string;
    /** Guild type. */
    type?: string;
    /** Guild name. */
    name: string;
    /** Guild URL. */
    url?: string;
    /** Guild's about/description. */
    about?: string;
    /** Guild's about/description. */
    description?: string;
    /** Guild icon URL. */
    iconURL?: string | null;
    /** Guild banner URL. */
    bannerURL?: string | null;
    /** Guild's timezone. */
    timezone?: string;
    /** Default channel of the guild. */
    defaultChannelID?: string;
    /** Timestamp of the guild's creation. */
    _createdAt: number;

    /**
     * @param data raw data.
     * @param client client.
     */
    constructor(data: APIGuild, client: Client){
        super(data.id, client);
        this.ownerID = data.ownerId;
        this.type = data.type;
        this.name = data.name;
        this.url = data.url;
        this.about = data.about; // same but with
        this.description = data.about; //   two types.
        this.iconURL = data.avatar ?? null;
        this.bannerURL = data.banner ?? null;
        this.timezone = data.timezone;
        this.defaultChannelID = data.defaultChannelId;
        this._createdAt = Date.parse(data.createdAt);
    }

    /** Date of the guild's creation. */
    get createdAt(): Date{
        return new Date(this._createdAt);
    }
}
