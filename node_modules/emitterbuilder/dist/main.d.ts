declare const _default: {
    new (options?: {
        ignoreWarns: boolean;
    }): {
        _events: any;
        options: {
            ignoreWarns: boolean;
        };
        on(name: string | number, listener: any): void;
        once(name: string | number, listener: any): void;
        removeListener(name: string | number, listenerToRemove: any): void;
        removeAllListeners(name: string | number): void;
        removeONlisteners(name: string | number): void;
        removeONCElisteners(name: string | number): void;
        resetListeners(): boolean;
        resetONlisteners(): boolean;
        resetONCElisteners(): boolean;
        emit(name: string | number, ...args: any[]): void;
        manager(): {
            _events: any;
            options: {
                ignoreWarns: boolean;
            };
        };
    };
};
export = _default;
