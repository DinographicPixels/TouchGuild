/** @module ChannelCategoryRolePermission */

import { Client } from "./Client";
import { Base } from "./Base";
import { JSONChannelCategoryRolePermission } from "../types/json";
import { APIChannelCategoryRolePermission } from "guildedapi-types.ts/v1";

/** Class representing a guild group. */
export class ChannelCategoryRolePermission extends Base<number> {
    /** raw data */
    data: APIChannelCategoryRolePermission;
    permissions: Record<string, boolean>;
    /** The ISO 8601 timestamp that the permission override was created at */
    createdAt: Date;
    /** The ISO 8601 timestamp that the permission override was updated at, if relevant */
    updatedAt?: Date | null;
    /** The ID of the role */
    roleId: number;
    /** The ID of the channel */
    categoryId: number;

    constructor(data: APIChannelCategoryRolePermission, client: Client) {
        super(data.roleId, client);
        this.data = data;
        this.permissions = data.permissions;
        this.createdAt = new Date(data.createdAt);
        this.updatedAt = data.updatedAt ?? null;
        this.roleId = data.roleId;
        this.categoryId = data.categoryId;
        this.update(data);
    }

    override toJSON(): JSONChannelCategoryRolePermission {
        return {
            ...super.toJSON(),
            data:        this.data,
            permissions: this.permissions,
            createdAt:   this.createdAt,
            updatedAt:   this.updatedAt ?? null,
            roleId:      this.roleId,
            categoryId:  this.categoryId
        };
    }

    protected override update(data: APIChannelCategoryRolePermission): void {
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
        if (data.categoryId !== undefined) {
            this.categoryId = data.categoryId;
        }
        if (data.roleId !== undefined) {
            this.roleId = data.roleId;
        }
    }
}
