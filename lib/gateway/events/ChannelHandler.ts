import { GatewayEventHandler } from "./GatewayEventHandler";
import { Channel } from "../../structures/Channel";
import { GatewayEvent_TeamChannelCreated, GatewayEvent_TeamChannelDeleted, GatewayEvent_TeamChannelUpdated } from "guildedapi-types.ts/v1";

export class ChannelHandler extends GatewayEventHandler{
    channelCreate(data: GatewayEvent_TeamChannelCreated): void {
        const ChannelComponent = new Channel(data.channel, this.client);
        this.client.emit("channelCreate", ChannelComponent);
    }

    channelUpdate(data: GatewayEvent_TeamChannelUpdated): void {
        const ChannelComponent = new Channel(data.channel, this.client);
        this.client.emit("channelUpdate", ChannelComponent);
    }

    channelDelete(data: GatewayEvent_TeamChannelDeleted): void {
        const ChannelComponent = new Channel(data.channel, this.client);
        this.client.emit("channelDelete", ChannelComponent);
    }
}
