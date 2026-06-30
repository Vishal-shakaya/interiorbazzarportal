import { Icon } from "@/components/ui";
import { initialsOf } from "@/lib/listing";

export interface ReviewItem {
  name: string;
  rating: number;
  date: string;
  text: string;
}

interface ReviewsProps {
  rating: number;
  count: number;
  breakdown: { stars: number; pct: number }[];
  reviews: ReviewItem[];
}

function Stars({ value, size = 14 }: { value: number; size?: number }) {
  return (
    <span className="inline-flex">
      {[1, 2, 3, 4, 5].map((n) => (
        <Icon key={n} name={n <= Math.round(value) ? "star-filled" : "star"} size={size} className="text-amber" />
      ))}
    </span>
  );
}

export function Reviews({ rating, count, breakdown, reviews }: ReviewsProps) {
  return (
    <div className="space-y-6">
      <div className="grid gap-6 rounded-card border border-line bg-bone-card p-5 sm:grid-cols-[auto_1fr]">
        <div className="text-center">
          <p className="font-serif text-[40px] leading-none text-forest">{rating.toFixed(1)}</p>
          <Stars value={rating} size={16} />
          <p className="mt-1 text-[12px] text-muted">{count} reviews</p>
        </div>
        <div className="space-y-1.5">
          {breakdown.map((b) => (
            <div key={b.stars} className="flex items-center gap-2 text-[12px] text-muted">
              <span className="w-3">{b.stars}</span>
              <Icon name="star-filled" size={12} className="text-amber" />
              <span className="h-2 flex-1 overflow-hidden rounded-full bg-line">
                <span className="block h-full rounded-full bg-forest" style={{ width: `${b.pct}%` }} />
              </span>
              <span className="w-8 text-right">{b.pct}%</span>
            </div>
          ))}
        </div>
      </div>

      <ul className="space-y-4">
        {reviews.map((r, i) => (
          <li key={i} className="border-b border-line pb-4 last:border-0">
            <div className="flex items-center gap-2.5">
              <span className="grid h-9 w-9 place-items-center rounded-full bg-sel-bg text-[12px] font-semibold text-forest">
                {initialsOf(r.name)}
              </span>
              <div>
                <p className="text-[14px] font-semibold text-ink">{r.name}</p>
                <p className="text-[12px] text-muted">{r.date}</p>
              </div>
              <span className="ml-auto">
                <Stars value={r.rating} />
              </span>
            </div>
            <p className="mt-2.5 text-[14px] leading-relaxed text-ink/85">{r.text}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
