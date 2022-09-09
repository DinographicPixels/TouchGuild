"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
class User {
    constructor(data, client) {
        //this.userdata = data.user;  // basically member > user
        //this.fulldata = data // basically the whole data
        this._client = client;
        this.id = data.id;
        this.type = data.type;
        this.username = data.name;
        this._createdAt = Date.parse(data.createdAt);
        this.avatarURL = data.avatar;
        this.bannerURL = data.banner;
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
