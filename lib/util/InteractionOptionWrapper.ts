
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
import { ApplicationCommandOptionTypes } from "../Constants";
import { fetch } from "undici";
import type { APIURLSignature } from "guildedapi-types.ts/v1";

export class InteractionOptionWrapper {
    #client: Client;
    #data: InteractionOptionWrapperData;
    optionalOptions: Array<ApplicationCommandOption>;
    requiredOptions: Array<ApplicationCommandOption>;
    values: Array<string | number | boolean>;
    constructor(data: InteractionOptionWrapperData, client: Client) {
        this.#data = data;
        this.#client = client;
        this.values = this.extractValues(data.content);
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

        let result: Array<string | number> = [];
        let segmentIndex = 0;

        for (const part of text.split(/("[^"]*")/)) {
            if (part.startsWith('"') && part.endsWith('"')) {
                result.push(part.slice(1, -1)); // Remove the surrounding quotes
            } else {
                for (const word of part.split(/\s+/)) {
                    if (word.trim() !== "") {
                        const cleanedWord = segments[segmentIndex++];
                        if (cleanedWord) result.push(cleanedWord);
                    }
                }
            }
        }

        while (segmentIndex < segments.length) {
            result.push(segments[segmentIndex++]);
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
        const optionIndex =
          appCmdOptions?.findIndex(opt =>
              opt.name === name
            && opt.type === type
          );

        if (!optionIndex && optionIndex !== 0 || this.values?.[optionIndex] === undefined) return;

        if (type === ApplicationCommandOptionTypes.CHANNEL
          && !this.#data.mentions?.channels?.map(channel => channel.id).includes(this.values[optionIndex].toString())
          || type === ApplicationCommandOptionTypes.ROLE
          && !this.#data.mentions?.roles?.map(channel => channel.id).includes(Number(this.values[optionIndex]))
          || type === ApplicationCommandOptionTypes.USER
          && !this.#data.mentions?.users?.map(channel => channel.id).includes(this.values[optionIndex].toString())
          || type === ApplicationCommandOptionTypes.STRING
          && typeof this.values[optionIndex] !== "string"
          || type === ApplicationCommandOptionTypes.INTEGER
          && (
              typeof this.values[optionIndex] !== "number"
            || !Number.isFinite(this.values[optionIndex])
            || !Number.isInteger(this.values[optionIndex])
          )
          || type === ApplicationCommandOptionTypes.NUMBER
          && (
              typeof this.values[optionIndex] !== "number"
            || !Number.isFinite(this.values[optionIndex])
          )
          || type === ApplicationCommandOptionTypes.FLOAT
          && (
              typeof this.values[optionIndex] !== "number"
            || !Number.isFinite(this.values[optionIndex])
            || Number.isInteger(this.values[optionIndex])
          )
          || type === ApplicationCommandOptionTypes.SIGNED_32_INTEGER
          && (
              typeof this.values[optionIndex] !== "number"
            || !Number.isFinite(this.values[optionIndex])
            || !Number.isInteger(this.values[optionIndex])
            || Number(this.values[optionIndex]) < -2147483648
            || Number(this.values[optionIndex]) > 2147483647
          )
          || type === ApplicationCommandOptionTypes.EMBEDDED_ATTACHMENT
          && (
              typeof this.values[optionIndex] !== "string"
            || !this.values[optionIndex].toString().includes("![](https://cdn.gilcdn.com/")
          )
          || type === ApplicationCommandOptionTypes.BOOLEAN
          && (
              typeof this.values[optionIndex] === "string"
            && ((this.values[optionIndex] as string)?.toLowerCase() !== "true"
              && (this.values[optionIndex] as string)?.toLowerCase() !== "false")
            || typeof this.values[optionIndex] === "number"
            && (this.values[optionIndex] !== 1
              && this.values[optionIndex] !== 0)
          )
          || type === ApplicationCommandOptionTypes.EMOTE
          && typeof this.values[optionIndex] !== "string"
          && (
              typeof this.values[optionIndex] !== "number"
            || Number(this.values[optionIndex]) > 9999999
            || Number(this.values[optionIndex]) < 1000000
          )
        ) return;
        if (type === ApplicationCommandOptionTypes.INTEGER)
            this.values[optionIndex] = Math.trunc(Number(this.values[optionIndex]));
        if (type === ApplicationCommandOptionTypes.EMBEDDED_ATTACHMENT) {
            const regExp = /!\[]\((https:\/\/[^)]+)\)/g;
            const regExpArray: Array<string> = regExp.exec(this.values[optionIndex].toString()) ?? [];
            this.values[optionIndex] = regExpArray[0];
        }
        if (type === ApplicationCommandOptionTypes.BOOLEAN) {
            const val = this.values[optionIndex];
            this.values[optionIndex] =
              typeof val === "string"
                  ? val.toLowerCase() === "true"
                  : (typeof val === "number" ? val === 1 : Boolean(val));
        }
        if (type === ApplicationCommandOptionTypes.EMOTE && typeof this.values[optionIndex] !== "number") {
            const emoteID = Number((this.values[optionIndex] as string)?.match(/<:\w+:(\d+)>/)?.[1]);
            if (isNaN(emoteID)) return;
            this.values[optionIndex] = emoteID;
        }

        const appCmdCurrentOpt = appCmdOptions?.[optionIndex];
        if (appCmdCurrentOpt) {
            if ("choices" in appCmdCurrentOpt && appCmdCurrentOpt.choices) {
                const choices = appCmdCurrentOpt.choices;
                if (
                    !choices.map(choice => choice.value)
                        .includes(this.values[optionIndex] as string | number) // choices cannot be applied to boolean
                ) return;
            }

            const optValue = this.values[optionIndex];
            if (typeof optValue === "string" && ("minLength" in appCmdCurrentOpt || "maxLength" in appCmdCurrentOpt) && (
                (appCmdCurrentOpt.maxLength && optValue.length > appCmdCurrentOpt.maxLength)
                  || (appCmdCurrentOpt.minLength && optValue.length < appCmdCurrentOpt.minLength)
            )) return;

            if (typeof optValue === "number" && ("minValue" in appCmdCurrentOpt || "maxValue" in appCmdCurrentOpt) && (
                (appCmdCurrentOpt.maxValue && appCmdCurrentOpt.maxValue !== 0 && optValue > appCmdCurrentOpt.maxValue)
                || (appCmdCurrentOpt.minValue && optValue < appCmdCurrentOpt.minValue)
            )) return;
        }

        return {
            name,
            value: this.values[optionIndex] as T
        };
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
            const optionIndex =
                fullOptionArr.findIndex(opt =>
                    opt.name === option.name
                    && opt.type === option.type
                );
            switch (option.type) {
                case ApplicationCommandOptionTypes.STRING: {
                    const value = this.getStringOption(option.name)?.value;
                    if (!value && !this.values[optionIndex] && option.required) missing.push(option.name);
                    if (!value && this.values[optionIndex]) incorrect.push(option.name);
                    if (!value) total.push(option.name);
                    break;
                }
                case ApplicationCommandOptionTypes.INTEGER: {
                    const value = this.getIntegerOption(option.name)?.value;
                    if (value === undefined && !this.values[optionIndex] && option.required) missing.push(option.name);
                    if (value === undefined && this.values[optionIndex] !== undefined) incorrect.push(option.name);
                    if (value === undefined) total.push(option.name);
                    break;
                }
                case ApplicationCommandOptionTypes.FLOAT: {
                    const value = this.getFloatOption(option.name)?.value;
                    if (value === undefined && !this.values[optionIndex] && option.required) missing.push(option.name);
                    if (value === undefined && this.values[optionIndex] !== undefined) incorrect.push(option.name);
                    if (value === undefined) total.push(option.name);
                    break;
                }
                case ApplicationCommandOptionTypes.SIGNED_32_INTEGER: {
                    const value = this.getSigned32IntOption(option.name)?.value;
                    if (value === undefined && !this.values[optionIndex] && option.required) missing.push(option.name);
                    if (value === undefined && this.values[optionIndex] !== undefined) incorrect.push(option.name);
                    if (value === undefined) total.push(option.name);
                    break;
                }
                case ApplicationCommandOptionTypes.NUMBER: {
                    const value = this.getNumberOption(option.name)?.value;
                    if (value === undefined && !this.values[optionIndex] && option.required) missing.push(option.name);
                    if (value === undefined && this.values[optionIndex] !== undefined) incorrect.push(option.name);
                    if (value === undefined) total.push(option.name);
                    break;
                }
                case ApplicationCommandOptionTypes.ROLE: {
                    const value = this.getRoleOption(option.name)?.value;
                    if (!value && !this.values[optionIndex] && option.required) missing.push(option.name);
                    if (!value && this.values[optionIndex]) incorrect.push(option.name);
                    if (!value) total.push(option.name);
                    break;
                }
                case ApplicationCommandOptionTypes.USER: {
                    const value = this.getUserOption(option.name)?.value;
                    if (!value && !this.values[optionIndex] && option.required) missing.push(option.name);
                    if (!value && this.values[optionIndex]) incorrect.push(option.name);
                    if (!value) total.push(option.name);
                    break;
                }
                case ApplicationCommandOptionTypes.CHANNEL: {
                    const value = this.getChannelOption(option.name)?.value;
                    if (!value && !this.values[optionIndex] && option.required) missing.push(option.name);
                    if (!value && this.values[optionIndex]) incorrect.push(option.name);
                    if (!value) total.push(option.name);
                    break;
                }
                case ApplicationCommandOptionTypes.EMBEDDED_ATTACHMENT: {
                    const value = this.getAttachmentOption(option.name)?.value;
                    if (!value && !this.values[optionIndex] && option.required) missing.push(option.name);
                    if (!value && this.values[optionIndex]) incorrect.push(option.name);
                    if (!value) total.push(option.name);
                    break;
                }
                case ApplicationCommandOptionTypes.BOOLEAN: {
                    const value = this.getBooleanOption(option.name)?.value;
                    if (value === undefined && !this.values[optionIndex] && option.required) missing.push(option.name);
                    if (value === undefined && this.values[optionIndex]) incorrect.push(option.name);
                    if (value === undefined) total.push(option.name);
                    break;
                }
                case ApplicationCommandOptionTypes.EMOTE: {
                    const value = this.getEmoteOption(option.name)?.value;
                    if (value === undefined && !this.values[optionIndex] && option.required) missing.push(option.name);
                    if (value === undefined && this.values[optionIndex] !== undefined) incorrect.push(option.name);
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
