/** @module ChannelHandler */
import { GatewayEventHandler } from "./GatewayEventHandler";
import { Channel } from "../../structures/Channel";
import { GatewayEvent_ServerChannelCreated, GatewayEvent_ServerChannelDeleted, GatewayEvent_ServerChannelUpdated } from "../../Constants";

// Internal component, emitting channel events.
export class ChannelHandler extends GatewayEventHandler{
    channelCreate(data: GatewayEvent_ServerChannelCreated): void {
        const ChannelComponent = new Channel(data.channel, this.client);
        this.client.emit("channelCreate", ChannelComponent);
    }

    channelUpdate(data: GatewayEvent_ServerChannelUpdated): void {
        const ChannelComponent = new Channel(data.channel, this.client);
        this.client.emit("channelUpdate", ChannelComponent);
    }

    channelDelete(data: GatewayEvent_ServerChannelDeleted): void {
        const ChannelComponent = new Channel(data.channel, this.client);
        this.client.emit("channelDelete", ChannelComponent);
    }
}
