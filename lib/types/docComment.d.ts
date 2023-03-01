export interface ConstructorDocCommentOptions {
    guildID?: string;
}

export interface CreateDocCommentOptions {
    /** The content of the doc comment (min length 1; max length 10000) */
    content: string;
}

export interface EditDocCommentOptions {
    /** The content of the doc comment (min length 1; max length 10000) */
    content: string;
}
