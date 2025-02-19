import type { JsonPrimitiveValue,JsonStringified,JsonValue } from "../../types/utility.ts";

type FuncCache = Record<
    JsonStringified<JsonPrimitiveValue[]>,
    Promise<JsonValue>
>;

const MEMOIZE_CACHE: Record<symbol, FuncCache> = {};

export function deepFreeze<T extends JsonValue>(object: T): T {
    if (!object || typeof object !== "object" && typeof object !== "function") {
        return object;
    }

    const occurrences = new WeakSet<{}>();
    function deepFreezeCircularlySafe<T extends {}>(object: T) {
        if (occurrences.has(object)) {
            return object;
        }
        occurrences.add(object);
        const propNames = Reflect.ownKeys(object);
        for (const name of propNames) {
            const value = object[name as keyof typeof object];
            if ((value && typeof value === "object") || typeof value === "function") {
                deepFreezeCircularlySafe(value);
            }
        }

        return Object.freeze(object);
    }
    return deepFreezeCircularlySafe(object);
}

/**
 * be careful not to pass excess properties in params, as typescript can not check that input
 * exactly matches the specified type - it only checks that input is a subtype of that type
 * Upd.: now that TParams is JsonPrimitiveValue[] and not JsonValue[], this function is always safe I think
 */
export default function memoize<
    TParams extends JsonPrimitiveValue[],
    TResult extends JsonValue
>(func: (...params: TParams) => Promise<TResult>) {
    const funcKey = Symbol("memoized function " + String(func));
    const funcCache: FuncCache = MEMOIZE_CACHE[funcKey] = {};
    return async (...params: TParams): Promise<TResult> => {
        const paramsKey = JSON.stringify<TParams>(params);
        if (paramsKey in funcCache) {
            const cachedPromise = funcCache[paramsKey] as Promise<TResult>;
            // only reuse successful responses
            try {
                return await cachedPromise;
            } catch {}
        }
        const whenResult = func(...params).then(deepFreeze);
        funcCache[paramsKey] = whenResult;
        return whenResult;
    };
}