import { GatewayEventHandler } from "./GatewayEventHandler";
export declare class ForumTopicHandler extends GatewayEventHandler {
    topicCreate(data: object): void;
    topicUpdate(data: object): void;
    topicDelete(data: object): void;
    topicPin(data: object): void;
    topicUnpin(data: object): void;
}
