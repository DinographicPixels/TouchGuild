<p align="center">
  <img width=80% src="https://cdn.glitch.global/bc68313e-6abb-488c-a1e3-e6d10817c2bd/touchguild-cradius.png?v=1665311272247">
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
   console.log(`Logged as ${client.user.username}`);
});

client.on('error', (err)=> {
   console.error("Whoops, somethin' went wrong..", err);
});

client.connect();

```

## Early access note:
The Guilded API is in Early access, the access is limited to a group of people & things changes quickly, so that is why TouchGuild is in Early access. Not everyone can use TouchGuild for now, please wait for the Guilded API's public release or apply to the Guilded API server to give it a try.

----

# Installation
NodeJS **16.16.0** or higher is required.

```bash
npm install touchguild@latest
```

----------------

# What's new?

[MAJOR CHANGES: Check out what's new](hhttps://docs.touchguild.dinographicpixels.com/documentation/select-version/v.0.1.7/whats-new)

--------------

# LINKS:
### Repository & NPM
- [NPM Package](https://www.npmjs.com/package/touchguild)
- [GitHub](https://github.com/DinographicPixels/TouchGuild)

### Guide & documentation
- [Guide](https://guide.touchguild.dinographicpixels.com/)
- [Documentation](https://docs.touchguild.dinographicpixels.com/)

### Additional links
- [Our vision of the project](https://docs.touchguild.dinographicpixels.com/misc/our-vision)
- [FAQ](https://docs.touchguild.dinographicpixels.com/misc/faq)
- [Get started, youtube video](https://www.youtube.com/watch?v=AUaiQRMjJZo)

### Our servers
- [Our Discord server](https://discord.gg/UgPRaGRkrQ)
- [Our Guilded server](https://www.guilded.gg/i/ExPXPrwE)
