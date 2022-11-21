/** @module Channel */
import { Client } from "./Client";
import { Message } from "./Message";

import { Base } from "./Base";
import { CreateMessageOptions, EditChannelOptions } from "../types/channel";
import type { APIGuildChannel } from "../Constants";

/** Represents a guild channel. */
export class Channel extends Base {
    /** Channel type */
    type: string;
    /** Channel name */
    name: string;
    /** Channel description */
    description: string | null;
    /** When this channel was created. */
    createdAt: Date;
    /** ID of the member who created this channel. */
    creatorID: string;
    /** Timestamp at which this channel was last edited. */
    editedTimestamp: Date | null;
    /** Server ID */
    guildID: string;
    /** ID of the parent category. */
    parentID: string | null;
    /** ID of the category the channel is in. */
    categoryID: number | null;
    /** ID of the group the channel is in. */
    groupID: string;
    isPublic: boolean;
    /** ID of the member that archived the channel (if archived) */
    archivedBy: string | null;
    /** When the channel was last archived. */
    archivedAt: Date | null;

    /**
     * @param data raw data
     * @param client client
     */
    constructor(data: APIGuildChannel, client: Client){
        super(data.id, client);
        this.type = data.type;
        this.name = data.name;
        this.description = data.topic ?? null;
        this.createdAt = new Date(data.createdAt);
        this.creatorID = data.createdBy;
        this.editedTimestamp = data.updatedAt ? new Date(data.updatedAt) : null;
        this.guildID = data.serverId;
        this.parentID = data.parentId ?? null;
        this.categoryID = data.categoryId ?? null;
        this.groupID = data.groupId;
        this.isPublic = data.isPublic ?? false;
        this.archivedBy = data.archivedBy ?? null;
        this.archivedAt = data.archivedAt ? new Date(data.archivedAt) : null;
    }

    /** Create a message in the channel. */
    async createMessage(options: CreateMessageOptions): Promise<Message>{
        return this.client.rest.channels.createMessage(this.id as string, options);
    }

    /** Edit the channel. */
    async edit(options: EditChannelOptions): Promise<Channel>{
        return this.client.rest.guilds.editChannel(this.id as string, options);
    }

    /** Delete the channel. */
    async delete(): Promise<void>{
        return this.client.rest.guilds.deleteChannel(this.id as string);
    }
}
