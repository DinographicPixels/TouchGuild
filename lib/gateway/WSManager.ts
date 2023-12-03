/** @module WSManager */
import GatewayError from "./GatewayError";
import { Client } from "../structures/Client";
import { APIBotUser, GatewayOPCodes } from "../Constants";
import TypedEmitter from "../types/TypedEmitter";
import { WebsocketEvents } from "../types/events";
import { config as pkgconfig } from "../../pkgconfig";
import { is } from "../util/Util";
import { AnyPacket, WelcomePacket } from "../types/gateway-raw";
import WebSocket, { Data } from "ws";
import type Pako from "pako";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import type { Inflate } from "zlib-sync";
import assert from "node:assert";

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
let Erlpack: typeof import("erlpack") | undefined;
try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires, @typescript-eslint/no-unsafe-assignment, unicorn/prefer-module
    Erlpack = require("erlpack");
} catch {}
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
let ZlibSync: typeof import("pako") | typeof import("zlib-sync") | undefined, zlibConstants: typeof import("pako").constants | typeof import("zlib-sync") | undefined;
try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires, @typescript-eslint/no-unsafe-assignment, unicorn/prefer-module
    ZlibSync = require("zlib-sync");
    // eslint-disable-next-line @typescript-eslint/no-var-requires, @typescript-eslint/no-unsafe-assignment, unicorn/prefer-module
    zlibConstants = require("zlib-sync");
} catch {
    try {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, unicorn/prefer-module
        ZlibSync = require("pako");
        // eslint-disable-next-line @typescript-eslint/no-var-requires, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, unicorn/prefer-module
        zlibConstants = require("pako").constants;
    } catch {}
}

/** Websocket manager, used to receive ws events. */
export class WSManager extends TypedEmitter<WebsocketEvents> {
    ws: WebSocket | null;
    token: string;
    client!: Client;
    params: WSManagerParams;
    apiversion: string | number;
    proxyURL: string;
    reconnect?: boolean;
    reconnectAttemptLimit?: number;
    replayMissedEvents?: boolean;
    #heartbeatInterval: NodeJS.Timeout | null;
    lastMessageID?: string;
    firstwsMessage: boolean;
    currReconnectAttempt: number;
    reconnectInterval: number;
    alive?: boolean;
    lastHeartbeatSent: number;
    lastHeartbeatReceived: number;
    lastHeartbeatAck: boolean;
    latency: number;
    heartbeatRequested: boolean;
    connected: boolean;
    connectionTimeout: number;
    #connectTimeout: NodeJS.Timeout | null;
    compression: boolean;
    #sharedZLib!: Pako.Inflate | Inflate;
    constructor(client: Client, params: WSManagerParams) {
        super();
        Object.defineProperties(this, {
            client: {
                value:        client,
                enumerable:   false,
                writable:     false,
                configurable: false
            },
            ws: {
                value:        null,
                enumerable:   false,
                writable:     true,
                configurable: false
            }
        });
        this.params = params;
        this.token = params.token;
        this.apiversion = params.apiversion ?? pkgconfig.GuildedAPI.GatewayVersion ?? 1;
        this.proxyURL = params.proxyURL ?? pkgconfig.GuildedAPI.GatewayURL ?? `wss://www.guilded.gg/websocket/v${this.apiversion}`;
        this.reconnect = params.reconnect ?? true;
        this.reconnectAttemptLimit = params.reconnectAttemptLimit ?? 1;
        this.reconnectInterval = 1000;
        this.replayMissedEvents = params.replayMissedEvents ?? true;
        this.#heartbeatInterval = null;

        this.ws = null;

        this.firstwsMessage = true;
        this.lastMessageID = undefined;
        this.currReconnectAttempt = 0;

        this.alive = false;
        this.latency = 1000;
        this.lastHeartbeatSent = NaN;
        this.lastHeartbeatReceived = NaN;
        this.lastHeartbeatAck = false;
        this.heartbeatRequested = false;
        this.connected = false;
        this.connectionTimeout = 30000;
        this.#connectTimeout = null;

        this.compression = params.compression ?? false; // not enabled, guilded doesn't support compression for now.

        setInterval(() => {
            console.log(this.latency);
        }, 1000);
    }

    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type

    get vAPI(): number {
        return this.apiversion as number;
    }

    _debug(message: string | object): boolean {
        return this.emit("debug", `[TouchGuild DEBUG]: ${message.toString()}`);
    }

    get replayEventsCondition(): boolean {
        return this.replayMissedEvents === true && this.lastMessageID !== undefined;
    }

    connect(): void | Error {
        if (this.ws && this.ws.readyState !== WebSocket.CLOSED) {
            this.client.emit("error", new Error("Calling connect while an existing connection is already established."));
            return;
        }
        this.currReconnectAttempt++;
        this.initialize();
    }

    private initialize(): void {
        if (!this.token) return this.disconnect(false, new Error("Invalid Token."));

        if (this.compression) {
            if (!ZlibSync) {
                throw new Error("Cannot use compression without the pako or zlib-sync module.");
            }
            this.client.emit("debug", "Initializing compression.");
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
            this.#sharedZLib = new ZlibSync.Inflate({ chunkSize: 128 * 1024 });
        }

        const wsoptions = { headers: { Authorization: `Bearer ${this.params.token}` }, protocol: "HTTPS" };
        if (this.replayEventsCondition) Object.assign(wsoptions.headers, { "guilded-last-message-id": this.lastMessageID });
        this.ws = new WebSocket(this.proxyURL, wsoptions);

        this.ws.on("open", this.onSocketOpen.bind(this));
        this.ws.on("close", this.onSocketClose.bind(this));
        this.ws.on("ping", this.onSocketPing.bind(this));
        this.ws.on("pong", this.onSocketPong.bind(this));

        this.ws.on("message", (args: string)=> {
            if (this.firstwsMessage === true) {
                this.firstwsMessage = false;
            }
            this.onSocketMessage(args);
        });

        this.ws.on("error", (err: Error) => {
            this.onSocketError.bind(this)(err as Error);
            console.error("GATEWAY ERR: Couldn't connect to Guilded.");
        });

        this.#connectTimeout = setTimeout(() => {
            if (!this.connected) {
                this.disconnect(undefined, new Error("Connection timeout."));
            }
        }, this.connectionTimeout);
    }

    private onSocketMessage(data: Data): void | undefined {
        if (typeof data === "string") {
            data = Buffer.from(data);
        }
        try {
            if (data instanceof ArrayBuffer) {
                if (this.compression || Erlpack) {
                    data = Buffer.from(data);
                }

            } else if (Array.isArray(data)) {
                data = Buffer.concat(data);
            }

            assert(is<Buffer>(data));
            if (this.compression) {
                if (data.length >= 4 && data.readUInt32BE(data.length - 4) === 0x30307D7D) {
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
                    this.#sharedZLib.push(data, zlibConstants!.Z_SYNC_FLUSH);
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
                    if (this.#sharedZLib.err) {
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/restrict-template-expressions
                        this.client.emit("error", new Error(`ZLib ERROR ${this.#sharedZLib.err}: ${this.#sharedZLib.msg ?? ""}`));
                        return;
                    }

                    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-argument
                    data = Buffer.from(this.#sharedZLib.result ?? "");
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
                    return this.onPacket((Erlpack ? Erlpack.unpack(data as Buffer) : JSON.parse(data.toString())) as AnyPacket);
                } else {
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
                    this.#sharedZLib.push(data, false);
                }
            } else if (Erlpack) {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
                return this.onPacket(Erlpack.unpack(data) as AnyPacket);
            } else {
                return this.onPacket(JSON.parse(data.toString()) as AnyPacket);
            }

        } catch (err) {
            this.client.emit("error", err as Error);
        }
    }

    private onPacket(packet: AnyPacket): void {
        // s: Message ID used for replaying events after a disconnect.
        if (packet.s) this.lastMessageID = packet.s;
        switch (packet.op) {
            case GatewayOPCodes.Event: {
                this.emit("GATEWAY_PARSED_PACKET", packet.t, packet.d as object);
                this.emit("GATEWAY_PACKET", packet);
                break;
            }
            case GatewayOPCodes.Welcome: {
                if (!packet.d) throw new Error("WSERR: Couldn't get packet data.");
                if (!packet.d["heartbeatIntervalMs" as keyof object]) throw new Error("WSERR: Couldn't get the heartbeat interval.");
                if (this.#connectTimeout) {
                    clearInterval(this.#connectTimeout);
                }
                this.#heartbeatInterval = setInterval(() => this.heartbeat(), packet.d["heartbeatIntervalMs" as keyof object] as number);
                this.emit("GATEWAY_WELCOME", packet.d["user" as keyof object] as APIBotUser);
                this.emit("GATEWAY_WELCOME_PACKET", packet as WelcomePacket);
                this.connected = true;
                break;
            }
            case GatewayOPCodes.Resume: {
                this.lastMessageID = undefined;
                break;
            }
            default: {
                this.emit("GATEWAY_UNKNOWN_PACKET", "??UNKNOWN OPCODE??", packet);
                break;
            }
        }
    }

    private onSocketOpen(): void {
        this.alive = true;
        this.emit("debug", "Socket connection is open.");
    }

    private onSocketError(error: Error): void {
        this.client.emit("error", error);
        this.emit("error", error); this.emit("exit", error);
        this.alive = false; return void 0;
    }

    private onSocketClose(code: number, r: Buffer): void {
        const reason = r.toString();
        let reconnect: boolean | undefined;
        let err: Error | undefined;
        this.alive = false;
        if (code) {
            this.client.emit("debug", `${code === 1000 ? "Clean" : "Unclean"} WS close: ${code}: ${reason}`);
            switch (code) {
                case 1006: {
                    err = new GatewayError("Connection lost", code);
                    break;
                }
                default: {
                    err = new GatewayError(reason, code);
                    break;
                }
            }
            this.disconnect(reconnect, err);
        }
    }

    private onSocketPing(): void {
        // this._debug("Heartbeat has been sent.");
        this.ws!.ping(); this.lastHeartbeatSent = Date.now();
    }

    private onSocketPong(): void {
        this.client.emit("debug", "Heartbeat acknowledged.");
        if (!Number.isNaN(this.lastHeartbeatSent)) this.latency = Date.now() - this.lastHeartbeatSent;
        this.lastHeartbeatAck = true;
    }

    private heartbeat(): void | boolean {
        if (this.heartbeatRequested) {
            if (!this.lastHeartbeatAck) {
                this.lastHeartbeatAck = false;
                return this.client.emit("error", new Error("Server didn't acknowledge the previous heartbeat, possible lost connection."));
            }
            this.heartbeatRequested = false;
        } else {
            this.client.emit("debug", "Heartbeat requested.");
            this.ws?.ping();
            this.heartbeatRequested = true;
            this.lastHeartbeatAck = false;
        }
    }

    disconnect(reconnect = this.reconnect, error?: Error): void {
        this.ws?.close();
        this.alive = false;
        this.connected = false;

        if (this.#heartbeatInterval) {
            clearInterval(this.#heartbeatInterval);
            this.#heartbeatInterval = null;
        }

        if (this.ws?.readyState !== WebSocket.CLOSED) {
            this.ws?.removeAllListeners();
            try {
                if (reconnect) {
                    if (this.ws?.readyState !== WebSocket.OPEN) {
                        this.ws?.close(4999, "Reconnect");
                    } else {
                        this.client.emit("debug", "Closing websocket.");
                        this.ws.terminate();
                    }
                } else {
                    this.ws?.close(1000, "Normal Close");
                }

            } catch (err) {
                this.client.emit("error", err as Error);
            }
        }

        if (error) {
            if (error instanceof GatewayError && [1001, 1006].includes(error.code)) {
                this.client.emit("debug", error.message);
            } else {
                this.client.emit("error", error);
            }
        }

        this.ws = null;
        this.reset();

        this.emit("disconnect", error as Error);

        if (this.currReconnectAttempt >= (this.reconnectAttemptLimit as number)) {
            this.client.emit("debug", `Automatically invalidating session due to excessive resume attempts | Attempt ${this.currReconnectAttempt}`);
        }

        if (reconnect) {
            if (this.lastMessageID) {
                this.client.emit("debug", `Immediately reconnecting for potential resume | Attempt ${this.currReconnectAttempt}`);
                this.connect();
            } else {
                this.client.emit("debug", `Queueing reconnect in ${this.reconnectInterval}ms | Attempt ${this.currReconnectAttempt}`);
                setTimeout(() => {
                    this.connect();
                }, this.reconnectInterval);
                this.reconnectInterval = Math.min(Math.round(this.reconnectInterval * (Math.random() * 2 + 1)), 30000);
            }
        } else {
            this.hardReset();
        }
    }

    reset(): void {
        this.ws = null;
        this.firstwsMessage = true;
        this.lastMessageID = undefined;
        this.currReconnectAttempt = 0;

        this.alive = false;
        this.latency = NaN;
        this.lastHeartbeatSent = NaN;
        this.lastHeartbeatReceived = NaN;
        this.lastHeartbeatAck = false;
        this.heartbeatRequested = false;
        this.connectionTimeout = 30000;
        this.#connectTimeout = null;
    }

    hardReset(): void {
        this.reset();
        this.token = this.params.token;
        this.apiversion = this.params.apiversion ?? pkgconfig.GuildedAPI.GatewayVersion ?? 1;
        this.proxyURL = this.params.proxyURL ?? pkgconfig.GuildedAPI.GatewayURL ?? `wss://www.guilded.gg/websocket/v${this.apiversion}`;
        this.reconnect = this.params.reconnect ?? true;
        this.reconnectAttemptLimit = this.params.reconnectAttemptLimit ?? 1;
        this.replayMissedEvents = this.params.replayMissedEvents ?? true;
        this.#heartbeatInterval = null;

        this.ws = null;
        this.firstwsMessage = true;
        this.lastMessageID = undefined;
        this.currReconnectAttempt = 0;

        this.alive = false;
        this.latency = NaN;
        this.lastHeartbeatSent = NaN;
        this.lastHeartbeatReceived = NaN;
        this.lastHeartbeatAck = false;
        this.heartbeatRequested = false;
        this.connectionTimeout = 30000;
        this.#connectTimeout = null;
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
    /** Client. */
    client: Client;
    /** Compression */
    compression?: boolean;
}
