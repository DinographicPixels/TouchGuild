/** @module Announcement */
import { Client } from "./Client";
import { Base } from "./Base";
import { AnnouncementComment } from "./AnnouncementComment";
import { APIAnnouncement, APIAnnouncementComment, APIMentions } from "../Constants";
import { JSONAnnouncement } from "../types/json";
import TypedCollection from "../util/TypedCollection";

/** Represents a channel announcement. */
export class Announcement extends Base<string> {
    /** ID of the guild. */
    guildID: string;
    /** ID of the channel the announcement is in */
    channelID: string;
    /** The ISO 8601 timestamp that the announcement was created at */
    createdAt: Date;
    /** The ID of the member who created this announcement */
    memberID: string;
    /** The announcement's content */
    content: string;
    /** Mentions. */
    mentions: APIMentions | null;
    /** The announcement's title. */
    title: string;
    /** Cached announcement's comments */
    comments: TypedCollection<number, APIAnnouncementComment, AnnouncementComment>;

    /**
     * @param data raw data.
     * @param client client.
     */
    constructor(data: APIAnnouncement, client: Client) {
        super(data.id, client);
        this.guildID = data.serverId;
        this.channelID = data.channelId;
        this.createdAt = new Date(data.createdAt);
        this.memberID = data.createdBy;
        this.content = data.content;
        this.mentions = data.mentions ?? null;
        this.title = data.title;
        this.comments = new TypedCollection(AnnouncementComment, client, client.params.collectionLimits?.announcementComments);
        this.update(data);
    }

    override toJSON(): JSONAnnouncement {
        return {
            ...super.toJSON(),
            guildID:   this.guildID,
            channelID: this.channelID,
            createdAt: this.createdAt,
            memberID:  this.memberID,
            content:   this.content,
            mentions:  this.mentions,
            title:     this.title
        };
    }

    protected override update(data: APIAnnouncement): void {
        if (data.channelId !== undefined) {
            this.channelID = data.channelId;
        }
        if (data.content !== undefined) {
            this.content = data.content;
        }
        if (data.createdAt !== undefined) {
            this.createdAt = new Date(data.createdAt);
        }
        if (data.createdBy !== undefined) {
            this.memberID = data.createdBy;
        }
        if (data.id !== undefined) {
            this.id = data.id;
        }
        if (data.mentions !== undefined) {
            this.mentions = data.mentions;
        }
        if (data.serverId !== undefined) {
            this.guildID = data.serverId;
        }
        if (data.title !== undefined) {
            this.title = data.title;
        }
    }
}
