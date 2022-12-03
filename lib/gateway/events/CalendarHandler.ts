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
import { CalendarChannel } from "../../structures/CalendarChannel";

/** Internal component, emitting calendar events. */
export class CalendarHandler extends GatewayEventHandler {
    calendarEventCreate(data: GatewayEvent_CalendarEventCreated): void {
        void this.addGuildChannel(data.serverId, data.calendarEvent.channelId);
        const channel = this.client.getChannel<CalendarChannel>(data.serverId, data.calendarEvent.channelId);
        const CalendarEventComponent = channel?.scheduledEvents.update(data.calendarEvent) ?? new CalendarEvent(data.calendarEvent, this.client);
        this.client.emit("calendarEventCreate", CalendarEventComponent);
    }

    calendarEventUpdate(data: GatewayEvent_CalendarEventUpdated): void {
        void this.addGuildChannel(data.serverId, data.calendarEvent.channelId);
        const channel = this.client.getChannel<CalendarChannel>(data.serverId, data.calendarEvent.channelId);
        const CalendarEventComponent = channel?.scheduledEvents.update(data.calendarEvent) ?? new CalendarEvent(data.calendarEvent, this.client);
        this.client.emit("calendarEventUpdate", CalendarEventComponent);
    }

    calendarEventDelete(data: GatewayEvent_CalendarEventDeleted): void {
        void this.addGuildChannel(data.serverId, data.calendarEvent.channelId);
        const channel = this.client.getChannel<CalendarChannel>(data.serverId, data.calendarEvent.channelId);
        const CalendarEventComponent = channel?.scheduledEvents.update(data.calendarEvent) ?? new CalendarEvent(data.calendarEvent, this.client);
        channel?.scheduledEvents.delete(data.calendarEvent.id);
        this.client.emit("calendarEventDelete", CalendarEventComponent);
    }

    calendarRsvpUpdate(data: GatewayEvent_CalendarEventRsvpUpdated): void {
        void this.addGuildChannel(data.calendarEventRsvp.serverId, data.calendarEventRsvp.channelId, data.calendarEventRsvp.calendarEventId);
        const channel = this.client.getChannel<CalendarChannel>(data.calendarEventRsvp.serverId, data.calendarEventRsvp.channelId);
        const updateFromCache = channel?.scheduledEvents.get(data.calendarEventRsvp.calendarEventId)?.rsvps.update(data.calendarEventRsvp);
        const CalendarERSVPComponent = updateFromCache ?? new CalendarEventRSVP(data.calendarEventRsvp, this.client);
        this.client.emit("calendarEventRsvpUpdate", CalendarERSVPComponent);
    }

    calendarRsvpDelete(data: GatewayEvent_CalendarEventRsvpDeleted): void {
        void this.addGuildChannel(data.calendarEventRsvp.serverId, data.calendarEventRsvp.channelId, data.calendarEventRsvp.calendarEventId);
        const channel = this.client.getChannel<CalendarChannel>(data.calendarEventRsvp.serverId, data.calendarEventRsvp.channelId);
        const updateFromCache = channel?.scheduledEvents.get(data.calendarEventRsvp.calendarEventId)?.rsvps.update(data.calendarEventRsvp);
        const CalendarERSVPComponent = updateFromCache ?? new CalendarEventRSVP(data.calendarEventRsvp, this.client);
        this.client.emit("calendarEventRsvpDelete", CalendarERSVPComponent);
    }

    calendarRsvpManyUpdated(): void {
        return; // TouchGuild doesn't support many updated.
    }

    private async addGuildChannel(guildID: string, channelID: string, eventID?: number): Promise<void> {
        const guild = this.client.guilds.get(guildID);
        if (this.client.getChannel(guildID, channelID) === undefined) {
            const channel = await this.client.rest.channels.getChannel(channelID);
            guild?.channels?.add(channel);
        }
        const conditions = this.client.getChannel(guildID, channelID) !== undefined && this.client.getChannel<CalendarChannel>(guildID, channelID)?.scheduledEvents.get(eventID as number) === undefined;
        if (guildID && channelID && eventID && conditions) {
            const restEvent = await this.client.rest.channels.getCalendarEvent(channelID, eventID);
            (guild?.channels.get(channelID) as CalendarChannel)?.scheduledEvents.add(restEvent);
        }
    }
}
