"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MemberHandler = void 0;
const GuildMemberBan_1 = require("../../structures/GuildMemberBan");
const GatewayEventHandler_1 = require("./GatewayEventHandler");
class MemberHandler extends GatewayEventHandler_1.GatewayEventHandler {
    guildBanAdd(data) {
        var GuildMemberBanComponent = new GuildMemberBan_1.GuildMemberBan(data, this.client);
        this.client.emit('guildBanAdd', GuildMemberBanComponent);
    }
    guildBanRemove(data) {
        var GuildMemberBanComponent = new GuildMemberBan_1.GuildMemberBan(data, this.client);
        this.client.emit('guildBanRemove', GuildMemberBanComponent);
    }
}
exports.MemberHandler = MemberHandler;
