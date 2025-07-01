
//
// © 2024–present Dinographic. All rights reserved.
//

import type {
    AnyChannel,
    ApplicationCommandOption,
    InteractionOptionWrapperData,
    MessageAttachment,
    VerifyOptionsData
} from "../types";
import type { Client } from "../structures/Client";
import { ApplicationCommandOptionTypes, ValueTranspositionStates } from "../Constants";
import { fetch } from "undici";
import type { APIURLSignature } from "guildedapi-types.ts/v1";

/**
 * Application Command Smart Resolver (ACSR)
 * Where options, values are extracted, dynamically reordered and resolved.
 * InteractionOptionWrapper not only handles the core structure of command resolution,
 * but also provides type-safe methods to access option values.
 */
export class InteractionOptionWrapper {
    #client: Client;
    #data: InteractionOptionWrapperData;
    optionalOptions: Array<ApplicationCommandOption>;
    requiredOptions: Array<ApplicationCommandOption>;
    valueTranspositionMap: Array<ValueTranspositionStates>;
    values: Array<string | number | boolean>;
    constructor(data: InteractionOptionWrapperData, client: Client) {
        this.#data = data;
        this.#client = client;
        this.values = this.extractValues(data.content);
        this.valueTranspositionMap = this.getValueTranspositionMap;
        this.requiredOptions =
            data.dynamicallyOrderedAppCmd.options ?
                data.dynamicallyOrderedAppCmd.options
                    .filter(opt => opt.required)
                : [];
        this.optionalOptions =
          data.dynamicallyOrderedAppCmd.options ?
              data.dynamicallyOrderedAppCmd.options
                  .filter(opt => !opt.required)
              : [];
        this.dynamicOptionReordering();
    }

    private dynamicOptionReordering(): void {
        if (!this.#data.dynamicallyOrderedAppCmd.options) return;

        const optionalTypes = this.#data.dynamicallyOrderedAppCmd.options
            .filter(opt => !opt.required)
            .map(opt => opt.type);

        if (optionalTypes.length > new Set(optionalTypes).size) return;

        const positionals = this.valueTranspositionMap.flatMap((v, i) =>
            v === ValueTranspositionStates.POSITIONAL ? i : []
        );

        const requiredOptions = this.#data.dynamicallyOrderedAppCmd.options.filter(opt => opt.required);
        const optionalOptions = this.#data.dynamicallyOrderedAppCmd.options.filter(opt => !opt.required);
        const optionalPositionals = positionals.slice(requiredOptions.length);

        const userOrderedDefinedOptionals: Array<ApplicationCommandOption> = [];
        const undefinedOptionals: Array<ApplicationCommandOption> = [];

        for (const valuesIndex of optionalPositionals) {
            const value = this.values[valuesIndex];
            let matchedOption: ApplicationCommandOption | null = null;

            for (const option of optionalOptions) {
                if (userOrderedDefinedOptionals.includes(option))
                    continue;

                const isValid = this.isValueCompatibleWithOption(value, option);

                if (isValid) {
                    matchedOption = option;
                    break;
                }
            }

            if (matchedOption)
                userOrderedDefinedOptionals.push(matchedOption);
        }

        for (const option of optionalOptions) {
            if (!userOrderedDefinedOptionals.includes(option))
                undefinedOptionals.push(option);
        }

        this.#data.dynamicallyOrderedAppCmd.options = [
            ...requiredOptions,
            ...userOrderedDefinedOptionals,
            ...undefinedOptionals
        ];
    }

    private extractValues(text: string): Array<string | number> {
        const tokens: Array<string> = [];
        const tokenPattern = /"[^"]*"|<[#&@][\w-]+>|<@&[\w-]+>|<a?:\w+:\d+>|\S+/g;
        let match: RegExpExecArray | null;

        while ((match = tokenPattern.exec(text)) !== null) {
            tokens.push(match[0]);
        }

        const result: Array<string | number> = [];

        for (const token of tokens) {
            if (token.startsWith('"') && token.endsWith('"')) {
                result.push(token.slice(1, -1));
                continue;
            }

            if (/^<[#&@][\w-]+>$/.test(token) || /^<@&[\w-]+>$/.test(token)) {
                const cleaned = token.replace(/^<[#&@]([\w-]+)>$/, "$1").replace(/^<@&([\w-]+)>$/, "$1");
                result.push(cleaned);
                continue;
            }

            if (/^<a?:\w+:\d+>$/.test(token)) {
                result.push(token);
                continue;
            }

            const colonIndex = token.indexOf(":");
            if (colonIndex > 0 && colonIndex < token.length - 1) {
                const key = token.slice(0, colonIndex);
                let rawValue = token.slice(colonIndex + 1);

                if (rawValue.startsWith('"') && rawValue.endsWith('"'))
                    rawValue = rawValue.slice(1, -1);

                const numValue = Number(rawValue);
                const value = isNaN(numValue) ? rawValue : numValue;

                result.push(key + ":", value);
            } else {
                const numValue = Number(token);
                result.push(isNaN(numValue) ? token : numValue);
            }
        }

        result.shift();
        if (this.#data.executionType === "full") {
            result.shift();
        }

        return result;
    }

    private getMentionOptions<T = string | number | boolean>(name: string, type: ApplicationCommandOptionTypes): { name: string; value: T; } | undefined {
        if (!this.#data.dynamicallyOrderedAppCmd) return;
        const appCmdOptions = this.#data.dynamicallyOrderedAppCmd.options;
        const {
            optionIndex,
            isPositional,
            positionals,
            positionalIndex,
            explicitIndex,
            optionValue: _optionValue
        } = this.resolveTransposedOption(name, type);
        let optionValue = _optionValue;
        if (!optionIndex && optionIndex !== 0) return;
        if (isPositional && (positionalIndex === null || positionalIndex === undefined || this.values[positionals[positionalIndex]] === undefined)) return;
        if (!isPositional && (explicitIndex === null || explicitIndex === undefined || explicitIndex === -1)) return;
        if (!appCmdOptions || appCmdOptions && !this.isValueCompatibleWithOption(optionValue, appCmdOptions[optionIndex])) return;

        if (type === ApplicationCommandOptionTypes.INTEGER)
            optionValue = Math.trunc(Number(optionValue));
        if (type === ApplicationCommandOptionTypes.EMBEDDED_ATTACHMENT) {
            const regExp = /!\[]\((https:\/\/[^)]+)\)/g;
            const regExpArray: Array<string> = regExp.exec(optionValue.toString()) ?? [];
            optionValue = regExpArray[0];
        }
        if (type === ApplicationCommandOptionTypes.BOOLEAN) {
            optionValue =
              typeof optionValue === "string"
                  ? optionValue = ["true", "1"].includes(optionValue.toLowerCase())
                  : (typeof optionValue === "number" ? optionValue === 1 : Boolean(optionValue));
        }
        if (type === ApplicationCommandOptionTypes.EMOTE && typeof optionValue !== "number") {
            const emoteID = Number((optionValue as string)?.match(/<:\w+:(\d+)>/)?.[1]);
            if (isNaN(emoteID)) return;
            optionValue = emoteID;
        }

        return {
            name,
            value: optionValue as T
        };
    }

    private isValueCompatibleWithOption(value: string | number | boolean, option: ApplicationCommandOption): boolean {
        switch (option.type) {
            case ApplicationCommandOptionTypes.STRING:
                if (typeof value !== "string") return false;
                break;
            case ApplicationCommandOptionTypes.INTEGER:
            case ApplicationCommandOptionTypes.SIGNED_32_INTEGER:
                if (typeof value === "string") {
                    const num = Number(value);
                    if (isNaN(num) || !Number.isInteger(num)) return false;
                    if (option.type === ApplicationCommandOptionTypes.SIGNED_32_INTEGER && (num < -2147483648 || num > 2147483647)) return false;
                } else if (typeof value === "number") {
                    if (!Number.isInteger(value)) return false;
                    if (option.type === ApplicationCommandOptionTypes.SIGNED_32_INTEGER && (value < -2147483648 || value > 2147483647)) return false;
                } else {
                    return false;
                }
                break;
            case ApplicationCommandOptionTypes.NUMBER:
            case ApplicationCommandOptionTypes.FLOAT:
                if (typeof value === "string") {
                    const num = Number(value);
                    if (isNaN(num)) return false;
                    if (option.type === ApplicationCommandOptionTypes.FLOAT && Number.isInteger(num)) return false;
                } else if (typeof value === "number") {
                    if (option.type === ApplicationCommandOptionTypes.FLOAT && Number.isInteger(value)) return false;
                } else {
                    return false;
                }
                break;
            case ApplicationCommandOptionTypes.BOOLEAN:
                if (typeof value === "boolean") return true;
                if (typeof value === "string" && ["true", "false", "1", "0"].includes(value.toLowerCase())) return true;
                if (typeof value === "number" && [0, 1].includes(value)) return true;
                return false;
            case ApplicationCommandOptionTypes.USER:
                return typeof value === "string" &&
                  this.#data.mentions?.users?.some(u => u.id === value) === true;
            case ApplicationCommandOptionTypes.CHANNEL:
                return typeof value === "string" &&
                  this.#data.mentions?.channels?.some(c => c.id === value) === true;
            case ApplicationCommandOptionTypes.ROLE:
                return typeof value === "number" &&
                  this.#data.mentions?.roles?.some(r => r.id === value) === true;
            case ApplicationCommandOptionTypes.EMOTE:
                if (typeof value === "number") {
                    return value >= 1000000 && value <= 9999999;
                }
                if (typeof value === "string") {
                    return /<a?:\w+:\d+>/.test(value);
                }
                return false;
            case ApplicationCommandOptionTypes.EMBEDDED_ATTACHMENT:
                return typeof value === "string" && value.includes("![](https://cdn.gilcdn.com/");
            default:
                return false;
        }

        if ("choices" in option && option.choices) {
            const convertedValue = typeof value === "string" && !isNaN(Number(value)) ? Number(value) : value;
            if (!option.choices.some(choice => choice.value === convertedValue)) {
                return false;
            }
        }

        if (typeof value === "string" && ("minLength" in option || "maxLength" in option)) {
            if (option.maxLength && value.length > option.maxLength) return false;
            if (option.minLength && value.length < option.minLength) return false;
        }

        if (typeof value === "number" && ("minValue" in option || "maxValue" in option)) {
            if (option.maxValue !== undefined && option.maxValue !== 0 && value > option.maxValue) return false;
            if (option.minValue !== undefined && value < option.minValue) return false;
        }

        return true;
    }

    private get getValueTranspositionMap(): Array<ValueTranspositionStates> {
        const valueTranspositionMap: Array<ValueTranspositionStates> = [];
        for (const [i, val] of this.values.entries()) {
            const prevIndex = i > 0 ? i - 1 : null;
            const nextIndex = i < this.values.length - 1 ? i + 1 : null;
            const isExplicitKey =
              typeof val === "string" &&
              val.endsWith(":") &&
              nextIndex !== null &&
              (
                  prevIndex === null ||
                [ValueTranspositionStates.POSITIONAL, ValueTranspositionStates.EXPLICIT_VALUE]
                    .includes(valueTranspositionMap[prevIndex])
              );
            if (isExplicitKey) {
                valueTranspositionMap.push(ValueTranspositionStates.EXPLICIT_OPTION);
            } else if (
                prevIndex !== null &&
              valueTranspositionMap[prevIndex] === ValueTranspositionStates.EXPLICIT_OPTION
            ) {
                valueTranspositionMap.push(ValueTranspositionStates.EXPLICIT_VALUE);
            } else {
                valueTranspositionMap.push(ValueTranspositionStates.POSITIONAL);
            }
        }
        return valueTranspositionMap;
    }

    /**
     * Get attachments from this Message (using REST)
     * *(works for embedded content such as images).*
     */
    async getAttachment(name: string, required?: false): Promise<MessageAttachment | undefined>;
    async getAttachment(name: string, required: true): Promise<MessageAttachment>;
    async getAttachment(name: string, required?: boolean): Promise<MessageAttachment | undefined> {
        const imageExtensions = new Set(["jpg", "jpeg", "png", "gif", "bmp", "webp", "svg"]);

        const attachmentURL = this.getAttachmentOption(name)?.value;
        if (!attachmentURL && required) throw new Error("Couldn't get attachment.");
        if (!attachmentURL) return;

        let signedURL: APIURLSignature | null = null;
        try {
            signedURL = (await this.#client.rest.misc.signURL({
                urls: [attachmentURL]
            })).urlSignatures[0];
        } catch {
            this.#client.emit(
                "error",
                new Error("Couldn't automatically sign attachment CDN URL.")
            );
        }

        const URLObject = new URL(attachmentURL);
        const pathName = URLObject.pathname;
        const extension = pathName.split(".").pop()?.toLowerCase() || "";
        const isImage = imageExtensions.has(extension);

        let arrayBuffer: ArrayBuffer | null = null;

        try {
            if (isImage) {
                const fetchData = await fetch(attachmentURL);
                arrayBuffer = await fetchData.arrayBuffer();
            }
        } catch {
            throw new Error("Couldn't get image ArrayBuffer data.");
        }

        return {
            originalURL:   attachmentURL,
            signedURL:     signedURL?.signature ?? null,
            isImage,
            arrayBuffer,
            fileExtension: extension
        };
    }


    getAttachmentOption(name: string, required?: false): { name: string; value: string; } | undefined;
    getAttachmentOption(name: string, required: true): { name: string; value: string; };
    getAttachmentOption(name: string, required?: boolean): { name: string; value: string; } | undefined {
        const option = this.getMentionOptions<string>(
            name,
            ApplicationCommandOptionTypes.EMBEDDED_ATTACHMENT
        );
        if (option === undefined && required) throw new Error("Couldn't get embedded attachment option.");
        return option;
    }

    getBooleanOption(name: string, required?: false): { name: string; value: boolean; } | undefined;
    getBooleanOption(name: string, required: true): { name: string; value: boolean; };
    getBooleanOption(name: string, required?: boolean): { name: string; value: boolean; } | undefined {
        const option = this.getMentionOptions<boolean>(
            name,
            ApplicationCommandOptionTypes.BOOLEAN
        );
        if (option === undefined && required) throw new Error("Couldn't get boolean option.");
        return option;
    }

    getChannel<T extends AnyChannel = AnyChannel>(name: string, required?: false): T | undefined;
    getChannel<T extends AnyChannel = AnyChannel>(name: string, required: true): T;
    getChannel<T extends AnyChannel = AnyChannel>(name: string, required?: boolean): T | undefined {
        const option = this.getChannelOption(name, false);
        const channel = this.#client.getChannel<T>(this.#data.guildID, option?.value ?? "none");
        if (!channel || option === undefined && required) throw new Error("Couldn't get channel from cache.");
        return channel;
    }
    getChannelOption(name: string, required?: false): { name: string; value: string; } | undefined;
    getChannelOption(name: string, required: true): { name: string; value: string; };
    getChannelOption(name: string, required?: boolean): { name: string; value: string; } | undefined {
        const option = this.getMentionOptions<string>(
            name,
            ApplicationCommandOptionTypes.CHANNEL
        );
        if (option === undefined && required) throw new Error("Couldn't get channel option.");
        return option;
    }

    getEmoteOption(name: string, required?: false): { name: string; value: number; } | undefined;
    getEmoteOption(name: string, required: true): { name: string; value: number; };
    getEmoteOption(name: string, required?: boolean): { name: string; value: number; } | undefined {
        const option = this.getMentionOptions<number>(
            name,
            ApplicationCommandOptionTypes.EMOTE
        );
        if (option === undefined && required) throw new Error("Couldn't get emote option.");
        return option;
    }

    getFloatOption<T extends number = number>(name: string, required?: false): { name: string; value: T; } | undefined;
    getFloatOption<T extends number = number>(name: string, required: true): { name: string; value: T; };
    getFloatOption<T extends number = number>(name: string, required?: boolean): { name: string; value: T; } | undefined {
        const option = this.getMentionOptions<number>(
            name,
            ApplicationCommandOptionTypes.FLOAT
        );
        if (option === undefined && required) throw new Error("Couldn't get float option.");
        return option as { name: string; value: T; } | undefined;
    }

    getIntegerOption<T extends number = number>(name: string, required?: false): { name: string; value: T; } | undefined;
    getIntegerOption<T extends number = number>(name: string, required: true): { name: string; value: T; };
    getIntegerOption<T extends number = number>(name: string, required?: boolean): { name: string; value: T; } | undefined {
        const option = this.getMentionOptions<number>(
            name,
            ApplicationCommandOptionTypes.INTEGER
        );
        if (option === undefined && required) throw new Error("Couldn't get integer option.");
        return option as { name: string; value: T; } | undefined;
    }

    getNumberOption<T extends number = number>(name: string, required?: false): { name: string; value: T; } | undefined;
    getNumberOption<T extends number = number>(name: string, required: true): { name: string; value: T; };
    getNumberOption<T extends number = number>(name: string, required?: boolean): { name: string; value: T; } | undefined {
        const option = this.getMentionOptions<number>(
            name,
            ApplicationCommandOptionTypes.NUMBER
        );
        if (option === undefined && required) throw new Error("Couldn't get number option.");
        return option as { name: string; value: T; } | undefined;
    }

    getRoleOption(name: string, required?: false): { name: string; value: number; } | undefined;
    getRoleOption(name: string, required: true): { name: string; value: number; };
    getRoleOption(name: string, required?: boolean): { name: string; value: number; } | undefined {
        const option = this.getMentionOptions<number>(
            name,
            ApplicationCommandOptionTypes.ROLE
        );
        if (option === undefined && required) throw new Error("Couldn't get role option.");
        return option;
    }

    getSigned32IntOption<T extends number = number>(name: string, required?: false): { name: string; value: T; } | undefined;
    getSigned32IntOption<T extends number = number>(name: string, required: true): { name: string; value: T; };
    getSigned32IntOption<T extends number = number>(name: string, required?: boolean): { name: string; value: T; } | undefined {
        const option = this.getMentionOptions<number>(
            name,
            ApplicationCommandOptionTypes.SIGNED_32_INTEGER
        );
        if (option === undefined && required) throw new Error("Couldn't get signed 32-bit integer option.");
        return option as { name: string; value: T; } | undefined;
    }

    getStringOption<T extends string = string>(name: string, required?: false): { name: string; value: T; } | undefined;
    getStringOption<T extends string = string>(name: string, required: true): { name: string; value: T; };
    getStringOption<T extends string = string>(name: string, required?: boolean): { name: string; value: T; } | undefined {
        const option = this.getMentionOptions<string>(
            name,
            ApplicationCommandOptionTypes.STRING
        );
        if (option === undefined && required) throw new Error("Couldn't get string option.");
        return option as { name: string; value: T; } | undefined;
    }


    getUserOption(name: string, required?: false): { name: string; value: string; } | undefined;
    getUserOption(name: string, required: true): { name: string; value: string; };
    getUserOption(name: string, required?: boolean): { name: string; value: string; } | undefined {
        const option = this.getMentionOptions<string>(
            name,
            ApplicationCommandOptionTypes.USER
        );
        if (option === undefined && required) throw new Error("Couldn't get user option.");
        return option;
    }

    hasMentionedEveryone(): boolean {
        return this.#data.mentions?.everyone ?? false;
    }

    hasMentionedHere(): boolean {
        return this.#data.mentions?.here ?? false;
    }

    isOptionRequired(name: string): boolean {
        return this.requiredOptions.some(opt => opt.name === name);
    }

    mergeVerifyOptionsData(required: VerifyOptionsData, optionals: VerifyOptionsData): VerifyOptionsData {
        return {
            missing:   required.missing,
            incorrect: required.incorrect.concat(optionals.incorrect),
            total:     required.total.concat(optionals.total)
        };
    }

    resolveTransposedOption(name: string, type: ApplicationCommandOptionTypes): {
        explicitIndex: number | null;
        isPositional: boolean;
        optionIndex?: number;
        optionValue: string | number | boolean;
        positionalIndex?: number;
        positionals: Array<number>;
    } {
        const optionIndex =
          this.#data.dynamicallyOrderedAppCmd.options?.findIndex(opt =>
              opt.name === name
            && opt.type === type
          );
        const isPositional =
          !(this.values.filter(val => typeof val === "string") as Array<string>).some(str => str.includes(name));
        const positionals =
          this.valueTranspositionMap.flatMap((v, i) => v === ValueTranspositionStates.POSITIONAL ? i : []);
        const positionalIndex =
          this.#data.dynamicallyOrderedAppCmd.options
              ?.slice(0, optionIndex)
              .filter(opt => {
                  const valIndex = this.values.findIndex((v, i) =>
                      typeof v === "string" && v.includes(opt.name) && this.valueTranspositionMap[i] === ValueTranspositionStates.EXPLICIT_OPTION
                  );
                  return valIndex === -1;
              }).length;
        const explicitIndex =
          isPositional
              ? null
              : this.values.findIndex((v, i) =>
                  typeof v === "string"
            && v.includes(name)
            && this.valueTranspositionMap[i] === ValueTranspositionStates.EXPLICIT_OPTION
              ) + 1;
        const optValue = isPositional ? this.values[positionals[positionalIndex as number]] : this.values[explicitIndex as number];
        return {
            optionIndex,
            isPositional,
            explicitIndex,
            optionValue: optValue,
            positionalIndex,
            positionals
        };
    }

    verifyOptions(target: "required" | "optionals" | "full" = "required"): VerifyOptionsData {
        const missing = [];
        const incorrect = [];
        const total = [];
        const fullOptionArr = this.requiredOptions.concat(this.optionalOptions);
        const targetOptions =
          target === "full"
              ? fullOptionArr
              : (target === "required" ? this.requiredOptions : this.optionalOptions);
        for (const option of targetOptions) {
            const { optionValue } = this.resolveTransposedOption(option.name, option.type);
            switch (option.type) {
                case ApplicationCommandOptionTypes.STRING: {
                    const value = this.getStringOption(option.name)?.value;
                    if (!value && !optionValue && option.required) missing.push(option.name);
                    if (!value && optionValue) incorrect.push(option.name);
                    if (!value) total.push(option.name);
                    break;
                }
                case ApplicationCommandOptionTypes.INTEGER: {
                    const value = this.getIntegerOption(option.name)?.value;
                    if (value === undefined && !optionValue && option.required) missing.push(option.name);
                    if (value === undefined && optionValue !== undefined) incorrect.push(option.name);
                    if (value === undefined) total.push(option.name);
                    break;
                }
                case ApplicationCommandOptionTypes.FLOAT: {
                    const value = this.getFloatOption(option.name)?.value;
                    if (value === undefined && !optionValue && option.required) missing.push(option.name);
                    if (value === undefined && optionValue !== undefined) incorrect.push(option.name);
                    if (value === undefined) total.push(option.name);
                    break;
                }
                case ApplicationCommandOptionTypes.SIGNED_32_INTEGER: {
                    const value = this.getSigned32IntOption(option.name)?.value;
                    if (value === undefined && !optionValue && option.required) missing.push(option.name);
                    if (value === undefined && optionValue !== undefined) incorrect.push(option.name);
                    if (value === undefined) total.push(option.name);
                    break;
                }
                case ApplicationCommandOptionTypes.NUMBER: {
                    const value = this.getNumberOption(option.name)?.value;
                    if (value === undefined && !optionValue && option.required) missing.push(option.name);
                    if (value === undefined && optionValue !== undefined) incorrect.push(option.name);
                    if (value === undefined) total.push(option.name);
                    break;
                }
                case ApplicationCommandOptionTypes.ROLE: {
                    const value = this.getRoleOption(option.name)?.value;
                    if (!value && !optionValue && option.required) missing.push(option.name);
                    if (!value && optionValue) incorrect.push(option.name);
                    if (!value) total.push(option.name);
                    break;
                }
                case ApplicationCommandOptionTypes.USER: {
                    const value = this.getUserOption(option.name)?.value;
                    if (!value && !optionValue && option.required) missing.push(option.name);
                    if (!value && optionValue) incorrect.push(option.name);
                    if (!value) total.push(option.name);
                    break;
                }
                case ApplicationCommandOptionTypes.CHANNEL: {
                    const value = this.getChannelOption(option.name)?.value;
                    if (!value && !optionValue && option.required) missing.push(option.name);
                    if (!value && optionValue) incorrect.push(option.name);
                    if (!value) total.push(option.name);
                    break;
                }
                case ApplicationCommandOptionTypes.EMBEDDED_ATTACHMENT: {
                    const value = this.getAttachmentOption(option.name)?.value;
                    if (!value && !optionValue && option.required) missing.push(option.name);
                    if (!value && optionValue) incorrect.push(option.name);
                    if (!value) total.push(option.name);
                    break;
                }
                case ApplicationCommandOptionTypes.BOOLEAN: {
                    const value = this.getBooleanOption(option.name)?.value;
                    if (value === undefined && !optionValue && option.required) missing.push(option.name);
                    if (value === undefined && optionValue) incorrect.push(option.name);
                    if (value === undefined) total.push(option.name);
                    break;
                }
                case ApplicationCommandOptionTypes.EMOTE: {
                    const value = this.getEmoteOption(option.name)?.value;
                    if (value === undefined && !optionValue && option.required) missing.push(option.name);
                    if (value === undefined && optionValue !== undefined) incorrect.push(option.name);
                    if (value === undefined) total.push(option.name);
                    break;
                }
            }
        }
        return {
            missing,
            incorrect,
            total
        };
    }
}
