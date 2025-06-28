/** @module GatewayError */

//
// © 2022–present Dinographic. All rights reserved.
//

/** Error coming from the gateway. */
export default class GatewayError extends Error {
    code: number;
    constructor(message: string, code: number) {
        super(message);
        this.code = code;
        this.name = "GatewayError";
    }
}
