/** @module Webhook */
import { Client } from "./Client";
import { Base } from "./Base";
import { APIWebhook } from "../Constants";
import { WebhookEditOptions } from "../types/webhook";

/** Represents a Guild or channel webhook. */
export class Webhook extends Base {
    /** ID of the guild, where the webhook comes from. */
    guildID: string;
    /** ID of the channel, where the webhook comes from. */
    channelID: string;
    /** Username of the webhook. */
    username: string;
    /** When the webhook was created. */
    createdAt: Date;
    /** ID of the webhook's owner. */
    ownerID: string;
    /** When the webhook was deleted. */
    deletedAt: Date | null;
    /** Token of the webhook. */
    token: string | null;

    /**
     * @param data raw data.
     * @param client client.
     */
    constructor(data: APIWebhook, client: Client){
        super(data.id, client);
        this.guildID = data.serverId;
        this.channelID = data.channelId;
        this.username = data.name;
        this.createdAt = new Date(data.createdAt);
        this.deletedAt = data.deletedAt ? new Date(data.deletedAt) : null;
        this.ownerID = data.createdBy;
        this.token = data.token ?? null;
    }

    /** Update the webhook. */
    async edit(options: WebhookEditOptions): Promise<Webhook>{
        return this.client.rest.guilds.editWebhook(this.guildID, this.id as string, options);
    }

    /** Delete the webhook. */
    async delete(): Promise<void>{
        return this.client.rest.guilds.deleteWebhook(this.guildID, this.id as string);
    }
}
