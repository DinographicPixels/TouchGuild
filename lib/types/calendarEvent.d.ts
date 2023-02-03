import { APICalendarEventRSVPStatuses } from "../Constants";

export interface CreateCalendarEventOptions {
    /** The name of the event. */
    name: string;
    /** The description of the event. */
    description?: string;
    /** The location where the event will happen. */
    location?: string;
    /** The event's starting date. */
    startsAt?: string;
    /** Link a URL to the event. */
    url?: string;
    /** Event card's color. */
    color?: number;
    /** Limit of member joining this event. */
    rsvpLimit?: number;
    /** Event's duration. */
    duration?: number;
    /** If the event is private or not. */
    isPrivate?: boolean;
}

export interface EditCalendarEventOptions {
    /** The name of the event. */
    name?: string;
    /** The description of the event. */
    description?: string;
    /** The location where the event will happen. */
    location?: string;
    /** The event's starting date. */
    startsAt?: string;
    /** Link a URL to the event. */
    url?: string;
    /** Event card's color. */
    color?: number;
    /** Limit of member joining this event. */
    rsvpLimit?: number;
    /** Event's duration. */
    duration?: number;
    /** If the event is private or not. */
    isPrivate?: boolean;
}

export interface GetCalendarEventsFilter {
    /** An ISO 8601 timestamp that will be used to filter out results for the current page */
    before?: string;
    /** Order will be reversed when compared to before or when omitting this parameter altogether */
    after?: string;
    /** Limit the number of calendar event that will output. (default `50`; min `1`; max `100`) */
    limit?: number;
}

export interface EditCalendarRSVPOptions {
    /** The status of the RSVP */
    status: APICalendarEventRSVPStatuses;
}

export interface CreateCalendarCommentOptions {
    /** The content of the comment. */
    content: string;
}

export interface EditCalendarCommentOptions {
    /** The new content of the comment. */
    content: string;
}
