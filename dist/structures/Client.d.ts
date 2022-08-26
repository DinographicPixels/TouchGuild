import { Message } from './Message';
import { Channel } from './Channel';
import { Member } from './Member';
import { Guild } from './Guild';
import type TypedEmitter from 'typed-emitter';
export declare type EmitterTypes = {
    message: (message: string) => void;
    error: (error: Error) => void;
    ready: () => void;
    messageCreate: (message: Message) => void;
    messageUpdate: (message: Message) => void;
    messageDelete: (message: Message) => void;
    channelCreate: (channel: Channel) => void;
    channelUpdate: (channel: Channel) => void;
    channelDelete: (channel: Channel) => void;
    exit: (message: string) => void;
};
declare const Client_base: new () => TypedEmitter<EmitterTypes>;
export declare class Client extends Client_base {
    params: {
        token: string;
    };
    ws: any;
    cache: any;
    identifiers: {
        Message: {
            'ChatMessageCreated': 'messageCreate';
            'ChatMessageUpdated': 'messageUpdate';
            'ChatMessageDeleted': 'messageDelete';
        };
        Channel: {
            'TeamChannelCreated': 'channelCreate';
            'TeamChannelUpdated': 'channelUpdate';
            'TeamChannelDeleted': 'channelDelete';
        };
    };
    constructor(params: {
        token: string;
    });
    get token(): string;
    connect(...args: any[]): void;
    getChannel(channelId: string): Channel;
    getMember(serverID: string, memberID: string): Member;
    getGuild(guildID: string): Guild;
    createChannel(location: {
        guildID: undefined;
        groupID: undefined;
        categoryID: undefined;
    } | undefined, name: string, type: string, options?: {
        topic: undefined;
        isPublic: undefined;
    }): void;
    createMessage(channelID: string, options?: {}): Promise<Message>;
    edit(channelID: string, messageID: string, newMessage: object): Promise<void>;
    delete(channelID: string, messageID: string): Promise<void>;
}
export {};
