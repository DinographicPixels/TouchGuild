/** @module Events/WSEvents */
import type { AnyPacket, WelcomePacket } from "./gateway-raw";
import { APIBotUser } from "guildedapi-types.ts/v1";

export interface WebsocketEvents {
    /** @event Emitted after getting an error. */
    error: [error: Error];
    /** @event Emitted to debug. */
    debug: [message: string | object];
    /** @event Emitted when process exit. */
    exit: [message: string | Error];
    /** @event Emitted when a packet is parsed. */
    GATEWAY_PARSED_PACKET: [type: string | null, data: object];
    /** @event Emitted when a packet is sent. */
    GATEWAY_PACKET: [packet: AnyPacket];
    /** @event Emitted when connected to gateway. */
    GATEWAY_WELCOME: [data: APIBotUser];
    /** @event Emitted when connected to gateway. */
    GATEWAY_WELCOME_PACKET: [packet: WelcomePacket];
    /** @event Emitted when a packet isn't recognized. */
    GATEWAY_UNKNOWN_PACKET: [message: string, packet: AnyPacket];
    /** @event Emitted when disconnected from gateway. */
    disconnect: [error: Error];
}
