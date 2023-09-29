/** @module ChannelCategoryUserPermission */

import { Client } from "./Client";
import { Base } from "./Base";
import { JSONChannelCategoryUserPermission } from "../types/json";
import { APIChannelCategoryUserPermission } from "guildedapi-types.ts/v1";

/** Class representing a guild group. */
export class ChannelCategoryUserPermission extends Base<string> {
    /** raw data */
    data: APIChannelCategoryUserPermission;
    permissions: Record<string, boolean>;
    /** The ISO 8601 timestamp that the permission override was created at */
    createdAt: Date;
    /** The ISO 8601 timestamp that the permission override was updated at, if relevant */
    updatedAt?: Date | null;
    /** The ID of the user */
    userId: string;
    /** The ID of the channel */
    categoryId: number;

    constructor(data: APIChannelCategoryUserPermission, client: Client) {
        super(data.userId, client);
        this.data = data;
        this.permissions = data.permissions;
        this.createdAt = new Date(data.createdAt);
        this.updatedAt = data.updatedAt ?? null;
        this.userId = data.userId;
        this.categoryId = data.categoryId;
        this.update(data);
    }

    override toJSON(): JSONChannelCategoryUserPermission {
        return {
            ...super.toJSON(),
            data:        this.data,
            permissions: this.permissions,
            createdAt:   this.createdAt,
            updatedAt:   this.updatedAt ?? null,
            userId:      this.userId,
            categoryId:  this.categoryId
        };
    }

    protected override update(data: APIChannelCategoryUserPermission): void {
        if (data.userId !== undefined) {
            this.userId = data.userId;
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
        if (data.userId !== undefined) {
            this.userId = data.userId;
        }
    }
}
