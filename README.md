---
  TouchGuild is a library that supports TS, JS (cjs and esm) and it was built to let you interface with the Guilded API. It
  has easy & predictable types, some of them are inspired by Discord Eris.

---

# Early access library
The library recently launched and we need to make sure that you do not encounter bugs, that's why, we're realsing it in Early access. When TouchGuild will be stable enough, we'll switch to 'B.E.T.A' since the Guilded API is still in early access.

# Guide, documentation & even more
Everything's to help you to get started, to create an incredible guilded bot through our Library.
## Links:
- [NPM Package](https://www.npmjs.com/package/touchguild)
- [GitHub](https://github.com/DinographicPixels/TouchGuild)
- [Guide](https://docs.touchguild.dinographicpixels.com/guide/get-started)
- [Documentation](https://docs.touchguild.dinographicpixels.com/documentation/home)
- [Our vision of the project](https://docs.touchguild.dinographicpixels.com/misc/our-vision)
- [FAQ](https://docs.touchguild.dinographicpixels.com/misc/faq)
- [Get started, youtube video](https://www.youtube.com/watch?v=AUaiQRMjJZo);
- [Our Discord server](https://discord.gg/UgPRaGRkrQ)
- [Our Guilded server](https://www.guilded.gg/i/ExPXPrwE)


# 🌟 Get started

<figure><img src="https://files.gitbook.com/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FlOPMbaW5t7rQZWQ9C6lG%2Fuploads%2F18hrn4NpcdDAZzNo1Ape%2Ftouchguild-banner.png?alt=media&token=7ccb1380-65eb-44d6-b978-d68fe33048f5" alt=""><figcaption></figcaption></figure>

## Get started, it's easy.

You'll need to download Node (npm).

### Install the package

Install the package with npm:
```bash
npm install touchguild@latest
```
Install the package with yarn:
```bash
yarn add touchguild
```

### Basic scripting (ping, pong!)

Let's get started, it'll be easy examples for ya!

For example, we'll create a simple ping pong script, a well known command!

Javascript & Typescript:

```javascript
const TouchGuild = require('TouchGuild') // import for CommonJS
// import TouchGuild from 'TouchGuild' // import for ESM & TS

const Client = new TouchGuild.Client({token: 'insert token here'}) // create client

Client.connect();

Client.on('messageCreate', (message)=> {
    // Detects when a message is created and executes the code here.
    if (message.member.bot == true) return; // ignores bot messages.
    if (message.content == '!ping'){
        // if the message command is !ping, it executes the code here.
        message.createMessage({content: 'pong!'}); // create a message.
    }
});
```

## Need to get new features, right. Now?
[Click here for more information about Nightly builds.](https://app.gitbook.com/s/lOPMbaW5t7rQZWQ9C6lG/guide/get-started#need-to-get-new-features-right.-now)
