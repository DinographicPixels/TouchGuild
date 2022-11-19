/** @module Routes/Guilds */
import type { RESTManager } from "../rest/RESTManager";
import * as endpoints from "../rest/endpoints";
import { GETGuildMemberSocialsResponse } from "../Constants";
import { socialLinkTypes } from "../types/types";

export class Miscellaneous {
    #manager: RESTManager;
    constructor(manager: RESTManager){
        this.#manager = manager;
    }

    async getSocialLink(guildID: string, memberID: string, socialMediaName: string): Promise<socialLinkTypes> {
        return this.#manager.authRequest<GETGuildMemberSocialsResponse>({
            method: "GET",
            path:   endpoints.GUILD_MEMBER_SOCIALS(guildID, memberID, socialMediaName)
        }).then(data => ({
            memberUsername: data.socialLink.handle as string,
            serviceID:      data.socialLink.serviceId as string,
            type:           data.socialLink.type
        }));
    }
}
