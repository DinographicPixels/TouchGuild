/** @module CalendarHandler */
import { GatewayEventHandler } from "./GatewayEventHandler";
import { CalendarEvent } from "../../structures/CalendarEvent";
import { CalendarEventRSVP } from "../../structures/CalendarRSVP";
import {
    GatewayEvent_CalendarEventCreated,
    GatewayEvent_CalendarEventDeleted,
    GatewayEvent_CalendarEventRsvpDeleted,
    GatewayEvent_CalendarEventRsvpUpdated,
    GatewayEvent_CalendarEventUpdated
} from "../../Constants";

/** Internal component, emitting calendar events. */
export class CalendarHandler extends GatewayEventHandler{
    calendarEventCreate(data: GatewayEvent_CalendarEventCreated): void {
        const CalendarEventComponent = new CalendarEvent(data.calendarEvent, this.client);
        this.client.emit("calendarEventCreate", CalendarEventComponent);
    }

    calendarEventUpdate(data: GatewayEvent_CalendarEventUpdated): void {
        const CalendarEventComponent = new CalendarEvent(data.calendarEvent, this.client);
        this.client.emit("calendarEventUpdate", CalendarEventComponent);
    }

    calendarEventDelete(data: GatewayEvent_CalendarEventDeleted): void {
        const CalendarEventComponent = new CalendarEvent(data.calendarEvent, this.client);
        this.client.emit("calendarEventDelete", CalendarEventComponent);
    }

    calendarRsvpUpdate(data: GatewayEvent_CalendarEventRsvpUpdated): void {
        const CalendarERSVPComponent = new CalendarEventRSVP(data.calendarEventRsvp, this.client);
        this.client.emit("calendarEventRsvpUpdate", CalendarERSVPComponent);
    }

    calendarRsvpDelete(data: GatewayEvent_CalendarEventRsvpDeleted): void {
        const CalendarERSVPComponent = new CalendarEventRSVP(data.calendarEventRsvp, this.client);
        this.client.emit("calendarEventRsvpDelete", CalendarERSVPComponent);
    }

    calendarRsvpManyUpdated(): void {
        return; // TouchGuild doesn't support many updated.
    }
}
