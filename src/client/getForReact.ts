
import type React from "./React";

type UnreactedComponent<T> = (React: React) => T;

const reacts = new Map<React, Map<UnreactedComponent<unknown>, unknown>>();

export default function<T>(React: React, unreactedComponent: UnreactedComponent<T>): T {
    let reactedComponents = reacts.get(React);
    if (!reactedComponents) {
        reactedComponents = new Map();
        reacts.set(React, reactedComponents);
    }
    let reactedComponent = reactedComponents.get(unreactedComponent);
    if (!reactedComponent) {
        reactedComponent = unreactedComponent(React);
        reactedComponents.set(unreactedComponent, reactedComponent);
    }
    return reactedComponent as T;
}