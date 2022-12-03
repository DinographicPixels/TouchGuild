/** @module DocHandler */
import { GatewayEventHandler } from "./GatewayEventHandler";
import { Doc } from "../../structures/Doc";
import { GatewayEvent_DocCreated, GatewayEvent_DocDeleted, GatewayEvent_DocUpdated } from "../../Constants";
import { DocChannel } from "../../structures/DocChannel";

/** Internal component, emitting doc events. */
export class DocHandler extends GatewayEventHandler {
    docCreate(data: GatewayEvent_DocCreated): void {
        void this.addGuildChannel(data.serverId, data.doc.channelId);
        const channel = this.client.getChannel<DocChannel>(data.serverId, data.doc.channelId);
        const DocComponent = channel?.docs.update(data.doc) ?? new Doc(data.doc, this.client);
        this.client.emit("docCreate", DocComponent);
    }

    docUpdate(data: GatewayEvent_DocUpdated): void {
        void this.addGuildChannel(data.serverId, data.doc.channelId);
        const channel = this.client.getChannel<DocChannel>(data.serverId, data.doc.channelId);
        const DocComponent = channel?.docs.update(data.doc) ?? new Doc(data.doc, this.client);
        this.client.emit("docUpdate", DocComponent);
    }

    docDelete(data: GatewayEvent_DocDeleted): void {
        void this.addGuildChannel(data.serverId, data.doc.channelId);
        const channel = this.client.getChannel<DocChannel>(data.serverId, data.doc.channelId);
        const DocComponent = channel?.docs.update(data.doc) ?? new Doc(data.doc, this.client);
        channel?.docs.delete(data.doc.id);
        this.client.emit("docDelete", DocComponent);
    }

    private async addGuildChannel(guildID: string, channelID: string): Promise<void> {
        if (this.client.getChannel(guildID, channelID) !== undefined) return;
        const channel = await this.client.rest.channels.getChannel(channelID);
        const guild = this.client.guilds.get(guildID);
        guild?.channels?.add(channel);
    }
}
