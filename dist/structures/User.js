"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
class User {
    constructor(data, client) {
        var _a, _b;
        //this.userdata = data.user;  // basically member > user
        //this.fulldata = data // basically the whole data
        this._client = client;
        this.id = data.id;
        this.type = data.type;
        this.username = data.name;
        this._createdAt = Date.parse(data.createdAt);
        this.avatarURL = (_a = data.avatar) !== null && _a !== void 0 ? _a : null;
        this.bannerURL = (_b = data.banner) !== null && _b !== void 0 ? _b : null;
        if (!this.type)
            this.type = 'user'; // since it's only defined when it's a bot..
        if (this.type == 'bot') {
            this.bot = true;
        }
        else {
            this.bot = false;
        }
    }
    get createdAt() {
        return new Date(this._createdAt);
    }
}
exports.User = User;
