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
exports.Doc = void 0;
const endpoints = __importStar(require("../rest/endpoints"));
const Utils_1 = require("../Utils");
const calls = new Utils_1.call();
class Doc {
    constructor(data, client) {
        var _a, _b, _c, _d, _e;
        this.data = data.channel;
        this.client = client;
        this.id = data.id;
        this.guildID = data.serverId;
        this.channelID = data.channelId;
        this.name = (_a = data.title) !== null && _a !== void 0 ? _a : null;
        this.title = (_b = data.title) !== null && _b !== void 0 ? _b : null; // same as name, different type.
        this.content = (_c = data.content) !== null && _c !== void 0 ? _c : null;
        this.mentions = (_d = data.mentions) !== null && _d !== void 0 ? _d : {};
        this._createdAt = data.createdAt ? Date.parse(data.createdAt) : null;
        this.memberID = data.createdBy;
        this._updatedAt = data.updatedAt ? Date.parse(data.updatedAt) : null;
        this.updatedBy = (_e = data.updatedBy) !== null && _e !== void 0 ? _e : null;
    }
    get member() {
        if (this.updatedBy) {
            return calls.syncGetMember(this.guildID, this.updatedBy, this.client);
        }
        else {
            return calls.syncGetMember(this.guildID, this.memberID, this.client);
        }
    }
    get createdAt() {
        return this._createdAt ? new Date(this._createdAt) : null;
    }
    get updatedAt() {
        return this._updatedAt ? new Date(this._updatedAt) : null;
    }
    edit(options) {
        return __awaiter(this, void 0, void 0, function* () {
            let response = yield calls.put(endpoints.CHANNEL_DOC(this.channelID, this.id), this.client.token, options);
            return new Doc(response.data.doc, this.client);
        });
    }
    delete() {
        return __awaiter(this, void 0, void 0, function* () {
            yield calls.delete(endpoints.CHANNEL_DOC(this.channelID, this.id), this.client.token);
        });
    }
}
exports.Doc = Doc;
