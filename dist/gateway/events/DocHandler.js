"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DocHandler = void 0;
const Doc_1 = require("../../structures/Doc");
const GatewayEventHandler_1 = require("./GatewayEventHandler");
class DocHandler extends GatewayEventHandler_1.GatewayEventHandler {
    docCreate(data) {
        var DocComponent = new Doc_1.Doc(data['docs'], this.client);
        this.client.emit('docCreate', DocComponent);
    }
    docUpdate(data) {
        var DocComponent = new Doc_1.Doc(data['docs'], this.client);
        this.client.emit('docUpdate', DocComponent);
    }
    docDelete(data) {
        var DocComponent = new Doc_1.Doc(data['docs'], this.client);
        this.client.emit('docDelete', DocComponent);
    }
}
exports.DocHandler = DocHandler;
