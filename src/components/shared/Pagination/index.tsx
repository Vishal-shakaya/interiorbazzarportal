import { Icon } from "@/components/ui";
import { cn } from "@/lib/cn";
import { buildPageWindow } from "@/lib/paginationWindow";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null;
  const window = buildPageWindow(currentPage, totalPages);

  const btn = "grid h-9 min-w-9 place-items-center rounded-[10px] border px-2 text-[14px] transition";

  return (
    <nav className="mt-8 flex items-center justify-center gap-1.5" aria-label="Pagination">
      <button
        className={cn(btn, "border-line text-forest hover:border-forest disabled:opacity-40 disabled:hover:border-line")}
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage <= 1}
        aria-label="Previous page"
      >
        <Icon name="chevron-left" size={18} />
      </button>

      {window.map((p, i) =>
        p === "…" ? (
          <span key={`gap-${i}`} className="px-1.5 text-muted">
            …
          </span>
        ) : (
          <button
            key={p}
            onClick={() => onPageChange(Number(p))}
            aria-current={Number(p) === currentPage ? "page" : undefined}
            className={cn(
              btn,
              Number(p) === currentPage
                ? "border-forest bg-forest font-semibold text-bone"
                : "border-line text-ink hover:border-forest",
            )}
          >
            {p}
          </button>
        ),
      )}

      <button
        className={cn(btn, "border-line text-forest hover:border-forest disabled:opacity-40 disabled:hover:border-line")}
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage >= totalPages}
        aria-label="Next page"
      >
        <Icon name="chevron-right" size={18} />
      </button>
    </nav>
  );
}
