import { Client } from "../structures/Client";
import { ChannelHandler } from "./events/ChannelHandler";
import { MessageHandler } from "./events/MessageHandler";

export class GatewayHandler{
    constructor(public readonly client: Client) {}
    messageHandler = new MessageHandler(this.client)
    channelHandler = new ChannelHandler(this.client)
    
    handleMessage(eventType: string, eventData: object):void {
        if (this.client.identifiers.Message[eventType as keyof object]){
            if (eventType == 'ChatMessageCreated'){
                this.messageHandler.messageCreate(eventData)
            }else if (eventType == 'ChatMessageUpdated'){
                this.messageHandler.messageUpdate(eventData)
            }else if (eventType == 'ChatMessageDeleted'){
                this.messageHandler.messageDelete(eventData)
            }
        }else if (this.client.identifiers.Channel[eventType as keyof object]){
            if (eventType == 'TeamChannelCreated'){
                this.channelHandler.channelCreate(eventData)
            }else if (eventType == 'TeamChannelUpdated'){
                this.channelHandler.channelUpdate(eventData)
            }else if (eventType == 'TeamChannelDeleted'){
                this.channelHandler.channelDelete(eventData)
            }
        }
    }
}