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
exports.Message = void 0;
const Utils_1 = require("../Utils");
class Message {
    constructor(data, client, params = { oldContent: undefined }) {
        this.data = data.message;
        this.fulldata = data;
        this.client = client;
        // warning: Message could be splitted into GuildMessage and Message, this action will be taken when Guilded allows bots to chat in DMs.
        this.id = this.data.id;
        this.type = this.data.type;
        this.serverId = this.data.serverId;
        this.channelId = this.data.channelId;
        this.content = this.data.content;
        this.embeds = this.data.embeds;
        this.replyMessageIds = this.data.replyMessageIds;
        this.isPrivate = this.data.isPrivate;
        this.isSilent = this.data.isSilent;
        this.mentions = this.data.mentions;
        this.createdAt = this.data.createdAt;
        this.createdBy = this.data.createdBy;
        this.createdByWebhookId = this.data.createdByWebhookId;
        this.updatedAt = this.data.updatedAt;
        this.oldContent = params.oldContent;
        if (this.type == 'system')
            return;
        this.channel = this.client.getChannel(this.channelId);
        this.member = this.client.getMember(this.serverId, this.createdBy);
    }
    createMessage(options = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            let bodyContent = JSON.stringify(options);
            let response = yield (0, Utils_1.FETCH)('POST', `/channels/${this.channelId}/messages`, this.client.token, bodyContent);
            return new Message(response, this.client);
        });
    }
    edit(newMessage) {
        return __awaiter(this, void 0, void 0, function* () {
            if (typeof newMessage !== 'object')
                throw new TypeError("newMessage should be an Object. (example: {content: 'heyo!'})");
            let response = yield (0, Utils_1.FETCH)('PUT', `/channels/${this.channelId}/messages/${this.id}`, this.client.token, JSON.stringify(newMessage));
        });
    }
    delete() {
        return __awaiter(this, void 0, void 0, function* () {
            yield (0, Utils_1.FETCH)('DELETE', `/channels/${this.channelId}/messages/${this.id}`, this.client.token, null);
        });
    }
}
exports.Message = Message;
