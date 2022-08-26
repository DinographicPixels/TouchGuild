import { GatewayEventHandler } from "./GatewayEventHandler";
export declare class ChannelHandler extends GatewayEventHandler {
    channelCreate(data: object): void;
    channelUpdate(data: object): void;
    channelDelete(data: object): void;
}
