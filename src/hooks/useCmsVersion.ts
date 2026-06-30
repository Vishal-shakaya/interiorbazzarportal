import { useEffect, useState } from "react";
import { subscribe } from "@/cms/store";

/**
 * Returns a counter that increments whenever the shared CMS changes (in this or
 * another same-origin tab). Feed it into a `useAsync` dep list to refetch content
 * the moment the admin saves an edit.
 */
export function useCmsVersion(): number {
  const [v, setV] = useState(0);
  useEffect(() => subscribe(() => setV((n) => n + 1)), []);
  return v;
}
