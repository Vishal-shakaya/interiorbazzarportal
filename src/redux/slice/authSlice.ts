import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../store";

/**
 * Prototype-grade auth. Mirrors the prototype's `localStorage['ib_auth']` model.
 * Role is DERIVED (seller if isSeller or holds an active plan) — never stored.
 * No real passwords/sessions; this is the single seam to wire a backend later.
 */

export type Role = "buyer" | "seller";

export interface AuthUser {
  loggedIn: boolean;
  name: string;
  email: string;
  initials: string;
  verified: boolean;
  city: string;
  phone: string;
  isSeller: boolean;
  sellerPlan: string | null;
  /** "active" | "pending_payment" | "expired" | null */
  sellerPlanStatus: string | null;
  joined: string | null;
  /** Bearer token from the auth backend; read by the API client. */
  token?: string;
}

const STORAGE_KEY = "ib_auth";

export const LOGGED_OUT: AuthUser = {
  loggedIn: false,
  name: "",
  email: "",
  initials: "",
  verified: false,
  city: "",
  phone: "",
  isSeller: false,
  sellerPlan: null,
  sellerPlanStatus: null,
  joined: null,
};

function hydrate(): AuthUser {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return LOGGED_OUT;
    return { ...LOGGED_OUT, ...(JSON.parse(raw) as Partial<AuthUser>) };
  } catch {
    return LOGGED_OUT;
  }
}

function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]!.toUpperCase())
    .join("");
}

const authSlice = createSlice({
  name: "auth",
  initialState: hydrate(),
  reducers: {
    login(_state, action: PayloadAction<Partial<AuthUser>>) {
      const next = { ...LOGGED_OUT, ...action.payload, loggedIn: true };
      if (!next.initials && next.name) next.initials = initials(next.name);
      return next;
    },
    patch(state, action: PayloadAction<Partial<AuthUser>>) {
      Object.assign(state, action.payload);
      if (action.payload.name && !action.payload.initials) {
        state.initials = initials(action.payload.name);
      }
    },
    upgradeToSeller(state, action: PayloadAction<{ plan: string }>) {
      state.isSeller = true;
      state.sellerPlan = action.payload.plan;
      state.sellerPlanStatus = "active";
    },
    logout() {
      return { ...LOGGED_OUT };
    },
  },
});

export const { login, patch, upgradeToSeller, logout } = authSlice.actions;
export default authSlice.reducer;

/** Persist the auth slice to localStorage. Call from a store subscription. */
export function persistAuth(state: AuthUser) {
  try {
    if (state.loggedIn) localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    else localStorage.removeItem(STORAGE_KEY);
  } catch {
    /* ignore quota/availability errors in prototype */
  }
}

// ---- selectors ----
const hasActivePlan = (u: AuthUser) =>
  !!u.sellerPlan && u.sellerPlanStatus !== "pending_payment" && u.sellerPlanStatus !== "expired";

export const selectAuth = (s: RootState) => s.auth;
export const selectIsLoggedIn = (s: RootState) => s.auth.loggedIn;
export const selectRole = (s: RootState): Role =>
  s.auth.isSeller || hasActivePlan(s.auth) ? "seller" : "buyer";
