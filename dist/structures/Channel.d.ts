import { Client } from './Client';
import { Message } from './Message';
export declare class Channel {
    data: any;
    client: Client;
    id: string;
    type: string;
    name: string;
    topic: string | any;
    createdAt: string;
    createdBy: string;
    updatedAt: string | any;
    serverId: string;
    parentId: string | any;
    categoryId: number | any;
    groupId: string;
    isPublic: boolean | any;
    archivedBy: string | any;
    archivedAt: string | any;
    constructor(data: any, client: any);
    createMessage(options?: {}): Promise<Message>;
    delete(): Promise<void>;
    edit(options: Partial<editTypes>): Promise<Channel>;
}
interface editTypes {
    name: string;
    topic: string;
    isPublic: boolean;
}
export {};
