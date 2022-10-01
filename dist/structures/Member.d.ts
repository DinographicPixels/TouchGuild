import { Client } from './Client';
import { User } from './User';
import { Guild } from './Guild';
import { socialLinkTypes } from '../Types';
/** Guild Member component, with all its methods and declarations. */
export declare class Member extends User {
    /** Timestamp (unix epoch time) of when the member joined the server. */
    _joinedAt: number | null;
    /** Array of member's roles. */
    roles: Array<number>;
    /** Member's server nickname. */
    nickname: string | any;
    /** Tells you if the member is the server owner. */
    isOwner: boolean;
    /** Server ID. */
    guildID: string;
    private _data;
    constructor(data: any, client: Client, guildID: string);
    /** returns a Guild component with all its method and declaration. */
    get guild(): Guild;
    /** string representation of the _joinedAt timestamp. */
    get joinedAt(): Date | number | null;
    /** User component. */
    get user(): User;
    /** Get a specific member's social link. */
    getSocialLink(socialMediaName: string): Promise<socialLinkTypes | void>;
    /** Add Member to a Guild Group */
    addToGroup(groupID: string): Promise<void>;
    /** Remove Member from a Guild Group */
    removeFromGroup(groupID: string): Promise<void>;
    /** Add a role to member */
    addRole(roleID: number): Promise<void>;
    /** Remove a role from member */
    removeRole(roleID: number): Promise<void>;
    /** Awards member using the built-in EXP system. */
    award(xpAmount: number): Promise<Number>;
    /** Sets member's xp using the built-in EXP system. */
    setXP(xp: number): Promise<Number>;
}
