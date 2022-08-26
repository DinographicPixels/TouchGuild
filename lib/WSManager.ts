import { GatewayHandler } from "./gateway/GatewayHandler";
import WebSocket from 'ws'
import { Client } from "./structures/Client";
import emitterbuilder from 'emitterbuilder';
import EventEmitter from "events";

export class WSManager{
    constructor(public readonly params:WSManagerParams){}
    
    token = this.params.token;
    apiversion = this.params.apiversion ?? 1;
    proxyURL = this.params.proxyURL ?? `wss://api.guilded.gg/v${this.apiversion}/websocket`;
    reconnect? = this.params.reconnect ?? true;
    reconnectAttemptLimit = this.params.reconnectAttemptLimit ?? 1;

    emitter = new emitterbuilder({ignoreWarns: true});

    ws = new WebSocket(this.proxyURL, {headers: {Authorization: `Bearer ${this.params.token}`}, protocol: "HTTPS"})

    firstwsMessage = true;


    //lastMessageID = undefined;

    get identifiers(){
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
        }
    }

    get vAPI(){
        return this.apiversion;
    }

    connect():void {
        this.ws.on('open', function() {
            ///
        });

        this.ws.on('message', (args:string)=> {
            if (this.firstwsMessage == true) {this.firstwsMessage = false; this.emitter.emit('ready');}
            this.emitter.on('socketMessage', this.onSocketMessage(args))
        })

        this.ws.on('error', function(err:any) {
            console.log("GuilderJS ERR: Couldn't connect to Guilded API.");
            console.log(err);
        });
    }

    private onSocketMessage(rawData: string){
        try{ var {t: eventType, d: eventData} = JSON.parse(rawData); }catch(err){ this.emitter.emit("exit", "Error while parsing data."); return void 0; }
        this.emitter.emit('message', rawData);
    }

    private onSocketOpen(){

    }

    private onSocketError(){

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
}