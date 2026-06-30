import { Link } from "react-router-dom";
import { Icon } from "@/components/ui";

export interface Crumb {
  label: string;
  to?: string;
}

export function Breadcrumb({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1 text-[13px] text-muted">
      {items.map((c, i) => {
        const last = i === items.length - 1;
        return (
          <span key={`${c.label}-${i}`} className="flex items-center gap-1">
            {c.to && !last ? (
              <Link to={c.to} className="hover:text-forest">
                {c.label}
              </Link>
            ) : (
              <span className={last ? "text-ink" : undefined}>{c.label}</span>
            )}
            {!last && <Icon name="chevron-right" size={14} className="text-muted/60" />}
          </span>
        );
      })}
    </nav>
  );
}
