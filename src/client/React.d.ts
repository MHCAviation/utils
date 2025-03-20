import type { useMemo, useEffect, useCallback } from "react";

type React = {
    useMemo: typeof useMemo,
    useEffect: typeof useEffect,
    useCallback: typeof useCallback,
};

export default React;
