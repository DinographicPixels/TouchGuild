"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MemberRoleUpdateInfo = exports.MemberUpdateInfo = exports.MemberRemoveInfo = exports.GuildHandler = void 0;
const BannedMember_1 = require("../../structures/BannedMember");
const Member_1 = require("../../structures/Member");
const GatewayEventHandler_1 = require("./GatewayEventHandler");
const Utils_1 = require("../../Utils");
const calls = new Utils_1.call();
class GuildHandler extends GatewayEventHandler_1.GatewayEventHandler {
    guildBanAdd(data) {
        var GuildMemberBanComponent = new BannedMember_1.BannedMember(data, this.client);
        this.client.emit('guildBanAdd', GuildMemberBanComponent);
    }
    guildBanRemove(data) {
        var GuildMemberBanComponent = new BannedMember_1.BannedMember(data, this.client);
        this.client.emit('guildBanRemove', GuildMemberBanComponent);
    }
    guildMemberAdd(data) {
        var MemberComponent = new Member_1.Member(data['member'], this.client, data['serverId']);
        this.client.emit('guildMemberAdd', MemberComponent);
    }
    guildMemberRemove(data) {
        var output = new MemberRemoveInfo(data, this.client);
        this.client.emit('guildMemberRemove', output);
    }
    guildMemberUpdate(data) {
        var output = new MemberUpdateInfo(data, this.client);
        this.client.emit('guildMemberUpdate', output);
    }
    guildMemberRoleUpdate(data) {
        var output = new MemberRoleUpdateInfo(data, this.client);
        this.client.emit('guildMemberRoleUpdate', output);
    }
}
exports.GuildHandler = GuildHandler;
class MemberRemoveInfo {
    constructor(data, client) {
        this._client = client;
        this.guildID = data['serverId'];
        this.userID = data['userId'];
        this.isKick = data['isKick'];
        this.isBan = data['isBan'];
    }
    get guild() {
        return calls.syncGetGuild(this.guildID, this._client);
    }
    get member() {
        return calls.syncGetMember(this.guildID, this.userID, this._client);
    }
}
exports.MemberRemoveInfo = MemberRemoveInfo;
class MemberUpdateInfo {
    constructor(data, client) {
        this._client = client;
        this.guildID = data.serverId;
        this.userID = data.userInfo.id,
            this.updatedNickname = data.userInfo.nickname;
    }
    get member() {
        return calls.syncGetMember(this.guildID, this.userID, this._client);
    }
    get guild() {
        return calls.syncGetGuild(this.guildID, this._client);
    }
}
exports.MemberUpdateInfo = MemberUpdateInfo;
class MemberRoleUpdateInfo {
    constructor(data, client) {
        var _a, _b;
        this._client = client;
        this.guildID = data.serverId;
        this.userID = data.memberRoleIds[0].userId,
            this.roles = data.memberRoleIds[0].roleIds;
        this.oldRoles = (_b = (_a = this._client.cache.get(`guildMember_${this.userID}`)) === null || _a === void 0 ? void 0 : _a['roles']) !== null && _b !== void 0 ? _b : null;
        this.updateCache.bind(this);
        this.updateCache();
    }
    get guild() {
        return calls.syncGetGuild(this.guildID, this._client);
    }
    get member() {
        return calls.syncGetMember(this.guildID, this.userID, this._client);
    }
    updateCache() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this._client.cache.has(`guildMember_${this.userID}`)) {
                if (!this.roles)
                    return;
                let component = yield this._client.cache.get(`guildMember_${this.userID}`);
                component.roles = this.roles;
                yield this._client.cache.set(`guildMember_${this.userID}`, component);
            }
        });
    }
}
exports.MemberRoleUpdateInfo = MemberRoleUpdateInfo;
