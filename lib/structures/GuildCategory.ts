/** @module GuildCategory */

import { Client } from "./Client";
import { Base } from "./Base";
import { JSONGuildCategory } from "../types/json";
import { APIGuildCategory } from "guildedapi-types.ts/v1";
import {
    GETReadCategoryResponse,
    POSTCreateCategoryBody,
    POSTCreateCategoryResponse,
    PATCHUpdateCategoryBody,
    PATCHUpdateCategoryResponse,
    DELETEDeleteCategoryResponse
} from "../Constants";

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
}
