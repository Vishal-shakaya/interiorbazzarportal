/**
 * The one HTTP client. Every service module calls these helpers; nothing else
 * issues `fetch`. Returns the standard `ApiResponseType<T>` envelope and throws a
 * normalized `ApiError` on failure (consumed by `useAsync`).
 *
 * Mock mode (`env.USE_MOCK_API`) short-circuits to the in-app mock resolver and
 * never touches the network — flip the env var to point at the real backend.
 *
 * Auth token is read straight from `localStorage['ib_auth']` to avoid an
 * api -> redux store import cycle.
 */
import { env } from "@/lib/env";
import type { ApiResponseType, ApiError } from "@/types/api";
import { resolveMock } from "./mock/handlers";

type HttpMethod = "GET" | "POST" | "PUT" | "DELETE";

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

function authToken(): string | null {
  try {
    const raw = localStorage.getItem("ib_auth");
    if (!raw) return null;
    const parsed = JSON.parse(raw) as { token?: string };
    return parsed.token ?? null;
  } catch {
    return null;
  }
}

function normalizeError(e: unknown): ApiError {
  if (typeof e === "object" && e !== null && "code" in e && "message" in e) {
    return e as ApiError;
  }
  return { code: 0, message: e instanceof Error ? e.message : "Network error" };
}

async function request<T>(method: HttpMethod, path: string, body?: unknown): Promise<ApiResponseType<T>> {
  if (env.USE_MOCK_API) {
    if (env.API_LATENCY > 0) await delay(env.API_LATENCY);
    return resolveMock<T>(method, path, body);
  }

  try {
    const token = authToken();
    const res = await fetch(`${env.API_BASE_URL}${path}`, {
      method,
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });

    const json = (await res.json().catch(() => null)) as ApiResponseType<T> | null;
    if (!res.ok || !json) {
      throw { code: res.status, message: json?.message ?? res.statusText } as ApiError;
    }
    if (json.response === false) throw { code: json.code, message: json.message } as ApiError;
    return json;
  } catch (e) {
    throw normalizeError(e);
  }
}

export const apiClient = {
  get: <T>(path: string) => request<T>("GET", path),
  post: <T>(path: string, body?: unknown) => request<T>("POST", path, body),
  put: <T>(path: string, body?: unknown) => request<T>("PUT", path, body),
  del: <T>(path: string, body?: unknown) => request<T>("DELETE", path, body),
};
