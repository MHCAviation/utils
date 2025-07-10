
/**
 * if your map has thousands of keys and re-creating it to just update the state
 * is counter-productive, you can use this helper class that reuses the same map
 * instance under the hood, but only exposes operations that behave as if it were immutable
 *
 * the catch is that you MUST ALWAYS re-assign the old instance with the result of set()/delete()
 * operations as after you call them the old instance gets dirty and can't be used anymore
 */
export class ImmutableMap<TKey, TValue> implements ReadonlyMap<TKey, TValue> {
    // discard mutated instance to make sure there won't be side effects in case of misuse
    private discardedAt: null | Error = null;

    private constructor(private source: Map<TKey, TValue>) {}

    public static create<TKey, TValue>(entries?: readonly (readonly [TKey, TValue])[]) {
        return new ImmutableMap<TKey, TValue>(new Map(entries));
    }

    private discard() {
        // we could have just stored boolean instead of Error, but
        // error is extremely helpful for debug on end user side
        this.discardedAt = new Error("discard stack trace");
    }

    public set(key: TKey, value: TValue): ImmutableMap<TKey, TValue> {
        this.checkDiscarded();
        this.discard();
        this.source.set(key, value);
        return new ImmutableMap(this.source);
    }

    public delete(key: TKey) {
        this.checkDiscarded();
        this.discard();
        this.source.delete(key);
        return new ImmutableMap(this.source);
    }

    private checkDiscarded() {
        if (this.discardedAt) {
            const message = "Attempted to reuse a discarded ReactiveMap, you most likely forgot to reassign after set()/delete(): " + JSON.stringify([...this.source]);
            throw new Error(message, {
                cause: this.discardedAt,
            });
        }
    }

    public get(key: TKey): TValue | undefined {
        this.checkDiscarded();
        return this.source.get(key);
    }

    public has(key: TKey): boolean {
        this.checkDiscarded();
        return this.source.has(key);
    }

    public entries(): MapIterator<[TKey, TValue]> {
        this.checkDiscarded();
        return this.source.entries();
    }

    public keys(): MapIterator<TKey> {
        this.checkDiscarded();
        return this.source.keys();
    }

    public values(): MapIterator<TValue> {
        this.checkDiscarded();
        return this.source.values();
    }

    public [Symbol.iterator](): MapIterator<[TKey, TValue]> {
        this.checkDiscarded();
        return this.source[Symbol.iterator]();
    }

    public forEach(callbackfn: (value: TValue, key: TKey, map: ReadonlyMap<TKey, TValue>) => void, thisArg?: unknown): void {
        this.checkDiscarded();
        this.source.forEach.bind(thisArg ?? this, callbackfn);
    }

    get size() {
        this.checkDiscarded();
        return this.source.size;
    }
}