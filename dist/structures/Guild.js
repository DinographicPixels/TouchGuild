"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Guild = void 0;
class Guild {
    constructor(data, client) {
        var _a, _b;
        this.client = client;
        this.id = data.id;
        this.ownerID = data.ownerId;
        this.type = data.type;
        this.name = data.name;
        this.url = data.url;
        this.about = data.about; // same but with
        this.description = data.about; //   two types.
        this.iconURL = (_a = data.avatar) !== null && _a !== void 0 ? _a : null;
        this.bannerURL = (_b = data.banner) !== null && _b !== void 0 ? _b : null;
        this.timezone = data.timezone;
        this.defaultChannelID = data.defaultChannelId;
        this._createdAt = Date.parse(data.createdAt);
    }
    get createdAt() {
        return new Date(this._createdAt);
    }
}
exports.Guild = Guild;
