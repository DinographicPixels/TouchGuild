/** @module DocHandler */
import { GatewayEventHandler } from "./GatewayEventHandler";
import { Doc } from "../../structures/Doc";
import { GatewayEvent_DocCreated, GatewayEvent_DocDeleted, GatewayEvent_DocUpdated } from "../../Constants";

// Internal component, emitting doc events.
export class DocHandler extends GatewayEventHandler{
    docCreate(data: GatewayEvent_DocCreated): void {
        const DocComponent = new Doc(data.doc, this.client);
        this.client.emit("docCreate", DocComponent);
    }

    docUpdate(data: GatewayEvent_DocUpdated): void {
        const DocComponent = new Doc(data.doc, this.client);
        this.client.emit("docUpdate", DocComponent);
    }

    docDelete(data: GatewayEvent_DocDeleted): void {
        const DocComponent = new Doc(data.doc, this.client);
        this.client.emit("docDelete", DocComponent);
    }
}
