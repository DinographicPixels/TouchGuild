"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageHandler = void 0;
const Message_1 = require("../../structures/Message");
const GatewayEventHandler_1 = require("./GatewayEventHandler");
class MessageHandler extends GatewayEventHandler_1.GatewayEventHandler {
    messageCreate(data) {
        return __awaiter(this, void 0, void 0, function* () {
            var MessageComponent = new Message_1.Message(data['message'], this.client);
            // this.client.cache.set(`messageContent_${MessageComponent['id' as keyof object]}`, MessageComponent['content' as keyof object])
            yield this.client.cache.set(`messageComponent_${MessageComponent['id']}`, MessageComponent);
            return this.client.emit('messageCreate', MessageComponent);
        });
    }
    messageUpdate(data) {
        var MessageComponent = new Message_1.Message(data['message'], this.client);
        var cacheHasOldMessage = this.client.cache.has(`messageComponent_${MessageComponent['id']}`);
        if (cacheHasOldMessage) {
            MessageComponent = new Message_1.Message(data['message'], this.client, { oldMessage: this.client.cache.get(`messageComponent_${MessageComponent['id']}`) });
            this.client.cache.set(`messageComponent_${MessageComponent['id']}`, MessageComponent);
        }
        return this.client.emit('messageUpdate', MessageComponent);
    }
    messageDelete(data) {
        var MessageComponent = new Message_1.Message(data['message'], this.client);
        var cacheHasMessage = this.client.cache.has(`messageContent_${MessageComponent['id']}`);
        if (cacheHasMessage) {
            MessageComponent = new Message_1.Message(data['message'], this.client, { oldMessage: this.client.cache.get(`messageComponent_${MessageComponent['id']}`) });
            this.client.cache.delete(`messageComponent_${MessageComponent['id']}`);
        }
        return this.client.emit('messageDelete', MessageComponent);
    }
    messageReactionAdd(data) {
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
        if (this.client.cache.has(`messageComponent_${data.reaction.messageId}`)) {
            //Object.assign(output, {message: this.client.cache.get(`messageComponent_${data.reaction.messageId}`)})
            output.message = this.client.cache.get(`messageComponent_${data.reaction.messageId}`);
        }
        else if (this.client.cache.has(`guildComponent_${data.serverId}`)) {
            //Object.assign(output.message, {guild: this.client.cache.get(`guildComponent_${data.serverId}`)})
            output.message.guild = this.client.cache.get(`guildComponent_${data.serverId}`);
        }
        if (this.client.cache.has(`guildMember_${data.reaction.createdBy}`)) {
            //Object.assign(output.reactor, this.client.cache.get(`guildMember_${data.reaction.createdBy}`))
            output.reactor = this.client.cache.get(`guildMember_${data.reaction.createdBy}`);
        }
        return this.client.emit('messageReactionAdd', output);
    }
    messageReactionRemove(data) {
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
        if (this.client.cache.has(`messageComponent_${data.reaction.messageId}`)) {
            //Object.assign(output, {message: this.client.cache.get(`messageComponent_${data.reaction.messageId}`)})
            output.message = this.client.cache.get(`messageComponent_${data.reaction.messageId}`);
        }
        else if (this.client.cache.has(`guildComponent_${data.serverId}`)) {
            //Object.assign(output.message, {guild: this.client.cache.get(`guildComponent_${data.serverId}`)})
            output.message.guild = this.client.cache.get(`guildComponent_${data.serverId}`);
        }
        if (this.client.cache.has(`guildMember_${data.reaction.createdBy}`)) {
            //Object.assign(output.reactor, this.client.cache.get(`guildMember_${data.reaction.createdBy}`))
            output.reactor = this.client.cache.get(`guildMember_${data.reaction.createdBy}`);
        }
        return this.client.emit('messageReactionRemove', output);
    }
}
exports.MessageHandler = MessageHandler;
