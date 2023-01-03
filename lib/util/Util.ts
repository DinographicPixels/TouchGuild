/** @module Util */

import { Client } from "../structures/Client";
import { Member } from "../structures/Member";
import { AnyChannel } from "../types/channel";
import { Channel } from "../structures/Channel";
import { ForumThread } from "../structures/ForumThread";
import { ForumChannel } from "../structures/ForumChannel";
import { Guild } from "../structures/Guild";
import { User } from "../structures/User";
import {
    APIForumTopic,
    APIForumTopicSummary,
    APIGuild,
    APIGuildChannel,
    APIGuildMember,
    APIUser
} from "guildedapi-types.ts/v1";

export class Util {
    #client: Client;
    constructor(client: Client) {
        this.#client = client;
    }

    updateUser(user: APIUser): User {
        return this.#client.users.has(user.id) ? this.#client.users.update(user) : this.#client.users.add(new User(user, this.#client));
    }

    updateMember(guildID: string, memberID: string, member: APIGuildMember): Member {
        const guild = this.#client.guilds.get(guildID);
        if (guild && this.#client.user?.id === memberID) {
            if (guild["_clientMember"]) {
                guild["_clientMember"]["update"](member);
            } else {
                guild["_clientMember"] = guild.members.update({ ...member, id: memberID }, guildID);
            }
            return guild["_clientMember"];
        }
        return guild ? guild.members.update({ ...member, id: memberID }, guildID) : new Member({ ...member }, this.#client, guildID);
    }

    updateForumThread(data: APIForumTopic | APIForumTopicSummary): ForumThread<ForumChannel> {
        if (data.serverId) {
            const guild = this.#client.guilds.get(data.serverId);
            const channel = guild?.channels.get(data.channelId) as ForumChannel;
            if (guild && channel) {
                const thread = channel.threads.has(data.id) ? channel.threads.update(data) : channel.threads.add(new ForumThread(data as APIForumTopic, this.#client));
                return thread;
            }
        }
        return new ForumThread(data as APIForumTopic, this.#client);
    }

    updateGuild(data: APIGuild): Guild {
        if (data.id) {
            return this.#client.guilds.has(data.id) ? this.#client.guilds.update(data) : this.#client.guilds.add(new Guild(data, this.#client));
        }
        return new Guild(data, this.#client);
    }

    updateChannel<T extends AnyChannel>(data: APIGuildChannel): T {
        if (data.serverId) {
            const guild = this.#client.guilds.get(data.serverId);
            if (guild) {
                const channel = guild.channels.has(data.id) ? guild.channels.update(data as APIGuildChannel) : guild.channels.add(Channel.from<AnyChannel>(data, this.#client));
                return channel as T;
            }
        }
        return Channel.from<T>(data, this.#client);
    }
}

export function is<T>(input: unknown): input is T {
    return true;
}
