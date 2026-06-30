# PAGE: Seller dashboard

```
PROTOTYPE: pages/dashboard-seller.html   ROUTE: PAGES.DASHBOARD_SELLER ("/dashboard/seller")   LAYOUT: Dashboard (self-contained chrome, NO portal layout)
```

The richest page in the portal — the seller's whole operating console. It runs the business:
enquiries, pipeline, quotations, listings, plan. Everything in
[README.md](../README.md) §B is answered below, grounded verbatim in the
prototype. The seller's experience is **plan-aware throughout** — every gate reads its limits from
[`ib-entitlements.js`](../../../Prototype/ib_prototype_7.2.1/assets/ib-entitlements.js), never from a
hardcoded number in a component.

This folder breaks the seller dashboard into **one spec per section/tab**: this README is the shared
overview; each section below has its own **page-tab → module → feature → functionality → working-flow**
spec. The 12-point page template is in [../README.md](../README.md) §A.

## Tabs in this folder (18 sections, 4 nav groups)
Status: ☐ not started · ◐ drafting · ✅ spec complete · 🔨 built in React

| # | Section (nav label) | Spec | View id | Module gate | Status |
|---|---------------------|------|---------|-------------|--------|
| | **WORK — "Inbox & pipeline"** | | | | |
| 1 | Overview | [overview.md](overview.md) | `overview` | universal | ✅ |
| 2 | Enquiries | [enquiries.md](enquiries.md) | `connections` | universal (plan-aware routing) | ✅ |
| 3 | Pipeline | [pipeline.md](pipeline.md) | `pipeline` | any selling module | ✅ |
| 4 | Autogrowth | [autogrowth.md](autogrowth.md) | `autogrowth` | `autogrowth` | ✅ |
| 5 | Quotations | [quotations.md](quotations.md) | `quotations` | any selling module | ✅ |
| 6 | Reviews | [reviews.md](reviews.md) | `reviews` | any selling module | ✅ |
| 7 | Insights | [insights.md](insights.md) | `insights` | universal (depth by plan) | ✅ |
| | **ASSETS — "My business"** | | | | |
| 8 | Business | [business.md](business.md) | `business` | `business` | ✅ |
| 9 | Shop | [shop.md](shop.md) | `shop` | `shop` | ✅ |
| 10 | Architecture | [architecture.md](architecture.md) | `architecture` | `architect` | ✅ |
| 11 | Banner Ads | [banner-ads.md](banner-ads.md) | `banner-ads` | `bannerAds` (paid) | ✅ |
| | **PERSONAL** | | | | |
| 12 | Saved | [saved.md](saved.md) | `saved` | universal | ✅ |
| 13 | Recent activity | [activity.md](activity.md) | `activity` | universal | ✅ |
| | **ACCOUNT — "Profile & settings"** | | | | |
| 14 | Profile | [profile.md](profile.md) | `profile` | universal | ✅ |
| 15 | Plans | [plans.md](plans.md) | `plans` | universal (the plan surface) | ✅ |
| 16 | Billing | [billing.md](billing.md) | `membership` | universal | ✅ |
| 17 | Settings | [settings.md](settings.md) | `settings` | universal | ✅ |
| 18 | Password & security | [security.md](security.md) | `security` | universal | ✅ |

## How each tab spec is structured
Every section spec answers, in order:
1. **Page-tab** — what the section is; nav group/label/icon/chip; default?; reached via `?tab=<id>`; who sees it (`ib_sectionAllowed`).
2. **Module** — which subscription module it belongs to + plan-gating (visibility + depth), with the entitlement reads (`IBEntitlements.of/limit/atCap/meters`).
3. **Features** — the discrete features/sub-areas (verbatim names).
4. **Functionality** — what each feature does: controls, data (services → DataSource), caps/gating UI, behaviour.
5. **Working flow** — the step-by-step seller flow(s), and how the section connects to other sections + the shared spine (e.g. enquiry → pipeline → quotation).

Then a compact **Data · States · A11y · Copy** footer (services/spine; loading/empty/locked/error/success; a11y; verbatim copy + gating messages) for build-readiness.

---

## 1. Purpose
Give a logged-in seller a single, self-contained console to run their Interior bazzar business —
triage qualified enquiries, move deals through the pipeline, build and send quotations, manage
listings/shop/architecture assets, and see/upgrade their plan — with every capability they don't yet
have signalled (never hidden) so the path to upgrade is always visible.

## 2. Journey
- **Actor:** Seller (only). Plan-aware throughout (module-driven: a seller can hold Autogrowth,
  Business, Shop, Architecture and Banner Ads as *independent* subscriptions).
- **Stage:** Set up → Receive → Respond → Convert → Manage (the whole back half of the seller journey
  in [../modules-features-flow.md](../../modules-features-flow.md) §1.2).
- **Precedes:** every seller task; the Pipeline → Quotation conversion (`new-quotation.html`); Plans
  upgrade (`plans-checkout.html`).
- **Leads to:** the Connect/enquiry spine (read), the quotation builder, plan checkout, and the public
  listing pages (via "Preview listing").

## 3. Auth
**Auth-required (seller).** No public view. The page assumes `ib_auth` present + `isSeller`. It is
**plan-aware**: `dashState.user.sellerModules` (each module = an independent subscription) drives which
nav sections appear and how deep each feature goes via `IBEntitlements.of(planKey)`. A logged-in buyer
with **no** selling module resolves to `FREE` (`label:'No active plan'`) — universal sections still
render; selling sections (Pipeline/Quotations/Reviews + the module surfaces) are gated out or shown as
upsell.

## 4. Layout
**Dashboard (self-contained chrome, NO portal layout)** — does **not** use the Browsing topbar/sidebar.
Own chrome:
- **`<header class="dash-topbar">`** (`.dt-left` logo "Interior **bazzar**" → home, `#dtSectionTag`
  active-section tag; `.dt-right`: search, Saved dropdown `#dtSavedBadge`, notifications, avatar menu
  `#dtMenu`).
- **`<aside class="dash-nav">`** rendered by `renderNav()` — user card (`.dn-user` avatar/name/email +
  `.dn-seller-badge` showing the tier word, or `.dn-verified-pill` "IB VERIFIED"), then four grouped
  section lists.
- **`<main class="dash-main" id="dashMain">`** holds the active section (`renderContent()`); switches to
  `dash-main conn-workspace-mode` for the Enquiries workspace and the product/service/catalogue detail
  editors (full-height, sticky footer).

## 5. Sections (the nav — ~18 sections in 4 groups)
Nav is built from `window.dashSections` and grouped by `s.group` into four labelled blocks
(`renderNav()`): **`main` → "Inbox & pipeline"**, **`business` → "My business"**, **`personal` →
"Personal"**, **`account` → "Profile & settings"**. Each item is a `.dn-item` button (`.on` when active,
`.is-soon` dimmed for "Soon"); a live count chip comes from `ib_getSidebarChip(id)` else a static
`s.chip`. Visibility per item is `ib_sectionAllowed(id)`: module-gated ids hide unless that module is
active (`IB_SECTION_MODULE`); `pipeline`/`quotations`/`reviews` need **any** selling module
(`ib_anySellingModule()`); everything else is universal.

> **Gating UI standard** (from [modules-features-flow.md](../../modules-features-flow.md) Part 3 §"Gating UI
> standard"): (1) disabled control + `ti ti-lock` + `data-tip` tooltip; (2) at a cap → modal toast via
> `showToastWithAction(...)`; (3) nav `<span class="dn-item-chip soon">Soon</span>` + `.is-soon`;
> (4) whole-section upsell card. **Never silently hide a paid capability** — signal it.

### WORK — group `main` ("Inbox & pipeline")
| # | Section (id) | Shows | Key actions | Plan gating |
|---|--------------|-------|-------------|-------------|
| 1 | **Overview** (`overview`) | KPI tiles ("Active conversations", "Deals won this month" `₹{}L total`, "Return on plan" `{roi}×` vs `₹{}k subscription`), a **Cost of inaction** band — *"{₹} on the table … Every exclusive enquiry you don't answer expires — and goes nowhere else."* CTA "Reply now"; "Needs your attention" + Pipeline snapshot. | "Reply now", KPI tiles → deep-link sections. | Universal. ROI/plan cost derive from the resolved plan. |
| 2 | **Enquiries** (`connections`) | The inbox workspace (list ↔ opened thread). Each row carries a qualification/intent tag (`ent_enquiryIntent` → Confirmed/Urgent/Intent/Interested) and an **exclusivity chip** (`ent_exclusivityChip`). | "Respond", accept/decline, message (WhatsApp/phone/email), move stage. | Chip "Needs your attention" count = pending. Exclusivity reads plan: `exclusivity` → "Exclusive to you" (*"Routed only to you — never shared with competitors."*); `routing:'priority'` → "Priority routed"; else "Shared" (*"…Upgrade for priority or exclusivity."*). 4-step qualification adds an "Agent" cleared-step only on `qualification:'4-step'` plans. |
| 3 | **Pipeline** (`pipeline`) | Kanban of deals by `dealStage` new→…→won/lost; snapshot mirrors the board. | "Move to next stage", "Mark as won", → "Create quotation". | Needs any selling module. Chip = active (non-terminal) deal count. Pipeline depth grades by plan (`pipeline: tracker→visual→multi-stage`). |
| 4 | **Autogrowth** (`autogrowth`) | The growth funnel — reach (states), segments, search terms (rankings), qualification funnel. Header plan badge → Plans. | Add state/segment/search-term chips; tune funnel. | Module-gated (`autogrowth`). If not on Autogrowth: full-section **upsell card** — h "**You're not on Autogrowth yet**", feats "Qualified, not raw / Exclusive to you / Full visibility", CTA "**See Autogrowth plans**". Caps read live: search terms `rankings` 3/6/10 → at cap `ag-term-cap` "*You've used all {n} search terms — upgrade to add more.*" + "**Upgrade to add more**"; states `states` 2/5/∞, segments `segments` 2/3/∞ → toast "*Your {plan} plan covers {n} states/segments — upgrade to add more.*". Agent-verification stage `.ag-stage-locked` on Launch → data-tip "*Add agent verification — upgrade to Scale*". |
| 5 | **Quotations** (`quotations`) | List of quotations with derived status (sent/viewed/…); links to the builder. | "Create quotation", "Send quotation", download PDF, send on WhatsApp (`data-tip` per button). | Needs any selling module. Chip = open (sent/viewed) count. Proposal style grades by plan (`proposals: smart→professional→branded`). |
| 6 | **Reviews** (`reviews`) | `Reviews` header + count "*{n} reviews · {n} awaiting reply*"; score sidebar + recent list; filter by type (Business/Architects/Shops). | Reply to a review, hide. | Needs any selling module. Chip = unreplied published count. Empty: "*No reviews yet — your first review will appear here when a buyer rates you.*" |
| 7 | **Insights** (`insights`) | Performance analytics for the seller. | view/segment metrics. | Universal surface; data depth grades by plan (`analytics: basic→advanced→professional`). |

### ASSETS — group `business` ("My business")
| # | Section (id) | Shows | Key actions | Plan gating |
|---|--------------|-------|-------------|-------------|
| 8 | **Business** (`business`) | Header "**Your business**" + tab strip (`biz-tabs`): **Profile · Contact & forms · Products · Services · Catalogue · Analytics** (`setBusinessTab`). Products/Services/Catalogue are list↔detail editors. | "Preview listing"; "Import CSV" + "Add product"; "Add service"; "Add catalogue". | Module-gated (`business`). Chip = products+services+catalogues total. **Add is cap-guarded** (`ent_capGuard`): products 25/100/∞, services 10/50/∞, catalogues 2/10/∞ → cap toast "*You've reached your {feature} limit / Your {plan} plan includes {cap} {feature}. Upgrade to add more.*" CTA "**Upgrade plan**". A Shop without a Business profile adding products → "*That lives on a Business profile … register a Business profile.*" CTA "**Register business**". `soon` tabs → `data-tip="Coming soon"` + `<span class="biz-tab-soon">Soon</span>`. |
| 9 | **Shop** (`shop`) | Retail storefront: media, contact & forms, analytics; one shop, `shopCatalogue` unlimited. | "Create shop", edit, preview. | Module-gated (`shop`). Chip = non-archived shop count. Featured banner = Plus+ (`promotion`), campaign mgr = Pro (`campaign:true`). Products/services/catalogues are 0 on Shop plans — those need a linked Business profile. |
| 10 | **Architecture** (`architecture`) | Architect profile wizard (identity, practice, portfolio, USP, contact) + analytics. | Add project, complete wizard sections. | Module-gated (`architect`, key `arch-*`). One profile (no chip). `team`/`awards` off on Verified, on Plus+; `insights` only on Pro. |
| 11 | **Banner Ads** (`banner-ads`) | Per-banner purchase model: build creative → pick spots + duration → pay → review → live. Banner list / empty state. | "Create your first banner" / "Create banner". | Module-gated (`bannerAds`); needs any **paid** plan. If unpaid: **upsell card** — h "**Banner Ads needs a paid plan**", feats "Pick spots per banner / Reviewed before live / Exclusive enquiries", CTA "**See plans**". |

### PERSONAL — group `personal` ("Personal")
| # | Section (id) | Shows | Key actions | Plan gating |
|---|--------------|-------|-------------|-------------|
| 12 | **Saved** (`saved`) | Bookmarked marketplace items (seller-as-buyer): products/services/businesses/architects — same shape as buyer dashboard Saved. | Open item, remove save. | Universal. Chip = saved-items count. |
| 13 | **Recent activity** (`activity`) | Audit log of the seller's recent actions. | — (read). | Universal. |

### ACCOUNT — group `account` ("Profile & settings")
| # | Section (id) | Shows | Key actions | Plan gating |
|---|--------------|-------|-------------|-------------|
| 14 | **Profile** (`profile`) | Seller identity profile. | Edit profile. | Universal. |
| 15 | **Plans** (`plans`) | The **My Plan** panel — per-module usage **meters** (`IBEntitlements.meters(plan,usage)`: Products/Services/Catalogues/Categories/Search keywords/Projects, each with `pct`/`atCap`); at-cap bar `myp-bar-cap` + hint "*Limit reached — upgrade to add more.*" "**Change plan**" / "**Upgrade**". Plan grid to activate modules. | "Change plan", "Upgrade", activate/deactivate module. | Universal entry, but the panel *is* the plan surface. Meters/labels read entirely from `ib-entitlements.js`. |
| 16 | **Billing** (`membership`) | Subscription/billing (per-module). | Manage billing; request plan change. | Universal. Plan-change copy: "*A request does not charge you. Billing is settled with our team after approval.*" |
| 17 | **Settings** (`settings`) | Account settings. | Edit settings. | Universal. |
| 18 | **Password & security** (`security`) | Password + security. | Change password, security controls. | Universal. |

## 6. Data
`?tab=`-equivalent: in the prototype the active section is driven by **`window.location.hash`**
(`#section` or nested `#section/sub`, parsed in `renderDash`) → `dashState.section` + `dashState.subRoute`;
`goSection(id)` switches and re-renders. **In React, mirror this as `?tab=<section>` via
`useSearchParams`** (per the page brief) so the active section is URL-addressable; keep the
`#section/sub` nested form for deep links (e.g. an enquiry id). All reads/writes go through services →
DataSource — **never** raw `localStorage`/`fetch` (see
[../../Environment-Management-backend.md](../../../Environment-Management-backend.md) and
[../../Integration.md](../../../Integration.md)).

| Surface | Service (local-first) | Spine/source |
|---------|-----------------------|--------------|
| Enquiries / Pipeline / Overview KPIs | `EnquiryService.list()` / `.update(stage)` | `enquiries` (`ib:sharedenquiry`) — written by the Connect modal |
| Quotations | `QuotationService.list()` / `.create()` / `.send()` | quotations spine |
| Reviews | `ReviewService.forSeller()` / `.reply()` | seller reviews |
| Listings — products/services/catalogues | `ProductService` / `ServiceService` / `CatalogueService` | listing content |
| Shop / Architecture / Banner ads | `ShopService` / `ArchitectService` / `BannerAdService` | seller assets |
| Saved / Activity | `SavedService.list()` / `ActivityService.list()` | buyer-shape saved + audit log |
| Plan / modules / meters | `EntitlementService` wrapping **`ib-entitlements.js`** (`of`/`limit`/`atCap`/`meters`/`networkTier`) | **authoritative entitlement source — read, never hardcode** |

**Entitlement read pattern (authoritative):** every gate calls
`IBEntitlements.of(plan)` / `.limit(plan,feat)` / `.atCap(plan,feat,used)` / `.meters(plan,usage)` —
families/tiers/limits live in `ib-entitlements.js` (Autogrowth `ag-*`, Business `business-*`, Shop
`shop-*`, Architect `arch-*`; `FREE` default; `Infinity`→"Unlimited" via `fmtLimit`). Priority routing
(`priorityFor(qualTier, plan)` → P1–P4) decides enquiry lane.

## 7. Primary CTA
**Primary — "Respond"** (answer a qualified enquiry from Enquiries/Overview "Reply now"): the seller's
core job, and the action the whole exclusive-routing model depends on. Secondary CTAs (verbatim,
context-gated):
- "Create quotation" / "Send quotation" (Pipeline → Quotations).
- "Add product" / "Add service" / "Add catalogue" (Business) — each behind `ent_capGuard`.
- "Create shop", "Create your first banner", architecture wizard steps.
- Upgrade paths: "See Autogrowth plans", "See plans", "Upgrade plan", "Upgrade to add more",
  "Change plan", "Register business".
- "Preview listing" → public detail page.

Every CTA resolves to a next journey step. Exact strings from
[../copywriting.md](../../copywriting.md).

## 8. States
- **Loading:** skeletons per section (standard skeleton, not a bare spinner); the nav renders immediately
  from `dashSections`.
- **Empty (always with a next action):** Reviews — "*No reviews yet — your first review will appear here
  when a buyer rates you.*"; Banner Ads — "*No banners yet*" + "Create your first banner"; empty
  pipeline/quotations/enquiries each offer their create/forward CTA. No dead ends.
- **Locked / gated (not "empty"):** module not held → upsell card (Autogrowth, Banner Ads) or the section
  is hidden from nav by `ib_sectionAllowed`; at a cap → modal toast with an upgrade CTA; "Soon" features
  → dimmed `.is-soon` item that still navigates to a stub. A paid capability is **never** silently hidden.
- **Error:** a failed section degrades to an inline retry; the rest of the console still renders.
- **Success:** module activate/deactivate → `showToast('{Module} activated'|'deactivated')`; quotation
  sent / reply posted → success toast.

## 9. Responsive
- Desktop: fixed `dash-topbar` + persistent `dash-nav` aside + `dash-main`.
- Narrow: nav collapses to a drawer; the Enquiries workspace (`conn-workspace-mode`) switches between list
  and opened-thread rather than side-by-side; tab strips (`biz-tabs`) scroll horizontally; KPI tiles
  reflow to one column.
- Touch targets ≥ 38px; `.dn-item`, tabs, kanban controls all meet this.

## 10. Accessibility
- Landmarks: `header` (dash-topbar), `aside` (dash-nav), `main` (`#dashMain`). The active `.dn-item` is
  `aria-current`; nav items are real `<button>`s.
- One **H1** per section (`.dm-title` / `biz-title` — e.g. "Your business", "Reviews"); no skipped levels.
- **Locked state exposed to AT**, not colour-only: gated controls get `aria-disabled` + the `data-tip`
  text present in the DOM; "Soon"/exclusivity/intent tags pair an icon **and** text with the colour.
- Kanban moves keyboard-operable; quotation-builder + listing-editor fields all `<label for>`-linked;
  toasts/modals announced (`aria-live="polite"`), focus-trapped, Esc/backdrop close.
- Full checklist: [../modules-features-flow.md](../../modules-features-flow.md) §5;
  tokens/states in [../style.md](../../style.md).

## 11. Copy
- Brand voice: lowercase-b "**Interior bazzar**"; British "**enquiry**"; CTAs **Title Case**, no caps/"!".
- Use the **verbatim** prototype strings quoted in §5 (section labels, group labels, upsell headlines,
  cap toasts, exclusivity tooltips, empty states) — don't invent. Source of truth for wording:
  [../copywriting.md](../../copywriting.md).
- Never re-word a gating message to soften that it's a paid capability; the upgrade path must stay legible.

## 12. SEO
Not a public page — **auth-gated, `noindex`**. No PublicPage meta; document title "Seller dashboard —
Interior Bazzar" (chrome only). Canonical/SEO concerns N/A.

---

### Build notes (React)
- Page shell: `src/pages/DashboardSeller/index.tsx` + `useDashboardSeller.ts` + module CSS; renders the
  own-chrome dashboard (topbar + nav `aside` + `main`), **not** the portal Browsing layout.
- Drive the active section from `?tab=<id>` via `useSearchParams` (mirroring the prototype's
  hash-routing), with `ib_sectionAllowed`-equivalent gating computed from the resolved plan; keep
  `#section/sub` deep links for enquiry ids.
- Each section is its own component under `components/DashboardSeller/<Section>/`; the page just orders
  them by group (`main`/`business`/`personal`/`account`).
- **All entitlement reads go through one `EntitlementService` wrapping `ib-entitlements.js`** — limits,
  meters, caps, network tier, priority. No component hardcodes a plan number.
- Data flows services → DataSource (local-first → API unchanged later);
  see [../../Environment-Management-backend.md](../../../Environment-Management-backend.md) and
  [../../Integration.md](../../../Integration.md). Cross-refs:
  [README.md](../README.md), [../modules-features-flow.md](../../modules-features-flow.md),
  [../style.md](../../style.md), [../copywriting.md](../../copywriting.md).
- Verify visually with the headless-screenshot method (portal-conversion memory): compare `?tab=…`
  against `file:///…/pages/dashboard-seller.html`. Gate with `tsc -b` + `vite build`.
