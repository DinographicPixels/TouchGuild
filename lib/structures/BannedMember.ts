/** @module BannedMember */
import { Client } from "./Client";
import { User } from "./User";
import { Guild } from "./Guild";
import { APIGuildMemberBan, APIUser } from "../Constants";

/** BannedMember represents a banned guild member. */
export class BannedMember extends User {
    /** Server ID. */
    guildID: string;
    /** Information about the banned member (object) */
    ban: {
        /** Reason of the ban */
        reason?: string;
        /** When the member has been banned. */
        createdAt: Date | null;
        /** ID of the member who banned this member. */
        bannedBy: string;
    };
    /**
     * @param guildID ID of the guild.
     * @param data raw data.
     * @param client client.
     */
    constructor(guildID: string, data: APIGuildMemberBan, client: Client){
        super(data.user as APIUser, client);
        this.guildID = guildID;
        this.ban = {
            reason:    data.reason,
            createdAt: data.createdAt ? new Date(data.createdAt) : null,
            bannedBy:  data.createdBy
        };
    }

    /** Getter used to get the message's guild
     *
     * Note: this can return a promise, make sure to await it before.
     */
    get guild(): Guild | Promise<Guild> {
        return this.client.cache.guilds.get(this.guildID) ?? this.client.rest.guilds.getGuild(this.guildID);
    }
}
