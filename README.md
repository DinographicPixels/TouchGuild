<p align="center">
  <img width=80% src="https://images-ext-1.discordapp.net/external/hpMY7GrDRdqgDuwOqNmDYEgomOGjf97p4_7QCfenuFs/%3Fw%3D3796%26h%3D1640/https/s3-us-west-2.amazonaws.com/www.guilded.gg/ContentMediaGenericFiles/fd1c2baad81023a365cd510eb2a48fc5-Full.webp?width=2046&height=884">
  <br>
  <a href="https://npmjs.com/package/touchguild"><img src="https://img.shields.io/npm/v/touchguild.svg?style=flat-square&color=informational"></a>
  <img src="https://img.shields.io/github/stars/DinographicPixels/TouchGuild?color=yellow&style=flat-square">
  <img src="https://img.shields.io/npm/dw/touchguild?color=red&style=flat-square">
</p>


```javascript
const TouchGuild = require('touchguild'); // import for CommonJS
// import * as TouchGuild from 'touchguild' // import for ESM & TS

const client = new TouchGuild.Client({token: 'insert token here'});

client.on('ready', ()=> {
   console.log("I'm ready!");
});

client.on('error', ()=> {
   console.error("Whoops, somethin' went wrong..");
});

client.connect();

```

## This build is a development build. (Nightly)
Nightly builds are in development builds and features are constantly added & we also note that those builds can have bugs.

----

# Installation
NodeJS **16.16.0** or higher is required.

Install the package with NPM through GitHub:
```bash
npm install dinographicpixels/touchguild#nightly
```

Install the package through NPM:
```bash
npm install touchguild@nightly
```

----------------

# What's new on Nightly builds?
- **Lock & unlock forum topic methods for both Client and ForumTopic components.**
- [Guild XP Management including set/award xp.](https://github.com/DinographicPixels/TouchGuild/pull/14)
- disconnect() method for Client
- Fixed: ['messageDelete's oldContent is null (couldn't get oldContent from cache)'](https://github.com/DinographicPixels/TouchGuild/issues/10)
- Deleted unused importations
- Types are now in one file
- Fixed: [Issue while importing TouchGuild on repl.it](https://github.com/DinographicPixels/TouchGuild/issues/12)
- Improved [websocket & moved packet parsing.](https://github.com/DinographicPixels/TouchGuild/pull/13)
- [Added DevTools to the TouchGuild's index.](https://github.com/DinographicPixels/TouchGuild/pull/15)

[Check new practical features you can use.](https://docs.touchguild.dinographicpixels.com/nightly/features)

--------------

# LINKS:
### Repository & NPM
- [NPM Package](https://www.npmjs.com/package/touchguild)
- [GitHub](https://github.com/DinographicPixels/TouchGuild)

### Guide & documentation
- [Guide](https://docs.touchguild.dinographicpixels.com/guide/get-started)
- [Documentation](https://docs.touchguild.dinographicpixels.com/documentation/home)

### Additional links
- [Our vision of the project](https://docs.touchguild.dinographicpixels.com/misc/our-vision)
- [FAQ](https://docs.touchguild.dinographicpixels.com/misc/faq)
- [Get started, youtube video](https://www.youtube.com/watch?v=AUaiQRMjJZo)

### Our servers
- [Our Discord server](https://discord.gg/UgPRaGRkrQ)
- [Our Guilded server](https://www.guilded.gg/i/ExPXPrwE)
