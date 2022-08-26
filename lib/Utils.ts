import fetch from 'node-fetch-commonjs';
import syncfetch from 'sync-fetch';

export async function FETCH(method: string, endpoint: string, TOKEN: any, BODY:string|any){
    var fetchparams:object = {
        method: method,
        headers: {
          Authorization: `Bearer ${TOKEN}`,
          Accept: "application/json",
          "Content-type": "application/json"
        },
        protocol: "HTTPS"
    }
    if (method.toUpperCase() !== 'GET' && method.toUpperCase() !== 'HEAD' && BODY){
        Object.assign(fetchparams, {body: BODY});
    }

    let fetching = await fetch(`https://www.guilded.gg/api/v1${endpoint}`, fetchparams)

    let response:any = await fetching.json();
    if (response.code && response.message) {console.log(response); throw new TypeError(`${response.code} | ${response.message}`)};
    return response;
}


export function SYNCFETCH(method: string, endpoint: string, TOKEN: any, BODY:string|any){
    var fetchparams:object = {
        method: method,
        headers: {
          Authorization: `Bearer ${TOKEN}`,
          Accept: "application/json",
          "Content-type": "application/json"
        }
    }
    if (method.toUpperCase() !== 'GET' && method.toUpperCase() !== 'HEAD' && BODY){
        Object.assign(fetchparams, {body: BODY});
    }

    let fetching = syncfetch(`https://www.guilded.gg/api/v1${endpoint}`, fetchparams)

    let response:any = fetching.json();
    if (response.code && response.message) {console.log(response); throw new TypeError(`${response.code} | ${response.message}`)};
    return response;
}