import type { Client } from "../../structures/Client";

export abstract class GatewayEventHandler {
    constructor(readonly client: Client) {}
}
