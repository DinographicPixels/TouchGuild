export interface ConstructorForumThreadOptions {
    /** ID of the forum channel's parent guild. */
    guildID?: string | null;
    /** ID of the "Forums" channel containing this ForumThreadComment. */
    channelID?: string | null;
}

export interface CreateForumCommentOptions {
    /** Content of the comment. */
    content: string;
}

export interface EditForumCommentOptions {
    /** New content of the comment. */
    content?: string;
}
