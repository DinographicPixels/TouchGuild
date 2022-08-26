import WebSocket from 'ws';
export declare class WSManager {
    readonly params: WSManagerParams;
    constructor(params: WSManagerParams);
    token: string;
    apiversion: any;
    proxyURL: any;
    reconnect?: any;
    reconnectAttemptLimit: any;
    emitter: {
        _events: any;
        options: {
            ignoreWarns: boolean;
        };
        on(name: string | number, listener: any): void;
        once(name: string | number, listener: any): void;
        removeListener(name: string | number, listenerToRemove: any): void;
        removeAllListeners(name: string | number): void;
        removeONlisteners(name: string | number): void;
        removeONCElisteners(name: string | number): void;
        resetListeners(): boolean;
        resetONlisteners(): boolean;
        resetONCElisteners(): boolean;
        emit(name: string | number, ...args: any[]): void;
        manager(): {
            _events: any;
            options: {
                ignoreWarns: boolean;
            };
        };
    };
    ws: WebSocket;
    firstwsMessage: boolean;
    get identifiers(): {
        Message: {
            ChatMessageCreated: string;
            ChatMessageUpdated: string;
            ChatMessageDeleted: string;
        };
        Channel: {
            TeamChannelCreated: string;
            TeamChannelUpdated: string;
            TeamChannelDeleted: string;
        };
    };
    get vAPI(): any;
    connect(): void;
    private onSocketMessage;
    private onSocketOpen;
    private onSocketError;
}
export interface WSManagerParams {
    /** Bot's token */
    token: string;
    /** Guilded API URL */
    proxyURL: string | any;
    /** Guilded API Version */
    apiversion: number | 1 | any;
    /** Automatically re-establish connection on error */
    reconnect?: boolean | any;
    /** Reconnect limit */
    reconnectAttemptLimit: number | any;
}
