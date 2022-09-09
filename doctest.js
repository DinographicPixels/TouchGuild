const TouchGuild = require('.') // import for CommonJS
// import TouchGuild from 'TouchGuild' // import for ESM & TS

const Client = new TouchGuild.Client({token: 'gapi_G1wf19o6y4xn5YVW9gb2fcaIdQu+dCg7WlhTWF2aTj6/wSBU2Q3PR7RCpi7nrQcqZSwBGjiSr7yfFOyPHO789A=='}) // create client

Client.connect();

Client.on('messageCreate', (message)=> {
    // Detects when a message is created and executes the code here.
    if (message.member.bot == true) return; // ignores bot messages
    if (message.content == '!ping'){
        // if the message command is !ping, it executes the code here.
        message.createMessage({content: 'pong!'}); // create a message.
    }
});