import { Client } from "./Client";
import { Message } from "./Message";

import * as endpoints from "../rest/endpoints";

import {
    PATCHChannelBody as ChannelEditTypes,
    APIMessageOptions,
    APIGuildChannel,
    POSTChannelMessageResponse,
    PATCHChannelResponse
} from "guildedapi-types.ts/v1";

/** Guild Channel component, with all its methods and declarations */
export class Channel {
    /** Raw data */
    data: APIGuildChannel;
    /** Client */
    private _client: Client;
    /** Channel ID */
    id: string;
    /** Channel type */
    type: string;
    /** Channel name */
    name: string;
    /** Channel topic/description */
    topic: string | null;
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

    constructor(data: APIGuildChannel, client: Client){
        this.data = data;
        this._client = client;

        this.id = data.id;
        this.type = data.type;
        this.name = data.name;
        this.topic = data.topic ?? null;
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

    get createdAt(): Date{
        return new Date(this._createdAt);
    }

    get updatedAt(): Date|null{
        return this._updatedAt !== null ? new Date(this._updatedAt) : null;
    }

    get archivedAt(): Date|null{
        return this._archivedAt !== null ? new Date(this._archivedAt) : null;
    }

    /** Create a message in the channel. */
    async createMessage(options: APIMessageOptions): Promise<Message>{
        if (typeof options !== "object") throw new TypeError("message options should be an object.");
        const bodyContent = JSON.stringify(options);

        const response = await this._client.calls.post(endpoints.CHANNEL_MESSAGES(this.id), this._client.token, bodyContent);
        return new Message((response["data" as keyof object] as POSTChannelMessageResponse).message, this._client);
    }

    /** Delete the channel. */
    async delete(): Promise<void>{
        await this._client.calls.delete(endpoints.CHANNEL(this.id), this._client.token);
    }

    /** Edit the channel. */
    async edit(options: ChannelEditTypes): Promise<Channel>{
        const response = await this._client.calls.patch(endpoints.CHANNEL(this.id), this._client.token, JSON.stringify(options));
        return new Channel((response["data" as keyof object] as PATCHChannelResponse).channel, this._client);
    }
}


export { APIChannelCategories, PATCHChannelBody as ChannelEditTypes } from "guildedapi-types.ts/v1";
