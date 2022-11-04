import { Client } from "./Client";
import { Member } from "./Member";
import * as endpoints from "../rest/endpoints";

import { call } from "../Utils";
import { APICalendarEventRSVP, APICalendarEventRSVPStatuses, PUTCalendarEventRSVPResponse } from "guildedapi-types.ts/v1";
const calls = new call();

export class CalendarEventRSVP {
    /** Raw data */
    data: APICalendarEventRSVP;
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
    status: APICalendarEventRSVPStatuses;
    /** Timestamp (unix epoch time) of the rsvp's creation. */
    _createdAt: number|null;
    /** ID of the member that created the rsvp. */
    createdBy: string;
    /** ID of the member that updated the rsvp (if updated) */
    updatedBy?: string | null;

    constructor(data: APICalendarEventRSVP, client: Client){
        this.data = data;
        this.client = client;

        this.id = data.calendarEventId;
        this.guildID = data.serverId;
        this.channelID = data.channelId;
        this.memberID = data.userId;
        this.status = data.status;
        this.createdBy = data.createdBy ?? null;
        this.updatedBy = data.updatedBy ?? null;
        this._createdAt = data.createdAt ? Date.parse(data.createdAt) : null;
    }

    /** Member component from REST (sync). */
    get member(): Member {
        return calls.syncGetMember(this.guildID, this.createdBy, this.client);
    }

    /** string representation of the _createdAt timestamp */
    get createdAt(): Date|null{
        return this._createdAt ? new Date(this._createdAt) : null;
    }

    /** Edit the calendar rsvp */
    async edit(options: {status: "going"|"maybe"|"declined"|"invited"|"waitlisted"|"not responded";}): Promise<CalendarEventRSVP>{
        if (typeof options !== "object") throw new TypeError("options should be an object.");
        const response = await calls.put(endpoints.CHANNEL_EVENT_RSVP(this.channelID, this.id, this.memberID), this.client.token, options);
        return new CalendarEventRSVP((response["data" as keyof object] as PUTCalendarEventRSVPResponse).calendarEventRsvp, this.client);
    }

    /** Delete the calendar rsvp */
    async delete(): Promise<void>{
        await calls.delete(endpoints.CHANNEL_EVENT_RSVP(this.channelID, this.id, this.memberID), this.client.token);
    }
}
