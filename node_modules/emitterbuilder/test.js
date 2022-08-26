const emitterBuilder = require('./dist/main') // importing
const Event1 = new emitterBuilder()
const Event2 = new emitterBuilder({ignoreWarns: true}) // ignoreWarns is set to false by default.

Event1.on('hi', (message)=> {console.log(message)}) // reply to 'hi', getting message string and logging.
Event2.on('bye', (message)=> {console.log(message, ':(')}) // reply to 'bye', getting message string and logging.

Event1.emit('hi', 'hello world!') // emit 'hi' with 'hello world' as a message.
Event1.removeAllListeners('hi') // removes all listeners detecting 'hi' emits
Event1.emit('hi', "that won't work") // error: emit cannot be received. (if you didn't set ignoreWarns to true)

///////////////
Event1.on('hi', (user)=> {console.log(`hi, ${user}`)})
Event1.on('goodbye', (user, extrargs, doce)=> {console.log('bye!', user, extrargs, doce)})
Event1.emit('goodbye', 'james', 'some extra args there', 'and here!')



Event1.resetListeners() // resets/removes all listeners from Event1, including on & once events.
// resetListeners() returns a boolean, so you can check if the resetListeners method has been executed successfully or failed.
// the returned value will be mostly true.


// You detect 2 types of emits, on and once.
// .on is used to detect everytime the specified value is emitted.
// .once is used to detect only ONE time a specified value is emitted.

Event1.on('hi', (user)=> {console.log(`hi, ${user}`)})
Event1.emit('hi', 'gamer'); Event1.emit('hi', 'gamer'); // by using .on, the event can be executed many times i'd like.

Event1.once('test', (user)=> {console.log(`just tesing, ${user}`)})
Event1.emit('test', 'gaming') // it works properly one time.
Event1.emit('test', 'gaming') // and.. it doesn't work!

// You also have multiple types of remove & reset such as:
// .removeAllListeners(name)
// .removeListener(name, listenerToRemove)
// .removeONCElisteners(name)
// .removeONlisteners(name)

// Event1.resetListeners()
// Event1.resetONlisteners()
// Event1.resetONCElisteners()

// & even more, read docs (github wiki).