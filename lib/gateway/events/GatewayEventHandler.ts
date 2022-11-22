/** @module GatewayEventHandler */
import type { Client } from "../../structures/Client";

/** Internal component, base of every event handlers. */
export abstract class GatewayEventHandler {
    constructor(readonly client: Client) {}
}
