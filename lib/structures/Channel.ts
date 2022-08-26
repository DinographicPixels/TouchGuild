import { Client } from './Client';
import fetch from 'node-fetch-commonjs'
import { Message } from './Message';

export class Channel {
    data: any; client: Client;
    id: string; type: string; name: string; topic: string|any; createdAt: string;
    createdBy: string; updatedAt: string|any; serverId: string; parentId: string|any;
    categoryId: number|any; groupId: string; isPublic: boolean|any; archivedBy: string|any;
    archivedAt: string|any;

    constructor(data: any, client:any){
        this.data = data.channel;
        this.client = client;

        this.id = this.data.id
        this.type = this.data.type
        this.name = this.data.name
        this.topic = this.data.topic
        this.createdAt = this.data.createdAt
        this.createdBy = this.data.createdBy
        this.updatedAt = this.data.updatedAt
        this.serverId = this.data.serverId
        this.parentId = this.data.parentId
        this.categoryId = this.data.categoryId
        this.groupId = this.data.groupId
        this.isPublic = this.data.isPublic
        this.archivedBy = this.data.archivedBy
        this.archivedAt = this.data.archivedAt
    }

    async createMessage(options = {}){
        let bodyContent = JSON.stringify(options)
        let fetching = await fetch(`https://www.guilded.gg/api/v${this.client.ws.apiversion}/channels/${this.id}/messages`, {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${this.client.token}`,
              Accept: "application/json",
              "Content-type": "application/json",
            },
            body: bodyContent,
            protocol: "HTTPS"
        });

        let response = await fetching.json();
        return new Message(response, this.client);
    }

    async delete(){
        let fetching = await fetch(`https://www.guilded.gg/api/v${this.client.ws.apiversion}/channels/${this.id}`, {
            method: 'DELETE',
            headers: {
              Authorization: `Bearer ${this.client.token}`,
              Accept: "application/json",
              "Content-type": "application/json",
            },
            protocol: "HTTPS"
        });
    }

    async edit(options:Partial<editTypes>){
        let fetching = await fetch(`https://www.guilded.gg/api/v${this.client.ws.apiversion}/channels/${this.id}`, {
            method: 'PATCH',
            headers: {
              Authorization: `Bearer ${this.client.token}`,
              Accept: "application/json",
              "Content-type": "application/json",
            },
            body: JSON.stringify(options),
            protocol: "HTTPS"
        });
        let response = await fetching.json();
        return new Channel(response, this.client);
    }
}

interface editTypes {
    name: string,
    topic: string,
    isPublic: boolean
}