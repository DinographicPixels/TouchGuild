/** @module Guild */
import { Client } from "./Client";
import { Base } from "./Base";
import { Channel } from "./Channel";
import { Member } from "./Member";
import { User } from "./User";
import { APIGuild } from "../Constants";

/** Represents a Guild, also called server. */
export class Guild extends Base {
    /** ID of the guild owner. */
    ownerID: string;
    /** Guild type. */
    type?: string;
    /** The name of the guild. */
    name: string;
    /** The URL of the guild. */
    url?: string;
    /** Guild description. */
    description?: string;
    /** Guild icon URL. */
    iconURL?: string | null;
    /** Guild banner URL. */
    bannerURL?: string | null;
    /** Guild's timezone. */
    timezone?: string;
    /** Default channel of the guild. */
    defaultChannelID?: string;
    /** When this guild was created. */
    createdAt: Date;

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
        this.description = data.about;
        this.iconURL = data.avatar ?? null;
        this.bannerURL = data.banner ?? null;
        this.timezone = data.timezone;
        this.defaultChannelID = data.defaultChannelId;
        this.createdAt = new Date(data.createdAt);
    }

    /** Retrieve guild's owner, if cached.
     * If there is no cached member or user, this will make a request which returns a Promise.
     * If the request fails, this will throw an error or return you undefined as a value.
     */
    get owner(): Member | User | Promise<Member> | undefined {
        if (this.client.cache.members.get(this.ownerID) && this.ownerID){
            return this.client.cache.members.get(this.ownerID);
        } else if (this.client.cache.users.get(this.ownerID) && this.ownerID){
            return this.client.cache.users.get(this.ownerID);
        } else if (this.ownerID && this.id){
            return this.client.rest.guilds.getMember(this.id as string, this.ownerID);
        }
    }

    /** Get a channel from this guild.
     * @param channelID The ID of the channel to get.
     */
    async getChannel(channelID: string): Promise<Channel>{
        return this.client.rest.channels.getChannel(channelID);
    }
}
