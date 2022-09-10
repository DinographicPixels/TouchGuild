import { Client } from './Client';
import { Member } from './Member';
export declare class ListItem {
    /** Raw data */
    _data: any;
    /** Client */
    _client: Client;
    /** ID of the doc */
    id: string;
    /** Guild/server id */
    guildID: string;
    /** ID of the 'docs' channel. */
    channelID: string;
    /** Content of the doc */
    content: string;
    /**  */
    mentions: MentionsType;
    /** Timestamp (unix epoch time) of the list item's creation. */
    _createdAt: number | null;
    /** ID of the member who created the doc. */
    memberID: string;
    /** ID of the webhook that created the list item (if it was created by a webhook) */
    webhookID: string | null;
    /** Timestamp (unix epoch time) of when the item was updated. (if updated) */
    _updatedAt: number | null;
    /** ID of the member who updated the doc. (if updated) */
    updatedBy: string;
    /** The ID of the parent list item if this list item is nested */
    parentListItemID: string | null;
    /** Timestamp (unix epoch time) of the list item completion */
    _completedAt: number | null;
    /** ID of the member that completed the item, if completed. */
    completedBy: string | null;
    constructor(data: any, client: any);
    get note(): ListItemNoteTypes | null;
    /** Member who executed this action */
    get member(): Member | void;
    get createdAt(): Date | null;
    get updatedAt(): Date | null;
    get completedAt(): Date | null;
    edit(content: string, note?: {
        content: string;
    }): Promise<ListItem>;
    delete(): Promise<void>;
    complete(): Promise<void>;
    uncomplete(): Promise<void>;
}
export declare type ListItemNoteTypes = {
    createdAt: number;
    createdBy: string;
    updatedAt?: number;
    updatedBy?: string;
    mentions?: MentionsType;
    content: string;
};
export declare type MentionsType = {
    users?: Array<object>;
    channels?: Array<object>;
    roles?: Array<object>;
    everyone?: boolean;
    here?: boolean;
};
