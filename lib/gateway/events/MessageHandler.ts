import { Guild } from "../../structures/Guild";
import { Member } from "../../structures/Member";
import { Message } from "../../structures/Message";
import { User } from "../../structures/User";
import { messageReactionRawTypes, messageReactionTypes } from "../../Types";
import { GatewayEventHandler } from "./GatewayEventHandler";

export class MessageHandler extends GatewayEventHandler{
    async messageCreate(data: object){
        var MessageComponent = new Message(data['message' as keyof object], this.client)
        // this.client.cache.set(`messageContent_${MessageComponent['id' as keyof object]}`, MessageComponent['content' as keyof object])
        await this.client.cache.set(`messageComponent_${MessageComponent['id' as keyof object]}`, MessageComponent)
        return this.client.emit('messageCreate', MessageComponent)
    }

    messageUpdate(data: object){
        var MessageComponent = new Message(data['message' as keyof object], this.client)
        var cacheHasOldMessage = this.client.cache.has(`messageComponent_${MessageComponent['id' as keyof object]}`)
        if (cacheHasOldMessage){
            MessageComponent = new Message(data['message' as keyof object], this.client, {oldMessage: this.client.cache.get(`messageComponent_${MessageComponent['id' as keyof object]}`)})
            this.client.cache.set(`messageComponent_${MessageComponent['id' as keyof object]}`, MessageComponent)
        }
        return this.client.emit('messageUpdate', MessageComponent)
    }

    messageDelete(data: object){
        var MessageComponent = new Message(data['message' as keyof object], this.client);
        var cacheHasMessage = this.client.cache.has(`messageContent_${MessageComponent['id' as keyof object]}`)
        if (cacheHasMessage){
            MessageComponent = new Message(data['message' as keyof object], this.client, {oldMessage: this.client.cache.get(`messageComponent_${MessageComponent['id' as keyof object]}`)})
            this.client.cache.delete(`messageComponent_${MessageComponent['id' as keyof object]}`);
        }
        return this.client.emit('messageDelete', MessageComponent)
    }

    messageReactionAdd(data: messageReactionRawTypes|any){
        var output = {
            message: {
                id: data.reaction.messageId,
                guild: {
                    id: data.serverId
                },
                channelID: data.reaction.channelId
            },
            emoji: {
                id: data.reaction.emote.id,
                name: data.reaction.emote.name,
                url: data.reaction.emote.url
            },
            reactor: {
                id: data.reaction.createdBy
            }
        };


        if (this.client.cache.has(`messageComponent_${data.reaction.messageId}`)){
            //Object.assign(output, {message: this.client.cache.get(`messageComponent_${data.reaction.messageId}`)})
            output.message = this.client.cache.get(`messageComponent_${data.reaction.messageId}`) as Message;
        }else if (this.client.cache.has(`guildComponent_${data.serverId}`)){
            //Object.assign(output.message, {guild: this.client.cache.get(`guildComponent_${data.serverId}`)})
            output.message.guild = this.client.cache.get(`guildComponent_${data.serverId}`) as Guild;
        }

        if (this.client.cache.has(`guildMember_${data.reaction.createdBy}`)){
            //Object.assign(output.reactor, this.client.cache.get(`guildMember_${data.reaction.createdBy}`))
            output.reactor = this.client.cache.get(`guildMember_${data.reaction.createdBy}`) as Member;
        }
        return this.client.emit('messageReactionAdd', output as messageReactionTypes);
    }

    messageReactionRemove(data: messageReactionRawTypes|any){
        var output = {
            message: {
                id: data.reaction.messageId,
                guild: {
                    id: data.serverId
                },
                channelID: data.reaction.channelId
            },
            emoji: {
                id: data.reaction.emote.id,
                name: data.reaction.emote.name,
                url: data.reaction.emote.url
            },
            reactor: {
                id: data.reaction.createdBy
            }
        };


        if (this.client.cache.has(`messageComponent_${data.reaction.messageId}`)){
            //Object.assign(output, {message: this.client.cache.get(`messageComponent_${data.reaction.messageId}`)})
            output.message = this.client.cache.get(`messageComponent_${data.reaction.messageId}`) as Message;
        }else if (this.client.cache.has(`guildComponent_${data.serverId}`)){
            //Object.assign(output.message, {guild: this.client.cache.get(`guildComponent_${data.serverId}`)})
            output.message.guild = this.client.cache.get(`guildComponent_${data.serverId}`) as Guild;
        }

        if (this.client.cache.has(`guildMember_${data.reaction.createdBy}`)){
            //Object.assign(output.reactor, this.client.cache.get(`guildMember_${data.reaction.createdBy}`))
            output.reactor = this.client.cache.get(`guildMember_${data.reaction.createdBy}`) as Member;
        }

        return this.client.emit('messageReactionRemove', output as messageReactionTypes);
    }

    // Unfortunately, Guilded doesn't have endpoint to get that information :.(
    // messageReactionRemoveAll(data: object){
    //     //return this.client.emit('messageReactionRemoveAll')
    // }
}