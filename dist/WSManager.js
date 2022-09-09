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
        var _a, _b, _c, _d, _e;
        this.params = params;
        this.token = this.params.token;
        this.apiversion = (_a = this.params.apiversion) !== null && _a !== void 0 ? _a : 1;
        this.proxyURL = (_b = this.params.proxyURL) !== null && _b !== void 0 ? _b : `wss://www.guilded.gg/websocket/v${this.apiversion}`;
        this.reconnect = (_c = this.params.reconnect) !== null && _c !== void 0 ? _c : true;
        this.reconnectAttemptLimit = (_d = this.params.reconnectAttemptLimit) !== null && _d !== void 0 ? _d : 1;
        this.replayMissedEvents = (_e = this.params.replayMissedEvents) !== null && _e !== void 0 ? _e : true;
        this.emitter = new emitterbuilder_1.default({ ignoreWarns: true });
        this.ws = new ws_1.default(this.proxyURL, { headers: { Authorization: `Bearer ${this.params.token}` }, protocol: "HTTPS" });
        this.firstwsMessage = true;
        this.lastMessageID = null;
        this.currReconnectAttempt = 0;
        this.alive = false;
        this.ping = NaN;
        this.lastPingTime = NaN;
    }
    //lastMessageID = undefined;
    get identifiers() {
        return {
            Message: {
                'ChatMessageCreated': 'messageCreate',
                'ChatMessageUpdated': 'messageUpdate',
                'ChatMessageDeleted': 'messageDelete',
                'ChannelMessageReactionCreated': 'messageReactionAdd',
                'ChannelMessageReactionDeleted': 'messageReactionRemove'
            },
            Channel: {
                'TeamChannelCreated': 'channelCreate',
                'TeamChannelUpdated': 'channelUpdate',
                'TeamChannelDeleted': 'channelDelete'
            },
            ForumTopic: {
                'ForumTopicCreated': 'topicCreate',
                'ForumTopicUpdated': 'topicUpdate',
                'ForumTopicDeleted': 'topicDelete',
                'ForumTopicPinned': 'forumTopicPin',
                'ForumTopicUnpinned': 'forumTopicUnpin'
            },
            Guild: {
                'TeamMemberBanned': 'guildBanAdd',
                'TeamMemberUnbanned': 'guildBanRemove',
                'TeamMemberJoined': 'guildMemberAdd',
                'TeamMemberRemoved': 'guildMemberRemove',
                'TeamMemberUpdated': 'guildMemberUpdate',
                "teamRolesUpdated": 'guildMemberRoleUpdate'
            },
            Webhook: {
                'TeamWebhookCreated': 'webhooksCreate',
                'TeamWebhookUpdated': 'webhooksUpdate'
            },
            Doc: {
                'DocCreated': 'docCreate',
                'DocUpdated': 'docUpdate',
                'DocDeleted': 'docDelete'
            },
            Calendar: {
                'CalendarEventCreated': 'calendarEventCreate',
                'CalendarEventUpdated': 'calendarEventUpdate',
                'CalendarEventDeleted': 'calendarEventDelete',
                'CalendarEventRsvpUpdated': 'calendarRsvpUpdate',
                'CalendarEventRsvpDeleted': 'calendarRsvpDelete'
            },
            List: {
                'ListItemCreated': 'listItemCreate',
                'ListItemUpdated': 'listItemUpdate',
                'ListItemDeleted': 'listItemDelete',
                'ListItemCompleted': 'listItemComplete',
                'ListItemUncompleted': 'listItemUncomplete'
            }
        };
    }
    get vAPI() {
        return this.apiversion;
    }
    _debug(message) {
        return this.ws.emit("debug", `[TouchGuild DEBUG]: ${message}`);
    }
    get replayEventsCondition() {
        return this.replayMissedEvents == true && this.lastMessageID;
    }
    connect() {
        var wsoptions = { headers: { Authorization: `Bearer ${this.params.token}` }, protocol: "HTTPS" };
        if (this.replayEventsCondition)
            wsoptions['headers']['guilded-last-message-id'] = this.lastMessageID;
        try {
            this.ws = new ws_1.default(this.proxyURL, wsoptions);
        }
        catch (err) {
            if (!this.replayEventsCondition)
                throw err;
            this.lastMessageID = null;
            return this.connect();
        }
        this.ws.on("open", this.onSocketOpen.bind(this));
        this.ws.on("ping", this.onSocketPing.bind(this));
        this.ws.on("pong", this.onSocketPong.bind(this));
        this.ws.on('message', (args) => {
            if (this.firstwsMessage == true) {
                this.firstwsMessage = false;
            }
            this.emitter.on('socketMessage', this.onSocketMessage(args));
        });
        this.ws.on('error', (err) => {
            this.onSocketError(err);
            console.log("GATEWAY ERR: Couldn't connect to Guilded API.");
            if (this.reconnect == true || this.reconnectAttemptLimit < this.currReconnectAttempt) {
                this.currReconnectAttempt++;
                return this.connect();
            }
            this.closeAll();
        });
        this.ws.on('close', (code, reason) => {
            this._debug(`Connection to gateway has been terminated with code ${code}, reason: ${reason.toString()}`);
            this.closeAll();
        });
    }
    closeAll() {
        if (!this.ws)
            throw new Error("There's no active connection to close.");
        this.ws.removeAllListeners();
        if (this.ws.OPEN)
            this.ws.close();
        this.alive = false;
    }
    onSocketMessage(rawData) {
        const packet = rawData;
        var eventTYPE;
        var eventDATA;
        var eventMSGID;
        var opCODE;
        // s: Message ID used for replaying events after a disconnect.
        try {
            var { t: eventType, d: eventData, s: messageID, op: opcode } = JSON.parse(packet);
            eventTYPE = eventType;
            eventDATA = eventData;
            eventMSGID = messageID;
            opCODE = opcode;
        }
        catch (err) {
            this.emitter.emit("exit", "Error while parsing data.");
            return void 0;
        }
        const OPCODES_REG = {
            SUCCESS: 0,
            WELCOME: 1,
            RESUME: 2
        };
        // if (eventDATA.heartbeatIntervalMs !== undefined){
        //     setInterval(() => {
        //         console.log('pinged')
        //         this.ws.ping()
        //     }, eventDATA.heartbeatIntervalMs);
        // }
        // console.log(eventDATA.heartbeatIntervalMs)
        // opcodes are listed in order.
        switch (opCODE) {
            case OPCODES_REG.SUCCESS:
                this.emitter.emit("gatewayEvent");
                break;
            case OPCODES_REG.WELCOME:
                this.emitter.emit("ready");
                break;
            case OPCODES_REG.RESUME:
                this.lastMessageID = null;
                break;
            default:
                this.emitter.emit("unknown", "??UNKNOWN OPCODE??", packet);
                break;
        }
        this.emitter.emit('message', rawData);
    }
    onSocketOpen() {
        this.alive = true;
        this.emitter.emit('debug', 'Socket connection is open.');
    }
    onSocketError(error) {
        this.emitter.emit('debug', error);
        this.emitter.emit('exit', error);
        this.alive = false;
        return void 0;
    }
    onSocketClose() {
    }
    onSocketPing() {
        this._debug("Ping! has been received.");
        this.ws.ping();
        this.lastPingTime = Date.now();
    }
    onSocketPong() {
        this._debug("Pong received!");
        this.ping = this.lastPingTime - Date.now();
    }
}
exports.WSManager = WSManager;
