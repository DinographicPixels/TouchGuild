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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Channel = void 0;
const node_fetch_commonjs_1 = __importDefault(require("node-fetch-commonjs"));
const Message_1 = require("./Message");
class Channel {
    constructor(data, client) {
        this.data = data.channel;
        this.client = client;
        this.id = this.data.id;
        this.type = this.data.type;
        this.name = this.data.name;
        this.topic = this.data.topic;
        this.createdAt = this.data.createdAt;
        this.createdBy = this.data.createdBy;
        this.updatedAt = this.data.updatedAt;
        this.serverId = this.data.serverId;
        this.parentId = this.data.parentId;
        this.categoryId = this.data.categoryId;
        this.groupId = this.data.groupId;
        this.isPublic = this.data.isPublic;
        this.archivedBy = this.data.archivedBy;
        this.archivedAt = this.data.archivedAt;
    }
    createMessage(options = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            let bodyContent = JSON.stringify(options);
            let fetching = yield (0, node_fetch_commonjs_1.default)(`https://www.guilded.gg/api/v${this.client.ws.apiversion}/channels/${this.id}/messages`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${this.client.token}`,
                    Accept: "application/json",
                    "Content-type": "application/json",
                },
                body: bodyContent,
                protocol: "HTTPS"
            });
            let response = yield fetching.json();
            return new Message_1.Message(response, this.client);
        });
    }
    delete() {
        return __awaiter(this, void 0, void 0, function* () {
            let fetching = yield (0, node_fetch_commonjs_1.default)(`https://www.guilded.gg/api/v${this.client.ws.apiversion}/channels/${this.id}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${this.client.token}`,
                    Accept: "application/json",
                    "Content-type": "application/json",
                },
                protocol: "HTTPS"
            });
        });
    }
    edit(options) {
        return __awaiter(this, void 0, void 0, function* () {
            let fetching = yield (0, node_fetch_commonjs_1.default)(`https://www.guilded.gg/api/v${this.client.ws.apiversion}/channels/${this.id}`, {
                method: 'PATCH',
                headers: {
                    Authorization: `Bearer ${this.client.token}`,
                    Accept: "application/json",
                    "Content-type": "application/json",
                },
                body: JSON.stringify(options),
                protocol: "HTTPS"
            });
            let response = yield fetching.json();
            return new Channel(response, this.client);
        });
    }
}
exports.Channel = Channel;
