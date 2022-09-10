"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListItemHandler = void 0;
const ListItem_1 = require("../../structures/ListItem");
const GatewayEventHandler_1 = require("./GatewayEventHandler");
class ListItemHandler extends GatewayEventHandler_1.GatewayEventHandler {
    listItemCreate(data) {
        var ListItemComponent = new ListItem_1.ListItem(data['listItem'], this.client);
        this.client.emit('listItemCreate', ListItemComponent);
    }
    listItemUpdate(data) {
        var ListItemComponent = new ListItem_1.ListItem(data['listItem'], this.client);
        this.client.emit('listItemUpdate', ListItemComponent);
    }
    listItemDelete(data) {
        var ListItemComponent = new ListItem_1.ListItem(data['listItem'], this.client);
        this.client.emit('listItemDelete', ListItemComponent);
    }
    listItemComplete(data) {
        var ListItemComponent = new ListItem_1.ListItem(data['listItem'], this.client);
        this.client.emit('listItemComplete', ListItemComponent);
    }
    listItemUncomplete(data) {
        var ListItemComponent = new ListItem_1.ListItem(data['listItem'], this.client);
        this.client.emit('listItemUncomplete', ListItemComponent);
    }
}
exports.ListItemHandler = ListItemHandler;
