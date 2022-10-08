"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.Member = void 0;
const User_1 = require("./User");
const Utils_1 = require("../Utils");
const endpoints = __importStar(require("../rest/endpoints"));
/** Guild Member component, with all its methods and declarations. */
class Member extends User_1.User {
    constructor(data, client, guildID) {
        var _a, _b, _c;
        super(data.user, client);
        this.roles = (_a = data.roleIds) !== null && _a !== void 0 ? _a : null;
        this.nickname = (_b = data.nickname) !== null && _b !== void 0 ? _b : null;
        this._joinedAt = data.joinedAt ? Date.parse(data.joinedAt) : null;
        this.isOwner = (_c = data.isOwner) !== null && _c !== void 0 ? _c : false;
        this.guildID = guildID;
    }
    /** returns a Guild component with all its method and declaration. */
    get guild() {
        return new Utils_1.call().syncGetGuild(this.guildID, this._client);
    }
    /** string representation of the _joinedAt timestamp. */
    get joinedAt() {
        return this._joinedAt ? new Date(this._joinedAt) : null;
    }
    /** User component. */
    get user() {
        return new User_1.User(this._data.user, this._client);
    }
    /** Get a specific member's social link. */
    getSocialLink(socialMediaName) {
        return __awaiter(this, void 0, void 0, function* () {
            let response = yield new Utils_1.call().get(endpoints.GUILD_MEMBER_SOCIALS(this.guildID, this.id, socialMediaName), this._client.token, undefined, false);
            if (response) {
                const rawsLink = response['data']['socialLink'];
                var outputsLink = { memberUsername: rawsLink.handle, serviceID: rawsLink.serviceId, type: rawsLink.type };
                return outputsLink;
            }
        });
    }
    /** Add Member to a Guild Group */
    addToGroup(groupID) {
        return __awaiter(this, void 0, void 0, function* () {
            yield new Utils_1.call().put(endpoints.GUILD_GROUP_MEMBER(groupID, this.id), this._client.token, {});
        });
    }
    /** Remove Member from a Guild Group */
    removeFromGroup(groupID) {
        return __awaiter(this, void 0, void 0, function* () {
            yield new Utils_1.call().delete(endpoints.GUILD_GROUP_MEMBER(groupID, this.id), this._client.token);
        });
    }
    //role membership
    /** Add a role to member */
    addRole(roleID) {
        return __awaiter(this, void 0, void 0, function* () {
            yield new Utils_1.call().put(endpoints.GUILD_MEMBER_ROLE(this.guildID, this.id, roleID), this._client.token, {});
        });
    }
    /** Remove a role from member */
    removeRole(roleID) {
        return __awaiter(this, void 0, void 0, function* () {
            yield new Utils_1.call().delete(endpoints.GUILD_MEMBER_ROLE(this.guildID, this.id, roleID), this._client.token);
        });
    }
    /** Awards member using the built-in EXP system. */
    award(xpAmount) {
        return __awaiter(this, void 0, void 0, function* () {
            if (typeof xpAmount !== 'number')
                throw new TypeError("xpAmount needs to be an integer/number.");
            let response = yield new Utils_1.call().post(endpoints.GUILD_MEMBER_XP(this.guildID, this.id), this._client.token, { amount: xpAmount });
            return response['total'];
        });
    }
    /** Sets member's xp using the built-in EXP system. */
    setXP(xpAmount) {
        return __awaiter(this, void 0, void 0, function* () {
            let response = yield new Utils_1.call().put(endpoints.GUILD_MEMBER_XP(this.guildID, this.id), this._client.token, { total: xpAmount });
            return response['total'];
        });
    }
}
exports.Member = Member;
