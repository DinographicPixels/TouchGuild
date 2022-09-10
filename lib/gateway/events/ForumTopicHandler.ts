import { ForumTopic } from "../../structures/ForumTopic";
import { GatewayEventHandler } from "./GatewayEventHandler";

export class ForumTopicHandler extends GatewayEventHandler{
    topicCreate(data: object){
        var ForumTopicComponent = new ForumTopic(data['forumTopic' as keyof object], this.client)
        this.client.emit('forumTopicCreate', ForumTopicComponent)
    }

    topicUpdate(data: object){
        var ForumTopicComponent = new ForumTopic(data['forumTopic' as keyof object], this.client)
        this.client.emit('forumTopicUpdate', ForumTopicComponent)
    }

    topicDelete(data: object){
        var ForumTopicComponent = new ForumTopic(data['forumTopic' as keyof object], this.client)
        this.client.emit('forumTopicDelete', ForumTopicComponent)
    }

    topicPin(data: object){
        var ForumTopicComponent = new ForumTopic(data['forumTopic' as keyof object], this.client)
        this.client.emit('forumTopicPin', ForumTopicComponent)
    }

    topicUnpin(data: object){
        var ForumTopicComponent = new ForumTopic(data['forumTopic' as keyof object], this.client)
        this.client.emit('forumTopicUnpin', ForumTopicComponent)
    }
}