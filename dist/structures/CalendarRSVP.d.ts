import { Client } from './Client';
export declare class CalendarEventRSVP {
    /** Raw data */
    data: any;
    /** Client */
    client: Client;
    /** Calendar Event RSVP ID */
    id: number;
    /** Guild/server ID. */
    guildID: string;
    /** Calendar channel id. */
    channelID: string;
    /** RSVP member id */
    memberID: string;
    /** Status of the RSVP */
    status: 'going' | 'maybe' | 'declined' | 'invited' | 'waitlisted' | 'not responded';
    /** Timestamp (unix epoch time) of the rsvp's creation. */
    _createdAt: number | null;
    /** ID of the member that created the rsvp. */
    createdBy: string;
    /** ID of the member that updated the rsvp (if updated) */
    updatedBy: string;
    constructor(data: any, client: Client);
    /** Member component from REST (sync). */
    get member(): import("./Member").Member;
    /** string representation of the _createdAt timestamp */
    get createdAt(): Date | null;
    /** Edit the calendar rsvp */
    edit(options: {
        status: 'going' | 'maybe' | 'declined' | 'invited' | 'waitlisted' | 'not responded';
    }): Promise<CalendarEventRSVP>;
    /** Delete the calendar rsvp */
    delete(): Promise<void>;
}
