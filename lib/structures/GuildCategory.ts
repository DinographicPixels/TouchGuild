/** @module GuildCategory */

import { Client } from "./Client";
import { Base } from "./Base";
import { ChannelCategoryRolePermission } from "./ChannelCategoryRolePermission";
import { ChannelCategoryUserPermission } from "./ChannelCategoryUserPermission";
import { JSONGuildCategory } from "../types/json";
import { PATCHUpdateCategoryBody } from "../Constants";
import { APIGuildCategory, POSTChannelCategoryRolePermissionBody, POSTChannelCategoryUserPermissionBody } from "guildedapi-types.ts/v1";

/** Class representing a guild group. */
export class GuildCategory extends Base<number> {
    /** Type of the subscription */
    override id: number;
    /** The ID of the server */
    serverId: string;
    /** The ID of the group */
    groupId: string;
    /** The ISO 8601 timestamp that the category was created at  */
    createdAt: Date;
    /** The ISO 8601 timestamp that the category was updated at, if relevant */
    updatedAt?: Date | null;
    /** Name of the category (min length 1; max length 100) */
    name: string;

    constructor(data: APIGuildCategory, client: Client) {
        super(data.id, client);
        this.id = data.id;
        this.serverId = data.serverId;
        this.groupId = data.groupId;
        this.createdAt = new Date(data.createdAt);
        this.updatedAt = data.updatedAt ?? null;
        this.name = data.name;
        this.update(data);
    }

    override toJSON(): JSONGuildCategory {
        return {
            ...super.toJSON(),
            id:        this.id,
            serverId:  this.serverId,
            groupId:   this.groupId,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt ?? null,
            name:      this.name
        };
    }

    protected override update(data: APIGuildCategory): void {
        if (data.id !== undefined) {
            this.id = data.id;
        }
        if (data.serverId !== undefined) {
            this.serverId = data.serverId;
        }
        if (data.groupId !== undefined) {
            this.groupId = data.groupId;
        }
        if (data.createdAt !== undefined) {
            this.createdAt = new Date(data.createdAt);
        }
        if (data.updatedAt !== undefined) {
            this.updatedAt = data.updatedAt ?? null;
        }
        if (data.name !== undefined) {
            this.name = data.name;
        }
    }

    /**
     * Update a guild category.
     * @param guildID ID of the guild to create a category in.
     * @param categoryID ID of the category you want to read.
     * @param options Options to update a category.
     */
    async updateCategory(options: PATCHUpdateCategoryBody): Promise<GuildCategory> {
        return this.client.rest.guilds.updateCategory(this.serverId as string, this.id as number, options);
    }

    /**
     * Delete a guild category.
     * @param guildID ID of the guild to create a category in.
     * @param categoryID ID of the category you want to read.
     */
    async deleteCategory(): Promise<GuildCategory> {
        return this.client.rest.guilds.deleteCategory(this.serverId as string, this.id as number);
    }

    /**
     * Create guild category role permission.
     * @param roleID ID of the role
     * @param options permissions to set
     */
    async createRolePermission(roleID: number, options: POSTChannelCategoryRolePermissionBody): Promise<ChannelCategoryRolePermission> {
        return this.client.rest.channels.createChannelCategoryRolePermission(this.serverId as string, this.id as number, roleID, options);
    }

    /**
     * Create guild category role permissions.
     * @param roleID ID of the role
     */
    async getRolePermissions(roleID: number): Promise<ChannelCategoryRolePermission> {
        return this.client.rest.channels.getChannelCategoryRolePermission(this.serverId as string, this.id as number, roleID);
    }

    /**
     * Get guild category roles permissions.
     */
    async getRolesPermissions(): Promise<Array<ChannelCategoryRolePermission>> {
        return this.client.rest.channels.getChannelCategoryRolesPermission(this.serverId as string, this.id as number);
    }

    /**
     * Edit guild category role permission.
     * @param roleID ID of the role
     * @param options permissions to set
     */
    async editRolePermissions(roleID: number, options: POSTChannelCategoryRolePermissionBody): Promise<ChannelCategoryRolePermission> {
        return this.client.rest.channels.editChannelCategoryRolePermission(this.serverId as string, this.id as number, roleID, options);
    }

    /**
     * Delete guild category role permissions.
     * @param roleID ID of the role
     */
    async deleteRolePermissions(roleID: number): Promise<void> {
        return this.client.rest.channels.deleteChannelCategoryRolePermission(this.serverId as string, this.id as number, roleID);
    }

    /**
     * Create guild category role permission.
     * @param userID ID of the user
     * @param options permissions to set
     */
    async createUserPermissions(userID: string, options: POSTChannelCategoryUserPermissionBody): Promise<ChannelCategoryUserPermission> {
        return this.client.rest.channels.createChannelCategoryUserPermission(this.serverId as string, this.id as number, userID, options);
    }

    /**
     * Create guild category role permissions.
     * @param userID ID of the user
     */
    async getUserPermissions(userID: string): Promise<ChannelCategoryUserPermission> {
        return this.client.rest.channels.getChannelCategoryUserPermission(this.serverId as string, this.id as number, userID);
    }

    /**
     * Get guild category roles permissions.
     */
    async getUsersPermissions(): Promise<Array<ChannelCategoryUserPermission>> {
        return this.client.rest.channels.getChannelCategoryUsersPermission(this.serverId as string, this.id as number);
    }

    /**
     * Edit guild category role permission.
     * @param userID ID of the user
     * @param options permissions to set
     */
    async editUserPermissions(userID: string, options: POSTChannelCategoryRolePermissionBody): Promise<ChannelCategoryUserPermission> {
        return this.client.rest.channels.editChannelCategoryUserPermission(this.serverId as string, this.id as number, userID, options);
    }

    /**
     * Delete guild category role permissions.
     * @param userID ID of the user
     */
    async deleteUserPermissions(userID: string): Promise<void> {
        return this.client.rest.channels.deleteChannelCategoryUserPermission(this.serverId as string, this.id as number, userID);
    }
}
