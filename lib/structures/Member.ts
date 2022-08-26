import { Client } from './Client';
import fetch from 'node-fetch-commonjs'
import { Channel } from './Channel';
import { User } from './User';

export class Member extends User {
    roleIds: Array<number>; nickname: string|any; joinedAt: string; isOwner:boolean; // member

    constructor(data: any, client:any){
        super(data, client);
        this.roleIds = data.roleIds
        this.nickname = data.nickname
        this.joinedAt = data.joinedAt
        this.isOwner = data.isOwner

        if (!this.isOwner) this.isOwner = false; // since it returns undefined when the user isn't the owner
    }
}