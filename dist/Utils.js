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
exports.call = void 0;
const axios_1 = __importDefault(require("axios"));
const node_fetch_commonjs_1 = __importDefault(require("node-fetch-commonjs"));
const sync_fetch_1 = __importDefault(require("sync-fetch"));
const Channel_1 = require("./structures/Channel");
const Guild_1 = require("./structures/Guild");
const Member_1 = require("./structures/Member");
const endpoints = __importStar(require("./rest/endpoints"));
class call {
    constructor() { this.apiURL = 'https://www.guilded.gg/api/v1'; }
    ;
    get(endpoint, token, queryParams, crashOnRejection) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!queryParams)
                queryParams = {};
            crashOnRejection = crashOnRejection !== null && crashOnRejection !== void 0 ? crashOnRejection : true;
            var output;
            try {
                const response = axios_1.default.get(`${this.apiURL}${endpoint}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        Accept: "application/json",
                        "Content-type": "application/json"
                    },
                    params: queryParams
                });
                output = yield response;
                return output;
            }
            catch (err) {
                if (crashOnRejection == false) {
                    console.log(err['response']['data']);
                }
                else {
                    throw TypeError(JSON.stringify(err.response.data));
                }
                return;
            }
        });
    }
    post(endpoint, token, data, crashOnRejection) {
        return __awaiter(this, void 0, void 0, function* () {
            var output;
            crashOnRejection = crashOnRejection !== null && crashOnRejection !== void 0 ? crashOnRejection : true;
            if (typeof data == 'object')
                data = JSON.stringify(data);
            if (!endpoint)
                throw new TypeError('Request endpoint is required.');
            if (!token)
                throw new TypeError('Token is required.');
            if (!data)
                throw new TypeError(`Calls/post: Data can't be empty.`);
            try {
                const response = axios_1.default.post(`${this.apiURL}${endpoint}`, data, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        Accept: "application/json",
                        "Content-type": "application/json"
                    }
                });
                output = yield response;
                return output;
            }
            catch (err) {
                if (crashOnRejection == false) {
                    console.log(err['response']['data']);
                }
                else {
                    throw TypeError(JSON.stringify(err.response.data));
                }
                return;
            }
        });
    }
    put(endpoint, token, data, crashOnRejection) {
        return __awaiter(this, void 0, void 0, function* () {
            var output;
            crashOnRejection = crashOnRejection !== null && crashOnRejection !== void 0 ? crashOnRejection : true;
            if (typeof data == 'object')
                data = JSON.stringify(data);
            if (!endpoint)
                throw new TypeError('Request endpoint is required.');
            if (!token)
                throw new TypeError('Token is required.');
            if (!data)
                throw new TypeError(`Calls/put: Data can't be empty.`);
            // axios.interceptors.response.use(
            //     response => response,
            //     error => this.errManager(crashOnRejection, error)
            // );
            try {
                const response = yield axios_1.default.put(`${this.apiURL}${endpoint}`, data, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        Accept: "application/json",
                        "Content-type": "application/json"
                    }
                });
                return response;
            }
            catch (e) {
                if (crashOnRejection == false) {
                    console.log(e.response.data);
                }
                else if (crashOnRejection == true) {
                    throw TypeError(JSON.stringify(e.response.data));
                }
            }
        });
    }
    patch(endpoint, token, data, crashOnRejection) {
        return __awaiter(this, void 0, void 0, function* () {
            var output;
            crashOnRejection = crashOnRejection !== null && crashOnRejection !== void 0 ? crashOnRejection : true;
            if (typeof data == 'object')
                data = JSON.stringify(data);
            if (!endpoint)
                throw new TypeError('Request endpoint is required.');
            if (!token)
                throw new TypeError('Token is required.');
            if (!data)
                throw new TypeError(`Calls/patch: Data can't be empty.`);
            try {
                const response = axios_1.default.patch(`${this.apiURL}${endpoint}`, data, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        Accept: "application/json",
                        "Content-type": "application/json"
                    }
                });
                output = yield response;
                return output;
            }
            catch (err) {
                if (crashOnRejection == false) {
                    console.log(err['response']['data']);
                }
                else {
                    throw TypeError(JSON.stringify(err.response.data));
                }
                return;
            }
        });
    }
    delete(endpoint, token, crashOnRejection) {
        return __awaiter(this, void 0, void 0, function* () {
            var output;
            if (!endpoint)
                throw new TypeError('Request endpoint is required.');
            if (!token)
                throw new TypeError('Token is required.');
            try {
                const response = axios_1.default.delete(`${this.apiURL}${endpoint}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        Accept: "application/json",
                        "Content-type": "application/json"
                    }
                });
                output = yield response;
                return output;
            }
            catch (err) {
                if (crashOnRejection == false) {
                    console.log(err['response']['data']);
                }
                else {
                    throw TypeError(JSON.stringify(err.response.data));
                }
                return;
            }
        });
    }
    // deprecated.
    FETCH(method, endpoint, TOKEN, BODY) {
        return __awaiter(this, void 0, void 0, function* () {
            var fetchparams = {
                method: method,
                headers: {
                    Authorization: `Bearer ${TOKEN}`,
                    Accept: "application/json",
                    "Content-type": "application/json"
                },
                protocol: "HTTPS"
            };
            if (method.toUpperCase() !== 'GET' && method.toUpperCase() !== 'HEAD' && BODY) {
                Object.assign(fetchparams, { body: BODY });
            }
            let fetching = yield (0, node_fetch_commonjs_1.default)(`https://www.guilded.gg/api/v1${endpoint}`, fetchparams);
            if (method == 'DELETE')
                return;
            let response = yield fetching.json();
            if (response.code && response.message) {
                console.log(response);
                throw new TypeError(`${response.code} | ${response.message}`);
            }
            ;
            return response;
        });
    }
    SYNCFETCH(method, endpoint, TOKEN, BODY) {
        var fetchparams = {
            method: method,
            headers: {
                Authorization: `Bearer ${TOKEN}`,
                Accept: "application/json",
                "Content-type": "application/json"
            }
        };
        if (method.toUpperCase() !== 'GET' && method.toUpperCase() !== 'HEAD' && BODY) {
            Object.assign(fetchparams, { body: BODY });
        }
        let fetching = (0, sync_fetch_1.default)(`https://www.guilded.gg/api/v1${endpoint}`, fetchparams);
        let response = fetching.json();
        if (response.code && response.message) {
            throw new TypeError(`${response.code} | ${response.message}`);
        }
        ;
        return response;
    }
    syncGetChannel(channelID, client) {
        let response = this.SYNCFETCH('GET', endpoints.CHANNEL(channelID), client.token, null);
        // let response = SYNCFETCH('GET', `/channels/${channelID}`, this.token, null) [deprecated]
        return new Channel_1.Channel(response.channel, client);
    }
    syncGetMember(guildID, memberID, client) {
        let response = this.SYNCFETCH('GET', endpoints.GUILD_MEMBER(guildID, memberID), client.token, null);
        // let response = SYNCFETCH('GET', `/channels/${channelID}`, this.token, null) [deprecated]
        return new Member_1.Member(response.member, client, guildID);
    }
    syncGetGuild(guildID, client) {
        let response = this.SYNCFETCH('GET', endpoints.GUILD(guildID), client.token, null);
        // let response = SYNCFETCH('GET', `/channels/${channelID}`, this.token, null) [deprecated]
        return new Guild_1.Guild(response.server, client);
    }
}
exports.call = call;
