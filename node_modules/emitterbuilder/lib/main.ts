'use strict'

export = class emitterbuilder {
    _events: any; options: { ignoreWarns: boolean }
    constructor(options = {ignoreWarns: false}) {
        this._events = {on: {}, once: {}};
        this.options = options;
    }
  
    on(name: string | number, listener: any) {
      if (!this._events[name]) {
        this._events['on'][name] = [];
      }

      this._events['on'][name].push(listener);
    }

    once(name: string | number, listener: any){
        if (!this._events[name]) {
            this._events['once'][name] = [];
          }

          this._events['once'][name].push(listener);
    }
  
    removeListener(name: string | number, listenerToRemove: any) {
      if (!this._events['on'][name]) {
        if (this.options.ignoreWarns == false){
            return console.log(`EmitterBuilder Warning: Can't remove requested listener. Event Emitter: ${name} does not exist.`);
        }else return;
      }
  
      const filterListeners = (listener: any) => listener !== listenerToRemove;
  
      this._events['on'][name] = this._events['on'][name].filter(filterListeners);
    }

    removeAllListeners(name: string | number){
        delete this._events['on'][name];
        delete this._events['once'][name];
    }

    removeONlisteners(name: string | number){
        this._events['on'][name] = undefined;
    }

    removeONCElisteners(name: string | number){
        this._events['on'][name] = undefined;
    }

    resetListeners(){
        this._events = {on: {}, once: {}};
        if (this._events == {on: {}, once: {}}){
            return true;
        }else return false;
    }

    resetONlisteners(){
        this._events['on'] = {}; return true;
    }

    resetONCElisteners(){
        this._events['once'] = {}; return true;
    }
  
    emit(name: string | number, ...args: any[]) {
      if (!this._events['on'][name] && !this._events['once'][name]) {
        if (this.options.ignoreWarns == false){
            return console.log(`EmitterBuilder Warning: Emit cannot be received. [${name}]`);
        }else return;
      }
  
      const fireCallbacks = (callback: (...args: any[]) => void) => {
        callback(...args);
      };

      if (this._events['on'][name]){
        this._events['on'][name].forEach(fireCallbacks);
      }else if (this._events['once'][name]){
        this._events['once'][name].forEach(fireCallbacks);
        this._events['once'][name] = undefined;
      }
    }

    manager(){
        return {
            _events: this._events,
            options: this.options
        }
    }
}