# TAB: Billing — Seller Dashboard

```
PARENT: README.md  ·  VIEW id: membership  ·  GROUP: account  ·  PROTOTYPE: pages/dashboard-seller.html
```

> Parent overview: [README.md](README.md) · Pages index: [../README.md](../README.md) ·
> Modules/features/flow: [../../modules-features-flow.md](../../modules-features-flow.md) ·
> Style: [../../style.md](../../style.md) · Copywriting: [../../copywriting.md](../../copywriting.md) ·
> Environment seam: [../../../Environment-Management-backend.md](../../../Environment-Management-backend.md) ·
> Integration: [../../../Integration.md](../../../Integration.md) ·
> Prototype: [../../../Prototype/ib_prototype_7.2.1/pages/dashboard-seller.html](../../../Prototype/ib_prototype_7.2.1/pages/dashboard-seller.html)

---

## 1. Page-tab

**Billing** is the seller's money page — invoices, payments, the active-subscription summary, shop
subscriptions, and the path to **request a plan change**. It is **billing + usage only**: the plan card
and plan options ("Your membership" selling content) live on the dedicated **Plans** tab (`renderPlans`);
this page never re-checks-out, it surfaces what's already been paid and what's coming up.

- **Nav group:** `account` — the **"Profile & settings"** block (the fourth grouped list in `renderNav()`).
- **Label / icon:** `label:'Billing'`, `icon:'ti-credit-card'` (`dashSections` row:
  `{id:'membership', label:'Billing', icon:'ti-credit-card', group:'account'}`). Also reachable from the
  avatar menu: `<button class="dt-menu-item" onclick="goSection('membership')">…<span>Billing</span></button>`.
- **Chip / count:** none. `ib_getSidebarChip('membership')` returns nothing ("*Overview / Activity /
  Profile / Membership / Settings / Security: no count*"), and there is no static `s.chip`.
- **Default view?** No — Overview is the landing section.
- **How it's reached:** prototype routes by `window.location.hash` (`#membership`); `goSection('membership')`
  switches and re-renders (`case 'membership': return renderMembership();`). **In React, mirror as
  `?tab=membership`** via `useSearchParams`. No deep sub-route — Billing has no nested `#section/sub` form.
  Inbound deep-links land here from: Overview KPI tile (`onclick="goSection('membership')"`), Overview ROI
  band button "**View billing**", the avatar menu, an upsell action-row ("Billing"), and the Plans hero
  link "**manage billing**".
- **Who sees it:** **Universal** for sellers. `renderMembership()` branches: a **seller**
  (`u.isSeller`) gets `renderBillingHistorySection()`; a **non-seller** (logged-in buyer with no selling
  module) gets `renderPlans()` instead — "*Buyers have no billing, so they get the Plans content instead.*"
  The nav item itself is universal (`ib_sectionAllowed` lets account-group items always show).

## 2. Module

**Universal / account** — Billing is **not** module-gated; it always appears in the `account` nav group
for any logged-in user. There is **no** `IB_SECTION_MODULE` entry for `membership` and no
`ib_anySellingModule()` requirement to reach the tab.

Plan-awareness here is **read-only and informational**, not gating:

| Read | What it drives |
|------|----------------|
| `IBEntitlements.meters(u.sellerPlan, usage)` | the **Plan usage** summary tile. `usage` = live counts `{products, services, catalogues}` from `window.products/services/catalogues`. If **every** meter is `unlimited` → tile shows "**Unlimited**" with foot = the meter labels joined " · "; otherwise it picks the **tightest** meter (highest `pct`, non-unlimited) → value `used / limit`, foot `label · +N more`. |
| `u.sellerPlan` | **Current plan** tile value and the plan-change modal's `currentPlan`. |
| `u.planRenewsOn` | **Current plan** tile foot — "Renews {date}". |
| `sh_getPlan` / `sh_computeSubStatus` / `sh_expiryUrgency` | per-shop subscription rows (plan, expiry, status, run-rate) — shop subscriptions are **per-shop billing, decoupled from the business plan**. |

No Billing control is hidden by plan; the only "soon" affordances are explicit (Update payment method,
download). All limit values flow from `ib-entitlements.js` via `meters` (`Infinity` → "Unlimited" through
`fmtLimit`) — **never hardcode a cap**.

## 3. Features

Verbatim sub-areas of `renderBillingHistorySection()` (+ the plan-change modal it links to):

- **Billing history** header — eyebrow "BILLING HISTORY", title "Your invoices and payments", with a
  "**View plans**" action.
- **Summary tiles** — three tiles: **Current plan**, **Next charge**, **Plan usage**.
- **Shop subscriptions** block (`renderShopSubscriptionsBlock`) — per-shop plan/expiry/auto-renew/renew
  table, or an invite/empty variant.
- **Invoice table** — past charges, receipts, status, per-row download.
- **Default payment method** footer — current method + "**Update**".
- **Change your plan** request modal (`ib-plan-edit.js` → `openRequestModal`) — reached via Plans, the
  request-driven plan-change flow Billing references.

## 4. Functionality

### Billing history header
Eyebrow `<i class="ti ti-receipt-2"></i> BILLING HISTORY`, H2 "**Your invoices and payments**", sub
"*All past charges, receipts, and your active subscription. Download any invoice for your records.*"
Right-side action: "**View plans**" (`onclick="goSection('plans')"`, `data-tip="See and compare plan
options"`) → Plans tab. **Service:** none (static heading); the action is a tab switch.

### Summary tiles (3)
| Tile | Value | Foot | Source |
|------|-------|------|--------|
| **Current plan** | `${u.sellerPlan}` | "Renews ${u.planRenewsOn}" | user / plan record |
| **Next charge** | "₹2,12,399" (mock) | "Auto-renews via UPI · HDFC" | billing system (mock in prototype) |
| **Plan usage** | `usageVal` — "Unlimited" or `used / limit` | `usageFoot` — meter labels, or `label · +N more` | `EntitlementService.meters(plan, {products,services,catalogues})` |

**Service + spine:** counts via `ProductService` / `ServiceService` / `CatalogueService` (listing content);
the meter math via `EntitlementService.meters` wrapping `ib-entitlements.js`. Plan/renewal via the user
record. Invoice/charge data via a **`BillingService`** (spine: billing) — mock invoice array in the
prototype, real later; reads go through services → DataSource, **never** raw `fetch`.

### Shop subscriptions block
**Header:** eyebrow "SHOP SUBSCRIPTIONS", title "**Your shops**", sub "*{n} active[ · {n} expired] ·
{₹}/mo effective run-rate at current cycle*" (run-rate = Σ `plan.effMonthly` across subscribed shops;
counts via `sh_computeSubStatus`). Action "**Manage shops**" → `goSection('shop')`.

**Table** (`bh-shopsub-table`) — one row per shop with `subscriptionPlanId` set:

| Column | Content / control |
|--------|-------------------|
| Shop | thumb + name `${s.name || '(untitled shop)'}` + city |
| Plan | `plan.label` + price `{₹}/{mo\|3 mo\|yr}` (`sh_formatINR`) |
| Expires | expiry pill `sh_renderExpiryPill(s,{compact:true})`; row gets `.is-expired` when expired |
| Auto-renew | toggle `sh-edit-toggle` → `sh_toggleAutoRenew(id)`, label "On"/"Off" |
| (action) | "**Renew**" / "**Renew now**" when expired (`.is-urgent`) → `sh_renewShop(id, expired)` |

**Empty/invite variants:** with shops but **no** subscriptions → invite block, title "Shop
subscriptions", sub "*You have {n} shop[s] but no active subscriptions yet. Subscribe a shop to make it
visible to buyers.*", CTA "**Go to shops**". With **no shops at all** → block is hidden (returns `''`).
**Service:** `ShopService` (seller assets; `shops` spine) for list/status/auto-renew/renew.

### Invoice table
Columns: **Invoice · Date · Plan / item · Period covered · Amount · Status** + action. Each row: invoice
id `bh-inv-id`, date, plan name + payment method (`Card · Visa ••42`), period covered, amount, status pill
`<i class="ti ti-circle-check-filled"></i> Paid` (`bh-status-paid` — status conveyed by **icon + text**,
not colour), and a download button `downloadInvoice(id)` (`data-tip="Download PDF receipt"`) →
`showToast('Downloading {id}.pdf','success')`. (`downloadAllInvoices()` exists →
"*Preparing all invoices for download...*".) **Service:** `BillingService.invoices()` / `.download(id)`
(spine: billing) — mock array today.

### Default payment method footer
`<i class="ti ti-credit-card"></i>` "**Default payment method**" + "*UPI · HDFC Bank · vishal@hdfc — used
for auto-renewal*". Button "**Update**" → `showToast('Payment method update — coming soon','info')` — a
"Soon" affordance signalled in copy, not silently absent. **Service:** `BillingService` (payment method).

### Change your plan (request flow)
The plan-change capability Billing's README row covers lives in `ib-plan-edit.js` (`openRequestModal`,
opened from Plans / `openPlanEdit`). Modal title "**Change your plan**", sub "*Request a different plan or
billing term. Our team reviews and applies it — no re-checkout needed.*" Shows **Current: {plan · term}**,
selects **New plan** and **Billing term** (live "Upgrade"/"Downgrade"/"Duration change"/"No change" kind
pill), optional **Reason**. Footer note (verbatim): "*A request does not charge you. Billing is settled
with our team after approval.*" CTAs "**Cancel**" / "**Send request**" (`requestChange(...)`). **Service:**
`PlanChangeService.request(...)` (spine: plan-change requests). A guard exists: if the editor hasn't
loaded → "*Plan change is loading — try again in a moment.*"

## 5. Working flow

**A. Review and download an invoice**
1. Seller opens **Billing** (avatar menu, Overview KPI tile, or `?tab=membership`).
2. `renderBillingHistorySection()` renders; the seller scans the **summary tiles** (current plan,
   next charge, live **Plan usage** read from `meters`).
3. They click a row's **download** → invoice PDF toast. Exit: stays on Billing or jumps to **Plans**
   via "**View plans**".

**B. Manage a shop subscription**
1. In the **Shop subscriptions** block the seller sees active/expired counts + monthly run-rate.
2. They toggle **Auto-renew** (`sh_toggleAutoRenew`) or hit **Renew / Renew now** (`sh_renewShop`) — a
   write through `ShopService` to the `shops` spine.
3. The change **surfaces live in the Shop tab** (status pill, chip = non-archived shop count) — same spine,
   both surfaces update; "**Manage shops**" deep-links there.

**C. Request a plan change**
1. Seller wants more headroom (e.g. hits a cap on Business "Add product"), follows "**View plans**" /
   "**Change plan**" → **Plans**, opens **Change your plan**.
2. Picks new plan + term, optionally a reason, **Send request** → `PlanChangeService.request`.
3. Copy makes the model explicit — "*A request does not charge you. Billing is settled with our team after
   approval.*" — so no surprise charge. After approval the resolved plan changes, which **re-grades every
   gated section** (Pipeline depth, Autogrowth caps, Business add-limits) and updates the **Plan usage**
   tile + Plans meters live.

**Spine links:** Billing reads the same plan the whole console gates on (`EntitlementService` /
`ib-entitlements.js`); the **Plan usage** tile mirrors the Plans-tab meters; shop subscriptions share the
`shops` spine with the Shop tab; the plan-change request flows into the same plan that drives Enquiries
exclusivity, Pipeline, Quotations and the cap toasts elsewhere.

## 6. Data · States · A11y · Copy

**Data (services → DataSource, never raw localStorage/fetch):**
`BillingService` (invoices, next charge, payment method — billing spine) · `EntitlementService.meters`
(usage, wrapping `ib-entitlements.js`) · `ProductService`/`ServiceService`/`CatalogueService` (usage
counts) · `ShopService` (shop subscriptions — `shops` spine) · `PlanChangeService` (change requests) ·
user record (`sellerPlan`, `planRenewsOn`).

**States:**
- **Loading:** standard section skeleton (tiles + table rows), not a bare spinner.
- **Empty:** no shops at all → shop-subscriptions block hidden; shops but no subs → invite block with
  next-action CTA "**Go to shops**"; no invoices → empty invoice table (real `BillingService` returns
  none for a new seller).
- **Locked / gated:** Billing is universal — nothing is gated. The only paid-capability signals reached
  from here are the **upgrade paths on Plans** (request modal) and the "Soon" payment-method **Update**
  (signalled in copy, never silently hidden).
- **Error:** failed billing/usage read degrades to an inline retry; the rest of the console still renders.
- **Success:** download → "*Downloading {id}.pdf*"; auto-renew/renew → shop-status update; plan request →
  submitted confirmation (modal stage advances).

**A11y:** lives in the `main`/`#dashMain` landmark; nav active `.dn-item` is `aria-current`. One **H1** per
section (here the section H2 "Your invoices and payments" under the dashboard's title chrome — keep a
single H1 in the React shell, no skipped levels). Status is **icon + text** (`ti-circle-check-filled` +
"Paid"), never colour alone; expiry pills pair icon/word with colour. Toggle is a real `<button>`;
download/renew buttons keyboard-operable with `data-tip` text in the DOM; the plan-change modal is a
focus-trapped `role="dialog" aria-modal="true" aria-label="Change plan"`, Esc/backdrop close.

**Copy (verbatim):** "BILLING HISTORY" · "Your invoices and payments" · "*All past charges, receipts, and
your active subscription. Download any invoice for your records.*" · tiles "Current plan" / "Next charge"
("*Auto-renews via UPI · HDFC*") / "Plan usage" / "Unlimited" · "Renews {date}" · "View plans" ·
"SHOP SUBSCRIPTIONS" / "Your shops" / "*{n} active · {n} expired · {₹}/mo effective run-rate at current
cycle*" · "Manage shops" / "Go to shops" · "*You have {n} shop[s] but no active subscriptions yet.
Subscribe a shop to make it visible to buyers.*" · "Renew" / "Renew now" · "Default payment method" /
"*UPI · HDFC Bank · vishal@hdfc — used for auto-renewal*" / "Update" / "*Payment method update — coming
soon*" · "*Downloading {id}.pdf*" · "Change your plan" / "*Request a different plan or billing term. Our
team reviews and applies it — no re-checkout needed.*" / "*A request does not charge you. Billing is
settled with our team after approval.*" / "Send request".

---

**Build notes (React):** `components/SellerDashboard/Billing/` (per
`src/pages/DashboardSeller/index.tsx`, section ordered in the `account` group). Services:
`BillingService` (invoices / next charge / payment method), `EntitlementService` (usage meters, wrapping
`ib-entitlements.js`), `ShopService` (shop subscriptions), `PlanChangeService` (plan-change request),
plus `ProductService`/`ServiceService`/`CatalogueService` for usage counts — all via DataSource, no raw
localStorage/fetch.
