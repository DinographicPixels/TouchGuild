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
exports.Client = void 0;
const Message_1 = require("./Message");
const Channel_1 = require("./Channel");
const GatewayHandler_1 = require("../gateway/GatewayHandler");
const WSManager_1 = require("../WSManager");
const Member_1 = require("./Member");
const Guild_1 = require("./Guild");
const Utils_1 = require("../Utils");
const events_1 = __importDefault(require("events"));
class Client extends events_1.default {
    constructor(params) {
        if (typeof params !== "object")
            throw new Error("The token isn't provided in an object.");
        if (typeof (params === null || params === void 0 ? void 0 : params.token) == "undefined")
            throw new Error("Cannot create client without token, no token is provided.");
        super();
        this.params = params;
        this.ws = new WSManager_1.WSManager({ token: this.token, proxyURL: undefined, apiversion: undefined, reconnect: undefined, reconnectAttemptLimit: undefined });
        this.cache = new Map();
        this.identifiers = this.ws.identifiers;
    }
    get token() {
        //console.log("GuilderJS WARN! : Returned token value, do not share this token to anyone.");
        return this.params.token;
    }
    connect(...args) {
        this.ws.connect();
        this.ws.emitter.on('ready', () => {
            console.log('Connected to Guilded!');
            this.emit('ready');
        });
        this.ws.emitter.on('message', (args) => {
            const { t: eventType, d: eventData } = JSON.parse(args);
            new GatewayHandler_1.GatewayHandler(this).handleMessage(eventType, eventData);
        });
    }
    getChannel(channelId) {
        let response = (0, Utils_1.SYNCFETCH)('GET', `/channels/${channelId}`, this.token, null);
        return new Channel_1.Channel(response, this);
    }
    getMember(serverID, memberID) {
        let response = (0, Utils_1.SYNCFETCH)('GET', `/servers/${serverID}/members/${memberID}`, this.token, null);
        return new Member_1.Member(response.member, this);
    }
    getGuild(guildID) {
        let response = (0, Utils_1.SYNCFETCH)('GET', `/servers/${guildID}`, this.token, null);
        return new Guild_1.Guild(response, this);
    }
    createChannel(location = { guildID: undefined, groupID: undefined, categoryID: undefined }, name, type, options = { topic: undefined, isPublic: undefined }) {
        var body = {};
        Object.assign(body, { name: name, type: type });
        if (location.guildID)
            Object.assign(body, { serverId: location.guildID });
        if (location.groupID)
            Object.assign(body, { groupId: location.groupID });
        if (location.categoryID)
            Object.assign(body, { categoryId: location.categoryID });
        if (options.topic)
            Object.assign(body, { topic: options.topic });
        if (options.isPublic)
            Object.assign(body, { isPublic: options.isPublic });
        let response = (0, Utils_1.SYNCFETCH)('POST', '/channels', this.token, JSON.stringify(body));
    }
    createMessage(channelID, options = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            let bodyContent = JSON.stringify(options);
            let response = yield (0, Utils_1.FETCH)('POST', `/channels/${channelID}/messages`, this.token, bodyContent);
            return new Message_1.Message(response, this);
        });
    }
    edit(channelID, messageID, newMessage) {
        return __awaiter(this, void 0, void 0, function* () {
            if (typeof newMessage !== 'object')
                throw new TypeError("newMessage should be an Object. (example: {content: 'heyo!'})");
            let response = yield (0, Utils_1.FETCH)('PUT', `/channels/${channelID}/messages/${messageID}`, this.token, JSON.stringify(newMessage));
        });
    }
    delete(channelID, messageID) {
        return __awaiter(this, void 0, void 0, function* () {
            yield (0, Utils_1.FETCH)('DELETE', `/channels/${channelID}/messages/${messageID}`, this.token, null);
        });
    }
}
exports.Client = Client;
