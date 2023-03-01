/** @module DocHandler */
import { GatewayEventHandler } from "./GatewayEventHandler";
import { Doc } from "../../structures/Doc";
import {
    GatewayEvent_DocCommentCreated,
    GatewayEvent_DocCommentDeleted,
    GatewayEvent_DocCommentReactionCreated,
    GatewayEvent_DocCommentReactionDeleted,
    GatewayEvent_DocCommentUpdated,
    GatewayEvent_DocCreated,
    GatewayEvent_DocDeleted,
    GatewayEvent_DocReactionCreated,
    GatewayEvent_DocReactionDeleted,
    GatewayEvent_DocUpdated
} from "../../Constants";
import { DocChannel } from "../../structures/DocChannel";
import { DocReactionInfo } from "../../structures/DocReactionInfo";
import { DocComment } from "../../structures/DocComment";

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
        const CachedDoc = channel?.docs.get(data.doc.id)?.toJSON() ?? null;
        const DocComponent = channel?.docs.update(data.doc) ?? new Doc(data.doc, this.client);
        this.client.emit("docUpdate", DocComponent, CachedDoc);
    }

    docDelete(data: GatewayEvent_DocDeleted): void {
        void this.addGuildChannel(data.serverId, data.doc.channelId);
        const channel = this.client.getChannel<DocChannel>(data.serverId, data.doc.channelId);
        const DocComponent = channel?.docs.update(data.doc) ?? new Doc(data.doc, this.client);
        channel?.docs.delete(data.doc.id);
        this.client.emit("docDelete", DocComponent);
    }

    docReactionAdd(data: GatewayEvent_DocReactionCreated): void {
        void this.addGuildChannel(data.serverId, data.reaction.channelId, data.reaction.docId);
        const reactionInfo = new DocReactionInfo(data, this.client);
        this.client.emit("reactionAdd", reactionInfo);
    }

    docReactionRemove(data: GatewayEvent_DocReactionDeleted): void {
        void this.addGuildChannel(data.serverId, data.reaction.channelId, data.reaction.docId);
        const reactionInfo = new DocReactionInfo(data, this.client);
        this.client.emit("reactionRemove", reactionInfo);
    }

    docCommentReactionAdd(data: GatewayEvent_DocCommentReactionCreated): void {
        void this.addGuildChannel(data.serverId, data.reaction.channelId, data.reaction.docId);
        const reactionInfo = new DocReactionInfo(data, this.client);
        this.client.emit("reactionAdd", reactionInfo);
    }

    docCommentReactionRemove(data: GatewayEvent_DocCommentReactionDeleted): void {
        void this.addGuildChannel(data.serverId, data.reaction.channelId, data.reaction.docId);
        const reactionInfo = new DocReactionInfo(data, this.client);
        this.client.emit("reactionRemove", reactionInfo);
    }

    docCommentCreate(data: GatewayEvent_DocCommentCreated): void {
        void this.addGuildChannel(data.serverId, data.docComment.channelId, data.docComment.docId);
        const channel = this.client.getChannel<DocChannel>(data.serverId, data.docComment.channelId);
        const comment = channel?.docs.get(data.docComment.docId)?.comments.update(data.docComment) ?? new DocComment(data.docComment, this.client, { guildID: data.serverId });
        this.client.emit("docCommentCreate", comment);
    }

    docCommentUpdate(data: GatewayEvent_DocCommentUpdated): void {
        void this.addGuildChannel(data.serverId, data.docComment.channelId, data.docComment.docId);
        const channel = this.client.getChannel<DocChannel>(data.serverId, data.docComment.channelId);
        const cachedComment = channel?.docs.get(data.docComment.docId)?.comments.get(data.docComment.id)?.toJSON() ?? null;
        const comment = channel?.docs.get(data.docComment.docId)?.comments.update(data.docComment) ?? new DocComment(data.docComment, this.client, { guildID: data.serverId });
        this.client.emit("docCommentUpdate", comment, cachedComment);
    }

    docCommentDelete(data: GatewayEvent_DocCommentDeleted): void {
        void this.addGuildChannel(data.serverId, data.docComment.channelId, data.docComment.docId);
        const channel = this.client.getChannel<DocChannel>(data.serverId, data.docComment.channelId);
        const comment = channel?.docs.get(data.docComment.docId)?.comments.update(data.docComment) ?? new DocComment(data.docComment, this.client, { guildID: data.serverId });
        this.client.emit("docCommentDelete", comment);
    }

    private async addGuildChannel(guildID: string, channelID: string, docID?: number): Promise<void> {
        /** OLD */
        // if (this.client.getChannel(guildID, channelID) !== undefined) return;
        // const channel = await this.client.rest.channels.getChannel(channelID);
        // const guild = this.client.guilds.get(guildID);
        // guild?.channels?.add(channel);

        const guild = this.client.guilds.get(guildID);
        if (this.client.getChannel(guildID, channelID) === undefined) {
            const channel = await this.client.rest.channels.getChannel(channelID).catch(err => this.client.emit("warn", `Cannot register channel to cache due to: (${String(err)})`));
            if (typeof channel !== "boolean") guild?.channels.add(channel);
        }
        const conditions = this.client.getChannel(guildID, channelID) !== undefined && this.client.getChannel<DocChannel>(guildID, channelID)?.docs.get(docID as number) === undefined;
        if (guildID && channelID && docID && conditions) {
            const restDoc = await this.client.rest.channels.getDoc(channelID, docID as number).catch(err => this.client.emit("warn", `Cannot register doc to cache due to: (${String(err)})`));
            const channel = guild?.channels.get(channelID) as DocChannel;
            if (typeof restDoc !== "boolean") channel?.docs.add(restDoc);
        }
    }
}
