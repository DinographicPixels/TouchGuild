import { APIBotUser } from "guildedapi-types.ts/v1";

export interface WebsocketEvents {
    /** @event Emitted after getting an error. */
    error: [error: Error];
    /** @event Emitted to debug. */
    debug: [message: string | object];
    /** @event Emitted when process exit. */
    exit: [message: string | Error];
    /** @event Emitted when a packet is parsed. */
    GATEWAY_PARSED_PACKET: [type: string, data: object];
    /** @event Emitted when a packet is sent. */
    GATEWAY_PACKET: [packet: string];
    /** @event Emitted when connected to gateway. */
    GATEWAY_WELCOME: [data: APIBotUser];
    /** @event Emitted when connected to gateway. */
    GATEWAY_WELCOME_PACKET: [packet: string];
    /** @event Emitted when a packet isn't recognized. */
    GATEWAY_UNKNOWN_PACKET: [message: string, packet: string];
    /** @event Emitted when disconnected from gateway. */
    disconnect: [error: Error];
}
