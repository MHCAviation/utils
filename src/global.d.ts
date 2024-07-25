import type { IsoDateTime } from "../types/utility";
declare global {
    /** @see https://stackoverflow.com/a/78741568/2750743 */
    interface ObjectConstructor {
        keys<K, V>(o: ReadonlyMap<K, V>): void,
        values<K, V>(o: ReadonlyMap<K, V>): void,
        entries<K, V>(o: ReadonlyMap<K, V>): void,
    }

    interface Date {
        toISOString(): IsoDateTime,
    }
}
