/** @module ChannelHandler */

//
// © 2022–present Dinographic. All rights reserved.
//

import { GatewayEventHandler } from "./GatewayEventHandler";
import type {
    GatewayEvent_ChannelArchived,
    GatewayEvent_ChannelCategoryRolePermissionCreated,
    GatewayEvent_ChannelCategoryUserPermissionCreated,
    GatewayEvent_ChannelRestored,
    GatewayEvent_ChannelRolePermissionCreated,
    GatewayEvent_ChannelUserPermissionCreated,
    GatewayEvent_ChannelUserPermissionDeleted,
    GatewayEvent_ChannelUserPermissionUpdated,
    GatewayEvent_ServerChannelCreated,
    GatewayEvent_ServerChannelDeleted,
    GatewayEvent_ServerChannelUpdated
} from "../../Constants";
import type { AnyChannel } from "../../types";
import type { Permissions } from "guildedapi-types.ts/v1";

/** Internal component, emitting channel events. */
export class ChannelHandler extends GatewayEventHandler{
    private async addGuildChannel(guildID: string, channelID: string): Promise<void> {
        if (this.client.getChannel(guildID, channelID) !== undefined) return;
        const channel =
          await this.client.rest.channels.get(channelID)
              .catch(err =>
                  this.client.emit(
                      "warn",
                      `Cannot register channel to cache due to: (${String(err)})`)
              );
        const guild = this.client.guilds.get(guildID);
        if (typeof channel !== "boolean") guild?.channels?.add(channel);
    }
    async channelArchive(data: GatewayEvent_ChannelArchived): Promise<void> {
        const ChannelComponent = this.client.util.updateChannel(data.channel);
        this.client.emit("channelArchive", ChannelComponent);
    }
    async channelCategoryRolePermissionCreate(data: GatewayEvent_ChannelCategoryRolePermissionCreated): Promise<void> {
        this.client.emit(
            "channelCategoryRolePermissionCreate",
            {
                permission: (data.channelCategoryRolePermission.permissions as never as Array<Permissions>),
                createdAt:  data.channelCategoryRolePermission.createdAt,
                updatedAt:  data.channelCategoryRolePermission.updatedAt,
                roleID:     data.channelCategoryRolePermission.roleId,
                categoryID: data.channelCategoryRolePermission.categoryId,
                guildID:    data.serverId
            });
    }
    async channelCategoryRolePermissionDelete(data: GatewayEvent_ChannelCategoryRolePermissionCreated): Promise<void> {
        this.client.emit(
            "channelCategoryRolePermissionDelete",
            {
                permission: (data.channelCategoryRolePermission.permissions as never as Array<Permissions>),
                createdAt:  data.channelCategoryRolePermission.createdAt,
                updatedAt:  data.channelCategoryRolePermission.updatedAt,
                roleID:     data.channelCategoryRolePermission.roleId,
                categoryID: data.channelCategoryRolePermission.categoryId,
                guildID:    data.serverId
            });
    }
    async channelCategoryRolePermissionUpdate(data: GatewayEvent_ChannelCategoryRolePermissionCreated): Promise<void> {
        this.client.emit(
            "channelCategoryRolePermissionUpdate",
            {
                permission: (data.channelCategoryRolePermission.permissions as never as Array<Permissions>),
                createdAt:  data.channelCategoryRolePermission.createdAt,
                updatedAt:  data.channelCategoryRolePermission.updatedAt,
                roleID:     data.channelCategoryRolePermission.roleId,
                categoryID: data.channelCategoryRolePermission.categoryId,
                guildID:    data.serverId
            });
    }
    async channelCategoryUserPermissionCreate(data: GatewayEvent_ChannelCategoryUserPermissionCreated): Promise<void> {
        this.client.emit(
            "channelCategoryUserPermissionCreate",
            {
                permission: (data.channelCategoryUserPermission.permissions as never as Array<Permissions>),
                createdAt:  data.channelCategoryUserPermission.createdAt,
                updatedAt:  data.channelCategoryUserPermission.updatedAt,
                categoryID: data.channelCategoryUserPermission.categoryId,
                userID:     data.channelCategoryUserPermission.userId,
                guildID:    data.serverId
            });
    }

    async channelCategoryUserPermissionDelete(data: GatewayEvent_ChannelCategoryUserPermissionCreated): Promise<void> {
        this.client.emit(
            "channelCategoryUserPermissionDelete",
            {
                permission: (data.channelCategoryUserPermission.permissions as never as Array<Permissions>),
                createdAt:  data.channelCategoryUserPermission.createdAt,
                updatedAt:  data.channelCategoryUserPermission.updatedAt,
                categoryID: data.channelCategoryUserPermission.categoryId,
                userID:     data.channelCategoryUserPermission.userId,
                guildID:    data.serverId
            });
    }
    async channelCategoryUserPermissionUpdate(data: GatewayEvent_ChannelCategoryUserPermissionCreated): Promise<void> {
        this.client.emit(
            "channelCategoryUserPermissionUpdate",
            {
                permission: (data.channelCategoryUserPermission.permissions as never as Array<Permissions>),
                createdAt:  data.channelCategoryUserPermission.createdAt,
                updatedAt:  data.channelCategoryUserPermission.updatedAt,
                categoryID: data.channelCategoryUserPermission.categoryId,
                userID:     data.channelCategoryUserPermission.userId,
                guildID:    data.serverId
            });
    }
    async channelCreate(data: GatewayEvent_ServerChannelCreated): Promise<void> {
        if (this.client.params.waitForCaching)
            await this.addGuildChannel(data.serverId, data.channel.id);
        else void this.addGuildChannel(data.serverId, data.channel.id);
        const ChannelComponent = this.client.util.updateChannel(data.channel);
        this.client.emit("channelCreate", ChannelComponent);
    }


    async channelDelete(data: GatewayEvent_ServerChannelDeleted): Promise<void> {
        const guild = this.client.guilds.get(data.serverId);
        const ChannelComponent = this.client.util.updateChannel(data.channel);
        guild?.channels.delete(data.channel.id);
        this.client.emit("channelDelete", ChannelComponent);
    }
    async channelRestore(data: GatewayEvent_ChannelRestored): Promise<void> {
        const ChannelComponent = this.client.util.updateChannel(data.channel);
        this.client.emit("channelRestore", ChannelComponent);
    }
    async channelRolePermissionCreate(data: GatewayEvent_ChannelRolePermissionCreated): Promise<void> {
        this.client.emit(
            "channelRolePermissionCreate",
            {
                permission: (data.channelRolePermission.permissions as never as Array<Permissions>),
                createdAt:  data.channelRolePermission.createdAt,
                updatedAt:  data.channelRolePermission.updatedAt,
                roleID:     data.channelRolePermission.roleId,
                channelID:  data.channelRolePermission.channelId,
                guildID:    data.serverId
            }
        );
    }
    async channelRolePermissionDelete(data: GatewayEvent_ChannelRolePermissionCreated): Promise<void> {
        this.client.emit(
            "channelRolePermissionDelete",
            {
                permission: (data.channelRolePermission.permissions as never as Array<Permissions>),
                createdAt:  data.channelRolePermission.createdAt,
                updatedAt:  data.channelRolePermission.updatedAt,
                roleID:     data.channelRolePermission.roleId,
                channelID:  data.channelRolePermission.channelId,
                guildID:    data.serverId
            });
    }
    async channelRolePermissionUpdate(data: GatewayEvent_ChannelRolePermissionCreated): Promise<void> {
        this.client.emit(
            "channelRolePermissionUpdate",
            {
                permission: (data.channelRolePermission.permissions as never as Array<Permissions>),
                createdAt:  data.channelRolePermission.createdAt,
                updatedAt:  data.channelRolePermission.updatedAt,
                roleID:     data.channelRolePermission.roleId,
                channelID:  data.channelRolePermission.channelId,
                guildID:    data.serverId
            });
    }
    async channelUpdate(data: GatewayEvent_ServerChannelUpdated): Promise<void> {
        if (this.client.params.waitForCaching)
            await this.addGuildChannel(data.serverId, data.channel.id);
        else void this.addGuildChannel(data.serverId, data.channel.id);
        const channel =
          this.client.getChannel<AnyChannel>(data.serverId, data.channel.id);
        const CachedChannel = channel ? channel.toJSON() : null;
        const ChannelComponent = this.client.util.updateChannel(data.channel);
        this.client.emit("channelUpdate", ChannelComponent, CachedChannel);
    }


    async channelUserPermissionCreate(data: GatewayEvent_ChannelUserPermissionCreated): Promise<void> {
        this.client.emit(
            "channelUserPermissionCreate",
            {
                channelID:  data.channelUserPermission.channelId,
                createdAt:  data.channelUserPermission.createdAt,
                updatedAt:  data.channelUserPermission.updatedAt,
                userID:     data.channelUserPermission.userId,
                guildID:    data.serverId,
                permission: data.channelUserPermission as never as Array<Permissions>
            });
    }

    async channelUserPermissionDelete(data: GatewayEvent_ChannelUserPermissionDeleted): Promise<void> {
        this.client.emit(
            "channelUserPermissionDelete",
            {
                channelID:  data.channelUserPermission.channelId,
                createdAt:  data.channelUserPermission.createdAt,
                updatedAt:  data.channelUserPermission.updatedAt,
                userID:     data.channelUserPermission.userId,
                guildID:    data.serverId,
                permission: data.channelUserPermission as never as Array<Permissions>
            });
    }
    async channelUserPermissionUpdate(data: GatewayEvent_ChannelUserPermissionUpdated): Promise<void> {
        this.client.emit(
            "channelUserPermissionUpdate",
            {
                channelID:  data.channelUserPermission.channelId,
                createdAt:  data.channelUserPermission.createdAt,
                updatedAt:  data.channelUserPermission.updatedAt,
                userID:     data.channelUserPermission.userId,
                guildID:    data.serverId,
                permission: data.channelUserPermission as never as Array<Permissions>
            });
    }
}
