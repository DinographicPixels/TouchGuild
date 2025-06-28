
//
// © 2024–present Dinographic. All rights reserved.
//

import type { ExclusifyUnion } from "./shared";
import type { ApplicationCommandType, Locales, ApplicationCommandOptionTypes } from "../Constants";

export interface ApplicationCommand {
    name: string;
    nameLocalizations?: Partial<Record<Locales, string>>;
    options?: Array<ApplicationCommandOption>;
    type: ApplicationCommandType;
}

export interface PrivateApplicationCommand extends ApplicationCommand {
    guildID?: string;
    private: true;
    userID?: string;
}

export interface ApplicationCommandOptionBase<T extends ApplicationCommandOptionTypes = ApplicationCommandOptionTypes> {
    name: string;
    required: boolean;
    type: T;
}

export interface ApplicationCommandOptionsChoices<T extends ApplicationCommandOptionTypes = ApplicationCommandOptionTypes> {
    choices: Array<{
        name: string;
        value: T extends ApplicationCommandOptionTypes.STRING ? string : number;
    }>;
}

export interface ApplicationCommandOptionsMinMaxValue {
    maxValue?: number;
    minValue?: number;
}

export interface ApplicationCommandOptionsMinMaxLength {
    maxLength?: number;
    minLength?: number;
}

export type ApplicationCommandOptionWithChoices =
  ApplicationCommandOptionsString
  | ApplicationCommandOptionsNumber
  | ApplicationCommandOptionsFloat
  | ApplicationCommandOptionsSigned32Integer
  | ApplicationCommandOptionsInteger;


export type ApplicationCommandOptionsString =
  ApplicationCommandOptionBase<ApplicationCommandOptionTypes.STRING> &
  ExclusifyUnion<
  ApplicationCommandOptionsMinMaxLength |
  ApplicationCommandOptionsChoices<ApplicationCommandOptionTypes.STRING>
  >;


export type ApplicationCommandOptionsNumber =
  ApplicationCommandOptionBase<ApplicationCommandOptionTypes.NUMBER> &
  ExclusifyUnion<
  ApplicationCommandOptionsMinMaxValue |
  ApplicationCommandOptionsChoices<ApplicationCommandOptionTypes.NUMBER>
  >;


export type ApplicationCommandOptionsFloat =
  ApplicationCommandOptionBase<ApplicationCommandOptionTypes.FLOAT> &
  ExclusifyUnion<
  ApplicationCommandOptionsMinMaxValue |
  ApplicationCommandOptionsChoices<ApplicationCommandOptionTypes.FLOAT>
  >;


export type ApplicationCommandOptionsSigned32Integer =
  ApplicationCommandOptionBase<ApplicationCommandOptionTypes.SIGNED_32_INTEGER> &
  ExclusifyUnion<
  ApplicationCommandOptionsMinMaxValue |
  ApplicationCommandOptionsChoices<ApplicationCommandOptionTypes.SIGNED_32_INTEGER>
  >;


export type ApplicationCommandOptionsInteger =
  ApplicationCommandOptionBase<ApplicationCommandOptionTypes.INTEGER> &
  ExclusifyUnion<
  ApplicationCommandOptionsMinMaxValue |
  ApplicationCommandOptionsChoices<ApplicationCommandOptionTypes.INTEGER>
  >;

export interface ApplicationCommandOptionsChannel extends ApplicationCommandOptionBase<ApplicationCommandOptionTypes.CHANNEL> {}
export interface ApplicationCommandOptionsBoolean extends ApplicationCommandOptionBase<ApplicationCommandOptionTypes.BOOLEAN> {}
export interface ApplicationCommandOptionsRole extends ApplicationCommandOptionBase<ApplicationCommandOptionTypes.ROLE> {}
export interface ApplicationCommandOptionsUser extends ApplicationCommandOptionBase<ApplicationCommandOptionTypes.USER> {}
export interface ApplicationCommandOptionsEmote extends ApplicationCommandOptionBase<ApplicationCommandOptionTypes.EMOTE> {}
export interface ApplicationCommandOptionsEmbeddedAttachment extends ApplicationCommandOptionBase<ApplicationCommandOptionTypes.EMBEDDED_ATTACHMENT> {}

export type ApplicationCommandOption =
  | ApplicationCommandOptionsString
  | ApplicationCommandOptionsNumber
  | ApplicationCommandOptionsFloat
  | ApplicationCommandOptionsSigned32Integer
  | ApplicationCommandOptionsInteger
  | ApplicationCommandOptionsChannel
  | ApplicationCommandOptionsBoolean
  | ApplicationCommandOptionsRole
  | ApplicationCommandOptionsUser
  | ApplicationCommandOptionsEmote
  | ApplicationCommandOptionsEmbeddedAttachment;


export interface ClientApplication {
    appShortname: string;
    commands: Array<ApplicationCommand | PrivateApplicationCommand>;
    enabled: boolean;
}
