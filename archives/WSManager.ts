import { config as pkgconfig } from "../pkgconfig";
import WebSocket from "ws";
import emitterbuilder from "emitterbuilder";

import { GatewayOPCodes } from "guildedapi-types.ts/v1";

// Supported on ES2021 or lower.

export class WSManager {
    constructor(readonly params: WSManagerParams){}
    token = this.params.token;
    apiversion = this.params.apiversion ?? pkgconfig.GuildedAPI.GatewayVersion ?? 1;
    proxyURL = this.params.proxyURL ?? pkgconfig.GuildedAPI.GatewayURL ?? `wss://www.guilded.gg/websocket/v${this.apiversion}`;
    reconnect? = this.params.reconnect ?? true;
    reconnectAttemptLimit = this.params.reconnectAttemptLimit ?? 1;
    replayMissedEvents? = this.params.replayMissedEvents ?? true;

    emitter = new emitterbuilder({ ignoreWarns: true });

    ws = new WebSocket(this.proxyURL, { headers: { Authorization: `Bearer ${this.params.token}` }, protocol: "HTTPS" });

    firstwsMessage = true;
    lastMessageID: string|null = null;
    currReconnectAttempt = 0;

    alive?: boolean = false;
    ping = NaN;
    lastPingTime = NaN;

    // lastMessageID = undefined;

    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    get identifiers(){
        return {
            Message: {
                ChatMessageCreated:            "messageCreate",
                ChatMessageUpdated:            "messageUpdate",
                ChatMessageDeleted:            "messageDelete",
                ChannelMessageReactionCreated: "messageReactionAdd",
                ChannelMessageReactionDeleted: "messageReactionRemove"
            },
            Channel: {
                TeamChannelCreated: "channelCreate",
                TeamChannelUpdated: "channelUpdate",
                TeamChannelDeleted: "channelDelete"
            },
            ForumTopic: {
                ForumTopicCreated:  "topicCreate",
                ForumTopicUpdated:  "topicUpdate",
                ForumTopicDeleted:  "topicDelete",
                ForumTopicPinned:   "forumTopicPin",
                ForumTopicUnpinned: "forumTopicUnpin"
            },
            Guild: {
                TeamMemberBanned:   "guildBanAdd",
                TeamMemberUnbanned: "guildBanRemove",
                TeamMemberJoined:   "guildMemberAdd",
                TeamMemberRemoved:  "guildMemberRemove",
                TeamMemberUpdated:  "guildMemberUpdate",
                teamRolesUpdated:   "guildMemberRoleUpdate"
            },
            Webhook: {
                TeamWebhookCreated: "webhooksCreate",
                TeamWebhookUpdated: "webhooksUpdate"
            },
            Doc: {
                DocCreated: "docCreate",
                DocUpdated: "docUpdate",
                DocDeleted: "docDelete"
            },
            Calendar: {
                CalendarEventCreated:     "calendarEventCreate",
                CalendarEventUpdated:     "calendarEventUpdate",
                CalendarEventDeleted:     "calendarEventDelete",
                CalendarEventRsvpUpdated: "calendarRsvpUpdate",
                CalendarEventRsvpDeleted: "calendarRsvpDelete"
            },
            List: {
                ListItemCreated:     "listItemCreate",
                ListItemUpdated:     "listItemUpdate",
                ListItemDeleted:     "listItemDelete",
                ListItemCompleted:   "listItemComplete",
                ListItemUncompleted: "listItemUncomplete"
            }
        };
    }

    get vAPI(): number {
        return this.apiversion as number;
    }

    _debug(message: string): boolean {
        return this.ws.emit("debug", `[TouchGuild DEBUG]: ${message}`);
    }

    get replayEventsCondition(): boolean {
        return this.replayMissedEvents === true && this.lastMessageID !== null;
    }

    connect(): void {
        const wsoptions = { headers: { Authorization: `Bearer ${this.params.token}` }, protocol: "HTTPS" };
        if (this.replayEventsCondition) Object.assign(wsoptions.headers, { "guilded-last-message-id": this.lastMessageID });

        try {
            this.ws = new WebSocket(this.proxyURL, wsoptions);
        } catch (err){
            if (!this.replayEventsCondition) throw err;
            this.lastMessageID = null;
            return this.connect();
        }

        this.ws.on("open", this.onSocketOpen.bind(this));
        this.ws.on("close", this.onSocketClose.bind(this));
        this.ws.on("ping", this.onSocketPing.bind(this));
        this.ws.on("pong", this.onSocketPong.bind(this));
        this.ws.on("unexpected-response", ()=> {
            console.error(">> An unexpected response occured. (invalid token or else)");
        });

        this.ws.on("message", (args: string)=> {
            if (this.firstwsMessage === true) {
                this.firstwsMessage = false;
            }
            this.emitter.on("socketMessage", this.onSocketMessage(args));
        });

        this.ws.on("error", (err: unknown) => {
            this.onSocketError(err as string);
            console.error("GATEWAY ERR: Couldn't connect to the Guilded API.");
            if (this.reconnect === true || this.reconnectAttemptLimit < this.currReconnectAttempt){
                this.currReconnectAttempt++; return this.connect();
            }
            this.closeAll();
        });

        this.ws.on("close", (code, reason)=> {
            this._debug(`Connection to gateway has been terminated with code ${code}, reason: ${reason.toString()}`);
            this.closeAll();
        });
    }

    closeAll(): void {
        if (!this.ws) throw new Error("There's no active connection to close.");
        this.ws.removeAllListeners();
        if (this.ws.OPEN) this.ws.close();
        this.alive = false;
    }

    private onSocketMessage(rawData: string): void|undefined {
        const packet = rawData;
        // s: Message ID used for replaying events after a disconnect.
        try {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, no-var
            var { t: eventTYPE, d: eventDATA, s: eventMSGID, op: opCODE } = JSON.parse(packet);
        } catch {
            this.emitter.emit("exit", "Error while parsing data."); return void 0;
        }

        if (eventMSGID) this.lastMessageID = eventMSGID as string;

        switch (opCODE) {
            case GatewayOPCodes.Event: {
                this.emitter.emit("GATEWAY_EVENT", eventTYPE, eventDATA);
                this.emitter.emit("GATEWAY_EVENT_PACKET", packet);
                break;
            }
            case GatewayOPCodes.Welcome: {
                this.emitter.emit("GATEWAY_WELCOME", eventDATA);
                this.emitter.emit("GATEWAY_WELCOME_PACKET", packet);
                break;
            }
            case GatewayOPCodes.Resume: {
                this.lastMessageID = null;
                break;
            }
            default: {
                this.emitter.emit("unknown", "??UNKNOWN OPCODE??", packet);
                break;
            }
        }
        // this.emitter.emit('message', rawData); deprecated.
    }

    private onSocketOpen(): void {
        this.alive = true;
        this.emitter.emit("debug", "Socket connection is open.");
    }

    private onSocketError(error: string): void {
        this.emitter.emit("debug", error); this.emitter.emit("exit", error);
        this.alive = false; return void 0;
    }

    private onSocketClose(code: number, reason: Buffer): undefined {
        const r = reason.toString("hex");
        this.emitter.emit("exit", code, r);
        this.alive = false;
        return void 0;
    }

    private onSocketPing(): void {
        this._debug("Ping! has been received.");
        this.ws!.ping(); this.lastPingTime = Date.now();
    }

    private onSocketPong(): void {
        this._debug("Pong received!");
        this.ping = this.lastPingTime - Date.now();
    }
}


export interface WSManagerParams {
    /** Bot's token */
    token: string;
    /** Guilded API URL */
    proxyURL?: string;
    /** Guilded API Version */
    apiversion?: number | 1;
    /** Automatically re-establish connection on error */
    reconnect?: boolean;
    /** Reconnect limit */
    reconnectAttemptLimit?: number;
    /** Replay missed events on connection interruption */
    replayMissedEvents?: boolean;
}


/// / PINGING TESTS
/* if (eventDATA.heartbeatIntervalMs !== undefined){
     setInterval(() => {
         console.log('pinged')
         this.ws.ping()
     }, eventDATA.heartbeatIntervalMs);
 }
 console.log(eventDATA.heartbeatIntervalMs)
*/
