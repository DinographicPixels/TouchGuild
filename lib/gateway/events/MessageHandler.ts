import { GatewayEventHandler } from "./GatewayEventHandler";
import { Guild } from "../../structures/Guild";
import { Member } from "../../structures/Member";
import { Message } from "../../structures/Message";
import { messageReactionInfo } from "../../tg-types/types";
import {
    GatewayEvent_ChannelMessageReactionAdded,
    GatewayEvent_ChannelMessageReactionDeleted,
    GatewayEvent_ChatMessageCreated,
    GatewayEvent_ChatMessageDeleted,
    GatewayEvent_ChatMessageUpdated
} from "guildedapi-types.ts/v1";

export class MessageHandler extends GatewayEventHandler{
    messageCreate(data: GatewayEvent_ChatMessageCreated): boolean {
        const MessageComponent = new Message(data.message, this.client);
        // this.client.cache.set(`messageContent_${MessageComponent['id' as keyof object]}`, MessageComponent['content' as keyof object])
        this.client.cache.set(`messageComponent_${MessageComponent.id}`, MessageComponent);
        return this.client.emit("messageCreate", MessageComponent);
    }

    messageUpdate(data: GatewayEvent_ChatMessageUpdated): boolean {
        let MessageComponent = new Message(data.message, this.client);
        const cacheHasOldMessage = this.client.cache.has(`messageComponent_${MessageComponent.id}`);
        if (cacheHasOldMessage){
            MessageComponent = new Message(data.message, this.client, { oldMessage: this.client.cache.get(`messageComponent_${MessageComponent.id}`) as object|undefined });
            this.client.cache.set(`messageComponent_${MessageComponent.id}`, MessageComponent);
        }
        return this.client.emit("messageUpdate", MessageComponent);
    }

    messageDelete(data: GatewayEvent_ChatMessageDeleted): boolean {
        let MessageComponent = new Message(data.message as keyof object, this.client);
        const cacheHasMessage = this.client.cache.has(`messageComponent_${MessageComponent.id}`);
        if (cacheHasMessage){
            MessageComponent = new Message(data.message as keyof object, this.client, { oldMessage: this.client.cache.get(`messageComponent_${MessageComponent.id}`) as object|undefined });
            this.client.cache.delete(`messageComponent_${MessageComponent.id}`);
        }
        return this.client.emit("messageDelete", MessageComponent);
    }

    messageReactionAdd(data: GatewayEvent_ChannelMessageReactionAdded): boolean {
        const output = {
            message: {
                id:    data.reaction.messageId,
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


        if (this.client.cache.has(`messageComponent_${data.reaction.messageId}`)){
            // Object.assign(output, {message: this.client.cache.get(`messageComponent_${data.reaction.messageId}`)})
            output.message = this.client.cache.get(`messageComponent_${data.reaction.messageId}`) as Message;
        } else if (this.client.cache.has(`guildComponent_${data.serverId as string}`)){
            // Object.assign(output.message, {guild: this.client.cache.get(`guildComponent_${data.serverId}`)})
            output.message.guild = this.client.cache.get(`guildComponent_${data.serverId as string}`) as Guild;
        }

        if (this.client.cache.has(`guildMember_${data.reaction.createdBy}`)){
            // Object.assign(output.reactor, this.client.cache.get(`guildMember_${data.reaction.createdBy}`))
            output.reactor = this.client.cache.get(`guildMember_${data.reaction.createdBy}`) as Member;
        }
        return this.client.emit("messageReactionAdd", output as messageReactionInfo);
    }

    messageReactionRemove(data: GatewayEvent_ChannelMessageReactionDeleted): boolean {
        const output = {
            message: {
                id:    data.reaction.messageId,
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


        if (this.client.cache.has(`messageComponent_${data.reaction.messageId}`)){
            // Object.assign(output, {message: this.client.cache.get(`messageComponent_${data.reaction.messageId}`)})
            output.message = this.client.cache.get(`messageComponent_${data.reaction.messageId}`) as Message;
        } else if (this.client.cache.has(`guildComponent_${data.serverId as string}`)){
            // Object.assign(output.message, {guild: this.client.cache.get(`guildComponent_${data.serverId}`)})
            output.message.guild = this.client.cache.get(`guildComponent_${data.serverId as string}`) as Guild;
        }

        if (this.client.cache.has(`guildMember_${data.reaction.createdBy}`)){
            // Object.assign(output.reactor, this.client.cache.get(`guildMember_${data.reaction.createdBy}`))
            output.reactor = this.client.cache.get(`guildMember_${data.reaction.createdBy}`) as Member;
        }

        return this.client.emit("messageReactionRemove", output as messageReactionInfo);
    }

    // Unfortunately, Guilded doesn't have endpoint to get that information :.(
    // messageReactionRemoveAll(data: object){
    //     //return this.client.emit('messageReactionRemoveAll')
    // }
}
