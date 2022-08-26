import { Client } from './Client';
export declare class Message {
    data: any;
    fulldata: object;
    client: Client;
    id: string;
    type: string;
    serverId: string;
    channelId: string;
    content: string | undefined;
    oldContent: string | undefined;
    embeds: [] | undefined;
    replyMessageIds: string[];
    isPrivate: boolean | undefined;
    isSilent: boolean | undefined;
    mentions: any;
    createdAt: string;
    createdBy: string;
    createdByWebhookId: string | undefined;
    updatedAt: string | undefined;
    channel: any;
    member: any;
    constructor(data: any, client: any, params?: {
        oldContent: undefined;
    });
    createMessage(options?: {}): Promise<Message>;
    edit(newMessage: object): Promise<void>;
    delete(): Promise<void>;
}
