export const RESTMethods = [
    "GET",
    "POST",
    "PUT",
    "PATCH",
    "DELETE"
] as const;
export type RESTMethod = typeof RESTMethods[number];

export type UserTypes = "bot" | "user";

export * from "guildedapi-types.ts/v1"; // marks api typings as non-external (for docs).

export type ChannelReactionTypes = "ChannelMessage" | "ForumThread" | "CalendarEvent" | "Doc" | "ChannelAnnouncement";
export type ChannelSubcategoryReactionTypes = "CalendarEventComment" | "ForumThreadComment" | "DocComment" | "AnnouncementComment";

/** Channel reaction types that supports bulk delete.  */
export type ChannelReactionTypeBulkDeleteSupported = "ChannelMessage";

export { Permissions } from "guildedapi-types.ts/v1";
