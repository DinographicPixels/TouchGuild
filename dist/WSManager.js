"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WSManager = void 0;
const ws_1 = __importDefault(require("ws"));
const emitterbuilder_1 = __importDefault(require("emitterbuilder"));
class WSManager {
    constructor(params) {
        var _a, _b, _c, _d;
        this.params = params;
        this.token = this.params.token;
        this.apiversion = (_a = this.params.apiversion) !== null && _a !== void 0 ? _a : 1;
        this.proxyURL = (_b = this.params.proxyURL) !== null && _b !== void 0 ? _b : `wss://api.guilded.gg/v${this.apiversion}/websocket`;
        this.reconnect = (_c = this.params.reconnect) !== null && _c !== void 0 ? _c : true;
        this.reconnectAttemptLimit = (_d = this.params.reconnectAttemptLimit) !== null && _d !== void 0 ? _d : 1;
        this.emitter = new emitterbuilder_1.default({ ignoreWarns: true });
        this.ws = new ws_1.default(this.proxyURL, { headers: { Authorization: `Bearer ${this.params.token}` }, protocol: "HTTPS" });
        this.firstwsMessage = true;
    }
    //lastMessageID = undefined;
    get identifiers() {
        return {
            Message: {
                'ChatMessageCreated': 'messageCreate',
                'ChatMessageUpdated': 'messageUpdate',
                'ChatMessageDeleted': 'messageDelete'
            },
            Channel: {
                'TeamChannelCreated': 'channelCreate',
                'TeamChannelUpdated': 'channelUpdate',
                'TeamChannelDeleted': 'channelDelete'
            }
        };
    }
    get vAPI() {
        return this.apiversion;
    }
    connect() {
        this.ws.on('open', function () {
            ///
        });
        this.ws.on('message', (args) => {
            if (this.firstwsMessage == true) {
                this.firstwsMessage = false;
                this.emitter.emit('ready');
            }
            this.emitter.on('socketMessage', this.onSocketMessage(args));
        });
        this.ws.on('error', function (err) {
            console.log("GuilderJS ERR: Couldn't connect to Guilded API.");
            console.log(err);
        });
    }
    onSocketMessage(rawData) {
        try {
            var { t: eventType, d: eventData } = JSON.parse(rawData);
        }
        catch (err) {
            this.emitter.emit("exit", "Error while parsing data.");
            return void 0;
        }
        this.emitter.emit('message', rawData);
    }
    onSocketOpen() {
    }
    onSocketError() {
    }
}
exports.WSManager = WSManager;
