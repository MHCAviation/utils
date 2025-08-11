import { brand } from "../src/typing.ts";
import { getNumberOfDays,pad2 } from "../src/dates.ts";

export type Entry<T> = {
    [K in keyof T]: [K, T[K]];
}[keyof T];

export type Key<T> = {
    [K in keyof T]: K;
}[keyof T];

export type Entries<T> = NonNullable<Entry<T>>[];
export type Keys<T> = NonNullable<Key<T>>[];

/** @see https://stackoverflow.com/a/49260286/2750743 */
export type Brand<TBase, Tag extends symbol> = TBase & { __tag: Tag };
export type Unbrand<TBranded extends { __tag: symbol }> = Omit<TBranded, "__tag">;

const UpperCasedTag = Symbol("UpperCased");
export type UpperCased<T> = T & { [k in typeof UpperCasedTag]: undefined };

export type JsonValue<TExtra = never> = JsonPrimitiveValue | TExtra | JsonArray<TExtra> | JsonObject<TExtra>;

export type JsonPrimitiveValue = number | string | boolean | null;

export interface JsonArray<TExtra = never> extends Array<JsonValue<TExtra>> {}

export interface JsonObject<TExtra = never> {
    [key: string]: JsonValue<TExtra>,
}

const JsonStringifiedTag = Symbol("JsonStringified");
export type JsonStringified<T extends JsonValue<undefined> = JsonValue> =
    Brand<string, typeof JsonStringifiedTag> & { __stringifiedValue: T };

export type NumericString = `${number}`;
export function asNumericString(value: string): NumericString | null {
    // disregarding scientific notation, f*ck it
    if (value.match(/^-?\d+(\.\d+)?$/)) {
        return value as `${number}`;
    } else {
        return null;
    }
}
export function NumericString(value: string): NumericString {
    const numericStringMaybe = asNumericString(value);
    if (numericStringMaybe) {
        return numericStringMaybe;
    } else {
        throw new Error("Invalid numeric string: " + value);
    }
}

export type EmailAddress = `${string}@${string}.${string}`;
export const EmailAddress = (value: string): EmailAddress => {
    const match = value.match(/^(\S+)@(\S+)\.(\S+)$/);
    if (!match) {
        throw new Error("Invalid E-Mail Address format: " + value);
    }
    const [, username, hostname, country] = match;
    return `${username}@${hostname}.${country}`;
};

export function asEmail(value: string): EmailAddress | null {
    const match = value.match(/^(\S+)@(\S+)\.(\S+)$/);
    if (!match) {
        return null;
    }
    const [, username, hostname, country] = match;
    return `${username}@${hostname}.${country}`;
}

export function asEmailOrFail(value: string): EmailAddress {
    const emailMaybe = asEmail(value);
    if (emailMaybe) {
        return emailMaybe;
    } else {
        throw new Error("Invalid E-Mail Address format: " + value);
    }
}

export type HttpUrl = `http${"s" | ""}://${string}.${string}`;
export type Pathname = `/${string}`;

const PixelsTag = Symbol("Pixels");
export type Pixels = Brand<number, typeof PixelsTag>;

export type ImageDimensions = {
    width: Pixels,
    height: Pixels,
};

const Base64Tag = Symbol("Base64");
export type Base64 = Brand<string, typeof Base64Tag>;

const CurrencyIsoCodeTag = Symbol("CurrencyIsoCode");
/** ISO 4217 */
export type CurrencyIsoCode = Brand<"EUR" | "IDR" | string, typeof CurrencyIsoCodeTag>;
export function CurrencyIsoCode(value: string): CurrencyIsoCode {
    value = value.toUpperCase();
    if (value.match(/^[A-Z]{3}$/)) {
        return brand<CurrencyIsoCode>(value);
    } else {
        throw new Error("Invalid ISO 4217 currency format: " + value);
    }
}

/** relaxed compiler-friendly type for MM and DD part in dates */
export type Pad2 = number | `0${number}`;

export type MonthStr = "2024-07" | "2024-03" | `${number}-${Pad2}`;
export type IsoDate = "2024-07-16" | "2024-03-13" | `${MonthStr}-${Pad2}`;
// probably this should be moved to dates.ts...
export function IsoDate(value: string): IsoDate {
    const parts = value.split("-");
    if (parts.length !== 3) {
        throw new Error("Invalid ISO date format: " + value);
    }
    let yyyy, mm, dd;
    try {
        yyyy = NumericString(parts[0]);
        mm = NumericString(parts[1]);
        dd = NumericString(parts[2]);
    } catch (error) {
        if (error instanceof Error) {
            error.message = "Invalid ISO date format: " + error.message;
        }
        throw error;
    }
    if (yyyy.length !== 4) {
        throw new Error("Invalid ISO date format, year must consist of exactly 4 digits, not " + yyyy.length + ", supplied value was: " + value);
    }
    if (mm.length !== 2) {
        throw new Error("Invalid ISO date format, month must consist of exactly 2 digits, not " + mm.length + ", supplied value was: " + value);
    }
    if (dd.length !== 2) {
        throw new Error("Invalid ISO date format, day must consist of exactly 2 digits, not " + dd.length + ", supplied value was: " + value);
    }
    if (Number(mm) < 1 || Number(mm) > 12) {
        throw new Error("Invalid ISO date format, month number must be within the range of 1-12, not " + mm + ", supplied value was: " + value);
    }
    const daysInMonth = getNumberOfDays({ year: Number(yyyy), month: Number(mm) });
    if (Number(dd) < 1 || Number(dd) > daysInMonth) {
        throw new Error("Invalid ISO date format, day number must be within the range of 1-" + daysInMonth + ", not " + dd + ", supplied value was: " + value);
    }
    return `${yyyy}-${mm}-${dd}`;
}

type SecondFraction = "" | `.${number}`;
export type IsoTimeUpToMinutes = "23:59" | `${Pad2}:${Pad2}`;
export function IsoTimeUpToMinutes(value: string): IsoTimeUpToMinutes {
    const match = value.match(/^(0?\d|1\d|2[0-3]):([0-5]\d)$/);
    if (!match) {
        throw new Error("Invalid HH:MM value: " + value);
    }
    const [, hh, mm] = match;
    return `${pad2(Number(hh))}:${pad2(Number(mm))}`;
}
export function asIsoTimeUpToMinutes(value: string): IsoTimeUpToMinutes | null {
    try {
        return IsoTimeUpToMinutes(value);
    } catch (error) {
        return null;
    }
}

export type IsoTimeUpToSeconds = "23:59:59" | `${IsoTimeUpToMinutes}:${Pad2}`;
export type IsoTime = IsoTimeUpToSeconds | "00:00:00.1234" | `${number}:${number}:${number}${SecondFraction}`;
export type IsoDateTimeBase<TTimeZoneOffset extends string> = `${IsoDate}T${IsoTime}${TTimeZoneOffset}`;
/** as serialized from C# System.DateTime by Newtonsoft.Json */
export type IsoDateTime = IsoDateTimeBase<"" | "Z">;
export type IsoDateTimeOffset = IsoDateTimeBase<`${"+" | "-"}${number}${"" | `:${Pad2}`}}`>;

const IataAirportTag = Symbol("IataAirport");
export type IataAirport = Brand<"JED" | "PLM" | "MED" | "RIX" | "CDG" | "WAW" | string, typeof IataAirportTag>;
export const IataAirport = (value: string): IataAirport => {
    if (value.match(/^[A-Z]{3}$/)) {
        return value as IataAirport;
    } else {
        throw new Error("Invalid IATA airport code format supplied: " + value);
    }
};

const IanaTimezone = Symbol("IanaTimezone");
export type IanaTimezone = Brand<"Atlantic/Reykjavik" | "Asia/Karachi" | "America/New_York" | string, typeof IanaTimezone>;

const IsoAlpha2CountryTag = Symbol("IsoAlpha2Country");
export type IsoAlpha2Country = Brand<"LV" | "GB" | string, typeof IsoAlpha2CountryTag>;
export function IsoAlpha2Country(value: string): IsoAlpha2Country {
    value = value.toUpperCase();
    if (value.match(/^[A-Z]{2}$/)) {
        return brand<IsoAlpha2Country>(value);
    } else {
        throw new Error("Invalid ISO 2-letter country format: " + value);
    }
}

declare global {
    interface Date {
        toISOString(): IsoDateTime,
    }

    interface JSON {
        stringify<T extends JsonValue<undefined> = JsonValue>(value: T): JsonStringified<T>,
        parse<T extends JsonValue<undefined> = JsonValue>(text: JsonStringified<T>): T,
        parse<T extends JsonValue<undefined> = JsonValue>(text: string): JsonValue,
    }

    interface Window {
        btoa(buffer: string): Base64,
        atob(data: Base64): string,
    }
}