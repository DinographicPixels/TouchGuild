/** @module MemberUpdateInfo */
import { Client } from "./Client";
import { MemberInfo } from "./MemberInfo";
import { GatewayEvent_ServerMemberUpdated as GWMUpdated, GatewayEvent_ServerRolesUpdated as GWRolesUpdated } from "../Constants";

/** Information about an updated member. */
export class MemberUpdateInfo extends MemberInfo {
    /** New member's nickname, if updated.
     * The value is null if the new nickname is the same as the username,
     * or if nickname hasn't been updated.
     */
    updatedNickname: string | null;
    /** List of member's roles.
     * The value is null if no role has been updated.
     */
    roles: Array<number> | null;
    /** List of member's old roles.
     * The value is null if the old roles aren't cached
     * or if no role has been updated.
     */
    oldRoles: Array<number> | null;

    /**
     * @param data raw data.
     * @param memberID ID of the member.
     * @param client client.
     */
    constructor(data: GWMUpdated | GWRolesUpdated, memberID: string, client: Client){
        super(data, memberID, client);
        this.updatedNickname = (data as GWMUpdated)?.userInfo?.nickname ?? null;
        this.roles = (data as GWRolesUpdated)?.memberRoleIds?.[0]?.roleIds ?? null;
        this.oldRoles = (this.client.cache.members.get(this.memberID))?.roles ?? null;
        this.updateCache.bind(this)();
    }

    private updateCache(): void {
        const CachedMember = this.client.cache.members.get(this.memberID);
        if (CachedMember){
            if (!this.roles) return;
            CachedMember.roles = this.roles;
            this.client.cache.members.add(CachedMember);
        }
    }
}
