import { messageReactionRawTypes } from "../../Types";
import { GatewayEventHandler } from "./GatewayEventHandler";
export declare class MessageHandler extends GatewayEventHandler {
    messageCreate(data: object): Promise<boolean>;
    messageUpdate(data: object): boolean;
    messageDelete(data: object): boolean;
    messageReactionAdd(data: messageReactionRawTypes | any): boolean;
    messageReactionRemove(data: messageReactionRawTypes | any): boolean;
}
