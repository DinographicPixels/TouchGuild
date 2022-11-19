/** @module RESTManager */
import { RequestHandler } from "./RequestHandler";
import type { Client } from "../structures/Client";
import type { RequestOptions } from "../types/request-handler";
import { Guilds } from "../routes/Guilds";
import { Channels } from "../routes/Channels";
import { Miscellaneous } from "../routes/Misc";
import { RESTOptions } from "../types/client";

export class RESTManager {
    client: Client;
    #ws: Client["ws"];
    token: Client["ws"]["token"];
    handler: RequestHandler;
    guilds: Guilds;
    channels: Channels;
    misc: Miscellaneous;
    constructor(client: Client, options?: RESTOptions){
        this.#ws = client.ws;
        this.client = client;
        this.token = this.#ws.token;
        this.handler = new RequestHandler(this, options);
        this.guilds = new Guilds(this);
        this.channels = new Channels(this);
        this.misc = new Miscellaneous(this);
    }

    async authRequest<T = unknown>(options: Omit<RequestOptions, "auth">): Promise<T> {
        return this.handler.authRequest<T>(options);
    }

    async request<T = unknown>(options: RequestOptions): Promise<T> {
        return this.handler.request<T>(options);
    }
}
