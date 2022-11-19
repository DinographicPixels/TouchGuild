/** @module Base */

import type { Client } from "./Client";

/** Default information that every other structure has. */
export abstract class Base {
    /** Bot's client. */
    client!: Client;
    /** Item ID */
    id: string|number;
    constructor(id: string | number, client: Client){
        this.id = id;
        Object.defineProperty(this, "client", {
            value:        client,
            enumerable:   false,
            writable:     false,
            configurable: false
        });
    }
    // eslint-disable-next-line @typescript-eslint/no-empty-function, @typescript-eslint/no-unused-vars
    protected update(data: unknown): void {}
}
