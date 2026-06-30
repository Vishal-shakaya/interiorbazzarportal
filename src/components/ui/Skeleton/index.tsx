import { cn } from "@/lib/cn";

interface SkeletonProps {
  className?: string;
}

/** Base shimmer block. Compose with width/height/rounded utilities. */
export function Skeleton({ className }: SkeletonProps) {
  return <div className={cn("animate-pulse bg-bone-tint rounded-md", className)} />;
}

/** Multi-line text placeholder. Last line is shortened. */
export function SkeletonText({ lines = 3, className }: { lines?: number; className?: string }) {
  return (
    <div className={cn("space-y-2", className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton key={i} className={cn("h-3.5", i === lines - 1 ? "w-2/3" : "w-full")} />
      ))}
    </div>
  );
}

/** Generic card placeholder: image block + title + text lines. */
export function SkeletonCard({ className }: SkeletonProps) {
  return (
    <div className={cn("bg-bone-card border border-line rounded-card p-4", className)}>
      <Skeleton className="h-40 w-full rounded-card" />
      <Skeleton className="h-4 w-3/4 mt-4" />
      <SkeletonText lines={2} className="mt-3" />
    </div>
  );
}
