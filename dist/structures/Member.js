"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Member = void 0;
const User_1 = require("./User");
class Member extends User_1.User {
    constructor(data, client) {
        super(data, client);
        this.roleIds = data.roleIds;
        this.nickname = data.nickname;
        this.joinedAt = data.joinedAt;
        this.isOwner = data.isOwner;
        if (!this.isOwner)
            this.isOwner = false; // since it returns undefined when the user isn't the owner
    }
}
exports.Member = Member;
