"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CalendarHandler = void 0;
const CalendarEvent_1 = require("../../structures/CalendarEvent");
const CalendarRSVP_1 = require("../../structures/CalendarRSVP");
const GatewayEventHandler_1 = require("./GatewayEventHandler");
class CalendarHandler extends GatewayEventHandler_1.GatewayEventHandler {
    calendarEventCreate(data) {
        var CalendarEventComponent = new CalendarEvent_1.CalendarEvent(data['calendarEvent'], this.client);
        this.client.emit('calendarEventCreate', CalendarEventComponent);
    }
    calendarEventUpdate(data) {
        var CalendarEventComponent = new CalendarEvent_1.CalendarEvent(data['calendarEvent'], this.client);
        this.client.emit('calendarEventUpdate', CalendarEventComponent);
    }
    calendarEventDelete(data) {
        var CalendarEventComponent = new CalendarEvent_1.CalendarEvent(data['calendarEventRsvp'], this.client);
        this.client.emit('calendarEventDelete', CalendarEventComponent);
    }
    calendarRsvpUpdate(data) {
        var CalendarERSVPComponent = new CalendarRSVP_1.CalendarEventRSVP(data['calendarEventRsvp'], this.client);
        this.client.emit('calendarEventRsvpUpdate', CalendarERSVPComponent);
    }
    calendarRsvpDelete(data) {
        var CalendarERSVPComponent = new CalendarRSVP_1.CalendarEventRSVP(data['calendarEventRsvp'], this.client);
        this.client.emit('calendarEventRsvpDelete', CalendarERSVPComponent);
    }
}
exports.CalendarHandler = CalendarHandler;
