---
  TouchGuild is a library that supports TS, JS (cjs and esm) and it was built to let you interface with the Guilded API. It
  has easy & predictable types, some of them are inspired by Discord Eris.

---

# Early access library
The library recently launched and we need to make sure that you do not encounter bugs, that's why, we're realsing it in Early access. When TouchGuild will be stable enough, we'll switch to 'B.E.T.A' since the Guilded API is still in early access.

# NIGHTLY BUILD
Be aware that Nightly builds aren't stable and can have still have major bugs. If you face issues, feel free to report it by creating an issue on TouchGuild's GitHub, please specify that you're using a Nightly build.

## What's new on Nightly builds?
- **Lock & unlock forum topic methods for both Client and ForumTopic components.**
- disconnect() method for Client
- Fixed: 'messageDelete's oldContent is null (couldn't get oldContent from cache)'
- Deleted unused importations
- Types are now in one file

Check docs/nightly for more details about new features: https://docs.touchguild.dinographicpixels.com/nightly/features

# Guide, documentation & even more
Everything's to help you to get started, to create an incredible guilded bot through our Library.
## Links:
- [NPM Package](https://www.npmjs.com/package/touchguild)
- [GitHub](https://github.com/DinographicPixels/TouchGuild)
- [Guide](https://docs.touchguild.dinographicpixels.com/guide/get-started)
- [Documentation](https://docs.touchguild.dinographicpixels.com/documentation/home)
- [Our vision of the project](https://docs.touchguild.dinographicpixels.com/misc/our-vision)
- [FAQ](https://docs.touchguild.dinographicpixels.com/misc/faq)
- [Get started, youtube video](https://www.youtube.com/watch?v=AUaiQRMjJZo)
- [Our Discord server](https://discord.gg/UgPRaGRkrQ)
- [Our Guilded server](https://www.guilded.gg/i/ExPXPrwE)


# 🌟 Get started

<figure><img src="https://images-ext-1.discordapp.net/external/hpMY7GrDRdqgDuwOqNmDYEgomOGjf97p4_7QCfenuFs/%3Fw%3D3796%26h%3D1640/https/s3-us-west-2.amazonaws.com/www.guilded.gg/ContentMediaGenericFiles/fd1c2baad81023a365cd510eb2a48fc5-Full.webp?width=2046&height=884" alt=""><figcaption></figcaption></figure>

## Get started, it's easy.

You'll need to download Node (npm).

### Install the Nightly build

Install the package with npm:
```bash
npm install dinographicpixels/touchguild#nightly
```

### Basic scripting (ping, pong!)

Let's get started, it'll be easy examples for ya!

For example, we'll create a simple ping pong script, a well known command!

Javascript & Typescript:

```javascript
const TouchGuild = require('TouchGuild') // import for CommonJS
// import * as TouchGuild from 'TouchGuild' // import for ESM & TS

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

## Stable builds
Install stable builds with npm:
```bash
npm install touchguild@latest
```
Install stable builds with yarn:
```bash
yarn add touchguild
```
