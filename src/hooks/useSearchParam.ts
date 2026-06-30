import { useCallback } from "react";
import { useSearchParams } from "react-router-dom";

/**
 * Read/write a single URL search param (replace: true, so it never pollutes
 * browser history). Use in page hooks for state that should survive reload or
 * be shareable — e.g. `?filter=`, `?page=`, `?tab=`.
 */
export function useSearchParam(key: string, fallback = "") {
  const [params, setParams] = useSearchParams();
  const value = params.get(key) ?? fallback;

  const setValue = useCallback(
    (next: string) => {
      setParams(
        (prev) => {
          const p = new URLSearchParams(prev);
          if (!next || next === fallback) p.delete(key);
          else p.set(key, next);
          return p;
        },
        { replace: true },
      );
    },
    [key, fallback, setParams],
  );

  return [value, setValue] as const;
}
