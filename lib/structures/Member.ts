/** @module Member */
import { Client } from "./Client";
import { User } from "./User";
import { Guild } from "./Guild";
import { socialLinkTypes } from "../types/types";
import { APIGuildMember } from "../Constants";

/** Represents a guild user. */
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
    /**
     * @param data raw data.
     * @param client client.
     * @param guildID ID of the guild.
     */
    constructor(data: APIGuildMember, client: Client, guildID: string){
        super(data.user, client);
        this._data = data;
        this.roles = data.roleIds ?? null;
        this.nickname = data.nickname ?? null;
        this._joinedAt = data.joinedAt ? Date.parse(data.joinedAt) : null;
        this.isOwner = data.isOwner ?? false;
        this.guildID = guildID;
    }

    /** Guild where the user comes from, returns Guild or a promise.
     * If guild isn't cached & the request failed, this will return you undefined.
     */
    get guild(): Guild | Promise<Guild> {
        return this.client.cache.guilds.get(this.guildID) ?? this.client.rest.guilds.getGuild(this.guildID);
    }

    /** String representation of the _joinedAt timestamp. */
    get joinedAt(): Date|number|null{
        return this._joinedAt ? new Date(this._joinedAt) : null;
    }

    /** Member's user, shows less information. */
    get user(): User{
        return new User(this._data.user, this.client);
    }

    /** Get a specified social link from the member, if member is connected to them through Guilded.
     * @param socialMediaName Name of a social media linked to this member.
     */
    async getSocialLink(socialMediaName: string): Promise<socialLinkTypes|void>{
        return this.client.rest.misc.getSocialLink(this.guildID, this.id as string, socialMediaName);
    }

    /** Add this member to a guild group.
     * @param groupID ID of the guild group.
     */
    async addToGroup(groupID: string): Promise<void>{
        return this.client.rest.guilds.memberAddGroup(groupID, this.id as string);
    }

    /** Remove this member from a guild group.
     * @param groupID ID of the guild group.
     */
    async removeFromGroup(groupID: string): Promise<void>{
        return this.client.rest.guilds.memberRemoveGroup(groupID, this.id as string);
    }

    /** Add a role to this member.
     * @param roleID ID of the role to be added.
     */
    async addRole(roleID: number): Promise<void>{
        return this.client.rest.guilds.memberAddRole(this.guildID, this.id as string, roleID);
    }

    /** Remove a role from this member.
     * @param roleID ID of the role to be added.
     */
    async removeRole(roleID: number): Promise<void>{
        return this.client.rest.guilds.memberRemoveRole(this.guildID, this.id as string, roleID);
    }

    /** Award the member using the built-in EXP system.
     * @param amount Amount of experience to give.
     */
    async award(amount: number): Promise<number>{
        return this.client.rest.guilds.awardMember(this.guildID, this.id as string, amount);
    }

    /** Set member's experience using the built-in EXP system.
     * @param amount Amount of experience to set.
     */
    async setXP(amount: number): Promise<number>{
        return this.client.rest.guilds.setMemberXP(this.guildID, this.id as string, amount);
    }
}

