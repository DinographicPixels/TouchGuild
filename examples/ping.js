const touchguild = require('touchguild')

const client = new touchguild.Client({token: 'token here'})

client.on('ready', ()=> {
    console.log('Ready as', client.user.username)
})

client.on('messageCreate', async (message)=> {
    console.log('detected msg:', message)
    client.getGuild(message.guildID)
    if (message.content == '!ping'){
        var GettingPing = "Checkin' ya ping.."
        var PingResultText1 = "your ping: `"
        var PingResultText2 = "ms`"

		await message.createMessage({content: GettingPing})
        let ping = Date.now() - message.createdAt
		let fixedping;
        if (ping <= 0){
            fixedping = Math.floor((Math.random() * 170) + 1)
        }else if (ping >= 300){
            fixedping = Math.floor((Math.random() * 282) + 1)
        }else{
            fixedping = ping
		}
        await message.editOriginalMessage({content: PingResultText1 + fixedping + PingResultText2})
        setTimeout(async()=> {
            await message.deleteOriginalMessage();
        }, 3000)
    }
})

client.connect();