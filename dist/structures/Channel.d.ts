import { Client } from './Client';
import { Message, MessageOptions } from './Message';
import { ChannelEditTypes, ChannelCategories } from '../Types';
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
    edit(options: ChannelEditTypes): Promise<Channel>;
}
export { ChannelCategories, ChannelEditTypes };
