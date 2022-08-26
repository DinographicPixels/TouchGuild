# emitterbuilder
#### Made to create event emitter easily.

## What's new?
- `.emit` supports extra args.
- docs are up to date.
- no more useless cback logging

## How to use it? Get started.
### Install package:
With npm: `npm install emitterbuilder@latest`

With yarn: `not available yet.`

### Import package & create event emitter:
```javascript
const emitterbuilder = require('emitterbuilder') // importing
const Event1 = new emitterbuilder() // create event, you can create many as you want.
```

### Receive & emit events.

```javascript
Event1.on('hi', ()=> {console.log('hello!')}) // receive
Event1.emit('hi') // emit 'hi' to Event1
// note: emit supports args so you can use it like: Event1.emit('hi', myVar).
```

#### Need to receive only once? Use `.once`

```javascript
Event1.once('hi', ()=> {console.log('hello!')}) // receive
Event1.emit('hi') // emit 'hi' to Event1 & works properly.
Event1.emit('hi') // won't work.
```

### Removing listener(s)
``` javascript
Event1.removeListener(name, fn) // removes only 1 selected listener.
Event1.removeAllListeners('hi') //  removes all listeners receiving 'hi'.
Event1.removeONlisteners('hi') // removes all '.on' listeners receiving 'hi'
Event1.removeONCElisteners('hi') // removes all '.once' listeners receiving 'hi'
```

### Reset listeners
``` javascript
Event1.resetListeners(); // resets/removes every listeners & resetListeners() returns a boolean.
Event1.resetONlisteners(); // resets/removes every '.on' listeners.
Event1.resetONCElisteners(); // resets/removes every '.once' listeners.
```

### Misc
```javascript
Event1.manager() // returns an Object with _events & options. Can be used to debug.
```

### Example of usage:
```javascript
const emitterbuilder = require('emitterbuilder');
const Event1 = new emitterbuilder();

Event1.on('send_message', (message)=> {
   console.log(message);
   Event1.emit('end');
})

Event1.on('end', ()=> { console.log('ouch, goodbye!'); Event1.resetListeners(); })

Event1.emit('send_message', 'hi bro!');
// and there's a lot to do!
```

## [Check the 'docs' for more information.](https://github.com/DinographicPixels/emitterbuilder/wiki)
### [Report issue or send a feature request](https://github.com/DinographicPixels/emitterbuilder/issues)
### [Discord server](https://discord.gg/UgPRaGRkrQ)
