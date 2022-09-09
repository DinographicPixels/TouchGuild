"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BannedMember = void 0;
const User_1 = require("./User");
const Utils_1 = require("../Utils");
const calls = new Utils_1.call();
class BannedMember extends User_1.User {
    constructor(data, client) {
        super(data.serverMemberBan, client);
        this.guildID = data.serverId;
        this.ban = {
            reason: data.serverMemberBan.reason,
            createdAt: data.serverMemberBan.createdAt ? Date.parse(data.serverMemberBan.createdAt) : null,
            createdBy: data.serverMemberBan.createdBy
        };
        this.user = {
            id: data.serverMemberBan.user.id,
            type: data.serverMemberBan.user.type,
            username: data.serverMemberBan.user.name
        };
    }
    /** Guild/server component */
    get guild() {
        return calls.syncGetGuild(this.guildID, this._client);
    }
}
exports.BannedMember = BannedMember;
