import { GatewayEventHandler } from "./GatewayEventHandler";
import { Webhook } from "../../structures/Webhook";
import { GatewayEvent_TeamWebhookCreated, GatewayEvent_TeamWebhookUpdated } from "guildedapi-types.ts/v1";

export class WebhookHandler extends GatewayEventHandler{
    webhooksCreate(data: GatewayEvent_TeamWebhookCreated): void {
        const WebhookComponent = new Webhook(data.webhook, this.client);
        this.client.emit("webhooksCreate", WebhookComponent);
    }

    webhooksUpdate(data: GatewayEvent_TeamWebhookUpdated): void {
        const WebhookComponent = new Webhook(data.webhook, this.client);
        this.client.emit("webhooksUpdate", WebhookComponent);
    }
}
