"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SYNCFETCH = exports.FETCH = void 0;
const node_fetch_commonjs_1 = __importDefault(require("node-fetch-commonjs"));
const sync_fetch_1 = __importDefault(require("sync-fetch"));
function FETCH(method, endpoint, TOKEN, BODY) {
    return __awaiter(this, void 0, void 0, function* () {
        var fetchparams = {
            method: method,
            headers: {
                Authorization: `Bearer ${TOKEN}`,
                Accept: "application/json",
                "Content-type": "application/json"
            },
            protocol: "HTTPS"
        };
        if (method.toUpperCase() !== 'GET' && method.toUpperCase() !== 'HEAD' && BODY) {
            Object.assign(fetchparams, { body: BODY });
        }
        let fetching = yield (0, node_fetch_commonjs_1.default)(`https://www.guilded.gg/api/v1${endpoint}`, fetchparams);
        let response = yield fetching.json();
        if (response.code && response.message) {
            console.log(response);
            throw new TypeError(`${response.code} | ${response.message}`);
        }
        ;
        return response;
    });
}
exports.FETCH = FETCH;
function SYNCFETCH(method, endpoint, TOKEN, BODY) {
    var fetchparams = {
        method: method,
        headers: {
            Authorization: `Bearer ${TOKEN}`,
            Accept: "application/json",
            "Content-type": "application/json"
        }
    };
    if (method.toUpperCase() !== 'GET' && method.toUpperCase() !== 'HEAD' && BODY) {
        Object.assign(fetchparams, { body: BODY });
    }
    let fetching = (0, sync_fetch_1.default)(`https://www.guilded.gg/api/v1${endpoint}`, fetchparams);
    let response = fetching.json();
    if (response.code && response.message) {
        console.log(response);
        throw new TypeError(`${response.code} | ${response.message}`);
    }
    ;
    return response;
}
exports.SYNCFETCH = SYNCFETCH;
