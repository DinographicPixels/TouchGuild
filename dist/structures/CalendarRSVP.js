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
exports.CalendarEventRSVP = void 0;
const endpoints = __importStar(require("../rest/endpoints"));
const Utils_1 = require("../Utils");
const calls = new Utils_1.call();
class CalendarEventRSVP {
    constructor(data, client) {
        var _a, _b;
        this.data = data;
        this.client = client;
        this.id = data.calendarEventId;
        this.guildID = data.serverId;
        this.channelID = data.channelId;
        this.memberID = data.userId;
        this.status = data.status;
        this.createdBy = (_a = data.createdBy) !== null && _a !== void 0 ? _a : null;
        this.updatedBy = (_b = data.updatedBy) !== null && _b !== void 0 ? _b : null;
        this._createdAt = data.createdAt ? Date.parse(data.createdAt) : null;
    }
    /** Member component from REST (sync). */
    get member() {
        return calls.syncGetMember(this.guildID, this.createdBy, this.client);
    }
    /** string representation of the _createdAt timestamp */
    get createdAt() {
        return this._createdAt ? new Date(this._createdAt) : null;
    }
    /** Edit the calendar rsvp */
    edit(options) {
        return __awaiter(this, void 0, void 0, function* () {
            if (typeof options !== 'object')
                throw new TypeError('options should be an object.');
            let response = yield calls.patch(endpoints.CHANNEL_EVENT_RSVP(this.channelID, this.id, this.memberID), this.client.token, options);
            return new CalendarEventRSVP(response.data.calendarEventRsvp, this.client);
        });
    }
    /** Delete the calendar rsvp */
    delete() {
        return __awaiter(this, void 0, void 0, function* () {
            yield calls.delete(endpoints.CHANNEL_EVENT_RSVP(this.channelID, this.id, this.memberID), this.client.token);
        });
    }
}
exports.CalendarEventRSVP = CalendarEventRSVP;
