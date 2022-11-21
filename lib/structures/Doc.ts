/** @module Doc */
import { Client } from "./Client";
import { Member } from "./Member";
import { Base } from "./Base";

import { User } from "./User";
import { APIDoc, APIMentions } from "../Constants";
import { EditDocOptions } from "../types/doc";

/** Doc represents an item of a "Docs" channel. */
export class Doc extends Base {
    /** Guild/server id */
    guildID: string;
    /** ID of the 'docs' channel. */
    channelID: string;
    /** Doc name */
    name: string;
    /** Content of the doc */
    content: string;
    /** Doc mentions  */
    mentions: APIMentions;
    /** When the doc has been created. */
    createdAt: Date;
    /** ID of the member who created this doc. */
    memberID: string;
    /** When the doc has been updated. */
    editedTimestamp: Date | null;
    /** ID of the member who updated the doc. */
    updatedBy: string | null;

    /**
     * @param data raw data
     * @param client client
     */
    constructor(data: APIDoc, client: Client) {
        super(data.id, client);
        this.guildID = data.serverId;
        this.channelID = data.channelId;
        this.name = data.title ?? null;
        this.content = data.content ?? null;
        this.mentions = data.mentions ?? {};
        this.createdAt = new Date(data.createdAt);
        this.memberID = data.createdBy;
        this.editedTimestamp = data.updatedAt ? new Date(data.updatedAt) : null;
        this.updatedBy = data.updatedBy ?? null;
    }

    /** Retrieve the member who executed this action.
     * Note: If this doc has been edited, the updatedBy id will be used to get you the member.
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

    /** Edit this doc.
     * @param options Edit options.
     */
    async edit(options: EditDocOptions): Promise<Doc> {
        return this.client.rest.channels.editDoc(this.channelID, this.id as number, options);
    }

    /** Delete this doc. */
    async delete(): Promise<void> {
        return this.client.rest.channels.deleteDoc(this.channelID, this.id as number);
    }
}
