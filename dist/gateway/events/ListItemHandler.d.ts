import { GatewayEventHandler } from "./GatewayEventHandler";
export declare class ListItemHandler extends GatewayEventHandler {
    listItemCreate(data: object): void;
    listItemUpdate(data: object): void;
    listItemDelete(data: object): void;
    listItemComplete(data: object): void;
    listItemUncomplete(data: object): void;
}
