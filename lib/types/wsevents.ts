import { APIBotUser } from "guildedapi-types.ts/v1";

export interface WebsocketEvents {
    /** @event Emitted after getting an error. */
    error: [error: Error];
    debug: [message: string | object];
    exit: [message: string | Error];
    GATEWAY_PARSED_PACKET: [type: string, data: object];
    GATEWAY_PACKET: [packet: string];
    GATEWAY_WELCOME: [data: APIBotUser];
    GATEWAY_WELCOME_PACKET: [packet: string];
    GATEWAY_UNKNOWN_PACKET: [message: string, packet: string];
    disconnect: [error: Error];
}
