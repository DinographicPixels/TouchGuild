/** @module MemberInfo */
import type { Client } from "./Client";
import type { Guild } from "./Guild";
import type { Member } from "./Member";
import type { GatewayEvent_ServerMemberUpdated as GWMUpdated, GatewayEvent_ServerRolesUpdated as GWMRolesUpdated, GatewayEvent_ServerMemberRemoved as GWMRemoved } from "../Constants";
import { Uncached } from "../types/types";

/** Base class for member information classes. */
export abstract class MemberInfo {
    /** Client. */
    client!: Client;
    /** ID of the guild where the member came from. */
    guildID: string;
    /** ID of the member. */
    memberID: string;
    constructor(data: GWMUpdated | GWMRemoved | GWMRolesUpdated, memberID: string, client: Client) {
        this.client! = client;
        this.guildID = data.serverId;
        this.memberID = memberID;
    }

    /** Retrieve guild, if cached. */
    get guild(): Guild | Uncached {
        return this.client!.cache.guilds.get(this.guildID) ?? { id: this.guildID };
    }

    /** Retrieve member, if cached. */
    get member(): Member | Uncached {
        return this.client!.cache.members.get(this.memberID) ?? { id: this.memberID };
    }
}
