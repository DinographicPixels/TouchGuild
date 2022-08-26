import { Channel } from "../../structures/Channel";
import { GatewayEventHandler } from "./GatewayEventHandler";

export class ChannelHandler extends GatewayEventHandler{
    channelCreate(data: object){
        var ChannelComponent = new Channel(data, this.client);
        this.client.emit('channelCreate', ChannelComponent)
    }

    channelUpdate(data: object){
        var ChannelComponent = new Channel(data, this.client);
        this.client.emit('channelUpdate', ChannelComponent)
    }

    channelDelete(data: object){
        var ChannelComponent = new Channel(data, this.client);
        this.client.emit('channelDelete', ChannelComponent)
    }
}