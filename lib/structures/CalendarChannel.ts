/** @module CalendarChannel */
import { Client } from "./Client";

import { CalendarEvent } from "./CalendarEvent";
import { GuildChannel } from "./GuildChannel";
import type { APICalendarEvent, APIGuildChannel } from "../Constants";
import TypedCollection from "../util/TypedCollection";
import { JSONCalendarChannel } from "../types/json";

/** Represents a calendar channel. */
export class CalendarChannel extends GuildChannel {
    /** Cached scheduled events. */
    scheduledEvents: TypedCollection<number, APICalendarEvent, CalendarEvent>;
    /**
     * @param data raw data
     * @param client client
     */
    constructor(data: APIGuildChannel, client: Client){
        super(data, client);
        this.scheduledEvents = new TypedCollection(CalendarEvent, client, client.params.collectionLimits?.scheduledEvents);
        this.update(data);
    }

    override toJSON(): JSONCalendarChannel {
        return {
            ...super.toJSON(),
            scheduledEvents: this.scheduledEvents.map(event => event.toJSON())
        };
    }
}
