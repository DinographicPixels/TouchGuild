"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GatewayHandler = void 0;
const ChannelHandler_1 = require("./events/ChannelHandler");
const MessageHandler_1 = require("./events/MessageHandler");
class GatewayHandler {
    constructor(client) {
        this.client = client;
        this.messageHandler = new MessageHandler_1.MessageHandler(this.client);
        this.channelHandler = new ChannelHandler_1.ChannelHandler(this.client);
    }
    handleMessage(eventType, eventData) {
        if (this.client.identifiers.Message[eventType]) {
            if (eventType == 'ChatMessageCreated') {
                this.messageHandler.messageCreate(eventData);
            }
            else if (eventType == 'ChatMessageUpdated') {
                this.messageHandler.messageUpdate(eventData);
            }
            else if (eventType == 'ChatMessageDeleted') {
                this.messageHandler.messageDelete(eventData);
            }
        }
        else if (this.client.identifiers.Channel[eventType]) {
            if (eventType == 'TeamChannelCreated') {
                this.channelHandler.channelCreate(eventData);
            }
            else if (eventType == 'TeamChannelUpdated') {
                this.channelHandler.channelUpdate(eventData);
            }
            else if (eventType == 'TeamChannelDeleted') {
                this.channelHandler.channelDelete(eventData);
            }
        }
    }
}
exports.GatewayHandler = GatewayHandler;
