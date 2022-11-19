<p align="center">
<a href="https://touchguild.com/"><img width=80% src="https://cdn.glitch.global/bc68313e-6abb-488c-a1e3-e6d10817c2bd/touchguild-cradius.png?v=1665311272247"></a>
  <br>
  <a href="https://npmjs.com/package/touchguild"><img src="https://img.shields.io/npm/v/touchguild.svg?style=flat-square&color=informational"></a>
   <a href="https://github.com/DinographicPixels/TouchGuild/stargazers"><img src="https://img.shields.io/github/stars/DinographicPixels/TouchGuild?color=yellow&style=flat-square"></a>
  <img src="https://img.shields.io/npm/dw/touchguild?color=red&style=flat-square">
</p>


```js
const { Client } = require('touchguild')
const client = new Client({token: 'TOKEN'});

client.on('ready', () => {
   console.log(`Logged as ${client.user.username}`);
});

client.on('error', (err) => {
   console.error(err);
});

client.connect();

```

For more examples, check out the [examples](https://github.com/DinographicPixels/TouchGuild/tree/dev/examples) folder on GitHub.
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

## Links:
- [Website](https://touchguild.com/)
- [Guide](https://guide.touchguild.com/)
- [Release documentation](https://docs.touchguild.com/)
- [Development documentation](https://docs.touchguild.com/dev/)
- [Discord server](https://discord.gg/UgPRaGRkrQ)
- [Guilded server](https://www.guilded.gg/i/ExPXPrwE)
