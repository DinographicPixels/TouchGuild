import { Client } from "../../structures/Client";
import { Guild } from "../../structures/Guild";
import { Member } from "../../structures/Member";
import { GatewayEventHandler } from "./GatewayEventHandler";
export declare class GuildHandler extends GatewayEventHandler {
    guildBanAdd(data: object): void;
    guildBanRemove(data: object): void;
    guildMemberAdd(data: object): void;
    guildMemberRemove(data: object): void;
    guildMemberUpdate(data: object): void;
    guildMemberRoleUpdate(data: object): void;
}
export declare class MemberRemoveInfo {
    private _client;
    guildID: string;
    userID: string;
    isKick: boolean;
    isBan: boolean;
    constructor(data: object, client: Client);
    get guild(): Guild;
    get member(): Member;
}
export declare class MemberUpdateInfo {
    private _client;
    guildID: string;
    userID: string;
    updatedNickname: string;
    constructor(data: any, client: Client);
    get member(): Member;
    get guild(): Guild;
}
export declare class MemberRoleUpdateInfo {
    private _client;
    guildID: string;
    userID: string;
    roles: Array<number>;
    oldRoles: Array<number>;
    constructor(data: any, client: Client);
    get guild(): Guild;
    get member(): Member;
    private updateCache;
}
