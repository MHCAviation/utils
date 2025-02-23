import type { Brand,Entries,JsonValue,Keys, Unbrand } from "../types/utility";

export const typed = <T,>(v: T) => v;

/** typeof of this symbol will never be assignable to anything but `any` */
const Any = Symbol("Any");

/**
 * a safer alternative to `anyValue as Type` that only allows you to do the type cast on
 * `any` types and will not allow you to accidentally erase type information on non-any types
 * intended primarily for no-unsafe-* eslint rules
 * @deprecated - just to highlight it in the IDE since any is bad and this function
 *     does a bad thing and we should all strive for the great future where there is no any
 */
export function unAny<T = unknown>(arg: typeof Any): T {
    return arg as T;
}

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
 * upd.: now that we are overriding the signature of JSON.parse(), this helper function is not needed I think
 */
export function parseJson<T extends JsonValue = JsonValue>(jsonStr: string): T {
    return JSON.parse(jsonStr) as T;
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