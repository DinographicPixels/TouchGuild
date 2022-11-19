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

    async getGuild(guildID: string): Promise<Guild> {
        return this.#manager.authRequest<GETGuildResponse>({
            method: "GET",
            path:   endpoints.GUILD(guildID)
        }).then(data => new Guild(data.server, this.#manager.client));
    }

    async getWebhook(guildID: string, webhookID: string): Promise<Webhook>{
        return this.#manager.authRequest<GETGuildWebhookResponse>({
            method: "GET",
            path:   endpoints.GUILD_WEBHOOK(guildID, webhookID)
        }).then(data => new Webhook(data.webhook, this.#manager.client));
    }

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

    async getMember(guildID: string, memberID: string): Promise<Member>{
        return this.#manager.authRequest<GETGuildMemberResponse>({
            method: "GET",
            path:   endpoints.GUILD_MEMBER(guildID, memberID)
        }).then(data => new Member(data.member, this.#manager.client, guildID));
    }

    async memberAddGroup(groupID: string, memberID: string): Promise<void> {
        return this.#manager.authRequest<void>({
            method: "PUT",
            path:   endpoints.GUILD_GROUP_MEMBER(groupID, memberID)
        });
    }

    async memberRemoveGroup(groupID: string, memberID: string): Promise<void> {
        return this.#manager.authRequest<void>({
            method: "DELETE",
            path:   endpoints.GUILD_GROUP_MEMBER(groupID, memberID)
        });
    }

    async memberAddRole(guildID: string, memberID: string, roleID: number): Promise<void> {
        return this.#manager.authRequest<void>({
            method: "PUT",
            path:   endpoints.GUILD_MEMBER_ROLE(guildID, memberID, roleID)
        });
    }

    async memberRemoveRole(guildID: string, memberID: string, roleID: number): Promise<void> {
        return this.#manager.authRequest<void>({
            method: "DELETE",
            path:   endpoints.GUILD_MEMBER_ROLE(guildID, memberID, roleID)
        });
    }

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

    async editWebhook(guildID: string, webhookID: string, options: EditWebhookOptions): Promise<Webhook> {
        if (typeof options !== "object") throw new Error("webhook options must be an object.");
        return this.#manager.authRequest<PUTGuildWebhookResponse>({
            method: "PUT",
            path:   endpoints.GUILD_WEBHOOK(guildID, webhookID),
            json:   options
        }).then(data => new Webhook(data.webhook, this.#manager.client));
    }

    async deleteWebhook(guildID: string, webhookID: string): Promise<void> {
        return this.#manager.authRequest<void>({
            method: "DELETE",
            path:   endpoints.GUILD_WEBHOOK(guildID, webhookID)
        });
    }

    async awardMember(guildID: string, memberID: string, amount: POSTGuildMemberXPBody["amount"]): Promise<number>{
        if (typeof amount !== "number") throw new TypeError("amount must be an integer/number.");
        return this.#manager.authRequest<POSTGuildMemberXPResponse>({
            method: "POST",
            path:   endpoints.GUILD_MEMBER_XP(guildID, memberID),
            json:   { amount }
        }).then(data => Number(data.total));
    }

    async setMemberXP(guildID: string, memberID: string, amount: PUTGuildMemberXPBody["total"]): Promise<number>{
        if (typeof amount !== "number") throw new TypeError("amount must be an integer/number.");
        return this.#manager.authRequest<PUTGuildMemberXPResponse>({
            method: "POST",
            path:   endpoints.GUILD_MEMBER_XP(guildID, memberID),
            json:   { total: amount }
        }).then(data => Number(data.total));
    }

    async awardRole(guildID: string, roleID: number, amount: POSTGuildRoleXPBody["amount"]): Promise<void>{
        if (typeof amount !== "number") throw new TypeError("amount must be an integer/number.");
        return this.#manager.authRequest<void>({
            method: "POST",
            path:   endpoints.GUILD_MEMBER_ROLE_XP(guildID, roleID),
            json:   { amount }
        });
    }

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

    async editChannel(channelID: string, options: EditChannelOptions): Promise<Channel> {
        if (!channelID) throw new Error("channelID is a required parameter.");
        return this.#manager.authRequest<PATCHChannelResponse>({
            method: "PATCH",
            path:   endpoints.CHANNEL(channelID),
            json:   options
        }).then(data => new Channel(data.channel, this.#manager.client));
    }

    async deleteChannel(channelID: string): Promise<void> {
        if (!channelID) throw new Error("channelID is a required parameter.");
        return this.#manager.authRequest<void>({
            method: "DELETE",
            path:   endpoints.CHANNEL(channelID)
        });
    }
}
