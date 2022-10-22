const TouchGuild = require('touchguild'); // CommonJS import.

const client = new TouchGuild.Client({token: 'insert token here'});

client.on('ready', ()=> {
   console.log("I'm ready!");
});

client.on('error', (err)=> {
   console.error("Whoops, somethin' went wrong..", err);
});

client.connect();