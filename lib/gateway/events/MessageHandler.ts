import { Message } from "../../structures/Message";
import { GatewayEventHandler } from "./GatewayEventHandler";

export class MessageHandler extends GatewayEventHandler{
    messageCreate(data: object){
        var MessageComponent = new Message(data, this.client)
        this.client.cache.set(`messageContent_${MessageComponent['id' as keyof object]}`, MessageComponent['content' as keyof object])
        return this.client.emit('messageCreate', MessageComponent)
    }

    messageUpdate(data: object){
        var MessageComponent = new Message(data, this.client)
        var cacheHasOldContent = this.client.cache.has(`messageContent_${MessageComponent['id' as keyof object]}`)
        if (cacheHasOldContent){
            MessageComponent.oldContent = this.client.cache.get(`messageContent_${MessageComponent['id' as keyof object]}`)
            this.client.cache.set(`messageContent_${MessageComponent['id' as keyof object]}`, MessageComponent['content' as keyof object])
        }
        return this.client.emit('messageUpdate', MessageComponent)
    }

    messageDelete(data: object){
        var MessageComponent = new Message(data, this.client)
        var cacheHasContent = this.client.cache.has(`messageContent_${MessageComponent['id' as keyof object]}`)
        if (cacheHasContent){
            this.client.cache.delete(`messageContent_${MessageComponent['id' as keyof object]}`);
        }
        return this.client.emit('messageDelete', MessageComponent)
    }
}