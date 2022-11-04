import { GatewayEventHandler } from "./GatewayEventHandler";

import { BannedMember, Client, Guild, Member } from "../../index";

import { call } from "../../Utils";
import { GuildCreateInfo } from "../../tg-types/types";
import {
    GatewayEvent_BotTeamMembershipCreated,
    GatewayEvent_TeamMemberBanned,
    GatewayEvent_TeamMemberJoined,
    GatewayEvent_TeamMemberRemoved,
    GatewayEvent_TeamMemberUnbanned,
    GatewayEvent_TeamMemberUpdated,
    GatewayEvent_teamRolesUpdated
} from "guildedapi-types.ts/v1";

const calls = new call();

export class GuildHandler extends GatewayEventHandler{
    guildBanAdd(data: GatewayEvent_TeamMemberBanned): void{
        const GuildMemberBanComponent = new BannedMember(data.serverId, data.serverMemberBan, this.client);
        this.client.emit("guildBanAdd", GuildMemberBanComponent);
    }

    guildBanRemove(data: GatewayEvent_TeamMemberUnbanned): void{
        const GuildMemberBanComponent = new BannedMember(data.serverId, data.serverMemberBan, this.client);
        this.client.emit("guildBanRemove", GuildMemberBanComponent);
    }

    guildMemberAdd(data: GatewayEvent_TeamMemberJoined): void{
        const MemberComponent = new Member(data.member, this.client, data.serverId);
        this.client.emit("guildMemberAdd", MemberComponent);
    }

    guildMemberRemove(data: GatewayEvent_TeamMemberRemoved): void{
        const output = new MemberRemoveInfo(data, this.client);
        this.client.emit("guildMemberRemove", output);
    }

    guildMemberUpdate(data: GatewayEvent_TeamMemberUpdated): void{
        const output = new MemberUpdateInfo(data, this.client);
        this.client.emit("guildMemberUpdate", output);

    }

    guildMemberRoleUpdate(data: GatewayEvent_teamRolesUpdated): void{
        const output = new MemberRoleUpdateInfo(data, this.client);
        this.client.emit("guildMemberRoleUpdate", output);
    }

    // fired when bot joins a guild.
    guildCreate(data: GatewayEvent_BotTeamMembershipCreated): void{
        const GuildComponent = new Guild(data.server, this.client);
        const output = {
            guild:     GuildComponent,
            createdBy: data.createdBy
        };
        this.client.emit("guildCreate", output as GuildCreateInfo);
    }
}


export class MemberRemoveInfo {
    private _client: Client; guildID: string; userID: string; isKick?: boolean; isBan?: boolean;
    constructor(data: GatewayEvent_TeamMemberRemoved, client: Client){
        this._client = client;
        this.guildID = data.serverId;
        this.userID = data.userId;
        this.isKick = data.isKick;
        this.isBan = data.isBan;
    }

    get guild(): Guild{
        return calls.syncGetGuild(this.guildID, this._client) as Guild;
    }

    get member(): Member{
        return calls.syncGetMember(this.guildID, this.userID, this._client) as Member;
    }
}

export class MemberUpdateInfo {
    private _client: Client; guildID: string; userID: string; updatedNickname?: string;
    constructor(data: GatewayEvent_TeamMemberUpdated, client: Client){
        this._client = client;
        this.guildID = data.serverId;
        this.userID = data.userInfo.id;
        this.updatedNickname = data.userInfo.nickname;
    }

    get member(): Member{
        return calls.syncGetMember(this.guildID, this.userID, this._client) as Member;
    }

    get guild(): Guild{
        return calls.syncGetGuild(this.guildID, this._client) as Guild;
    }
}

export class MemberRoleUpdateInfo {
    private _client: Client; guildID: string; userID: string; roles: Array<number>; oldRoles: Array<number>;
    constructor(data: GatewayEvent_teamRolesUpdated, client: Client){
        this._client = client;
        this.guildID = data.serverId;
        this.userID = data.memberRoleIds[0].userId;
        this.roles = data.memberRoleIds[0].roleIds;
        this.oldRoles = (this._client.cache.get(`guildMember_${this.userID}`) as Member)?.roles ?? null;
        this.updateCache.bind(this); this.updateCache();
    }

    get guild(): Guild {
        return calls.syncGetGuild(this.guildID, this._client) as Guild;
    }

    get member(): Member {
        return calls.syncGetMember(this.guildID, this.userID, this._client) as Member;
    }

    private updateCache(): void {
        if (this._client.cache.has(`guildMember_${this.userID}`)){
            if (!this.roles) return;
            const component: Member = this._client.cache.get(`guildMember_${this.userID}`) as Member;
            component.roles = this.roles;
            this._client.cache.set(`guildMember_${this.userID}`, component);
        }
    }
}
