/** @module Routes/Guilds */
import type { RESTManager } from "../rest/RESTManager";
import * as endpoints from "../rest/endpoints";
import { GETGuildMemberSocialsResponse } from "../Constants";
import { GetSocialLink } from "../types/types";

/** Miscellaneous routes. */
export class Miscellaneous {
    #manager: RESTManager;
    /**
     * @param manager REST Manager needed to execute request.
     */
    constructor(manager: RESTManager){
        this.#manager = manager;
    }

    /** Get a specified social link from the member, if member is connected to them through Guilded.
     * @param guildID The ID of the guild the member is in.
     * @param memberID The ID of the member to get their social link.
     * @param socialMediaName Name of a social media linked to this member.
     */
    async getSocialLink(guildID: string, memberID: string, socialMediaName: string): Promise<GetSocialLink> {
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
