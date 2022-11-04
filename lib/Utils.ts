import { Channel } from "./structures/Channel";
import { Member } from "./structures/Member";
import { Client } from "./structures/Client";
import { Guild } from "./structures/Guild";

import * as endpoints from "./rest/endpoints";

import { config as pkgconfig } from "../pkgconfig";
import syncfetch from "sync-fetch";
import fetch from "node-fetch-commonjs";
import axios from "axios";
import { GETChannelResponse, GETGuildMemberResponse, GETGuildResponse } from "guildedapi-types.ts/v1";

export class call {
    apiURL: string; reqUserAgent: string;
    retryInfo = {
        retryCount: 0,
        retryLimit: 3
    };
    constructor(){
        this.apiURL = pkgconfig.GuildedAPI.APIURL ?? "https://www.guilded.gg/api/v1";
        this.reqUserAgent = `TouchGuild ${pkgconfig.branch} (${pkgconfig.version}) Node.JS ${pkgconfig.NodeJSVersion}`;
    }

    async get(endpoint: string, token: string, queryParams?: string|object, crashOnRejection = true): Promise<object|void>{
        if (!queryParams) queryParams = {};
        let output: object;
        try {
            const response = axios.get(`${this.apiURL}${endpoint}`, {
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Accept":        "application/json",
                    "Content-type":  "application/json",
                    "User-Agent":    this.reqUserAgent
                },
                params: queryParams
            });
            output = await response;
            if ((await response).status === 429){
                console.log((await response).config);
                return await this.checknRetry(response, crashOnRejection);
            } else {
                return output;
            }
        } catch (err: unknown){
            if (crashOnRejection === false){
                console.log((err as object)["response" as keyof object]["data" as keyof object]);
            } else {
                throw new TypeError(JSON.stringify((err as object)["response" as keyof object]["data" as keyof object]));
            }
            return;
        }
    }

    private async checknRetry(response: object, crashOnRejection?: boolean): Promise<object | void>{
        // if ((await response).status == 429){
        const sleep = (ms: number): Promise<unknown> => new Promise(r => setTimeout(r, ms));
        if (this.retryInfo.retryCount >= this.retryInfo.retryLimit){
            console.error("Max request retry limit reached.");
            throw new TypeError("Request failed (Max request limit exceeded)");
        }
        const retryAfter = Number(response["headers" as keyof object]["Retry-After"] ?? 30);
        this.retryInfo.retryCount++;
        console.log("Max request rate limit exceeded. Retrying in", retryAfter, `seconds. (${this.retryInfo.retryCount}/${this.retryInfo.retryLimit})`);
        await sleep(10 * 1000);
        const responseConfig = response["config" as keyof object];
        const requrl = (responseConfig["url" as keyof object] as string).split(this.apiURL); const auth = (responseConfig["headers" as keyof object]["Authorization" as keyof object] as string).split("Bearer ") as Array<string>;

        return responseConfig["method" as keyof object] !== "delete" ? await this[responseConfig["method" as keyof object] as "get"|"post"|"put"|"patch"](requrl[1], auth[1], responseConfig["data" as keyof object] ?? responseConfig["params" as keyof object], crashOnRejection) as object : await this[responseConfig["method" as keyof object] as "delete"](requrl[1], auth[1], crashOnRejection) as object;
        // }
    }

    // private async checknRetryLegacy(response: any){
    //     if ((await response).code == 429){
    //         const sleep = (ms: number): Promise<unknown> => new Promise((r) => setTimeout(r, ms));
    //         if (this.retryInfo.retryCount >= this.retryInfo.retryLimit){
    //             console.error('Max request retry limit reached.');
    //             throw new TypeError('Request failed (Max request limit exceeded)');
    //         }
    //         const retryAfter = Number((await response).headers['Retry-After'] ?? 30);
    //         console.log('Max request rate limit exceeded. Retrying in', retryAfter, `seconds. (${this.retryInfo.retryCount}/${this.retryInfo.retryLimit})`);
    //         this.retryInfo.retryCount++; if (this.retryInfo.retryCount == this.retryInfo.retryLimit)
    //         await sleep(retryAfter * 1000);
    //     }
    // }

    // private async resetRetries(){
    //     setTimeout(() => {
    //         this.retryInfo.retryCount = 0;
    //     }, 30* 1000);
    // }

    async post(endpoint: string, token: string, data: string|object, crashOnRejection = true): Promise<object|void>{
        let output: object|void;
        if (typeof data === "object") data = JSON.stringify(data);
        if (!endpoint) throw new TypeError("Request endpoint is required.");
        if (!token) throw new TypeError("Token is required.");
        if (!data) throw new TypeError("Calls/post: Data can't be empty.");
        try {
            const response = axios.post(`${this.apiURL}${endpoint}`, data, {
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Accept":        "application/json",
                    "Content-type":  "application/json",
                    "User-Agent":    this.reqUserAgent
                }
            });
            output = await response;
            if ((await response).status === 429){
                console.log((await response).config);
                return await this.checknRetry(response, crashOnRejection);
            } else {
                return output;
            }
        } catch (err: unknown){
            if (crashOnRejection === false){
                console.log((err as object)["response" as keyof object]["data" as keyof object]);
            } else {
                throw new TypeError(JSON.stringify((err as object)["response" as keyof object]["data" as keyof object]));
            }
            return;
        }
    }

    async put(endpoint: string, token: string, data: string|object, crashOnRejection = true): Promise<object|void>{
        // const output: object;
        if (typeof data === "object") data = JSON.stringify(data);
        if (!endpoint) throw new TypeError("Request endpoint is required.");
        if (!token) throw new TypeError("Token is required.");
        if (!data) throw new TypeError("Calls/put: Data can't be empty.");

        // axios.interceptors.response.use(
        //     response => response,
        //     error => this.errManager(crashOnRejection, error)
        // );
        try {
            const response = await axios.put(`${this.apiURL}${endpoint}`, data, {
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Accept":        "application/json",
                    "Content-type":  "application/json",
                    "User-Agent":    this.reqUserAgent
                }
            });
            if ((response).status === 429){
                console.log((response).config);
                return await this.checknRetry(response, crashOnRejection);
            } else {
                return response;
            }
        } catch (e: unknown){
            if (crashOnRejection === false){
                console.log((e as object)["response" as keyof object]["data" as keyof object]);
            } else if (crashOnRejection === true){
                throw new TypeError(JSON.stringify((e as object)["response" as keyof object]["data" as keyof object]));
            }
        }
    }

    async patch(endpoint: string, token: string, data: string|object, crashOnRejection = true): Promise<object|void>{
        let output: object;
        if (typeof data === "object") data = JSON.stringify(data);
        if (!endpoint) throw new TypeError("Request endpoint is required.");
        if (!token) throw new TypeError("Token is required.");
        if (!data) throw new TypeError("Calls/patch: Data can't be empty.");
        try {
            const response = axios.patch(`${this.apiURL}${endpoint}`, data, {
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Accept":        "application/json",
                    "Content-type":  "application/json",
                    "User-Agent":    this.reqUserAgent
                }
            });
            output = await response;

            if ((await response).status === 429){
                console.log((await response).config);
                return await this.checknRetry(response, crashOnRejection);
            } else {
                return output;
            }
        } catch (err: unknown){
            if (crashOnRejection === false){
                console.log((err as object)["response" as keyof object]["data" as keyof object]);
            } else {
                throw new TypeError(JSON.stringify((err as object)["response" as keyof object]["data" as keyof object]));
            }
            return;
        }
    }

    async delete(endpoint: string, token: string, crashOnRejection?: boolean): Promise<object|void>{
        let output: object;
        if (!endpoint) throw new TypeError("Request endpoint is required.");
        if (!token) throw new TypeError("Token is required.");
        try {
            const response = axios.delete(`${this.apiURL}${endpoint}`, {
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Accept":        "application/json",
                    "Content-type":  "application/json",
                    "User-Agent":    this.reqUserAgent
                }
            });
            output = await response;

            if ((await response).status === 429){
                console.log((await response).config);
                return await this.checknRetry(response, crashOnRejection);
            } else {
                return output;
            }
        } catch (err: unknown){
            if (crashOnRejection === false){
                console.log((err as object)["response" as keyof object]["data" as keyof object]);
            } else {
                throw new TypeError(JSON.stringify((err as object)["response" as keyof object]["data" as keyof object]));
            }
            return;
        }
    }


    // deprecated.
    async FETCH(method: string, endpoint: string, TOKEN: string, BODY: string | object | null): Promise<object | undefined>{
        const fetchparams: object = {
            method,
            headers: {
                "Authorization": `Bearer ${TOKEN}`,
                "Accept":        "application/json",
                "Content-type":  "application/json",
                "User-Agent":    this.reqUserAgent
            },
            protocol: "HTTPS"
        };
        if (method.toUpperCase() !== "GET" && method.toUpperCase() !== "HEAD" && BODY){
            Object.assign(fetchparams, { body: BODY });
        }

        const fetching = await fetch(`https://www.guilded.gg/api/v1${endpoint}`, fetchparams);

        if (method === "DELETE") return;
        const response = await fetching.json() as object;
        if (response["code" as keyof object] && response["message" as keyof object]) {
            console.log(response); throw new TypeError(`${response["code" as keyof object] as string} | ${response["message" as keyof object] as string}`);
        }
        return response as object;
    }

    SYNCFETCH(method: string, endpoint: string, TOKEN: string, BODY: string | object | null): object | undefined{
        const fetchparams: object = {
            method,
            headers: {
                "Authorization": `Bearer ${TOKEN}`,
                "Accept":        "application/json",
                "Content-type":  "application/json",
                "User-Agent":    this.reqUserAgent
            }
        };
        if (method.toUpperCase() !== "GET" && method.toUpperCase() !== "HEAD" && BODY){
            Object.assign(fetchparams, { body: BODY });
        }

        const fetching = syncfetch(`https://www.guilded.gg/api/v1${endpoint}`, fetchparams);

        const response = fetching.json() as object;
        if (response["code" as keyof object] && response["message" as keyof object]) {
            throw new TypeError(`${response["code" as keyof object] as string|number} | ${response["message" as keyof object] as string}`);
        }
        return response;
    }

    syncGetChannel(channelID: string, client: Client): Channel{
        const response = this.SYNCFETCH("GET", endpoints.CHANNEL(channelID), client.token, null) as GETChannelResponse;
        // let response = SYNCFETCH('GET', `/channels/${channelID}`, this.token, null) [deprecated]
        return new Channel(response.channel, client);
    }

    syncGetMember(guildID: string, memberID: string, client: Client): Member{
        const response = this.SYNCFETCH("GET", endpoints.GUILD_MEMBER(guildID, memberID), client.token, null) as GETGuildMemberResponse;
        // let response = SYNCFETCH('GET', `/channels/${channelID}`, this.token, null) [deprecated]
        return new Member(response.member, client, guildID);
    }

    syncGetGuild(guildID: string, client: Client): Guild{
        const response = this.SYNCFETCH("GET", endpoints.GUILD(guildID), client.token, null) as GETGuildResponse;
        // let response = SYNCFETCH('GET', `/channels/${channelID}`, this.token, null) [deprecated]
        return new Guild(response.server, client);
    }
}
