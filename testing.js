const TouchGuild = require('.')

const client = new TouchGuild.Client({token: 'gapi_G1wf19o6y4xn5YVW9gb2fcaIdQu+dCg7WlhTWF2aTj6/wSBU2Q3PR7RCpi7nrQcqZSwBGjiSr7yfFOyPHO789A=='})
//console.log(client.params)

client.on('ready', ()=> {
    console.log('ready!')
})

client.on('messageCreate', async (message)=> {
    //console.log('detected msg:', message)
    if (message.member.bot == true) return;
    console.log('received user messsage')
    if (message.content == '!sus'){
        message.createMessage({content: 'red is sus'});
    }else if (message.content == '!delete channel'){
        if (message.member.id !== '4kR9QRVA') return message.createMessage({content: "you don't have the rights to delete this channel"});
        message.createMessage({content: "ayo, i'm gonna delete that channel in 3 sec, you can't cancel this command"})
        setTimeout(() => {
            message.channel.delete()
        }, 3000);
    }else if (message.content.startsWith('!changedesc')){
        if (message.member.id !== '4kR9QRVA') return message.createMessage({content: "you don't have the rights to change the channel description"});
        var content = message.content
        var args = content.split(' ')
        delete args[0]
        message.channel.edit({topic: args.join(' ')})
    }else if (message.content.startsWith('!changename')){
        if (message.member.id !== '4kR9QRVA') return message.createMessage({content: "you don't have the rights to change the channel name"});
        var content = message.content
        var args = content.split(' ')
        delete args[0]
        message.channel.edit({name: args.join(' ')})
    }else if (message.content == '!profile'){
        var embed = {
            title: `${message.member.username}'s profile`,
            fields: [
                {name: "Account created:", value: new Date(message.member.createdAt)},
                {name: "Joined server:", value: message.member.joinedAt}
            ],
            thumbnail: {
                url: message.member.avatar
            },
            image: {
                url: message.member.banner
            }
        }
        message.createMessage({embeds: [embed]})
    }else if (message.content == '!createchannel'){
        client.createChannel("8jya38Wj", 'new channel', 'chat', {categoryID: 537954})
        //const bruh = require('./dist/Utils')
        //bruh.SYNCFETCH('POST', '/channels', client.token, '{"name":"just testin","type":"chat","serverId": "8jya38Wj", "groupId": "dVkxbqRz"}')
        console.log('executedd')
    }else if (message.content == "!test message"){
       var sentmsg = await message.createMessage({content: "heyo!"})
        setTimeout(() => {sentmsg.edit({content: 'How are you today?'});}, 3000);
        setTimeout(() => {sentmsg.edit({content: "Yeah, i'm good too"});}, 4000);
        setTimeout(() => {sentmsg.edit({content: "Nice, right?"});}, 5000);
        setTimeout(() => {sentmsg.edit({content: 'amogus'});}, 6000);
        setTimeout(() => {sentmsg.delete();}, 8000);
    }else if (message.content == "!basic client message"){
        client.createMessage("6376d3e6-63c8-4688-b05f-60898c4da893", {content: "ayo, just executed client.createMessage"})
    }else if (message.content == '!docs'){
        var docsChannel = 'ebd5861e-20a7-4d97-98e1-4ff62f75d0aa'
        let newdoc = await client.createDoc('ebd5861e-20a7-4d97-98e1-4ff62f75d0aa', {title: 'new doc', content: "empty, right?"})
        setTimeout(()=> {
            newdoc.edit({title: 'new title!', content: 'new content!'});
            //client.editDoc(docsChannel, newdoc.id, {title: 'new title!', content: 'new content!'})
        }, 4000)
        setTimeout(()=> {
            newdoc.delete();
            //client.deleteDoc(docsChannel, newdoc.id)
        }, 6000)
    }else if (message.content == '!getrestchannelmessages'){
        console.log(await client.getRESTChannelMessages(message.channel.id));
    }else if (message.content == '!getchannelmessages'){
        console.log(await client.getChannelMessages(message.channel.id) )
    }else if (message.content == '!getrestguilddocs'){
        console.log(await client.getRESTGuildDocs('ebd5861e-20a7-4d97-98e1-4ff62f75d0aa'))
    }else if (message.content == '!getguilddocs'){
        console.log(await client.getGuildDocs('ebd5861e-20a7-4d97-98e1-4ff62f75d0aa'))
    }else if (message.content == '!getrestguildtopics'){
        console.log(await client.getRESTGuildTopics('eca253e6-2400-4e3f-b039-e05e22fd2c1e'))
    }else if (message.content == '!getguildtopics'){
        console.log(await client.getGuildTopics('eca253e6-2400-4e3f-b039-e05e22fd2c1e'))
    }
})

// client.on('messageUpdate', (message)=> {
//     //console.log('message updated:', message)
//     console.log(message.oldContent)
//     if (message.content == '!cringe'){
//         message.createMessage({content: "yes, you're cringe"});
//     }
// })

client.on('topicCreate', (topic)=> {
    client.createMessage('b8957c29-3341-4f03-8ecd-43427d0a5e34', {content: `a topic named ${topic.name} has been **created** [topic id: ${topic.id}, forum id: ${topic.channel.id}]`})
})

client.on('topicUpdate', (topic)=> {
    client.createMessage('b8957c29-3341-4f03-8ecd-43427d0a5e34', {content: `a topic named ${topic.name} has been **updated** [topic id: ${topic.id}, forum id: ${topic.channel.id}]`})
})

client.on('topicDelete', (topic)=> {
    client.createMessage('b8957c29-3341-4f03-8ecd-43427d0a5e34', {content: `a topic named ${topic.name} has been **deleted** :( [topic id: ${topic.id}, forum id: ${topic.channel.id}]`})
})

client.on('guildBanAdd', (memberban)=> {
    client.createMessage('b8957c29-3341-4f03-8ecd-43427d0a5e34', {content: `bruh! ${memberban.username} got banned o_O`})
    console.log(memberban)
})

client.on('guildBanRemove', (memberban)=> {
    client.createMessage('b8957c29-3341-4f03-8ecd-43427d0a5e34', {content: `bruh! ${memberban.username} got unbanned o_O`})
    console.log(memberban)
})


client.on('channelCreate', (channel)=> {
    //console.log(channel)
    channel.createMessage({content: "i sent the first message in this channel"})

    setTimeout(() => {
        //channel.delete()
        channel.edit({name: 'hellooo channel', topic: 'this channel will deleted in 3 secs.'})
    }, 3*1000);

    setTimeout(() => {
        channel.delete()
    }, 6*1000);
})

client.on('messageDelete', (message)=> {
    //console.log(message)
})
client.connect();



// list of events


client.on('messageCreate', (message)=> {
    if (message.member.bot == true) return;
    //message.createMessage({content: 'I detected ya message, bro.'})
})

client.on('messageUpdate', (message)=> {
    if (message.member.bot == true) return;
    if (message.oldContent){
        message.createMessage({content: `i caught u editing, u said: ${message.oldContent}`})
    }else{
        message.createMessage({content: `couldn't get ya edited message :(, too late!`})
    }
})

client.on('messageDelete', (message)=> {
    message.createMessage({content: `${message.member.username} deleted his/her/their message, what are you hiding?!`})
    message.delete();
})


client.on('channelCreate', (channel)=> {
    client.createMessage(channel.id, {content: `A new channel has been created! The channel is called ${channel.name}, have fun here.`})
})

client.on('channelUpdate', (channel)=> {
    channel.createMessage({content:`this channel, ${channel.name} has been updated! you should check it out`})
})

client.on('channelDelete', (channel)=> {
    client.createMessage('b8957c29-3341-4f03-8ecd-43427d0a5e34', {content: `bruh! the channel: ${channel.name} has been destroyed!!!!?!!! boom.`})
})


client.on('guildBanAdd', (bannedMember)=> {
    client.createMessage('b8957c29-3341-4f03-8ecd-43427d0a5e34', {content: `bruh! ${bannedMember.username} has been banned`})
})

client.on('guildBanRemove', (bannedMember)=> {
    client.createMessage('b8957c29-3341-4f03-8ecd-43427d0a5e34', {content: `huh?! ${bannedMember.username} has been unbanned`})
})


client.on('guildMemberAdd', (member)=> {
    client.createMessage('b8957c29-3341-4f03-8ecd-43427d0a5e34', {content: `${member.username} just joined the server!`})
})

client.on('guildMemberRemove', (removeInfo)=> {
    if (removeInfo.isKick == false && removeInfo.isBan == false){
        client.createChannel('b8957c29-3341-4f03-8ecd-43427d0a5e34', {content: `${removeInfo.member.username} left the server, goodbye!`})
    }else if (removeInfo.isKick == true && removeInfo.isBan == false){
        client.createChannel('b8957c29-3341-4f03-8ecd-43427d0a5e34', {content: `${removeInfo.member.username} just got kicked!?`})
    }else if (removeInfo.isBan == true && removeInfo.isKick == false){
        client.createChannel('b8957c29-3341-4f03-8ecd-43427d0a5e34', {content: `${removeInfo.member.username} just got bannedd!? woah.`})
    }else{
        client.createChannel('b8957c29-3341-4f03-8ecd-43427d0a5e34', {content: `what just happened with ${removeInfo.member.username}?`})
    }
})

client.on('guildMemberUpdate', async (updateInfo)=> {
    var member = await client.getRESTMember(updateInfo.guildID, updateInfo.id);
    client.createChannel('b8957c29-3341-4f03-8ecd-43427d0a5e34', {content: `${member.username} just updated their member profile.`})
})

client.on('guildMemberRoleUpdate', async(updateInfo)=> {
    console.log('old=>', updateInfo.oldRoles)
    console.log('new=>', updateInfo.roles)
})

client.on('topicCreate', (topic)=> {
    client.createChannel('b8957c29-3341-4f03-8ecd-43427d0a5e34', {content: `topic: ${topic.name} has been created.`})
})

client.on('topicDelete', (topic)=> {
    client.createChannel('b8957c29-3341-4f03-8ecd-43427d0a5e34', {content: `topic: ${topic.name} has been deleted.`})
})

client.on('topicUpdate', (topic)=> {
    client.createChannel('b8957c29-3341-4f03-8ecd-43427d0a5e34', {content: `topic: ${topic.name} has been updated.`})
})


client.on('webhooksCreate', (webhook)=> {
    client.createChannel('b8957c29-3341-4f03-8ecd-43427d0a5e34', {content: `a webhook called ${webhook.username} has been created.`})
})

client.on('webhooksUpdate', (webhook)=> {
    client.createChannel('b8957c29-3341-4f03-8ecd-43427d0a5e34', {content: `a webhook called ${webhook.username} has been updated.`})
})