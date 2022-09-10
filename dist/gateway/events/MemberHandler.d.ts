import { GatewayEventHandler } from "./GatewayEventHandler";
export declare class MemberHandler extends GatewayEventHandler {
    guildBanAdd(data: object): void;
    guildBanRemove(data: object): void;
}
