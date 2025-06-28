
//
// © 2022–present Dinographic. All rights reserved.
//

import type { PathsServersServerIdMembersUserIdSocialLinksSocialLinkTypeGetParametersPathSocialLinkType as APISocialLinkType } from "guildedapi-types.ts/typings/schemas/v1";

export const RESTMethods = [
    "GET",
    "POST",
    "PUT",
    "PATCH",
    "DELETE"
] as const;
export type RESTMethod = typeof RESTMethods[number];

export type RawUserTypes = "bot" | "user";
export type UserTypes = "app" | "user";

export * from "guildedapi-types.ts/v1"; // marks api typings as non-external (for docs).

export type ChannelReactionTypes = "ChannelMessage" | "ForumThread" | "CalendarEvent" | "Doc" | "ChannelAnnouncement";
export type ChannelSubcategoryReactionTypes = "CalendarEventComment" | "ForumThreadComment" | "DocComment" | "AnnouncementComment";

/** Channel reaction types that supports bulk delete.  */
export type ChannelReactionTypeBulkDeleteSupported = "ChannelMessage";

export enum ApplicationCommandOptionTypes {
    STRING,
    INTEGER,
    FLOAT,
    NUMBER,
    SIGNED_32_INTEGER,
    USER,
    ROLE,
    CHANNEL,
    EMBEDDED_ATTACHMENT,
    BOOLEAN,
    EMOTE,
}

export enum ApplicationCommandType {
    CHAT_INPUT = 1,
}

export enum GatewayLayerIntent {
    ALL,
    GUILDS,
    GUILD_MESSAGES ,
    GUILD_MESSAGE_REACTIONS,
    MESSAGE_CONTENT,
    GUILD_WEBHOOKS,
}

export enum InteractionComponentType {
    BUTTON,
}

export enum Locales {
    INDONESIAN = "id",
    DANISH = "da",
    GERMAN = "de",
    ENGLISH_UK = "en-GB",
    ENGLISH_US = "en-US",
    SPANISH = "es-ES",
    SPANISH_LATAM = "es-419",
    FRENCH = "fr",
    CROATIAN = "hr",
    ITALIAN = "it",
    LITHUANIAN = "lt",
    HUNGARIAN = "hu",
    DUTCH = "nl",
    NORWEGIAN = "no",
    POLISH = "pl",
    PORTUGUESE_BRAZIL = "pt-BR",
    ROMANIAN = "ro",
    FINNISH = "fi",
    SWEDISH = "sv-SE",
    VIETNAMESE = "vi",
    TURKISH = "tr",
    CZECH = "cs",
    GREEK = "el",
    BULGARIAN = "bg",
    RUSSIAN = "ru",
    UKRAINIAN = "uk",
    HINDI = "hi",
    THAI = "th",
    CHINESE = "zh-CN",
    JAPANESE = "ja",
    CHINESE_TAIWAN = "zh-TW",
    KOREAN = "ko",
}

export type SocialLinkType = APISocialLinkType;
