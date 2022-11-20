/** @module Routes/Guilds */
import type { RESTManager } from "../rest/RESTManager";
import * as endpoints from "../rest/endpoints";
import { Guild } from "../structures/Guild";
import { Webhook } from "../structures/Webhook";
import { Member } from "../structures/Member";
import { Channel } from "../structures/Channel";
import {
    APIChannelCategories,
    GETGuildMemberResponse,
    GETGuildResponse,
    GETGuildWebhookResponse,
    GETGuildWebhooksResponse,
    POSTChannelResponse,
    POSTGuildMemberXPBody,
    POSTGuildMemberXPResponse,
    POSTGuildRoleXPBody,
    POSTGuildWebhookResponse,
    PUTGuildMemberXPBody,
    PUTGuildMemberXPResponse,
    PUTGuildWebhookResponse,
    PATCHChannelResponse
} from "../Constants";
import { CreateChannelOptions, EditChannelOptions } from "../types/channel";
import { EditWebhookOptions } from "../types/webhooks";

export class Guilds {
    #manager: RESTManager;
    constructor(manager: RESTManager){
        this.#manager = manager;
    }

    /** This method is used to get a specific Guild.
     *
     * Note: Guild = Server
     * @param guildID The ID of the guild you'd like to get.
     */
    async getGuild(guildID: string): Promise<Guild> {
        return this.#manager.authRequest<GETGuildResponse>({
            method: "GET",
            path:   endpoints.GUILD(guildID)
        }).then(data => new Guild(data.server, this.#manager.client));
    }

    /** This method is used to get a specific webhook.
     * @param guildID ID of a guild.
     * @param webhookID ID of a webhook.
     */
    async getWebhook(guildID: string, webhookID: string): Promise<Webhook>{
        return this.#manager.authRequest<GETGuildWebhookResponse>({
            method: "GET",
            path:   endpoints.GUILD_WEBHOOK(guildID, webhookID)
        }).then(data => new Webhook(data.webhook, this.#manager.client));
    }

    /** This method is used to get a list of Webhook.
     * @param guildID ID of a guild.
     * @param channelID ID of a channel.
     */
    async getWebhooks(guildID: string, channelID: string): Promise<Array<Webhook>>{
        const query = new URLSearchParams();
        if (channelID){
            query.set("channelId", channelID.toString());
        }
        return this.#manager.authRequest<GETGuildWebhooksResponse>({
            method: "GET",
            path:   endpoints.GUILD_WEBHOOKS(guildID),
            query
        }).then(data => data.webhooks.map(d => new Webhook(d, this.#manager.client)) as never);
    }

    /** This method is used to get a specific guild member.
     * @param guildID The ID of the Guild.
     * @param memberID The ID of the Guild Member you'd like to get.
     */
    async getMember(guildID: string, memberID: string): Promise<Member>{
        return this.#manager.authRequest<GETGuildMemberResponse>({
            method: "GET",
            path:   endpoints.GUILD_MEMBER(guildID, memberID)
        }).then(data => new Member(data.member, this.#manager.client, guildID));
    }

    /** Add a member to a group
     * @param groupID ID of a guild group.
     * @param memberID ID of a member.
     */
    async memberAddGroup(groupID: string, memberID: string): Promise<void> {
        return this.#manager.authRequest<void>({
            method: "PUT",
            path:   endpoints.GUILD_GROUP_MEMBER(groupID, memberID)
        });
    }

    /** Remove a member from a group
     * @param groupID ID of a guild group.
     * @param memberID ID of a member.
     */
    async memberRemoveGroup(groupID: string, memberID: string): Promise<void> {
        return this.#manager.authRequest<void>({
            method: "DELETE",
            path:   endpoints.GUILD_GROUP_MEMBER(groupID, memberID)
        });
    }

    /** Add a role to a member
     * @param guildID ID of a guild.
     * @param memberID ID of a member.
     * @param roleID ID of a role.
     */
    async memberAddRole(guildID: string, memberID: string, roleID: number): Promise<void> {
        return this.#manager.authRequest<void>({
            method: "PUT",
            path:   endpoints.GUILD_MEMBER_ROLE(guildID, memberID, roleID)
        });
    }

    /** Remove a role from a member
     * @param guildID ID of a guild.
     * @param memberID ID of a member.
     * @param roleID ID of a role.
     */
    async memberRemoveRole(guildID: string, memberID: string, roleID: number): Promise<void> {
        return this.#manager.authRequest<void>({
            method: "DELETE",
            path:   endpoints.GUILD_MEMBER_ROLE(guildID, memberID, roleID)
        });
    }

    /** Create a webhook
     * @param guildID ID of a guild.
     * @param channelID ID of a channel.
     * @param name Name of the new webhook.
     */
    async createWebhook(guildID: string, channelID: string, name: string): Promise<Webhook> {
        if (!guildID) throw new Error("You need to insert the guild id, guildID is not defined.");
        if (!channelID) throw new Error("You need to insert a webhook name.");
        if (!channelID) throw new Error("You need to insert a channelID.");
        return this.#manager.authRequest<POSTGuildWebhookResponse>({
            method: "POST",
            path:   endpoints.GUILD_WEBHOOKS(guildID),
            json:   { name, channelId: channelID }
        }).then(data => new Webhook(data.webhook, this.#manager.client));
    }

    /** Update a webhook
     * @param guildID ID of a guild.
     * @param webhookID ID of an existent webhook.
     * @param options Edit options.
     */
    async editWebhook(guildID: string, webhookID: string, options: EditWebhookOptions): Promise<Webhook> {
        if (typeof options !== "object") throw new Error("webhook options must be an object.");
        return this.#manager.authRequest<PUTGuildWebhookResponse>({
            method: "PUT",
            path:   endpoints.GUILD_WEBHOOK(guildID, webhookID),
            json:   options
        }).then(data => new Webhook(data.webhook, this.#manager.client));
    }

    /** Delete a webhook
     * @param guildID ID of a guild.
     * @param webhookID ID of an existent webhook.
     */
    async deleteWebhook(guildID: string, webhookID: string): Promise<void> {
        return this.#manager.authRequest<void>({
            method: "DELETE",
            path:   endpoints.GUILD_WEBHOOK(guildID, webhookID)
        });
    }

    /** Award a member using the built-in EXP system.
     * @param guildID ID of a guild.
     * @param memberID ID of a member.
     * @param amount Amount of experience.
     */
    async awardMember(guildID: string, memberID: string, amount: POSTGuildMemberXPBody["amount"]): Promise<number>{
        if (typeof amount !== "number") throw new TypeError("amount must be an integer/number.");
        return this.#manager.authRequest<POSTGuildMemberXPResponse>({
            method: "POST",
            path:   endpoints.GUILD_MEMBER_XP(guildID, memberID),
            json:   { amount }
        }).then(data => Number(data.total));
    }

    /** Set a member's xp using the built-in EXP system.
     * @param guildID ID of a guild.
     * @param memberID ID of a member.
     * @param amount Total amount of experience.
     */
    async setMemberXP(guildID: string, memberID: string, amount: PUTGuildMemberXPBody["total"]): Promise<number>{
        if (typeof amount !== "number") throw new TypeError("amount must be an integer/number.");
        return this.#manager.authRequest<PUTGuildMemberXPResponse>({
            method: "POST",
            path:   endpoints.GUILD_MEMBER_XP(guildID, memberID),
            json:   { total: amount }
        }).then(data => Number(data.total));
    }

    /** Award every members of a guild having a role using the built-in EXP system.
     * @param guildID ID of a guild.
     * @param roleID ID of a role.
     * @param amount Amount of experience.
     */
    async awardRole(guildID: string, roleID: number, amount: POSTGuildRoleXPBody["amount"]): Promise<void>{
        if (typeof amount !== "number") throw new TypeError("amount must be an integer/number.");
        return this.#manager.authRequest<void>({
            method: "POST",
            path:   endpoints.GUILD_MEMBER_ROLE_XP(guildID, roleID),
            json:   { amount }
        });
    }

    /** Create a channel in a specified guild.
     * @param guildID ID of a guild.
     * @param name Name of the new channel.
     * @param type Type of the new channel. (e.g: chat)
     * @param options New channel's additional options.
     */
    async createChannel(guildID: string, name: string, type: APIChannelCategories, options?: CreateChannelOptions): Promise<Channel> {
        if (!guildID) throw new Error("guildID is a required parameter.");
        if (!name) throw new Error("name parameter is a required parameter.");
        if (!type) type = "chat";
        if (options?.categoryID && options?.groupID) throw new Error("Only one channel location is needed, two are defined at the same time. [categoryID, groupID]");
        return this.#manager.authRequest<POSTChannelResponse>({
            method: "POST",
            path:   endpoints.CHANNELS(),
            json:   {
                name,
                topic:      options?.topic,
                isPublic:   options?.isPublic,
                type,
                serverId:   guildID,
                groupId:    options?.groupID,
                categoryId: options?.categoryID
            }
        }).then(data => new Channel(data.channel, this.#manager.client));
    }

    /** Edit a channel.
     * @param channelID ID of the channel to edit.
     * @param options Channel edit options.
     */
    async editChannel(channelID: string, options: EditChannelOptions): Promise<Channel> {
        if (!channelID) throw new Error("channelID is a required parameter.");
        return this.#manager.authRequest<PATCHChannelResponse>({
            method: "PATCH",
            path:   endpoints.CHANNEL(channelID),
            json:   options
        }).then(data => new Channel(data.channel, this.#manager.client));
    }

    /** Delete a channel.
     * @param channelID ID of the channel to delete.
     */
    async deleteChannel(channelID: string): Promise<void> {
        if (!channelID) throw new Error("channelID is a required parameter.");
        return this.#manager.authRequest<void>({
            method: "DELETE",
            path:   endpoints.CHANNEL(channelID)
        });
    }
}
