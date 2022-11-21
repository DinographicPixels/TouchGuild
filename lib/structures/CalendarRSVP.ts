/** @module CalendarRSVP */
import { Client } from "./Client";
import { Base } from "./Base";
import { APICalendarEventRSVP, APICalendarEventRSVPStatuses, PUTCalendarEventRSVPBody } from "../Constants";

/** CalendarEventRSVP represents a guild member's event RSVP.
 * It gives information about a member's set presence to an event.
 */
export class CalendarEventRSVP extends Base {
    /** Raw data */
    data: APICalendarEventRSVP;
    /** Guild/server ID. */
    guildID: string;
    /** Calendar channel id. */
    channelID: string;
    /** ID of the entity assigned to this Event RSVP. */
    entityID: string;
    /** Status of the RSVP */
    status: APICalendarEventRSVPStatuses;
    /** When the RSVP was created. */
    createdAt: Date | null;
    /** ID of the user who created this RSVP. */
    creatorID: string;
    /** ID of the member who updated the rsvp, if updated. */
    updatedBy?: string | null;

    /**
     * @param data raw data.
     * @param client client.
     */
    constructor(data: APICalendarEventRSVP, client: Client){
        super(data.calendarEventId, client);
        this.data = data;
        this.guildID = data.serverId;
        this.channelID = data.channelId;
        this.entityID = data.userId;
        this.status = data.status;
        this.creatorID = data.createdBy ?? null;
        this.updatedBy = data.updatedBy ?? null;
        this.createdAt = data.createdAt ? new Date(data.createdAt) : null;
    }

    /** Edit this RSVP. */
    async edit(options: PUTCalendarEventRSVPBody): Promise<CalendarEventRSVP>{
        return this.client.rest.channels.editCalendarRsvp(this.channelID, this.id as number, this.entityID, options);
    }

    /** Delete this RSVP. */
    async delete(): Promise<void>{
        return this.client.rest.channels.deleteCalendarRsvp(this.channelID, this.id as number, this.entityID);
    }
}
