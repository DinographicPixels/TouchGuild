/** @module CalendarEvent */
import { Client } from "./Client";
import { Member } from "./Member";
import { Base } from "./Base";

import { User } from "./User";
import { APICalendarEvent, APIMentions } from "../Constants";
import { EditCalendarEventOptions } from "../types/calendarEvent";

/** CalendarEvent represents an event coming from a calendar channel. */
export class CalendarEvent extends Base {
    /** Raw data */
    data: APICalendarEvent;
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
    startsAt: Date | null;
    /** Duration in *ms* of the event. */
    duration: number;
    /** */
    isPrivate: boolean;
    mentions: APIMentions | null;
    /** When the event was created. */
    createdAt: Date | null;
    /** ID of the owner of this event. */
    ownerID: string;
    /** Details about event cancelation (if canceled) */
    cancelation: APICalendarEvent["cancellation"] | null;

    /**
     * @param data raw data.
     * @param client client.
     */
    constructor(data: APICalendarEvent, client: Client){
        super(data.id, client);
        this.data = data;
        this.id = data.id;
        this.guildID = data.serverId;
        this.channelID = data.channelId;
        this.name = data.name ?? null;
        this.description = data.description ?? null;
        this.location = data.location ?? null;
        this.url = data.url ?? null;
        this.color = data.color ?? null;
        this.rsvpLimit = data.rsvpLimit ?? null;
        this.startsAt = data.startsAt ? new Date(data.startsAt) : null;
        this.duration = (data.duration as number) * 60000 ?? null; // in ms.
        this.isPrivate = data.isPrivate ?? false;
        this.mentions = data.mentions ?? null;
        this.createdAt = data.createdAt ? new Date(data.createdAt) : null;
        this.ownerID = data.createdBy;
        this.cancelation = data.cancellation ?? null;
    }

    /** Retrieve the event's owner, if cached.
     *
     * Note: this getter can output: Member, User, Promise<Member> or undefined.
     */
    get owner(): Member | User | Promise<Member> | undefined {
        if (this.client.cache.members.get(this.ownerID) && this.ownerID){
            return this.client.cache.members.get(this.ownerID);
        } else if (this.client.cache.users.get(this.ownerID) && this.ownerID){
            return this.client.cache.users.get(this.ownerID);
        } else if (this.ownerID && this.guildID){
            return this.client.rest.guilds.getMember(this.guildID, this.ownerID);
        }
    }

    /** Edit this event */
    async edit(options: EditCalendarEventOptions): Promise<CalendarEvent>{
        return this.client.rest.channels.editCalendarEvent(this.channelID, this.id as number, options);
    }

    /** Delete this event */
    async delete(): Promise<void>{
        return this.client.rest.channels.deleteCalendarEvent(this.channelID, this.id as number);
    }
}
