"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebhookHandler = void 0;
const Webhook_1 = require("../../structures/Webhook");
const GatewayEventHandler_1 = require("./GatewayEventHandler");
class WebhookHandler extends GatewayEventHandler_1.GatewayEventHandler {
    webhooksCreate(data) {
        var WebhookComponent = new Webhook_1.Webhook(data['webhook'], this.client);
        this.client.emit('webhooksCreate', WebhookComponent);
    }
    webhooksUpdate(data) {
        var WebhookComponent = new Webhook_1.Webhook(data['webhook'], this.client);
        this.client.emit('webhooksUpdate', WebhookComponent);
    }
}
exports.WebhookHandler = WebhookHandler;
