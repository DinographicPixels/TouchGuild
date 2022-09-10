import { Client } from './Client';
import { Channel } from './Channel';
import { User } from './User';
import { Guild } from './Guild';
import { call } from '../Utils';
import * as endpoints from '../rest/endpoints';

/** Guild Member component, with all its methods and declarations. */
export class Member extends User {
    /** Timestamp (unix epoch time) of when the member joined the server. */
    _joinedAt: number | null
    /** Array of member's roles. */
    roles: Array<number>; 
    /** Member's server nickname. */
    nickname: string|any; 
    /** Tells you if the member is the server owner. */
    isOwner:boolean; 
    /** Server ID. */
    guildID: string; // member
    private _data: any;
    constructor(data: any, client:Client, guildID: string){
        super(data.user, client);
        this.roles = data.roleIds ?? null;
        this.nickname = data.nickname ?? null;
        this._joinedAt = data.joinedAt ? Date.parse(data.joinedAt): null;
        this.isOwner = data.isOwner ?? false;
        this.guildID = guildID;
    }

    /** returns a Guild component with all its method and declaration. */
    get guild(): Guild{
        return new call().syncGetGuild(this.guildID, this._client) as Guild
    }

    /** string representation of the _joinedAt timestamp. */
    get joinedAt(): Date|number|null{
        return this._joinedAt ? new Date(this._joinedAt): null;
    }

    /** User component. */
    get user(): User{
        return new User(this._data.user, this._client);
    }

    /** Get a specific member's social link. */
    async getSocialLink(socialMediaName: string): Promise<socialLinkTypes|void>{
        let response = await new call().get(endpoints.GUILD_MEMBER_SOCIALS(this.guildID, this.id, socialMediaName), this._client.token, undefined, false);
        if (response){
            const rawsLink:any = response['data' as keyof object]['socialLink' as keyof object];
            var outputsLink = { memberUsername: rawsLink.handle, serviceID: rawsLink.serviceId, type: rawsLink.type };
            return outputsLink as socialLinkTypes;
        }
    }

    /** Add Member to a Guild Group */
    async addToGroup(groupID: string): Promise<void>{
        await new call().put(endpoints.GUILD_GROUP_MEMBER(groupID, this.id), this._client.token, {});
    }

    /** Remove Member from a Guild Group */
    async removeFromGroup(groupID: string): Promise<void>{
        await new call().delete(endpoints.GUILD_GROUP_MEMBER(groupID, this.id), this._client.token);
    }

    //role membership
    /** Add a role to member */
    async addRole(roleID: number): Promise<void>{
        await new call().put(endpoints.GUILD_MEMBER_ROLE(this.guildID, this.id, roleID), this._client.token, {});
    }

    /** Remove a role from member */
    async removeRole(roleID: number): Promise<void>{
        await new call().delete(endpoints.GUILD_MEMBER_ROLE(this.guildID, this.id, roleID), this._client.token);
    }
}

/** social link types */
export type socialLinkTypes = {
    memberUsername: string,
    serviceID: string,
    type: string
}