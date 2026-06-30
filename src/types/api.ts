/**
 * Standard API contract shared by every service module and the HTTP client.
 * Mirrors the backend envelope so the mock adapter and the real backend are
 * interchangeable behind `apiClient`.
 */

/** The envelope every endpoint returns. */
export interface ApiResponseType<T> {
  data: T;
  response: boolean;
  message: string;
  code: number;
}

/** Normalized error thrown / surfaced when a request fails. */
export interface ApiError {
  message: string;
  code: number;
}

/**
 * Listing query params. Designed in now for a future server-driven move, but
 * the mock currently ignores them and returns the full collection (filtering
 * stays client-side in `useListingPage`).
 */
export interface ListQuery {
  filter?: string;
  sort?: string;
  q?: string;
  verified?: boolean;
  open?: boolean;
  page?: number;
  pageSize?: number;
}

/** Paginated payload shape — reserved for the future server-paged listing API. */
export interface Paginated<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
}

/** Type guard for the normalized ApiError shape. */
export function isApiError(e: unknown): e is ApiError {
  return typeof e === "object" && e !== null && "message" in e && "code" in e;
}
