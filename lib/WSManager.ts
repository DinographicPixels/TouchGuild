import WebSocket from 'ws'
import emitterbuilder from 'emitterbuilder';

export class WSManager{
    constructor(public readonly params:WSManagerParams){}
    
    token = this.params.token;
    apiversion = this.params.apiversion ?? 1;
    proxyURL = this.params.proxyURL ?? `wss://www.guilded.gg/websocket/v${this.apiversion}`;
    reconnect? = this.params.reconnect ?? true;
    reconnectAttemptLimit = this.params.reconnectAttemptLimit ?? 1;
    replayMissedEvents? = this.params.replayMissedEvents ?? true;

    emitter = new emitterbuilder({ignoreWarns: true});

    ws = new WebSocket(this.proxyURL, {headers: {Authorization: `Bearer ${this.params.token}`}, protocol: "HTTPS"})

    firstwsMessage = true;
    lastMessageID:string|null = null;
    currReconnectAttempt = 0;

    alive?: boolean = false;
    ping:number = NaN;
    lastPingTime = NaN;


    //lastMessageID = undefined;

    get identifiers(){
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
        }
    }

    get vAPI(){
        return this.apiversion;
    }

    _debug(message: string|any) {
        return this.ws.emit("debug", `[TouchGuild DEBUG]: ${message}`);
    }

    get replayEventsCondition(){
        return this.replayMissedEvents == true && this.lastMessageID;
    }

    connect():void {
        var wsoptions:object|any = {headers: {Authorization: `Bearer ${this.params.token}`}, protocol: "HTTPS"}
        if (this.replayEventsCondition) wsoptions['headers']['guilded-last-message-id' as keyof object] = this.lastMessageID;

        try {
            this.ws = new WebSocket(this.proxyURL, wsoptions);
        }catch (err){
            if (!this.replayEventsCondition) throw err;
            this.lastMessageID = null;
            return this.connect();
        }

        this.ws.on("open", this.onSocketOpen.bind(this));
        this.ws.on("ping", this.onSocketPing.bind(this));
        this.ws.on("pong", this.onSocketPong.bind(this));

        this.ws.on('message', (args:string)=> {
            if (this.firstwsMessage == true) {this.firstwsMessage = false;}
            this.emitter.on('socketMessage', this.onSocketMessage(args))
        })

        this.ws.on('error', (err:any) => {
            this.onSocketError(err);
            console.log("GATEWAY ERR: Couldn't connect to Guilded API.");
            if (this.reconnect == true || this.reconnectAttemptLimit < this.currReconnectAttempt){
                this.currReconnectAttempt++; return this.connect();
            }
            this.closeAll();
        });

        this.ws.on('close', (code, reason)=> {
            this._debug(`Connection to gateway has been terminated with code ${code}, reason: ${reason.toString()}`)
            this.closeAll()
        })
    }

    closeAll(){
        if (!this.ws) throw new Error("There's no active connection to close.");
        this.ws.removeAllListeners();
        if (this.ws.OPEN) this.ws.close();
        this.alive = false;
    }

    private onSocketMessage(rawData: string){
        const packet = rawData;
        // s: Message ID used for replaying events after a disconnect.
        try{ 
            var {t: eventTYPE, d: eventDATA, s: eventMSGID, op: opCODE} = JSON.parse(packet); 
        }catch(err){ this.emitter.emit("exit", "Error while parsing data."); return void 0; }

        const OPCODES_REG = {
            SUCCESS: 0,
            WELCOME: 1,
            RESUME: 2
        }
        // opcodes are listed in order.
        switch (opCODE) {
            case OPCODES_REG.SUCCESS:
                this.emitter.emit("gatewayEvent", eventTYPE, eventDATA);
                this.emitter.emit("gatewayEventPacket", packet);
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
        //this.emitter.emit('message', rawData); deprecated.
    }

    private onSocketOpen(){
        this.alive = true;
        this.emitter.emit('debug', 'Socket connection is open.')
    }

    private onSocketError(error:string|any){
        this.emitter.emit('debug', error); this.emitter.emit('exit', error);
        this.alive = false; return void 0;
    }

    private onSocketClose(){
        
    }

    private onSocketPing(){
        this._debug("Ping! has been received.");
        this.ws!.ping(); this.lastPingTime = Date.now();
    }

    private onSocketPong(){
        this._debug("Pong received!");
        this.ping = this.lastPingTime - Date.now();
    }
}


export interface WSManagerParams {
    /** Bot's token */
    token: string,
    /** Guilded API URL */
    proxyURL: string | any,
    /** Guilded API Version */
    apiversion: number | 1 | any,
    /** Automatically re-establish connection on error */
    reconnect?: boolean | any,
    /** Reconnect limit */
    reconnectAttemptLimit: number | any,
    /** Replay missed events on connection interruption */
    replayMissedEvents: boolean | any
}


//// PINGING TESTS
/* if (eventDATA.heartbeatIntervalMs !== undefined){
     setInterval(() => {
         console.log('pinged')
         this.ws.ping()
     }, eventDATA.heartbeatIntervalMs);
 }
 console.log(eventDATA.heartbeatIntervalMs)
*/