/** @module Routes/Channels */
import type { RESTManager } from "../rest/RESTManager";
import * as endpoints from "../rest/endpoints";
import { Doc } from "../structures/Doc";
import { ForumThread } from "../structures/ForumThread";
import { CalendarEvent } from "../structures/CalendarEvent";
import { CalendarEventRSVP } from "../structures/CalendarRSVP";
import { Message } from "../structures/Message";
import { ForumThreadComment } from "../structures/ForumThreadComment";
import { ListItem } from "../structures/ListItem";
import {
    APIListItem,
    ChannelReactionTypes,
    GETCalendarEventResponse,
    GETCalendarEventRSVPResponse,
    GETCalendarEventRSVPSResponse,
    GETCalendarEventsResponse,
    GETChannelListItemsResponse,
    GETChannelMessageResponse,
    GETChannelMessagesResponse,
    GETChannelResponse,
    GETDocResponse,
    GETDocsResponse,
    GETForumTopicCommentResponse,
    GETForumTopicCommentsResponse,
    GETForumTopicResponse,
    GETForumTopicsResponse,
    GETListItemResponse,
    PATCHCalendarEventResponse,
    PATCHForumTopicCommentResponse,
    PATCHForumTopicResponse,
    POSTCalendarEventResponse,
    POSTChannelMessageResponse,
    POSTDocResponse,
    POSTForumTopicCommentResponse,
    POSTForumTopicResponse,
    POSTListItemBody,
    POSTListItemResponse,
    PUTCalendarEventRSVPResponse,
    PUTDocResponse,
    PUTListItemBody,
    PUTListItemResponse
} from "../Constants";
import {
    AnyChannel,
    AnyTextableChannel,
    CreateMessageOptions,
    EditMessageOptions,
    GetChannelMessagesFilter
} from "../types/channel";
import { CreateForumThreadOptions, EditForumThreadOptions, GetForumThreadsFilter } from "../types/forumThread";
import { CreateForumCommentOptions, EditForumCommentOptions } from "../types/forumThreadComment";
import { CreateDocOptions, EditDocOptions } from "../types/doc";
import { CreateCalendarEventOptions, EditCalendarEventOptions, EditCalendarRSVPOptions, GetCalendarEventsFilter } from "../types/calendarEvent";
import { DocChannel } from "../structures/DocChannel";
import { ForumChannel } from "../structures/ForumChannel";
import { CalendarChannel } from "../structures/CalendarChannel";
import { TextChannel } from "../structures/TextChannel";

export class Channels {
    #manager: RESTManager;
    constructor(manager: RESTManager){
        this.#manager = manager;
    }

    /** This method is used to get a guild channel.
     * @param channelID The ID of the channel to get.
     */
    async getChannel(channelID: string): Promise<AnyChannel> {
        return this.#manager.authRequest<GETChannelResponse>({
            method: "GET",
            path:   endpoints.CHANNEL(channelID)
        }).then(data => this.#manager.client.util.updateChannel(data.channel));
    }

    /** This method is used to get a channel message.
     * @param channelID The ID of the channel containing the message.
     * @param messageID The ID of the message to get.
     * @param params Optional parameters.
     */
    async getMessage<T extends AnyTextableChannel = AnyTextableChannel>(channelID: string, messageID: string, params?: object): Promise<Message<T>> {
        return this.#manager.authRequest<GETChannelMessageResponse>({
            method: "GET",
            path:   endpoints.CHANNEL_MESSAGE(channelID, messageID)
        }).then(data => this.#manager.client.getChannel<TextChannel>(data.message.serverId as string, channelID)?.messages.update(data.message) as Message<T> ?? new Message<T>(data.message, this.#manager.client, params));
    }

    /** This method is used to get a list of Message
     * @param channelID ID of a "Chat" channel.
     * @param filter Object to filter the output.
     */
    async getMessages(channelID: string, filter?: GetChannelMessagesFilter): Promise<Array<Message<AnyTextableChannel>>> {
        const query = new URLSearchParams();
        if (filter){
            if (filter.before) query.set("before", filter.before.toString());
            if (filter.after) query.set("after", filter.after.toString());
            if (filter.includePrivate) query.set("includePrivate", filter.includePrivate.toString());
            if (filter.limit) query.set("limit", filter.limit.toString());
        }
        return this.#manager.authRequest<GETChannelMessagesResponse>({
            method: "GET",
            path:   endpoints.CHANNEL_MESSAGES(channelID),
            query
        }).then(data => data.messages.map(d => this.#manager.client.getChannel<TextChannel>(d.serverId as string, channelID)?.messages.update(d) ?? new Message(d, this.#manager.client)));
    }

    /** This method is used to get a channel doc.
     *
     * Note: This method requires a "Docs" channel.
     * @param channelID ID of the Docs channel.
     * @param docID ID of the channel doc.
     */
    async getDoc(channelID: string, docID: number): Promise<Doc> {
        return this.#manager.authRequest<GETDocResponse>({
            method: "GET",
            path:   endpoints.CHANNEL_DOC(channelID, docID)
        }).then(data => this.#manager.client.getChannel<DocChannel>(data.doc.serverId, channelID)?.docs.update(data.doc) ?? new Doc(data.doc, this.#manager.client));
    }

    /** This method is used to get a list of "Channel" Doc.
     * @param channelID ID of a "Docs" channel.
     * @param filter Object to filter the output.
     */
    async getDocs(channelID: string, filter?: { before?: string; limit?: number; }): Promise<Array<Doc>> {
        const query = new URLSearchParams();
        if (filter){
            if (filter.before) query.set("before", filter.before.toString());
            if (filter.limit) query.set("limit", filter.limit.toString());
        }
        return this.#manager.authRequest<GETDocsResponse>({
            method: "GET",
            path:   endpoints.CHANNEL_DOCS(channelID),
            query
        }).then(data => data.docs.map(d => this.#manager.client.getChannel<DocChannel>(d.serverId, channelID)?.docs.update(d) ?? new Doc(d, this.#manager.client)) as never);
    }

    /** This method is used to get a specific forum thread.
     *
     * Note: This method requires a "Forum" channel.
     * @param channelID ID of a speific Forum channel.
     * @param threadID ID of the specific Forum Thread.
     */
    async getForumThread(channelID: string, threadID: number): Promise<ForumThread<ForumChannel>> {
        return this.#manager.authRequest<GETForumTopicResponse>({
            method: "GET",
            path:   endpoints.FORUM_TOPIC(channelID, threadID)
        }).then(data => this.#manager.client.util.updateForumThread(data.forumTopic));
    }

    /** This method is used to get a list of ForumThread.
     * @param channelID ID of a "Forum" channel.
     * @param filter Object to filter the output.
     */
    async getForumThreads(channelID: string, filter?: GetForumThreadsFilter): Promise<Array<ForumThread<ForumChannel>>> {
        const query = new URLSearchParams();
        if (filter){
            if (filter.before) query.set("before", filter.before.toString());
            if (filter.limit) query.set("limit", filter.limit.toString());
        }
        return this.#manager.authRequest<GETForumTopicsResponse>({
            method: "GET",
            path:   endpoints.FORUM_TOPICS(channelID),
            query
        }).then(data => data.forumTopics.map(d => this.#manager.client.util.updateForumThread(d)));
    }

    /** This method is used to get a specific forum thread comment.
     * @param channelID ID of a "Forums" channel.
     * @param threadID ID of a Forum thread.
     * @param commentID ID of a Forum thread comment.
     */
    async getForumComment(channelID: string, threadID: number, commentID: number): Promise<ForumThreadComment>{
        return this.#manager.authRequest<GETForumTopicCommentResponse>({
            method: "GET",
            path:   endpoints.FORUM_TOPIC_COMMENT(channelID, threadID, commentID)
        }).then(data => new ForumThreadComment(data.forumTopicComment, this.#manager.client));
    }

    /** This method is used to get a list of ForumThreadComment.
     * @param channelID ID of a "Forums" channel.
     * @param threadID ID of a Forum Thread.
     */
    async getForumComments(channelID: string, threadID: number): Promise<Array<ForumThreadComment>>{
        return this.#manager.authRequest<GETForumTopicCommentsResponse>({
            method: "GET",
            path:   endpoints.FORUM_TOPIC_COMMENTS(channelID, threadID)
        }).then(data => data.forumTopicComments.map(d => new ForumThreadComment(d, this.#manager.client)) as never);
    }

    /** This method is used to get a specific calendar event.
     *
     * Note: this method requires a "Calendar" channel.
     * @param channelID ID of a Calendar channel.
     * @param eventID ID of a Calendar event.
     */
    async getCalendarEvent(channelID: string, eventID: number): Promise<CalendarEvent> {
        return this.#manager.authRequest<GETCalendarEventResponse>({
            method: "GET",
            path:   endpoints.CHANNEL_EVENT(channelID, eventID)
        }).then(data => this.#manager.client.getChannel<CalendarChannel>(data.calendarEvent.serverId, data.calendarEvent.channelId)?.scheduledEvents.update(data.calendarEvent) ?? new CalendarEvent(data.calendarEvent, this.#manager.client));
    }

    /** This method is used to get a list of CalendarEvent
     * @param channelID ID of a "Calendar" channel.
     * @param filter Object to filter the output.
     */
    async getCalendarEvents(channelID: string, filter?: GetCalendarEventsFilter): Promise<Array<CalendarEvent>> {
        const query = new URLSearchParams();
        if (filter){
            if (filter.before) query.set("before", filter.before.toString());
            if (filter.after) query.set("after", filter.after.toString());
            if (filter.limit) query.set("limit", filter.limit.toString());
        }
        return this.#manager.authRequest<GETCalendarEventsResponse>({
            method: "GET",
            path:   endpoints.CHANNEL_EVENTS(channelID),
            query
        }).then(data => data.calendarEvents.map(d => this.#manager.client.getChannel<CalendarChannel>(d.serverId, d.channelId)?.scheduledEvents.update(d) ?? new CalendarEvent(d, this.#manager.client)) as never);
    }

    /** This method is used to get a specific CalendarEventRSVP.
     *
     * Note: this method requires a Calendar channel.
     * @param channelID ID of a Calendar channel
     * @param eventID ID of a Calendar Event
     * @param memberID ID of a Guild Member
     */
    async getCalendarRsvp(channelID: string, eventID: number, memberID: string): Promise<CalendarEventRSVP> {
        return this.#manager.authRequest<GETCalendarEventRSVPResponse>({
            method: "GET",
            path:   endpoints.CHANNEL_EVENT_RSVP(channelID, eventID, memberID)
        }).then(data => this.#manager.client.getChannel<CalendarChannel>(data.calendarEventRsvp.serverId, data.calendarEventRsvp.channelId)?.scheduledEvents.get(data.calendarEventRsvp.calendarEventId)?.rsvps.update(data.calendarEventRsvp) ?? new CalendarEventRSVP(data.calendarEventRsvp, this.#manager.client));
    }

    /** This method is used to get a list of CalendarEventRSVP.
     * @param channelID ID of a "Calendar" channel.
     * @param eventID ID of a calendar event.
     */
    async getCalendarRsvps(channelID: string, eventID: number): Promise<Array<CalendarEventRSVP>> {
        return this.#manager.authRequest<GETCalendarEventRSVPSResponse>({
            method: "GET",
            path:   endpoints.CHANNEL_EVENT_RSVPS(channelID, eventID)
        }).then(data => data.calendarEventRsvps.map(d => this.#manager.client.getChannel<CalendarChannel>(d.serverId, d.channelId)?.scheduledEvents.get(d.calendarEventId)?.rsvps.update(d) ?? new CalendarEventRSVP(d, this.#manager.client)) as never);
    }

    /** This method is used to get a specific list item.
     * @param channelID ID of a "List" channel.
     * @param itemID ID of a list item.
     */
    async getListItem(channelID: string, itemID: string): Promise<ListItem> {
        return this.#manager.authRequest<GETListItemResponse>({
            method: "GET",
            path:   endpoints.LIST_ITEM(channelID, itemID)
        }).then(data => new ListItem(data.listItem, this.#manager.client));
    }

    /** This method is used to get a list of ListItem.
     * @param channelID ID of a "List" channel.
     */
    async getListItems(channelID: string): Promise<Array<ListItem>> {
        return this.#manager.authRequest<GETChannelListItemsResponse>({
            method: "GET",
            path:   endpoints.LIST_ITEMS(channelID)
        }).then(data => data.listItems.map(d => new ListItem(d as APIListItem, this.#manager.client)) as never);
    }

    // CREATE, EDIT & DELETE

    /** Send a message in a specified channel.
     * @param channelID ID of the channel.
     * @param options Message options
     * @param params Optional parameters.
     */
    async createMessage<T extends AnyTextableChannel = AnyTextableChannel>(channelID: string, options: CreateMessageOptions, params?: object): Promise<Message<T>> {
        if (typeof options !== "object") throw new Error("message options should be an object.");
        return this.#manager.authRequest<POSTChannelMessageResponse>({
            method: "POST",
            path:   endpoints.CHANNEL_MESSAGES(channelID),
            json:   options
        }).then(data => new Message<T>(data.message, this.#manager.client, params));
    }

    /** Edit a specific message coming from a specified channel.
     * @param channelID The ID of the channel.
     * @param messageID The ID of the message you'd like to edit.
     * @param newMessage object containing new message's options.
     * @param params Optional parameters.
     */
    async editMessage<T extends AnyTextableChannel = AnyTextableChannel>(channelID: string, messageID: string, newMessage: EditMessageOptions, params?: object): Promise<Message<T>> {
        if (typeof newMessage !== "object") throw new Error("newMessage should be an object.");
        return this.#manager.authRequest<POSTChannelMessageResponse>({
            method: "PUT",
            path:   endpoints.CHANNEL_MESSAGE(channelID, messageID),
            json:   newMessage
        }).then(data => new Message<T>(data.message, this.#manager.client, params));
    }

    /** Delete a specific message.
     * @param channelID ID of the channel containing the message.
     * @param messageID ID of the message you'd like to delete.
     */
    async deleteMessage(channelID: string, messageID: string): Promise<void> {
        return this.#manager.authRequest<void>({
            method: "DELETE",
            path:   endpoints.CHANNEL_MESSAGE(channelID, messageID)
        });
    }

    /** Add a reaction to a specified object.
     * @param channelID ID of a channel that supports reaction.
     * @param channelType Type of the selected channel. (e.g: "ChannelMessage")
     * @param objectID ID of the object you'd like to add the reaction to. (e.g: a message id)
     * @param reaction ID of the reaction.
     */
    async createReaction(channelID: string, channelType: ChannelReactionTypes, objectID: string | number, reaction: number): Promise<void> {
        if (channelType !== "ChannelMessage" && channelType !== "ForumThread") throw new Error("Invalid channel type.");
        let endpointType: "CHANNEL_MESSAGE_CONTENT_EMOTE" | "FORUM_TOPIC_EMOTE" | undefined;
        if (channelType === "ChannelMessage") endpointType = "CHANNEL_MESSAGE_CONTENT_EMOTE";
        if (channelType === "ForumThread") endpointType = "FORUM_TOPIC_EMOTE";

        return this.#manager.authRequest<void>({
            method: "PUT",
            path:   endpoints[endpointType as keyof typeof endpoints](channelID, objectID as never, reaction as never)
        });
    }

    /** Remove a reaction from a specified message.
     * @param channelID ID of a channel that supports reaction.
     * @param channelType Type of the selected channel. (e.g: "ChannelMessage")
     * @param objectID ID of the object you'd like to add the reaction to. (e.g: a message id)
     * @param reaction ID of the reaction.
     */
    async deleteReaction(channelID: string, channelType: ChannelReactionTypes, objectID: string | number, reaction: number): Promise<void> {
        if (channelType !== "ChannelMessage" && channelType !== "ForumThread") throw new Error("Invalid channel type.");
        let endpointType: "CHANNEL_MESSAGE_CONTENT_EMOTE" | "FORUM_TOPIC_EMOTE" | undefined;
        if (channelType === "ChannelMessage") endpointType = "CHANNEL_MESSAGE_CONTENT_EMOTE";
        if (channelType === "ForumThread") endpointType = "FORUM_TOPIC_EMOTE";

        return this.#manager.authRequest<void>({
            method: "DELETE",
            path:   endpoints[endpointType as keyof typeof endpoints](channelID, objectID as never, reaction as never)
        });
    }

    /** Create a forum thread in a specified forum channel.
     * @param channelID ID of a "Forums" channel.
     * @param options Thread's options including title & content.
     */
    async createForumThread<T extends ForumChannel = ForumChannel>(channelID: string, options: CreateForumThreadOptions): Promise<ForumThread<T>> {
        if (typeof options !== "object") throw new Error("thread options should be an object.");
        return this.#manager.authRequest<POSTForumTopicResponse>({
            method: "POST",
            path:   endpoints.FORUM_TOPICS(channelID),
            json:   options
        }).then(data => new ForumThread<T>(data.forumTopic, this.#manager.client));
    }

    /** Edit a forum thread from a specified forum channel.
     * @param channelID ID of a "Forums" channel.
     * @param threadID ID of a forum thread.
     * @param options Edit options.
     */
    async editForumThread<T extends ForumChannel = ForumChannel>(channelID: string, threadID: number, options: EditForumThreadOptions): Promise<ForumThread<T>> {
        if (typeof options !== "object") throw new Error("thread options should be an object.");
        return this.#manager.authRequest<PATCHForumTopicResponse>({
            method: "PATCH",
            path:   endpoints.FORUM_TOPIC(channelID, threadID),
            json:   options
        }).then(data => new ForumThread<T>(data.forumTopic, this.#manager.client));
    }

    /** Delete a forum thread from a specific forum channel
     * @param channelID ID of a "Forums" channel.
     * @param threadID ID of a forum thread.
     */
    async deleteForumThread(channelID: string, threadID: number): Promise<void> {
        return this.#manager.authRequest<void>({
            method: "DELETE",
            path:   endpoints.FORUM_TOPIC(channelID, threadID)
        });
    }

    /** Pin a forum thread.
     * @param channelID ID of a "Forums" channel.
     * @param threadID ID of a forum thread.
     */
    async pinForumThread(channelID: string, threadID: number): Promise<void> {
        return this.#manager.authRequest<void>({
            method: "PUT",
            path:   endpoints.FORUM_TOPIC_PIN(channelID, threadID)
        });
    }

    /** Unpin a forum thread.
     * @param channelID ID of a "Forums" channel.
     * @param threadID ID of a forum thread.
     */
    async unpinForumThread(channelID: string, threadID: number): Promise<void> {
        return this.#manager.authRequest<void>({
            method: "DELETE",
            path:   endpoints.FORUM_TOPIC_PIN(channelID, threadID)
        });
    }

    /** Lock a forum thread.
     * @param channelID ID of a "Forums" channel.
     * @param threadID ID of a forum thread.
     */
    async lockForumThread(channelID: string, threadID: number): Promise<void> {
        return this.#manager.authRequest<void>({
            method: "PUT",
            path:   endpoints.FORUM_TOPIC_LOCK(channelID, threadID)
        });
    }

    /** Unlock a forum thread.
     * @param channelID ID of a "Forums" channel.
     * @param threadID ID of a forum thread.
     */
    async unlockForumThread(channelID: string, threadID: number): Promise<void> {
        return this.#manager.authRequest<void>({
            method: "DELETE",
            path:   endpoints.FORUM_TOPIC_LOCK(channelID, threadID)
        });
    }

    /** Add a comment to a forum thread.
     * @param channelID ID of a "Forums" channel.
     * @param threadID ID of a forum thread.
     * @param options Comment's options.
     */
    async createForumComment(channelID: string, threadID: number, options: CreateForumCommentOptions): Promise<ForumThreadComment> {
        if (typeof options !== "object") throw new Error("comment options should be an object.");
        return this.#manager.authRequest<POSTForumTopicCommentResponse>({
            method: "POST",
            path:   endpoints.FORUM_TOPIC_COMMENTS(channelID, threadID),
            json:   options
        }).then(data => new ForumThreadComment(data.forumTopicComment, this.#manager.client, { channelID }));
    }

    /** Edit a forum thread's comment.
     * @param channelID ID of a "Forums" channel.
     * @param threadID ID of a forum thread.
     * @param commentID ID of a thread comment.
     * @param options Edit options.
     */
    async editForumComment(channelID: string, threadID: number, commentID: number, options?: EditForumCommentOptions): Promise<ForumThreadComment> {
        if (typeof options !== "object") throw new Error("comment options should be an object.");
        return this.#manager.authRequest<PATCHForumTopicCommentResponse>({
            method: "PATCH",
            path:   endpoints.FORUM_TOPIC_COMMENT(channelID, threadID, commentID),
            json:   options
        }).then(data => new ForumThreadComment(data.forumTopicComment, this.#manager.client, { channelID }));
    }

    /** Delete a forum thread comment.
     * @param channelID ID of a "Forums" channel.
     * @param threadID ID of a forum thread.
     * @param commentID ID of a forum thread comment.
     */
    async deleteForumComment(channelID: string, threadID: number, commentID: number): Promise<void> {
        return this.#manager.authRequest<void>({
            method: "DELETE",
            path:   endpoints.FORUM_TOPIC_COMMENT(channelID, threadID, commentID)
        });
    }

    /** Create a doc in a "Docs" channel.
     * @param channelID ID pf a "Docs" channel.
     * @param options Doc's options.
     */
    async createDoc(channelID: string, options: CreateDocOptions): Promise<Doc> {
        if (typeof options !== "object") throw new Error("doc options should be an object.");
        return this.#manager.authRequest<POSTDocResponse>({
            method: "POST",
            path:   endpoints.CHANNEL_DOCS(channelID),
            json:   options
        }).then(data => new Doc(data.doc, this.#manager.client));
    }

    /** Edit a doc from a "Docs" channel.
     * @param channelID ID of a "Docs" channel.
     * @param docID ID of a doc.
     * @param options Edit options.
     */
    async editDoc(channelID: string, docID: number, options: EditDocOptions): Promise<Doc> {
        if (typeof options !== "object") throw new Error("doc options should be an object.");
        return this.#manager.authRequest<PUTDocResponse>({
            method: "PUT",
            path:   endpoints.CHANNEL_DOC(channelID, docID),
            json:   options
        }).then(data => new Doc(data.doc, this.#manager.client));
    }

    /** Delete a doc from a "Docs" channel.
     * @param channelID ID of a "Docs" channel.
     * @param docID ID of a doc.
     */
    async deleteDoc(channelID: string, docID: number): Promise<void> {
        return this.#manager.authRequest<void>({
            method: "DELETE",
            path:   endpoints.CHANNEL_DOC(channelID, docID)
        });
    }

    /** Create an event into a "Calendar" channel.
     * @param channelID ID of a "Calendar" channel.
     * @param options Event options.
     */
    async createCalendarEvent(channelID: string, options: CreateCalendarEventOptions): Promise<CalendarEvent> {
        if (typeof options !== "object") throw new Error("event options should be an object.");
        if (options.duration && typeof options.duration === "number") options.duration = options.duration / 60000; // ms to min.
        return this.#manager.authRequest<POSTCalendarEventResponse>({
            method: "POST",
            path:   endpoints.CHANNEL_EVENTS(channelID),
            json:   options
        }).then(data => new CalendarEvent(data.calendarEvent, this.#manager.client));
    }

    /** Edit an event from a "Calendar" channel.
     * @param channelID ID of a "Calendar" channel.
     * @param eventID ID of a calendar event.
     * @param options Edit options.
     */
    async editCalendarEvent(channelID: string, eventID: number, options: EditCalendarEventOptions): Promise<CalendarEvent> {
        if (typeof options !== "object") throw new Error("event options should be an object.");
        if (options.duration && typeof options.duration === "number") options.duration = options.duration / 60000; // ms to min.
        return this.#manager.authRequest<PATCHCalendarEventResponse>({
            method: "PATCH",
            path:   endpoints.CHANNEL_EVENT(channelID, eventID),
            json:   options
        }).then(data => new CalendarEvent(data.calendarEvent, this.#manager.client));
    }

    /** Delete an event from a "Calendar" channel.
     * @param channelID ID of a "Calendar" channel.
     * @param eventID ID of a calendar event.
     */
    async deleteCalendarEvent(channelID: string, eventID: number): Promise<void> {
        return this.#manager.authRequest<void>({
            method: "DELETE",
            path:   endpoints.CHANNEL_EVENT(channelID, eventID)
        });
    }

    /** Add/Edit a RSVP in a calendar event.
     * @param channelID ID of a "Calendar" channel.
     * @param eventID ID of a calendar event.
     * @param memberID ID of a member.
     * @param options Edit options.
     */
    async editCalendarRsvp(channelID: string, eventID: number, memberID: string, options: EditCalendarRSVPOptions): Promise<CalendarEventRSVP> {
        if (typeof options !== "object") throw new Error("rsvp options should be an object.");
        return this.#manager.authRequest<PUTCalendarEventRSVPResponse>({
            method: "PUT",
            path:   endpoints.CHANNEL_EVENT_RSVP(channelID, eventID, memberID),
            json:   options
        }).then(data => new CalendarEventRSVP(data.calendarEventRsvp, this.#manager.client));
    }

    /** Delete a RSVP from a calendar event.
     * @param channelID ID of a "Calendar" channel.
     * @param eventID ID of a calendar event.
     * @param memberID ID of a member.
     */
    async deleteCalendarRsvp(channelID: string, eventID: number, memberID: string): Promise<void> {
        return this.#manager.authRequest<void>({
            method: "DELETE",
            path:   endpoints.CHANNEL_EVENT_RSVP(channelID, eventID, memberID)
        });
    }

    /** Create a new item in a list channel.
     * @param channelID ID of a "Lists" channel.
     * @param content String content of the new item.
     * @param note Add a note to the new item.
     */
    async createListItem(channelID: string, content: POSTListItemBody["message"], note?: POSTListItemBody["note"]): Promise<ListItem> {
        return this.#manager.authRequest<POSTListItemResponse>({
            method: "POST",
            path:   endpoints.LIST_ITEMS(channelID),
            json:   { message: content, note }
        }).then(data => new ListItem(data.listItem, this.#manager.client));
    }

    /** Edit an item from a list channel.
     * @param channelID ID of a "Lists" channel.
     * @param itemID ID of a list item.
     * @param content New item's content.
     * @param note Add a note to the item.
     */
    async editListItem(channelID: string, itemID: string, content: PUTListItemBody["message"], note?: PUTListItemBody["note"]): Promise<ListItem> {
        return this.#manager.authRequest<PUTListItemResponse>({
            method: "PUT",
            path:   endpoints.LIST_ITEM(channelID, itemID),
            json:   { message: content, note }
        }).then(data => new ListItem(data.listItem, this.#manager.client));
    }

    /** Delete an item from a list channel.
     * @param channelID ID of a "Lists" channel.
     * @param itemID ID of a list item.
     */
    async deleteListItem(channelID: string, itemID: string): Promise<void> {
        return this.#manager.authRequest<void>({
            method: "DELETE",
            path:   endpoints.LIST_ITEM(channelID, itemID)
        });
    }

    /** Mark a list item as completed.
     * @param channelID ID of a "Lists" channel.
     * @param itemID ID of a list item.
     */
    async completeListItem(channelID: string, itemID: string): Promise<void> {
        return this.#manager.authRequest<void>({
            method: "POST",
            path:   endpoints.LIST_ITEM_COMPLETE(channelID, itemID)
        });
    }

    /** Mark a list item as uncompleted.
     * @param channelID ID of a "Lists" channel.
     * @param itemID ID of a list item.
     */
    async uncompleteListItem(channelID: string, itemID: string): Promise<void> {
        return this.#manager.authRequest<void>({
            method: "DELETE",
            path:   endpoints.LIST_ITEM_COMPLETE(channelID, itemID)
        });
    }
}
