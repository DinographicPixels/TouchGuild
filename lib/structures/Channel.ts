/** @module Channel */
import { Client } from "./Client";
import { Message } from "./Message";

import { Base } from "./Base";
import { CreateMessageOptions, EditChannelOptions } from "../types/channel";
import type { APIGuildChannel } from "../Constants";

/** Represents a guild channel. */
export class Channel extends Base {
    /** Raw data */
    data: APIGuildChannel;
    /** Channel type */
    type: string;
    /** Channel name */
    name: string;
    /** Channel description */
    description: string | null;
    /** Timestamp (unix epoch time) of the channel's creation. */
    _createdAt: number;
    /** ID of the channel's creator. */
    memberID: string;
    /** Timestamp (unix epoch time) of the channel's edition. (if edited) */
    _updatedAt: number|null;
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
    /** Timestamp (unix epoch time) of when the channel has been archived. */
    _archivedAt: number|null;

    /**
     * @param data raw data
     * @param client client
     */
    constructor(data: APIGuildChannel, client: Client){
        super(data.id, client);
        this.data = data;
        this.type = data.type;
        this.name = data.name;
        this.description = data.topic ?? null;
        this._createdAt = Date.parse(data.createdAt);
        this.memberID = data.createdBy;
        this._updatedAt = data.updatedAt ? Date.parse(data.updatedAt) : null;
        this.guildID = data.serverId;
        this.parentID = data.parentId ?? null;
        this.categoryID = data.categoryId ?? null;
        this.groupID = data.groupId;
        this.isPublic = data.isPublic ?? false;
        this.archivedBy = data.archivedBy ?? null;
        this._archivedAt = data.archivedAt ? Date.parse(data.archivedAt) : null;
    }

    /** Date of the channel's creation. */
    get createdAt(): Date{
        return new Date(this._createdAt);
    }

    /** Date of the channel's last edition, if updated. */
    get updatedAt(): Date|null{
        return this._updatedAt !== null ? new Date(this._updatedAt) : null;
    }

    /** Date of when the channel got archived, if archived. */
    get archivedAt(): Date|null{
        return this._archivedAt !== null ? new Date(this._archivedAt) : null;
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
