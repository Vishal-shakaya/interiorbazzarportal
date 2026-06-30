import { useCallback, useEffect, useState } from "react";
import type { ListingItem } from "@/types/marketplace";

/**
 * Recently-viewed tracker (prototype IBRV-equivalent). Stores a capped, newest-first
 * log in localStorage and broadcasts a window event so any mounted list refreshes.
 */
const STORAGE_KEY = "ib_rv";
const MAX = 60;
const EVENT = "ib:rv";

export interface RecentItem extends ListingItem {
  viewedAt: number;
}

function read(): RecentItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as RecentItem[]) : [];
  } catch {
    return [];
  }
}

function write(list: RecentItem[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    window.dispatchEvent(new CustomEvent(EVENT));
  } catch {
    /* ignore */
  }
}

/** Record a viewed item. Call from detail-page hooks. */
export function trackRecentlyViewed(item: ListingItem) {
  const list = read().filter((r) => r.id !== item.id);
  list.unshift({ ...item, viewedAt: Date.now() });
  write(list.slice(0, MAX));
}

/** Reactive list of recently-viewed items (for the Recently Viewed page). */
export function useRecentlyViewed() {
  const [items, setItems] = useState<RecentItem[]>(read);

  useEffect(() => {
    const refresh = () => setItems(read());
    window.addEventListener(EVENT, refresh);
    window.addEventListener("storage", refresh);
    return () => {
      window.removeEventListener(EVENT, refresh);
      window.removeEventListener("storage", refresh);
    };
  }, []);

  const remove = useCallback((id: string) => write(read().filter((r) => r.id !== id)), []);
  const clear = useCallback(() => write([]), []);

  return { items, remove, clear };
}
