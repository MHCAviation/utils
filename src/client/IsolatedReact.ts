import { useCallback, useEffect, useMemo } from "react";

export const IsolatedReact = {
    useMemo<const TDeps extends readonly unknown[], TResult>(
        computer: (...deps: readonly [...TDeps]) => TResult,
        dependencies: TDeps
    ) {
        return useMemo(() => {
            return computer(...dependencies);
        }, dependencies);
    },
    useEffect<const TDeps extends readonly unknown[]>(
        computer: (...deps: readonly [...TDeps]) => void,
        dependencies: TDeps
    ) {
        return useEffect(() => {
            computer(...dependencies);
        }, dependencies);
    },
    useCallback<
        const TDeps extends readonly unknown[],
        const TArgs extends readonly unknown[]
    >(
        computer: (...deps: readonly [...TDeps]) => (...args: readonly [...TArgs]) => void,
        dependencies: TDeps
    ) {
        return useCallback((...args: TArgs) => {
            computer(...dependencies)(...args);
        }, dependencies);
    },
};