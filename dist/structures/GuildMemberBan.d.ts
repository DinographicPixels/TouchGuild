import { Client } from './Client';
import { User } from './User';
import { Guild } from './Guild';
export declare class GuildMemberBan extends User {
    guildID: string;
    guild: Guild;
    ban: {
        reason: string;
        createdAt: string;
        createdBy: string;
    };
    constructor(data: any, client: Client);
}
