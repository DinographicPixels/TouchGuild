import { Client } from "../structures/Client";
import { ChannelHandler } from "./events/ChannelHandler";
import { ForumTopicHandler } from "./events/ForumTopicHandler";
import { MessageHandler } from "./events/MessageHandler";
import { GuildHandler } from './events/GuildHandler';
import { WebhookHandler } from "./events/WebhookHandler";
import { DocHandler } from './events/DocHandler';
import { CalendarHandler } from './events/CalendarHandler';
import { ListItemHandler } from "./events/ListItemHandler";
export declare class GatewayHandler {
    readonly client: Client;
    constructor(client: Client);
    messageHandler: MessageHandler;
    channelHandler: ChannelHandler;
    forumTopicHandler: ForumTopicHandler;
    guildHandler: GuildHandler;
    webhookHandler: WebhookHandler;
    docHandler: DocHandler;
    calendarHandler: CalendarHandler;
    listItemHandler: ListItemHandler;
    handleMessage(eventType: string, eventData: object): void;
}
