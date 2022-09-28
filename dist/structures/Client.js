"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Client = void 0;
const Message_1 = require("./Message");
const Channel_1 = require("./Channel");
const GatewayHandler_1 = require("../gateway/GatewayHandler");
const WSManager_1 = require("../WSManager");
const Member_1 = require("./Member");
const Guild_1 = require("./Guild");
const Utils_1 = require("../Utils");
const events_1 = __importDefault(require("events"));
const ForumTopic_1 = require("./ForumTopic");
const Webhook_1 = require("./Webhook");
const endpoints = __importStar(require("../rest/endpoints"));
const Doc_1 = require("./Doc");
const CalendarEvent_1 = require("./CalendarEvent");
const CalendarRSVP_1 = require("./CalendarRSVP");
const ListItem_1 = require("./ListItem");
const calls = new Utils_1.call();
class Client extends events_1.default {
    constructor(params) {
        var _a;
        if (typeof params !== "object")
            throw new Error("The token isn't provided in an object.");
        if (typeof (params === null || params === void 0 ? void 0 : params.token) == "undefined")
            throw new Error("Cannot create client without token, no token is provided.");
        super();
        this.params = { token: params.token, REST: (_a = params.REST) !== null && _a !== void 0 ? _a : true };
        this.ws = new WSManager_1.WSManager({ token: this.token, proxyURL: undefined, apiversion: undefined, reconnect: undefined, reconnectAttemptLimit: undefined, replayMissedEvents: undefined });
        this.cache = new Map();
        this.identifiers = this.ws.identifiers;
    }
    /** Bot's token. */
    get token() {
        //console.log("TouchGuild WARN! : Returned token value, do not share this token to anyone.");
        return this.params.token;
    }
    /** Connect to the Guilded API. */
    connect(...args) {
        this.ws.connect();
        this.ws.emitter.on('ready', () => {
            console.log('Connected to Guilded!');
            this.emit('ready');
        });
        this.ws.emitter.on('message', (args) => {
            const { t: eventType, d: eventData } = JSON.parse(args);
            new GatewayHandler_1.GatewayHandler(this).handleMessage(eventType, eventData);
        });
    }
    // REST
    /** RESTChannel is a Channel component with every method, params you need. */
    getRESTChannel(channelID) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.params.REST == false)
                throw new TypeError("REST has been manually disabled, you can't use REST methods.");
            let response = yield calls.get(endpoints.CHANNEL(channelID), this.token);
            // let response = SYNCFETCH('GET', `/channels/${channelID}`, this.token, null) [deprecated]
            return new Channel_1.Channel(response.data.channel, this);
        });
    }
    /** RESTMember is a Member component with every method, params you need. */
    getRESTMember(guildID, memberID) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.params.REST == false)
                throw new TypeError("REST has been manually disabled, you can't use REST methods.");
            let response = yield calls.get(endpoints.GUILD_MEMBER(guildID, memberID), this.token);
            // let response = SYNCFETCH('GET', `/servers/${guildID}/members/${memberID}`, this.token, null) [deprecated]
            return new Member_1.Member(response.data.member, this, guildID);
        });
    }
    /** RESTGuild is basically a Guild Component with everything you need. */
    getRESTGuild(guildID) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.params.REST == false)
                throw new TypeError("REST has been manually disabled, you can't use REST methods.");
            let response = yield calls.get(endpoints.GUILD(guildID), this.token);
            // let response = SYNCFETCH('GET', `/servers/${guildID}`, this.token, null) [deprecated]
            return new Guild_1.Guild(response.data.server, this);
        });
    }
    /** Getting RESTChannelMessages will return you an Array of multiple Message component, that process can take some time. */
    getRESTChannelMessages(channelID, filter) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.params.REST == false)
                throw new TypeError("REST has been manually disabled, you can't use REST methods.");
            let response = yield calls.get(endpoints.CHANNEL_MESSAGES(channelID), this.token);
            let channelMSGs = [];
            for (const message of response.data.messages) {
                if (message.type !== 'system') {
                    channelMSGs.push(new Message_1.Message(message, this));
                }
            }
            return channelMSGs;
        });
    }
    // docs
    /** Getting RESTChannelDocs will return you an Array of multiple Doc component, that process can take some time. */
    getRESTChannelDocs(channelID, filter) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.params.REST == false)
                throw new TypeError("REST has been manually disabled, you can't use REST methods.");
            let response = yield calls.get(endpoints.CHANNEL_DOCS(channelID), this.token, filter);
            let docsARRAY = [];
            for (const doc of response.data.docs) {
                docsARRAY.push(new Doc_1.Doc(doc, this));
            }
            return docsARRAY;
        });
    }
    /** RESTChannelDoc is a Doc component. */
    getRESTChannelDoc(channelID, docID) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.params.REST == false)
                throw new TypeError("REST has been manually disabled, you can't use REST methods.");
            let response = yield calls.get(endpoints.CHANNEL_DOC(channelID, docID), this.token);
            return new Doc_1.Doc(response.data.doc, this);
        });
    }
    //  topics
    /** Getting RESTForumTopics will return you an Array of ForumTopic, that process can take some time. */
    getRESTForumTopics(channelID, filter) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.params.REST == false)
                throw new TypeError("REST has been manually disabled, you can't use REST methods.");
            let response = yield calls.get(endpoints.FORUM_TOPICS(channelID), this.token, filter);
            let topicARRAY = [];
            for (const topic of response.data.forumTopics) {
                topicARRAY.push(new ForumTopic_1.ForumTopic(topic, this));
            }
            return topicARRAY;
        });
    }
    /** RESTForumTopic is a ForumTopic component. */
    getRESTForumTopic(channelID, topicID) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.params.REST == false)
                throw new TypeError("REST has been manually disabled, you can't use REST methods.");
            let response = yield calls.get(endpoints.FORUM_TOPIC(channelID, topicID), this.token);
            return new ForumTopic_1.ForumTopic(response.data.forumTopic, this);
        });
    }
    // Calendar
    /** Getting RESTCalendarEvents returns you an Array of multiple CalendarEvent component, this process can take time depending on the number of calendar event. */
    getRESTCalendarEvents(channelID, filter) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.params.REST == false)
                throw new TypeError("REST has been manually disabled, you can't use REST methods.");
            let response = yield calls.get(endpoints.CHANNEL_EVENTS(channelID), this.token, filter);
            let cEventArray = [];
            for (const event of response.data.calendarEvents) {
                cEventArray.push(new CalendarEvent_1.CalendarEvent(event, this));
            }
            return cEventArray;
        });
    }
    /** RESTCalendarEvent is a CalendarEvent component. */
    getRESTCalendarEvent(channelID, eventID) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.params.REST == false)
                throw new TypeError("REST has been manually disabled, you can't use REST methods.");
            let response = yield calls.get(endpoints.CHANNEL_EVENT(channelID, eventID), this.token);
            return new CalendarEvent_1.CalendarEvent(response.data.calendarEvent, this);
        });
    }
    /** RESTCalendarRsvp is a CalendarEventRSVP component. */
    getRESTCalendarRsvp(channelID, eventID, memberID) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.params.REST == false)
                throw new TypeError("REST has been manually disabled, you can't use REST methods.");
            let response = yield calls.get(endpoints.CHANNEL_EVENT_RSVP(channelID, eventID, memberID), this.token);
            return new CalendarRSVP_1.CalendarEventRSVP(response.data.calendarEventRsvp, this);
        });
    }
    /** Getting RESTCalendarRsvps will return you an Array of CalendarEventRSVP, this process can take time.*/
    getRESTCalendarRsvps(channelID, eventID) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.params.REST == false)
                throw new TypeError("REST has been manually disabled, you can't use REST methods.");
            let response = yield calls.get(endpoints.CHANNEL_EVENT_RSVPS(channelID, eventID), this.token);
            let array = [];
            for (const eventRsvp of response.data.calendarEventRsvps) {
                array.push(new CalendarRSVP_1.CalendarEventRSVP(eventRsvp, this));
            }
            return array;
        });
    }
    // list item
    /** RESTListItem is a ListItem component. */
    getRESTListItem(channelID, itemID) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.params.REST == false)
                throw new TypeError("REST has been manually disabled, you can't use REST methods.");
            let response = yield calls.get(endpoints.LIST_ITEM(channelID, itemID), this.token);
            return new ListItem_1.ListItem(response.data.listItem, this);
        });
    }
    /** Getting RESTListItems will return you an Array of ListItems, this process can take time.*/
    getRESTListItems(channelID) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.params.REST == false)
                throw new TypeError("REST has been manually disabled, you can't use REST methods.");
            let response = yield calls.get(endpoints.LIST_ITEMS(channelID), this.token);
            let array = [];
            for (const item of response.data.listItems) {
                array.push(new ListItem_1.ListItem(item, this));
            }
            return array;
        });
    }
    getRESTGuildWebhook(guildID, webhookID) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.params.REST == false)
                throw new TypeError("REST has been manually disabled, you can't use REST methods.");
            let response = yield calls.get(endpoints.GUILD_WEBHOOK(guildID, webhookID), this.token);
            return new Webhook_1.Webhook(response.data.webhook, this);
        });
    }
    getRESTChannelWebhooks(guildID, channelID) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.params.REST == false)
                throw new TypeError("REST has been manually disabled, you can't use REST methods.");
            let response = yield calls.get(endpoints.GUILD_WEBHOOKS(guildID), this.token, { channelId: channelID });
            let array = [];
            for (const item of response.data.webhooks) {
                array.push(new Webhook_1.Webhook(item, this));
            }
            return array;
        });
    }
    // RAW DATA (produces less lag, and less info are gived, aren't gived as component, great for read only)
    // Note: REST takes time to treat Arrays, the methods below are here to replace them by only giving info without component.
    /** Array of object containing channel messages */
    getChannelMessages(channelID, filter) {
        return __awaiter(this, void 0, void 0, function* () {
            let response = yield calls.get(endpoints.CHANNEL_MESSAGES(channelID), this.token, filter);
            return response.data.messages;
        });
    }
    /** Array of object containing channel docs */
    getChannelDocs(channelID, filter) {
        return __awaiter(this, void 0, void 0, function* () {
            let response = yield calls.get(endpoints.CHANNEL_DOCS(channelID), this.token, filter);
            return response.data.docs;
        });
    }
    /** Array of object containing forum topics */
    getForumTopics(channelID, filter) {
        return __awaiter(this, void 0, void 0, function* () {
            let response = yield calls.get(endpoints.FORUM_TOPICS(channelID), this.token, filter);
            return response.data.forumTopics;
        });
    }
    /** Array of object containing calendar events */
    getCalendarEvents(channelID, filter) {
        return __awaiter(this, void 0, void 0, function* () {
            let response = yield calls.get(endpoints.CHANNEL_EVENTS(channelID), this.token, filter);
            return response.data.calendarEvents;
        });
    }
    /** Array of object containing calendar rsvps */
    getCalendarRsvps(channelID, eventID) {
        return __awaiter(this, void 0, void 0, function* () {
            let response = yield calls.get(endpoints.CHANNEL_EVENT_RSVPS(channelID, eventID), this.token);
            return response.data.calendarEventRsvps;
        });
    }
    /** Array of object containing list items */
    getListItems(channelID) {
        return __awaiter(this, void 0, void 0, function* () {
            let response = yield calls.get(endpoints.LIST_ITEMS(channelID), this.token);
            return response.data.listItems;
        });
    }
    /** Will return an array containing every roles the member has. */
    getMemberRoles(guildID, memberID) {
        return __awaiter(this, void 0, void 0, function* () {
            let response = yield calls.get(endpoints.GUILD_MEMBER_ROLES(guildID, memberID), this.token);
            return response.data.roleIds;
        });
    }
    /** Array of object containing guild channel webhooks. */
    getChannelWebhooks(guildID, channelID) {
        return __awaiter(this, void 0, void 0, function* () {
            let response = yield calls.get(endpoints.GUILD_WEBHOOKS(guildID), this.token, { channelId: channelID });
            return response.data.webhooks;
        });
    }
    // CREATE, EDIT, DELETE.
    // message
    /** Create a channel in a specified guild. */
    createChannel(guildID, name, type, options) {
        return __awaiter(this, void 0, void 0, function* () {
            var body = {};
            if (!guildID)
                throw new TypeError('guildID is a required parameter.');
            if (!name)
                throw new TypeError(`name parameter cannot be empty.`);
            if (!type)
                type = 'chat';
            Object.assign(body, { name: name, type: type });
            if (!options)
                options = {};
            if (options.categoryID && options.groupID)
                throw new TypeError("Two channel location id can't be defined at the same time. (categoryID & groupID)");
            Object.assign(body, { serverId: guildID });
            if (options.groupID) {
                Object.assign(body, { groupId: options.groupID });
            }
            else if (options.categoryID) {
                Object.assign(body, { categoryId: options.categoryID });
            }
            if (options) {
                if (options.topic)
                    Object.assign(body, { topic: options.topic });
                if (options.isPublic)
                    Object.assign(body, { isPublic: options.isPublic });
            }
            //let response = SYNCFETCH('POST', '/channels', this.token, JSON.stringify(body))
            let response = yield calls.post(endpoints.CHANNELS(), this.token, body);
            return new Channel_1.Channel(response.data.channel, this);
        });
    }
    /** Create a message in a specified channel ID */
    createMessage(channelID, options) {
        return __awaiter(this, void 0, void 0, function* () {
            if (typeof options !== 'object')
                throw new TypeError('message options should be an object.');
            let bodyContent = JSON.stringify(options);
            //let response = await FETCH('POST', `/channels/${channelID}/messages`, this.token, bodyContent)
            let response = yield calls.post(endpoints.CHANNEL_MESSAGES(channelID), this.token, options);
            return new Message_1.Message(response.data.message, this);
        });
    }
    /** Edit a specific message in a specified channel ID. */
    editMessage(channelID, messageID, newMessage) {
        return __awaiter(this, void 0, void 0, function* () {
            if (typeof newMessage !== 'object')
                throw new TypeError("newMessage should be an Object. (example: {content: 'heyo!'})");
            //let response = await FETCH('PUT', `/channels/${channelID}/messages/${messageID}`, this.token, JSON.stringify(newMessage))
            let response = yield calls.put(endpoints.CHANNEL_MESSAGE(channelID, messageID), this.token, newMessage);
            return new Message_1.Message(response.data.message, this);
        });
    }
    /** Delete a specific message. */
    deleteMessage(channelID, messageID) {
        return __awaiter(this, void 0, void 0, function* () {
            //await FETCH('DELETE', `/channels/${channelID}/messages/${messageID}`, this.token, null);
            yield calls.delete(endpoints.CHANNEL_MESSAGE(channelID, messageID), this.token);
        });
    }
    /** Add a reaction to a specified message */
    addMessageReaction(channelID, messageID, reaction) {
        return __awaiter(this, void 0, void 0, function* () {
            yield calls.put(endpoints.CHANNEL_MESSAGE_CONTENT_EMOTE(channelID, messageID, reaction), this.token, {});
        });
    }
    /** Remove a specific reaction from a message. */
    removeMessageReaction(channelID, messageID, reaction) {
        return __awaiter(this, void 0, void 0, function* () {
            yield calls.delete(endpoints.CHANNEL_MESSAGE_CONTENT_EMOTE(channelID, messageID, reaction), this.token);
        });
    }
    // topic
    /** Create a topic in a specified forum channel. */
    createTopic(channelID, options) {
        return __awaiter(this, void 0, void 0, function* () {
            //let response = await FETCH('POST', `/channels/${channelID}/topics`, this.token, JSON.stringify(options))
            let response = yield calls.post(endpoints.FORUM_TOPICS(channelID), this.token, options);
            return new ForumTopic_1.ForumTopic(response.data.forumTopic, this);
        });
    }
    /** Edit a topic from a specified forum channel. */
    editTopic(channelID, topicID, options) {
        return __awaiter(this, void 0, void 0, function* () {
            let response = yield calls.patch(endpoints.FORUM_TOPIC(channelID, topicID), this.token, options);
            return new ForumTopic_1.ForumTopic(response.data.forumTopic, this);
        });
    }
    /** Delete a topic from a specific forum channel */
    deleteTopic(channelID, topicID) {
        return __awaiter(this, void 0, void 0, function* () {
            yield calls.delete(endpoints.FORUM_TOPIC(channelID, topicID), this.token);
        });
    }
    /** Pin a forum topic. */
    pinTopic(channelID, topicID) {
        return __awaiter(this, void 0, void 0, function* () {
            yield calls.put(endpoints.FORUM_TOPIC_PIN(channelID, topicID), this.token, {});
        });
    }
    /** Unpin a forum topic */
    unpinTopic(channelID, topicID) {
        return __awaiter(this, void 0, void 0, function* () {
            yield calls.delete(endpoints.FORUM_TOPIC_PIN(channelID, topicID), this.token);
        });
    }
    /** Locks a forum topic */
    lockTopic(channelID, topicID) {
        return __awaiter(this, void 0, void 0, function* () {
            yield calls.put(endpoints.FORUM_TOPIC_LOCK(channelID, topicID), this.token, {});
        });
    }
    /** Unlocks a forum topic */
    unlockTopic(channelID, topicID) {
        return __awaiter(this, void 0, void 0, function* () {
            yield calls.delete(endpoints.FORUM_TOPIC_LOCK(channelID, topicID), this.token);
        });
    }
    // docs
    /** Create a doc in a specified 'docs' channel. */
    createDoc(channelID, options) {
        return __awaiter(this, void 0, void 0, function* () {
            let response = yield calls.post(endpoints.CHANNEL_DOCS(channelID), this.token, options);
            return new Doc_1.Doc(response.data.doc, this);
        });
    }
    /** Edit a doc from a specified 'docs' channel. */
    editDoc(channelID, docID, options) {
        return __awaiter(this, void 0, void 0, function* () {
            let response = yield calls.put(endpoints.CHANNEL_DOC(channelID, docID), this.token, options);
            return new Doc_1.Doc(response.data.doc, this);
        });
    }
    /** Delete a doc from a specified 'docs' channel. */
    deleteDoc(channelID, docID) {
        return __awaiter(this, void 0, void 0, function* () {
            yield calls.delete(endpoints.CHANNEL_DOC(channelID, docID), this.token);
        });
    }
    // calendar events
    /** Create an event into a calendar channel. */
    createCalendarEvent(channelID, options) {
        return __awaiter(this, void 0, void 0, function* () {
            let response = yield calls.post(endpoints.CHANNEL_EVENTS(channelID), this.token, options);
            return new CalendarEvent_1.CalendarEvent(response.data.calendarEvent, this);
        });
    }
    /** Edit an event from a calendar channel. */
    editCalendarEvent(channelID, eventID, options) {
        return __awaiter(this, void 0, void 0, function* () {
            if (options.duration && typeof options.duration == 'number')
                options.duration = options.duration / 60000; // ms to min.
            let response = yield calls.patch(endpoints.CHANNEL_EVENT(channelID, eventID), this.token, options);
            return new CalendarEvent_1.CalendarEvent(response.data.calendarEvent, this);
        });
    }
    /** Delete an event from a calendar channel. */
    deleteCalendarEvent(channelID, eventID) {
        return __awaiter(this, void 0, void 0, function* () {
            yield calls.delete(endpoints.CHANNEL_EVENT(channelID, eventID), this.token);
        });
    }
    /** Add/Edit a RSVP in a calendar event. */
    editCalendarRsvp(channelID, eventID, memberID, options) {
        return __awaiter(this, void 0, void 0, function* () {
            if (typeof options !== 'object')
                throw new TypeError('options should be an object.');
            let response = yield calls.put(endpoints.CHANNEL_EVENT_RSVP(channelID, eventID, memberID), this.token, options);
            return new CalendarRSVP_1.CalendarEventRSVP(response.data.calendarEventRsvp, this);
        });
    }
    /** Delete a RSVP from a calendar event. */
    deleteCalendarRsvp(channelID, eventID, memberID) {
        return __awaiter(this, void 0, void 0, function* () {
            yield calls.delete(endpoints.CHANNEL_EVENT_RSVP(channelID, eventID, memberID), this.token);
        });
    }
    // list item
    /** Create a new item in a list channel. */
    createListItem(channelID, content, note) {
        return __awaiter(this, void 0, void 0, function* () {
            let response = yield calls.post(endpoints.LIST_ITEMS(channelID), this.token, { message: content, note });
            return new ListItem_1.ListItem(response.data.listItem, this);
        });
    }
    /** Edit a specific item from a list channel. */
    editListItem(channelID, itemID, content, note) {
        return __awaiter(this, void 0, void 0, function* () {
            let response = yield calls.put(endpoints.LIST_ITEM(channelID, itemID), this.token, { message: content, note });
            return new ListItem_1.ListItem(response.data.listItem, this);
        });
    }
    /** Delete a specific item from a list channel. */
    deleteListItem(channelID, itemID) {
        return __awaiter(this, void 0, void 0, function* () {
            yield calls.delete(endpoints.LIST_ITEM(channelID, itemID), this.token);
        });
    }
    /** Complete (checkmark will show up) a specific item from a list channel. */
    completeListItem(channelID, itemID) {
        return __awaiter(this, void 0, void 0, function* () {
            yield calls.post(endpoints.LIST_ITEM_COMPLETE(channelID, itemID), this.token, {});
        });
    }
    /** Uncomplete (checkmark will disappear) a specific item from a list channel. */
    uncompleteListItem(channelID, itemID) {
        return __awaiter(this, void 0, void 0, function* () {
            yield calls.delete(endpoints.LIST_ITEM_COMPLETE(channelID, itemID), this.token);
        });
    }
    // group membership
    /** Add a Guild Member to a Guild Group */
    addGuildMemberGroup(groupID, memberID) {
        return __awaiter(this, void 0, void 0, function* () {
            yield calls.put(endpoints.GUILD_GROUP_MEMBER(groupID, memberID), this.token, {});
        });
    }
    /** Remove a Guild Member from a Guild Group */
    removeGuildMemberGroup(groupID, memberID) {
        return __awaiter(this, void 0, void 0, function* () {
            yield calls.delete(endpoints.GUILD_GROUP_MEMBER(groupID, memberID), this.token);
        });
    }
    //role membership
    /** Add a role to a guild member */
    addGuildMemberRole(guildID, memberID, roleID) {
        return __awaiter(this, void 0, void 0, function* () {
            yield calls.put(endpoints.GUILD_MEMBER_ROLE(guildID, memberID, roleID), this.token, {});
        });
    }
    /** Remove a role from a guild member */
    removeGuildMemberRole(guildID, memberID, roleID) {
        return __awaiter(this, void 0, void 0, function* () {
            yield calls.delete(endpoints.GUILD_MEMBER_ROLE(guildID, memberID, roleID), this.token);
        });
    }
    /** Create a guild webhook */
    createGuildWebhook(guildID, channelID, name) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!guildID)
                throw new TypeError("You need to insert the guild id, guildID is not defined.");
            if (!channelID)
                throw new TypeError("You need to insert a webhook name.");
            if (!channelID)
                throw new TypeError("You need to insert a channelID.");
            let response = yield calls.post(endpoints.GUILD_WEBHOOKS(guildID), this.token, { name: name, channelId: channelID });
            return new Webhook_1.Webhook(response.data.webhook, this);
        });
    }
    /** Update a guild webhook */
    editGuildWebhook(guildID, webhookID, options) {
        return __awaiter(this, void 0, void 0, function* () {
            let response = yield calls.put(endpoints.GUILD_WEBHOOK(guildID, webhookID), this.token, { name: options.name, channelId: options.channelID });
            return new Webhook_1.Webhook(response.data.webhook, this);
        });
    }
    /** Delete a guild webhook */
    deleteGuildWebhook(guildID, webhookID) {
        return __awaiter(this, void 0, void 0, function* () {
            yield calls.delete(endpoints.GUILD_WEBHOOK(guildID, webhookID), this.token);
        });
    }
}
exports.Client = Client;
