import { useCallback, useEffect, useRef, useState } from "react";

/** Autoplaying index controller for the hero carousel. Pauses on hover/blur. */
export function useHeroCarousel(count: number, intervalMs = 7000) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  const go = useCallback((i: number) => setIndex(((i % count) + count) % count), [count]);
  const next = useCallback(() => go(index + 1), [go, index]);

  useEffect(() => {
    if (paused || count <= 1) return;
    timer.current = setInterval(() => setIndex((i) => (i + 1) % count), intervalMs);
    return () => {
      if (timer.current) clearInterval(timer.current);
    };
  }, [paused, count, intervalMs]);

  return { index, go, next, setPaused };
}
