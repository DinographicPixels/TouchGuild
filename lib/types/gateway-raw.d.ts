import { GatewayOPCodes, APIBotUser } from "../Constants";

export type AnyPacket = RawPacket | WelcomePacket;

export interface RawPacket {
    d: object | null;
    op: GatewayOPCodes;
    s: string | null;
    t: string | null;
}

export interface WelcomePacket {
    d: APIBotUser;
    op: GatewayOPCodes;
    s: string | null;
    t: string | null;
}

