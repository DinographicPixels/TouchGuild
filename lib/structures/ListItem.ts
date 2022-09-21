import { Client } from './Client';
import * as endpoints from '../rest/endpoints';

import { call } from '../Utils';
import { Member } from './Member';
const calls = new call();

import { MentionsType, ListItemNoteTypes } from '../Types';

export class ListItem {
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
    mentions: MentionsType
    /** Timestamp (unix epoch time) of the list item's creation. */
    _createdAt: number|null; 
    /** ID of the member who created the doc. */
    memberID: string; 
    /** ID of the webhook that created the list item (if it was created by a webhook) */
    webhookID: string|null
    /** Timestamp (unix epoch time) of when the item was updated. (if updated) */
    _updatedAt: number|null; 
    /** ID of the member who updated the doc. (if updated) */
    updatedBy: string;
    /** The ID of the parent list item if this list item is nested */
    parentListItemID: string|null;
    /** Timestamp (unix epoch time) of the list item completion */
    _completedAt: number|null;
    /** ID of the member that completed the item, if completed. */
    completedBy: string|null;

    constructor(data: any, client:any){
        this._data = data;
        this._client = client;

        this.id = data.id;
        this.guildID = data.serverId;
        this.channelID = data.channelId;
        this.content = data.message ?? null;
        this.mentions = data.mentions ??  null;
        this._createdAt = data.createdAt ? Date.parse(data.createdAt): null;
        this.memberID = data.createdBy;
        this.webhookID = data.createdByWebhookId ?? null;
        this._updatedAt = data.updatedAt ? Date.parse(data.updatedAt): null;
        this.updatedBy = data.updatedBy ?? null;
        this.parentListItemID = data.parentListItemId ?? null;
        this._completedAt = data.completedAt ? Date.parse(data.completedAt): null;
        this.completedBy = data.completedBy ?? null;
    }

    get note(){
        if (this._data.note){
            return {
                createdAt: this._data.note.createdAt ? Date.parse(this._data.note.createdAt): null,
                createdBy: this._data.note.createdBy,
                updatedAt: this._data.note.updatedAt ? Date.parse(this._data.note.updatedAt): null,
                updatedBy: this._data.note.updatedBy ?? null,
                mentions: this._data.note.mention ?? null,
                content: this._data.note.content
            } as ListItemNoteTypes
        }else return null;
    }

    /** Member who executed this action */
    get member(): Member|void{
        if (this.updatedBy){
            return calls.syncGetMember(this.guildID, this.updatedBy, this._client) as Member;
        }else if (this.memberID && this.memberID !== 'Ann6LewA') {
            return calls.syncGetMember(this.guildID, this.memberID, this._client) as Member;
        }else console.log("Couldn't get Member, List item has been probably created by a webhook.");
    }

    get createdAt(): Date|null{
        return this._createdAt ? new Date(this._createdAt): null;
    }

    get updatedAt(): Date|null{
        return this._updatedAt ? new Date(this._updatedAt): null;
    }

    get completedAt(): Date|null{
        return this._completedAt ? new Date(this._completedAt): null;
    }

    async edit(content: string, note?: {content: string}): Promise<ListItem>{
        let response:any = await calls.put(endpoints.LIST_ITEM(this.channelID, this.id), this._client.token, {message: content, note});
        return new ListItem(response.data.listItem, this._client);
    }

    async delete(): Promise<void>{
        await calls.delete(endpoints.LIST_ITEM(this.channelID, this.id), this._client.token);
    }

    async complete(): Promise<void>{
        await calls.post(endpoints.LIST_ITEM_COMPLETE(this.channelID, this.id), this._client.token, {});
    }

    async uncomplete(): Promise<void>{
        await calls.delete(endpoints.LIST_ITEM_COMPLETE(this.channelID, this.id), this._client.token);
    }
}