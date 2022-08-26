const guilder = require('.')

const client = new guilder.Client({token: 'gapi_G1wf19o6y4xn5YVW9gb2fcaIdQu+dCg7WlhTWF2aTj6/wSBU2Q3PR7RCpi7nrQcqZSwBGjiSr7yfFOyPHO789A=='})
console.log(client.params)

client.on('ready', ()=> {
    console.log('ready!')
})

client.on('messageCreate', async (message)=> {
    console.log('detected msg:', message)
    console.log(client.getGuild(message.serverId))
    if (message.content == '!sus'){
        message.createMessage({content: 'red is sus'});
    }else if (message.content == '!delete channel'){
        message.createMessage({content: "ayo, i'm gonna delete that channel in 3 sec, you can't cancel this command"})
        setTimeout(() => {
            message.channel.delete()
        }, 3000);
    }else if (message.content.startsWith('!changedesc')){
        var content = message.content
        var args = content.split(' ')
        delete args[0]
        message.channel.edit({topic: args.join(' ')})
    }else if (message.content.startsWith('!changename')){
        var content = message.content
        var args = content.split(' ')
        delete args[0]
        message.channel.edit({name: args.join(' ')})
    }else if (message.content == '!profile'){
        var embed = {
            title: `${message.member.username}'s profile`,
            fields: [
                {name: "Account created:", value: message.member.createdAt},
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
        client.createChannel({guildID: "8jya38Wj"}, 'new channel', 'chat')
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
    }
})

// client.on('messageUpdate', (message)=> {
//     //console.log('message updated:', message)
//     console.log(message.oldContent)
//     if (message.content == '!cringe'){
//         message.createMessage({content: "yes, you're cringe"});
//     }
// })


client.on('channelCreate??', (channel)=> {
    //console.log(channel)
    channel.createMessage({content: "i sent the first message in this channel"})

    setTimeout(() => {
        //channel.delete()
        channel.edit({name: 'hellooo channel'})
    }, 3*1000);
})

client.on('messageDelete', (message)=> {
    //console.log(message)
})

client.connect();