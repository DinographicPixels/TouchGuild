import { Client } from "../structures/Client";
import { ChannelHandler } from "./events/ChannelHandler";
import { MessageHandler } from "./events/MessageHandler";
export declare class GatewayHandler {
    readonly client: Client;
    constructor(client: Client);
    messageHandler: MessageHandler;
    channelHandler: ChannelHandler;
    handleMessage(eventType: string, eventData: object): void;
}
