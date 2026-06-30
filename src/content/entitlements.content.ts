/** Plan entitlements (prototype IBEntitlements-equivalent). Infinity = unlimited. */

export interface Entitlement {
  tier: string;
  leadsPerMonth: number;
  listings: number;
  banners: number;
  quotations: number;
}

const MAP: Record<string, Entitlement> = {
  "Autogrowth Launch": { tier: "Launch", leadsPerMonth: 30, listings: 25, banners: 1, quotations: 50 },
  "Autogrowth Scale": { tier: "Scale", leadsPerMonth: 90, listings: 100, banners: 3, quotations: Infinity },
  "Autogrowth Dominance": { tier: "Dominance", leadsPerMonth: Infinity, listings: Infinity, banners: 10, quotations: Infinity },
  "Verified Business": { tier: "Verified", leadsPerMonth: 15, listings: 25, banners: 1, quotations: 25 },
  "Verified Shop": { tier: "Verified", leadsPerMonth: 15, listings: 25, banners: 1, quotations: 25 },
  "Verified Architecture": { tier: "Verified", leadsPerMonth: 15, listings: 15, banners: 1, quotations: 25 },
};

const FREE: Entitlement = { tier: "Free", leadsPerMonth: 0, listings: 3, banners: 0, quotations: 0 };

export function resolveEntitlement(planName?: string | null): Entitlement {
  if (!planName) return FREE;
  return MAP[planName] ?? FREE;
}

/** "90" or "Unlimited" */
export const fmtLimit = (n: number) => (n === Infinity ? "Unlimited" : String(n));
