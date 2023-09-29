/** @module TextChannel */
import { Client } from "./Client";

import { Message } from "./Message";
import { GuildChannel } from "./GuildChannel";
import { ChannelUserPermission } from "./ChannelUserPermission";
import { ChannelRolePermission } from "./ChannelRolePermission";
import { AnyTextableChannel, EditMessageOptions } from "../types/channel";
import type {
    APIChatMessage,
    APIGuildChannel,
    APIMessageOptions,
    PATCHChannelRolePermissionBody,
    POSTChannelRolePermissionBody,
    POSTChannelUserPermissionBody
} from "../Constants";
import TypedCollection from "../util/TypedCollection";
import { JSONTextChannel } from "../types/json";

/** Represents a guild channel. */
export class TextChannel extends GuildChannel {
    /** Cached messages. */
    messages: TypedCollection<string, APIChatMessage, Message<AnyTextableChannel>>;
    /**
     * @param data raw data
     * @param client client
     */
    constructor(data: APIGuildChannel, client: Client){
        super(data, client);
        this.messages = new TypedCollection(Message, client, client.params.collectionLimits?.messages);
        this.update(data);
    }

    /** Create a message in this channel.
     * @param options Message options.
     */
    async createMessage(options: APIMessageOptions): Promise<Message<TextChannel>>{
        return this.client.rest.channels.createMessage<TextChannel>(this.id, options);
    }

    /** Edit a message from this channel.
     * @param options Message options.
     */
    async editMessage(messageID: string, options: EditMessageOptions): Promise<Message<TextChannel>>{
        return this.client.rest.channels.editMessage<TextChannel>(this.id, messageID, options);
    }

    /** Delete a message from this channel.
     * @param options Message options.
     */
    async deleteMessage(messageID: string): Promise<void> {
        return this.client.rest.channels.deleteMessage(this.id, messageID);
    }

    /** Create Channel Role Permissions
     * @param roleID Role ID.
     * @param options Channel Role Permissions options.
     */
    async createRolePermissions(roleID: number, options: POSTChannelRolePermissionBody): Promise<ChannelRolePermission> {
        return this.client.rest.channels.createChannelRolePermission(this.guildID, this.id, roleID, options);
    }

    /** Get Channel Role Permissions
     * @param roleID Role ID.
     */
    async getRolePermissions(roleID: number): Promise<ChannelRolePermission> {
        return this.client.rest.channels.getChannelRolePermission(this.guildID, this.id, roleID);
    }

    /** Get Channel Role Permissions
     */
    async getRolesPermissions(): Promise<Array<ChannelRolePermission>> {
        return this.client.rest.channels.getChannelRolesPermission(this.guildID, this.id);
    }

    /** Create Channel Role Permissions
     * @param roleID Role ID.
     * @param options Channel Role Permissions options.
     */
    async editRolePermissions(roleID: number, options: PATCHChannelRolePermissionBody): Promise<ChannelRolePermission> {
        return this.client.rest.channels.editChannelRolePermission(this.guildID, this.id, roleID, options);
    }

    /** Delete Channel Role Permissions
     * @param roleID Role ID.
     */
    async deleteRolePermissions(roleID: number): Promise<void> {
        return this.client.rest.channels.deleteChannelRolePermission(this.guildID, this.id, roleID);
    }

    /** Create Channel User Permissions
     * @param userID Member ID.
     * @param options Channel Role Permissions options.
     */
    async createUserPermissions(userID: string, options: POSTChannelUserPermissionBody): Promise<ChannelUserPermission> {
        return this.client.rest.channels.createChannelUserPermission(this.guildID, this.id, userID, options);
    }

    /** Get Channel User Permissions
     * @param userID user ID.
     */
    async getUserPermissions(userID: string): Promise<ChannelUserPermission> {
        return this.client.rest.channels.getChannelUserPermission(this.guildID, this.id, userID);
    }

    /** Get Channel Users Permissions
     */
    async getUsersPermissions(): Promise<Array<ChannelUserPermission>> {
        return this.client.rest.channels.getChannelUsersPermission(this.guildID, this.id);
    }

    /** Edit Channel User Permissions
     * @param userID user ID.
     * @param options Channel Role Permissions options.
     */
    async editUserPermissions(userID: string, options: PATCHChannelRolePermissionBody): Promise<ChannelUserPermission> {
        return this.client.rest.channels.editChannelUserPermission(this.guildID, this.id, userID, options);
    }

    /** Delete Channel Role Permissions
     * @param roleID Role ID.
     */
    async deleteUserPermissions(userID: string): Promise<void> {
        return this.client.rest.channels.deleteChannelUserPermission(this.guildID, this.id, userID);
    }

    override toJSON(): JSONTextChannel {
        return {
            ...super.toJSON(),
            messages: this.messages.map(message => message.toJSON())
        };
    }
}
