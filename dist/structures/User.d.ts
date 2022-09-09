import { Client } from './Client';
export declare class User {
    _client: Client;
    id: string;
    type: string | any;
    username: string;
    avatarURL: string | any;
    bannerURL: string | any;
    _createdAt: number;
    bot: boolean;
    constructor(data: any, client: any);
    get createdAt(): Date;
}
