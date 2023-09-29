/** @module ChannelRolePermission */

import { Client } from "./Client";
import { Base } from "./Base";
import { JSONChannelRolePermission } from "../types/json";
import { APIChannelRolePermission } from "guildedapi-types.ts/v1";

/** Class representing a guild group. */
export class ChannelRolePermission extends Base<number> {
    /** raw data */
    data: APIChannelRolePermission;
    permissions: Record<string, boolean>;
    /** The ISO 8601 timestamp that the permission override was created at */
    createdAt: Date;
    /** The ISO 8601 timestamp that the permission override was updated at, if relevant */
    updatedAt?: Date | null;
    /** The ID of the role */
    roleId: number;
    /** The ID of the channel */
    channelId: string;

    constructor(data: APIChannelRolePermission, client: Client) {
        super(data.roleId, client);
        this.data = data;
        this.permissions = data.permissions;
        this.createdAt = new Date(data.createdAt);
        this.updatedAt = data.updatedAt ?? null;
        this.roleId = data.roleId;
        this.channelId = data.channelId;
        this.update(data);
    }

    override toJSON(): JSONChannelRolePermission {
        return {
            ...super.toJSON(),
            data:        this.data,
            permissions: this.permissions,
            createdAt:   this.createdAt,
            updatedAt:   this.updatedAt ?? null,
            roleId:      this.roleId,
            channelId:   this.channelId
        };
    }

    protected override update(data: APIChannelRolePermission): void {
        if (data.roleId !== undefined) {
            this.roleId = data.roleId;
        }
        if (data.permissions !== undefined) {
            this.permissions = data.permissions;
        }
        if (data.createdAt !== undefined) {
            this.createdAt = new Date(data.createdAt);
        }
        if (data.updatedAt !== undefined) {
            this.updatedAt = data.updatedAt ?? null;
        }
        if (data.channelId !== undefined) {
            this.channelId = data.channelId;
        }
        if (data.roleId !== undefined) {
            this.roleId = data.roleId;
        }
    }
}
