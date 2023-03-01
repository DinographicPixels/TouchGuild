/** @module Client */
/* eslint-disable @typescript-eslint/method-signature-style */

import { Message } from "./Message";

import { Member } from "./Member";
import { Guild } from "./Guild";

import { ForumThread } from "./ForumThread";
import { Webhook } from "./Webhook";

import { Doc } from "./Doc";
import { CalendarEvent } from "./CalendarEvent";
import { CalendarEventRSVP } from "./CalendarRSVP";
import { ListItem } from "./ListItem";
import { UserClient } from "./UserClient";
import { ForumThreadComment } from "./ForumThreadComment";
import { User } from "./User";
import { BannedMember } from "./BannedMember";
import { TextChannel } from "./TextChannel";
import { ForumChannel } from "./ForumChannel";
import { CalendarEventComment } from "./CalendarEventComment";
import { DocComment } from "./DocComment";
import { WSManager } from "../gateway/WSManager";
import { GatewayHandler } from "../gateway/GatewayHandler";
import { RESTManager } from "../rest/RESTManager";
import TypedCollection from "../util/TypedCollection";
import TypedEmitter from "../types/TypedEmitter";
import { ClientEvents } from "../types/events";
import { ClientOptions } from "../types/client";
import {
    APIChannelCategories,
    PUTGuildWebhookBody,
    PUTListItemBody,
    POSTListItemBody,
    GATEWAY_EVENTS,
    ChannelReactionTypes,
    APIGuild,
    APIUser,
    ChannelSubcategoryReactionTypes,
    POSTCalendarEventBody
} from "../Constants";
import {
    AnyChannel,
    AnyTextableChannel,
    CreateChannelOptions,
    CreateMessageOptions,
    EditChannelOptions
} from "../types/channel";
import { CreateForumThreadOptions, EditForumThreadOptions, GetForumThreadsFilter } from "../types/forumThread";
import { CreateForumCommentOptions, EditForumCommentOptions } from "../types/forumThreadComment";
import { CreateDocOptions, EditDocOptions, GetDocsFilter } from "../types/doc";
import {
    CreateCalendarCommentOptions,
    CreateCalendarEventOptions,
    EditCalendarCommentOptions,
    EditCalendarEventOptions,
    EditCalendarRSVPOptions,
    GetCalendarEventsFilter
} from "../types/calendarEvent";
import { EditMemberOptions } from "../types/guilds";
import { Util } from "../util/Util";
import { CreateDocCommentOptions, EditDocCommentOptions } from "../types/docComment";

/** Represents the bot's client. */
export class Client extends TypedEmitter<ClientEvents> {
    /** Client's params, including bot's token & rest options. */
    params: ClientOptions;
    /** Websocket Manager. */
    ws: WSManager;
    /** Client's user. */
    user?: UserClient;
    /** REST methods. */
    rest: RESTManager;
    /** Gateway Handler. */
    #gateway: GatewayHandler;
    /** Cached guilds. */
    guilds: TypedCollection<string, APIGuild, Guild>;
    /** Cached users. */
    users: TypedCollection<string, APIUser, User>;
    /** Utils */
    util: Util;
    startTime: number;
    /** @param params Client's parameters, this includes bot's token & rest options. */
    constructor(params: ClientOptions){
        if (typeof params !== "object") throw new Error("The token isn't provided in an object.");
        if (!params?.token) throw new Error("Cannot create client without token, no token is provided.");
        super();
        this.params = {
            token:            params.token,
            REST:             params.REST ?? true,
            RESTOptions:      params.RESTOptions,
            collectionLimits: {
                messages:             params.collectionLimits?.messages             ?? 100,
                threads:              params.collectionLimits?.threads              ?? 100,
                threadComments:       params.collectionLimits?.threadComments       ?? 100,
                docs:                 params.collectionLimits?.docs                 ?? 100,
                scheduledEvents:      params.collectionLimits?.scheduledEvents      ?? 100,
                scheduledEventsRSVPS: params.collectionLimits?.scheduledEventsRSVPS ?? 100,
                calendarComments:     params.collectionLimits?.calendarComments     ?? 100,
                docComments:          params.collectionLimits?.docComments          ?? 100
            }
        };
        this.ws = new WSManager(this, { token: this.token, client: this });
        this.guilds = new TypedCollection(Guild, this);
        this.users = new TypedCollection(User, this);
        this.rest = new RESTManager(this, params.RESTOptions);
        this.#gateway = new GatewayHandler(this);
        this.util = new Util(this);
        this.startTime = 0;
    }

    /** Bot's token. */
    get token(): string {
        return this.params.token;
    }

    get uptime(): number {
        return this.startTime ? Date.now() - this.startTime : 0;
    }

    /** Connect to Guilded. */
    connect(): void {
        this.ws.connect();
        this.ws.on("GATEWAY_WELCOME", data => {
            this.user = new UserClient(data, this);
            console.log("> Connection established.");
            this.startTime = Date.now();
            this.emit("ready");
        });

        this.ws.on("disconnect", err => {
            this.startTime = 0;
            this.emit("error", err);
        });

        this.ws.on("GATEWAY_PARSED_PACKET", (type, data) => {
            void this.#gateway.handleMessage(type as keyof GATEWAY_EVENTS, data);
        });
    }

    /** Disconnect from Guilded.
     * @param crashOnDisconnect If set, throws an error to stop the process.
     */
    disconnect(crashOnDisconnect?: boolean): void{
        if (this.ws.alive === false) return console.warn("There is no open connection.");
        this.ws.disconnect(false); // closing all connections.
        console.log("The connection has been terminated.");
        if (crashOnDisconnect) throw new Error("Connection closed.");
    }


    /** This method is used to get a specific guild channel, if cached.
     *
     * Note: this method doesn't send a rest request, it only returns cached entities.
     * @param channelID The ID of the channel to get from cache.
     */
    getChannel<T extends AnyChannel = AnyChannel>(guildID: string, channelID: string): T | undefined {
        if (!guildID) throw new Error("guildID is a required parameter.");
        if (!channelID) throw new Error("channelID is a required parameter.");
        return this.guilds.get(guildID)?.channels.get(channelID) as T;
    }

    /** This method is used to get a specific guild member, if cached.
     *
     * Note: this method doesn't send a rest request, it only returns cached entities.
     * @param guildID The ID of the guild the member is in.
     * @param memberID The ID of the member to get.
     */
    getMember(guildID: string, memberID: string): Member | undefined {
        if (!guildID) throw new Error("guildID is a required parameter.");
        if (!memberID) throw new Error("memberID is a required parameter.");
        return this.getGuild(guildID)?.members.get(memberID);
    }

    /** This method is used to get a list of cached guild member.
     *
     * Note: this method doesn't send a rest request, it only returns cached entities.
     * @param guildID ID of the guild to get members.
     */
    getMembers(guildID: string): Array<Member> | undefined {
        if (!guildID) throw new Error("guildID is a required parameter.");
        return this.getGuild(guildID)?.members.map(member => member);
    }

    /** Get a ban.
     * @param guildID ID of the guild.
     * @param memberID ID of the banned member.
     */
    async getBan(guildID: string, memberID: string): Promise<BannedMember> {
        return this.rest.guilds.getBan(guildID, memberID);
    }

    /** This method is used to get a list of guild ban.
     * @param guildID ID of the guild.
     */
    async getBans(guildID: string): Promise<Array<BannedMember>> {
        return this.rest.guilds.getBans(guildID);
    }

    /** Get a cached guild, returns `undefined` if not cached.
     *
     * Note: this method doesn't send a rest request, it only returns cached entities.
     * @param guildID The ID of the guild to get.
     */
    getGuild(guildID: string): Guild | undefined {
        if (!guildID) throw new Error("guildID is a required parameter.");
        return this.guilds.get(guildID);
    }

    /** Get a channel's message, if cached.
     *
     * Note: this method doesn't send a rest request, it only returns cached entities.
     * @param guildID ID of the guild.
     * @param channelID ID of the channel containing the message.
     * @param messageID ID of the message you'd like to get.
     */
    getMessage(guildID: string, channelID: string, messageID: string): Message<AnyTextableChannel> | undefined {
        const channel = this.getChannel(guildID, channelID);
        if (channel instanceof TextChannel) {
            return channel?.messages.get(messageID);
        }
    }

    /** This method is used to get cached messages from a channel.
     * @param guildID ID of the guild.
     * @param channelID ID of a "Chat" channel.
     */
    getMessages(guildID: string, channelID: string): Array<Message<AnyTextableChannel>> | undefined {
        const channel = this.getChannel(guildID, channelID);
        if (channel instanceof TextChannel) {
            return channel?.messages.map(msg => msg);
        }
    }

    /**
     * Get a user.
     *
     * Note: when getting the bot's user, only the information specific to 'User' will be returned.
     * If you'd like to get the UserClient (the bot itself), use Client#user.
     * @param userID The ID of the user to get.
     */
    async getUser(userID: string): Promise<User> {
        return this.rest.misc.getUser(userID);
    }

    // docs
    /** This method is used to get a list of "Channel" Doc.
     * @param channelID ID of a "Docs" channel.
     * @param filter Object to filter the output.
     */
    async getDocs(channelID: string, filter?: GetDocsFilter): Promise<Array<Doc>>{
        return this.rest.channels.getDocs(channelID, filter);
    }

    /** This method is used to get a channel doc.
     *
     * Note: This method requires a "Docs" channel.
     * @param channelID ID of the Docs channel.
     * @param docID ID of the channel doc.
     */
    async getDoc(channelID: string, docID: number): Promise<Doc>{
        return this.rest.channels.getDoc(channelID, docID);
    }

    /**
     * Get every comments from a doc.
     * @param channelID ID of the channel containing the doc.
     * @param docID ID of the doc the comment is in.
     */
    async getDocComments(channelID: string, docID: number): Promise<Array<DocComment>> {
        return this.rest.channels.getDocComments(channelID, docID);
    }

    /**
     * Get a specific comment from a doc.
     * @param channelID ID of the channel containing the doc.
     * @param docID ID of the doc the comment is in.
     * @param commentID ID of the comment to get.
     */
    async getDocComment(channelID: string, docID: number, commentID: number): Promise<DocComment> {
        return this.rest.channels.getDocComment(channelID, docID, commentID);
    }

    //  ForumThread

    /** This method is used to get a list of ForumThread.
     * @param channelID ID of a "Forum" channel.
     * @param filter Object to filter the output.
     */
    async getForumThreads(channelID: string, filter?: GetForumThreadsFilter): Promise<Array<ForumThread<ForumChannel>>>{
        return this.rest.channels.getForumThreads(channelID, filter);
    }

    /** This method is used to get a specific forum thread.
     *
     * Note: This method requires a "Forum" channel.
     * @param channelID ID of a speific Forum channel.
     * @param threadID ID of the specific Forum Thread.
     */
    async getForumThread(channelID: string, threadID: number): Promise<ForumThread<ForumChannel>>{
        return this.rest.channels.getForumThread(channelID, threadID);
    }

    /** This method is used to get a list of ForumThreadComment.
     * @param channelID ID of a "Forums" channel.
     * @param threadID ID of a Forum Thread.
     */
    async getForumComments(channelID: string, threadID: number): Promise<Array<ForumThreadComment>>{
        return this.rest.channels.getForumComments(channelID, threadID);
    }

    /** This method is used to get a specific forum thread comment.
     * @param channelID ID of a "Forums" channel.
     * @param threadID ID of a Forum thread.
     * @param commentID ID of a Forum thread comment.
     */
    async getForumComment(channelID: string, threadID: number, commentID: number): Promise<ForumThreadComment>{
        return this.rest.channels.getForumComment(channelID, threadID, commentID);
    }

    // Calendar
    /** This method is used to get a list of CalendarEvent
     * @param channelID ID of a "Calendar" channel.
     * @param filter Object to filter the output.
     */
    async getCalendarEvents(channelID: string, filter?: GetCalendarEventsFilter): Promise<Array<CalendarEvent>> {
        return this.rest.channels.getCalendarEvents(channelID, filter);
    }

    /** This method is used to get a specific calendar event.
     *
     * Note: this method requires a "Calendar" channel.
     * @param channelID ID of a Calendar channel.
     * @param eventID ID of a Calendar event.
     */
    async getCalendarEvent(channelID: string, eventID: number): Promise<CalendarEvent>  {
        return this.rest.channels.getCalendarEvent(channelID, eventID);
    }

    /** This method is used to get a specific event comment coming from a calendar.
     * Note: this method doesn't cache scheduled events due to the API's restrictions.
     * @param channelID ID of a "Calendar" channel.
     * @param eventID ID of an event containing the comment to get.
     * @param commentID ID of the comment to get.
     */
    async getCalendarEventComment(channelID: string, eventID: number, commentID: number): Promise<CalendarEventComment> {
        return this.rest.channels.getCalendarEventComment(channelID, eventID, commentID);
    }

    /** This method is used to get a list of CalendarEventComment
     * Note: due to API's restrictions, we're not able to cache scheduled events from this method.
     * @param channelID ID of a "Calendar" channel.
     * @param eventID ID of the event containing comments.
     */
    async getCalendarEventComments(channelID: string, eventID: number): Promise<Array<CalendarEventComment>> {
        return this.rest.channels.getCalendarEventComments(channelID, eventID);
    }

    /** This method is used to get a specific CalendarEventRSVP.
     *
     * Note: this method requires a Calendar channel.
     * @param channelID ID of a Calendar channel
     * @param eventID ID of a Calendar Event
     * @param memberID ID of a Guild Member
     */
    async getCalendarRsvp(channelID: string, eventID: number, memberID: string): Promise<CalendarEventRSVP> {
        return this.rest.channels.getCalendarRsvp(channelID, eventID, memberID);
    }

    /** This method is used to get a list of CalendarEventRSVP.
     * @param channelID ID of a "Calendar" channel.
     * @param eventID ID of a calendar event.
     */
    async getCalendarRsvps(channelID: string, eventID: number): Promise<Array<CalendarEventRSVP>>{
        return this.rest.channels.getCalendarRsvps(channelID, eventID);
    }

    // list item
    /** This method is used to get a specific list item.
     * @param channelID ID of a "List" channel.
     * @param itemID ID of a list item.
     */
    async getListItem(channelID: string, itemID: string): Promise<ListItem>{
        return this.rest.channels.getListItem(channelID, itemID);
    }

    /** This method is used to get a list of ListItem.
     * @param channelID ID of a "List" channel.
     */
    async getListItems(channelID: string): Promise<Array<ListItem>>{
        return this.rest.channels.getListItems(channelID);
    }

    /** This method is used to get a specific webhook.
     * @param guildID ID of a guild.
     * @param webhookID ID of a webhook.
     */
    async getWebhook(guildID: string, webhookID: string): Promise<Webhook>{
        return this.rest.guilds.getWebhook(guildID, webhookID);
    }

    /** This method is used to get a list of Webhook.
     * @param guildID ID of a guild.
     * @param channelID ID of a channel.
     */
    async getWebhooks(guildID: string, channelID: string): Promise<Array<Webhook>>{
        return this.rest.guilds.getWebhooks(guildID, channelID);
    }

    // CREATE, EDIT, DELETE.

    // message
    /** Create a channel in a specified guild.
     * @param guildID ID of a guild.
     * @param name Name of the new channel.
     * @param type Type of the new channel. (e.g: chat)
     * @param options New channel's additional options.
     */
    async createChannel<T extends AnyChannel = AnyChannel>(guildID: string, name: string, type: APIChannelCategories, options?: CreateChannelOptions): Promise<T> {
        return this.rest.guilds.createChannel<T>(guildID, name, type, options);
    }

    /** Edit a channel.
     * @param channelID ID of the channel you'd like to edit.
     * @param options Channel edit options.
     */
    async editChannel<T extends AnyChannel = AnyChannel>(channelID: string, options: EditChannelOptions): Promise<T> {
        return this.rest.guilds.editChannel<T>(channelID, options);
    }

    /** Delete a channel.
     * @param channelID ID of the channel you'd like to delete.
     */
    async deleteChannel(channelID: string): Promise<void> {
        return this.rest.guilds.deleteChannel(channelID);
    }

    /** Send a message in a specified channel.
     * @param channelID ID of the channel.
     * @param options Message options
     */
    async createMessage<T extends AnyTextableChannel = AnyTextableChannel>(channelID: string, options: CreateMessageOptions): Promise<Message<T>> {
        return this.rest.channels.createMessage<T>(channelID, options);
    }

    /** Edit a specific message coming from a specified channel.
     * @param channelID The ID of the channel.
     * @param messageID The ID of the message you'd like to edit.
     * @param newMessage object containing new message's options.
     */
    async editMessage<T extends AnyTextableChannel>(channelID: string, messageID: string, newMessage: object): Promise<Message<T>> {
        return this.rest.channels.editMessage<T>(channelID, messageID, newMessage);
    }

    /** Delete a specific message.
     * @param channelID ID of the channel containing the message.
     * @param messageID ID of the message you'd like to delete.
     */
    async deleteMessage(channelID: string, messageID: string): Promise<void>{
        return this.rest.channels.deleteMessage(channelID, messageID);
    }

    /** Add a reaction to a specified object.
     * @param channelID ID of a channel that supports reaction.
     * @param channelType Type of the selected channel. (e.g: "ChannelMessage")
     * @param objectID ID of the object you'd like to add the reaction to. (e.g: a message id)
     * @param reaction ID of the reaction.
     */
    async createReaction(channelID: string, channelType: ChannelReactionTypes, objectID: string | number, reaction: number): Promise<void> {
        return this.rest.channels.createReaction(channelID, channelType, objectID, reaction);
    }

    /** Remove a reaction from a specified message.
     * @param channelID ID of a channel that supports reaction.
     * @param channelType Type of the selected channel. (e.g: "ChannelMessage")
     * @param objectID ID of the object you'd like to add the reaction to. (e.g: a message id)
     * @param reaction ID of the reaction.
     */
    async removeReaction(channelID: string, channelType: ChannelReactionTypes, objectID: string | number, reaction: number): Promise<void>{
        return this.rest.channels.deleteReaction(channelID, channelType, objectID, reaction);
    }

    /** Add a reaction to an object from a subcategory (e.g: a comment from Forum Thread)
     * @param channelID ID of a channel that supports reaction.
     * @param subcategoryType Type of the selected subcategory. (e.g: "CalendarEvent")
     * @param subcategoryID ID of the subcategory you selected.
     * @param targetID ID of the object you'd like to add the reaction to. (e.g: a comment id)
     * @param reaction ID of the reaction to add.
     */
    async createReactionToSubcategory(channelID: string, subcategoryType: ChannelSubcategoryReactionTypes, subcategoryID: string | number, targetID: string | number, reaction: number): Promise<void> {
        return this.rest.channels.createReactionToSubcategory(channelID, subcategoryType, subcategoryID, targetID, reaction);
    }

    /** Remove a reaction from an object from a subcategory (e.g: a comment from Forum Thread)
     * @param channelID ID of a channel that supports reaction.
     * @param subcategoryType Type of the selected subcategory. (e.g: "CalendarEvent")
     * @param subcategoryID ID of the subcategory you selected.
     * @param targetID ID of the object you'd like to remove the reaction to. (e.g: a comment id)
     * @param reaction ID of the reaction to add.
     */
    async deleteReactionFromSubcategory(channelID: string, subcategoryType: ChannelSubcategoryReactionTypes, subcategoryID: string | number, targetID: string | number, reaction: number): Promise<void> {
        return this.rest.channels.deleteReactionFromSubcategory(channelID, subcategoryType, subcategoryID, targetID, reaction);
    }

    // ForumThread

    /** Create a forum thread in a specified forum channel.
     * @param channelID ID of a "Forums" channel.
     * @param options Thread's options including title & content.
     */
    async createForumThread<T extends ForumChannel = ForumChannel>(channelID: string, options: CreateForumThreadOptions): Promise<ForumThread<T>> {
        return this.rest.channels.createForumThread<T>(channelID, options);
    }

    /** Edit a forum thread from a specified forum channel.
     * @param channelID ID of a "Forums" channel.
     * @param threadID ID of a forum thread.
     * @param options Edit options.
     */
    async editForumThread<T extends ForumChannel = ForumChannel>(channelID: string, threadID: number, options: EditForumThreadOptions): Promise<ForumThread<T>>{
        return this.rest.channels.editForumThread<T>(channelID, threadID, options);
    }

    /** Delete a forum thread from a specific forum channel
     * @param channelID ID of a "Forums" channel.
     * @param threadID ID of a forum thread.
     */
    async deleteForumThread(channelID: string, threadID: number): Promise<void>{
        return this.rest.channels.deleteForumThread(channelID, threadID);
    }

    /** Pin a forum thread.
     * @param channelID ID of a "Forums" channel.
     * @param threadID ID of a forum thread.
     */
    async pinForumThread(channelID: string, threadID: number): Promise<void>{
        return this.rest.channels.pinForumThread(channelID, threadID);
    }

    /** Unpin a forum thread.
     * @param channelID ID of a "Forums" channel.
     * @param threadID ID of a forum thread.
     */
    async unpinForumThread(channelID: string, threadID: number): Promise<void>{
        return this.rest.channels.unpinForumThread(channelID, threadID);
    }

    /** Lock a forum thread.
     * @param channelID ID of a "Forums" channel.
     * @param threadID ID of a forum thread.
     */
    async lockForumThread(channelID: string, threadID: number): Promise<void>{
        return this.rest.channels.lockForumThread(channelID, threadID);
    }

    /** Unlock a forum thread.
     * @param channelID ID of a "Forums" channel.
     * @param threadID ID of a forum thread.
     */
    async unlockForumThread(channelID: string, threadID: number): Promise<void>{
        return this.rest.channels.unlockForumThread(channelID, threadID);
    }

    /** Add a comment to a forum thread.
     * @param channelID ID of a "Forums" channel.
     * @param threadID ID of a forum thread.
     * @param options Comment's options.
     */
    async createForumComment(channelID: string, threadID: number, options: CreateForumCommentOptions): Promise<ForumThreadComment>{
        return this.rest.channels.createForumComment(channelID, threadID, options);
    }

    /** Edit a forum thread's comment.
     * @param channelID ID of a "Forums" channel.
     * @param threadID ID of a forum thread.
     * @param commentID ID of a thread comment.
     * @param options Edit options.
     */
    async editForumComment(channelID: string, threadID: number, commentID: number, options?: EditForumCommentOptions): Promise<ForumThreadComment>{
        return this.rest.channels.editForumComment(channelID, threadID, commentID, options);
    }

    /** Delete a forum thread comment.
     * @param channelID ID of a "Forums" channel.
     * @param threadID ID of a forum thread.
     * @param commentID ID of a forum thread comment.
     */
    async deleteForumComment(channelID: string, threadID: number, commentID: number): Promise<void>{
        return this.rest.channels.deleteForumComment(channelID, threadID, commentID);
    }

    // docs
    /** Create a doc in a "Docs" channel.
     * @param channelID ID pf a "Docs" channel.
     * @param options Doc's options.
     */
    async createDoc(channelID: string, options: CreateDocOptions): Promise<Doc>{
        return this.rest.channels.createDoc(channelID, options);
    }

    /** Edit a doc from a "Docs" channel.
     * @param channelID ID of a "Docs" channel.
     * @param docID ID of a doc.
     * @param options Edit options.
     */
    async editDoc(channelID: string, docID: number, options: EditDocOptions): Promise<Doc>{
        return this.rest.channels.editDoc(channelID, docID, options);
    }

    /** Delete a doc from a "Docs" channel.
     * @param channelID ID of a "Docs" channel.
     * @param docID ID of a doc.
     */
    async deleteDoc(channelID: string, docID: number): Promise<void> {
        return this.rest.channels.deleteDoc(channelID, docID);
    }

    /**
     * Create a comment in a doc.
     * @param channelID ID of the docs channel.
     * @param docID ID of the doc.
     * @param options Create options.
     */
    async createDocComment(channelID: string, docID: number, options: CreateDocCommentOptions): Promise<DocComment> {
        return this.rest.channels.createDocComment(channelID, docID, options);
    }

    /**
     * Edit a doc comment.
     * @param channelID ID of the docs channel.
     * @param docID ID of the doc.
     * @param commentID ID of the comment to edit.
     * @param options Edit options.
     */
    async editDocComment(channelID: string, docID: number, commentID: number, options: EditDocCommentOptions): Promise<DocComment> {
        return this.rest.channels.editDocComment(channelID, docID, commentID, options);
    }

    /**
     * Delete a doc comment.
     * @param channelID ID of the docs channel.
     * @param docID ID of the doc.
     * @param commentID ID of the comment to delete.
     */
    async deleteDocComment(channelID: string, docID: number, commentID: number): Promise<void> {
        return this.rest.channels.deleteDocComment(channelID, docID, commentID);
    }

    // calendar events
    /** Create an event into a "Calendar" channel.
     * @param channelID ID of a "Calendar" channel.
     * @param options Event options.
     * @param createSeries (optional) Create a series. (event's repetition)
     */
    async createCalendarEvent(channelID: string, options: CreateCalendarEventOptions, createSeries?: POSTCalendarEventBody["repeatInfo"]): Promise<CalendarEvent>{
        return this.rest.channels.createCalendarEvent(channelID, options, createSeries);
    }

    /** Edit an event from a "Calendar" channel.
     * @param channelID ID of a "Calendar" channel.
     * @param eventID ID of a calendar event.
     * @param options Edit options.
     */
    async editCalendarEvent(channelID: string, eventID: number, options: EditCalendarEventOptions): Promise<CalendarEvent>{
        return this.rest.channels.editCalendarEvent(channelID, eventID, options);
    }

    /** Delete an event from a "Calendar" channel.
     * @param channelID ID of a "Calendar" channel.
     * @param eventID ID of a calendar event.
     */
    async deleteCalendarEvent(channelID: string, eventID: number): Promise<void>{
        return this.rest.channels.deleteCalendarEvent(channelID, eventID);
    }

    /**
     * The Guilded API only allows series on the event's creation.
     *
     * **Use createCalendarEvent and set the createSeries property to create a series.**
     */
    createCalendarEventSeries(): Error {
        return this.rest.channels.createCalendarEventSeries();
    }

    /**
     * Edit a CalendarEventSeries.
     * @param channelID ID of the channel.
     * @param eventID ID of the event.
     * @param seriesID ID of the series.
     * @param options Edit repetition options.
     */
    async editCalendarEventSeries(channelID: string, eventID: number, seriesID: string, options: POSTCalendarEventBody["repeatInfo"]): Promise<void> {
        return this.rest.channels.editCalendarEventSeries(channelID, eventID, seriesID, options);
    }

    /**
     * Delete a CalendarEventSeries.
     * @param channelID ID of the channel.
     * @param eventID ID of the event.
     * @param seriesID ID of the series.
     */
    async deleteCalendarEventSeries(channelID: string, eventID: number, seriesID: string): Promise<void> {
        return this.rest.channels.deleteCalendarEventSeries(channelID, eventID, seriesID);
    }

    /** Create a comment inside a calendar event.
     * @param channelID The ID of a "Calendar" channel.
     * @param eventID The ID of a calendar event.
     * @param options Comment options, includes content, and more.
     */
    async createCalendarComment(channelID: string, eventID: number, options: CreateCalendarCommentOptions): Promise<CalendarEventComment> {
        return this.rest.channels.createCalendarComment(channelID, eventID, options);
    }

    /** Edit an existing calendar event comment.
     * @param channelID The ID of a "Calendar" channel.
     * @param eventID The ID of an event from the channel.
     * @param commentID The ID of the comment to edit.
     * @param options Edit options.
     */
    async editCalendarComment(channelID: string, eventID: number, commentID: number, options: EditCalendarCommentOptions): Promise<CalendarEventComment> {
        return this.rest.channels.editCalendarComment(channelID, eventID, commentID, options);
    }

    /** Delete a comment from a calendar event.
     * @param channelID ID of the channel containing the event.
     * @param eventID ID of the event containing the comment.
     * @param commentID ID of the comment to delete.
     */
    async deleteCalendarComment(channelID: string, eventID: number, commentID: number): Promise<void> {
        return this.rest.channels.deleteCalendarComment(channelID, eventID, commentID);
    }

    /** Add/Edit a RSVP in a calendar event.
     * @param channelID ID of a "Calendar" channel.
     * @param eventID ID of a calendar event.
     * @param memberID ID of a member.
     * @param options Edit options.
     */
    async editCalendarRsvp(channelID: string, eventID: number, memberID: string, options: EditCalendarRSVPOptions): Promise<CalendarEventRSVP>{
        return this.rest.channels.editCalendarRsvp(channelID, eventID, memberID, options);
    }

    /** Delete a RSVP from a calendar event.
     * @param channelID ID of a "Calendar" channel.
     * @param eventID ID of a calendar event.
     * @param memberID ID of a member.
     */
    async deleteCalendarRsvp(channelID: string, eventID: number, memberID: string): Promise<void>{
        return this.rest.channels.deleteCalendarRsvp(channelID, eventID, memberID);
    }

    // list item
    /** Create a new item in a list channel.
     * @param channelID ID of a "Lists" channel.
     * @param content String content of the new item.
     * @param note Add a note to the new item.
     */
    async createListItem(channelID: string, content: POSTListItemBody["message"], note?: POSTListItemBody["note"]): Promise<ListItem>{
        return this.rest.channels.createListItem(channelID, content, note);
    }

    /** Edit an item from a list channel.
     * @param channelID ID of a "Lists" channel.
     * @param itemID ID of a list item.
     * @param content New item's content.
     * @param note Add a note to the item.
     */
    async editListItem(channelID: string, itemID: string, content: PUTListItemBody["message"], note?: PUTListItemBody["note"]): Promise<ListItem>{
        return this.rest.channels.editListItem(channelID, itemID, content, note);
    }

    /** Delete an item from a list channel.
     * @param channelID ID of a "Lists" channel.
     * @param itemID ID of a list item.
     */
    async deleteListItem(channelID: string, itemID: string): Promise<void>{
        return this.rest.channels.deleteListItem(channelID, itemID);
    }

    /** Mark a list item as completed.
     * @param channelID ID of a "Lists" channel.
     * @param itemID ID of a list item.
     */
    async completeListItem(channelID: string, itemID: string): Promise<void>{
        return this.rest.channels.completeListItem(channelID, itemID);
    }

    /** Mark a list item as uncompleted.
     * @param channelID ID of a "Lists" channel.
     * @param itemID ID of a list item.
     */
    async uncompleteListItem(channelID: string, itemID: string): Promise<void>{
        return this.rest.channels.uncompleteListItem(channelID, itemID);
    }

    // group membership
    /** Add a member to a group
     * @param groupID ID of a guild group.
     * @param memberID ID of a member.
     */
    async memberAddGroup(groupID: string, memberID: string): Promise<void>{
        return this.rest.guilds.memberAddGroup(groupID, memberID);
    }

    /** Remove a member from a group
     * @param groupID ID of a guild group.
     * @param memberID ID of a member.
     */
    async memberRemoveGroup(groupID: string, memberID: string): Promise<void>{
        return this.rest.guilds.memberRemoveGroup(groupID, memberID);
    }

    // role membership
    /** Add a role to a member
     * @param guildID ID of a guild.
     * @param memberID ID of a member.
     * @param roleID ID of a role.
     */
    async memberAddRole(guildID: string, memberID: string, roleID: number): Promise<void>{
        return this.rest.guilds.memberAddRole(guildID, memberID, roleID);
    }

    /** Remove a role from a member
     * @param guildID ID of a guild.
     * @param memberID ID of a member.
     * @param roleID ID of a role.
     */
    async memberRemoveRole(guildID: string, memberID: string, roleID: number): Promise<void>{
        return this.rest.guilds.memberRemoveRole(guildID, memberID, roleID);
    }

    /** Edit a member.
     * @param guildID ID of the guild the member is in.
     * @param memberID ID of the the member to edit.
     * @param options Edit options.
     */
    async editMember(guildID: string, memberID: string, options: EditMemberOptions): Promise<void> {
        return this.rest.guilds.editMember(guildID, memberID, options);
    }

    /** Remove a member from a guild.
     * @param guildID The ID of the guild the member is in.
     * @param memberID The ID of the member to kick.
     */
    async removeMember(guildID: string, memberID: string): Promise<void> {
        return this.rest.guilds.removeMember(guildID, memberID);
    }

    /** Ban a guild member.
     * @param guildID ID of the guild the member is in.
     * @param memberID ID of the member to ban.
     * @param reason The reason of the ban.
     */
    async createBan(guildID: string, memberID: string, reason?: string): Promise<BannedMember> {
        return this.rest.guilds.createBan(guildID, memberID, reason);
    }

    /** Unban a guild member.
     * @param guildID ID of the guild the member was in.
     * @param memberID ID of the member to unban.
     */
    async removeBan(guildID: string, memberID: string): Promise<void> {
        return this.rest.guilds.removeBan(guildID, memberID);
    }

    /** Create a webhook
     * @param guildID ID of a guild.
     * @param channelID ID of a channel.
     * @param name Name of the new webhook.
     */
    async createWebhook(guildID: string, channelID: string, name: string): Promise<Webhook> {
        return this.rest.guilds.createWebhook(guildID, channelID, name);
    }

    /** Update a webhook
     * @param guildID ID of a guild.
     * @param webhookID ID of an existent webhook.
     * @param options Edit options.
     */
    async editWebhook(guildID: string, webhookID: string, options: PUTGuildWebhookBody): Promise<Webhook>{
        return this.rest.guilds.editWebhook(guildID, webhookID, options);
    }

    /** Delete a webhook
     * @param guildID ID of a guild.
     * @param webhookID ID of an existent webhook.
     */
    async deleteWebhook(guildID: string, webhookID: string): Promise<void>{
        return this.rest.guilds.deleteWebhook(guildID, webhookID);
    }

    // MISC

    /** Award a member using the built-in EXP system.
     * @param guildID ID of a guild.
     * @param memberID ID of a member.
     * @param amount Amount of experience.
     */
    async awardMember(guildID: string, memberID: string, amount: number): Promise<number>{
        return this.rest.guilds.awardMember(guildID, memberID, amount);
    }

    /** Set a member's xp using the built-in EXP system.
     * @param guildID ID of a guild.
     * @param memberID ID of a member.
     * @param amount Total amount of experience.
     */
    async setMemberXP(guildID: string, memberID: string, amount: number): Promise<number>{
        return this.rest.guilds.setMemberXP(guildID, memberID, amount);
    }

    /** Award every members of a guild having a role using the built-in EXP system.
     * @param guildID ID of a guild.
     * @param roleID ID of a role.
     * @param amount Amount of experience.
     */
    async awardRole(guildID: string, roleID: number, amount: number): Promise<void>{
        return this.rest.guilds.awardRole(guildID, roleID, amount);
    }
}
