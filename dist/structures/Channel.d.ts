import { Client } from './Client';
import { Message, MessageOptions } from './Message';
/** Guild Channel component, with all its methods and declarations */
export declare class Channel {
    /** Raw data */
    data: any;
    /** Client */
    client: Client;
    /** Channel ID */
    id: string;
    /** Channel type */
    type: string;
    /** Channel name */
    name: string;
    /** Channel topic/description */
    topic: string | any;
    /** Timestamp (unix epoch time) of the channel's creation. */
    _createdAt: number;
    /** ID of the channel's creator. */
    memberID: string;
    /** Timestamp (unix epoch time) of the channel's edition. (if edited) */
    _updatedAt: number | null;
    /** Server ID */
    guildID: string;
    /** ID of the parent category. */
    parentID: string | any;
    /** ID of the category the channel is in. */
    categoryID: number | any;
    /** ID of the group the channel is in. */
    groupID: string;
    /**  */
    isPublic: boolean | any;
    /** ID of the member that archived the channel (if archived) */
    archivedBy: string | any;
    /** Timestamp (unix epoch time) of when the channel has been archived. */
    _archivedAt: number | null;
    constructor(data: any, client: Client);
    get createdAt(): Date;
    get updatedAt(): Date | null;
    get archivedAt(): Date | null;
    /** Create a message in the channel. */
    createMessage(options: MessageOptions): Promise<Message>;
    /** Delete the channel. */
    delete(): Promise<void>;
    /** Edit the channel. */
    edit(options: editTypes): Promise<Channel>;
}
interface editTypes {
    name?: string;
    topic?: string;
    isPublic?: boolean;
}
/** CHannel create types */
export declare type ChannelCreateTypes = {
    guildID: string;
    groupID: string;
    categoryID: string;
    name: string;
    type: {
        announcement: string;
        chat: string;
        calendar: string;
        forums: string;
        media: string;
        docs: string;
        voice: string;
        list: string;
        scheduling: string;
        stream: string;
    };
    options: {
        topic: string;
        isPublic: boolean;
    };
};
export declare type ChannelTypes = 'announcement' | 'chat' | 'calendar' | 'forums' | 'media' | 'docs' | 'voice' | 'list' | 'scheduling' | 'stream';
export {};
