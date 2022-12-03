/** @module Guild */
import { Client } from "./Client";
import { Base } from "./Base";
import { Channel } from "./Channel";
import { Member } from "./Member";
import { User } from "./User";
import { BannedMember } from "./BannedMember";
import { GuildChannel } from "./GuildChannel";
import { APIGuild, APIGuildChannel, APIGuildMember } from "../Constants";
import TypedCollection from "../util/TypedCollection";
import { JSONGuild } from "../types/json";
import { AnyChannel } from "../types/channel";

/** Represents a Guild, also called server. */
export class Guild extends Base<string> {
    private _clientMember?: Member;
    /** ID of the guild owner. */
    ownerID: string;
    /** Guild type. */
    type?: string;
    /** The name of the guild. */
    name: string;
    /** The URL of the guild. */
    url?: string;
    /** Guild description. */
    description?: string;
    /** Guild icon URL. */
    iconURL?: string | null;
    /** Guild banner URL. */
    bannerURL?: string | null;
    /** Guild's timezone. */
    timezone?: string;
    /** Default channel of the guild. */
    defaultChannelID?: string;
    /** When this guild was created. */
    createdAt: Date;
    /** If true, the guild is verified. */
    verified: boolean;
    /** Cached guild channels. */
    channels: TypedCollection<string, APIGuildChannel, AnyChannel>;
    /** Cached guild members. */
    members: TypedCollection<string, APIGuildMember, Member, [guildID: string]>;

    /**
     * @param data raw data.
     * @param client client.
     */
    constructor(data: APIGuild, client: Client){
        super(data.id, client);
        this.ownerID = data.ownerId;
        this.type = data.type;
        this.name = data.name;
        this.url = data.url;
        this.description = data.about;
        this.iconURL = data.avatar ?? null;
        this.bannerURL = data.banner ?? null;
        this.timezone = data.timezone;
        this.defaultChannelID = data.defaultChannelId;
        this.createdAt = new Date(data.createdAt);
        this.verified = data.isVerified ?? false;
        this.channels = new TypedCollection(GuildChannel, client);
        this.members = new TypedCollection(Member, client);
        this.update(data);
    }

    override toJSON(): JSONGuild {
        return {
            ...super.toJSON(),
            ownerID:          this.ownerID,
            type:             this.type,
            name:             this.name,
            url:              this.url,
            description:      this.description,
            iconURL:          this.iconURL,
            bannerURL:        this.bannerURL,
            timezone:         this.timezone,
            defaultChannelID: this.defaultChannelID,
            createdAt:        this.createdAt,
            verified:         this.verified,
            channels:         this.channels,
            members:          this.members
        };
    }

    protected override update(data: APIGuild): void {
        if (data.about !== undefined) {
            this.description = data.about;
        }
        if (data.avatar !== undefined) {
            this.iconURL = data.avatar;
        }
        if (data.banner !== undefined) {
            this.bannerURL = data.banner;
        }
        if (data.createdAt !== undefined) {
            this.createdAt = new Date(data.createdAt);
        }
        if (data.defaultChannelId !== undefined) {
            this.defaultChannelID = data.defaultChannelId;
        }
        if (data.id !== undefined) {
            this.id = data.id;
        }
        if (data.isVerified !== undefined) {
            this.verified = data.isVerified;
        }
        if (data.name !== undefined) {
            this.name = data.name;
        }
        if (data.ownerId !== undefined) {
            this.ownerID = data.ownerId;
        }
        if (data.timezone !== undefined) {
            this.timezone = data.timezone;
        }
        if (data.type !== undefined) {
            this.type = data.type;
        }
        if (data.url !== undefined) {
            this.url = data.url;
        }
    }

    /** Retrieve cached or rest guild's owner. */
    get owner(): Member | User | Promise<Member> {
        return this.client.getGuild(this.id)?.members.get(this.ownerID) ?? this.client.users.get(this.ownerID) ?? this.client.rest.guilds.getMember(this.id, this.ownerID);
    }

    /** Get a channel from this guild, if cached.
     * @param channelID The ID of the channel to get from cache.
     */
    getChannel(channelID: string): Channel | undefined {
        if (!channelID) throw new Error("channelID is a required parameter.");
        return this.channels.get(channelID);
    }

    /** Get a member from this guild, if cached.
     * @param memberID The ID of the member to get.
     */
    getMember(memberID: string): Member | undefined {
        if (!memberID) throw new Error("memberID is a required parameter.");
        return this.members.get(memberID);
    }

    /** Ban a member.
     * @param memberID ID of the member to ban.
     * @param reason The reason of the ban.
     */
    async createBan(memberID: string, reason?: string): Promise<BannedMember> {
        return this.client.rest.guilds.createBan(this.id as string, memberID, reason);
    }

    /** Unban a member.
     * @param memberID ID of the member to unban.
     */
    async removeBan(memberID: string): Promise<void> {
        return this.client.rest.guilds.removeBan(this.id as string, memberID);
    }
}
