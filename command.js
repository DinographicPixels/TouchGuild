const guilder = require('.')

const client = new guilder.Client({token: 'gapi_G1wf19o6y4xn5YVW9gb2fcaIdQu+dCg7WlhTWF2aTj6/wSBU2Q3PR7RCpi7nrQcqZSwBGjiSr7yfFOyPHO789A=='})
console.log(client.params)

client.on('ready', ()=> {
    console.log('ready!')
})

client.on('messageCreate', async (message)=> {
    console.log('detected msg:', message)
    client.getGuild(message.guildID)
    if (message.content == '!ping'){
        var GettingPing = "Wait i'm getting your ping.."
        var PingResultText1 = "lmao see your ping: `"
        var PingResultText2 = "ms` (it doesn't mean anything)"

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