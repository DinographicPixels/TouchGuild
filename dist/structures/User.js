"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
class User {
    constructor(data, client) {
        //this.userdata = data.user;  // basically member > user
        //this.fulldata = data // basically the whole data
        this.client = client;
        this.id = data.user.id;
        this.type = data.user.type;
        this.username = data.user.name;
        this.createdAt = data.user.createdAt;
        this.avatar = data.user.avatar;
        this.banner = data.user.banner;
        if (!this.type)
            this.type = 'user'; // since it's only defined when it's a bot..
        if (this.type == 'bot') {
            this.bot = true;
        }
        else {
            this.bot = false;
        }
    }
}
exports.User = User;
