import { Channel } from './structures/Channel';
import { Guild } from './structures/Guild';
import { Member } from './structures/Member';
import { Client } from './structures/Client';
export declare class call {
    apiURL: string;
    constructor();
    get(endpoint: string, token: string, queryParams?: string | object, crashOnRejection?: boolean): Promise<object | void>;
    post(endpoint: string, token: string, data: string | object, crashOnRejection?: boolean): Promise<object | void>;
    put(endpoint: string, token: string, data: string | object, crashOnRejection?: boolean): Promise<object | void>;
    patch(endpoint: string, token: string, data: string | object, crashOnRejection?: boolean): Promise<object | void>;
    delete(endpoint: string, token: string, crashOnRejection?: boolean): Promise<object | void>;
    FETCH(method: string, endpoint: string, TOKEN: any, BODY: string | any): Promise<any>;
    SYNCFETCH(method: string, endpoint: string, TOKEN: any, BODY: string | any): any;
    syncGetChannel(channelID: string, client: Client): Channel;
    syncGetMember(guildID: string, memberID: string, client: Client): Member;
    syncGetGuild(guildID: string, client: Client): Guild;
}
