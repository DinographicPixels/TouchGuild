import { GatewayEventHandler } from "./GatewayEventHandler";
import { ForumTopic } from "../../structures/ForumTopic";
import { ForumTopicComment } from "../../structures/ForumTopicComment";
import { Guild } from "../../structures/Guild";
import { Member } from "../../structures/Member";
import { forumTopicReactionInfo } from "../../tg-types/types";
import {
    GatewayEvent_ForumTopicCommentCreated,
    GatewayEvent_ForumTopicCommentDeleted,
    GatewayEvent_ForumTopicCommentUpdated,
    GatewayEvent_ForumTopicCreated,
    GatewayEvent_ForumTopicDeleted,
    GatewayEvent_ForumTopicPinned,
    GatewayEvent_ForumTopicReactionCreated,
    GatewayEvent_ForumTopicReactionDeleted,
    GatewayEvent_ForumTopicUnpinned,
    GatewayEvent_ForumTopicUpdated
} from "guildedapi-types.ts/v1";

export class ForumTopicHandler extends GatewayEventHandler{
    topicCreate(data: GatewayEvent_ForumTopicCreated): void {
        const ForumTopicComponent = new ForumTopic(data.forumTopic, this.client);
        this.client.cache.set(`forumTopicComponent_${ForumTopicComponent.id}`, ForumTopicComponent);
        this.client.emit("forumTopicCreate", ForumTopicComponent);
    }

    topicUpdate(data: GatewayEvent_ForumTopicUpdated): void {
        let ForumTopicComponent = new ForumTopic(data.forumTopic, this.client);
        const cacheHasOldTopic = this.client.cache.has(`forumTopicComponent_${ForumTopicComponent.id}`);
        if (cacheHasOldTopic){
            ForumTopicComponent = new ForumTopic(data.forumTopic, this.client);
            this.client.cache.set(`forumTopicComponent_${ForumTopicComponent.id}`, ForumTopicComponent);
        }
        this.client.emit("forumTopicUpdate", ForumTopicComponent);
    }

    topicDelete(data: GatewayEvent_ForumTopicDeleted): void {
        let ForumTopicComponent = new ForumTopic(data.forumTopic, this.client);
        const cacheHasOldTopic = this.client.cache.has(`forumTopicComponent_${ForumTopicComponent.id}`);
        if (cacheHasOldTopic){
            ForumTopicComponent = new ForumTopic(data.forumTopic, this.client);
            this.client.cache.set(`forumTopicComponent_${ForumTopicComponent.id}`, ForumTopicComponent);
        }
        this.client.emit("forumTopicDelete", ForumTopicComponent);
    }

    topicPin(data: GatewayEvent_ForumTopicPinned): void {
        const ForumTopicComponent = new ForumTopic(data.forumTopic, this.client);
        this.client.emit("forumTopicPin", ForumTopicComponent);
    }

    topicUnpin(data: GatewayEvent_ForumTopicUnpinned): void {
        const ForumTopicComponent = new ForumTopic(data.forumTopic, this.client);
        this.client.emit("forumTopicUnpin", ForumTopicComponent);
    }

    topicCommentCreate(data: GatewayEvent_ForumTopicCommentCreated): void {
        const TopicCommentComponent = new ForumTopicComment(data.forumTopicComment, this.client, { guildID: data.serverId });
        this.client.emit("forumTopicCommentCreate", TopicCommentComponent);
    }

    topicCommentUpdate(data: GatewayEvent_ForumTopicCommentUpdated): void {
        const TopicCommentComponent = new ForumTopicComment(data.forumTopicComment, this.client, { guildID: data.serverId });
        this.client.emit("forumTopicCommentUpdate", TopicCommentComponent);
    }

    topicCommentDelete(data: GatewayEvent_ForumTopicCommentDeleted): void {
        const TopicCommentComponent = new ForumTopicComment(data.forumTopicComment, this.client, { guildID: data.serverId });
        this.client.emit("forumTopicCommentDelete", TopicCommentComponent);
    }

    topicReactionAdd(data: GatewayEvent_ForumTopicReactionCreated): void {
        const output = {
            topic: {
                id:    data.reaction.forumTopicId,
                guild: {
                    id: data.serverId
                },
                channelID: data.reaction.channelId
            },
            emoji: {
                id:   data.reaction.emote.id,
                name: data.reaction.emote.name,
                url:  data.reaction.emote.url
            },
            reactor: {
                id: data.reaction.createdBy
            }
        };

        if (this.client.cache.has(`forumTopicComponent_${data.reaction.forumTopicId}`)){
            // Object.assign(output, {message: this.client.cache.get(`messageComponent_${data.reaction.messageId}`)})
            output.topic = this.client.cache.get(`forumTopicComponent_${data.reaction.forumTopicId}`) as ForumTopic;
        } else if (this.client.cache.has(`guildComponent_${data.serverId as string}`)){
            // Object.assign(output.message, {guild: this.client.cache.get(`guildComponent_${data.serverId}`)})
            output.topic.guild = this.client.cache.get(`guildComponent_${data.serverId as string}`) as Guild;
        }

        if (this.client.cache.has(`guildMember_${data.reaction.createdBy}`)){
            // Object.assign(output.reactor, this.client.cache.get(`guildMember_${data.reaction.createdBy}`))
            output.reactor = this.client.cache.get(`guildMember_${data.reaction.createdBy}`) as Member;
        }

        this.client.emit("forumTopicReactionAdd", output as forumTopicReactionInfo);
    }

    topicReactionRemove(data: GatewayEvent_ForumTopicReactionDeleted): void {
        const output = {
            topic: {
                id:    data.reaction.forumTopicId,
                guild: {
                    id: data.serverId
                },
                channelID: data.reaction.channelId
            },
            emoji: {
                id:   data.reaction.emote.id,
                name: data.reaction.emote.name,
                url:  data.reaction.emote.url
            },
            reactor: {
                id: data.reaction.createdBy
            }
        };

        if (this.client.cache.has(`forumTopicComponent_${data.reaction.forumTopicId}`)){
            output.topic = this.client.cache.get(`forumTopicComponent_${data.reaction.forumTopicId}`) as ForumTopic;
        } else if (this.client.cache.has(`guildComponent_${data.serverId as string}`)){
            output.topic.guild = this.client.cache.get(`guildComponent_${data.serverId as string}`) as Guild;
        }

        if (this.client.cache.has(`guildMember_${data.reaction.createdBy}`)){
            output.reactor = this.client.cache.get(`guildMember_${data.reaction.createdBy}`) as Member;
        }

        this.client.emit("forumTopicReactionRemove", output as forumTopicReactionInfo);
    }
}
