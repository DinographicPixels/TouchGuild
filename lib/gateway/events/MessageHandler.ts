/** @module MessageHandler */
import { GatewayEventHandler } from "./GatewayEventHandler";
import { Message } from "../../structures/Message";
import { MessageReactionInfo } from "../../structures/MessageReactionInfo";
import {
    GatewayEvent_ChannelMessageReactionAdded,
    GatewayEvent_ChannelMessageReactionDeleted,
    GatewayEvent_ChatMessageCreated,
    GatewayEvent_ChatMessageDeleted,
    GatewayEvent_ChatMessageUpdated
} from "../../Constants";

/** Internal component, emitting message events. */
export class MessageHandler extends GatewayEventHandler{
    messageCreate(data: GatewayEvent_ChatMessageCreated): boolean {
        const MessageComponent = new Message(data.message, this.client);
        this.client.cache.messages.add(MessageComponent);
        return this.client.emit("messageCreate", MessageComponent);
    }

    messageUpdate(data: GatewayEvent_ChatMessageUpdated): boolean {
        const CachedMessage = this.client.cache.messages.get(data.message.id);
        let MessageComponent: Message;
        if (CachedMessage){
            MessageComponent = new Message(data.message, this.client, { oldMessage: this.client.cache.messages.get(data.message.id) });
            this.client.cache.messages.add(MessageComponent);
        } else {
            MessageComponent = new Message(data.message, this.client);
            this.client.cache.messages.add(MessageComponent);
        }
        return this.client.emit("messageUpdate", MessageComponent);
    }

    messageDelete(data: GatewayEvent_ChatMessageDeleted): boolean {
        const CachedMessage = this.client.cache.messages.get(data.message.id);
        let MessageComponent: Message;
        if (CachedMessage){
            MessageComponent = new Message(data.message as keyof object, this.client, { oldMessage: this.client.cache.messages.get(data.message.id) });
            this.client.cache.messages.delete(data.message.id);
        } else {
            MessageComponent = new Message(data.message as keyof object, this.client);
            this.client.cache.messages.add(MessageComponent);
        }
        return this.client.emit("messageDelete", MessageComponent);
    }

    messageReactionAdd(data: GatewayEvent_ChannelMessageReactionAdded): boolean {
        const ReactionInfo = new MessageReactionInfo(data, this.client);
        return this.client.emit("reactionAdd", ReactionInfo);
    }

    messageReactionRemove(data: GatewayEvent_ChannelMessageReactionDeleted): boolean {
        const ReactionInfo = new MessageReactionInfo(data, this.client);
        return this.client.emit("reactionRemove", ReactionInfo);
    }
}
