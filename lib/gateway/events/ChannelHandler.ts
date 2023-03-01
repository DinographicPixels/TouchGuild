/** @module ChannelHandler */
import { GatewayEventHandler } from "./GatewayEventHandler";
import { GatewayEvent_ServerChannelCreated, GatewayEvent_ServerChannelDeleted, GatewayEvent_ServerChannelUpdated } from "../../Constants";
import { AnyChannel } from "../../types/channel";

/** Internal component, emitting channel events. */
export class ChannelHandler extends GatewayEventHandler{
    channelCreate(data: GatewayEvent_ServerChannelCreated): void {
        void this.addGuildChannel(data.serverId, data.channel.id);
        const ChannelComponent = this.client.util.updateChannel(data.channel);
        this.client.emit("channelCreate", ChannelComponent);
    }

    channelUpdate(data: GatewayEvent_ServerChannelUpdated): void {
        void this.addGuildChannel(data.serverId, data.channel.id);
        const channel = this.client.getChannel<AnyChannel>(data.serverId, data.channel.id);
        const CachedChannel = channel ? channel.toJSON() : null;
        const ChannelComponent = this.client.util.updateChannel(data.channel);
        this.client.emit("channelUpdate", ChannelComponent, CachedChannel);
    }

    channelDelete(data: GatewayEvent_ServerChannelDeleted): void {
        const guild = this.client.guilds.get(data.serverId);
        const ChannelComponent = this.client.util.updateChannel(data.channel);
        guild?.channels.delete(data.channel.id);
        this.client.emit("channelDelete", ChannelComponent);
    }

    private async addGuildChannel(guildID: string, channelID: string): Promise<void> {
        if (this.client.getChannel(guildID, channelID) !== undefined) return;
        const channel = await this.client.rest.channels.getChannel(channelID).catch(err => this.client.emit("warn", `Cannot register channel to cache due to: (${String(err)})`));
        const guild = this.client.guilds.get(guildID);
        if (typeof channel !== "boolean") guild?.channels?.add(channel);
    }
}
