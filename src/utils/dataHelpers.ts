import { fromEntries } from "../typing.ts";
import type { JsonArray, JsonObject, JsonValue } from "../../types/utility";

/**
 * usage:
 * rowsToObjects(
 *   ['id', 'color' , 'shape'   , 'size'  , 'to' ] as const,
 *   [  1n, 'red'   , 'circle'  , 'big'   , '0x0'],
 *   [  2n, 'green' , 'square'  , 'small' , '0x0'],
 *   [  3n, 'blue'  , 'triangle', 'small' , '0x0'],
 * )
 * output:
 * [
 *   {id: 1n, color: 'red', shape: 'circle', size: 'big', to: '0x0'},
 *   {id: 2n, color: 'green', shape: 'square', size: 'small', to: '0x0'},
 *   {id: 3n, color: 'blue', shape: 'triangle', size: 'small', to: '0x0'},
 * ]
 *
 * P.S. I tried real hard, but failed to get rid of "const" from usage and
 */
export function rowsToObjects<
    Tobj extends { [i in `${number}` & keyof TcolTuple as TcolTuple[i]]: TvalTuple[i] },
    const TcolTuple extends readonly PropertyKey[],
    const TvalTuple extends Record<keyof TcolTuple, unknown>
>(cols: TcolTuple, ...rows: TvalTuple[]): Tobj[] {
    return rows.map((vals: TvalTuple) => {
        const entries: [keyof Tobj, Tobj[keyof Tobj]][] = [];
        for (let i = 0; i < cols.length; ++i) {
            const col: keyof Tobj = cols[i];
            const val = vals[i] as Tobj[keyof Tobj];
            entries.push([col, val]);
        }
        const obj: Partial<Record<keyof Tobj, Tobj[keyof Tobj]>> = fromEntries(entries);
        return obj as Tobj;
    });
}

export function deepCopy<T extends JsonValue>(value: T): T {
    return JSON.parse(JSON.stringify(value)) as T;
}

/** @see https://stackoverflow.com/a/58436959/2750743 */
export type Paths<T> =
    T extends [...unknown[]] ? {
        [K in keyof T]-?: [K, ...Paths<T[K]> | []]
    }[keyof T & `${number}`] :
    T extends object ? {
        [K in keyof T]-?: [K, ...Paths<T[K]> | []]
    }[keyof T] :
    never;

/**
 * @kudos to chatgpt
 * not sure if this expression could have been simplified... but at least it works correctly and does not seem to be slow
 * const value: PathValue<{ a: { b: [{ c: 123 }] } }, ["a", "b", "0", "c"]> = 123;
 */
export type PathValue<T, K extends Paths<NonNullable<T>>> =
    T extends T ?
        K extends [infer First, ...infer Rest]
            ? First extends keyof T
                ? Rest extends []
                    ? T[First]
                    : Rest extends Paths<T[First]>
                        ? PathValue<NonNullable<T[First]>, Rest>
                        : never
                : never
            : T
        : never;

type FillPath<TKeys extends string[], TValue> =
    TKeys extends [infer First extends string, ...infer Rest extends string[]]
        ? Record<First, FillPath<Rest, TValue>>
        : TValue;

function setAt(destination: JsonObject | JsonArray, key: string, value: JsonValue) {
    if (Array.isArray(destination)) {
        destination[Number(key)] = value;
    } else {
        destination[key] = value;
    }
}

/**
 * works same way as lodash's _.set()
 * @see https://lodash.com/docs/4.17.15#set
 * too bad lodash typing allows arbitrary strings in keys on the moment of writing
 *
 * const tree = { a: { b: [{ c: {} }] } };
 * const newTree = setAtPath(tree, ["a", "b", "0", "c", "hey", "ho"], -100);
 * console.log(newTree);
 * { a: { b: [{ c: { hey: { ho: -100 } } }] } };
 *
 * big downside of the typing here is that it makes all optional keys in the path
 * mandatory and therefore potentially adding mandatory subkeys of optional
 * keys to the type even though it does not add them in the value, so for now you have to be mindful
 * of that and do the necessary checks on the calling site even though typing does not force you to
 */
export function setAtPath<
    TObj extends JsonObject,
    const TKeys extends Paths<TObj>
>(oldRoot: TObj, keys: TKeys, value: PathValue<TObj, TKeys>): TObj & FillPath<TKeys, PathValue<TObj, TKeys>> {
    if (keys.length === 0) {
        throw new Error("Keys argument may not be empty array");
    }
    const newRoot = deepCopy(oldRoot);
    const plainKeys: string[] = keys;
    let objNode: JsonObject | JsonArray = newRoot;
    const lastKey: string = plainKeys[keys.length - 1];
    for (const key of plainKeys.slice(0, -1)) {
        const nextNode: JsonValue = Array.isArray(objNode)
            ? objNode[Number(key)] : objNode[key];
        if (!nextNode) {
            const newNode: JsonObject = {};
            setAt(objNode, key, newNode);
            objNode = newNode;
        } else if (typeof nextNode !== "object") {
            throw new Error("Unexpected primitive at the key: " + key);
        } else {
            objNode = nextNode;
        }
    }
    setAt(objNode, lastKey, value);
    return newRoot as TObj & FillPath<TKeys, PathValue<TObj, TKeys>>;
}
