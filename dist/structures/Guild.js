"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Guild = void 0;
class Guild {
    constructor(data, client) {
        console.log(data);
        this.client = client;
        this.id = data.server.id;
        this.ownerId = data.server.ownerId;
        this.type = data.server.type;
        this.name = data.server.name;
        this.url = data.server.url;
        this.about = data.server.about; // same but with
        this.description = data.server.about; //   two types.
        this.icon = data.server.avatar;
        this.banner = data.server.banner;
        this.timezone = data.server.timezone;
        this.defaultChannelId = data.server.defaultChannelId;
        this.createdAt = data.server.createdAt;
    }
}
exports.Guild = Guild;
