import { Guild } from "../../structures/Guild";
import { Member } from "../../structures/Member";
import { Message } from "../../structures/Message";
import { GatewayEventHandler } from "./GatewayEventHandler";
export declare class MessageHandler extends GatewayEventHandler {
    messageCreate(data: object): Promise<boolean>;
    messageUpdate(data: object): boolean;
    messageDelete(data: object): boolean;
    messageReactionAdd(data: messageReactionRawTypes | any): boolean;
    messageReactionRemove(data: messageReactionRawTypes | any): boolean;
}
declare type messageReactionRawTypes = {
    serverId: string;
    reaction: {
        channelId: string;
        messageId: string;
        createdBy: string;
        emote: {
            id: number | string;
            name: string;
            url: string;
        };
    };
};
export declare type messageReactionTypes = {
    message: Message | {
        id: string;
        guild: Guild | {
            id: string;
        };
        channelID: string;
    };
    emoji: emojiTypes;
    reactor: Member | {
        id: string;
    };
};
export declare type emojiTypes = {
    id: number | string;
    name: string;
    url: string;
};
export {};
