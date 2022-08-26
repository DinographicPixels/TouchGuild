---
description: >-
  Guilder types are inspired by Eris, a Discord library, but it was built
  different. Types are easy, and predictable for new users and for Discord Eris
  users.
---

# Here's the guide for Guilder.

## Get started, it's easy.

You'll need to download Node (npm), sorry yarn users but it's not for now.

### Install the package

```bash
npm install guilder@latest --save-dev
```

### Basic scripting (ping, pong!)

Let's get started, it'll be easy examples for ya!

For example, we'll create a simple ping pong script, a well known command!

Javascript & Typescript:

```javascript
const Guilder = require('Guilder') // import for CommonJS
import Guilder from 'Guilder' // import for ESM & TS

const Client = new Guilder.Client({token: 'insert token here'}) // create client

Client.connect();

Client.on('messageCreate', (message)=> {
    // Detects when a message is created and execute the code here.
    if (message.content == '!ping'){
        // if the message command is !ping, it executes the code here.
        message.createMessage({content: 'pong!'}); // create a message.
    }
});
```

{% hint style="info" %}
Note: CommonJS, ESM & Typescript are supported.
{% endhint %}

