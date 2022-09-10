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
exports.Channel = void 0;
const Message_1 = require("./Message");
const endpoints = __importStar(require("../rest/endpoints"));
const Utils_1 = require("../Utils");
/** Guild Channel component, with all its methods and declarations */
class Channel {
    constructor(data, client) {
        var _a, _b, _c, _d, _e;
        this.data = data;
        this.client = client;
        this.id = data.id;
        this.type = data.type;
        this.name = data.name;
        this.topic = (_a = data.topic) !== null && _a !== void 0 ? _a : null;
        this._createdAt = Date.parse(data.createdAt);
        this.memberID = data.createdBy;
        this._updatedAt = data.updatedAt ? Date.parse(data.updatedAt) : null;
        this.guildID = data.serverId;
        this.parentID = (_b = data.parentId) !== null && _b !== void 0 ? _b : null;
        this.categoryID = (_c = data.categoryId) !== null && _c !== void 0 ? _c : null;
        this.groupID = data.groupId;
        this.isPublic = (_d = data.isPublic) !== null && _d !== void 0 ? _d : false;
        this.archivedBy = (_e = data.archivedBy) !== null && _e !== void 0 ? _e : null;
        this._archivedAt = data.archivedAt ? Date.parse(data.archivedAt) : null;
    }
    get createdAt() {
        return new Date(this._createdAt);
    }
    get updatedAt() {
        if (this._updatedAt !== null) {
            return new Date(this._updatedAt);
        }
        else
            return null;
    }
    get archivedAt() {
        if (this._archivedAt !== null) {
            return new Date(this._archivedAt);
        }
        else
            return null;
    }
    /** Create a message in the channel. */
    createMessage(options) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            if (typeof options !== 'object')
                throw new TypeError('message options should be an object.');
            let bodyContent = JSON.stringify(options);
            // let fetching = await fetch(`https://www.guilded.gg/api/v${this.client.ws.apiversion}/channels/${this.id}/messages`, {
            //     method: 'POST',
            //     headers: {
            //       Authorization: `Bearer ${this.client.token}`,
            //       Accept: "application/json",
            //       "Content-type": "application/json",
            //     },
            //     body: bodyContent,
            //     protocol: "HTTPS"
            // });
            let response = yield new Utils_1.call().post(endpoints.CHANNEL_MESSAGES(this.id), this.client.token, bodyContent);
            return new Message_1.Message((_a = response.data) === null || _a === void 0 ? void 0 : _a.message, this.client);
        });
    }
    /** Delete the channel. */
    delete() {
        return __awaiter(this, void 0, void 0, function* () {
            // let fetching = await fetch(`https://www.guilded.gg/api/v${this.client.ws.apiversion}/channels/${this.id}`, {
            //     method: 'DELETE',
            //     headers: {
            //       Authorization: `Bearer ${this.client.token}`,
            //       Accept: "application/json",
            //       "Content-type": "application/json",
            //     },
            //     protocol: "HTTPS"
            // });
            yield new Utils_1.call().delete(endpoints.CHANNEL(this.id), this.client.token);
        });
    }
    /** Edit the channel. */
    edit(options) {
        return __awaiter(this, void 0, void 0, function* () {
            // let fetching = await fetch(`https://www.guilded.gg/api/v${this.client.ws.apiversion}/channels/${this.id}`, {
            //     method: 'PATCH',
            //     headers: {
            //       Authorization: `Bearer ${this.client.token}`,
            //       Accept: "application/json",
            //       "Content-type": "application/json",
            //     },
            //     body: JSON.stringify(options),
            //     protocol: "HTTPS"
            // });
            let response = yield new Utils_1.call().patch(endpoints.CHANNEL(this.id), this.client.token, JSON.stringify(options));
            return new Channel(response === null || response === void 0 ? void 0 : response.data.channel, this.client);
        });
    }
}
exports.Channel = Channel;
