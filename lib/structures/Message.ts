import { Client } from './Client';
import fetch from 'node-fetch-commonjs'
import { Channel } from './Channel';
import { FETCH, SYNCFETCH } from '../Utils';

export class Message {
    data: any; fulldata: object; client: Client;
    id: string; type: string; serverId: string; channelId: string; content: string|undefined; 
    oldContent:string|undefined ; embeds: []|undefined; 
    replyMessageIds: string[]; isPrivate: boolean|undefined; isSilent: boolean|undefined; mentions: any; createdAt: string;
    createdBy: string; createdByWebhookId: string|undefined; updatedAt: string|undefined;
    channel: any; member: any;

    constructor(data: any, client:any, params= {oldContent: undefined}){
        this.data = data.message;
        this.fulldata = data
        this.client = client;
        // warning: Message could be splitted into GuildMessage and Message, this action will be taken when Guilded allows bots to chat in DMs.
        this.id = this.data.id
        this.type = this.data.type
        this.serverId = this.data.serverId
        this.channelId = this.data.channelId
        this.content = this.data.content
        this.embeds = this.data.embeds
        this.replyMessageIds = this.data.replyMessageIds
        this.isPrivate = this.data.isPrivate
        this.isSilent = this.data.isSilent
        this.mentions = this.data.mentions
        this.createdAt = this.data.createdAt
        this.createdBy = this.data.createdBy
        this.createdByWebhookId = this.data.createdByWebhookId
        this.updatedAt = this.data.updatedAt
        this.oldContent = params.oldContent
        if (this.type == 'system') return;
        this.channel = this.client.getChannel(this.channelId)
        this.member = this.client.getMember(this.serverId, this.createdBy)
    }

    async createMessage(options = {}){
        let bodyContent = JSON.stringify(options)
        let response = await FETCH('POST', `/channels/${this.channelId}/messages`, this.client.token, bodyContent)
        return new Message(response, this.client);
    }

    async edit(newMessage:object){
        if (typeof newMessage !== 'object') throw new TypeError("newMessage should be an Object. (example: {content: 'heyo!'})")
        let response = await FETCH('PUT', `/channels/${this.channelId}/messages/${this.id}`, this.client.token, JSON.stringify(newMessage))
    }

    async delete(){
        await FETCH('DELETE', `/channels/${this.channelId}/messages/${this.id}`, this.client.token, null);
    }
}