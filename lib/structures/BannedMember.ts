import { Client } from "./Client";
import { User } from "./User";
import { Guild } from "./Guild";
import { call } from "../Utils";
import { APIGuildMemberBan, APIUser } from "guildedapi-types.ts/v1";
const calls = new call();

export class BannedMember extends User {
    /** Server ID. */
    guildID: string;
    /** Information about the banned member (object) */
    ban: {
        /** Reason of the ban */
        reason?: string;
        /** Timestamp (unix epoch time) of when the member has been banned. */
        createdAt: number|null;
        /** ID of the member that banned the user. */
        createdBy: string;
    };
    constructor(guildID: string, data: APIGuildMemberBan, client: Client){
        super(data.user as APIUser, client);
        this.guildID = guildID;
        this.ban = {
            reason:    data.reason,
            createdAt: data.createdAt ? Date.parse(data.createdAt) : null,
            createdBy: data.createdBy
        };
    }

    /** Guild/server component */
    get guild(): Guild{
        return calls.syncGetGuild(this.guildID, this._client) as Guild;
    }
}
