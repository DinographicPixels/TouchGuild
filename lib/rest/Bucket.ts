/** @module Bucket */
/**
 * Credits to Eris & Oceanic.js
 * Edited by PG.
 * https://github.com/abalabahaha/eris/blob/dev/lib/util/Bucket.js
 */

/** A bucket. */
export default class Bucket {
    interval: number;
    lastReset: number;
    lastSend: number;
    latencyRef: { latency: number; };
    #queue: Array<{ priority: boolean; func(): void;}> = [];
    reservedTokens: number;
    timeout: NodeJS.Timeout | null;
    tokenLimit: number;
    tokens: number;
    constructor(tokenLimit: number, interval: number, options?: { latencyRef?: { latency: number; }; reservedTokens?: number; }) {
        this.tokenLimit = tokenLimit;
        this.interval = interval;
        this.latencyRef = options?.latencyRef ?? { latency: 0 };
        this.lastReset = this.tokens = this.lastSend = 0;
        this.reservedTokens = options?.reservedTokens ?? 0;
        this.timeout = null;
    }

    private check(): void {
        if (this.timeout || this.#queue.length === 0) {
            return;
        }
        if (this.lastReset + this.interval + this.tokenLimit * this.latencyRef.latency < Date.now()) {
            this.lastReset = Date.now();
            this.tokens = Math.max(0, this.tokens - this.tokenLimit);
        }

        let val: number;
        let tokensAvailable = this.tokens < this.tokenLimit;
        let unreservedTokensAvailable = this.tokens < (this.tokenLimit - this.reservedTokens);
        while (this.#queue.length !== 0 && (unreservedTokensAvailable || (tokensAvailable && this.#queue[0].priority))) {
            this.tokens++;
            tokensAvailable = this.tokens < this.tokenLimit;
            unreservedTokensAvailable = this.tokens < (this.tokenLimit - this.reservedTokens);
            const item = this.#queue.shift();
            val = this.latencyRef.latency - Date.now() + this.lastSend;
            if (this.latencyRef.latency === 0 || val <= 0) {
                item!.func();
                this.lastSend = Date.now();
            } else {
                setTimeout(() => {
                    item!.func();
                }, val);
                this.lastSend = Date.now() + val;
            }
        }

        if (this.#queue.length !== 0 && !this.timeout) {
            this.timeout = setTimeout(() => {
                this.timeout = null;
                this.check();
            }, this.tokens < this.tokenLimit ? this.latencyRef.latency : Math.max(0, this.lastReset + this.interval + this.tokenLimit * this.latencyRef.latency - Date.now()));
        }


    }

    /**
     * Add an item to the queue.
     * @param func The function to queue.
     * @param priority If true, the item will be added to the front of the queue.
     */
    queue(func: () => void, priority = false): void {
        if (priority) {
            this.#queue.unshift({ func, priority });
        } else {
            this.#queue.push({ func, priority });
        }
        this.check();
    }
}
