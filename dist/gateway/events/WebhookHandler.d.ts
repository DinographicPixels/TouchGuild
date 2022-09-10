import { GatewayEventHandler } from "./GatewayEventHandler";
export declare class WebhookHandler extends GatewayEventHandler {
    webhooksCreate(data: object): void;
    webhooksUpdate(data: object): void;
}
