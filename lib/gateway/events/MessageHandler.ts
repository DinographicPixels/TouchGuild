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
import { TextChannel } from "../../structures/TextChannel";

/** Internal component, emitting message events. */
export class MessageHandler extends GatewayEventHandler {
    messageCreate(data: GatewayEvent_ChatMessageCreated): boolean {
        void this.addGuildChannel(data.serverId, data.message.channelId);
        const channel = this.client.getChannel<TextChannel>(data.serverId, data.message.channelId);
        const MessageComponent = channel?.messages?.update(data.message) ?? new Message(data.message, this.client);
        return this.client.emit("messageCreate", MessageComponent);
    }

    messageUpdate(data: GatewayEvent_ChatMessageUpdated): boolean {
        void this.addGuildChannel(data.serverId, data.message.channelId);
        const channel = this.client.getChannel<TextChannel>(data.serverId, data.message.channelId);
        const CachedMessage = channel?.messages?.get(data.message.id)?.toJSON() ?? null;
        const MessageComponent = channel?.messages?.update(data.message) ?? new Message(data.message, this.client);
        return this.client.emit("messageUpdate", MessageComponent, CachedMessage);
    }

    messageDelete(data: GatewayEvent_ChatMessageDeleted): boolean {
        void this.addGuildChannel(data.serverId, data.message.channelId);
        const channel = this.client.getChannel<TextChannel>(data.serverId, data.message.channelId);
        const PU_Message = channel?.messages.update(data.message) ?? {
            id:        data.message.id,
            guildID:   data.serverId,
            channelID: data.message.channelId,
            deletedAt: new Date(data.message.deletedAt),
            isPrivate: data.message.isPrivate ?? null
        };
        channel?.messages?.delete(data.message.id);
        return this.client.emit("messageDelete", PU_Message);
    }

    messageReactionAdd(data: GatewayEvent_ChannelMessageReactionAdded): boolean {
        if (data.serverId) void this.addGuildChannel(data.serverId, data.reaction.channelId);
        const ReactionInfo = new MessageReactionInfo(data, this.client);
        return this.client.emit("reactionAdd", ReactionInfo);
    }

    messageReactionRemove(data: GatewayEvent_ChannelMessageReactionDeleted): boolean {
        if (data.serverId) void this.addGuildChannel(data.serverId, data.reaction.channelId);
        const ReactionInfo = new MessageReactionInfo(data, this.client);
        return this.client.emit("reactionRemove", ReactionInfo);
    }

    private async addGuildChannel(guildID: string, channelID: string): Promise<void> {
        if (this.client.getChannel(guildID, channelID) !== undefined) return;
        const channel = await this.client.rest.channels.getChannel(channelID);
        const guild = this.client.guilds.get(guildID);
        guild?.channels?.add(channel);
    }
}
