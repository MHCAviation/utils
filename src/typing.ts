import type { Brand,Entries,JsonValue,Keys, Unbrand } from "../types/utility";

export const typed = <T,>(v: T) => v;

/** kudos to https://stackoverflow.com/a/60142095/2750743 */
export const entries = <T extends {}>(object: T): Entries<T> => Object.entries(object) as Entries<T>;
export const keys = <T extends {}>(object: T): Keys<T> => Object.keys(object) as Keys<T>;

type FromEntriesObj<
    TEntries extends readonly (readonly [PropertyKey, unknown])[]
> = { [Entry in TEntries[number] as Entry[0]]: Entry[1] };

type FromEntriesDic<
    TEntries extends readonly (readonly [PropertyKey, unknown])[]
> = Partial<Record<TEntries[number][0], TEntries[number][1]>>;

type FromEntries<
    TEntries extends readonly (readonly [PropertyKey, unknown])[]
> = FromEntriesObj<TEntries> & FromEntriesDic<TEntries>;

/** see https://stackoverflow.com/a/76176570/2750743 */
export const fromEntries = <
    const TEntries extends readonly (readonly [PropertyKey, unknown])[]
>(entries: TEntries): FromEntries<TEntries> => {
    return Object.fromEntries(entries) as FromEntries<TEntries>;
};

export const brand = <TBranded extends Brand<unknown, symbol>>(value: Unbrand<TBranded>): TBranded => {
    return value as {} as TBranded;
};

/**
 * const nullable: string | null = getSomething();
 * const unsafeAssertion: string = nullable!;
 * const safeAssertion: string = nullable ?? neverNull();
 */
export function neverNull(message?: string): never {
    throw new TypeError("Unexpected null value" + (!message ? "" : " " + message));
}

/**
 * no-unsafe-* eslint rule really hates JSON.parse() and for a reason I guess
 * this helper function is a slightly type-safer alternative
 */
export function parseJson<T extends JsonValue = JsonValue>(jsonStr: string): T {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return JSON.parse(jsonStr);
}

export function getTypeName(value: unknown) {
    if (value === null) {
        return "null";
    }
    if (typeof value === "object") {
        return String(value.constructor?.name) || "object";
    } else {
        return typeof value;
    }
}