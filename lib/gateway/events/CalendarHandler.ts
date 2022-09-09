import { CalendarEvent } from "../../structures/CalendarEvent";
import { CalendarEventRSVP } from "../../structures/CalendarRSVP";
import { GatewayEventHandler } from "./GatewayEventHandler";

export class CalendarHandler extends GatewayEventHandler{
    calendarEventCreate(data: object){
        var CalendarEventComponent = new CalendarEvent(data['calendarEvent' as keyof object], this.client)
        this.client.emit('calendarEventCreate', CalendarEventComponent)
    }

    calendarEventUpdate(data: object){
        var CalendarEventComponent = new CalendarEvent(data['calendarEvent' as keyof object], this.client)
        this.client.emit('calendarEventUpdate', CalendarEventComponent)
    }

    calendarEventDelete(data: object){
        var CalendarEventComponent = new CalendarEvent(data['calendarEventRsvp' as keyof object], this.client)
        this.client.emit('calendarEventDelete', CalendarEventComponent)
    }

    calendarRsvpUpdate(data: object){
        var CalendarERSVPComponent = new CalendarEventRSVP(data['calendarEventRsvp' as keyof object], this.client)
        this.client.emit('calendarEventRsvpUpdate', CalendarERSVPComponent)
    }

    calendarRsvpDelete(data: object){
        var CalendarERSVPComponent = new CalendarEventRSVP(data['calendarEventRsvp' as keyof object], this.client)
        this.client.emit('calendarEventRsvpDelete', CalendarERSVPComponent)
    }
}