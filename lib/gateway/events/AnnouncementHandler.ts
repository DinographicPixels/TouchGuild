/** @module AnnouncementHandler */
import { GatewayEventHandler } from "./GatewayEventHandler";
import { Announcement } from "../../structures/Announcement";
import { AnnouncementChannel } from "../../structures/AnnouncementChannel";
import { AnnouncementComment } from "../../structures/AnnouncementComment";
import { AnnouncementReactionInfo } from "../../structures/AnnouncementReactionInfo";
import {
    GatewayEvent_AnnouncementCommentCreated,
    GatewayEvent_AnnouncementCommentDeleted,
    GatewayEvent_AnnouncementCommentReactionCreated,
    GatewayEvent_AnnouncementCommentReactionDeleted,
    GatewayEvent_AnnouncementCommentUpdated,
    GatewayEvent_AnnouncementCreated,
    GatewayEvent_AnnouncementDeleted,
    GatewayEvent_AnnouncementReactionCreated,
    GatewayEvent_AnnouncementReactionDeleted,
    GatewayEvent_AnnouncementUpdated
} from "guildedapi-types.ts/v1";

/** Internal component, emitting announcement events. */
export class AnnouncementHandler extends GatewayEventHandler {
    announcementCreate(data: GatewayEvent_AnnouncementCreated): boolean {
        void this.addGuildChannel(data.serverId, data.announcement.channelId);
        const channel = this.client.getChannel<AnnouncementChannel>(data.serverId, data.announcement.channelId);
        const AnnouncementComponent = channel?.announcements?.update(data.announcement) ?? new Announcement(data.announcement, this.client);
        return this.client.emit("announcementCreate", AnnouncementComponent);
    }

    announcementUpdate(data: GatewayEvent_AnnouncementUpdated): boolean {
        void this.addGuildChannel(data.serverId, data.announcement.channelId);
        const channel = this.client.getChannel<AnnouncementChannel>(data.serverId, data.announcement.channelId);
        const CachedAnnouncement = channel?.announcements.get(data.announcement.id)?.toJSON() ?? null;
        const AnnouncementComponent = channel?.announcements?.update(data.announcement) ?? new Announcement(data.announcement, this.client);
        return this.client.emit("announcementUpdate", AnnouncementComponent, CachedAnnouncement);
    }

    announcementDelete(data: GatewayEvent_AnnouncementDeleted): boolean {
        void this.addGuildChannel(data.serverId, data.announcement.channelId);
        const channel = this.client.getChannel<AnnouncementChannel>(data.serverId, data.announcement.channelId);
        const AnnouncementComponent = channel?.announcements?.update(data.announcement) ?? new Announcement(data.announcement, this.client);
        channel?.announcements.delete(data.announcement.id);
        return this.client.emit("announcementDelete", AnnouncementComponent);
    }

    announcementCommentCreate(data: GatewayEvent_AnnouncementCommentCreated): boolean {
        void this.addGuildChannel(data.serverId, data.announcementComment.channelId, data.announcementComment.announcementId);
        const channel = this.client.getChannel<AnnouncementChannel>(data.serverId, data.announcementComment.channelId);
        const comment = channel?.announcements.get(data.announcementComment.announcementId)?.comments.update(data.announcementComment) ?? new AnnouncementComment(data.announcementComment, this.client, { guildID: data.serverId });
        return this.client.emit("announcementCommentCreate", comment);
    }

    announcementCommentUpdate(data: GatewayEvent_AnnouncementCommentUpdated): boolean {
        void this.addGuildChannel(data.serverId, data.announcementComment.channelId, data.announcementComment.announcementId);
        const channel = this.client.getChannel<AnnouncementChannel>(data.serverId, data.announcementComment.channelId);
        const cachedComment = channel?.announcements.get(data.announcementComment.announcementId)?.comments.get(data.announcementComment.id)?.toJSON() ?? null;
        const comment = channel?.announcements.get(data.announcementComment.announcementId)?.comments.update(data.announcementComment) ?? new AnnouncementComment(data.announcementComment, this.client, { guildID: data.serverId });
        return this.client.emit("announcementCommentUpdate", comment, cachedComment);
    }

    announcementCommentDelete(data: GatewayEvent_AnnouncementCommentDeleted): boolean {
        void this.addGuildChannel(data.serverId, data.announcementComment.channelId, data.announcementComment.announcementId);
        const channel = this.client.getChannel<AnnouncementChannel>(data.serverId, data.announcementComment.channelId);
        const comment = channel?.announcements.get(data.announcementComment.announcementId)?.comments.update(data.announcementComment) ?? new AnnouncementComment(data.announcementComment, this.client, { guildID: data.serverId });
        return this.client.emit("announcementCommentDelete", comment);
    }

    announcementReactionAdd(data: GatewayEvent_AnnouncementReactionCreated): boolean {
        if (data.serverId) void this.addGuildChannel(data.serverId, data.reaction.channelId, data.reaction.announcementId);
        const ReactionInfo = new AnnouncementReactionInfo(data, this.client);
        return this.client.emit("reactionAdd", ReactionInfo);
    }

    announcementReactionRemove(data: GatewayEvent_AnnouncementReactionDeleted): boolean {
        if (data.serverId) void this.addGuildChannel(data.serverId, data.reaction.channelId, data.reaction.announcementId);
        const ReactionInfo = new AnnouncementReactionInfo(data, this.client);
        return this.client.emit("reactionRemove", ReactionInfo);
    }

    announcementCommentReactionAdd(data: GatewayEvent_AnnouncementCommentReactionCreated): boolean {
        if (data.serverId) void this.addGuildChannel(data.serverId, data.reaction.channelId, data.reaction.announcementId);
        const ReactionInfo = new AnnouncementReactionInfo(data, this.client);
        return this.client.emit("reactionAdd", ReactionInfo);
    }

    announcementCommentReactionRemove(data: GatewayEvent_AnnouncementCommentReactionDeleted): boolean {
        if (data.serverId) void this.addGuildChannel(data.serverId, data.reaction.channelId, data.reaction.announcementId);
        const ReactionInfo = new AnnouncementReactionInfo(data, this.client);
        return this.client.emit("reactionRemove", ReactionInfo);
    }

    private async addGuildChannel(guildID: string, channelID: string, announcementID?: string): Promise<void> {
        const guild = this.client.guilds.get(guildID);
        if (this.client.getChannel(guildID, channelID) === undefined) {
            const channel = await this.client.rest.channels.getChannel(channelID).catch(err => this.client.emit("warn", `Cannot register channel to cache due to: (${String(err)})`));
            if (typeof channel !== "boolean") guild?.channels.add(channel);
        }
        const conditions = this.client.getChannel(guildID, channelID) !== undefined && this.client.getChannel<AnnouncementChannel>(guildID, channelID)?.announcements.get(announcementID as string) === undefined;
        if (guildID && channelID && announcementID && conditions) {
            const restAnnouncement = await this.client.rest.channels.getAnnouncement(channelID, announcementID).catch(err => this.client.emit("warn", `Cannot register doc to cache due to: (${String(err)})`));
            const channel = guild?.channels.get(channelID) as AnnouncementChannel;
            if (typeof restAnnouncement !== "boolean") channel?.announcements.add(restAnnouncement);
        }
    }
}
