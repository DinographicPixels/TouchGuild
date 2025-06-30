
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
            data.applicationCommand.options ?
                data.applicationCommand.options
                    .filter(opt => opt.required)
                : [];
        this.optionalOptions =
          data.applicationCommand.options ?
              data.applicationCommand.options
                  .filter(opt => !opt.required)
              : [];
    }

    private extractValues(text: string): Array<string | number> {
        const quotedPattern = /"([^"]*)"/g;
        const quotedMatches: Array<string> = [];
        let match: RegExpExecArray | null;

        let textWithoutQuotes = text;
        while ((match = quotedPattern.exec(text)) !== null) {
            quotedMatches.push(match[1]);
            textWithoutQuotes = textWithoutQuotes.replace(match[0], "");
        }

        const segments = textWithoutQuotes
            .split(/(\s+)/)
            .filter(val => val.trim() !== "")
            .map(val => val
                .replace(/^<[#&@]([\w-]+)>$/, "$1")
                .replace(/^<@&([\w-]+)>$/, "$1")
            );

        const expandedSegments: Array<string | number> = [];
        for (const token of segments) {
            if (/^<a?:\w+:\d+>$/.test(token)) {
                expandedSegments.push(token);
                continue;
            }

            const colonIndex = token.indexOf(":");
            if (colonIndex > 0 && colonIndex < token.length - 1) {
                const key = token.slice(0, colonIndex);
                const rawValue = token.slice(colonIndex + 1);

                const numValue = Number(rawValue);
                const value = isNaN(numValue) ? rawValue : numValue;

                expandedSegments.push(key + ":", value);
            } else {
                expandedSegments.push(token);
            }
        }

        let result: Array<string | number> = [];
        let segmentIndex = 0;

        for (const part of text.split(/("[^"]*")/)) {
            if (part.startsWith('"') && part.endsWith('"')) {
                result.push(part.slice(1, -1));
            } else {
                for (const word of part.split(/\s+/)) {
                    if (word.trim() !== "") {
                        const cleanedWord = expandedSegments[segmentIndex++];
                        if (cleanedWord !== undefined) result.push(cleanedWord);
                    }
                }
            }
        }

        while (segmentIndex < expandedSegments.length) {
            result.push(expandedSegments[segmentIndex++]);
        }

        result.shift();
        if (this.#data.executionType === "full")
            result.shift();

        result = result.map(val => isNaN(Number(val)) ? val : Number(val));

        return result;
    }
    private getMentionOptions<T = string | number | boolean>(name: string, type: ApplicationCommandOptionTypes): { name: string; value: T; } | undefined {
        if (!this.#data.applicationCommand) return;
        const appCmdOptions = this.#data.applicationCommand.options;
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
        if (type === ApplicationCommandOptionTypes.CHANNEL
          && !this.#data.mentions?.channels?.map(channel => channel.id).includes(optionValue.toString())
          || type === ApplicationCommandOptionTypes.ROLE
          && !this.#data.mentions?.roles?.map(channel => channel.id).includes(Number(optionValue))
          || type === ApplicationCommandOptionTypes.USER
          && !this.#data.mentions?.users?.map(channel => channel.id).includes(optionValue.toString())
          || type === ApplicationCommandOptionTypes.STRING
          && typeof optionValue !== "string"
          || type === ApplicationCommandOptionTypes.INTEGER
          && (
              typeof optionValue !== "number"
            || !Number.isFinite(optionValue)
            || !Number.isInteger(optionValue)
          )
          || type === ApplicationCommandOptionTypes.NUMBER
          && (
              typeof optionValue !== "number"
            || !Number.isFinite(optionValue)
          )
          || type === ApplicationCommandOptionTypes.FLOAT
          && (
              typeof optionValue !== "number"
            || !Number.isFinite(optionValue)
            || Number.isInteger(optionValue)
          )
          || type === ApplicationCommandOptionTypes.SIGNED_32_INTEGER
          && (
              typeof optionValue !== "number"
            || !Number.isFinite(optionValue)
            || !Number.isInteger(optionValue)
            || Number(optionValue) < -2147483648
            || Number(optionValue) > 2147483647
          )
          || type === ApplicationCommandOptionTypes.EMBEDDED_ATTACHMENT
          && (
              typeof optionValue !== "string"
            || !optionValue.toString().includes("![](https://cdn.gilcdn.com/")
          )
          || type === ApplicationCommandOptionTypes.BOOLEAN
          && (
              typeof optionValue === "string"
            && ((optionValue as string)?.toLowerCase() !== "true"
              && (optionValue as string)?.toLowerCase() !== "false")
            || typeof optionValue === "number"
            && (optionValue !== 1
              && optionValue !== 0)
          )
          || type === ApplicationCommandOptionTypes.EMOTE
          && typeof optionValue !== "string"
          && (
              typeof optionValue !== "number"
            || Number(optionValue) > 9999999
            || Number(optionValue) < 1000000
          )
        ) return;
        if (type === ApplicationCommandOptionTypes.INTEGER)
            optionValue = Math.trunc(Number(optionValue));
        if (type === ApplicationCommandOptionTypes.EMBEDDED_ATTACHMENT) {
            const regExp = /!\[]\((https:\/\/[^)]+)\)/g;
            const regExpArray: Array<string> = regExp.exec(optionValue.toString()) ?? [];
            optionValue = regExpArray[0];
        }
        if (type === ApplicationCommandOptionTypes.BOOLEAN) {
            const val = optionValue;
            optionValue =
              typeof val === "string"
                  ? val.toLowerCase() === "true"
                  : (typeof val === "number" ? val === 1 : Boolean(val));
        }
        if (type === ApplicationCommandOptionTypes.EMOTE && typeof optionValue !== "number") {
            const emoteID = Number((optionValue as string)?.match(/<:\w+:(\d+)>/)?.[1]);
            if (isNaN(emoteID)) return;
            optionValue = emoteID;
        }

        const appCmdCurrentOpt = appCmdOptions?.[optionIndex];
        if (appCmdCurrentOpt) {
            if ("choices" in appCmdCurrentOpt && appCmdCurrentOpt.choices) {
                const choices = appCmdCurrentOpt.choices;
                if (
                    !choices.map(choice => choice.value)
                        .includes(optionValue as string | number) // choices cannot be applied to boolean
                ) return;
            }

            if (typeof optionValue === "string" && ("minLength" in appCmdCurrentOpt || "maxLength" in appCmdCurrentOpt) && (
                (appCmdCurrentOpt.maxLength && optionValue.length > appCmdCurrentOpt.maxLength)
                  || (appCmdCurrentOpt.minLength && optionValue.length < appCmdCurrentOpt.minLength)
            )) return;

            if (typeof optionValue === "number" && ("minValue" in appCmdCurrentOpt || "maxValue" in appCmdCurrentOpt) && (
                (appCmdCurrentOpt.maxValue && appCmdCurrentOpt.maxValue !== 0 && optionValue > appCmdCurrentOpt.maxValue)
                || (appCmdCurrentOpt.minValue && optionValue < appCmdCurrentOpt.minValue)
            )) return;
        }

        return {
            name,
            value: optionValue as T
        };
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

        // Signing URL
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
          this.#data.applicationCommand.options?.findIndex(opt =>
              opt.name === name
            && opt.type === type
          );
        const isPositional =
          !(this.values.filter(val => typeof val === "string") as Array<string>).some(str => str.includes(name));
        const positionals =
          this.valueTranspositionMap.flatMap((v, i) => v === ValueTranspositionStates.POSITIONAL ? i : []);
        const positionalIndex =
          this.#data.applicationCommand.options
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
