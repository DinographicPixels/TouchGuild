import { Client } from './Client';
import { MentionsType } from '../Types';
export declare class CalendarEvent {
    /** Raw data */
    data: any;
    /** Client */
    client: Client;
    /** Calendar Event ID */
    id: number;
    /** Guild/server ID */
    guildID: string;
    /** ID of the channel the event was created on. */
    channelID: string;
    /** Name of the event */
    name: string;
    /** Event's description */
    description: string;
    /** Event user-specified location */
    location: string;
    /** Event user-specified url */
    url: string;
    /** Event color in calendar. */
    color: number;
    /** Limit of event entry. */
    rsvpLimit: number;
    /** Timestamp (unix epoch time) of the event starting time.*/
    _startsAt: number | null;
    /** Duration in *ms* of the event. */
    duration: number;
    /** */
    isPrivate: boolean;
    /**  */
    mentions: MentionsType;
    /** Timestamp (unix epoch time) of the event's creation. */
    _createdAt: number | null;
    /** ID of the member that created the event. */
    memberID: string;
    /** Details about event cancelation (if canceled) */
    cancelation: {
        description: string;
        createdBy: string;
    };
    constructor(data: any, client: any);
    /** Member component. */
    get member(): import("./Member").Member;
    /** string representation of the _createdAt timestamp */
    get createdAt(): Date | number | null;
    /** Edit the calendar event */
    edit(options: {
        name?: string;
        description?: string;
        location?: string;
        startsAt?: string;
        url?: string;
        color?: number;
        rsvpLimit?: number;
        duration?: number;
        isPrivate?: boolean;
    }): Promise<CalendarEvent>;
    /** Delete the calendar event */
    delete(): Promise<void>;
}
