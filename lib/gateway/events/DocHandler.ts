import { Doc } from "../../structures/Doc";
import { GatewayEventHandler } from "./GatewayEventHandler";

export class DocHandler extends GatewayEventHandler{
    docCreate(data: object){
        var DocComponent = new Doc(data['docs' as keyof object], this.client)
        this.client.emit('docCreate', DocComponent)
    }

    docUpdate(data: object){
        var DocComponent = new Doc(data['docs' as keyof object], this.client)
        this.client.emit('docUpdate', DocComponent)
    }

    docDelete(data: object){
        var DocComponent = new Doc(data['docs' as keyof object], this.client)
        this.client.emit('docDelete', DocComponent)
    }
}