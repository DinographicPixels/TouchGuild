import { BannedMember } from "../../structures/BannedMember";
import { Client } from "../../structures/Client";
import { Guild } from "../../structures/Guild";
import { Member } from "../../structures/Member";
import { GatewayEventHandler } from "./GatewayEventHandler";

import { call } from '../../Utils'
const calls = new call();

export class GuildHandler extends GatewayEventHandler{
    guildBanAdd(data: object){
        var GuildMemberBanComponent = new BannedMember(data, this.client);
        this.client.emit('guildBanAdd', GuildMemberBanComponent);
    }

    guildBanRemove(data: object){
        var GuildMemberBanComponent = new BannedMember(data, this.client);
        this.client.emit('guildBanRemove', GuildMemberBanComponent);
    }

    guildMemberAdd(data: object){
        var MemberComponent = new Member(data['member' as keyof object], this.client, data['serverId' as keyof object]);
        this.client.emit('guildMemberAdd', MemberComponent);
    }

    guildMemberRemove(data: object){
        var output = new MemberRemoveInfo(data, this.client);
        this.client.emit('guildMemberRemove', output);
    }

    guildMemberUpdate(data: object){
        var output = new MemberUpdateInfo(data, this.client);
        this.client.emit('guildMemberUpdate', output);

    }

    guildMemberRoleUpdate(data: object){
        var output = new MemberRoleUpdateInfo(data, this.client);
        this.client.emit('guildMemberRoleUpdate', output);
    }
}


export class MemberRemoveInfo {
    private _client: Client; guildID: string; userID: string; isKick: boolean; isBan: boolean;
    constructor(data: object, client: Client){
        this._client = client;
        this.guildID = data['serverId' as keyof object];
        this.userID = data['userId' as keyof object];
        this.isKick = data['isKick' as keyof object];
        this.isBan= data['isBan' as keyof object];
    }

    get guild(): Guild{
        return calls.syncGetGuild(this.guildID, this._client) as Guild
    }

    get member(): Member{
        return calls.syncGetMember(this.guildID, this.userID, this._client) as Member
    }
}

export class MemberUpdateInfo {
    private _client: Client; guildID: string; userID: string; updatedNickname: string;
    constructor(data: any, client: Client){
        this._client = client;
        this.guildID = data.serverId
        this.userID = data.userInfo.id,
        this.updatedNickname = data.userInfo.nickname
    }

    get member(): Member{
        return calls.syncGetMember(this.guildID, this.userID, this._client) as Member
    }

    get guild(): Guild{
        return calls.syncGetGuild(this.guildID, this._client) as Guild
    }
}

export class MemberRoleUpdateInfo {
    private _client: Client; guildID: string; userID: string; roles: Array<number>; oldRoles: Array<number>;
    constructor(data: any, client: Client){
        this._client = client
        this.guildID = data.serverId
        this.userID = data.memberRoleIds[0].userId,
        this.roles = data.memberRoleIds[0].roleIds
        this.oldRoles = this._client.cache.get(`guildMember_${this.userID}`)?.['roles'] ?? null;
        this.updateCache.bind(this); this.updateCache();
    }

    get guild(): Guild{
        return calls.syncGetGuild(this.guildID, this._client) as Guild
    }

    get member(): Member{
        return calls.syncGetMember(this.guildID, this.userID, this._client) as Member
    }

    private async updateCache(){
        if (this._client.cache.has(`guildMember_${this.userID}`)){
            if (!this.roles) return;
            let component = await this._client.cache.get(`guildMember_${this.userID}`)
            component.roles = this.roles;
            await this._client.cache.set(`guildMember_${this.userID}`, component);
        }
    }
}