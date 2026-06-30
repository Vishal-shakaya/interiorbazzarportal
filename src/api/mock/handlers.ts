/**
 * Mock request resolver. Maps a concrete (method, path) pair back to the seed
 * data in `db.ts`, wrapped in the standard `ApiResponseType` envelope. The client
 * calls `resolveMock` only when `env.USE_MOCK_API` is true; the real-backend path
 * never touches this file.
 *
 * Routes are matched by regex against the concrete path the service requested
 * (built from `AppUrl.*`). Add a route here when you add an endpoint.
 */
import type { ApiResponseType, ApiError } from "@/types/api";
import type { ListingType } from "@/types/marketplace";
import { db } from "./db";

type HttpMethod = "GET" | "POST" | "PUT" | "DELETE";
type Handler = (m: RegExpMatchArray, body: unknown) => unknown;
interface Route {
  method: HttpMethod;
  pattern: RegExp;
  handler: Handler;
}

const ok = <T>(data: T, message = "OK"): ApiResponseType<T> => ({
  data,
  response: true,
  message,
  code: 200,
});

const LISTING_TYPES: Record<string, ListingType> = {
  products: "product",
  services: "service",
  businesses: "business",
  architects: "architect",
  shops: "shop",
  catalogues: "catalogue",
};

const routes: Route[] = [
  // marketplace
  {
    method: "GET",
    pattern: /^\/marketplace\/(products|services|businesses|architects|shops|catalogues)$/,
    handler: (m) => db.itemsByType(LISTING_TYPES[m[1]]),
  },
  {
    method: "GET",
    pattern: /^\/marketplace\/items\/([^/]+)\/related$/,
    handler: (m) => {
      const item = db.itemBySlug(decodeURIComponent(m[1]));
      return item ? db.relatedPool(item) : [];
    },
  },
  {
    method: "GET",
    pattern: /^\/marketplace\/items\/([^/]+)$/,
    handler: (m) => db.itemBySlug(decodeURIComponent(m[1])),
  },

  // discovery
  { method: "GET", pattern: /^\/home$/, handler: () => db.home() },
  { method: "GET", pattern: /^\/explore$/, handler: () => db.discovery() },
  { method: "GET", pattern: /^\/trending$/, handler: () => db.discovery() },

  // content
  { method: "GET", pattern: /^\/blog$/, handler: () => db.blogPosts() },
  { method: "GET", pattern: /^\/blog\/([^/]+)$/, handler: (m) => db.blogPost(decodeURIComponent(m[1])) },
  { method: "GET", pattern: /^\/content\/about$/, handler: () => db.about() },
  { method: "GET", pattern: /^\/content\/help$/, handler: () => db.help() },
  { method: "GET", pattern: /^\/content\/legal\/([^/]+)$/, handler: (m) => db.legal(decodeURIComponent(m[1])) },
  { method: "GET", pattern: /^\/content\/nav$/, handler: () => db.nav() },

  // commerce
  { method: "GET", pattern: /^\/plans$/, handler: () => db.planFamilies() },
  { method: "GET", pattern: /^\/plans\/faq$/, handler: () => db.plansFaq() },

  // dashboards
  { method: "GET", pattern: /^\/dashboard\/buyer$/, handler: () => db.buyerDashboard() },
  { method: "GET", pattern: /^\/dashboard\/seller$/, handler: () => db.sellerDashboard() },

  // auth
  {
    method: "POST",
    pattern: /^\/auth\/persona$/,
    handler: (_m, body) => {
      const { key } = (body ?? {}) as { key?: string };
      const persona = db.personas().find((p) => p.key === key);
      if (!persona) throw err(404, "Unknown persona");
      return { ...persona.user, token: `mock-${persona.key}-token` };
    },
  },
  {
    method: "POST",
    pattern: /^\/auth\/otp\/request$/,
    handler: (_m, body) => {
      const { email } = (body ?? {}) as { email?: string };
      if (!email || !/.+@.+\..+/.test(email)) throw err(422, "Invalid email");
      return { sent: true };
    },
  },
  {
    method: "POST",
    pattern: /^\/auth\/otp\/verify$/,
    handler: (_m, body) => {
      const { otp } = (body ?? {}) as { otp?: string };
      if (!otp || otp.length !== 6) throw err(401, "Invalid code");
      return { valid: true };
    },
  },
  {
    method: "POST",
    pattern: /^\/auth\/signup$/,
    handler: (_m, body) => {
      const payload = (body ?? {}) as Record<string, unknown>;
      return { ...payload, verified: true, token: `mock-signup-token` };
    },
  },
];

function err(code: number, message: string): ApiError {
  return { code, message };
}

/** Strip the query string before matching — params are passed through separately. */
export function resolveMock<T>(method: HttpMethod, fullPath: string, body?: unknown): ApiResponseType<T> {
  const path = fullPath.split("?")[0];
  for (const r of routes) {
    if (r.method !== method) continue;
    const m = path.match(r.pattern);
    if (m) return ok(r.handler(m, body)) as ApiResponseType<T>;
  }
  throw err(404, `No mock handler for ${method} ${path}`);
}
