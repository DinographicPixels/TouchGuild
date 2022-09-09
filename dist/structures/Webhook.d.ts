import { Client } from './Client';
export declare class Webhook {
    _client: Client;
    id: string;
    guildID: string;
    channelID: string;
    username: string;
    _createdAt: number;
    createdBy: string;
    _deletedAt: number | null;
    token: string | null;
    constructor(data: any, client: Client);
    get createdAt(): Date;
    get deletedAt(): Date | null;
    /** Update webhook */
    edit(options: {
        name: string;
        channelID?: string;
    }): Promise<Webhook>;
    /** Delete webhook */
    delete(): Promise<void>;
}
