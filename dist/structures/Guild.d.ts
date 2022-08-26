import { Client } from './Client';
export declare class Guild {
    client: Client;
    id: string;
    ownerId: string;
    type: string;
    name: string;
    url: string;
    about: string;
    description: string;
    icon: string;
    banner: string;
    timezone: string;
    defaultChannelId: string;
    createdAt: string;
    constructor(data: {
        server: {
            id: string;
            ownerId: string;
            type: string;
            name: string;
            url: string;
            about: string;
            avatar: string;
            banner: string;
            timezone: string;
            defaultChannelId: string;
            createdAt: string;
        };
    }, client: any);
}
