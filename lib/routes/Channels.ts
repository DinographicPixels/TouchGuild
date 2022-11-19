/** @module Routes/Channels */
import type { RESTManager } from "../rest/RESTManager";
import * as endpoints from "../rest/endpoints";
import { Channel } from "../structures/Channel";
import { Doc } from "../structures/Doc";
import { ForumThread } from "../structures/ForumThread";
import { CalendarEvent } from "../structures/CalendarEvent";
import { CalendarEventRSVP } from "../structures/CalendarRSVP";
import { Message } from "../structures/Message";
import { ForumThreadComment } from "../structures/ForumThreadComment";
import { ListItem } from "../structures/ListItem";
import {
    APIForumTopic,
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
import { CreateMessageOptions, EditMessageOptions } from "../types/channel";
import { CreateForumThreadOptions, EditForumThreadOptions } from "../types/forumThread";
import { CreateForumCommentOptions, EditForumCommentOptions } from "../types/forumThreadComment";
import { CreateDocOptions, EditDocOptions } from "../types/doc";
import { CreateCalendarEventOptions, EditCalendarEventOptions, EditCalendarRSVPOptions } from "../types/calendarEvent";

export class Channels {
    #manager: RESTManager;
    constructor(manager: RESTManager){
        this.#manager = manager;
    }

    async getChannel(channelID: string): Promise<Channel> {
        return this.#manager.authRequest<GETChannelResponse>({
            method: "GET",
            path:   endpoints.CHANNEL(channelID)
        }).then(data => new Channel(data.channel, this.#manager.client));
    }

    async getMessage(channelID: string, messageID: string, params?: object): Promise<Message> {
        return this.#manager.authRequest<GETChannelMessageResponse>({
            method: "GET",
            path:   endpoints.CHANNEL_MESSAGE(channelID, messageID)
        }).then(data => new Message(data.message, this.#manager.client, params));
    }

    async getMessages(channelID: string, filter?: { before?: string; after?: string; limit?: number; includePrivate?: boolean; }): Promise<Array<Message>> {
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
        }).then(data => data.messages.map(d => new Message(d, this.#manager.client)) as never);
    }

    async getDoc(channelID: string, docID: number): Promise<Doc> {
        return this.#manager.authRequest<GETDocResponse>({
            method: "GET",
            path:   endpoints.CHANNEL_DOC(channelID, docID)
        }).then(data => new Doc(data.doc, this.#manager.client));
    }

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
        }).then(data => data.docs.map(d => new Doc(d, this.#manager.client)) as never);
    }

    async getForumThread(channelID: string, threadID: number): Promise<ForumThread> {
        return this.#manager.authRequest<GETForumTopicResponse>({
            method: "GET",
            path:   endpoints.FORUM_TOPIC(channelID, threadID)
        }).then(data => new ForumThread(data.forumTopic, this.#manager.client));
    }

    async getForumThreads(channelID: string, filter?: { before?: string; limit?: number; }): Promise<Array<ForumThread>> {
        const query = new URLSearchParams();
        if (filter){
            if (filter.before) query.set("before", filter.before.toString());
            if (filter.limit) query.set("limit", filter.limit.toString());
        }
        return this.#manager.authRequest<GETForumTopicsResponse>({
            method: "GET",
            path:   endpoints.FORUM_TOPICS(channelID),
            query
        }).then(data => data.forumTopics.map(d => new ForumThread(d as APIForumTopic, this.#manager.client)) as never);
    }

    async getForumComment(channelID: string, threadID: number, commentID: number): Promise<ForumThreadComment>{
        return this.#manager.authRequest<GETForumTopicCommentResponse>({
            method: "GET",
            path:   endpoints.FORUM_TOPIC_COMMENT(channelID, threadID, commentID)
        }).then(data => new ForumThreadComment(data.forumTopicComment, this.#manager.client));
    }

    async getForumComments(channelID: string, threadID: number): Promise<Array<ForumThreadComment>>{
        return this.#manager.authRequest<GETForumTopicCommentsResponse>({
            method: "GET",
            path:   endpoints.FORUM_TOPIC_COMMENTS(channelID, threadID)
        }).then(data => data.forumTopicComments.map(d => new ForumThreadComment(d, this.#manager.client)) as never);
    }

    async getCalendarEvent(channelID: string, eventID: number): Promise<CalendarEvent> {
        return this.#manager.authRequest<GETCalendarEventResponse>({
            method: "GET",
            path:   endpoints.CHANNEL_EVENT(channelID, eventID)
        }).then(data => new CalendarEvent(data.calendarEvent, this.#manager.client));
    }

    async getCalendarEvents(channelID: string, filter?: { before?: string; after?: string; limit?: number; }): Promise<Array<CalendarEvent>> {
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
        }).then(data => data.calendarEvents.map(d => new CalendarEvent(d, this.#manager.client)) as never);
    }

    async getCalendarRsvp(channelID: string, eventID: number, memberID: string): Promise<CalendarEventRSVP> {
        return this.#manager.authRequest<GETCalendarEventRSVPResponse>({
            method: "GET",
            path:   endpoints.CHANNEL_EVENT_RSVP(channelID, eventID, memberID)
        }).then(data => new CalendarEventRSVP(data.calendarEventRsvp, this.#manager.client));
    }

    async getCalendarRsvps(channelID: string, eventID: number): Promise<Array<CalendarEventRSVP>> {
        return this.#manager.authRequest<GETCalendarEventRSVPSResponse>({
            method: "GET",
            path:   endpoints.CHANNEL_EVENT_RSVPS(channelID, eventID)
        }).then(data => data.calendarEventRsvps.map(d => new CalendarEventRSVP(d, this.#manager.client)) as never);
    }

    async getListItem(channelID: string, itemID: string): Promise<ListItem> {
        return this.#manager.authRequest<GETListItemResponse>({
            method: "GET",
            path:   endpoints.LIST_ITEM(channelID, itemID)
        }).then(data => new ListItem(data.listItem, this.#manager.client));
    }

    async getListItems(channelID: string): Promise<Array<ListItem>> {
        return this.#manager.authRequest<GETChannelListItemsResponse>({
            method: "GET",
            path:   endpoints.LIST_ITEMS(channelID)
        }).then(data => data.listItems.map(d => new ListItem(d as APIListItem, this.#manager.client)) as never);
    }

    // CREATE, EDIT & DELETE

    async createMessage(channelID: string, options: CreateMessageOptions, params?: object): Promise<Message> {
        if (typeof options !== "object") throw new Error("message options should be an object.");
        return this.#manager.authRequest<POSTChannelMessageResponse>({
            method: "POST",
            path:   endpoints.CHANNEL_MESSAGES(channelID),
            json:   options
        }).then(data => new Message(data.message, this.#manager.client, params));
    }

    async editMessage(channelID: string, messageID: string, newMessage: EditMessageOptions, params?: object): Promise<Message> {
        if (typeof newMessage !== "object") throw new Error("newMessage should be an object.");
        return this.#manager.authRequest<POSTChannelMessageResponse>({
            method: "PUT",
            path:   endpoints.CHANNEL_MESSAGE(channelID, messageID),
            json:   newMessage
        }).then(data => new Message(data.message, this.#manager.client, params));
    }

    async deleteMessage(channelID: string, messageID: string): Promise<void> {
        return this.#manager.authRequest<void>({
            method: "DELETE",
            path:   endpoints.CHANNEL_MESSAGE(channelID, messageID)
        });
    }

    async createReaction(channelID: string, channelType: ChannelReactionTypes, messageID: string | number, reaction: number): Promise<void> {
        if (channelType !== "ChannelMessage" && channelType !== "ForumThread") throw new Error("Invalid channel type.");
        let endpointType: "CHANNEL_MESSAGE_CONTENT_EMOTE" | "FORUM_TOPIC_EMOTE" | undefined;
        if (channelType === "ChannelMessage") endpointType = "CHANNEL_MESSAGE_CONTENT_EMOTE";
        if (channelType === "ForumThread") endpointType = "FORUM_TOPIC_EMOTE";

        return this.#manager.authRequest<void>({
            method: "PUT",
            path:   endpoints[endpointType as keyof typeof endpoints](channelID, messageID as never, reaction as never)
        });
    }

    async deleteReaction(channelID: string, channelType: ChannelReactionTypes, messageID: string | number, reaction: number): Promise<void> {
        if (channelType !== "ChannelMessage" && channelType !== "ForumThread") throw new Error("Invalid channel type.");
        let endpointType: "CHANNEL_MESSAGE_CONTENT_EMOTE" | "FORUM_TOPIC_EMOTE" | undefined;
        if (channelType === "ChannelMessage") endpointType = "CHANNEL_MESSAGE_CONTENT_EMOTE";
        if (channelType === "ForumThread") endpointType = "FORUM_TOPIC_EMOTE";

        return this.#manager.authRequest<void>({
            method: "DELETE",
            path:   endpoints[endpointType as keyof typeof endpoints](channelID, messageID as never, reaction as never)
        });
    }

    async createForumThread(channelID: string, options: CreateForumThreadOptions): Promise<ForumThread> {
        if (typeof options !== "object") throw new Error("thread options should be an object.");
        return this.#manager.authRequest<POSTForumTopicResponse>({
            method: "POST",
            path:   endpoints.FORUM_TOPICS(channelID),
            json:   options
        }).then(data => new ForumThread(data.forumTopic, this.#manager.client));
    }

    async editForumThread(channelID: string, threadID: number, options: EditForumThreadOptions): Promise<ForumThread> {
        if (typeof options !== "object") throw new Error("thread options should be an object.");
        return this.#manager.authRequest<PATCHForumTopicResponse>({
            method: "PATCH",
            path:   endpoints.FORUM_TOPIC(channelID, threadID),
            json:   options
        }).then(data => new ForumThread(data.forumTopic, this.#manager.client));
    }

    async deleteForumThread(channelID: string, threadID: number): Promise<void> {
        return this.#manager.authRequest<void>({
            method: "DELETE",
            path:   endpoints.FORUM_TOPIC(channelID, threadID)
        });
    }

    async pinForumThread(channelID: string, threadID: number): Promise<void> {
        return this.#manager.authRequest<void>({
            method: "PUT",
            path:   endpoints.FORUM_TOPIC_PIN(channelID, threadID)
        });
    }

    async unpinForumThread(channelID: string, threadID: number): Promise<void> {
        return this.#manager.authRequest<void>({
            method: "DELETE",
            path:   endpoints.FORUM_TOPIC_PIN(channelID, threadID)
        });
    }

    async lockForumThread(channelID: string, threadID: number): Promise<void> {
        return this.#manager.authRequest<void>({
            method: "PUT",
            path:   endpoints.FORUM_TOPIC_LOCK(channelID, threadID)
        });
    }

    async unlockForumThread(channelID: string, threadID: number): Promise<void> {
        return this.#manager.authRequest<void>({
            method: "DELETE",
            path:   endpoints.FORUM_TOPIC_LOCK(channelID, threadID)
        });
    }

    async createForumComment(channelID: string, threadID: number, options: CreateForumCommentOptions): Promise<ForumThreadComment> {
        if (typeof options !== "object") throw new Error("comment options should be an object.");
        return this.#manager.authRequest<POSTForumTopicCommentResponse>({
            method: "POST",
            path:   endpoints.FORUM_TOPIC_COMMENTS(channelID, threadID),
            json:   options
        }).then(data => new ForumThreadComment(data.forumTopicComment, this.#manager.client, { channelID }));
    }

    async editForumComment(channelID: string, threadID: number, commentID: number, options?: EditForumCommentOptions): Promise<ForumThreadComment> {
        if (typeof options !== "object") throw new Error("comment options should be an object.");
        return this.#manager.authRequest<PATCHForumTopicCommentResponse>({
            method: "PATCH",
            path:   endpoints.FORUM_TOPIC_COMMENT(channelID, threadID, commentID),
            json:   options
        }).then(data => new ForumThreadComment(data.forumTopicComment, this.#manager.client, { channelID }));
    }

    async deleteForumComment(channelID: string, threadID: number, commentID: number): Promise<void> {
        return this.#manager.authRequest<void>({
            method: "DELETE",
            path:   endpoints.FORUM_TOPIC_COMMENT(channelID, threadID, commentID)
        });
    }

    async createDoc(channelID: string, options: CreateDocOptions): Promise<Doc> {
        if (typeof options !== "object") throw new Error("doc options should be an object.");
        return this.#manager.authRequest<POSTDocResponse>({
            method: "POST",
            path:   endpoints.CHANNEL_DOCS(channelID),
            json:   options
        }).then(data => new Doc(data.doc, this.#manager.client));
    }

    async editDoc(channelID: string, docID: number, options: EditDocOptions): Promise<Doc> {
        if (typeof options !== "object") throw new Error("doc options should be an object.");
        return this.#manager.authRequest<PUTDocResponse>({
            method: "PUT",
            path:   endpoints.CHANNEL_DOC(channelID, docID),
            json:   options
        }).then(data => new Doc(data.doc, this.#manager.client));
    }

    async deleteDoc(channelID: string, docID: number): Promise<void> {
        return this.#manager.authRequest<void>({
            method: "DELETE",
            path:   endpoints.CHANNEL_DOC(channelID, docID)
        });
    }

    async createCalendarEvent(channelID: string, options: CreateCalendarEventOptions): Promise<CalendarEvent> {
        if (typeof options !== "object") throw new Error("event options should be an object.");
        if (options.duration && typeof options.duration === "number") options.duration = options.duration / 60000; // ms to min.
        return this.#manager.authRequest<POSTCalendarEventResponse>({
            method: "POST",
            path:   endpoints.CHANNEL_EVENTS(channelID),
            json:   options
        }).then(data => new CalendarEvent(data.calendarEvent, this.#manager.client));
    }

    async editCalendarEvent(channelID: string, eventID: number, options: EditCalendarEventOptions): Promise<CalendarEvent> {
        if (typeof options !== "object") throw new Error("event options should be an object.");
        if (options.duration && typeof options.duration === "number") options.duration = options.duration / 60000; // ms to min.
        return this.#manager.authRequest<PATCHCalendarEventResponse>({
            method: "PATCH",
            path:   endpoints.CHANNEL_EVENT(channelID, eventID),
            json:   options
        }).then(data => new CalendarEvent(data.calendarEvent, this.#manager.client));
    }

    async deleteCalendarEvent(channelID: string, eventID: number): Promise<void> {
        return this.#manager.authRequest<void>({
            method: "DELETE",
            path:   endpoints.CHANNEL_EVENT(channelID, eventID)
        });
    }

    async editCalendarRsvp(channelID: string, eventID: number, memberID: string, options: EditCalendarRSVPOptions): Promise<CalendarEventRSVP> {
        if (typeof options !== "object") throw new Error("rsvp options should be an object.");
        return this.#manager.authRequest<PUTCalendarEventRSVPResponse>({
            method: "PUT",
            path:   endpoints.CHANNEL_EVENT_RSVP(channelID, eventID, memberID),
            json:   options
        }).then(data => new CalendarEventRSVP(data.calendarEventRsvp, this.#manager.client));
    }

    async deleteCalendarRsvp(channelID: string, eventID: number, memberID: string): Promise<void> {
        return this.#manager.authRequest<void>({
            method: "DELETE",
            path:   endpoints.CHANNEL_EVENT_RSVP(channelID, eventID, memberID)
        });
    }

    async createListItem(channelID: string, content: POSTListItemBody["message"], note?: POSTListItemBody["note"]): Promise<ListItem> {
        return this.#manager.authRequest<POSTListItemResponse>({
            method: "POST",
            path:   endpoints.LIST_ITEMS(channelID),
            json:   { message: content, note }
        }).then(data => new ListItem(data.listItem, this.#manager.client));
    }

    async editListItem(channelID: string, itemID: string, content: PUTListItemBody["message"], note?: PUTListItemBody["note"]): Promise<ListItem> {
        return this.#manager.authRequest<PUTListItemResponse>({
            method: "PUT",
            path:   endpoints.LIST_ITEM(channelID, itemID),
            json:   { message: content, note }
        }).then(data => new ListItem(data.listItem, this.#manager.client));
    }

    async deleteListItem(channelID: string, itemID: string): Promise<void> {
        return this.#manager.authRequest<void>({
            method: "DELETE",
            path:   endpoints.LIST_ITEM(channelID, itemID)
        });
    }

    async completeListItem(channelID: string, itemID: string): Promise<void> {
        return this.#manager.authRequest<void>({
            method: "POST",
            path:   endpoints.LIST_ITEM_COMPLETE(channelID, itemID)
        });
    }

    async uncompleteListItem(channelID: string, itemID: string): Promise<void> {
        return this.#manager.authRequest<void>({
            method: "DELETE",
            path:   endpoints.LIST_ITEM_COMPLETE(channelID, itemID)
        });
    }
}
