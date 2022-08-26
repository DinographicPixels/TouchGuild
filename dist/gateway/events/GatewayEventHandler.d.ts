import type { Client } from '../../structures/Client';
export declare abstract class GatewayEventHandler {
    readonly client: Client;
    constructor(client: Client);
}
