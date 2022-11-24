/** @module ListItem */
import { Client } from "./Client";
import { Member } from "./Member";
import { Base } from "./Base";
import { ListItemNoteTypes, Uncached } from "../types/types";
import { APIListItem, APIMentions } from "../Constants";
import { ListItemEditOptions } from "../types/listItem";

/** Represents an item of a "Lists" channel. */
export class ListItem extends Base {
    /** Raw data */
    #data: APIListItem;
    /** Guild/server id */
    guildID: string;
    /** ID of the 'docs' channel. */
    channelID: string;
    /** Content of the doc */
    content: string;
    mentions: APIMentions | null;
    /** When the item was created. */
    createdAt: Date | null;
    /** ID of the member who created the doc. */
    creatorID: string;
    /** ID of the webhook that created the list item (if it was created by a webhook) */
    webhookID: string | null;
    /** Timestamp at which the item was updated. */
    editedTimestamp: Date | null;
    /** ID of the member who updated the doc. (if updated) */
    updatedBy: string | null;
    /** The ID of the parent list item if this list item is nested */
    parentListItemID: string | null;
    /** When the list item was marked as "completed". */
    completedAt: Date | null;
    /** ID of the member that completed the item, if completed. */
    completedBy: string | null;

    /**
     * @param data raw data.
     * @param client client.
     */
    constructor(data: APIListItem, client: Client){
        super(data.id, client);
        this.#data = data;
        this.guildID = data.serverId;
        this.channelID = data.channelId;
        this.content = data.message ?? null;
        this.mentions = data.mentions ??  null;
        this.createdAt = data.createdAt ? new Date(data.createdAt) : null;
        this.creatorID = data.createdBy;
        this.webhookID = data.createdByWebhookId ?? null;
        this.editedTimestamp = data.updatedAt ? new Date(data.updatedAt) : null;
        this.updatedBy = data.updatedBy ?? null;
        this.parentListItemID = data.parentListItemId ?? null;
        this.completedAt = data.completedAt ? new Date(data.completedAt) : null;
        this.completedBy = data.completedBy ?? null;
    }

    get note(): ListItemNoteTypes | null {
        return this.#data.note ? {
            createdAt:       new Date(this.#data.note.createdAt),
            memberID:        this.#data.note.createdBy,
            editedTimestamp: this.#data.note.updatedAt ? new Date(this.#data.note.updatedAt) : null,
            editedBy:        this.#data.note.updatedBy ?? null,
            mentions:        this.#data.note.mentions ?? null,
            content:         this.#data.note.content
        } as ListItemNoteTypes : null;
    }

    /** Retrieve the member who executed this action, if cached. */
    get member(): Member | Uncached {
        return this.client.cache.members.get(this.#data.updatedBy ?? this.#data.createdBy) ?? { id: this.#data.updatedBy ?? this.#data.createdBy };
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
