const { Member } = require('.');
const TouchGuild = require('.')

const client = new TouchGuild.Client({token: 'gapi_G1wf19o6y4xn5YVW9gb2fcaIdQu+dCg7WlhTWF2aTj6/wSBU2Q3PR7RCpi7nrQcqZSwBGjiSr7yfFOyPHO789A=='})
//console.log(client.params)

client.connect();

client.on('ready', ()=> {
    console.log('ready!')
})

client.on('webhooksCreate', async(webhook)=> {
    //await client.editGuildWebhook(webhook.guildID, webhook.id, { name: 'west virginia!' });
})

client.on('webhooksUpdate', async(webhook)=> {
    //console.log(webhook)
    //try{await webhook.edit({name: 'cringeeeeeeeeeeeeeeeeeee'})}catch(err){}
})

// client.on('messageCreate', async(message)=> {
//     if (message.member.bot == true) return;
//     console.log(await message.member.getSocialLink('roblox'))
//     client.createMessage(message.channelID, {'content': 'bruhehhe'})
//    //client.createMessage('brueh', {'content': 'sussyb aka'})
// })

// client.on('channelCreate', (channel)=> {
//     client.createMessage(channel.id, {content:' bruhhh!'});
// })

// client.on('calendarEventCreate', (event)=> {
//     setTimeout(() => {
//         //event.delete();
//     }, 3000);
// })

// client.on('calendarEventUpdate', (event)=> {
//     setTimeout(() => {
//         event.edit({name: 'event bruh!', description: 'u tried to edit hah'});
//     }, 3000);
// })

// client.on('calendarEventDelete', (event)=> {
//     console.log(event)
// })

// client.on('calendarEventUpdate', async (event)=> {
//     console.log(await client.getRESTCalendarEvents(event.channelID));
// })

// client.on('messageReactionAdd', async (info)=> {
//     console.log(info)
//     if (info.message.createdBy && info.reactor.bot !== true){ // get a Member param.
//         info.message.createMessage({content: "Ya just reacted a cached message!"})
//         client.addMessageReaction(info.message.channelID, info.message.id, 90002559)
//         if (info.reactor.bot == false){
//             var steamLink = await info.reactor.getSocialLink('steam');
//         }
//     }else{
//         client.createMessage(info.message.channelID, {content: "a reaction has been added to a non cached message"})
//     }
// })

client.on('messageCreate', async(message)=> {
    if (message.member instanceof TouchGuild.Member){
        if (message.member.bot == true) return;
         var rest = await client.getRESTListItem('fde8d8b5-6ce2-411a-920e-ed8e90be09fe', 'caa221f2-1c42-484f-ac52-60ebcb17391b');
         console.log(rest)
        if (message.content == 'example1'){
            var msg = await message.createMessage({content: "this is the original message"})
            await msg.editOriginalMessage({'content': 'i edited the original message!'})
            await message.createMessage({content: "new message"})
            await message.editOriginalMessage({'content': 'it works even if i create a new message! ya see?'})
        }else if (message.content == 'example2'){
            await message.createMessage({content: "we'll test the editLastMessage method"})
            await message.editLastMessage({content:"as you can see, it edited"})
            await message.createMessage({content:"and if i create a message, it'll edit the last one"})
            await message.editLastMessage({content: 'ya see?'})
        }
    }
})

client.on('messageReactionAdd', async(info)=> {
    if (info.reactor instanceof TouchGuild.Member){
        var member = info.reactor;
        console.log(await member.getSocialLink('steam'));
    }else{
        console.log(info.reactor.id);
    }
})

client.on('messageReactionRemove', async (info)=> {

})

client.on('listItemCreate', async (item)=> {
    console.log(item)
    item.edit(item.content, {content: 'new note content'})
    await item.complete()
    setTimeout(() => {
        item.uncomplete()
    }, 500);
})