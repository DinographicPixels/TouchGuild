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
exports.ListItem = void 0;
const endpoints = __importStar(require("../rest/endpoints"));
const Utils_1 = require("../Utils");
const calls = new Utils_1.call();
class ListItem {
    constructor(data, client) {
        var _a, _b, _c, _d, _e, _f;
        this._data = data;
        this._client = client;
        this.id = data.id;
        this.guildID = data.serverId;
        this.channelID = data.channelId;
        this.content = (_a = data.message) !== null && _a !== void 0 ? _a : null;
        this.mentions = (_b = data.mentions) !== null && _b !== void 0 ? _b : null;
        this._createdAt = data.createdAt ? Date.parse(data.createdAt) : null;
        this.memberID = data.createdBy;
        this.webhookID = (_c = data.createdByWebhookId) !== null && _c !== void 0 ? _c : null;
        this._updatedAt = data.updatedAt ? Date.parse(data.updatedAt) : null;
        this.updatedBy = (_d = data.updatedBy) !== null && _d !== void 0 ? _d : null;
        this.parentListItemID = (_e = data.parentListItemId) !== null && _e !== void 0 ? _e : null;
        this._completedAt = data.completedAt ? Date.parse(data.completedAt) : null;
        this.completedBy = (_f = data.completedBy) !== null && _f !== void 0 ? _f : null;
    }
    get note() {
        var _a, _b;
        if (this._data.note) {
            return {
                createdAt: this._data.note.createdAt ? Date.parse(this._data.note.createdAt) : null,
                createdBy: this._data.note.createdBy,
                updatedAt: this._data.note.updatedAt ? Date.parse(this._data.note.updatedAt) : null,
                updatedBy: (_a = this._data.note.updatedBy) !== null && _a !== void 0 ? _a : null,
                mentions: (_b = this._data.note.mention) !== null && _b !== void 0 ? _b : null,
                content: this._data.note.content
            };
        }
        else
            return null;
    }
    /** Member who executed this action */
    get member() {
        if (this.updatedBy) {
            return calls.syncGetMember(this.guildID, this.updatedBy, this._client);
        }
        else if (this.memberID && this.memberID !== 'Ann6LewA') {
            return calls.syncGetMember(this.guildID, this.memberID, this._client);
        }
        else
            console.log("Couldn't get Member, List item has been probably created by a webhook.");
    }
    get createdAt() {
        return this._createdAt ? new Date(this._createdAt) : null;
    }
    get updatedAt() {
        return this._updatedAt ? new Date(this._updatedAt) : null;
    }
    get completedAt() {
        return this._completedAt ? new Date(this._completedAt) : null;
    }
    edit(content, note) {
        return __awaiter(this, void 0, void 0, function* () {
            let response = yield calls.put(endpoints.LIST_ITEM(this.channelID, this.id), this._client.token, { message: content, note });
            return new ListItem(response.data.listItem, this._client);
        });
    }
    delete() {
        return __awaiter(this, void 0, void 0, function* () {
            yield calls.delete(endpoints.LIST_ITEM(this.channelID, this.id), this._client.token);
        });
    }
    complete() {
        return __awaiter(this, void 0, void 0, function* () {
            yield calls.post(endpoints.LIST_ITEM_COMPLETE(this.channelID, this.id), this._client.token, {});
        });
    }
    uncomplete() {
        return __awaiter(this, void 0, void 0, function* () {
            yield calls.delete(endpoints.LIST_ITEM_COMPLETE(this.channelID, this.id), this._client.token);
        });
    }
}
exports.ListItem = ListItem;
