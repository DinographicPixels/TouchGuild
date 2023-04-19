/** @module Routes/Guilds */
import type { RESTManager } from "../rest/RESTManager";
import * as endpoints from "../rest/endpoints";
import { GETGuildMemberSocialsResponse, GETUserResponse, GETUserServersResponse } from "../Constants";
import { User } from "../structures/User";
import { SocialLink } from "../structures/SocialLink";
import { Guild } from "../structures/Guild";

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
    async getSocialLink(guildID: string, memberID: string, socialMediaName: string): Promise<SocialLink> {
        return this.#manager.authRequest<GETGuildMemberSocialsResponse>({
            method: "GET",
            path:   endpoints.GUILD_MEMBER_SOCIALS(guildID, memberID, socialMediaName)
        }).then(data => new SocialLink(data.socialLink, this.#manager.client));
    }

    /**
     * Get a user.
     *
     * Note: when getting the bot's user, only the information specific to 'User' will be returned.
     * If you'd like to get the UserClient (the bot itself), use Client#user.
     * @param userID The ID of the user to get.
     */
    async getUser(userID: string): Promise<User> {
        return this.#manager.authRequest<GETUserResponse>({
            method: "GET",
            path:   endpoints.USER(userID)
        }).then(data => this.#manager.client.util.updateUser(data.user));
    }

    /**
     * Retrieve user's joined servers.
     * @param userID ID of the user. (`@me` can be used to select your instance)
     */
    async getUserGuilds(userID: string): Promise<Array<Guild>> {
        return this.#manager.authRequest<GETUserServersResponse>({
            method: "GET",
            path:   endpoints.USER_SERVERS(userID)
        }).then(data => data.servers.map(d => new Guild(d, this.#manager.client)));
    }
}
