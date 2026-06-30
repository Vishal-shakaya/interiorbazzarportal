/**
 * Build a compact pagination window: always shows page 1, the last page, and
 * ±2 around the current page, inserting "…" between gaps.
 *
 *   buildPageWindow(5, 24) -> ["1","…","3","4","5","6","7","…","24"]
 *   buildPageWindow(1, 5)  -> ["1","2","3","4","5"]   (≤7 total: no ellipsis)
 */
export function buildPageWindow(current: number, total: number): string[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => String(i + 1));

  const pages = new Set<number>([1, total, current, current - 1, current + 1, current - 2, current + 2]);
  const sorted = [...pages].filter((p) => p >= 1 && p <= total).sort((a, b) => a - b);

  const out: string[] = [];
  let prev = 0;
  for (const p of sorted) {
    if (prev && p - prev > 1) out.push("…");
    out.push(String(p));
    prev = p;
  }
  return out;
}
