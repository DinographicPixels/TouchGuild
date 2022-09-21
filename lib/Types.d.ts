export interface MentionsType {
    users?: Array<object>,
    channels?: Array<object>,
    roles?: Array<object>,
    everyone?: boolean,
    here?: boolean
}

export type ListItemNoteTypes = {
    createdAt: number,
    createdBy: string,
    updatedAt?: number,
    updatedBy?: string,
    mentions?: MentionsType,
    content: string
}