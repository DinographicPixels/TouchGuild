import axios from 'axios';
import fetch from 'node-fetch-commonjs';
import syncfetch from 'sync-fetch';
import { Channel } from './structures/Channel';
import { Guild } from './structures/Guild';
import { Member } from './structures/Member';

import * as endpoints from './rest/endpoints'
import { Client } from './structures/Client';

export class call{
    apiURL: string;
    constructor(){this.apiURL = 'https://www.guilded.gg/api/v1';};
    
    async get(endpoint: string, token: string, queryParams?: string|object, crashOnRejection?: boolean): Promise<object|void>{
        if (!queryParams) queryParams = {}; crashOnRejection = crashOnRejection ?? true;
        var output: object;
        try{
            const response = axios.get(`${this.apiURL}${endpoint}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: "application/json",
                    "Content-type": "application/json"
                },
                params: queryParams
            })
            output = await response;
            return output;
        }catch(err:any){
            if (crashOnRejection == false){
                console.log(err['response' as keyof object]['data' as keyof object])
            }else{
                throw TypeError(JSON.stringify(err.response.data));
            }
            return;
        }
    }

    async post(endpoint: string, token: string, data: string|object, crashOnRejection?: boolean): Promise<object|void>{
        var output: object|void;
        crashOnRejection = crashOnRejection ?? true;
        if (typeof data == 'object') data = JSON.stringify(data);
        if (!endpoint) throw new TypeError('Request endpoint is required.')
        if (!token) throw new TypeError('Token is required.')
        if (!data) throw new TypeError(`Calls/post: Data can't be empty.`);
        try{
            const response = axios.post(`${this.apiURL}${endpoint}`, data, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: "application/json",
                    "Content-type": "application/json"
                }
            })
            output = await response; return output;
        }catch(err:any){
            if (crashOnRejection == false){
                console.log(err['response' as keyof object]['data' as keyof object])
            }else{
                throw TypeError(JSON.stringify(err.response.data));
            }
            return;
        }
    }

    async put(endpoint: string, token: string, data: string|object, crashOnRejection?: boolean): Promise<object|void>{
        var output: object;
        crashOnRejection = crashOnRejection ?? true;
        if (typeof data == 'object') data = JSON.stringify(data);
        if (!endpoint) throw new TypeError('Request endpoint is required.')
        if (!token) throw new TypeError('Token is required.')
        if (!data) throw new TypeError(`Calls/put: Data can't be empty.`);
        
        // axios.interceptors.response.use(
        //     response => response,
        //     error => this.errManager(crashOnRejection, error)
        // );
        try{
            const response = await axios.put(`${this.apiURL}${endpoint}`, data, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: "application/json",
                    "Content-type": "application/json"
                }
            })
            return response;
        }catch(e:any){
            if (crashOnRejection == false){
                console.log(e.response.data);
            }else if (crashOnRejection == true){
                throw TypeError(JSON.stringify(e.response.data));
            }
        }
    }

    async patch(endpoint: string, token: string, data: string|object, crashOnRejection?: boolean): Promise<object|void>{
        var output: object;
        crashOnRejection = crashOnRejection ?? true;
        if (typeof data == 'object') data = JSON.stringify(data);
        if (!endpoint) throw new TypeError('Request endpoint is required.')
        if (!token) throw new TypeError('Token is required.')
        if (!data) throw new TypeError(`Calls/patch: Data can't be empty.`);
        try{
            const response = axios.patch(`${this.apiURL}${endpoint}`, data, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: "application/json",
                    "Content-type": "application/json"
                }
            })
            output=await response; return output;
        }catch(err: any){
            if (crashOnRejection == false){
                console.log(err['response' as keyof object]['data' as keyof object])
            }else{
                throw TypeError(JSON.stringify(err.response.data));
            }
            return;
        }
    }
    
    async delete(endpoint: string, token:string, crashOnRejection?: boolean): Promise<object|void>{
        var output: object;
        if (!endpoint) throw new TypeError('Request endpoint is required.')
        if (!token) throw new TypeError('Token is required.')
        try{
            const response = axios.delete(`${this.apiURL}${endpoint}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: "application/json",
                    "Content-type": "application/json"
                }
            })
            output=await response; return output;
        }catch(err: any){
            if (crashOnRejection == false){
                console.log(err['response' as keyof object]['data' as keyof object])
            }else{
                throw TypeError(JSON.stringify(err.response.data));
            }
            return;
        }
    }


    // deprecated.
    async FETCH(method: string, endpoint: string, TOKEN: any, BODY:string|any){
        var fetchparams:object = {
            method: method,
            headers: {
              Authorization: `Bearer ${TOKEN}`,
              Accept: "application/json",
              "Content-type": "application/json"
            },
            protocol: "HTTPS"
        }
        if (method.toUpperCase() !== 'GET' && method.toUpperCase() !== 'HEAD' && BODY){
            Object.assign(fetchparams, {body: BODY});
        }
    
        let fetching = await fetch(`https://www.guilded.gg/api/v1${endpoint}`, fetchparams)
    
        if (method == 'DELETE') return;
        let response:any = await fetching.json();
        if (response.code && response.message) {console.log(response); throw new TypeError(`${response.code} | ${response.message}`)};
        return response;
    }

    SYNCFETCH(method: string, endpoint: string, TOKEN: any, BODY:string|any){
        var fetchparams:object = {
            method: method,
            headers: {
              Authorization: `Bearer ${TOKEN}`,
              Accept: "application/json",
              "Content-type": "application/json"
            }
        }
        if (method.toUpperCase() !== 'GET' && method.toUpperCase() !== 'HEAD' && BODY){
            Object.assign(fetchparams, {body: BODY});
        }
    
        let fetching = syncfetch(`https://www.guilded.gg/api/v1${endpoint}`, fetchparams)
    
        let response:any = fetching.json();
        if (response.code && response.message) {throw new TypeError(`${response.code} | ${response.message}`)};
        return response;
    }

    syncGetChannel(channelID:string, client: Client): Channel{
        let response = this.SYNCFETCH('GET', endpoints.CHANNEL(channelID), client.token, null)
        // let response = SYNCFETCH('GET', `/channels/${channelID}`, this.token, null) [deprecated]
        return new Channel(response.channel, client)
    }

    syncGetMember(guildID: string, memberID: string, client:Client): Member{
        let response = this.SYNCFETCH('GET', endpoints.GUILD_MEMBER(guildID, memberID), client.token, null)
        // let response = SYNCFETCH('GET', `/channels/${channelID}`, this.token, null) [deprecated]
        return new Member(response.member, client, guildID)
    }

    syncGetGuild(guildID: string, client: Client): Guild{
        let response:any = this.SYNCFETCH('GET', endpoints.GUILD(guildID), client.token, null)
        // let response = SYNCFETCH('GET', `/channels/${channelID}`, this.token, null) [deprecated]
        return new Guild(response.server, client)
    }
}