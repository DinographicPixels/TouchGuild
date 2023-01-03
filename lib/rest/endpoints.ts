/** REST/Endpoints */
/* eslint-disable @typescript-eslint/quotes */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint no-use-before-define: 0 */

export const CHANNELS = () => `/channels`;
export const CHANNEL = (channelID: string) => `/channels/${channelID}`;

export const GUILD = (guildID: string) => `/servers/${guildID}`;
export const USER = (userID: string) => `/users/${userID}`;

export const CHANNEL_MESSAGES = (channelID: string) => `/channels/${channelID}/messages`;
export const CHANNEL_MESSAGE = (channelID: string, messageID: string) => `/channels/${channelID}/messages/${messageID}`;
export const CHANNEL_MESSAGE_CONTENT_EMOTE = (channelID: string, messageID: string, emoteID: number) => `/channels/${channelID}/content/${messageID}/emotes/${emoteID}`;

export const MEMBER_NICKNAME = (guildID: string, memberID: string) => `/servers/${guildID}/members/${memberID}/nickname`;

export const GUILD_MEMBER = (guildID: string, memberID: string) => `/servers/${guildID}/members/${memberID}`;
export const GUILD_MEMBER_XP = (guildID: string, memberID: string) => `/servers/${guildID}/members/${memberID}/xp`;
export const GUILD_MEMBERS = (guildID: string) => `/servers/${guildID}/members`;
export const GUILD_MEMBER_SOCIALS = (guildID: string, memberID: string, type: string) => `/servers/${guildID}/members/${memberID}/social-links/${type}`;

export const GUILD_GROUP_MEMBER = (groupID: string, memberID: string) => `/groups/${groupID}/members/${memberID}`;
export const GUILD_GROUP_MEMBERS = (groupID: string) => `/groups/${groupID}/members/`;
export const GUILD_GROUP = (groupID: string) => `/groups/${groupID}`;

export const GUILD_BAN = (guildID: string, memberID: string) => `/servers/${guildID}/bans/${memberID}`;
export const GUILD_BANS = (guildID: string) => `/servers/${guildID}/bans`;

export const GUILD_MEMBER_ROLE = (guildID: string, memberID: string, roleID: number) => `/servers/${guildID}/members/${memberID}/roles/${roleID}`;
export const GUILD_MEMBER_ROLE_XP = (guildID: string, roleID: number) => `/servers/${guildID}/roles/${roleID}/xp`;
export const GUILD_MEMBER_ROLES = (guildID: string, memberID: string) => `/servers/${guildID}/members/${memberID}/roles`;

export const FORUM_TOPICS = (channelID: string) => `/channels/${channelID}/topics`;
export const FORUM_TOPIC = (channelID: string, topicID: number) => `/channels/${channelID}/topics/${topicID}`;
export const FORUM_TOPIC_PIN = (channelID: string, topicID: number) => `/channels/${channelID}/topics/${topicID}/pin`;
export const FORUM_TOPIC_LOCK = (channelID: string, topicID: number) => `/channels/${channelID}/topics/${topicID}/lock`;
export const FORUM_TOPIC_EMOTE = (channelID: string, topicID: number, emoteID: number) => `/channels/${channelID}/topics/${topicID}/emotes/${emoteID}`;
export const FORUM_TOPIC_COMMENTS = (channelID: string, topicID: number) => `/channels/${channelID}/topics/${topicID}/comments`;
export const FORUM_TOPIC_COMMENT = (channelID: string, topicID: number, commentID: number) => `/channels/${channelID}/topics/${topicID}/comments/${commentID}`;

export const LIST_ITEMS = (channelID: string)=> `/channels/${channelID}/items`;
export const LIST_ITEM = (channelID: string, itemID: string)=> `/channels/${channelID}/items/${itemID}`;
export const LIST_ITEM_COMPLETE = (channelID: string, itemID: string)=> `/channels/${channelID}/items/${itemID}/complete`;

export const CHANNEL_DOCS = (channelID: string)=> `/channels/${channelID}/docs`;
export const CHANNEL_DOC = (channelID: string, docID: number)=> `/channels/${channelID}/docs/${docID}`;

export const CHANNEL_EVENTS = (channelID: string)=> `/channels/${channelID}/events`;
export const CHANNEL_EVENT = (channelID: string, eventID: number)=> `/channels/${channelID}/events/${eventID}`;
export const CHANNEL_EVENT_RSVP = (channelID: string, eventID: number, memberID: string)=> `/channels/${channelID}/events/${eventID}/rsvps/${memberID}`;
export const CHANNEL_EVENT_RSVPS = (channelID: string, eventID: number)=> `/channels/${channelID}/events/${eventID}/rsvps`;

export const GUILD_WEBHOOKS = (guildID: string)=> `/servers/${guildID}/webhooks`;
export const GUILD_WEBHOOK = (guildID: string, webhookID: string)=> `/servers/${guildID}/webhooks/${webhookID}`;
