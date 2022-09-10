import { GatewayEventHandler } from "./GatewayEventHandler";
export declare class CalendarHandler extends GatewayEventHandler {
    calendarEventCreate(data: object): void;
    calendarEventUpdate(data: object): void;
    calendarEventDelete(data: object): void;
    calendarRsvpUpdate(data: object): void;
    calendarRsvpDelete(data: object): void;
}
