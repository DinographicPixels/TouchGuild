/** @module Util */

import { Client } from "../structures/Client";
import { Member } from "../structures/Member";
import { AnyChannel } from "../types/channel";
import { Channel } from "../structures/Channel";
import { APIGuildChannel, APIGuildMember } from "guildedapi-types.ts/v1";

export class Util {
    #client: Client;
    constructor(client: Client) {
        this.#client = client;
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

    updateChannel<T extends AnyChannel>(data: APIGuildChannel): T {
        if (data.serverId) {
            const guild = this.#client.guilds.get(data.serverId);
            if (guild) {
                const channel = guild.channels.has(data.id) ? guild.channels.update(data as APIGuildChannel)  : guild.channels.add(Channel.from<AnyChannel>(data, this.#client));
                return channel as T;
            }
        }
        return Channel.from<T>(data, this.#client);
    }
}

export function is<T>(input: unknown): input is T {
    return true;
}
