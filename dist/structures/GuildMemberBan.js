"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GuildMemberBan = void 0;
const User_1 = require("./User");
class GuildMemberBan extends User_1.User {
    constructor(data, client) {
        super(data.serverMemberBan, client);
        this.guildID = data.serverId;
        this.guild = client.getGuild(this.guildID);
        this.ban = {
            reason: data.serverMemberBan.reason,
            createdAt: data.serverMemberBan.createdAt,
            createdBy: data.serverMemberBan.createdBy
        };
    }
}
exports.GuildMemberBan = GuildMemberBan;
