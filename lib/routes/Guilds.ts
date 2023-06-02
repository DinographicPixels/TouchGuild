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
    PATCHChannelResponse,
    POSTGuildBanResponse,
    GETGuildMembersResponse,
    APIGuildMember,
    GETGuildBanResponse,
    GETGuildBansResponse,
    GETGuildRoleResponse,
    GETGuildRolesResponse,
    GETGuildGroupsResponse,
    GETGuildGroupResponse,
    POSTGuildGroupBody,
    POSTGuildGroupResponse,
    PATCHGuildGroupBody,
    PATCHGuildGroupResponse,
    POSTGuildRoleBody,
    POSTGuildRoleResponse,
    PATCHGuildRoleBody
} from "../Constants";
import { AnyChannel, CreateChannelOptions, EditChannelOptions } from "../types/channel";
import { EditWebhookOptions } from "../types/webhooks";
import { EditMemberOptions } from "../types/guilds";
import { BannedMember } from "../structures/BannedMember";
import { GuildRole } from "../structures/GuildRole";
import { GuildGroup } from "../structures/GuildGroup";

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
        }).then(data => this.#manager.client.util.updateGuild(data.server));
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
     * @param memberID The ID of the Guild Member to get.
     */
    async getMember(guildID: string, memberID: string): Promise<Member> {
        return this.#manager.authRequest<GETGuildMemberResponse>({
            method: "GET",
            path:   endpoints.GUILD_MEMBER(guildID, memberID)
        }).then(data => this.#manager.client.util.updateMember(guildID, memberID, data.member));
    }

    /** This method is used to get a list of guild member.
     * @param guildID ID of the guild to get members.
     */
    async getMembers(guildID: string): Promise<Array<Member>> {
        return this.#manager.authRequest<GETGuildMembersResponse>({
            method: "GET",
            path:   endpoints.GUILD_MEMBERS(guildID)
        }).then(data => data.members.map(d => this.#manager.client.util.updateMember(guildID, d.user.id, d as APIGuildMember)));
    }

    /** Get a ban.
     * @param guildID ID of the guild.
     * @param memberID ID of the banned member.
     */
    async getBan(guildID: string, memberID: string): Promise<BannedMember> {
        return this.#manager.authRequest<GETGuildBanResponse>({
            method: "GET",
            path:   endpoints.GUILD_BAN(guildID, memberID)
        }).then(data => new BannedMember(guildID, data.serverMemberBan, this.#manager.client));
    }

    /** This method is used to get a list of guild ban.
     * @param guildID ID of the guild.
     */
    async getBans(guildID: string): Promise<Array<BannedMember>> {
        return this.#manager.authRequest<GETGuildBansResponse>({
            method: "GET",
            path:   endpoints.GUILD_BANS(guildID)
        }).then(data => data.serverMemberBans.map(d => new BannedMember(guildID, d, this.#manager.client)));
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

    /** Edit a member.
     * @param guildID ID of the guild the member is in.
     * @param memberID ID of the the member to edit.
     * @param options Edit options.
     */
    async editMember(guildID: string, memberID: string, options: EditMemberOptions): Promise<void> {
        if (options.nickname) {
            return this.#manager.authRequest<void>({
                method: "PUT",
                path:   endpoints.MEMBER_NICKNAME(guildID, memberID),
                json:   {
                    nickname: options.nickname
                }
            });
        } else if (!options.nickname) {
            return this.#manager.authRequest<void>({
                method: "DELETE",
                path:   endpoints.MEMBER_NICKNAME(guildID, memberID)
            });
        }
    }

    /** Remove a member from a guild.
     * @param guildID The ID of the guild the member is in.
     * @param memberID The ID of the member to kick.
     */
    async removeMember(guildID: string, memberID: string): Promise<void> {
        return this.#manager.authRequest<void>({
            method: "DELETE",
            path:   endpoints.GUILD_MEMBER(guildID, memberID)
        });
    }

    /** Ban a guild member.
     * @param guildID ID of the guild the member is in.
     * @param memberID ID of the member to ban.
     * @param reason The reason of the ban.
     */
    async createBan(guildID: string, memberID: string, reason?: string): Promise<BannedMember> {
        return this.#manager.authRequest<POSTGuildBanResponse>({
            method: "POST",
            path:   endpoints.GUILD_BAN(guildID, memberID),
            json:   { reason }
        }).then(data => new BannedMember(guildID, data.serverMemberBan, this.#manager.client));
    }

    /** Unban a guild member.
     * @param guildID ID of the guild the member was in.
     * @param memberID ID of the member to unban.
     */
    async removeBan(guildID: string, memberID: string): Promise<void> {
        return this.#manager.authRequest<void>({
            method: "DELETE",
            path:   endpoints.GUILD_BAN(guildID, memberID)
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
    async createChannel<T extends AnyChannel = AnyChannel>(guildID: string, name: string, type: APIChannelCategories, options?: CreateChannelOptions): Promise<T> {
        if (!guildID) throw new Error("guildID is a required parameter.");
        if (!name) throw new Error("name parameter is a required parameter.");
        if (!type) type = "chat";
        if (options?.categoryID && options?.groupID) throw new Error("Only one channel location is needed, two are defined at the same time. [categoryID, groupID]");
        return this.#manager.authRequest<POSTChannelResponse>({
            method: "POST",
            path:   endpoints.CHANNELS(),
            json:   {
                name,
                topic:      options?.description,
                isPublic:   options?.isPublic,
                type,
                serverId:   guildID,
                groupId:    options?.groupID,
                categoryId: options?.categoryID
            }
        }).then(data => Channel.from<T>(data.channel, this.#manager.client));
    }

    /** Edit a channel.
     * @param channelID ID of the channel to edit.
     * @param options Channel edit options.
     */
    async editChannel<T extends AnyChannel = AnyChannel>(channelID: string, options: EditChannelOptions): Promise<T> {
        if (!channelID) throw new Error("channelID is a required parameter.");
        return this.#manager.authRequest<PATCHChannelResponse>({
            method: "PATCH",
            path:   endpoints.CHANNEL(channelID),
            json:   {
                name:     options.name,
                topic:    options.description,
                isPublic: options.isPublic
            }
        }).then(data => Channel.from<T>(data.channel, this.#manager.client));
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

    /**
     * Get every guild roles from a guild.
     * @param guildID ID of the guild where roles are.
     */
    async getRoles(guildID: string): Promise<Array<GuildRole>> {
        return this.#manager.authRequest<GETGuildRolesResponse>({
            method: "GET",
            path:   endpoints.GUILD_ROLES(guildID)
        }).then(data => data.roles.map(role => this.#manager.client.util.updateRole(role)));
    }

    /**
     * Get a guild role.
     * @param guildID ID of the guild where the role is.
     * @param roleID ID of the role to get.
     */
    async getRole(guildID: string, roleID: number): Promise<GuildRole> {
        return this.#manager.authRequest<GETGuildRoleResponse>({
            method: "GET",
            path:   endpoints.GUILD_ROLE(guildID, roleID)
        }).then(data => this.#manager.client.util.updateRole(data.role));
    }

    /**
     * Create a guild role.
     * @param guildID ID of the server you want to create the role in.
     * @param options Create options
     */
    async createRole(guildID: string, options: POSTGuildRoleBody): Promise<GuildRole> {
        return this.#manager.authRequest<POSTGuildRoleResponse>({
            method: "POST",
            path:   endpoints.GUILD_ROLES(guildID),
            json:   options
        }).then(data => this.#manager.client.util.updateRole(data.role));
    }

    /**
     * Edit a guild role.
     * @param guildID ID of the server
     * @param roleID ID of the role to edit
     * @param options Edit options
     */
    async editRole(guildID: string, roleID: number, options: PATCHGuildRoleBody): Promise<GuildRole> {
        return this.#manager.authRequest<POSTGuildRoleResponse>({
            method: "PATCH",
            path:   endpoints.GUILD_ROLE(guildID, roleID),
            json:   options
        }).then(data => this.#manager.client.util.updateRole(data.role));
    }

    /**
     * Delete a guild role.
     * @param guildID ID of the guild where the role to delete is in
     * @param roleID ID of the role to delete
     */
    async deleteRole(guildID: string, roleID: number): Promise<void> {
        return this.#manager.authRequest<void>({
            method: "DELETE",
            path:   endpoints.GUILD_ROLE(guildID, roleID)
        });
    }

    /**
     * Get guild groups.
     * @param guildID ID of the guild.
     */
    async getGroups(guildID: string): Promise<Array<GuildGroup>> {
        return this.#manager.authRequest<GETGuildGroupsResponse>({
            method: "GET",
            path:   endpoints.GUILD_GROUPS(guildID)
        }).then(data => data.groups.map(group => this.#manager.client.util.updateGuildGroup(group)));
    }

    /**
     * Get a guild group.
     * @param guildID ID of the guild.
     * @param groupID ID of the group to get.
     */
    async getGroup(guildID: string, groupID: string): Promise<GuildGroup> {
        return this.#manager.authRequest<GETGuildGroupResponse>({
            method: "GET",
            path:   endpoints.GUILD_GROUP(guildID, groupID)
        }).then(data => this.#manager.client.util.updateGuildGroup(data.group));
    }

    /**
     * Create a guild group.
     * @param guildID The ID of the guild to create a group in.
     * @param options Create options
     */
    async createGroup(guildID: string, options: POSTGuildGroupBody): Promise<GuildGroup> {
        return this.#manager.authRequest<POSTGuildGroupResponse>({
            method: "POST",
            path:   endpoints.GUILD_GROUPS(guildID),
            json:   options
        }).then(data => this.#manager.client.util.updateGuildGroup(data.group));
    }

    /**
     * Edit a guild group.
     * @param guildID The ID of the guild where the group to edit is in
     * @param groupID The ID of the group to edit.
     * @param options Edit options
     */
    async editGroup(guildID: string, groupID: string, options: PATCHGuildGroupBody): Promise<GuildGroup> {
        return this.#manager.authRequest<PATCHGuildGroupResponse>({
            method: "POST",
            path:   endpoints.GUILD_GROUP(guildID, groupID),
            json:   options
        }).then(data => this.#manager.client.util.updateGuildGroup(data.group));
    }

    /**
     * Delete a guild group
     * @param guildID ID of the guild where the group is in.
     * @param groupID ID of the group to delete.
     */
    async deleteGroup(guildID: string, groupID: string): Promise<void> {
        return this.#manager.authRequest<void>({
            method: "DELETE",
            path:   endpoints.GUILD_GROUP(guildID, groupID)
        });
    }

}
