import { Client } from './Client';
import { Member } from './Member';
import { MentionsType } from '../Types';
export declare class Doc {
    /** Raw data */
    data: any;
    /** Client */
    client: Client;
    /** ID of the doc */
    id: number;
    /** Guild/server id */
    guildID: string;
    /** ID of the 'docs' channel. */
    channelID: string;
    /** Doc title/name */
    title: string;
    /** Doc title/name */
    name: string;
    /** Content of the doc */
    content: string;
    /** Doc mentions  */
    mentions: MentionsType;
    /** Timestamp (unix epoch time) of the doc's creation. */
    _createdAt: number | null;
    /** ID of the member who created the doc. */
    memberID: string;
    /** Timestamp (unix epoch time) of when the doc was updated. (if updated) */
    _updatedAt: number | null;
    /** ID of the member who updated the doc. (if updated) */
    updatedBy: string;
    constructor(data: any, client: any);
    get member(): Member;
    get createdAt(): Date | null;
    get updatedAt(): Date | null;
    edit(options: {
        title?: string;
        content?: string;
    }): Promise<Doc>;
    delete(): Promise<void>;
}
