

/**
 * an attempt to fight the fact that Set is not
 * reactive in Vue without copying it every time
 *
 * mutating operations return a new instance of the class,
 * but the Set under the hood stays the same object
 */
export default class ImmutableSet<T> implements Iterable<T> {
    private readonly source: Set<T>;
    // discard mutated instance to make sure there won't be side effects in case of misuse
    private discardedAt: null | Error = null;

    private constructor(source: Set<T> = new Set()) {
        this.source = source;
    }

    public static create<T>(values?: Iterable<T>) {
        return new ImmutableSet<T>(new Set<T>(values));
    }

    private discard() {
        // we could have just stored boolean instead of Error, but
        // error is extremely helpful for debug on end user side
        this.discardedAt = new Error("discard stack trace");
    }

    add(item: T): ImmutableSet<T> {
        this.checkDiscarded();
        this.source.add(item);
        const result = new ImmutableSet(this.source);
        this.discard();
        return result;
    }

    delete(item: T): ImmutableSet<T> {
        this.checkDiscarded();
        this.source.delete(item);
        const result = new ImmutableSet(this.source);
        // discard this instance to make sure there won't be side effects in case of misuse
        this.discard();
        return result;
    }

    get size(): number {
        this.checkDiscarded();
        return this.source.size;
    }

    has(item: T): boolean {
        this.checkDiscarded();
        return this.source.has(item);
    }

    [Symbol.iterator]() {
        this.checkDiscarded();
        return this.source[Symbol.iterator]();
    }

    private checkDiscarded() {
        if (this.discardedAt) {
            const message = "Attempted to reuse a discarded ReactiveSet, you most likely forgot to reassign after add()/delete(): " + JSON.stringify([...this.source]);
            throw new Error(message, {
                cause: this.discardedAt,
            });
        }
    }
}
