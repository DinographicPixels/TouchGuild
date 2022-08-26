import { Client } from './Client';
export declare class User {
    client: Client;
    id: string;
    type: string | any;
    username: string;
    avatar: string | any;
    banner: string | any;
    createdAt: string;
    bot: boolean;
    constructor(data: any, client: any);
}
