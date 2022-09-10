import { Client } from "../structures/Client";
import { ChannelHandler } from "./events/ChannelHandler";
import { ForumTopicHandler } from "./events/ForumTopicHandler";
import { MessageHandler } from "./events/MessageHandler";
import { GuildHandler } from './events/GuildHandler';
import { WebhookHandler } from "./events/WebhookHandler";
import { DocHandler } from './events/DocHandler';
import { CalendarHandler } from './events/CalendarHandler';
import { ListItemHandler } from "./events/ListItemHandler";

export class GatewayHandler{
    constructor(public readonly client: Client) {}
    messageHandler = new MessageHandler(this.client)
    channelHandler = new ChannelHandler(this.client)
    forumTopicHandler = new ForumTopicHandler(this.client)
    guildHandler = new GuildHandler(this.client)
    webhookHandler = new WebhookHandler(this.client)
    docHandler = new DocHandler(this.client)
    calendarHandler = new CalendarHandler(this.client)
    listItemHandler = new ListItemHandler(this.client)
    
    handleMessage(eventType: string, eventData: object):void {
        if (this.client.identifiers.Message[eventType as keyof object]){
            if (eventData['message' as keyof object]){
                if (eventData['message' as keyof object]['type' as keyof object] == 'system') return; // system sending fake message, haha :)
            }
            if (eventType == 'ChatMessageCreated'){
                this.messageHandler.messageCreate(eventData)
            }else if (eventType == 'ChatMessageUpdated'){
                this.messageHandler.messageUpdate(eventData)
            }else if (eventType == 'ChatMessageDeleted'){
                this.messageHandler.messageDelete(eventData)
            }else if (eventType == 'ChannelMessageReactionCreated'){
                this.messageHandler.messageReactionAdd(eventData)
            }else if (eventType == 'ChannelMessageReactionDeleted'){
                this.messageHandler.messageReactionRemove(eventData)
            }
            return;
        }else if (this.client.identifiers.Channel[eventType as keyof object]){
            if (eventType == 'TeamChannelCreated'){
                this.channelHandler.channelCreate(eventData)
            }else if (eventType == 'TeamChannelUpdated'){
                this.channelHandler.channelUpdate(eventData)
            }else if (eventType == 'TeamChannelDeleted'){
                this.channelHandler.channelDelete(eventData)
            }
            return;
        }else if (this.client.identifiers.ForumTopic[eventType as keyof object]){
            if (eventType == 'ForumTopicCreated'){
                this.forumTopicHandler.topicCreate(eventData)
            }else if (eventType == 'ForumTopicUpdated'){
                this.forumTopicHandler.topicUpdate(eventData)
            }else if (eventType == 'ForumTopicDeleted'){
                this.forumTopicHandler.topicDelete(eventData)
            }else if (eventType == 'ForumTopicPinned'){
                this.forumTopicHandler.topicPin(eventData)
            }else if (eventType == 'ForumTopicUnpinned'){
                this.forumTopicHandler.topicUnpin(eventData)
            }
            return;
        }else if (this.client.identifiers.Guild[eventType as keyof object]){
            //console.log(eventData)
            if (eventType == 'TeamMemberBanned'){
                this.guildHandler.guildBanAdd(eventData)
            }else if (eventType == 'TeamMemberUnbanned'){
                this.guildHandler.guildBanRemove(eventData)
            }else if (eventType == 'TeamMemberJoined'){
                this.guildHandler.guildMemberAdd(eventData)
            }else if (eventType == 'TeamMemberRemoved'){
                this.guildHandler.guildBanRemove(eventData)
            }else if (eventType == 'TeamMemberUpdated'){
                this.guildHandler.guildMemberUpdate(eventData)
            }else if (eventType == 'teamRolesUpdated') {
                console.log(eventData)
                this.guildHandler.guildMemberRoleUpdate(eventData)
            }
            return;
        }else if (this.client.identifiers.Webhook[eventType as keyof object]){
            //console.log(eventData)
            if (eventType == 'TeamWebhookCreated'){
                this.webhookHandler.webhooksCreate(eventData)
            }else if (eventType == 'TeamWebhookUpdated'){
                this.webhookHandler.webhooksUpdate(eventData)
            }
            return;
        }else if (this.client.identifiers.Doc[eventType as keyof object]){
            if (eventType == 'DocCreated'){
                this.docHandler.docCreate(eventData)
            }else if (eventType == 'DocUpdated'){
                this.docHandler.docUpdate(eventData)
            }else if (eventType == 'DocDeleted'){
                this.docHandler.docDelete(eventData)
            }
            return;
        }else if (this.client.identifiers.Calendar[eventType as keyof object]){
            if (eventType == 'CalendarEventCreated'){
                this.calendarHandler.calendarEventCreate(eventData)
            }else if (eventType == 'CalendarEventUpdated'){
                this.calendarHandler.calendarEventUpdate(eventData)
            }else if (eventType == 'CalendarEventDeleted'){
                this.calendarHandler.calendarEventDelete(eventData)
            }else if (eventType == 'CalendarEventRsvpUpdated'){
                this.calendarHandler.calendarRsvpUpdate(eventData)
            }else if (eventType == 'CalendarEventRsvpDeleted'){
                this.calendarHandler.calendarRsvpDelete(eventData)
            }
            return;
            // CalendarEventRsvpManyUpdated.
        }else if (this.client.identifiers.List[eventType as keyof object]){
            if (eventType == 'ListItemCreated'){
                this.listItemHandler.listItemCreate(eventData)
            }else if (eventType == 'ListItemUpdated'){
                this.listItemHandler.listItemUpdate(eventData)
            }else if (eventType == 'ListItemDeleted'){
                this.listItemHandler.listItemDelete(eventData)
            }else if (eventType == 'ListItemCompleted'){
                this.listItemHandler.listItemComplete(eventData)
            }else if (eventType == 'ListItemUncompleted'){
                this.listItemHandler.listItemUncomplete(eventData)
            }
            return;
        }
    }
}