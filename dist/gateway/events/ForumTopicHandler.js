"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ForumTopicHandler = void 0;
const ForumTopic_1 = require("../../structures/ForumTopic");
const GatewayEventHandler_1 = require("./GatewayEventHandler");
class ForumTopicHandler extends GatewayEventHandler_1.GatewayEventHandler {
    topicCreate(data) {
        var ForumTopicComponent = new ForumTopic_1.ForumTopic(data['forumTopic'], this.client);
        this.client.emit('forumTopicCreate', ForumTopicComponent);
    }
    topicUpdate(data) {
        var ForumTopicComponent = new ForumTopic_1.ForumTopic(data['forumTopic'], this.client);
        this.client.emit('forumTopicUpdate', ForumTopicComponent);
    }
    topicDelete(data) {
        var ForumTopicComponent = new ForumTopic_1.ForumTopic(data['forumTopic'], this.client);
        this.client.emit('forumTopicDelete', ForumTopicComponent);
    }
    topicPin(data) {
        var ForumTopicComponent = new ForumTopic_1.ForumTopic(data['forumTopic'], this.client);
        this.client.emit('forumTopicPin', ForumTopicComponent);
    }
    topicUnpin(data) {
        var ForumTopicComponent = new ForumTopic_1.ForumTopic(data['forumTopic'], this.client);
        this.client.emit('forumTopicUnpin', ForumTopicComponent);
    }
}
exports.ForumTopicHandler = ForumTopicHandler;
