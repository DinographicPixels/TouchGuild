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
exports.ForumTopic = void 0;
const endpoints = __importStar(require("../rest/endpoints"));
const Utils_1 = require("../Utils");
const calls = new Utils_1.call();
class ForumTopic {
    constructor(data, client) {
        var _a, _b, _c;
        //this.userdata = data.user;  // basically member > user
        //this.fulldata = data // basically the whole data
        this._client = client;
        this.id = data.id; // topic ID
        this.guildID = data.serverId;
        this.channelID = data.channelId; // forum channel id
        this.name = data.title;
        this.title = data.title;
        this._createdAt = Date.parse(data.createdAt);
        this.memberID = data.createdBy;
        this.webhookID = (_a = data.createdByWebhookId) !== null && _a !== void 0 ? _a : null;
        this._updatedAt = data.updatedAt ? Date.parse(data.updatedAt) : null;
        this.bumpedAt = (_b = data.bumpedAt) !== null && _b !== void 0 ? _b : null;
        this.content = data.content;
        this.mentions = (_c = data.mentions) !== null && _c !== void 0 ? _c : null;
    }
    /** Guild/server the topic is in */
    get guild() {
        return calls.syncGetGuild(this.guildID, this._client);
    }
    /** Member who created the topic */
    get member() {
        return calls.syncGetMember(this.guildID, this.memberID, this._client);
    }
    /** The forum channel, where the topic is in */
    get channel() {
        return calls.syncGetChannel(this.channelID, this._client);
    }
    /** string representation of the _createdAt timestamp */
    get createdAt() {
        return new Date(this._createdAt);
    }
    /** string representation of the _updatedAt timestamp */
    get updatedAt() {
        return this._updatedAt ? new Date(this._updatedAt) : null;
    }
    /** Boolean that tells you if the forum topic was created by a webhook or not. */
    get createdByWebhook() {
        if (this.webhookID) {
            return true;
        }
        else {
            return false;
        }
    }
    /** Edit the forum topic. */
    edit(options) {
        return __awaiter(this, void 0, void 0, function* () {
            let response = yield calls.patch(endpoints.FORUM_TOPIC(this.channelID, this.id), this._client.token, options);
            return new ForumTopic(response.data.forumTopic, this);
        });
    }
    /** Delete the forum topic. */
    delete() {
        return __awaiter(this, void 0, void 0, function* () {
            yield calls.delete(endpoints.FORUM_TOPIC(this.channelID, this.id), this._client.token);
        });
    }
    /** Pin the forum topic. */
    pin() {
        return __awaiter(this, void 0, void 0, function* () {
            yield calls.put(endpoints.FORUM_TOPIC_PIN(this.channelID, this.id), this._client.token, {});
        });
    }
    /** Unpin the forum topic. */
    unpin() {
        return __awaiter(this, void 0, void 0, function* () {
            yield calls.delete(endpoints.FORUM_TOPIC_PIN(this.channelID, this.id), this._client.token);
        });
    }
}
exports.ForumTopic = ForumTopic;
