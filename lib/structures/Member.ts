import { Client } from "./Client";
import { User } from "./User";
import { Guild } from "./Guild";
import * as endpoints from "../rest/endpoints";
import { socialLinkTypes } from "../tg-types/types";
import { APIGuildMember, GETGuildMemberSocialsResponse } from "guildedapi-types.ts/v1";

/** Guild Member component, with all its methods and declarations. */
export class Member extends User {
    /** Timestamp (unix epoch time) of when the member joined the server. */
    _joinedAt: number | null;
    /** Array of member's roles. */
    roles: Array<number>;
    /** Member's server nickname. */
    nickname: string | null;
    /** Tells you if the member is the server owner. */
    isOwner: boolean;
    /** Server ID. */
    guildID: string; // member
    private _data: APIGuildMember;
    constructor(data: APIGuildMember, client: Client, guildID: string){
        super(data.user, client);
        this._data = data;
        this.roles = data.roleIds ?? null;
        this.nickname = data.nickname ?? null;
        this._joinedAt = data.joinedAt ? Date.parse(data.joinedAt) : null;
        this.isOwner = data.isOwner ?? false;
        this.guildID = guildID;
    }

    /** returns a Guild component with all its method and declaration. */
    get guild(): Guild{
        return this._client.calls.syncGetGuild(this.guildID, this._client) as Guild;
    }

    /** string representation of the _joinedAt timestamp. */
    get joinedAt(): Date|number|null{
        return this._joinedAt ? new Date(this._joinedAt) : null;
    }

    /** User component. */
    get user(): User{
        return new User(this._data.user, this._client);
    }

    /** Get a specific member's social link. */
    async getSocialLink(socialMediaName: string): Promise<socialLinkTypes|void>{
        const response = await this._client.calls.get(endpoints.GUILD_MEMBER_SOCIALS(this.guildID, this.id, socialMediaName), this._client.token, undefined, false);
        if (response){
            const rawsLink: GETGuildMemberSocialsResponse["socialLink"] = response["data" as keyof object]["socialLink" as keyof object];
            const outputsLink = { memberUsername: rawsLink.handle, serviceID: rawsLink.serviceId, type: rawsLink.type };
            return outputsLink as socialLinkTypes;
        }
    }

    /** Add Member to a Guild Group */
    async addToGroup(groupID: string): Promise<void>{
        await this._client.calls.put(endpoints.GUILD_GROUP_MEMBER(groupID, this.id), this._client.token, {});
    }

    /** Remove Member from a Guild Group */
    async removeFromGroup(groupID: string): Promise<void>{
        await this._client.calls.delete(endpoints.GUILD_GROUP_MEMBER(groupID, this.id), this._client.token);
    }

    // role membership
    /** Add a role to member */
    async addRole(roleID: number): Promise<void>{
        await this._client.calls.put(endpoints.GUILD_MEMBER_ROLE(this.guildID, this.id, roleID), this._client.token, {});
    }

    /** Remove a role from member */
    async removeRole(roleID: number): Promise<void>{
        await this._client.calls.delete(endpoints.GUILD_MEMBER_ROLE(this.guildID, this.id, roleID), this._client.token);
    }

    /** Awards member using the built-in EXP system. */
    async award(xpAmount: number): Promise<number>{
        if (typeof xpAmount !== "number") throw new TypeError("xpAmount needs to be an integer/number.");
        const response = await this._client.calls.post(endpoints.GUILD_MEMBER_XP(this.guildID, this.id), this._client.token, { amount: xpAmount });
        return response["total" as keyof object] as number;
    }

    /** Sets member's xp using the built-in EXP system. */
    async setXP(xpAmount: number): Promise<number>{
        const response = await this._client.calls.put(endpoints.GUILD_MEMBER_XP(this.guildID, this.id), this._client.token, { total: xpAmount });
        return response["total" as keyof object] as number;
    }

}
