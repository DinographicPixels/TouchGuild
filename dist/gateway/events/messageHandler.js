"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageHandler = void 0;
const Message_1 = require("../../structures/Message");
const GatewayEventHandler_1 = require("./GatewayEventHandler");
class MessageHandler extends GatewayEventHandler_1.GatewayEventHandler {
    messageCreate(data) {
        var MessageComponent = new Message_1.Message(data, this.client);
        this.client.cache.set(`messageContent_${MessageComponent['id']}`, MessageComponent['content']);
        return this.client.emit('messageCreate', MessageComponent);
    }
    messageUpdate(data) {
        var MessageComponent = new Message_1.Message(data, this.client);
        var cacheHasOldContent = this.client.cache.has(`messageContent_${MessageComponent['id']}`);
        if (cacheHasOldContent) {
            MessageComponent.oldContent = this.client.cache.get(`messageContent_${MessageComponent['id']}`);
            this.client.cache.set(`messageContent_${MessageComponent['id']}`, MessageComponent['content']);
        }
        return this.client.emit('messageUpdate', MessageComponent);
    }
    messageDelete(data) {
        var MessageComponent = new Message_1.Message(data, this.client);
        var cacheHasContent = this.client.cache.has(`messageContent_${MessageComponent['id']}`);
        if (cacheHasContent) {
            this.client.cache.delete(`messageContent_${MessageComponent['id']}`);
        }
        return this.client.emit('messageDelete', MessageComponent);
    }
}
exports.MessageHandler = MessageHandler;
