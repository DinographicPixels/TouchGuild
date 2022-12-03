/** @module DocChannel */
import { Client } from "./Client";

import { Doc } from "./Doc";
import { GuildChannel } from "./GuildChannel";
import type { APIDoc, APIGuildChannel } from "../Constants";
import TypedCollection from "../util/TypedCollection";
import { JSONDocChannel } from "../types/json";

/** Represents a "docs" channel. */
export class DocChannel extends GuildChannel {
    /** Cached docs. */
    docs: TypedCollection<number, APIDoc, Doc>;
    /**
     * @param data raw data
     * @param client client
     */
    constructor(data: APIGuildChannel, client: Client){
        super(data, client);
        this.docs = new TypedCollection(Doc, client, client.params.collectionLimits?.docs);
        this.update(data);
    }

    override toJSON(): JSONDocChannel {
        return {
            ...super.toJSON(),
            docs: this.docs
        };
    }
}
