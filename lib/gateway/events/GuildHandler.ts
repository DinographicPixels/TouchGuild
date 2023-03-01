/** @module GuildHandler */
import { GatewayEventHandler } from "./GatewayEventHandler";

import { BannedMember, Guild, Member } from "../../index";

import { GuildCreateInfo, GuildDeleteInfo } from "../../types/types";
import {
    GatewayEvent_BotServerMembershipCreated,
    GatewayEvent_BotServerMembershipDeleted,
    GatewayEvent_ServerMemberBanned,
    GatewayEvent_ServerMemberJoined,
    GatewayEvent_ServerMemberRemoved,
    GatewayEvent_ServerMemberSocialLinkCreated,
    GatewayEvent_ServerMemberSocialLinkDeleted,
    GatewayEvent_ServerMemberSocialLinkUpdated,
    GatewayEvent_ServerMemberUnbanned,
    GatewayEvent_ServerMemberUpdated,
    GatewayEvent_ServerRolesUpdated
} from "../../Constants";
import { MemberUpdateInfo } from "../../structures/MemberUpdateInfo";
import { MemberRemoveInfo } from "../../structures/MemberRemoveInfo";

/** Internal component, emitting guild events. */
export class GuildHandler extends GatewayEventHandler {
    guildBanAdd(data: GatewayEvent_ServerMemberBanned): void{
        const GuildMemberBanComponent = new BannedMember(data.serverId, data.serverMemberBan, this.client);
        this.client.emit("guildBanAdd", GuildMemberBanComponent);
    }

    guildBanRemove(data: GatewayEvent_ServerMemberUnbanned): void{
        const GuildMemberBanComponent = new BannedMember(data.serverId, data.serverMemberBan, this.client);
        this.client.emit("guildBanRemove", GuildMemberBanComponent);
    }

    guildMemberAdd(data: GatewayEvent_ServerMemberJoined): void{
        const MemberComponent = new Member(data.member, this.client, data.serverId);
        this.client.emit("guildMemberAdd", MemberComponent);
    }

    guildMemberRemove(data: GatewayEvent_ServerMemberRemoved): void{
        const output = new MemberRemoveInfo(data, data.userId, this.client);
        this.client.emit("guildMemberRemove", output);
    }

    guildMemberUpdate(data: GatewayEvent_ServerMemberUpdated): void{
        const output = new MemberUpdateInfo(data, data.userInfo.id, this.client);
        this.client.emit("guildMemberUpdate", output);
    }

    guildMemberRoleUpdate(data: GatewayEvent_ServerRolesUpdated): void{
        const output = new MemberUpdateInfo(data, data.memberRoleIds[0].userId, this.client);
        this.client.emit("guildMemberUpdate", output);
    }

    guildCreate(data: GatewayEvent_BotServerMembershipCreated): void{
        const GuildComponent = new Guild(data.server, this.client);
        this.client.guilds.add(GuildComponent);
        const output = {
            guild:     GuildComponent,
            inviterID: data.createdBy
        };
        this.client.emit("guildCreate", output as GuildCreateInfo);
    }

    guildDelete(data: GatewayEvent_BotServerMembershipDeleted): void {
        const GuildComponent = new Guild(data.server, this.client);
        this.client.guilds.delete(GuildComponent.id as string);
        const output = {
            guild:     GuildComponent,
            removerID: data.createdBy
        };
        this.client.emit("guildDelete", output as GuildDeleteInfo);
    }

    guildMemberSocialLinkCreate(data: GatewayEvent_ServerMemberSocialLinkCreated): void {
        this.client.emit("guildMemberUpdate", new MemberUpdateInfo(data, data.socialLink.userId, this.client));
    }

    guildMemberSocialLinkUpdate(data: GatewayEvent_ServerMemberSocialLinkUpdated): void {
        this.client.emit("guildMemberUpdate", new MemberUpdateInfo(data, data.socialLink.userId, this.client));
    }

    guildMemberSocialLinkDelete(data: GatewayEvent_ServerMemberSocialLinkDeleted): void {
        this.client.emit("guildMemberUpdate", new MemberUpdateInfo(data, data.socialLink.userId, this.client));
    }
}
