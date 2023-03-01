import { Client } from "../../lib";
const client = new Client({ token: process.env.TOKEN as string });

let ready = false;

client.on("ready", () => {
    console.log(`Logged as ${client.user?.username}`);
    ready = true;
    client.disconnect();
});

client.on('error', (err) => {
    console.error(err);
});

client.connect();

setTimeout(() => {
    throw new Error("Test failed.");
}, 10*1000);
