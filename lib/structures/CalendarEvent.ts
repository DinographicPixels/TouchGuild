import { Client } from "./Client";
import { Member } from "./Member";
import * as endpoints from "../rest/endpoints";

import { call } from "../Utils";
import { APICalendarEvent, APIMentions, PATCHCalendarEventResponse } from "guildedapi-types.ts/v1";
const calls = new call();

export class CalendarEvent {
    /** Raw data */
    data: APICalendarEvent;
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
    description: string | null;
    /** Event user-specified location */
    location: string | null;
    /** Event user-specified url */
    url: string | null;
    /** Event color in calendar. */
    color: number | null;
    /** Limit of event entry. */
    rsvpLimit: number | null;
    /** Timestamp (unix epoch time) of the event starting time.*/
    _startsAt: number|null;
    /** Duration in *ms* of the event. */
    duration: number;
    /** */
    isPrivate: boolean;
    mentions: APIMentions | null;
    /** Timestamp (unix epoch time) of the event's creation. */
    _createdAt: number|null;
    /** ID of the member that created the event. */
    memberID: string;
    /** Details about event cancelation (if canceled) */
    cancelation: APICalendarEvent["cancellation"] | null;

    constructor(data: APICalendarEvent, client: Client){
        this.data = data;
        this.client = client;

        this.id = data.id;
        this.guildID = data.serverId;
        this.channelID = data.channelId;
        this.name = data.name ?? null;
        this.description = data.description ?? null;
        this.location = data.location ?? null;
        this.url = data.url ?? null;
        this.color = data.color ?? null;
        this.rsvpLimit = data.rsvpLimit ?? null;
        this._startsAt = data.startsAt ? Date.parse(data.startsAt) : null;
        this.duration = (data.duration as number) * 60000 ?? null; // in ms.
        this.isPrivate = data.isPrivate ?? false;
        this.mentions = data.mentions ?? null;
        this._createdAt = data.createdAt ? Date.parse(data.createdAt) : null;
        this.memberID = data.createdBy;
        this.cancelation = data.cancellation ?? null;
    }

    /** Member component. */
    get member(): Member {
        return calls.syncGetMember(this.guildID, this.memberID, this.client);
    }

    /** string representation of the _createdAt timestamp */
    get createdAt(): Date|number|null{
        return this._createdAt ? new Date(this._createdAt) : null;
    }

    /** Edit the calendar event */
    async edit(options: {name?: string; description?: string; location?: string; startsAt?: string; url?: string; color?: number; rsvpLimit?: number; duration?: number; isPrivate?: boolean;}): Promise<CalendarEvent>{
        const response = await calls.patch(endpoints.CHANNEL_EVENT(this.channelID, this.id), this.client.token, options);
        return new CalendarEvent((response["data" as keyof object] as PATCHCalendarEventResponse).calendarEvent, this.client);
    }

    /** Delete the calendar event */
    async delete(): Promise<void>{
        await calls.delete(endpoints.CHANNEL_EVENT(this.channelID, this.id), this.client.token);
    }
}
