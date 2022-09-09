import TouchGuild from '.';

const Client = new TouchGuild.Client({token: 'yikes!'})


Client.on('messageCreate', async (message)=> {
    var bruh = await message.member?.getSocialLink('steam')
})

Client.on('messageReactionAdd', async (info)=> {
    if (info.reactor instanceof TouchGuild.Member){
        var member = info.reactor as TouchGuild.Member;
        console.log(member.getSocialLink('steam'));
    }else{
        console.log(info.reactor.id);
    }
})

Client.on('messageCreate', async (msg)=> {
    var member = msg.member

    msg.mentions.roles?.[0]['id']
})
