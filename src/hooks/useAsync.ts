import { useCallback, useEffect, useRef, useState } from "react";
import type { DependencyList } from "react";
import type { AsyncStatus } from "@/components/ui/AsyncBoundary";
import type { ApiResponseType, ApiError } from "@/types/api";

interface UseAsyncOptions {
  /** When false, the request is not fired and status stays "idle". */
  enabled?: boolean;
  /** Keep the previous `data` visible while a dependency-triggered refetch runs. */
  keepPreviousData?: boolean;
}

interface UseAsyncResult<T> {
  status: AsyncStatus;
  data: T | null;
  error: ApiError | null;
  retry: () => void;
}

/**
 * THE data-fetching primitive for the portal. Pair it with <AsyncBoundary>:
 *   const { status, data, error, retry } = useAsync(() => MarketService.list("product"), []);
 *   <AsyncBoundary status={status} onRetry={retry} isEmpty={!data?.length}>…</AsyncBoundary>
 *
 * - Re-runs whenever `deps` change (same contract as useEffect deps).
 * - Guards against stale responses (rapid dep changes / unmount) via a request id.
 * - `retry()` re-fires the current fetch.
 */
export function useAsync<T>(
  fn: () => Promise<ApiResponseType<T>>,
  deps: DependencyList,
  opts: UseAsyncOptions = {},
): UseAsyncResult<T> {
  const { enabled = true, keepPreviousData = false } = opts;

  const [status, setStatus] = useState<AsyncStatus>(enabled ? "loading" : "idle");
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<ApiError | null>(null);

  const reqId = useRef(0);
  const mounted = useRef(true);
  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  const run = useCallback(() => {
    if (!enabled) {
      setStatus("idle");
      return;
    }
    const id = ++reqId.current;
    setStatus("loading");
    setError(null);
    if (!keepPreviousData) setData(null);

    fn()
      .then((res) => {
        if (!mounted.current || id !== reqId.current) return;
        setData(res.data);
        setStatus("success");
      })
      .catch((e: ApiError) => {
        if (!mounted.current || id !== reqId.current) return;
        setError(e);
        setStatus("error");
      });
    // fn is intentionally excluded; deps drive refetch.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, keepPreviousData, ...deps]);

  useEffect(run, [run]);

  return { status, data, error, retry: run };
}
