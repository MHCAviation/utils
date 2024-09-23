
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

interface JsonArray<TExtra = never> extends Array<JsonValue<TExtra>> {}

export interface JsonObject<TExtra = never> {
    [key: string]: JsonValue<TExtra>,
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

export type HttpUrl = `http${"s" | ""}://${string}.${string}`;
export type Pathname = `/${string}`;

const Base64Tag = Symbol("Base64");
export type Base64 = Brand<string, typeof Base64Tag>;

const CurrencyIsoCode = Symbol("CurrencyIsoCode");
export type CurrencyIsoCode = Brand<"EUR" | "IDR" | string, typeof CurrencyIsoCode>;

/** relaxed compiler-friendly type for MM and DD part in dates */
export type Pad2 = number | `0${number}`;

export type MonthStr = "2024-07" | "2024-03" | `${number}-${Pad2}`;
export type IsoDate = "2024-07-16" | "2024-03-13" | `${MonthStr}-${Pad2}`;

type SecondFraction = "" | `.${number}`;
type IsoTime = "23:59:59" | "00:00:00.1234" | `${number}:${number}:${number}${SecondFraction}`;
export type IsoDateTimeBase<TTimeZoneOffset extends string> = `${IsoDate}T${IsoTime}${TTimeZoneOffset}`;
/** as serialized from C# System.DateTime by Newtonsoft.Json */
export type IsoDateTime = IsoDateTimeBase<"" | "Z">;
export type IsoDateTimeOffset = IsoDateTimeBase<`${"+" | "-"}${number}${"" | `:${Pad2}`}}`>;

const IataAirport = Symbol("IataAirport");
export type IataAirport = Brand<"JED" | "PLM" | "MED" | "RIX" | "CDG" | "WAW" | string, typeof IataAirport>;

const IanaTimezone = Symbol("IanaTimezone");
export type IanaTimezone = Brand<"Atlantic/Reykjavik" | "Asia/Karachi" | "America/New_York" | string, typeof IanaTimezone>;

const IsoAlpha2Country = Symbol("IsoAlpha2Country");
export type IsoAlpha2Country = "LV" | "GB" | Brand<string, typeof IsoAlpha2Country>;
