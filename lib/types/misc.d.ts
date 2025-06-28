/** @module Types/Misc */

//
// © 2024–present Dinographic. All rights reserved.
//

export interface DataCollectionProfile {
    appID: string;
    appName: string;
    appShortname: string;
    appUserID: string;
    build: "stable" | "dev";
    buildVersion: string;
    guildCount: number;
    ownerID: string;
}
