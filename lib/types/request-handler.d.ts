/** @module Types/RequestHandler */
import type { RESTMethod } from "../Constants";
import type { FormData } from "undici";

export interface RequestOptions {
    auth?: boolean | string;
    files?: Array<File>;
    form?: FormData;
    headers?: Record<string, string>;
    json?: unknown;
    method: RESTMethod;
    path: string;
    priority?: boolean;
    query?: URLSearchParams;
    reason?: string;
    route?: string;
    editBaseURL?: string;
}

export interface File {
    /** the contents of the file */
    contents: Buffer;
    /** the name of the file */
    name: string;
}

export interface RawRequest {
    /** the method of the request */
    method: RESTMethod;
    /** the path of the request */
    path: string;
    /** the body sent with the request */
    requestBody: string | FormData | undefined;
    /** the body we received */
    responseBody: Buffer | string | Record<string, unknown> | null;
    /** the name of the route used in the request */
    route: string;
    /** if the request used authorization */
    withAuth: boolean;
}

export interface LatencyRef {
    lastTimeOffsetCheck: number;
    latency: number;
    raw: Array<number>;
    timeOffsets: Array<number>;
    timeoffset: number;
}

