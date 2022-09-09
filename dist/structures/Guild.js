"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Guild = void 0;
class Guild {
    constructor(data, client) {
        this.client = client;
        this.id = data.id;
        this.ownerID = data.ownerId;
        this.type = data.type;
        this.name = data.name;
        this.url = data.url;
        this.about = data.about; // same but with
        this.description = data.about; //   two types.
        this.iconURL = data.avatar;
        this.bannerURL = data.banner;
        this.timezone = data.timezone;
        this.defaultChannelID = data.defaultChannelId;
        this._createdAt = Date.parse(data.createdAt);
    }
    get createdAt() {
        return new Date(this._createdAt);
    }
}
exports.Guild = Guild;
