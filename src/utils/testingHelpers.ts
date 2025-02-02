
export class ExpectationFailed extends Error {}

export type DeepPartial<T> = {
    [K in keyof T]?: T[K] extends object ? DeepPartial<T[K]> : T[K]
};

const getMismatchPosition = (strA: string, strB: string) => {
    let lineNumber = 0;
    let columnNumber = 0;
    for (let i = 0; i < Math.min(strA.length, strB.length); ++i) {
        if (strA[i] !== strB[i]) {
            return lineNumber + ":" + columnNumber;
        } else if (strA[i] === "\n") {
            ++lineNumber;
            columnNumber = 0;
        } else {
            ++columnNumber;
        }
    }
};

function keyof<T extends {}>(key: string, obj: T): null | keyof T {
    if (key in obj) {
        return key as keyof T;
    } else {
        return null;
    }
}

/**
 * similar to `.toMatchObject()` in jest or `assertArrayElementsSubset()` in phpunit
 *
 * checks number of elements in non-associative arrays
 * (useful if you need to test that empty array is returned for example)
 *
 * @throws {ExpectationFailed}
 */
export const assertSubTree = <T extends unknown>(
    expectedSubTree: DeepPartial<T> | T, actualTree: T, message = ""
) => {
    if (Array.isArray(expectedSubTree)) {
        if (!Array.isArray(actualTree)) {
            throw new ExpectationFailed(message + " expected array, got " + typeof actualTree);
        }
        if (expectedSubTree.length !== actualTree.length) {
            throw new ExpectationFailed(message + " expected length: " + expectedSubTree.length + ", got " + actualTree.length);
        }
        for (let i = 0; i < expectedSubTree.length; ++i) {
            assertSubTree(expectedSubTree[i], actualTree[i], message + "[" + i + "]");
        }
    } else if (expectedSubTree !== null && typeof expectedSubTree === "object") {
        if (actualTree === null) {
            throw new ExpectationFailed(message + " expected object, got null");
        }
        if (typeof actualTree !== "object") {
            throw new ExpectationFailed(message + " expected object, got " + typeof actualTree);
        }
        for (const [key, value] of Object.entries(expectedSubTree)) {
            if (value === undefined) {
                continue;
            }
            const asKeyof = keyof(key, actualTree);
            if (!asKeyof) {
                throw new ExpectationFailed(message + " missing expected key: " + key);
            }
            assertSubTree(value, actualTree[asKeyof], message + "[" + key + "]");
        }
    } else {
        if (expectedSubTree !== actualTree) {
            if (typeof expectedSubTree === "string" && typeof actualTree === "string") {
                throw new ExpectationFailed(
                    message + " expected (+) != actual (-) at " +
                    getMismatchPosition(expectedSubTree, actualTree) + "\n" +
                    expectedSubTree.split("\n").map(l => "+ " + l).join("\n") + "\n" +
                    actualTree.split("\n").map(l => "- " + l).join("\n")
                );
            } else {
                throw new ExpectationFailed(message + " expected " + expectedSubTree + ", got " + actualTree);
            }
        }
    }
};