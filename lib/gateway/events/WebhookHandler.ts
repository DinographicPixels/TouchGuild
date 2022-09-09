import { BannedMember } from "../../structures/BannedMember";
import { Client } from "../../structures/Client";
import { Guild } from "../../structures/Guild";
import { Member } from "../../structures/Member";
import { Webhook } from "../../structures/Webhook";
import { GatewayEventHandler } from "./GatewayEventHandler";

export class WebhookHandler extends GatewayEventHandler{
    webhooksCreate(data: object){
        var WebhookComponent = new Webhook(data['webhook' as keyof object], this.client);
        this.client.emit('webhooksCreate', WebhookComponent);
    }

    webhooksUpdate(data: object){
        var WebhookComponent = new Webhook(data['webhook' as keyof object], this.client);
        this.client.emit('webhooksUpdate', WebhookComponent);
    }
}