
/**
 * @see https://github.com/facebook/react/issues/11996#issuecomment-1872321051
 */

let lastUid = 0;
const refToUid = new WeakMap<object | symbol, number>;

export function getRefUid(reference: object | symbol) {
    const existingUid = refToUid.get(reference);
    if (existingUid) {
        return existingUid;
    }
    const newUid = ++lastUid;
    refToUid.set(reference, newUid);
    return newUid;
}
