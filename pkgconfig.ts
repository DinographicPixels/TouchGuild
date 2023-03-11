import * as pkg from "./package.json";
import { GatewayVersion, GatewayURL } from "guildedapi-types.ts/v1";
export const config = {
    name:          "TouchGuild",
    branch:        "Stable build",
    version:       pkg.version,
    NodeJSVersion: process.version,
    GuildedAPI:    {
        GatewayVersion,
        GatewayURL,
        APIURL: `https://www.guilded.gg/api/v${GatewayVersion}`
    }
};
