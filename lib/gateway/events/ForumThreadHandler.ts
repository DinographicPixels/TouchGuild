/** @module ForumThreadHandler */
import { GatewayEventHandler } from "./GatewayEventHandler";
import { ForumThread } from "../../structures/ForumThread";
import { ForumThreadComment } from "../../structures/ForumThreadComment";
import { ForumThreadReactionInfo } from "../../structures/ForumThreadReactionInfo";
import {
    GatewayEvent_ForumTopicCommentCreated,
    GatewayEvent_ForumTopicCommentDeleted,
    GatewayEvent_ForumTopicCommentReactionCreated,
    GatewayEvent_ForumTopicCommentReactionDeleted,
    GatewayEvent_ForumTopicCommentUpdated,
    GatewayEvent_ForumTopicCreated,
    GatewayEvent_ForumTopicDeleted,
    GatewayEvent_ForumTopicLocked,
    GatewayEvent_ForumTopicPinned,
    GatewayEvent_ForumTopicReactionCreated,
    GatewayEvent_ForumTopicReactionDeleted,
    GatewayEvent_ForumTopicUnlocked,
    GatewayEvent_ForumTopicUnpinned,
    GatewayEvent_ForumTopicUpdated
} from "../../Constants";
import { ForumChannel } from "../../structures/ForumChannel";

/** Internal component, emitting forum thread events. */
export class ForumThreadHandler extends GatewayEventHandler {
    forumThreadCreate(data: GatewayEvent_ForumTopicCreated): boolean {
        void this.addGuildChannel(data.serverId, data.forumTopic.channelId);
        const channel = this.client.getChannel<ForumChannel>(data.serverId, data.forumTopic.channelId);
        const Thread = channel?.threads?.update(data.forumTopic) ?? new ForumThread(data.forumTopic, this.client);
        channel?.threads?.add(Thread);
        return this.client.emit("forumThreadCreate", Thread);
    }

    forumThreadUpdate(data: GatewayEvent_ForumTopicUpdated): boolean {
        void this.addGuildChannel(data.serverId, data.forumTopic.channelId);
        const channel = this.client.getChannel<ForumChannel>(data.serverId, data.forumTopic.channelId);
        const CachedThread = channel?.threads.get(data.forumTopic.id)?.toJSON() ?? null;
        const Thread = channel?.threads?.update(data.forumTopic) ?? new ForumThread(data.forumTopic, this.client);
        return this.client.emit("forumThreadUpdate", Thread, CachedThread);
    }

    forumThreadDelete(data: GatewayEvent_ForumTopicDeleted): boolean {
        void this.addGuildChannel(data.serverId, data.forumTopic.channelId);
        const channel = this.client.getChannel<ForumChannel>(data.serverId, data.forumTopic.channelId);
        const Thread = channel?.threads?.update(data.forumTopic) ?? new ForumThread(data.forumTopic, this.client);
        channel?.threads?.delete(Thread.id);
        return this.client.emit("forumThreadDelete", Thread);
    }

    forumThreadPin(data: GatewayEvent_ForumTopicPinned): boolean {
        void this.addGuildChannel(data.serverId, data.forumTopic.channelId);
        const channel = this.client.getChannel<ForumChannel>(data.serverId, data.forumTopic.channelId);
        const Thread = channel?.threads.update(data.forumTopic) ?? new ForumThread(data.forumTopic, this.client);
        return this.client.emit("forumThreadPin", Thread);
    }

    forumThreadUnpin(data: GatewayEvent_ForumTopicUnpinned): boolean {
        void this.addGuildChannel(data.serverId, data.forumTopic.channelId);
        const channel = this.client.getChannel<ForumChannel>(data.serverId, data.forumTopic.channelId);
        const Thread = channel?.threads.update(data.forumTopic) ?? new ForumThread(data.forumTopic, this.client);
        return this.client.emit("forumThreadUnpin", Thread);
    }

    forumThreadCommentCreate(data: GatewayEvent_ForumTopicCommentCreated): boolean {
        void this.addGuildChannel(data.serverId, data.forumTopicComment.channelId, data.forumTopicComment.forumTopicId);
        const channel = this.client.getChannel<ForumChannel>(data.serverId, data.forumTopicComment.channelId);
        const cachedTC = channel?.threads.get(data.forumTopicComment.forumTopicId)?.comments.update(data.forumTopicComment);
        const ThreadComment = cachedTC ?? new ForumThreadComment(data.forumTopicComment, this.client, { guildID: data.serverId });
        channel?.threads?.get(data.forumTopicComment.forumTopicId)?.comments.add(ThreadComment);
        return this.client.emit("forumCommentCreate", ThreadComment);
    }

    forumThreadCommentUpdate(data: GatewayEvent_ForumTopicCommentUpdated): boolean {
        void this.addGuildChannel(data.serverId, data.forumTopicComment.channelId, data.forumTopicComment.forumTopicId);
        const channel = this.client.getChannel<ForumChannel>(data.serverId, data.forumTopicComment.channelId);
        const CachedComment = channel?.threads.get(data.forumTopicComment.forumTopicId)?.comments.get(data.forumTopicComment.id)?.toJSON() ?? null;
        const cachedTC = channel?.threads.get(data.forumTopicComment.forumTopicId)?.comments.update(data.forumTopicComment);
        const ThreadComment = cachedTC ?? new ForumThreadComment(data.forumTopicComment, this.client, { guildID: data.serverId });
        return this.client.emit("forumCommentUpdate", ThreadComment, CachedComment);
    }

    forumThreadCommentDelete(data: GatewayEvent_ForumTopicCommentDeleted): boolean {
        void this.addGuildChannel(data.serverId, data.forumTopicComment.channelId, data.forumTopicComment.forumTopicId);
        const channel = this.client.getChannel<ForumChannel>(data.serverId, data.forumTopicComment.channelId);
        const cachedTC = channel?.threads.get(data.forumTopicComment.forumTopicId)?.comments.update(data.forumTopicComment);
        const ThreadComment = cachedTC ?? new ForumThreadComment(data.forumTopicComment, this.client, { guildID: data.serverId });
        channel?.threads?.get(data.forumTopicComment.forumTopicId)?.comments.delete(ThreadComment.id);
        return this.client.emit("forumCommentDelete", ThreadComment);
    }

    forumThreadLock(data: GatewayEvent_ForumTopicLocked): boolean {
        void this.addGuildChannel(data.forumTopic.serverId, data.forumTopic.channelId);
        const channel = this.client.getChannel<ForumChannel>(data.forumTopic.serverId, data.forumTopic.channelId);
        const Thread = channel?.threads.update(data.forumTopic) ?? new ForumThread(data.forumTopic, this.client);
        return this.client.emit("forumThreadLock", Thread);
    }

    forumThreadUnlock(data: GatewayEvent_ForumTopicUnlocked): boolean {
        void this.addGuildChannel(data.forumTopic.serverId, data.forumTopic.channelId);
        const channel = this.client.getChannel<ForumChannel>(data.forumTopic.serverId, data.forumTopic.channelId);
        const Thread = channel?.threads.update(data.forumTopic) ?? new ForumThread(data.forumTopic, this.client);
        return this.client.emit("forumThreadUnlock", Thread);
    }

    forumThreadReactionAdd(data: GatewayEvent_ForumTopicReactionCreated): boolean {
        if (data.serverId) void this.addGuildChannel(data.serverId, data.reaction.channelId);
        const ReactionInfo = new ForumThreadReactionInfo(data, this.client);
        return this.client.emit("reactionAdd", ReactionInfo);
    }

    forumThreadReactionRemove(data: GatewayEvent_ForumTopicReactionDeleted): boolean {
        if (data.serverId) void this.addGuildChannel(data.serverId, data.reaction.channelId);
        const ReactionInfo = new ForumThreadReactionInfo(data, this.client);
        return this.client.emit("reactionRemove", ReactionInfo);
    }

    forumThreadCommentReactionAdd(data: GatewayEvent_ForumTopicCommentReactionCreated): boolean {
        if (data.serverId) void this.addGuildChannel(data.serverId, data.reaction.channelId);
        const ReactionInfo = new ForumThreadReactionInfo(data, this.client);
        return this.client.emit("reactionAdd", ReactionInfo);
    }

    forumThreadCommentReactionRemove(data: GatewayEvent_ForumTopicCommentReactionDeleted): boolean {
        if (data.serverId) void this.addGuildChannel(data.serverId, data.reaction.channelId);
        const ReactionInfo = new ForumThreadReactionInfo(data, this.client);
        return this.client.emit("reactionRemove", ReactionInfo);
    }

    private async addGuildChannel(guildID: string, channelID: string, threadID?: number): Promise<void> {
        const guild = this.client.guilds.get(guildID);
        if (this.client.getChannel(guildID, channelID) === undefined) {
            const channel = await this.client.rest.channels.getChannel(channelID);
            guild?.channels?.add(channel);
        }
        const conditions = this.client.getChannel(guildID, channelID) !== undefined && this.client.getChannel<ForumChannel>(guildID, channelID)?.threads.get(threadID as number) === undefined;
        if (guildID && channelID && threadID && conditions) {
            const restThread = await this.client.rest.channels.getForumThread(channelID, threadID as number);
            const channel = guild?.channels.get(channelID) as ForumChannel;
            channel?.threads.add(restThread);
        }
        // const guild = this.client.guilds.get(guildID);
        // const restThread = await this.client.rest.channels.getForumThread(channelID, threadID as number);
        // guild?.channels.get(channelID)?.threads?.add(restThread);
    }

    // private async addChannelThread(guildID: string, channelID: string, threadID: number): Promise<void> {
    //     await this.addGuildChannel(guildID, channelID);
    //     if (this.client.getChannel(guildID, channelID)?.threads.get(threadID) !== undefined) return;
    //     const channel = this.client.guilds.get(guildID)?.channels.get(channelID);
    //     const restThread = await this.client.rest.channels.getForumThread(channelID, threadID);
    //     if (channel?.threads instanceof TypedCollection) channel.threads.add(channel.threads.update(restThread));
    // }
}
