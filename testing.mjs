import TouchGuild from '.'

const client = new TouchGuild.Client({'token': 'token here'})

client.connect()

client.on('messageCreate', (msg)=> {
    msg.createMessage({content: 'yikes!'})
})