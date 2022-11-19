/** @module ListItem */
import { Client } from "./Client";
import { Member } from "./Member";
import { Base } from "./Base";
import { User } from "./User";
import { ListItemNoteTypes } from "../types/types";
import { APIListItem, APIMentions } from "../Constants";
import { ListItemEditOptions } from "../types/listItem";

/** Represents an item of a "Lists" channel. */
export class ListItem extends Base {
    /** Raw data */
    _data: APIListItem;
    /** Guild/server id */
    guildID: string;
    /** ID of the 'docs' channel. */
    channelID: string;
    /** Content of the doc */
    content: string;
    mentions: APIMentions | null;
    /** Timestamp (unix epoch time) of the list item's creation. */
    _createdAt: number | null;
    /** ID of the member who created the doc. */
    memberID: string;
    /** ID of the webhook that created the list item (if it was created by a webhook) */
    webhookID: string | null;
    /** Timestamp (unix epoch time) of when the item was updated. (if updated) */
    _updatedAt: number | null;
    /** ID of the member who updated the doc. (if updated) */
    updatedBy: string | null;
    /** The ID of the parent list item if this list item is nested */
    parentListItemID: string | null;
    /** Timestamp (unix epoch time) of the list item completion */
    _completedAt: number | null;
    /** ID of the member that completed the item, if completed. */
    completedBy: string | null;

    /**
     * @param data raw data.
     * @param client client.
     */
    constructor(data: APIListItem, client: Client){
        super(data.id, client);
        this._data = data;
        this.guildID = data.serverId;
        this.channelID = data.channelId;
        this.content = data.message ?? null;
        this.mentions = data.mentions ??  null;
        this._createdAt = data.createdAt ? Date.parse(data.createdAt) : null;
        this.memberID = data.createdBy;
        this.webhookID = data.createdByWebhookId ?? null;
        this._updatedAt = data.updatedAt ? Date.parse(data.updatedAt) : null;
        this.updatedBy = data.updatedBy ?? null;
        this.parentListItemID = data.parentListItemId ?? null;
        this._completedAt = data.completedAt ? Date.parse(data.completedAt) : null;
        this.completedBy = data.completedBy ?? null;
    }

    get note(): ListItemNoteTypes | null {
        return this._data.note ? {
            createdAt: this._data.note.createdAt ? Date.parse(this._data.note.createdAt) : null,
            createdBy: this._data.note.createdBy,
            updatedAt: this._data.note.updatedAt ? Date.parse(this._data.note.updatedAt) : null,
            updatedBy: this._data.note.updatedBy ?? null,
            mentions:  this._data.note.mentions ?? null,
            content:   this._data.note.content
        } as ListItemNoteTypes : null;
    }

    /** Retrieve the member who executed this action.
     * Note: If the item has been edited, the updatedAt id will be used to get you the member.
     */
    get member(): Member | User | Promise<Member> | undefined {
        if (this.client.cache.members.get(this.updatedBy ?? this.memberID)){
            return this.client.cache.members.get(this.updatedBy ?? this.memberID);
        } else if (this.client.cache.users.get(this.updatedBy ?? this.memberID)){
            return this.client.cache.users.get(this.updatedBy ?? this.memberID);
        } else if (this.guildID){
            return this.client.rest.guilds.getMember(this.guildID, this.updatedBy ?? this.memberID);
        } else throw new Error("ERROR: Couldn't get member, failed to retrieve member.");
    }

    /** Date of the item's creation. */
    get createdAt(): Date | null {
        return this._createdAt ? new Date(this._createdAt) : null;
    }

    /** Date of the last item's edition, if updated. */
    get updatedAt(): Date | null {
        return this._updatedAt ? new Date(this._updatedAt) : null;
    }

    /** Date of the item's completion, if completed. */
    get completedAt(): Date | null {
        return this._completedAt ? new Date(this._completedAt) : null;
    }

    /** Edit this item.
     * @param content Item content
     * @param note Add/edit a note to this item.
     */
    async edit(content: string, note?: ListItemEditOptions): Promise<ListItem> {
        return this.client.rest.channels.editListItem(this.channelID, this.id as string, content, note);
    }

    /** Delete this item. */
    async delete(): Promise<void> {
        return this.client.rest.channels.deleteListItem(this.channelID, this.id as string);
    }

    /** Set this item as "complete". */
    async complete(): Promise<void> {
        return this.client.rest.channels.completeListItem(this.channelID, this.id as string);
    }

    /** Set this item as "uncomplete". */
    async uncomplete(): Promise<void> {
        return this.client.rest.channels.uncompleteListItem(this.channelID, this.id as string);
    }
}
