import WebSocket from 'ws'
import { Message } from './Message';
import { Channel } from './Channel';

import emitterbuilder from 'emitterbuilder'
import { GatewayEventHandler } from '../gateway/events/GatewayEventHandler';
import { GatewayHandler } from '../gateway/GatewayHandler';
import { WSManager } from '../WSManager';

import fetch from 'sync-fetch';
import { User } from './User';
import { Member } from './Member';
import { Guild } from './Guild';
import { FETCH, SYNCFETCH } from '../Utils';

import EventEmitter from 'events';
import type TypedEmitter from 'typed-emitter'

export type EmitterTypes = {
    message: (message: string) => void
    error: (error: Error) => void,
    ready: ()=> void,
    messageCreate: (message: Message) => void,
    messageUpdate: (message: Message) => void,
    messageDelete: (message: Message) => void,
    channelCreate: (channel: Channel) => void,
    channelUpdate: (channel: Channel) => void,
    channelDelete: (channel: Channel) => void,
    exit: (message: string) => void
}

export class Client extends (EventEmitter as unknown as new () => TypedEmitter<EmitterTypes>) {
    // types
    params: {token: string}; ws: any; cache: any;
    identifiers: {
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
    constructor(params: {token: string}){
        if (typeof params !== "object") throw new Error("The token isn't provided in an object.");
        if (typeof params?.token == "undefined") throw new Error("Cannot create client without token, no token is provided.");
        super();
        this.params = params;
        this.ws = new WSManager({token: this.token, proxyURL: undefined, apiversion: undefined, reconnect: undefined, reconnectAttemptLimit: undefined})
        this.cache = new Map();

        this.identifiers = this.ws.identifiers;
        
    }

    get token(){
        //console.log("GuilderJS WARN! : Returned token value, do not share this token to anyone.");
        return this.params.token;
    }

    connect(...args:any[]){
        this.ws.connect();
        this.ws.emitter.on('ready', ()=> {
            console.log('Connected to Guilded!');
            this.emit('ready');
        })

        this.ws.emitter.on('message', (args:string)=> {
            const {t: eventType, d: eventData} = JSON.parse(args);
            new GatewayHandler(this).handleMessage(eventType, eventData);
        })
    }

    getChannel(channelId:string){
        let response = SYNCFETCH('GET', `/channels/${channelId}`, this.token, null)
        return new Channel(response, this)
    }

    getMember(serverID: string, memberID: string){
        let response = SYNCFETCH('GET', `/servers/${serverID}/members/${memberID}`, this.token, null)
        return new Member(response.member, this);
    }

    getGuild(guildID: string){
        let response = SYNCFETCH('GET', `/servers/${guildID}`, this.token, null)
        return new Guild(response, this);
    }

    createChannel(location = {guildID: undefined, groupID: undefined, categoryID: undefined}, name: string, type:string, options = {topic: undefined, isPublic: undefined}){
        var body = {}
        Object.assign(body, {name: name, type: type})
        if (location.guildID) Object.assign(body, {serverId: location.guildID})
        if (location.groupID) Object.assign(body, {groupId: location.groupID})
        if (location.categoryID) Object.assign(body, {categoryId: location.categoryID})

        if (options.topic) Object.assign(body, {topic: options.topic});
        if (options.isPublic) Object.assign(body, {isPublic: options.isPublic});

        let response = SYNCFETCH('POST', '/channels', this.token, JSON.stringify(body))
    }

    async createMessage(channelID:string, options = {}){
        let bodyContent = JSON.stringify(options)
        let response = await FETCH('POST', `/channels/${channelID}/messages`, this.token, bodyContent)
        return new Message(response, this);
    }

    async editMessage(channelID:string, messageID:string, newMessage:object){
        if (typeof newMessage !== 'object') throw new TypeError("newMessage should be an Object. (example: {content: 'heyo!'})")
        let response = await FETCH('PUT', `/channels/${channelID}/messages/${messageID}`, this.token, JSON.stringify(newMessage))
    }

    async deleteMessage(channelID:string, messageID:string){
        await FETCH('DELETE', `/channels/${channelID}/messages/${messageID}`, this.token, null);
    }
}