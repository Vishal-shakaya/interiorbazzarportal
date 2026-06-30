# TAB: Plans — Seller Dashboard

```
PARENT: README.md  ·  VIEW id: plans  ·  GROUP: account  ·  PROTOTYPE: pages/dashboard-seller.html
```

> Links: parent overview = [README.md](README.md) · pages index = [../README.md](../README.md) ·
> modules-features-flow = [../../modules-features-flow.md](../../modules-features-flow.md) ·
> style = [../../style.md](../../style.md) · copywriting = [../../copywriting.md](../../copywriting.md) ·
> environment seam = [../../../../docs/environment-and-backend.md](../../../../docs/environment-and-backend.md) ·
> integration = [../../../../docs/integration.md](../../../../docs/integration.md) ·
> prototype = [../../../Prototype/ib_prototype_7.2.1/pages/dashboard-seller.html](../../../Prototype/ib_prototype_7.2.1/pages/dashboard-seller.html) ·
> entitlements = [../../../Prototype/ib_prototype_7.2.1/assets/ib-entitlements.js](../../../Prototype/ib_prototype_7.2.1/assets/ib-entitlements.js)

## 1. Page-tab
**Plans is the seller's plan surface** — the one screen that shows the active plan, live usage against
its limits, exclusivity status, and the catalogue of plans to activate or upgrade. It is `renderPlans()`
in the prototype (`case 'plans': return renderPlans();`).

- **Where it sits:** nav group **`account`** ("Profile & settings"). Nav item (`dashSections`):
  `{id:'plans', label:'Plans', icon:'ti-stack-2', group:'account'}`. Label **"Plans"**, icon
  `ti-stack-2`. No chip/count.
- **Default view?** No — `overview` is the default; Plans is reached on demand.
- **How it's reached:** `goSection('plans')` (hash `#plans`; in React `?tab=plans` via `useSearchParams`).
  It is the **upgrade destination for the whole console** — virtually every gate routes here:
  Autogrowth header badge and term/segment/state caps (`onclick="goSection('plans')"`), Banner Ads
  upsell ("See plans"), Insights lock ("Compare plans"), Business "View plans", and the cap toasts.
  The My-Plan **"Change plan"** button deep-links into the plan grid via
  `scrollToCategory(<family>)` (smooth-scroll + `mbr-cat-card-pulse` highlight to `#mbr-<catId>`),
  where `<catId>` ∈ `automation` / `business` / `shop` / `architecture`.
- **Who sees it:** **universal** — `ib_sectionAllowed('plans')` is true for everyone (no
  `IB_SECTION_MODULE` entry). A buyer (no selling module) sees the buyer variant of the page; a seller
  sees the My-Plan panel + modules manager (see §2).

## 2. Module
**Universal — this tab *is* the plan surface, so it is never gated out.** Visibility is universal; the
*content* is plan-aware and split by `const isBuyer = !u.isSeller`.

It does not belong to a sellable module of its own; instead it **reads every other module's
entitlements** to render meters and the modules manager. All limits/labels come from
[`ib-entitlements.js`](../../../Prototype/ib_prototype_7.2.1/assets/ib-entitlements.js) — **never
hardcoded**. Entitlement reads on this tab:

| Read | Used for |
|------|----------|
| `IBEntitlements.of(u.sellerPlan)` → `ent` | plan label, `family`, `reach`, `routing`, `exclusivity` for the My-Plan card |
| `IBEntitlements.meters(u.sellerPlan, usage)` → `[{key,label,used,limit,unlimited,pct,atCap}]` | the usage-meter grid (Products / Services / Catalogues / Categories / Search keywords / Projects) |
| `IBEntitlements.of(planKey).label` (per module) | active-tier label in the modules manager pill |
| `IBEntitlements._PLANS` (via `ib_moduleTiers`) | tier options in each active module's `<select>` |

The page is **not** behind `IB_SECTION_MODULE` / `ib_sectionAllowed` gating itself, but the modules
manager (`renderModulesManager`) is the activation surface that drives every *other* tab's gate:
activating a module sets `sellerModules[key]`, which `ib_sectionAllowed(id)` reads to reveal that
module's tab. `meters([])` returns only features the plan actually limits, so an Autogrowth plan (all
`products/services/catalogues: Infinity`) shows no usage bars while a Business-Verified plan shows
caps `25 / 10 / 2`.

## 3. Features
Verbatim sub-areas of the Plans tab (seller view, top → bottom):

- **My Plan panel** (`renderMyPlanPanel` → `.myplan-card`) — active plan badge, family tag, renewal,
  reach pill, **"Change plan"**, exclusivity card, and **usage meters**.
- **Light page header** — H1 **"Explore plans"** + subhead "You have N active module(s)…" with a
  **"manage billing"** link.
- **Poster strip** (`.mbr-picker-strip`) — four category posters: **"Automate"**, plus Business / Shop /
  Architecture pickers, each with a process preview and **"See plans"**.
- **Plan category sections** (`#mbr-<catId>`) — the full plan grids `scrollToCategory()` jumps to.
- **Your modules** manager (`renderModulesManager` → "Your modules", `N active`) — Autogrowth, Business,
  Shop, Architecture, Banner Ads with **Activate / Deactivate** + a tier `<select>`.

> Buyer variant: H1 **"A system that attracts, qualifies, and helps you convert buyers — exclusively
> for you."**, the poster strip, a trust strip, and a bottom CTA **"Register your business"** (no
> My-Plan panel, no modules manager). This spec is seller-focused; the buyer copy is noted for parity.

## 4. Functionality

### 4.1 My Plan panel (`.myplan-card`)
Renders only for active sellers (`if (!u.isSeller) return ''`) and fails safe if the engine is missing
(`if (!window.IBEntitlements) return ''`).

| Element | Source / behaviour | Verbatim copy |
|---------|--------------------|---------------|
| Plan badge `.myp-badge` | `ent.label \|\| u.sellerPlan \|\| 'Plan'`, icon `ti-rosette` | e.g. "Autogrowth Scale", "Verified" |
| Family tag `.myp-fam` | `{autogrowth:'Growth engine', business:'Business', shop:'Shop', architect:'Architecture', free:''}[ent.family]` | "Growth engine" / "Business" / "Shop" / "Architecture" |
| Sub line `.myp-sub` | `businessName · Renews <planRenewsOn \|\| '—'>` | "Renews —" |
| Reach pill `.myp-reach` | `reachMap[ent.reach]` (icon `ti-map-2`) | "Local" / "City-wide" / "State-wide" / "3 states" / "2 states" / "5 states" / "Pan-India" |
| **Change plan** `.myp-upgrade` | `scrollToCategory(family)` — `free→automation`, `architect→architecture`, else `family` (icon `ti-arrow-up-right`) | **"Change plan"** |

**Exclusivity card** `.myp-excl` (status-by-icon-and-text, never colour alone):

| Condition | Class · icon | Title | Body (verbatim) |
|-----------|--------------|-------|-----------------|
| `ent.exclusivity` | `myp-excl-on` · `ti-lock` | **Exclusive routing active** | "Qualified enquiries in your category & region are routed only to you — never shared with competitors." |
| `ent.routing === 'priority'` | `myp-excl-mid` · `ti-bolt` | **Priority routing** | "You are served before standard tiers when enquiries match your profile. Upgrade to Autogrowth for full exclusivity." |
| else | `myp-excl-off` · `ti-users` | **Shared visibility** | "Matched enquiries may be offered to a few businesses. Upgrade for priority routing or exclusivity." |

**Usage meters** `.myp-meters` — built from `IBEntitlements.meters(u.sellerPlan, usage)`. `usage` is
the **live count from the dashboard's own arrays** (`products`, `services`, `catalogues`, `projects`)
plus keyword/category counts off `sellerProfile`. Per meter `m`:

- Count text `.myp-meter-count`: `m.unlimited ? 'Unlimited' : (m.used + ' / ' + m.limit)`.
- Bar fill class: `m.atCap → myp-bar-cap`; else `m.pct>=80 → myp-bar-warn`; else `myp-bar-fill`. Width
  `m.unlimited ? 6 : max(4, m.pct)`.
- **At cap** → `.myp-meter-count` gets `myp-meter-cap` (amber) **and** a hint line is appended:
  **"Limit reached — upgrade to add more."** (`.myp-meter-hint`).

Meter rows only render for features the plan limits (`meters()` skips any feature key not in the plan
object), so e.g. an Autogrowth plan shows no bars; Business-Verified shows Products `n / 25`, Services
`n / 10`, Catalogues `n / 2`, Categories `n / 1`, Search keywords `n / 3`. **All caps read from
`ib-entitlements.js`** — no plan number is hardcoded in this panel.

### 4.2 Page header
H1 `.dm-title.mbr-hero-title` = **"Explore plans"** (seller). Subhead: "You have **N** active
module(s). Activate or manage them below, or **manage billing**." — the **manage billing** link calls
`goSection('membership')` (the Billing tab).

### 4.3 Poster strip + plan category sections
Four `.mbr-picker` posters (`automation` / `business` / `shop` / `architecture`). Each shows an eyebrow
tile, title (e.g. picker title **"Automate"**, tag "Attract · Qualify · Convert · The IB plan"), a
vertical numbered process preview, and footer CTA **"See plans"**. Clicking a poster calls
`scrollToCategory(c.id)` → smooth-scrolls to `#mbr-<id>` and pulses it. The full plan grids live in the
`#mbr-<catId>` sections below the strip (the sell content this tab anchors to). These read prices/values
from the `categories` config, not from a backend.

### 4.4 Your modules manager (`renderModulesManager`)
The activation surface. Header **"Your modules"** (icon `ti-stack-2`) + a `N active` pill (count from
`ib_activeModules()`). Footer note (verbatim): "Each module is an independent subscription — activating
one unlocks its tab; the tier sets your access level." Rows (`MODS`):

| Module | key | icon | selling |
|--------|-----|------|---------|
| Autogrowth | `autogrowth` | `ti-sparkles` | yes |
| Business | `business` | `ti-briefcase` | yes |
| Shop | `shop` | `ti-building-store` | yes |
| Architecture | `architect` | `ti-ruler-2` | yes |
| Banner Ads | `bannerAds` | `ti-photo` | no |

Per row: state pill **"Active"** (`ti-circle-check-filled`, green) — for selling modules appended with
**"· <tier label>"** from `IBEntitlements.of(planKey).label` — or **"Inactive"**. Controls:

- Active selling module: a tier `<select>` (`ib_activateModule(key, value)`; options from
  `ib_moduleTiers(key)` filtered out of `IBEntitlements._PLANS` by family) + a **"Deactivate"** button
  (`ib_deactivateModule(key)`).
- Active non-selling (Banner Ads): **"Deactivate"** only (no tier).
- Inactive: **"Activate"** button (`ib_activateModule(key)`, `ti-plus`).

Activate/deactivate write to the seller's module set and emit `showToast('{Module} activated' |
'deactivated')`; the change re-renders the nav so the module's tab appears/disappears via
`ib_sectionAllowed`. **Per house rule, no paid module is silently hidden** — inactive modules are shown
here with an explicit "Activate" path, and locked tabs surface upsell cards / "Soon" chips elsewhere.

## 5. Working flow

**A. Check usage and upgrade at a cap (core loop).**
1. Seller is on **Business** and hits **"Add product"** in the Business tab; a cap toast fires
   (`showToastWithAction` — "Upgrade plan") via `ent_capGuard` reading
   `IBEntitlements.atCap('business-verified','products',used)`.
2. Seller opens **Plans** (`goSection('plans')` from the toast or nav).
3. The **My Plan** panel shows Products `25 / 25` with the amber `myp-bar-cap` bar and hint **"Limit
   reached — upgrade to add more."**
4. Seller clicks **"Change plan"** → `scrollToCategory('business')` jumps to the Business plan grid.
5. Seller picks a higher tier (e.g. via the modules manager `<select>` → `ib_activateModule`), gets
   **"Business activated"** toast; the meter limit recomputes from `ib-entitlements.js` and the
   Business "Add product" cap lifts — **a write here surfaces live in the Business tab**.

**B. Activate a new module (entry → exit).**
1. From any upsell that routed here (Autogrowth term-cap "Upgrade to add more", Banner Ads "See plans",
   Insights "Compare plans").
2. In **Your modules**, the relevant module reads **"Inactive"**.
3. Seller clicks **"Activate"** (and, for selling modules, picks a tier) → `ib_activateModule(key)`.
4. `showToast('<Module> activated')`; nav re-renders and the **module's own tab appears**
   (`ib_sectionAllowed` now true) — e.g. activating Autogrowth reveals the Autogrowth funnel; the
   exclusivity card on My-Plan flips to **"Exclusive routing active"** if the tier grants
   `exclusivity`.

**Spine connections:** Plans is the hub of the upgrade spine — the My-Plan exclusivity/reach reflect
the same `networkTier`/`routing` that drives **enquiry routing** (`IBEntitlements.priorityFor` →
P1–P4) in Enquiries/Pipeline, and the meters mirror the listing counts written in Business/Shop/
Architecture. "Manage billing" hands off to the **Billing** tab (`membership`) for the actual
plan-change request.

## 6. Data · States · A11y · Copy

**Data (services → DataSource; never raw localStorage/fetch):**
- `EntitlementService` wrapping **`ib-entitlements.js`** — `of` / `meters` / `limit` / `atCap` /
  `networkTier`. Authoritative; read, never hardcode.
- Live usage counts feeding `meters(usage)` come from `ProductService` / `ServiceService` /
  `CatalogueService` / `ArchitectService` (projects) and the profile (keywords/categories) — spine
  groups: listing content + seller assets.
- Module activation state: `EntitlementService`/seller-module store (`sellerModules`), surfaced by
  `ib_activeModules` / `ib_hasModule` / `ib_modulePlan`.

**States:**
- **Loading:** standard skeleton for the My-Plan card + meters; the nav and poster strip render
  immediately.
- **Empty:** a brand-new seller with no listings shows meters at `0 / cap` (not "empty") — the page is
  inherently action-oriented (poster strip + modules manager). Buyer with no plan → buyer hero +
  **"Register your business"** CTA.
- **Locked / gated (seller):** inactive modules render in "Your modules" with an explicit **"Activate"**
  control (never silently hidden); at a feature cap the meter shows the `myp-bar-cap` bar + hint and
  cap toasts route here.
- **Error:** engine not loaded → My-Plan panel returns empty (fail-safe) rather than crashing the page;
  a failed meter degrades inline, the rest of the page still renders.
- **Success:** `showToast('{Module} activated' | 'deactivated')`; nav re-renders to reveal/hide the tab.

**A11y:** one **H1** ("Explore plans"); landmarks `header`/`aside`/`main`; active nav `.dn-item`
`aria-current`. Status is **icon + text** not colour (exclusivity card pairs `ti-lock`/`ti-bolt`/
`ti-users` with its title; at-cap meter pairs amber bar with the "Limit reached…" text). Module
controls are real `<button>`/`<select>` with labels; toasts `aria-live="polite"`.

**Copy (verbatim):** "Explore plans" · "You have N active module(s)…" · "manage billing" ·
"Change plan" · "See plans" · "Exclusive routing active" / "Priority routing" / "Shared visibility"
(with bodies above) · "Limit reached — upgrade to add more." · "Your modules" · "N active" ·
"Active" / "Inactive" · "Activate" / "Deactivate" · "Each module is an independent subscription —
activating one unlocks its tab; the tier sets your access level." · meter labels: "Products",
"Services", "Catalogues", "Categories", "Search keywords", "Projects" · "Unlimited".

---

**Build notes (React):** `components/SellerDashboard/Plans/` (My-Plan panel + poster strip + modules
manager); uses `EntitlementService` (wrapping `ib-entitlements.js`: `of`/`meters`/`limit`/`atCap`) for
the plan card and caps, the seller-module store for activation, and `ProductService`/`ServiceService`/
`CatalogueService`/`ArchitectService` for live usage counts — all via DataSource.
