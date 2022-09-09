import { Client } from './Client';
export declare class Guild {
    /** Client */
    client: Client;
    /** Guild/server id */
    id: string;
    /** ID of the sever owner */
    ownerID: string;
    /** Guild type */
    type: string;
    /** Guild name */
    name: string;
    /** Guild url */
    url: string;
    /** Guild's about/description */
    about: string;
    /** Guild's about/description */
    description: string;
    /** Guild icon */
    iconURL: string;
    bannerURL: string;
    timezone: string;
    defaultChannelID: string;
    _createdAt: number;
    constructor(data: {
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
    }, client: Client);
    get createdAt(): Date;
}
