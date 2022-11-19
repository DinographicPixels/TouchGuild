/** @module CalendarRSVP */
import { Client } from "./Client";
import { Member } from "./Member";
import { Base } from "./Base";

import { User } from "./User";
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

    /**
     * @param data raw data.
     * @param client client.
     */
    constructor(data: APICalendarEventRSVP, client: Client){
        super(data.calendarEventId, client);
        this.data = data;
        this.guildID = data.serverId;
        this.channelID = data.channelId;
        this.memberID = data.userId;
        this.status = data.status;
        this.createdBy = data.createdBy ?? null;
        this.updatedBy = data.updatedBy ?? null;
        this._createdAt = data.createdAt ? Date.parse(data.createdAt) : null;
    }

    /** Retrieve message's member, if cached.
     *
     * Note: this getter can output: Member, User, Promise<Member> or undefined.
     */
    get member(): Member | User | Promise<Member> | undefined {
        if (this.client.cache.members.get(this.memberID) && this.memberID){
            return this.client.cache.members.get(this.memberID);
        } else if (this.client.cache.users.get(this.memberID) && this.memberID){
            return this.client.cache.users.get(this.memberID);
        } else if (this.memberID && this.guildID){
            return this.client.rest.guilds.getMember(this.guildID, this.memberID);
        }
    }

    /** String representation of the _createdAt timestamp. */
    get createdAt(): Date|null{
        return this._createdAt ? new Date(this._createdAt) : null;
    }

    /** Edit this RSVP. */
    async edit(options: PUTCalendarEventRSVPBody): Promise<CalendarEventRSVP>{
        return this.client.rest.channels.editCalendarRsvp(this.channelID, this.id as number, this.memberID, options);
    }

    /** Delete this RSVP. */
    async delete(): Promise<void>{
        return this.client.rest.channels.deleteCalendarRsvp(this.channelID, this.id as number, this.memberID);
    }
}
