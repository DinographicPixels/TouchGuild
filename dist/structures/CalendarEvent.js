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
Object.defineProperty(exports, "__esModule", { value: true });
exports.CalendarEvent = void 0;
const endpoints = __importStar(require("../rest/endpoints"));
const Utils_1 = require("../Utils");
const calls = new Utils_1.call();
class CalendarEvent {
    constructor(data, client) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
        this.data = data;
        this.client = client;
        this.id = data.id;
        this.guildID = data.serverId;
        this.channelID = data.channelId;
        this.name = (_a = data.name) !== null && _a !== void 0 ? _a : null;
        this.description = (_b = data.description) !== null && _b !== void 0 ? _b : null;
        this.location = (_c = data.location) !== null && _c !== void 0 ? _c : null;
        this.url = (_d = data.url) !== null && _d !== void 0 ? _d : null;
        this.color = (_e = data.color) !== null && _e !== void 0 ? _e : null;
        this.rsvpLimit = (_f = data.rsvpLimit) !== null && _f !== void 0 ? _f : null;
        this._startsAt = data.startsAt ? Date.parse(data.startsAt) : null;
        this.duration = (_g = data.duration * 60000) !== null && _g !== void 0 ? _g : null; // in ms.
        this.isPrivate = (_h = data.isPrivate) !== null && _h !== void 0 ? _h : false;
        this.mentions = (_j = data.mentions) !== null && _j !== void 0 ? _j : null;
        this._createdAt = data.createdAt ? Date.parse(data.createdAt) : null;
        this.memberID = data.createdBy;
        this.cancelation = (_k = data.cancellation) !== null && _k !== void 0 ? _k : null;
    }
    /** Member component. */
    get member() {
        return calls.syncGetMember(this.guildID, this.memberID, this.client);
    }
    /** string representation of the _createdAt timestamp */
    get createdAt() {
        return this._createdAt ? new Date(this._createdAt) : null;
    }
    /** Edit the calendar event */
    edit(options) {
        return __awaiter(this, void 0, void 0, function* () {
            let response = yield calls.patch(endpoints.CHANNEL_EVENT(this.channelID, this.id), this.client.token, options);
            return new CalendarEvent(response.data.calendarEvent, this.client);
        });
    }
    /** Delete the calendar event */
    delete() {
        return __awaiter(this, void 0, void 0, function* () {
            yield calls.delete(endpoints.CHANNEL_EVENT(this.channelID, this.id), this.client.token);
        });
    }
}
exports.CalendarEvent = CalendarEvent;
