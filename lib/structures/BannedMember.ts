import { Client } from './Client';
import { User } from './User';
import { Guild } from './Guild';
import { call } from '../Utils';
const calls = new call()

export class BannedMember extends User {
    /** Server ID. */
    guildID: string; 
    /** Information about the banned member (object) */
    ban:{
        /** Reason of the ban */
        reason: string,
        /** Timestamp (unix epoch time) of when the member has been banned. */
        createdAt: number|null,
        /** ID of the member that banned the user. */
        createdBy: string
    }
    /** Basic user information about the banned member */
    user: {
        /** User ID */
        id: string,
        /** Type of the user (user or bot) */
        type: string,
        /** User name. */
        username: string
    }
    constructor(data: any, client:Client){
        super(data.serverMemberBan, client);
        this.guildID = data.serverId
        this.ban = {
            reason: data.serverMemberBan.reason,
            createdAt: data.serverMemberBan.createdAt ? Date.parse(data.serverMemberBan.createdAt): null,
            createdBy: data.serverMemberBan.createdBy
        }
        this.user = {
            id: data.serverMemberBan.user.id,
            type: data.serverMemberBan.user.type,
            username: data.serverMemberBan.user.name
        }
    }

    /** Guild/server component */
    get guild(): Guild{
        return calls.syncGetGuild(this.guildID, this._client) as Guild;
    }
}