"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChannelHandler = void 0;
const Channel_1 = require("../../structures/Channel");
const GatewayEventHandler_1 = require("./GatewayEventHandler");
class ChannelHandler extends GatewayEventHandler_1.GatewayEventHandler {
    channelCreate(data) {
        var ChannelComponent = new Channel_1.Channel(data, this.client);
        this.client.emit('channelCreate', ChannelComponent);
    }
    channelUpdate(data) {
        var ChannelComponent = new Channel_1.Channel(data, this.client);
        this.client.emit('channelUpdate', ChannelComponent);
    }
    channelDelete(data) {
        var ChannelComponent = new Channel_1.Channel(data, this.client);
        this.client.emit('channelDelete', ChannelComponent);
    }
}
exports.ChannelHandler = ChannelHandler;
