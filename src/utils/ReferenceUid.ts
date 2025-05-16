
/**
 * @see https://github.com/facebook/react/issues/11996#issuecomment-1872321051
 */

let lastUid = 0;
const refToUid = new WeakMap<object | symbol, number>;
// firefox does not support symbols as weak map keys without a flag
// https://bugzilla.mozilla.org/show_bug.cgi?id=1710433
const refToUidPermanent = new Map<object | symbol, number>;

export function getRefUid(reference: object | symbol) {
    const existingUid = refToUid.get(reference)
        ?? refToUidPermanent.get(reference);
    if (existingUid) {
        return existingUid;
    }
    const newUid = ++lastUid;
    try {
        refToUid.set(reference, newUid);
    } catch (error) {
        if (typeof reference === "symbol" &&
            error instanceof TypeError &&
            error.message.includes("must be an object")
        ) {
            refToUidPermanent.set(reference, newUid);
        } else {
            throw error;
        }
    }
    return newUid;
}
