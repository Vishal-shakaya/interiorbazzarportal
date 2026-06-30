import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { Icon } from "@/components/ui";

interface SectionHeaderProps {
  /** Small uppercase kicker with a leading rule (prototype .sec-eye). */
  eyebrow?: string;
  /** Serif title; may contain <em> for the green italic emphasis. */
  title: ReactNode;
  subtitle?: string;
  /** Optional "see more" link. */
  moreTo?: string;
  moreLabel?: string;
}

export function SectionHeader({ eyebrow, title, subtitle, moreTo, moreLabel = "Browse all" }: SectionHeaderProps) {
  return (
    <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
      <div className="flex flex-col">
        {eyebrow && <span className="sec-eye">{eyebrow}</span>}
        <h2 className="sec-title">{title}</h2>
        {subtitle && <p className="mt-1.5 text-[15px] leading-relaxed text-muted">{subtitle}</p>}
      </div>
      {moreTo && (
        <Link
          to={moreTo}
          className="group flex shrink-0 items-center gap-1 text-[14px] font-semibold text-forest transition-all hover:gap-2"
        >
          {moreLabel} <Icon name="arrow-right" size={16} />
        </Link>
      )}
    </div>
  );
}
