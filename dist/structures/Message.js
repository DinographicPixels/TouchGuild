"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const endpoints = __importStar(require("../rest/endpoints"));
const Utils_1 = require("../Utils");
const calls = new Utils_1.call();
/** Message component, with all its methods and declarations. */
class Message {
    constructor(data, client, params) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l;
        this._data = data;
        this._client = client;
        // warning: Message could be splitted into GuildMessage and Message, this action will be taken when Guilded allows bots to chat in DMs.
        this.id = data.id;
        this.type = data.type;
        this.guildID = (_a = data.serverId) !== null && _a !== void 0 ? _a : null;
        this.channelID = data.channelId;
        this.content = (_b = data.content) !== null && _b !== void 0 ? _b : '';
        this.embeds = (_c = data.embeds) !== null && _c !== void 0 ? _c : [];
        this.replyMessageIds = (_d = data.replyMessageIds) !== null && _d !== void 0 ? _d : [];
        this.isPrivate = (_e = data.isPrivate) !== null && _e !== void 0 ? _e : false;
        this.isSilent = (_f = data.isSilent) !== null && _f !== void 0 ? _f : false;
        this.mentions = (_g = data.mentions) !== null && _g !== void 0 ? _g : null;
        this._createdAt = Date.parse(data.createdAt);
        this._updatedAt = data.updatedAt ? Date.parse(data.updatedAt) : null;
        this.memberID = data.createdBy;
        this.webhookID = (_h = data.createdByWebhookId) !== null && _h !== void 0 ? _h : null;
        this._deletedAt = data.deletedAt ? Date.parse(data.deletedAt) : null;
        this._lastMessageID = null;
        this._originalMessageID = (_j = params === null || params === void 0 ? void 0 : params.originalMessageID) !== null && _j !== void 0 ? _j : null;
        this._originalMessageBool = false;
        this.oldContent = (_l = (_k = params === null || params === void 0 ? void 0 : params.oldMessage) === null || _k === void 0 ? void 0 : _k['content']) !== null && _l !== void 0 ? _l : null; // taken from cache.
        //Object.keys(this).forEach(key => this[key as keyof object] === undefined ? delete this[key as keyof object] : {});
        this.setCache.bind(this);
        this.setCache();
        // data, fulldata, client, id, type
    }
    /** string representation of the _createdAt timestamp. */
    get createdAt() {
        return new Date(this._createdAt);
    }
    /** string representation of the _updatedAt timestamp. */
    get updatedAt() {
        if (this._updatedAt !== null) {
            return new Date(this._updatedAt);
        }
        else
            return;
    }
    /** string representation of the _deletedAt timestamp. */
    get deletedAt() {
        if (this._deletedAt !== null) {
            return new Date(this._deletedAt);
        }
        else
            return;
    }
    /** Get the member component, which returns Member when message guildID and memberID is defined or if Member is cached. */
    get member() {
        if (this.memberID && this.guildID) {
            return calls.syncGetMember(this.guildID, this.memberID, this._client);
        }
        else if (this._client.cache.has(`messageComponent_${this.id}`)) {
            var component = this._client.cache.get(`messageComponent_${this.id}`);
            if (component.guildID && component.createdBy) {
                return calls.syncGetMember(component.guildID, component.createdBy, this._client);
            }
        }
    }
    /** Get the Guild component. */
    get guild() {
        if (!this.guildID)
            throw new TypeError("Couldn't get Guild, 'guildID' is not defined. You're probably using a modified version of the Message component.");
        return calls.syncGetGuild(this.guildID, this._client);
    }
    /** Get the Channel component. */
    get channel() {
        if (!this.channelID)
            throw new TypeError("Couldn't get Channel, 'channelID' is not defined. You're probably using a modified version of the Message component.");
        return calls.syncGetChannel(this.channelID, this._client);
    }
    setCache() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this._client.cache.set(`guildComponent_${this.guildID}`, this.guild);
            yield this._client.cache.set(`guildMember_${this.memberID}`, this.member);
        });
    }
    /** Used to create a message on the same channel as the message. */
    createMessage(options) {
        return __awaiter(this, void 0, void 0, function* () {
            if (typeof options !== 'object')
                throw new TypeError('message options should be an object.');
            let response = yield calls.post(endpoints.CHANNEL_MESSAGES(this.channelID), this._client.token, options);
            this._lastMessageID = response.data.message.id;
            if (this._originalMessageBool == false) {
                this._originalMessageBool = true;
                this._originalMessageID = response.data.message.id;
            }
            var message = new Message(response.data.message, this._client, { originalMessageID: this._originalMessageID });
            return message;
        });
    }
    /** Edit message. */
    edit(newMessage) {
        return __awaiter(this, void 0, void 0, function* () {
            if (typeof newMessage !== 'object')
                throw new TypeError("newMessage should be an Object. (example: {content: 'heyo!'})");
            let response = yield calls.put(endpoints.CHANNEL_MESSAGE(this.channelID, this.id), this._client.token, newMessage);
            return new Message(response.data.message, this._client, { originalMessageID: this._originalMessageID });
        });
    }
    /** Delete message. */
    delete() {
        return __awaiter(this, void 0, void 0, function* () {
            yield calls.delete(endpoints.CHANNEL_MESSAGE(this.channelID, this.id), this._client.token);
        });
    }
    /** Edit the last message sent with the message itself. */
    editLastMessage(newMessage) {
        return __awaiter(this, void 0, void 0, function* () {
            if (typeof newMessage !== 'object')
                throw new TypeError("newMessage should be an object. (example: {content: 'heyo!'})");
            if (!this._lastMessageID)
                throw new TypeError("Can't edit last message if it does not exist.");
            let response = yield calls.put(endpoints.CHANNEL_MESSAGE(this.channelID, this._lastMessageID), this._client.token, newMessage);
            return new Message(response.data.message, this._client);
        });
    }
    /** Delete the last message sent with the message itself. */
    deleteLastMessage() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this._lastMessageID)
                throw new TypeError("Can't delete last message if it does not exist.");
            yield calls.delete(endpoints.CHANNEL_MESSAGE(this.channelID, this._lastMessageID), this._client.token);
            return true;
        });
    }
    /** Edit the message's original response message. */
    editOriginalMessage(newMessage) {
        return __awaiter(this, void 0, void 0, function* () {
            if (typeof newMessage !== 'object')
                throw new TypeError("newMessage should be an object. (example: {content: 'heyo!'})");
            if (!this._originalMessageID)
                throw new TypeError("Can't edit original message if it does not exist.");
            let response = yield calls.put(endpoints.CHANNEL_MESSAGE(this.channelID, this._originalMessageID), this._client.token, newMessage);
            return new Message(response.data.message, this._client, { originalMessageID: this._originalMessageID });
        });
    }
    /** Delete the message's original response message. */
    deleteOriginalMessage() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this._originalMessageID)
                throw new TypeError("Can't delete original message if it does not exist.");
            yield calls.delete(endpoints.CHANNEL_MESSAGE(this.channelID, this._originalMessageID), this._client.token);
            return true;
        });
    }
    /** Add a reaction to the message */
    addReaction(reaction) {
        return __awaiter(this, void 0, void 0, function* () {
            yield calls.put(endpoints.CHANNEL_MESSAGE_CONTENT_EMOTE(this.channelID, this.id, reaction), this._client.token, {});
        });
    }
    /** Remove a reaction from the message. */
    removeReaction(reaction) {
        return __awaiter(this, void 0, void 0, function* () {
            yield calls.delete(endpoints.CHANNEL_MESSAGE_CONTENT_EMOTE(this.channelID, this.id, reaction), this._client.token);
        });
    }
}
exports.Message = Message;
