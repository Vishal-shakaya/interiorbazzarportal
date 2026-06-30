import type { ReactNode } from "react";
import { Button } from "../Button";

export type AsyncStatus = "idle" | "loading" | "error" | "success";

interface AsyncBoundaryProps {
  status: AsyncStatus;
  /** Shown while loading — pass a skeleton matching the final layout. */
  skeleton?: ReactNode;
  /** True when a successful load returned no items. */
  isEmpty?: boolean;
  empty?: ReactNode;
  error?: ReactNode;
  onRetry?: () => void;
  children: ReactNode;
}

/**
 * THE standard async contract for every data view in the portal.
 * loading -> skeleton, error -> retry, empty -> empty state, success -> children.
 * No page should hand-roll these four states.
 */
export function AsyncBoundary({
  status,
  skeleton,
  isEmpty,
  empty,
  error,
  onRetry,
  children,
}: AsyncBoundaryProps) {
  if (status === "loading" || status === "idle") {
    return <>{skeleton ?? <DefaultLoading />}</>;
  }

  if (status === "error") {
    return (
      <>
        {error ?? (
          <div className="text-center py-12">
            <p className="heading mb-1">Something went wrong</p>
            <p className="text-muted mb-5">We couldn't load this. Please try again.</p>
            {onRetry && (
              <Button variant="secondary" onClick={onRetry}>
                Retry
              </Button>
            )}
          </div>
        )}
      </>
    );
  }

  if (isEmpty) {
    return (
      <>
        {empty ?? (
          <div className="text-center py-12">
            <p className="heading mb-1">Nothing here yet</p>
            <p className="text-muted">There's nothing to show right now.</p>
          </div>
        )}
      </>
    );
  }

  return <>{children}</>;
}

function DefaultLoading() {
  return (
    <div className="flex items-center justify-center py-16 text-forest">
      <span className="sr-only">Loading…</span>
      <svg className="animate-spin" width={28} height={28} viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" opacity="0.25" />
        <path d="M22 12a10 10 0 0 1-10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
      </svg>
    </div>
  );
}
