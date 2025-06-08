<p align="center">
<a href="https://touchguild.com/"><img width=100% src="https://github.com/Dinographic/TouchGuild/raw/dev/images/touchguild-banner-2025.png"></a>
  <br>
  <a href="https://npmjs.com/package/touchguild"><img src="https://img.shields.io/npm/v/touchguild.svg?style=rounded&color=informational"></a>
   <a href="https://github.com/Dinographic/TouchGuild/stargazers"><img src="https://img.shields.io/github/stars/Dinographic/TouchGuild?color=yellow&style=rounded"></a>
  <a href="https://npmjs.com/package/touchguild"><img href="https://npmjs.com/package/touchguild" src="https://img.shields.io/npm/dt/touchguild?color=red&style=rounded"></a>
  <a href="https://npmjs.com/package/touchguild"><img href="https://npmjs.com/package/touchguild" src="https://img.shields.io/npm/dw/touchguild?color=red&style=rounded"></a>
</p>


```js
const { Client } = require("touchguild");
const client = new Client({ token: "TOKEN" });

client.on("ready", () => {
    console.log(`Logged as ${client.user.username}`);
});

client.on('error', (err) => {
    console.error(err);
});

client.connect();
```

For more examples, check out the [examples](https://github.com/Dinographic/TouchGuild/tree/dev/examples) folder on GitHub.
<hr>

## Installation
NodeJS **16.16.0** or higher is required.
**Check out [Development Builds](#development-builds) if you wish to install in-dev versions.**

```sh
npm install touchguild
```

### Development Builds
```sh
npm install touchguild@dev
```

The documentation under `dev` is always for the latest commit. If something isn't working that's in the documentation, you're likely looking at the wrong documentation.

<hr>

## 🔬 Data & Analytics
Data collection is enabled by default for improving and making statistics.
This includes collecting application IDs, guild count, build info, method execution counts, latency data, and application command usage.

[Learn more](https://guide.touchguild.com/data-and-analytics) –– [Privacy Policy](https://guide.touchguild.com/privacy-policy)

For transparency, you can review the source code.

If this is a concern and you rather opt out, consider disabling the `dataCollection` client option.

If some of your data have already been collected and want to the removal of them, consider contacting us: support@dinographicpixels.com

<hr>

## Links:
#### Ressources
- [Website](https://touchguild.com/)
- [Guide](https://guide.touchguild.com/)
- [Release documentation](https://docs.touchguild.com/)
- [Development documentation](https://docs.touchguild.com/dev/)
#### Policies
- [Privacy Policy](https://guide.touchguild.com/privacy-policy)
#### Community
- [Discord server](https://discord.gg/UgPRaGRkrQ)
- [Guilded server](https://www.guilded.gg/i/ExPXPrwE)
