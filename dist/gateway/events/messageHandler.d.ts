import { GatewayEventHandler } from "./GatewayEventHandler";
export declare class MessageHandler extends GatewayEventHandler {
    messageCreate(data: object): boolean;
    messageUpdate(data: object): boolean;
    messageDelete(data: object): boolean;
}
