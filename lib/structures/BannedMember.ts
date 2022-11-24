/** @module BannedMember */
import { Client } from "./Client";
import { User } from "./User";
import { Guild } from "./Guild";
import { APIGuildMemberBan, APIUser } from "../Constants";
import { Uncached } from "../types/types";

/** BannedMember represents a banned guild member. */
export class BannedMember extends User {
    /** Guild ID. */
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

    /** Banned member's guild, if cached. */
    get guild(): Guild | Uncached {
        return this.client.cache.guilds.get(this.guildID) ?? { id: this.guildID };
    }
}
