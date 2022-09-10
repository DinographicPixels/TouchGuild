import { ListItem } from "../../structures/ListItem";
import { GatewayEventHandler } from "./GatewayEventHandler";

export class ListItemHandler extends GatewayEventHandler{
    listItemCreate(data: object){
        var ListItemComponent = new ListItem(data['listItem' as keyof object], this.client)
        this.client.emit('listItemCreate', ListItemComponent)
    }

    listItemUpdate(data: object){
        var ListItemComponent = new ListItem(data['listItem' as keyof object], this.client)
        this.client.emit('listItemUpdate', ListItemComponent)
    }

    listItemDelete(data: object){
        var ListItemComponent = new ListItem(data['listItem' as keyof object], this.client)
        this.client.emit('listItemDelete', ListItemComponent)
    }

    listItemComplete(data: object){
        var ListItemComponent = new ListItem(data['listItem' as keyof object], this.client)
        this.client.emit('listItemComplete', ListItemComponent)
    }

    listItemUncomplete(data: object){
        var ListItemComponent = new ListItem(data['listItem' as keyof object], this.client)
        this.client.emit('listItemUncomplete', ListItemComponent)
    }
}