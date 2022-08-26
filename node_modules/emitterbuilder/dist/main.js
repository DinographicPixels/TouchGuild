'use strict';
module.exports = class emitterbuilder {
    constructor(options = { ignoreWarns: false }) {
        this._events = { on: {}, once: {} };
        this.options = options;
    }
    on(name, listener) {
        if (!this._events[name]) {
            this._events['on'][name] = [];
        }
        this._events['on'][name].push(listener);
    }
    once(name, listener) {
        if (!this._events[name]) {
            this._events['once'][name] = [];
        }
        this._events['once'][name].push(listener);
    }
    removeListener(name, listenerToRemove) {
        if (!this._events['on'][name]) {
            if (this.options.ignoreWarns == false) {
                return console.log(`EmitterBuilder Warning: Can't remove requested listener. Event Emitter: ${name} does not exist.`);
            }
            else
                return;
        }
        const filterListeners = (listener) => listener !== listenerToRemove;
        this._events['on'][name] = this._events['on'][name].filter(filterListeners);
    }
    removeAllListeners(name) {
        delete this._events['on'][name];
        delete this._events['once'][name];
    }
    removeONlisteners(name) {
        this._events['on'][name] = undefined;
    }
    removeONCElisteners(name) {
        this._events['on'][name] = undefined;
    }
    resetListeners() {
        this._events = { on: {}, once: {} };
        if (this._events == { on: {}, once: {} }) {
            return true;
        }
        else
            return false;
    }
    resetONlisteners() {
        this._events['on'] = {};
        return true;
    }
    resetONCElisteners() {
        this._events['once'] = {};
        return true;
    }
    emit(name, ...args) {
        if (!this._events['on'][name] && !this._events['once'][name]) {
            if (this.options.ignoreWarns == false) {
                return console.log(`EmitterBuilder Warning: Emit cannot be received. [${name}]`);
            }
            else
                return;
        }
        const fireCallbacks = (callback) => {
            callback(...args);
        };
        if (this._events['on'][name]) {
            this._events['on'][name].forEach(fireCallbacks);
        }
        else if (this._events['once'][name]) {
            this._events['once'][name].forEach(fireCallbacks);
            this._events['once'][name] = undefined;
        }
    }
    manager() {
        return {
            _events: this._events,
            options: this.options
        };
    }
};
