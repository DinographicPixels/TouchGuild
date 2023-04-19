import type { Agent } from "undici";

export interface ClientOptions {
    /**
     * The bot's bearer token, needed to connect to the bot.
     */
    token: string;
    /**
     * REST methods are used to communicate with the Guilded by sending requests.
     * You can disable those methods by setting this boolean to `false`.
     * @defaultValue true
     */
    REST?: boolean;
    /**
     * REST Options are used for REST requests. You can change some properties there.
     * This includes some properties like the baseURL and much more.
     */
    RESTOptions?: RESTOptions;

    collectionLimits?: {
        messages?: number;
        threads?: number;
        threadComments?: number;
        docs?: number;
        scheduledEvents?: number;
        scheduledEventsRSVPS?: number;
        calendarComments?: number;
        docComments?: number;
        announcements?: number;
        announcementComments?: number;
    };
}

export interface RESTOptions {
    /**
     * The agent to use for requests.
     * @defaultValue null
     */
    agent?: Agent | null;
    /**
     * The base URL used for requests.
     * @defaultValue
     */
    baseURL?: string;
    /**
     * Built-in latency compensator.
     * @defaultValue false
     */
    disableLatencyCompensation?: boolean;
    /**
     * The `Host` header to use for requests.
     * @defaultValue Parsed from `baseURL`
     */
    host?: string;
    /**
     * In milliseconds, the average request latency at which to start emitting latency errors.
     * @defaultValue 30000
     */
    latencyThreshold?: number;
    /**
     * In milliseconds, the time to offset ratelimit calculations by.
     * @defaultValue 0
     */
    ratelimiterOffset?: number;
    /**
     * In milliseconds, how long to wait until a request is timed out.
     * @defaultValue 15000
     */
    requestTimeout?: number;
    /**
     * User-Agent header to use for requests.
     */
    userAgent?: string;
}
