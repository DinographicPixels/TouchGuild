import { GatewayEventHandler } from "./GatewayEventHandler";
export declare class DocHandler extends GatewayEventHandler {
    docCreate(data: object): void;
    docUpdate(data: object): void;
    docDelete(data: object): void;
}
