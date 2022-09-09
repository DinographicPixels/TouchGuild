import WebSocket from 'ws';
export declare class WSManager {
    readonly params: WSManagerParams;
    constructor(params: WSManagerParams);
    token: string;
    apiversion: any;
    proxyURL: any;
    reconnect?: any;
    reconnectAttemptLimit: any;
    replayMissedEvents?: any;
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
    lastMessageID: string | null;
    currReconnectAttempt: number;
    alive?: boolean;
    ping: number;
    lastPingTime: number;
    get identifiers(): {
        Message: {
            ChatMessageCreated: string;
            ChatMessageUpdated: string;
            ChatMessageDeleted: string;
            ChannelMessageReactionCreated: string;
            ChannelMessageReactionDeleted: string;
        };
        Channel: {
            TeamChannelCreated: string;
            TeamChannelUpdated: string;
            TeamChannelDeleted: string;
        };
        ForumTopic: {
            ForumTopicCreated: string;
            ForumTopicUpdated: string;
            ForumTopicDeleted: string;
            ForumTopicPinned: string;
            ForumTopicUnpinned: string;
        };
        Guild: {
            TeamMemberBanned: string;
            TeamMemberUnbanned: string;
            TeamMemberJoined: string;
            TeamMemberRemoved: string;
            TeamMemberUpdated: string;
            teamRolesUpdated: string;
        };
        Webhook: {
            TeamWebhookCreated: string;
            TeamWebhookUpdated: string;
        };
        Doc: {
            DocCreated: string;
            DocUpdated: string;
            DocDeleted: string;
        };
        Calendar: {
            CalendarEventCreated: string;
            CalendarEventUpdated: string;
            CalendarEventDeleted: string;
            CalendarEventRsvpUpdated: string;
            CalendarEventRsvpDeleted: string;
        };
        List: {
            ListItemCreated: string;
            ListItemUpdated: string;
            ListItemDeleted: string;
            ListItemCompleted: string;
            ListItemUncompleted: string;
        };
    };
    get vAPI(): any;
    _debug(message: string | any): boolean;
    get replayEventsCondition(): string | false | null;
    connect(): void;
    closeAll(): void;
    private onSocketMessage;
    private onSocketOpen;
    private onSocketError;
    private onSocketClose;
    private onSocketPing;
    private onSocketPong;
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
    /** Replay missed events on connection interruption */
    replayMissedEvents: boolean | any;
}
