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
    /** Timestamp of the webhook's creation. */
    _createdAt: number;
    /** ID of the webhook's owner. */
    createdBy: string;
    /** Timestamp of the webhook's deletion, if deleted. */
    _deletedAt: number | null;
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
        this._createdAt = Date.parse(data.createdAt);
        this._deletedAt = data.deletedAt ? Date.parse(data.deletedAt) : null;
        this.createdBy = data.createdBy;
        this.token = data.token ?? null;
    }

    /** Date of the webhook's creation. */
    get createdAt(): Date{
        return new Date(this._createdAt);
    }

    /** Date of the webhook's deletion, if deleted. */
    get deletedAt(): Date|null{
        return this._deletedAt ? new Date(this._deletedAt) : null;
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
