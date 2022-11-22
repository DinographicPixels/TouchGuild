/** @module ForumThreadHandler */
import { GatewayEventHandler } from "./GatewayEventHandler";
import { ForumThread } from "../../structures/ForumThread";
import { ForumThreadComment } from "../../structures/ForumThreadComment";
import { ForumThreadReactionInfo } from "../../structures/ForumThreadReactionInfo";
import {
    GatewayEvent_ForumTopicCommentCreated,
    GatewayEvent_ForumTopicCommentDeleted,
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

/** Internal component, emitting forum thread events. */
export class ForumThreadHandler extends GatewayEventHandler{
    forumThreadCreate(data: GatewayEvent_ForumTopicCreated): boolean {
        const Thread = new ForumThread(data.forumTopic, this.client);
        this.client.cache.forumThreads.add(Thread);
        return this.client.emit("forumThreadCreate", Thread);
    }

    forumThreadUpdate(data: GatewayEvent_ForumTopicUpdated): boolean {
        const Thread = new ForumThread(data.forumTopic, this.client);
        this.client.cache.forumThreads.add(Thread);
        return this.client.emit("forumThreadUpdate", Thread);
    }

    forumThreadDelete(data: GatewayEvent_ForumTopicDeleted): boolean {
        const Thread = new ForumThread(data.forumTopic, this.client);
        this.client.cache.forumThreads.delete(Thread.id);
        return this.client.emit("forumThreadDelete", Thread);
    }

    forumThreadPin(data: GatewayEvent_ForumTopicPinned): boolean {
        const Thread = new ForumThread(data.forumTopic, this.client);
        return this.client.emit("forumThreadPin", Thread);
    }

    forumThreadUnpin(data: GatewayEvent_ForumTopicUnpinned): boolean {
        const Thread = new ForumThread(data.forumTopic, this.client);
        return this.client.emit("forumThreadUnpin", Thread);
    }

    forumThreadCommentCreate(data: GatewayEvent_ForumTopicCommentCreated): boolean {
        const ThreadComment = new ForumThreadComment(data.forumTopicComment, this.client, { guildID: data.serverId });
        return this.client.emit("forumCommentCreate", ThreadComment);
    }

    forumThreadCommentUpdate(data: GatewayEvent_ForumTopicCommentUpdated): boolean {
        const ThreadComment = new ForumThreadComment(data.forumTopicComment, this.client, { guildID: data.serverId });
        return this.client.emit("forumCommentUpdate", ThreadComment);
    }

    forumThreadCommentDelete(data: GatewayEvent_ForumTopicCommentDeleted): boolean {
        const ThreadComment = new ForumThreadComment(data.forumTopicComment, this.client, { guildID: data.serverId });
        return this.client.emit("forumCommentDelete", ThreadComment);
    }

    forumThreadLock(data: GatewayEvent_ForumTopicLocked): boolean {
        const Thread = new ForumThread(data.forumTopic, this.client);
        return this.client.emit("forumThreadLock", Thread);
    }

    forumThreadUnlock(data: GatewayEvent_ForumTopicUnlocked): boolean {
        const Thread = new ForumThread(data.forumTopic, this.client);
        return this.client.emit("forumThreadUnlock", Thread);
    }

    forumThreadReactionAdd(data: GatewayEvent_ForumTopicReactionCreated): boolean {
        const ReactionInfo = new ForumThreadReactionInfo(data, this.client);
        return this.client.emit("reactionAdd", ReactionInfo);
    }

    forumThreadReactionRemove(data: GatewayEvent_ForumTopicReactionDeleted): boolean {
        const ReactionInfo = new ForumThreadReactionInfo(data, this.client);
        return this.client.emit("reactionRemove", ReactionInfo);
    }
}
