/** @module ChannelUserPermission */

import { Client } from "./Client";
import { Base } from "./Base";
import { JSONChannelUserPermission } from "../types/json";
import { APIChannelUserPermission } from "guildedapi-types.ts/v1";

/** Class representing a guild group. */
export class ChannelUserPermission extends Base<string> {
    /** raw data */
    data: APIChannelUserPermission;
    permissions: Record<string, boolean>;
    /** The ISO 8601 timestamp that the permission override was created at */
    createdAt: Date;
    /** The ISO 8601 timestamp that the permission override was updated at, if relevant */
    updatedAt?: Date | null;
    /** The ID of the user */
    userId: string;
    /** The ID of the channel */
    channelId: string;

    constructor(data: APIChannelUserPermission, client: Client) {
        super(data.userId, client);
        this.data = data;
        this.permissions = data.permissions;
        this.createdAt = new Date(data.createdAt);
        this.updatedAt = data.updatedAt ?? null;
        this.userId = data.userId;
        this.channelId = data.channelId;
        this.update(data);
    }

    override toJSON(): JSONChannelUserPermission {
        return {
            ...super.toJSON(),
            data:        this.data,
            permissions: this.permissions,
            createdAt:   this.createdAt,
            updatedAt:   this.updatedAt ?? null,
            userId:      this.userId,
            channelId:   this.channelId
        };
    }

    protected override update(data: APIChannelUserPermission): void {
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
        if (data.channelId !== undefined) {
            this.channelId = data.channelId;
        }
        if (data.userId !== undefined) {
            this.userId = data.userId;
        }
    }
}
