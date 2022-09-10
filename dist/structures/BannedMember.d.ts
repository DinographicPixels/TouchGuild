import { Client } from './Client';
import { User } from './User';
import { Guild } from './Guild';
export declare class BannedMember extends User {
    /** Server ID. */
    guildID: string;
    /** Information about the banned member (object) */
    ban: {
        /** Reason of the ban */
        reason: string;
        /** Timestamp (unix epoch time) of when the member has been banned. */
        createdAt: number | null;
        /** ID of the member that banned the user. */
        createdBy: string;
    };
    /** Basic user information about the banned member */
    user: {
        /** User ID */
        id: string;
        /** Type of the user (user or bot) */
        type: string;
        /** User name. */
        username: string;
    };
    constructor(data: any, client: Client);
    /** Guild/server component */
    get guild(): Guild;
}
