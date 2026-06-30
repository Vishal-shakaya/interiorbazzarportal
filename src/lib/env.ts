/**
 * Single place that reads Vite env vars. Import `env` everywhere else so no other
 * module touches `import.meta.env` directly.
 *
 * Flavour is chosen by Vite `--mode` (see package.json scripts):
 *   local (default) -> in-app mock, no backend
 *   dev | stage | prod -> real backend at VITE_API_BASE_URL
 *
 * - VITE_DATA_MODE   : local | dev | stage | prod (default "local").
 * - VITE_API_BASE_URL: backend origin used by the dev/stage/prod flavours.
 * - VITE_USE_MOCK_API: optional explicit override of the mock toggle; when unset
 *                      it is derived from the mode (local -> mock on, else off).
 * - VITE_API_LATENCY : simulated mock delay in ms (default 200; set 0 in tests).
 */
const raw = import.meta.env;

function bool(v: unknown, fallback: boolean): boolean {
  if (v === undefined || v === null || v === "") return fallback;
  return String(v).toLowerCase() === "true" || v === "1";
}

function num(v: unknown, fallback: number): number {
  const n = Number(v);
  return Number.isFinite(n) ? n : fallback;
}

export type DataMode = "local" | "dev" | "stage" | "prod";

const rawMode = String(raw.VITE_DATA_MODE ?? "").toLowerCase();
const MODE: DataMode =
  rawMode === "dev" || rawMode === "stage" || rawMode === "prod" ? rawMode : "local";

// Local flavour = the in-app mock (no backend). dev/stage/prod hit the real API.
// VITE_USE_MOCK_API is an optional explicit override (e.g. run local UI vs the dev API).
const mockRaw = raw.VITE_USE_MOCK_API;
const USE_MOCK_API =
  mockRaw === undefined || mockRaw === "" ? MODE === "local" : bool(mockRaw, true);

export const env = {
  /** Active backend flavour. */
  MODE,
  /** Convenience: running against the in-app mock. */
  IS_LOCAL: MODE === "local",
  API_BASE_URL: (raw.VITE_API_BASE_URL as string | undefined)?.replace(/\/$/, "") ?? "",
  USE_MOCK_API,
  API_LATENCY: num(raw.VITE_API_LATENCY, 200),
} as const;
