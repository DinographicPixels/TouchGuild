/* eslint-disable @typescript-eslint/method-signature-style */

import { Message } from "./Message";
import { Channel } from "./Channel";

import { Member } from "./Member";
import { Guild } from "./Guild";

import { ForumTopic } from "./ForumTopic";
import { BannedMember } from "./BannedMember";
import { Webhook } from "./Webhook";

import { Doc } from "./Doc";
import { CalendarEvent } from "./CalendarEvent";
import { CalendarEventRSVP } from "./CalendarRSVP";
import { ListItem } from "./ListItem";
import { UserClient } from "./UserClient";
import { ForumTopicComment } from "./ForumTopicComment";
import { WSManager } from "../WSManager";
import { GatewayHandler } from "../gateway/GatewayHandler";
import { call } from "../Utils";
import * as endpoints from "../rest/endpoints";
import { MemberRemoveInfo, MemberRoleUpdateInfo, MemberUpdateInfo } from "../gateway/events/GuildHandler";
import { forumTopicReactionInfo, GuildCreateInfo, messageReactionInfo } from "../tg-types/types";
import type TypedEmitter from "typed-emitter";
import {
    APIMessageOptions,
    APIChannelCategories,
    APIBotUser,
    GETChannelResponse,
    GETGuildMemberResponse,
    GETGuildResponse,
    GETChannelMessagesResponse,
    GETDocsResponse,
    GETDocResponse,
    GETForumTopicsResponse,
    GETForumTopicResponse,
    GETCalendarEventsResponse,
    GETCalendarEventResponse,
    GETCalendarEventRSVPResponse,
    GETCalendarEventRSVPSResponse,
    GETListItemResponse,
    GETChannelListItemsResponse,
    GETGuildWebhookResponse,
    GETGuildWebhooksResponse,
    APIForumTopicSummary,
    APIDoc,
    APIChatMessage,
    APICalendarEvent,
    APICalendarEventRSVP,
    APIListItem,
    APIListItemSummary,
    GETGuildMemberRolesResponse,
    APIWebhook,
    POSTChannelResponse,
    POSTChannelMessageResponse,
    PUTChannelMessageResponse,
    APIForumTopic,
    POSTForumTopicResponse,
    PATCHForumTopicResponse,
    POSTDocResponse,
    PUTDocResponse,
    POSTCalendarEventResponse,
    PATCHCalendarEventResponse,
    PUTCalendarEventRSVPResponse,
    POSTListItemResponse,
    PUTListItemResponse,
    POSTGuildWebhookResponse,
    PUTGuildWebhookResponse,
    POSTGuildMemberXPResponse,
    PUTGuildMemberXPResponse,
    POSTForumTopicCommentResponse,
    PATCHForumTopicCommentResponse,
    APIForumTopicComment,
    GETForumTopicCommentsResponse,
    GETForumTopicCommentResponse
} from "guildedapi-types.ts/v1";
import EventEmitter from "node:events";

// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
export type EmitterTypes = ({
    message: (message: string) => void;
    error: (error: Error) => void;
    ready: () => void;
    messageCreate: (message: Message) => void;
    messageUpdate: (message: Message) => void;
    messageDelete: (message: Message) => void;
    messageReactionAdd: (reactionInfo: messageReactionInfo) => void;
    messageReactionRemove: (reactionInfo: messageReactionInfo) => void;
    channelCreate: (channel: Channel) => void;
    channelUpdate: (channel: Channel) => void;
    channelDelete: (channel: Channel) => void;
    forumTopicCreate: (topic: ForumTopic) => void;
    forumTopicUpdate: (topic: ForumTopic) => void;
    forumTopicDelete: (topic: ForumTopic) => void;
    forumTopicPin: (topic: ForumTopic) => void;
    forumTopicUnpin: (topic: ForumTopic) => void;
    forumTopicReactionAdd: (reactionInfo: forumTopicReactionInfo) => void;
    forumTopicReactionRemove: (reactionInfo: forumTopicReactionInfo) => void;
    forumTopicCommentCreate: (comment: ForumTopicComment) => void;
    forumTopicCommentUpdate: (comment: ForumTopicComment) => void;
    forumTopicCommentDelete: (comment: ForumTopicComment) => void;
    guildBanAdd: (BannedMember: BannedMember) => void;
    guildBanRemove: (BannedMember: BannedMember) => void;
    guildMemberAdd: (Member: Member) => void;
    guildMemberRemove: (MemberRemoveInfo: MemberRemoveInfo) => void;
    guildMemberUpdate: (MemberUpdateInfo: MemberUpdateInfo) => void;
    guildMemberRoleUpdate: (MemberRoleUpdateInfo: MemberRoleUpdateInfo) => void;
    guildCreate: (GuildCreateInfo: GuildCreateInfo) => void;
    docCreate: (Doc: Doc) => void;
    docUpdate: (Doc: Doc) => void;
    docDelete: (DeletedDoc: Doc) => void;
    calendarEventCreate: (CalendarEvent: CalendarEvent) => void;
    calendarEventUpdate: (CalendarEvent: CalendarEvent) => void;
    calendarEventDelete: (CalendarEvent: CalendarEvent) => void;
    calendarEventRsvpUpdate: (CalendarRSVP: CalendarEventRSVP) => void;
    calendarEventRsvpDelete: (CalendarRSVP: CalendarEventRSVP) => void;
    listItemCreate: (ListItem: ListItem) => void;
    listItemUpdate: (ListItem: ListItem) => void;
    listItemDelete: (ListItem: ListItem) => void;
    listItemComplete: (ListItem: ListItem) => void;
    listItemUncomplete: (ListItem: ListItem) => void;
    webhooksCreate: (Webhook: Webhook) => void;
    webhooksUpdate: (Webhook: Webhook) => void;
    exit: (message: string) => void;
});

export class Client extends (EventEmitter as unknown as new () => TypedEmitter<EmitterTypes>) {
    // types
    params: {token: string; REST?: boolean;}; ws: WSManager; cache: Map<string, unknown>; identifiers; calls;
    user?: UserClient;
    constructor(params: {token: string; REST?: boolean;}){
        if (typeof params !== "object") throw new Error("The token isn't provided in an object.");
        if (typeof params?.token === "undefined") throw new Error("Cannot create client without token, no token is provided.");
        super();
        this.params = { token: params.token, REST: params.REST ?? true };
        this.ws = new WSManager({ token: this.token });
        this.cache = new Map();
        this.identifiers = this.ws.identifiers;
        this.calls = new call();
    }

    /** Bot's token. */
    get token(): string {
        // console.log("TouchGuild WARN! : Returned token value, do not share this token to anyone.");
        return this.params.token;
    }

    /** Connect to the Guilded API. */
    connect(): void{
        this.ws.connect();
        this.ws.emitter.on("GATEWAY_WELCOME", (data: APIBotUser)=> {
            this.user = new UserClient(data.user, this);
            console.log("> Connection established.");
            this.emit("ready");
        });

        this.ws.emitter.on("GATEWAY_EVENT", (type: string, data: object)=> {
            new GatewayHandler(this).handleMessage(type, data);
        });
    }

    /** Disconnect from the Guilded API. */
    disconnect(crashOnDisconnect?: boolean): void{
        if (this.ws.alive === false) return console.warn("There is no open connection.");
        this.ws.closeAll(); // closing all connections.
        console.log("The connection has been terminated.");
        if (crashOnDisconnect) throw new Error("Connection closed.");
    }

    // REST
    /** RESTChannel is a Channel component with every method, params you need. */
    async getRESTChannel(channelID: string): Promise<Channel>{
        if (this.params.REST === false) throw new TypeError("REST has been manually disabled, you can't use REST methods.");
        const response = await this.calls.get(endpoints.CHANNEL(channelID), this.token);
        // let response = SYNCFETCH('GET', `/channels/${channelID}`, this.token, null) [deprecated]
        return new Channel((response["data" as keyof object] as GETChannelResponse).channel, this);
    }

    /** RESTMember is a Member component with every method, params you need. */
    async getRESTMember(guildID: string, memberID: string): Promise<Member>{
        if (this.params.REST === false) throw new TypeError("REST has been manually disabled, you can't use REST methods.");
        const response = await this.calls.get(endpoints.GUILD_MEMBER(guildID, memberID), this.token);
        // let response = SYNCFETCH('GET', `/servers/${guildID}/members/${memberID}`, this.token, null) [deprecated]
        return new Member((response["data" as keyof object] as GETGuildMemberResponse).member, this, guildID);
    }

    /** RESTGuild is basically a Guild Component with everything you need. */
    async getRESTGuild(guildID: string): Promise<Guild>{
        if (this.params.REST === false) throw new TypeError("REST has been manually disabled, you can't use REST methods.");
        const response = await this.calls.get(endpoints.GUILD(guildID), this.token);
        // let response = SYNCFETCH('GET', `/servers/${guildID}`, this.token, null) [deprecated]
        return new Guild((response["data" as keyof object] as GETGuildResponse).server, this);
    }

    /** Getting RESTChannelMessages will return you an Array of multiple Message component, this process can take some time. */
    async getRESTChannelMessages(channelID: string, filter?: {before?: string; after?: string; limit?: number; includePrivate?: boolean;}): Promise<Array<Message>>{
        if (this.params.REST === false) throw new TypeError("REST has been manually disabled, you can't use REST methods.");
        const response = await this.calls.get(endpoints.CHANNEL_MESSAGES(channelID), this.token, filter);
        const channelMSGs: Array<Message> = [];
        for (const message of (response["data" as keyof object] as GETChannelMessagesResponse).messages){
            if (message.type !== "system"){
                channelMSGs.push(new Message(message, this));
            }
        }
        return channelMSGs;
    }

    // docs
    /** Getting RESTChannelDocs will return you an Array of multiple Doc component, this process can take some time. */
    async getRESTChannelDocs(channelID: string, filter?: {before?: string; limit?: number;}): Promise<Array<Doc>>{
        if (this.params.REST === false) throw new TypeError("REST has been manually disabled, you can't use REST methods.");
        const response = await this.calls.get(endpoints.CHANNEL_DOCS(channelID), this.token, filter);
        const docsARRAY: Array<Doc> = [];
        for (const doc of (response["data" as keyof object] as GETDocsResponse).docs){
            docsARRAY.push(new Doc(doc, this));
        }
        return docsARRAY;
    }

    /** RESTChannelDoc is a Doc component. */
    async getRESTChannelDoc(channelID: string, docID: number): Promise<Doc>{
        if (this.params.REST === false) throw new TypeError("REST has been manually disabled, you can't use REST methods.");
        const response = await this.calls.get(endpoints.CHANNEL_DOC(channelID, docID), this.token);
        return new Doc((response["data" as keyof object] as GETDocResponse).doc, this);
    }

    //  topics
    /** Getting RESTForumTopics will return you an Array of ForumTopic, this process can take some time. */
    async getRESTForumTopics(channelID: string, filter?: {before?: string; limit?: number;}): Promise<Array<ForumTopic>>{
        if (this.params.REST === false) throw new TypeError("REST has been manually disabled, you can't use REST methods.");
        const response = await this.calls.get(endpoints.FORUM_TOPICS(channelID), this.token, filter);
        const topicARRAY: Array<ForumTopic> = [];
        for (const topic of (response["data" as keyof object] as GETForumTopicsResponse).forumTopics){
            topicARRAY.push(new ForumTopic(topic as APIForumTopic, this));
        }
        return topicARRAY;
    }

    /** RESTForumTopic is a ForumTopic component. */
    async getRESTForumTopic(channelID: string, topicID: number): Promise<ForumTopic>{
        if (this.params.REST === false) throw new TypeError("REST has been manually disabled, you can't use REST methods.");
        const response = await this.calls.get(endpoints.FORUM_TOPIC(channelID, topicID), this.token);
        return new ForumTopic((response["data" as keyof object] as GETForumTopicResponse).forumTopic, this);
    }

    /** Getting getRESTTopicComments will return you an Array of ForumTopicComment, this process can take some time.  */
    async getRESTTopicComments(channelID: string, topicID: number): Promise<Array<ForumTopicComment>>{
        if (this.params.REST === false) throw new TypeError("REST has been manually disabled, you can't use REST methods.");
        const response = await this.calls.get(endpoints.FORUM_TOPIC_COMMENTS(channelID, topicID), this.token);
        const arr: Array<ForumTopicComment> = [];
        for (const comment of (response["data" as keyof object] as GETForumTopicCommentsResponse).forumTopicComments){
            arr.push(new ForumTopicComment(comment, this, { channelID }));
        }
        return arr;
    }

    /** RESTTopicComment is a ForumTopicComment component. */
    async getRESTTopicComment(channelID: string, topicID: number, commentID: number): Promise<ForumTopicComment>{
        if (this.params.REST === false) throw new TypeError("REST has been manually disabled, you can't use REST methods.");
        const response = await this.calls.get(endpoints.FORUM_TOPIC_COMMENT(channelID, topicID, commentID), this.token);
        return new ForumTopicComment((response["data" as keyof object] as GETForumTopicCommentResponse).forumTopicComment, this, { channelID });
    }

    // Calendar
    /** Getting RESTCalendarEvents returns you an Array of multiple CalendarEvent component, this process can take time depending on the number of calendar event. */
    async getRESTCalendarEvents(channelID: string, filter?: {before?: string; after?: string; limit?: number;}): Promise<Array<CalendarEvent>>{
        if (this.params.REST === false) throw new TypeError("REST has been manually disabled, you can't use REST methods.");
        const response = await this.calls.get(endpoints.CHANNEL_EVENTS(channelID), this.token, filter);
        const cEventArray: Array<CalendarEvent> = [];
        for (const event of (response["data" as keyof object] as GETCalendarEventsResponse).calendarEvents){
            cEventArray.push(new CalendarEvent(event, this));
        }
        return cEventArray;
    }

    /** RESTCalendarEvent is a CalendarEvent component. */
    async getRESTCalendarEvent(channelID: string, eventID: number): Promise<CalendarEvent>{
        if (this.params.REST === false) throw new TypeError("REST has been manually disabled, you can't use REST methods.");
        const response = await this.calls.get(endpoints.CHANNEL_EVENT(channelID, eventID), this.token);
        return new CalendarEvent((response["data" as keyof object] as GETCalendarEventResponse).calendarEvent, this);
    }

    /** RESTCalendarRsvp is a CalendarEventRSVP component. */
    async getRESTCalendarRsvp(channelID: string, eventID: number, memberID: string): Promise<CalendarEventRSVP>{
        if (this.params.REST === false) throw new TypeError("REST has been manually disabled, you can't use REST methods.");
        const response = await this.calls.get(endpoints.CHANNEL_EVENT_RSVP(channelID, eventID, memberID), this.token);
        return new CalendarEventRSVP((response["data" as keyof object] as GETCalendarEventRSVPResponse).calendarEventRsvp, this);
    }

    /** Getting RESTCalendarRsvps will return you an Array of CalendarEventRSVP, this process can take time.*/
    async getRESTCalendarRsvps(channelID: string, eventID: number): Promise<Array<CalendarEventRSVP>>{
        if (this.params.REST === false) throw new TypeError("REST has been manually disabled, you can't use REST methods.");
        const response = await this.calls.get(endpoints.CHANNEL_EVENT_RSVPS(channelID, eventID), this.token);
        const array: Array<CalendarEventRSVP> = [];
        for (const eventRsvp of (response["data" as keyof object] as GETCalendarEventRSVPSResponse).calendarEventRsvps){
            array.push(new CalendarEventRSVP(eventRsvp, this));
        }
        return array;
    }

    // list item
    /** RESTListItem is a ListItem component. */
    async getRESTListItem(channelID: string, itemID: string): Promise<ListItem>{
        if (this.params.REST === false) throw new TypeError("REST has been manually disabled, you can't use REST methods.");
        const response = await this.calls.get(endpoints.LIST_ITEM(channelID, itemID), this.token);
        return new ListItem((response["data" as keyof object] as GETListItemResponse).listItem, this);
    }

    /** Getting RESTListItems will return you an Array of ListItems, this process can take time.*/
    async getRESTListItems(channelID: string): Promise<Array<ListItem>>{
        if (this.params.REST === false) throw new TypeError("REST has been manually disabled, you can't use REST methods.");
        const response = await this.calls.get(endpoints.LIST_ITEMS(channelID), this.token);
        const array: Array<ListItem> = [];
        for (const item of (response["data" as keyof object] as GETChannelListItemsResponse).listItems){
            array.push(new ListItem(item as APIListItem, this));
        }
        return array;
    }

    async getRESTGuildWebhook(guildID: string, webhookID: string): Promise<Webhook>{
        if (this.params.REST === false) throw new TypeError("REST has been manually disabled, you can't use REST methods.");
        const response = await this.calls.get(endpoints.GUILD_WEBHOOK(guildID, webhookID), this.token);
        return new Webhook((response["data" as keyof object] as GETGuildWebhookResponse).webhook, this);
    }

    async getRESTChannelWebhooks(guildID: string, channelID: string): Promise<Array<Webhook>>{
        if (this.params.REST === false) throw new TypeError("REST has been manually disabled, you can't use REST methods.");
        const response = await this.calls.get(endpoints.GUILD_WEBHOOKS(guildID), this.token, { channelId: channelID });
        const array: Array<Webhook> = [];
        for (const item of (response["data" as keyof object] as GETGuildWebhooksResponse).webhooks){
            array.push(new Webhook(item, this));
        }
        return array;
    }

    // RAW DATA (produces less lag, low latency response, and less information are given & they aren't given as components, great for read only)
    // Note: REST takes time to treat Arrays due to creating a high amount of components, the methods below are here to replace them by only giving info without component.

    /** Array of object containing channel messages */
    async getChannelMessages(channelID: string, filter?: {before?: string; after?: string; limit?: number; includePrivate?: boolean;}): Promise<Array<APIChatMessage>>{
        const response = await this.calls.get(endpoints.CHANNEL_MESSAGES(channelID), this.token, filter);
        return (response["data" as keyof object] as GETChannelMessagesResponse).messages;
    }

    /** Array of object containing channel docs */
    async getChannelDocs(channelID: string, filter?: {before?: string; limit?: number;}): Promise<Array<APIDoc>>{
        const response = await this.calls.get(endpoints.CHANNEL_DOCS(channelID), this.token, filter);
        return (response["data" as keyof object] as GETDocsResponse).docs;
    }

    /** Array of object containing forum topics */
    async getForumTopics(channelID: string, filter?: {before?: string; limit?: number;}): Promise<Array<APIForumTopicSummary>>{
        const response = await this.calls.get(endpoints.FORUM_TOPICS(channelID), this.token, filter);
        return (response["data" as keyof object] as GETForumTopicsResponse).forumTopics;
    }

    /** Array of object containing forum topic comments */
    async getTopicComments(channelID: string, topicID: number): Promise<Array<APIForumTopicComment>>{
        const response = await this.calls.get(endpoints.FORUM_TOPIC_COMMENTS(channelID, topicID), this.token);
        return (response["data" as keyof object] as GETForumTopicCommentsResponse).forumTopicComments;
    }

    /** Array of object containing calendar events */
    async getCalendarEvents(channelID: string, filter?: {before?: string; after?: string; limit?: number;}): Promise<Array<APICalendarEvent>>{
        const response = await this.calls.get(endpoints.CHANNEL_EVENTS(channelID), this.token, filter);
        return (response["data" as keyof object] as GETCalendarEventsResponse).calendarEvents;
    }

    /** Array of object containing calendar rsvps */
    async getCalendarRsvps(channelID: string, eventID: number): Promise<Array<APICalendarEventRSVP>>{
        const response = await this.calls.get(endpoints.CHANNEL_EVENT_RSVPS(channelID, eventID), this.token);
        return (response["data" as keyof object] as GETCalendarEventRSVPSResponse).calendarEventRsvps;
    }

    /** Array of object containing list items */
    async getListItems(channelID: string): Promise<Array<APIListItemSummary>>{
        const response = await this.calls.get(endpoints.LIST_ITEMS(channelID), this.token);
        return (response["data" as keyof object] as GETChannelListItemsResponse).listItems;
    }

    /** Will return an array containing every roles the member has. */
    async getMemberRoles(guildID: string, memberID: string): Promise<Array<number>>{
        const response = await this.calls.get(endpoints.GUILD_MEMBER_ROLES(guildID, memberID), this.token);
        return (response["data" as keyof object] as GETGuildMemberRolesResponse).roleIds;
    }

    /** Array of object containing guild channel webhooks. */
    async getChannelWebhooks(guildID: string, channelID: string): Promise<Array<APIWebhook>>{
        const response = await this.calls.get(endpoints.GUILD_WEBHOOKS(guildID), this.token, { channelId: channelID });
        return (response["data" as keyof object] as GETGuildWebhooksResponse).webhooks;
    }

    // CREATE, EDIT, DELETE.

    // message
    /** Create a channel in a specified guild. */
    async createChannel(guildID: string, name: string, type: APIChannelCategories, options: {topic?: string; isPublic?: boolean; categoryID?: number; groupID?: string;}): Promise<Channel>{
        const body = {};
        if (!guildID) throw new TypeError("guildID is a required parameter.");
        if (!name) throw new TypeError("name parameter cannot be empty.");
        if (!type) type = "chat";
        Object.assign(body, { name, type });

        if (!options) options = {};
        if (options.categoryID && options.groupID) throw new TypeError("Two channel location id can't be defined at the same time. (categoryID & groupID)");

        Object.assign(body, { serverId: guildID });

        if (options.groupID){
            Object.assign(body, { groupId: options.groupID });
        } else if (options.categoryID){
            Object.assign(body, { categoryId: options.categoryID });
        }

        if (options){
            if (options.topic) Object.assign(body, { topic: options.topic });
            if (options.isPublic) Object.assign(body, { isPublic: options.isPublic });
        }

        // let response = SYNCFETCH('POST', '/channels', this.token, JSON.stringify(body))
        const response = await this.calls.post(endpoints.CHANNELS(), this.token, body);
        return new Channel((response["data" as keyof object] as POSTChannelResponse).channel, this);
    }

    /** Create a message in a specified channel ID */
    async createMessage(channelID: string, options: APIMessageOptions): Promise<Message>{
        if (typeof options !== "object") throw new TypeError("message options should be an object.");
        // const bodyContent = JSON.stringify(options);
        // let response = await FETCH('POST', `/channels/${channelID}/messages`, this.token, bodyContent)
        const response = await this.calls.post(endpoints.CHANNEL_MESSAGES(channelID), this.token, options);
        return new Message((response["data" as keyof object] as POSTChannelMessageResponse).message, this);
    }

    /** Edit a specific message in a specified channel ID. */
    async editMessage(channelID: string, messageID: string, newMessage: object): Promise<Message>{
        if (typeof newMessage !== "object") throw new TypeError("newMessage should be an Object. (example: {content: 'heyo!'})");
        // let response = await FETCH('PUT', `/channels/${channelID}/messages/${messageID}`, this.token, JSON.stringify(newMessage))
        const response = await this.calls.put(endpoints.CHANNEL_MESSAGE(channelID, messageID), this.token, newMessage);
        return new Message((response["data" as keyof object] as PUTChannelMessageResponse).message as APIChatMessage, this);
    }

    /** Delete a specific message. */
    async deleteMessage(channelID: string, messageID: string): Promise<void>{
        // await FETCH('DELETE', `/channels/${channelID}/messages/${messageID}`, this.token, null);
        await this.calls.delete(endpoints.CHANNEL_MESSAGE(channelID, messageID), this.token);
    }

    /** Add a reaction to a specified message */
    async addMessageReaction(channelID: string, messageID: string, reaction: number): Promise<void>{
        await this.calls.put(endpoints.CHANNEL_MESSAGE_CONTENT_EMOTE(channelID, messageID, reaction), this.token, {});
    }

    /** Remove a specific reaction from a message. */
    async removeMessageReaction(channelID: string, messageID: string, reaction: number): Promise<void>{
        await this.calls.delete(endpoints.CHANNEL_MESSAGE_CONTENT_EMOTE(channelID, messageID, reaction), this.token);
    }

    // topic
    /** Create a topic in a specified forum channel. */
    async createTopic(channelID: string, options: {title: string; content: string;}): Promise<ForumTopic>{
        // let response = await FETCH('POST', `/channels/${channelID}/topics`, this.token, JSON.stringify(options))
        const response = await this.calls.post(endpoints.FORUM_TOPICS(channelID), this.token, options);
        return new ForumTopic((response["data" as keyof object] as POSTForumTopicResponse).forumTopic, this);
    }

    /** Edit a topic from a specified forum channel. */
    async editTopic(channelID: string, topicID: number, options: {title?: string; content?: string;}): Promise<ForumTopic>{
        const response = await this.calls.patch(endpoints.FORUM_TOPIC(channelID, topicID), this.token, options);
        return new ForumTopic((response["data" as keyof object] as PATCHForumTopicResponse).forumTopic, this);
    }

    /** Delete a topic from a specific forum channel */
    async deleteTopic(channelID: string, topicID: number): Promise<void>{
        await this.calls.delete(endpoints.FORUM_TOPIC(channelID, topicID), this.token);
    }

    /** Pin a forum topic. */
    async pinTopic(channelID: string, topicID: number): Promise<void>{
        await this.calls.put(endpoints.FORUM_TOPIC_PIN(channelID, topicID), this.token, {});
    }
    /** Unpin a forum topic. */
    async unpinTopic(channelID: string, topicID: number): Promise<void>{
        await this.calls.delete(endpoints.FORUM_TOPIC_PIN(channelID, topicID), this.token);
    }

    /** Locks a forum topic. */
    async lockTopic(channelID: string, topicID: number): Promise<void>{
        await this.calls.put(endpoints.FORUM_TOPIC_LOCK(channelID, topicID), this.token, {});
    }

    /** Unlocks a forum topic. */
    async unlockTopic(channelID: string, topicID: number): Promise<void>{
        await this.calls.delete(endpoints.FORUM_TOPIC_LOCK(channelID, topicID), this.token);
    }

    /** Add a reaction to a specified forum topic. */
    async addTopicReaction(channelID: string, topicID: number, emoteID: number): Promise<void>{
        await this.calls.put(endpoints.FORUM_TOPIC_EMOTE(channelID, topicID, emoteID), this.token, {});
    }

    /** Remove a specific reaction from a forum topic. */
    async removeTopicReaction(channelID: string, topicID: number, emoteID: number): Promise<void>{
        await this.calls.delete(endpoints.FORUM_TOPIC_EMOTE(channelID, topicID, emoteID), this.token);
    }

    /** Add a comment to a forum topic. */
    async createTopicComment(channelID: string, topicID: number, options: { content: string; }): Promise<ForumTopicComment>{
        const response = await this.calls.post(endpoints.FORUM_TOPIC_COMMENTS(channelID, topicID), this.token, { content: options.content });
        return new ForumTopicComment((response["data" as keyof object] as POSTForumTopicCommentResponse).forumTopicComment, this, { channelID });
    }

    /** Edit a forum topic's comment. */
    async editTopicComment(channelID: string, topicID: number, commentID: number, options?: { content?: string; }): Promise<ForumTopicComment>{
        const response = await this.calls.patch(endpoints.FORUM_TOPIC_COMMENT(channelID, topicID, commentID), this.token, { content: options?.content });
        return new ForumTopicComment((response["data" as keyof object] as PATCHForumTopicCommentResponse).forumTopicComment, this, { channelID });
    }

    /** Delete a forum topic's comment. */
    async deleteTopicComment(channelID: string, topicID: number, commentID: number): Promise<void>{
        await this.calls.delete(endpoints.FORUM_TOPIC_COMMENT(channelID, topicID, commentID), this.token);
    }

    // docs
    /** Create a doc in a specified 'docs' channel. */
    async createDoc(channelID: string, options: {title: string; content: string;}): Promise<Doc>{
        const response = await this.calls.post(endpoints.CHANNEL_DOCS(channelID), this.token, options);
        return new Doc((response["data" as keyof object] as POSTDocResponse).doc, this);
    }

    /** Edit a doc from a specified 'docs' channel. */
    async editDoc(channelID: string, docID: number, options: {title: string; content: string;}): Promise<Doc>{
        const response = await this.calls.put(endpoints.CHANNEL_DOC(channelID, docID), this.token, options);
        return new Doc((response["data" as keyof object] as PUTDocResponse).doc, this);
    }

    /** Delete a doc from a specified 'docs' channel. */
    async deleteDoc(channelID: string, docID: number): Promise<void>{
        await this.calls.delete(endpoints.CHANNEL_DOC(channelID, docID), this.token);
    }

    // calendar events
    /** Create an event into a calendar channel. */
    async createCalendarEvent(channelID: string, options: {name: string; description?: string; location?: string; startsAt?: string; url?: string; color?: number; rsvpLimit?: number; duration?: number; isPrivate?: boolean;}): Promise<CalendarEvent>{
        const response = await this.calls.post(endpoints.CHANNEL_EVENTS(channelID), this.token, options);
        return new CalendarEvent((response["data" as keyof object] as POSTCalendarEventResponse).calendarEvent, this);
    }

    /** Edit an event from a calendar channel. */
    async editCalendarEvent(channelID: string, eventID: number, options: {name?: string; description?: string; location?: string; startsAt?: string; url?: string; color?: number; rsvpLimit?: number; duration?: number; isPrivate?: boolean;}): Promise<CalendarEvent>{
        if (options.duration && typeof options.duration === "number") options.duration = options.duration / 60000; // ms to min.
        const response = await this.calls.patch(endpoints.CHANNEL_EVENT(channelID, eventID), this.token, options);
        return new CalendarEvent((response["data" as keyof object] as PATCHCalendarEventResponse).calendarEvent, this);
    }

    /** Delete an event from a calendar channel. */
    async deleteCalendarEvent(channelID: string, eventID: number): Promise<void>{
        await this.calls.delete(endpoints.CHANNEL_EVENT(channelID, eventID), this.token);
    }

    /** Add/Edit a RSVP in a calendar event. */
    async editCalendarRsvp(channelID: string, eventID: number, memberID: string, options: {status: "going"|"maybe"|"declined"|"invited"|"waitlisted"|"not responded";}): Promise<CalendarEventRSVP>{
        if (typeof options !== "object") throw new TypeError("options should be an object.");
        const response = await this.calls.put(endpoints.CHANNEL_EVENT_RSVP(channelID, eventID, memberID), this.token, options);
        return new CalendarEventRSVP((response["data" as keyof object] as PUTCalendarEventRSVPResponse).calendarEventRsvp, this);
    }

    /** Delete a RSVP from a calendar event. */
    async deleteCalendarRsvp(channelID: string, eventID: number, memberID: string): Promise<void>{
        await this.calls.delete(endpoints.CHANNEL_EVENT_RSVP(channelID, eventID, memberID), this.token);
    }

    // list item
    /** Create a new item in a list channel. */
    async createListItem(channelID: string, content: string, note?: {content: string;}): Promise<ListItem>{
        const response = await this.calls.post(endpoints.LIST_ITEMS(channelID), this.token, { message: content, note });
        return new ListItem((response["data" as keyof object] as POSTListItemResponse).listItem, this);
    }

    /** Edit a specific item from a list channel. */
    async editListItem(channelID: string, itemID: string, content: string, note?: {content: string;}): Promise<ListItem>{
        const response = await this.calls.put(endpoints.LIST_ITEM(channelID, itemID), this.token, { message: content, note });
        return new ListItem((response["data" as keyof object] as PUTListItemResponse).listItem, this);
    }

    /** Delete a specific item from a list channel. */
    async deleteListItem(channelID: string, itemID: string): Promise<void>{
        await this.calls.delete(endpoints.LIST_ITEM(channelID, itemID), this.token);
    }

    /** Complete (checkmark will show up) a specific item from a list channel. */
    async completeListItem(channelID: string, itemID: string): Promise<void>{
        await this.calls.post(endpoints.LIST_ITEM_COMPLETE(channelID, itemID), this.token, {});
    }

    /** Uncomplete (checkmark will disappear) a specific item from a list channel. */
    async uncompleteListItem(channelID: string, itemID: string): Promise<void>{
        await this.calls.delete(endpoints.LIST_ITEM_COMPLETE(channelID, itemID), this.token);
    }

    // group membership
    /** Add a Guild Member to a Guild Group */
    async addGuildMemberGroup(groupID: string, memberID: string): Promise<void>{
        await this.calls.put(endpoints.GUILD_GROUP_MEMBER(groupID, memberID), this.token, {});
    }

    /** Remove a Guild Member from a Guild Group */
    async removeGuildMemberGroup(groupID: string, memberID: string): Promise<void>{
        await this.calls.delete(endpoints.GUILD_GROUP_MEMBER(groupID, memberID), this.token);
    }

    // role membership
    /** Add a role to a guild member */
    async addGuildMemberRole(guildID: string, memberID: string, roleID: number): Promise<void>{
        await this.calls.put(endpoints.GUILD_MEMBER_ROLE(guildID, memberID, roleID), this.token, {});
    }

    /** Remove a role from a guild member */
    async removeGuildMemberRole(guildID: string, memberID: string, roleID: number): Promise<void>{
        await this.calls.delete(endpoints.GUILD_MEMBER_ROLE(guildID, memberID, roleID), this.token);
    }

    /** Create a guild webhook */
    async createGuildWebhook(guildID: string, channelID: string, name: string): Promise<Webhook> {
        if (!guildID) throw new TypeError("You need to insert the guild id, guildID is not defined.");
        if (!channelID) throw new TypeError("You need to insert a webhook name.");
        if (!channelID) throw new TypeError("You need to insert a channelID.");
        const response = await this.calls.post(endpoints.GUILD_WEBHOOKS(guildID), this.token, { name, channelId: channelID });
        return new Webhook((response["data" as keyof object] as POSTGuildWebhookResponse).webhook, this);
    }

    /** Update a guild webhook */
    async editGuildWebhook(guildID: string, webhookID: string, options: {name: string; channelID?: string;}): Promise<Webhook>{
        const response = await this.calls.put(endpoints.GUILD_WEBHOOK(guildID, webhookID), this.token, { name: options.name, channelId: options.channelID });
        return new Webhook((response["data" as keyof object] as PUTGuildWebhookResponse).webhook, this);
    }

    /** Delete a guild webhook */
    async deleteGuildWebhook(guildID: string, webhookID: string): Promise<void>{
        await this.calls.delete(endpoints.GUILD_WEBHOOK(guildID, webhookID), this.token);
    }

    // MISC

    /** Awards a member using the built-in EXP system. */
    async awardMember(guildID: string, memberID: string, xpAmount: number): Promise<number>{
        if (typeof xpAmount !== "number") throw new TypeError("xpAmount needs to be an integer/number.");
        const response = await this.calls.post(endpoints.GUILD_MEMBER_XP(guildID, memberID), this.token, { amount: xpAmount });
        return (response as POSTGuildMemberXPResponse).total as number;
    }

    /** Sets a member's xp using the built-in EXP system. */
    async setMemberXP(guildID: string, memberID: string, xpAmount: number): Promise<number>{
        const response = await this.calls.put(endpoints.GUILD_MEMBER_XP(guildID, memberID), this.token, { total: xpAmount });
        return (response as PUTGuildMemberXPResponse).total as number;
    }

    /** Awards all members having a role using the built-in EXP system. */
    async awardRole(guildID: string, roleID: number, xpAmount: number): Promise<void>{
        await this.calls.post(endpoints.GUILD_MEMBER_ROLE_XP(guildID, roleID), this.token, { amount: xpAmount });
    }
}
