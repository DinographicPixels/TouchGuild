/** @module Types/Shared */

export type AllKeys<T> = T extends unknown ? keyof T : never;
export type Id<T> = T extends infer U ? { [K in keyof U]: U[K] } : never;
export type _ExclusifyUnion<T, K extends PropertyKey> = T extends unknown ? Id<T & Partial<Record<Exclude<K, keyof T>, never>>> : never;
export type ExclusifyUnion<T> = _ExclusifyUnion<T, AllKeys<T>>;

// Credits to Oceanic.js for the useful tools (AllKeys, Id, _ExclusifyUnion, ExclusifyUnion)
// Enabling enforcement of mutually exclusive properties within a union type
// this, helping TypeScript's type narrowing system & improving type safety!

// Note: only works with TypeScript 5.4.5 and earlier versions, recommended type-safe environment.
