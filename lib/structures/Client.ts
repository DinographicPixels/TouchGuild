import { Message, MessageOptions } from './Message';
import { Channel, ChannelCategories } from './Channel';

import { GatewayHandler } from '../gateway/GatewayHandler';
import { WSManager } from '../WSManager';

import { Member } from './Member';
import { Guild } from './Guild';
import { call } from '../Utils';

import EventEmitter from 'events';
import type TypedEmitter from 'typed-emitter'
import { ForumTopic } from './ForumTopic';
import { BannedMember } from './BannedMember';
import { MemberRemoveInfo, MemberRoleUpdateInfo, MemberUpdateInfo } from '../gateway/events/GuildHandler';
import { Webhook } from './Webhook';

import * as endpoints from '../rest/endpoints';
import { Doc } from './Doc';
import { CalendarEvent } from './CalendarEvent';
import { CalendarEventRSVP } from './CalendarRSVP';
import { ListItem } from './ListItem';
import { messageReactionTypes } from '../Types';

const calls = new call();

export type EmitterTypes = {
    message: (message: string) => void
    error: (error: Error) => void,
    ready: ()=> void,
    messageCreate: (message: Message) => void,
    messageUpdate: (message: Message) => void,
    messageDelete: (message: Message) => void,
    messageReactionAdd: (reactionInfo: messageReactionTypes) => void,
    messageReactionRemove: (reactionInfo: messageReactionTypes) => void,
    channelCreate: (channel: Channel) => void,
    channelUpdate: (channel: Channel) => void,
    channelDelete: (channel: Channel) => void,
    forumTopicCreate: (topic: ForumTopic) => void,
    forumTopicUpdate: (topic: ForumTopic) => void,
    forumTopicDelete: (topic: ForumTopic) => void,
    forumTopicPin: (topic: ForumTopic) => void,
    forumTopicUnpin: (topic: ForumTopic) => void,
    guildBanAdd: (BannedMember: BannedMember) => void,
    guildBanRemove: (BannedMember: BannedMember) => void,
    guildMemberAdd: (Member: Member)=> void,
    guildMemberRemove: (MemberRemoveInfo: MemberRemoveInfo) => void,
    guildMemberUpdate: (MemberUpdateInfo: MemberUpdateInfo) => void,
    guildMemberRoleUpdate: (MemberRoleUpdateInfo: MemberRoleUpdateInfo) => void,
    docCreate: (Doc: Doc) => void,
    docUpdate: (Doc: Doc) => void,
    docDelete: (DeletedDoc: Doc) => void,
    calendarEventCreate: (CalendarEvent: CalendarEvent) => void,
    calendarEventUpdate: (CalendarEvent: CalendarEvent) => void,
    calendarEventDelete: (CalendarEvent: CalendarEvent) => void,
    calendarEventRsvpUpdate: (CalendarRSVP: CalendarEventRSVP) => void,
    calendarEventRsvpDelete: (CalendarRSVP: CalendarEventRSVP) => void,
    listItemCreate: (ListItem: ListItem)=> void,
    listItemUpdate: (ListItem: ListItem)=> void,
    listItemDelete: (ListItem: ListItem)=> void,
    listItemComplete: (ListItem: ListItem)=> void,
    listItemUncomplete: (ListItem: ListItem)=> void,
    webhooksCreate: (Webhook: Webhook)=> void,
    webhooksUpdate: (Webhook: Webhook)=> void,
    exit: (message: string) => void
}

export class Client extends (EventEmitter as unknown as new () => TypedEmitter<EmitterTypes>) {
    // types
    params: {token: string, REST?: boolean}; ws: WSManager; cache: any; identifiers;
    constructor(params: {token: string, REST?: boolean}){
        if (typeof params !== "object") throw new Error("The token isn't provided in an object.");
        if (typeof params?.token == "undefined") throw new Error("Cannot create client without token, no token is provided.");
        super();
        this.params = {token: params.token, REST: params.REST ?? true}
        this.ws = new WSManager({token: this.token, proxyURL: undefined, apiversion: undefined, reconnect: undefined, reconnectAttemptLimit: undefined, replayMissedEvents: undefined})
        this.cache = new Map();
        this.identifiers = this.ws.identifiers;
    }

    /** Bot's token. */
    get token(){
        //console.log("TouchGuild WARN! : Returned token value, do not share this token to anyone.");
        return this.params.token;
    }

    /** Connect to the Guilded API. */
    connect(...args:any[]): void{
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

    /** Disconnect from the Guilded API. */
    disconnect(crashOnDisconnect?: boolean): void{
        this.ws.closeAll(); // closing all connections.
        console.log("The connection has been terminated.");
        if (crashOnDisconnect) throw 'Connection closed.';
    }

    // REST
    /** RESTChannel is a Channel component with every method, params you need. */
    async getRESTChannel(channelID:string): Promise<Channel>{
        if (this.params.REST == false) throw new TypeError("REST has been manually disabled, you can't use REST methods.");
        let response:any = await calls.get(endpoints.CHANNEL(channelID), this.token);
        // let response = SYNCFETCH('GET', `/channels/${channelID}`, this.token, null) [deprecated]
        return new Channel(response.data.channel, this)
    }

    /** RESTMember is a Member component with every method, params you need. */
    async getRESTMember(guildID: string, memberID: string): Promise<Member>{
        if (this.params.REST == false) throw new TypeError("REST has been manually disabled, you can't use REST methods.");
        let response:any = await calls.get(endpoints.GUILD_MEMBER(guildID, memberID), this.token);
        // let response = SYNCFETCH('GET', `/servers/${guildID}/members/${memberID}`, this.token, null) [deprecated]
        return new Member(response.data.member, this, guildID);
    }

    /** RESTGuild is basically a Guild Component with everything you need. */
    async getRESTGuild(guildID: string): Promise<Guild>{
        if (this.params.REST == false) throw new TypeError("REST has been manually disabled, you can't use REST methods.");
        let response:any = await calls.get(endpoints.GUILD(guildID), this.token);
        // let response = SYNCFETCH('GET', `/servers/${guildID}`, this.token, null) [deprecated]
        return new Guild(response.data.server, this);
    }

    /** Getting RESTChannelMessages will return you an Array of multiple Message component, that process can take some time. */
    async getRESTChannelMessages(channelID: string, filter?: {before?: string; after?: string; limit?: number; includePrivate?: boolean}): Promise<Array<Message>>{
        if (this.params.REST == false) throw new TypeError("REST has been manually disabled, you can't use REST methods.");
        let response:any = await calls.get(endpoints.CHANNEL_MESSAGES(channelID), this.token);
        let channelMSGs:Array<Message> = [];
        for (const message of response.data.messages){
            if (message.type !== 'system'){
            channelMSGs.push(new Message(message, this));
            }
        }
        return channelMSGs;
    }

    // docs
    /** Getting RESTChannelDocs will return you an Array of multiple Doc component, that process can take some time. */
    async getRESTChannelDocs(channelID: string, filter?: {before?: string; limit?: number}): Promise<Array<Doc>>{
        if (this.params.REST == false) throw new TypeError("REST has been manually disabled, you can't use REST methods.");
        let response:any = await calls.get(endpoints.CHANNEL_DOCS(channelID), this.token, filter);
        let docsARRAY:Array<Doc> = [];
        for (const doc of response.data.docs){
            docsARRAY.push(new Doc(doc, this));
        }
        return docsARRAY;
    }

    /** RESTChannelDoc is a Doc component. */
    async getRESTChannelDoc(channelID: string, docID: number): Promise<Doc>{
        if (this.params.REST == false) throw new TypeError("REST has been manually disabled, you can't use REST methods.");
        let response:any = await calls.get(endpoints.CHANNEL_DOC(channelID, docID), this.token);
        return new Doc(response.data.doc, this);
    }

    //  topics
    /** Getting RESTForumTopics will return you an Array of ForumTopic, that process can take some time. */
    async getRESTForumTopics(channelID: string, filter?: {before?: string; limit?: number}): Promise<Array<ForumTopic>>{
        if (this.params.REST == false) throw new TypeError("REST has been manually disabled, you can't use REST methods.");
        let response:any = await calls.get(endpoints.FORUM_TOPICS(channelID), this.token, filter);
        let topicARRAY:Array<ForumTopic> = [];
        for (const topic of response.data.forumTopics){
            topicARRAY.push(new ForumTopic(topic, this));
        }
        return topicARRAY;
    }

    /** RESTForumTopic is a ForumTopic component. */
    async getRESTForumTopic(channelID: string, topicID: number): Promise<ForumTopic>{
        if (this.params.REST == false) throw new TypeError("REST has been manually disabled, you can't use REST methods.");
        let response:any = await calls.get(endpoints.FORUM_TOPIC(channelID, topicID), this.token);
        return new ForumTopic(response.data.forumTopic, this);
    }

    // Calendar
    /** Getting RESTCalendarEvents returns you an Array of multiple CalendarEvent component, this process can take time depending on the number of calendar event. */
    async getRESTCalendarEvents(channelID: string, filter?: {before?: string; after?: string; limit?: number}): Promise<Array<CalendarEvent>>{
        if (this.params.REST == false) throw new TypeError("REST has been manually disabled, you can't use REST methods.");
        let response:any = await calls.get(endpoints.CHANNEL_EVENTS(channelID), this.token, filter);
        let cEventArray:Array<CalendarEvent> = [];
        for (const event of response.data.calendarEvents){
            cEventArray.push(new CalendarEvent(event, this));
        }
        return cEventArray;
    }

    /** RESTCalendarEvent is a CalendarEvent component. */
    async getRESTCalendarEvent(channelID: string, eventID: number): Promise<CalendarEvent>{
        if (this.params.REST == false) throw new TypeError("REST has been manually disabled, you can't use REST methods.");
        let response:any = await calls.get(endpoints.CHANNEL_EVENT(channelID, eventID), this.token);
        return new CalendarEvent(response.data.calendarEvent, this);
    }

    /** RESTCalendarRsvp is a CalendarEventRSVP component. */
    async getRESTCalendarRsvp(channelID: string, eventID: number, memberID: string): Promise<CalendarEventRSVP>{
        if (this.params.REST == false) throw new TypeError("REST has been manually disabled, you can't use REST methods.");
        let response:any = await calls.get(endpoints.CHANNEL_EVENT_RSVP(channelID, eventID, memberID), this.token);
        return new CalendarEventRSVP(response.data.calendarEventRsvp, this);
    }

    /** Getting RESTCalendarRsvps will return you an Array of CalendarEventRSVP, this process can take time.*/
    async getRESTCalendarRsvps(channelID: string, eventID: number): Promise<Array<CalendarEventRSVP>>{
        if (this.params.REST == false) throw new TypeError("REST has been manually disabled, you can't use REST methods.");
        let response:any = await calls.get(endpoints.CHANNEL_EVENT_RSVPS(channelID, eventID), this.token);
        let array: Array<CalendarEventRSVP> = [];
        for (const eventRsvp of response.data.calendarEventRsvps){
            array.push(new CalendarEventRSVP(eventRsvp, this));
        }
        return array;
    }

    // list item
    /** RESTListItem is a ListItem component. */
    async getRESTListItem(channelID: string, itemID: string): Promise<ListItem>{
        if (this.params.REST == false) throw new TypeError("REST has been manually disabled, you can't use REST methods.");
        let response:any = await calls.get(endpoints.LIST_ITEM(channelID, itemID), this.token);
        return new ListItem(response.data.listItem, this);
    }

    /** Getting RESTListItems will return you an Array of ListItems, this process can take time.*/
    async getRESTListItems(channelID: string): Promise<Array<ListItem>>{
        if (this.params.REST == false) throw new TypeError("REST has been manually disabled, you can't use REST methods.");
        let response:any = await calls.get(endpoints.LIST_ITEMS(channelID), this.token);
        let array: Array<ListItem> = [];
        for (const item of response.data.listItems){
            array.push(new ListItem(item, this));
        }
        return array;
    }

    async getRESTGuildWebhook(guildID: string, webhookID: string): Promise<Webhook>{
        if (this.params.REST == false) throw new TypeError("REST has been manually disabled, you can't use REST methods.");
        let response:any = await calls.get(endpoints.GUILD_WEBHOOK(guildID, webhookID), this.token);
        return new Webhook(response.data.webhook, this);
    }

    async getRESTChannelWebhooks(guildID: string, channelID: string): Promise<Array<Webhook>>{
        if (this.params.REST == false) throw new TypeError("REST has been manually disabled, you can't use REST methods.");
        let response:any = await calls.get(endpoints.GUILD_WEBHOOKS(guildID), this.token, {channelId: channelID});
        let array: Array<Webhook> = [];
        for (const item of response.data.webhooks){
            array.push(new Webhook(item, this));
        }
        return array;
    }

    // RAW DATA (produces less lag, and less info are gived, aren't gived as component, great for read only)
    // Note: REST takes time to treat Arrays, the methods below are here to replace them by only giving info without component.

    /** Array of object containing channel messages */
    async getChannelMessages(channelID: string, filter?: {before?: string; after?: string; limit?: number; includePrivate?: boolean}): Promise<Array<object>>{
        let response:any = await calls.get(endpoints.CHANNEL_MESSAGES(channelID), this.token, filter);
        return response.data.messages;
    }

    /** Array of object containing channel docs */
    async getChannelDocs(channelID: string, filter?: {before?: string; limit?: number}): Promise<Array<object>>{
        let response:any = await calls.get(endpoints.CHANNEL_DOCS(channelID), this.token, filter);
        return response.data.docs;
    }

    /** Array of object containing forum topics */
    async getForumTopics(channelID: string, filter?: {before?: string; limit?: number}): Promise<Array<object>>{
        let response:any = await calls.get(endpoints.FORUM_TOPICS(channelID), this.token, filter);
        return response.data.forumTopics;
    }

    /** Array of object containing calendar events */
    async getCalendarEvents(channelID: string, filter?: {before?: string; after?: string; limit?: number}): Promise<Array<object>>{
        let response:any = await calls.get(endpoints.CHANNEL_EVENTS(channelID), this.token, filter);
        return response.data.calendarEvents;
    }

    /** Array of object containing calendar rsvps */
    async getCalendarRsvps(channelID: string, eventID: number): Promise<Array<object>>{
        let response:any = await calls.get(endpoints.CHANNEL_EVENT_RSVPS(channelID, eventID), this.token);
        return response.data.calendarEventRsvps;
    }

    /** Array of object containing list items */
    async getListItems(channelID: string): Promise<Array<object>>{
        let response:any = await calls.get(endpoints.LIST_ITEMS(channelID), this.token);
        return response.data.listItems;
    }

    /** Will return an array containing every roles the member has. */
    async getMemberRoles(guildID: string, memberID: string): Promise<Array<number>>{
        let response:any = await calls.get(endpoints.GUILD_MEMBER_ROLES(guildID, memberID), this.token);
        return response.data.roleIds;
    }

    /** Array of object containing guild channel webhooks. */
    async getChannelWebhooks(guildID: string, channelID: string): Promise<Array<object>>{
        let response:any = await calls.get(endpoints.GUILD_WEBHOOKS(guildID), this.token, {channelId: channelID});
        return response.data.webhooks;
    }

    // CREATE, EDIT, DELETE.

    // message
    /** Create a channel in a specified guild. */
    async createChannel(guildID: string, name: string, type:ChannelCategories, options: {topic?: string, isPublic?: boolean, categoryID?: number, groupID?: string}): Promise<Channel>{
        var body = {}
        if (!guildID) throw new TypeError('guildID is a required parameter.');
        if (!name) throw new TypeError(`name parameter cannot be empty.`)
        if (!type) type = 'chat';
        Object.assign(body, {name: name, type: type})

        if (!options) options = {};
        if (options.categoryID && options.groupID) throw new TypeError("Two channel location id can't be defined at the same time. (categoryID & groupID)");

        Object.assign(body, {serverId: guildID})

        if(options.groupID){
            Object.assign(body, {groupId: options.groupID})
        }else if(options.categoryID){
            Object.assign(body, {categoryId: options.categoryID})
        }

        if (options){
            if (options.topic) Object.assign(body, {topic: options.topic});
            if (options.isPublic) Object.assign(body, {isPublic: options.isPublic});
        }

        //let response = SYNCFETCH('POST', '/channels', this.token, JSON.stringify(body))
        let response:any = await calls.post(endpoints.CHANNELS(), this.token, body);
        return new Channel(response.data.channel, this);
    }

    /** Create a message in a specified channel ID */
    async createMessage(channelID:string, options:MessageOptions): Promise<Message>{
        if (typeof options !== 'object') throw new TypeError('message options should be an object.');
        let bodyContent = JSON.stringify(options)
        //let response = await FETCH('POST', `/channels/${channelID}/messages`, this.token, bodyContent)
        let response:any = await calls.post(endpoints.CHANNEL_MESSAGES(channelID), this.token, options)
        return new Message(response.data.message, this);
    }

    /** Edit a specific message in a specified channel ID. */
    async editMessage(channelID:string, messageID:string, newMessage:object): Promise<Message>{
        if (typeof newMessage !== 'object') throw new TypeError("newMessage should be an Object. (example: {content: 'heyo!'})")
        //let response = await FETCH('PUT', `/channels/${channelID}/messages/${messageID}`, this.token, JSON.stringify(newMessage))
        let response:any = await calls.put(endpoints.CHANNEL_MESSAGE(channelID, messageID), this.token, newMessage);
        return new Message(response.data.message, this);
    }

    /** Delete a specific message. */
    async deleteMessage(channelID:string, messageID:string): Promise<void>{
        //await FETCH('DELETE', `/channels/${channelID}/messages/${messageID}`, this.token, null);
        await calls.delete(endpoints.CHANNEL_MESSAGE(channelID, messageID), this.token);
    }

    /** Add a reaction to a specified message */
    async addMessageReaction(channelID: string, messageID: string, reaction: number):Promise<void>{
        await calls.put(endpoints.CHANNEL_MESSAGE_CONTENT_EMOTE(channelID, messageID, reaction), this.token, {});
    }

    /** Remove a specific reaction from a message. */
    async removeMessageReaction(channelID: string, messageID: string, reaction: number):Promise<void>{
        await calls.delete(endpoints.CHANNEL_MESSAGE_CONTENT_EMOTE(channelID, messageID, reaction), this.token);
    }

    // topic
    /** Create a topic in a specified forum channel. */
    async createTopic(channelID:string, options: {title: string, content: string}): Promise<ForumTopic>{
        //let response = await FETCH('POST', `/channels/${channelID}/topics`, this.token, JSON.stringify(options))
        let response:any = await calls.post(endpoints.FORUM_TOPICS(channelID), this.token, options);
        return new ForumTopic(response.data.forumTopic, this);
    }

    /** Edit a topic from a specified forum channel. */
    async editTopic(channelID: string, topicID: number, options: {title?: string, content?: string}): Promise<ForumTopic>{
        let response:any = await calls.patch(endpoints.FORUM_TOPIC(channelID, topicID), this.token, options);
        return new ForumTopic(response.data.forumTopic, this);
    }

    /** Delete a topic from a specific forum channel */
    async deleteTopic(channelID: string, topicID: number): Promise<void>{
        await calls.delete(endpoints.FORUM_TOPIC(channelID, topicID), this.token);
    }

    /** Pin a forum topic. */
    async pinTopic(channelID: string, topicID: number): Promise<void>{
        await calls.put(endpoints.FORUM_TOPIC_PIN(channelID, topicID), this.token, {});
    }
    /** Unpin a forum topic. */
    async unpinTopic(channelID: string, topicID: number): Promise<void>{
        await calls.delete(endpoints.FORUM_TOPIC_PIN(channelID, topicID), this.token);
    }

    /** Locks a forum topic. */
    async lockTopic(channelID: string, topicID: number): Promise<void>{
        await calls.put(endpoints.FORUM_TOPIC_LOCK(channelID, topicID), this.token, {});
    }

    /** Unlocks a forum topic. */
    async unlockTopic(channelID: string, topicID: number): Promise<void>{
        await calls.delete(endpoints.FORUM_TOPIC_LOCK(channelID, topicID), this.token);
    }

    // docs
    /** Create a doc in a specified 'docs' channel. */
    async createDoc(channelID: string, options: {title: string, content: string}): Promise<Doc>{
        let response:any = await calls.post(endpoints.CHANNEL_DOCS(channelID), this.token, options);
        return new Doc(response.data.doc, this);
    }

    /** Edit a doc from a specified 'docs' channel. */
    async editDoc(channelID: string, docID: number, options: {title: string, content: string}): Promise<Doc>{
        let response:any = await calls.put(endpoints.CHANNEL_DOC(channelID, docID), this.token, options);
        return new Doc(response.data.doc, this);
    }

    /** Delete a doc from a specified 'docs' channel. */
    async deleteDoc(channelID: string, docID: number): Promise<void>{
        await calls.delete(endpoints.CHANNEL_DOC(channelID, docID), this.token);
    }

    // calendar events
    /** Create an event into a calendar channel. */
    async createCalendarEvent(channelID: string, options: {name: string; description?: string; location?: string; startsAt?: string; url?: string; color?: number; rsvpLimit?: number; duration?: number; isPrivate?: boolean}): Promise<CalendarEvent>{
        let response:any = await calls.post(endpoints.CHANNEL_EVENTS(channelID), this.token, options);
        return new CalendarEvent(response.data.calendarEvent, this);
    }

    /** Edit an event from a calendar channel. */
    async editCalendarEvent(channelID: string, eventID: number, options: {name?: string; description?: string, location?: string; startsAt?: string; url?: string; color?: number; rsvpLimit?: number; duration?: number; isPrivate?: boolean}): Promise<CalendarEvent>{
        if (options.duration && typeof options.duration == 'number') options.duration = options.duration/60000; // ms to min.
        let response:any = await calls.patch(endpoints.CHANNEL_EVENT(channelID, eventID), this.token, options);
        return new CalendarEvent(response.data.calendarEvent, this);
    }

    /** Delete an event from a calendar channel. */
    async deleteCalendarEvent(channelID: string, eventID: number): Promise<void>{
        await calls.delete(endpoints.CHANNEL_EVENT(channelID, eventID), this.token);
    }

    /** Add/Edit a RSVP in a calendar event. */
    async editCalendarRsvp(channelID: string, eventID: number, memberID: string, options: {status: 'going'|'maybe'|'declined'|'invited'|'waitlisted'|'not responded'}): Promise<CalendarEventRSVP>{
        if (typeof options !== 'object') throw new TypeError('options should be an object.');
        let response:any = await calls.put(endpoints.CHANNEL_EVENT_RSVP(channelID, eventID, memberID), this.token, options);
        return new CalendarEventRSVP(response.data.calendarEventRsvp, this);
    }

    /** Delete a RSVP from a calendar event. */
    async deleteCalendarRsvp(channelID: string, eventID: number, memberID: string): Promise<void>{
        await calls.delete(endpoints.CHANNEL_EVENT_RSVP(channelID, eventID, memberID), this.token);
    }

    // list item
    /** Create a new item in a list channel. */
    async createListItem(channelID: string, content: string, note?: {content: string}): Promise<ListItem>{
        let response:any = await calls.post(endpoints.LIST_ITEMS(channelID), this.token, {message: content, note});
        return new ListItem(response.data.listItem, this);
    }

    /** Edit a specific item from a list channel. */
    async editListItem(channelID: string, itemID: string, content: string, note?: {content: string}): Promise<ListItem>{
        let response:any = await calls.put(endpoints.LIST_ITEM(channelID, itemID), this.token, {message: content, note});
        return new ListItem(response.data.listItem, this);
    }

    /** Delete a specific item from a list channel. */
    async deleteListItem(channelID: string, itemID: string): Promise<void>{
        await calls.delete(endpoints.LIST_ITEM(channelID, itemID), this.token);
    }

    /** Complete (checkmark will show up) a specific item from a list channel. */
    async completeListItem(channelID: string, itemID: string): Promise<void>{
        await calls.post(endpoints.LIST_ITEM_COMPLETE(channelID, itemID), this.token, {});
    }

    /** Uncomplete (checkmark will disappear) a specific item from a list channel. */
    async uncompleteListItem(channelID: string, itemID: string): Promise<void>{
        await calls.delete(endpoints.LIST_ITEM_COMPLETE(channelID, itemID), this.token);
    }

    // group membership
    /** Add a Guild Member to a Guild Group */
    async addGuildMemberGroup(groupID: string, memberID: string): Promise<void>{
        await calls.put(endpoints.GUILD_GROUP_MEMBER(groupID, memberID), this.token, {});
    }

    /** Remove a Guild Member from a Guild Group */
    async removeGuildMemberGroup(groupID: string, memberID: string): Promise<void>{
        await calls.delete(endpoints.GUILD_GROUP_MEMBER(groupID, memberID), this.token);
    }

    //role membership
    /** Add a role to a guild member */
    async addGuildMemberRole(guildID: string, memberID: string, roleID: number): Promise<void>{
        await calls.put(endpoints.GUILD_MEMBER_ROLE(guildID, memberID, roleID), this.token, {});
    }

    /** Remove a role from a guild member */
    async removeGuildMemberRole(guildID: string, memberID: string, roleID: number): Promise<void>{
        await calls.delete(endpoints.GUILD_MEMBER_ROLE(guildID, memberID, roleID), this.token);
    }

    /** Create a guild webhook */
    async createGuildWebhook(guildID: string, channelID: string, name: string): Promise<Webhook> {
        if (!guildID) throw new TypeError("You need to insert the guild id, guildID is not defined.");
        if (!channelID) throw new TypeError("You need to insert a webhook name.");
        if (!channelID) throw new TypeError("You need to insert a channelID.");
        let response:any = await calls.post(endpoints.GUILD_WEBHOOKS(guildID), this.token, {name: name, channelId: channelID});
        return new Webhook(response.data.webhook, this);
    }

    /** Update a guild webhook */
    async editGuildWebhook(guildID: string, webhookID: string, options: {name: string, channelID?:string}): Promise<Webhook>{
        let response:any = await calls.put(endpoints.GUILD_WEBHOOK(guildID, webhookID), this.token, {name: options.name, channelId: options.channelID});
        return new Webhook(response.data.webhook, this); 
    }

    /** Delete a guild webhook */
    async deleteGuildWebhook(guildID: string, webhookID: string): Promise<void>{
        await calls.delete(endpoints.GUILD_WEBHOOK(guildID, webhookID), this.token);
    }

}