import { User } from './User';
export declare class Member extends User {
    roleIds: Array<number>;
    nickname: string | any;
    joinedAt: string;
    isOwner: boolean;
    constructor(data: any, client: any);
}
