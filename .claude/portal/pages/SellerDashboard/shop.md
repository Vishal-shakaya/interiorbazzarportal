# TAB: Shop — Seller Dashboard

```
PARENT: README.md  ·  VIEW id: shop  ·  GROUP: business (ASSETS — "My business")  ·  PROTOTYPE: pages/dashboard-seller.html
```

> Links: parent overview = [README.md](README.md) · pages index = [../README.md](../README.md) ·
> modules-features-flow = [../../modules-features-flow.md](../../modules-features-flow.md) ·
> style = [../../style.md](../../style.md) · copywriting = [../../copywriting.md](../../copywriting.md) ·
> environment seam = [../../../Environment-Management-backend.md](../../../Environment-Management-backend.md) ·
> integration = [../../../Integration.md](../../../Integration.md) ·
> prototype = [../../../Prototype/ib_prototype_7.2.1/pages/dashboard-seller.html](../../../Prototype/ib_prototype_7.2.1/pages/dashboard-seller.html)

This spec is the **Shop** section of the seller dashboard, grounded verbatim in the prototype
(`renderShopSection` → `renderShopsList` / `renderShopDetailPage`, line ~40219 onward) and the authoritative
row #9 in [README.md](README.md) §5. Shop is a **retail storefront** asset: a seller's physical showroom(s)
so local buyers can find them on the map, see hours, and walk in or enquire. It is its own **paid product
with a per-shop subscription** — *not* bundled into the selling plans — and one seller can hold many shops.

---

## 1. Page-tab

**What it is.** The seller's storefront manager. The section has two states sharing the same view id:
- **List view** (`window.shopsUI.view !== 'detail'`) — header **"Your shops"** with primary **"Add shop"**;
  status-chip filter, sort, list/grid toggle; one row/card per shop. First-ever visit shows the empty state.
- **Detail / editor** (`window.shopsUI.view === 'detail'`) — a full-bleed per-shop editor (`renderShopDetailPage`)
  with a setup progress ring, status pill, tab strip, form + a right-hand action rail and sticky footer.

**Where it sits in the nav.** Group **`business`** ("My business" — the ASSETS block), label **"Shop"**,
icon **`ti-building-store`** (`dashSections`: `{id:'shop', label:'Shop', icon:'ti-building-store', group:'business'}`).
Peer of Business, Architecture, Banner Ads. **Chip/count:** the non-archived shop count via `ib_getSidebarChip('shop')`
(else static `s.chip`); the empty/zero case renders no chip.

**Default view?** No. The default section is `overview`; if the resolved plan ever makes `shop` disallowed while
it's active, `renderDash` falls back to `overview` (`if(!ib_sectionAllowed(section)) section='overview'`).

**How it's reached.** `?tab=shop` (React mirror of the prototype's `#shop` hash via `useSearchParams`). Keep the
nested deep-link form `#shop/<shopId>` for opening a shop's editor directly (mirrors `dashState.subRoute` →
`shopsUI.detailId`/`view:'detail'`). Cross-links land here too: Billing's shop-subscriptions block uses
`goSection('shop')` ("Go to shops" / "Manage shops").

**Who sees it (visibility gating).** `ib_sectionAllowed('shop')` → `ib_hasModule('shop')`
(`IB_SECTION_MODULE.shop === 'shop'`). The nav item only appears when the seller holds the **Shop module**.
A seller without it does not see Shop in the nav (it is **module-gated by presence**, like Business/Architecture);
the upgrade path to acquire the module lives in **Plans**.

---

## 2. Module

**Module:** **Shop** (`family: 'shop'`) — an **independent subscription** the seller can hold alongside Autogrowth,
Business and Architecture. Section visibility is the **`IB_SECTION_MODULE.shop`** gate via `ib_sectionAllowed`/
`ib_hasModule('shop')`; the plan resolves through `ib_modulePlan('shop')` → `IBEntitlements.of(planKey)`.

**Tiers (read from [`ib-entitlements.js`](../../../Prototype/ib_prototype_7.2.1/assets/ib-entitlements.js), never hardcode):**

| Plan key | `IBEntitlements.of(...)` label | reach | `promotion` | `campaign` | `placement` | `shopCatalogue` | products/services/catalogues |
|----------|-------------------------------|-------|-------------|-----------|-------------|------------------|------------------------------|
| `shop-verified` | **Shop Verified** (badge "Verified Shop") | `local` | `standard` | `false` | `standard` | `Infinity` (Unlimited) | **0** (`linkableFromBusiness: true`) |
| `shop-plus` | **Shop Plus** (badge "Trusted Seller") | `city` | `featured-banner` | `false` | `priority` | `Infinity` | **0** |
| `shop-pro` | **Shop Pro** (badge "Premium Seller") | `state` | `premium` | `true` | `featured` | `Infinity` | **0** |

`ib_defaultTierFor('shop') === 'shop-pro'`.

**How deep the feature goes (depth-by-plan, every limit from entitlements):**
- **Storefront catalogue** — `shopCatalogue: Infinity` on all Shop tiers, but a separate hard display cap
  `SH_MAX_CATALOGUE = 24` governs the lightweight "Products & Services" grid (see §4). Full products/services/
  catalogues are **0** on every Shop plan (`products/services/catalogues: 0`) — those need a **linked Business profile**.
- **Featured banner** — `promotion` grades `standard → featured-banner → premium`; the seller's featured-banner
  treatment is **Plus+** (`promotion !== 'standard'`).
- **Campaign manager** — `campaign:true` only on **Shop Pro** (`shop-verified`/`shop-plus` → `false`).
- **Reach / placement** — `reach` (`local→city→state`) and `placement` (`standard→priority→featured`) widen by tier;
  surfaced as the badge word (`badge`) on the user card (`.dn-seller-badge`).

**Gating UI standard** (never silently hide a paid capability — [modules-features-flow.md](../../modules-features-flow.md) Part 3):
a tier-locked control gets disabled + `ti ti-lock` + `data-tip` tooltip; a cap returns a `showToast`/
`showToastWithAction` toast; "Soon" sub-features dim with a `Soon` chip; an unheld module shows the upsell path
(here, via Plans). Read every limit through **`EntitlementService`** wrapping `ib-entitlements.js`
(`of` / `limit` / `atCap` / `meters` / `networkTier`).

---

## 3. Features

Discrete sub-areas of the Shop tab (verbatim names from the prototype):

- **Your shops** — list/grid of shops with **Add shop** (`sh_create()`).
- **Empty state** — "No shops yet" → **Add your first shop**.
- **Toolbar** — status chips (**All · Inactive · Open · Closed · Permanently Closed**), **sort** (Recently updated /
  Name (A–Z) / Most enquired / Highest rated / Most viewed), **view toggle** (List / Grid).
- **Shop editor** (per shop, `renderShopDetailPage`) — progress ring + status pill + tab strip + action rail + footer.
  Editor tabs: **Details · Location & hours · Photos & media · Products & Services · Campaign · Contact & forms** (+ **Analytics** in edit mode).
- **Setup checklist** (action rail, 6 pillars): Name & primary category · Address with city & pincode · At least one
  open day with hours · Minimum 3 photos · Phone or WhatsApp · **Active subscription**.
- **Subscription panel** (action rail) — per-shop plan, expiry, auto-renew toggle, Renew.
- **Products & Services** grid (`sh_renderTab_ShopCatalogue`) — lightweight display items, cap `… of 24`.
- **Campaign** (`sh_renderTab_Campaign`) — one offer/event graphic on the public shop page.
- **Contact & forms** (`sh_renderTab_Contact`) — phone/WhatsApp, routing mode, enquiry forms.
- **Status lifecycle** — Open / Close / Reopen / Move to Inactive (footer actions).

---

## 4. Functionality

All reads/writes go through services → DataSource. The primary service is **`ShopService`** (seller-assets spine);
entitlement gating through **`EntitlementService`**; enquiries it generates land on the shared `enquiries` spine.

### List view (`renderShopsList`)
| Control | Verbatim | Behaviour / data |
|---------|----------|------------------|
| Header title | **"Your shops"** | `renderShopSectionHeader` (reuses `.biz-header` pattern, peer of Business). |
| Primary CTA | **"Add shop"** (`<i ti-plus>`) | `sh_create()` → opens editor in create mode (blank draft `sh_blankShop()`). |
| Empty title/sub | **"No shops yet"** · *"Add your first showroom or physical store so local buyers can find you on the map, see your hours, and walk in."* | Shown only when `shops.length === 0`. |
| Empty CTA | **"Add your first shop"** | `sh_create()`. |
| Empty help | *"It takes about 8 minutes to set up a shop — name, address, hours, a few photos, and you're live."* | `ti-bulb`. |
| Status chips | **All · Inactive · Open · Closed · Permanently Closed** (with counts) | `sh_setStatusFilter(id)`; statuses map `draft→Inactive, active→Open, paused→Closed, archived→Permanently Closed` (`sh_statusMeta`). |
| Sort | Recently updated / Name (A–Z) / Most enquired / Highest rated / Most viewed | `sh_setSort(value)`. |
| View toggle | List view / Grid view (`data-tip`) | `sh_setViewMode('list'|'grid')`. |
| No-results | **"No shops match this filter"** · *"Try a different status, or clear the filter."* + **"Clear filter"** | `sh_clearFilters()`. |
| Row/card | cover (`sh_resolveCoverStyle`), name+meta, location, **status pill**, enquiries, actions; **expiry pill** (`sh_renderExpiryPill`: "Renew to reopen this shop" / "Renew before this date to stay open" / "Subscription is healthy"). | List `renderShopListRow` / grid `renderShopGridCard`. |

Note: the search input was intentionally removed (`renderShopsList` clears any stale `ui.searchQ`) — small shop counts don't need it.

### Shop editor (`renderShopDetailPage`)
- **Header:** breadcrumb **Back → Shop → `<shop name>`** (`sh_attemptBack`), **"Back to shops"**; a **progress ring**
  (`sh_setupPercent`, `data-tip="{n}% setup complete"`); the **status pill** (Inactive/Open/Closed/Permanently Closed);
  an auto-save pill (**"Saved {ago}"** / "Not yet saved" / "New shop", `data-tip="Auto-saves every 8 seconds"`);
  in edit mode a kebab (`sh_toggleTileMenu`). **Tab strip** with a `sh-edit-tab-dot` "pending item(s)" indicator from `sh_missingPillars`.
- **Auto-save:** `sh_startAutoSave` + `sh_autoSave` (every ~8s); field writes go through `sh_update*` then persist via `ShopService`.

**Editor tabs (`sh_renderDetailTab`):**

| Tab | Verbatim labels / microcopy | Controls & data | Caps / gating |
|-----|-----------------------------|------------------|----------------|
| **Details** | "Name & primary category" (pillar) | name, primary category, tagline → `ShopService` | Identity pillar #1. |
| **Location & hours** | "Where is this shop?" · *"Buyers search by city and pincode — accuracy here drives walk-in traffic."*; Address line 1/2 `*`, City `*`, Pincode `*` (validated `sh_validatePincode`), State, Country; hours, amenities; static map placeholder | `sh_updateAddress`, hours editor → `ShopService` | Pillars #2 (address) + #3 (hours). Gate banner: *"{n} things left before this shop goes live"*. |
| **Photos & media** | (cover + gallery) | `sh_resolveCoverStyle`, photo uploads (`sh_processImageFile`) | Pillar #4: **"Minimum 3 photos"**. |
| **Products & Services** | "Products & Services · {n} of 24" · *"Show buyers what you offer — a photo, name, and rough price. This is a lightweight display, not full product management."* | **"Add item"** (`sh_catAddItem`); per item: name (e.g. "Statuario marble"), Value ("from ₹350/sqft"), one-line note, photo; **"Add your first item"** empty CTA *("e.g. Italian marble — Statuario · from ₹350/sqft")*; footer *"Where buyers see this: a 'What we stock' grid on your public shop page."* | **Hard cap `SH_MAX_CATALOGUE = 24`**: at cap the Add button hides; programmatic add → `showToast('Maximum 24 items','warning')`. Biz-link note: *"Want full products, services & catalogues with quotations? Those live on your **Business profile** — register one to manage them with full pricing and quote flows."* (because `products/services/catalogues: 0` on Shop plans). |
| **Campaign** | "Offer / event graphic" · *"Upload a banner for a current discount or event. It shows on your public shop page — no paid boosting, just your own storefront."*; Headline (e.g. "Monsoon Sale — 20% off all tiles"), Valid from / Valid to, toggle **"Show this offer on my public shop page"**; warn *"Add a graphic above — buyers won't see anything until you do."* | `sh_campUpdate`, `sh_campPickImage` → `ShopService` | **Campaign manager is Shop Pro** (`campaign:true`). On Verified/Plus signal it (disabled toggle + lock + `data-tip`), never hide — read `IBEntitlements.of(plan).campaign`. Featured-banner treatment grades on `promotion` (Plus+). |
| **Contact & forms** | "How can buyers reach this shop?" · *"At least one of phone or WhatsApp is required to publish."*; Phone `*`/WhatsApp business `*` ("Use business phone" / "Use business WhatsApp" `sh_useBusinessContact`); enquiry-routing mode; **enquiry forms** (`sh_getEnquiryForms` — baseline **Contact** is locked on and can't be turned off) | `sh_updateField`, `sh_toggleEnquiryForm` → `ShopService` | Pillar #5: **"Phone or WhatsApp"**. |
| **Analytics** (edit only) | (views / enquiries metrics) | `sh_renderTab_Analytics` | Depth grades by plan analytics tier. |

**Action rail (`sh_renderActionRail`):**
- **Setup checklist** (6 pillars, `sh_pillarStatus`) — clicking a content pillar jumps to its tab; clicking the
  **subscription** pillar opens checkout (`sh_showCheckout({action:'publish-existing'…})`) or renew if paid.
- **Subscription panel** (only when the shop has a plan) — Plan + price, Expires/Expired, **Auto-renew** toggle
  (`sh_toggleAutoRenew`), **"Renew or extend"** / **"Renew now"** / **"Renew to reopen"** (`sh_renewShop`).
  Expiry urgency badges: **Active / Renew soon / Expired**.
- **Tip card** — state-aware: *"Inactive — not yet visible … Finish the 6 items above and pay for a subscription — then
  the **Open shop** button unlocks."* / *"Open for buyers … Buyers in {city} can find this shop on the map."* /
  *"Closed temporarily … Hit **Reopen**."* / *"Permanently closed."*

**Footer actions (`sh_renderFooterActions`) — status-driven:**
| Status | Buttons |
|--------|---------|
| Inactive (draft) | **"Save inactive"** (ghost) + **"Open shop"** (primary, **gated**: disabled until `sh_setupPercent >= 100`, `data-tip="Finish the setup checklist on the right to unlock this"`) |
| Open (active) | **"Close shop"** (ghost) + **"Save changes"** |
| Closed (paused) | **"Save changes"** + **"Reopen shop"** |
| Permanently Closed (archived) | **"Move to Inactive"** |

**Publish gate (`sh_save('active')`):** promoting to active runs `sh_missingPillars`; content gaps route to the first
incomplete tab + toast *"{n} things left before this shop can go live"*; if only the **subscription** pillar is missing,
opens checkout, and on successful pay re-calls `sh_save('active')`. First publish toast:
*"\"{name}\" is now open on Interior bazzar 🎉"*.

---

## 5. Working flow

**A. Create & publish a shop (entry → core loop → exit)**
1. Seller (holding the Shop module) opens **?tab=shop** → **"Your shops"**. First time → empty state, taps **"Add your first shop"** (or **"Add shop"**). → `sh_create()`.
2. Editor opens at **Details**. Seller fills name + primary category (pillar 1); progress ring climbs as pillars complete.
3. Moves through **Location & hours** (address + at least one open day), **Photos & media** (≥ 3 photos), **Contact & forms** (phone or WhatsApp) — each ticks a checklist pillar in the rail.
4. Optionally adds storefront items in **Products & Services** (≤ 24) and a **Campaign** graphic (campaign manager = Pro).
5. Taps **"Open shop"**. If pillars incomplete → routed to the gap with a toast. If only subscription missing → **checkout** (per-shop plan). On pay → shop goes **Open**, toast *"… is now open on Interior bazzar 🎉"*.
6. **Exit:** back to **"Your shops"**, the new shop shows status **Open** and an expiry pill.

**B. Manage an existing shop**
1. From the list, open a shop → editor. Edit fields (auto-saved every ~8s) → **"Save changes"**.
2. Toggle availability: **Close shop** (paused, hidden from buyers) → **Reopen shop**; or archive → **Permanently Closed** → **Move to Inactive** to revive.
3. Manage the per-shop subscription in the rail (auto-renew, **Renew or extend**); an expired sub auto-pauses the shop (`pausedReason:'subscription_expired'`) → **Renew to reopen**.

**Connections to other tabs / the shared spine:**
- A published shop is a **source surface**: buyer enquiries from the shop page carry `sourceType:'shop'`
  (`ib_getSourceMeta` → "Shop" pill, `ti-building-store`) and flow into the unified **Enquiries** inbox
  (`enquiries` / `ib:sharedenquiry`), then **Pipeline** → **Quotations** — the same spine as Business/Architecture.
- **Billing** (`membership`) renders the **Shop subscriptions** block (`renderShopSubscriptionsBlock`): per-shop plan,
  expiry, auto-renew, run-rate; its CTAs **"Go to shops" / "Manage shops"** call `goSection('shop')`.
- **Plans** is where the Shop module is acquired/upgraded (Verified → Plus → Pro), which unlocks campaign/promotion depth here.
- Full products/services/catalogues are **not** here — the biz-link note routes the seller to register a **Business profile**.

---

## 6. Data · States · A11y · Copy

**Data.** Service: **`ShopService`** (`.list()` / `.create()` / `.update(status)` etc.) → DataSource; spine group
**seller assets** (`window.shops`). Enquiries from shops → **`EnquiryService`** on `enquiries` (`ib:sharedenquiry`).
Subscriptions surface in **Billing**. Gating/limits → **`EntitlementService`** wrapping `ib-entitlements.js`
(`of`/`limit`/`atCap`/`meters`/`networkTier`; `shopCatalogue`, `promotion`, `campaign`, `placement`, `reach`).
Never raw `localStorage`/`fetch`.

**States.**
- **Loading:** section skeleton (standard skeleton, not a bare spinner); nav renders immediately from `dashSections`.
- **Empty:** **"No shops yet"** + **"Add your first shop"** (always a next action); filtered-empty → **"No shops match this filter"** + **"Clear filter"**.
- **Locked / gated (seller):** Shop module not held → section hidden from nav (acquire via Plans, never a dead end);
  campaign manager off-tier → disabled toggle + lock + tooltip (Pro); storefront items at **24** → `showToast('Maximum 24 items','warning')`;
  **"Open shop"** disabled until setup 100% (tooltip) and subscription paid (routes to checkout).
- **Error:** failed section degrades to inline retry; the rest of the console still renders.
- **Success toasts:** *"\"{name}\" is now open on Interior bazzar 🎉"* / *"\"{name}\" — changes saved, still open"* /
  *"\"{name}\" closed — hidden from buyers"* / *"\"{name}\" saved as inactive"*.

**A11y.** Landmarks `header`/`aside`/`main` (`#dashMain`); active `.dn-item` is `aria-current`; **one H1** per state
("Your shops" / the shop name in the editor). Gated controls expose `aria-disabled` + the `data-tip` text in the DOM
(not colour-only); status is conveyed by **icon + text** (status pill dot + label; expiry pill `ti-alert-circle`/
`ti-clock-exclamation`/`ti-clock-check`), never colour alone. Editor inputs are `<label for>`-linked; the kebab menu is
`aria-haspopup`/`aria-expanded`; toasts `aria-live="polite"`.

**Copy (verbatim).** "Your shops" · "Add shop" · "Add your first shop" · "No shops yet" · "No shops match this filter" ·
"Clear filter" · "Open shop" · "Save inactive" · "Close shop" · "Reopen shop" · "Move to Inactive" ·
"Products & Services · {n} of 24" · "Add item" · "Add your first item" ·
*"Want full products, services & catalogues with quotations? Those live on your Business profile — register one to manage them with full pricing and quote flows."* ·
"Offer / event graphic" · "Show this offer on my public shop page" ·
"How can buyers reach this shop?" · *"At least one of phone or WhatsApp is required to publish."* ·
"Finish the setup checklist on the right to unlock this" · *"\"{name}\" is now open on Interior bazzar 🎉"*.
British "enquiry"; lowercase-b "Interior bazzar"; CTAs Title Case.

---

**Build notes (React):** `components/SellerDashboard/Shop/` (list `ShopList` + editor `ShopEditor` with tab
sub-components: Details, LocationHours, Media, ShopCatalogue, Campaign, Contact, Analytics; action-rail
SetupChecklist + SubscriptionPanel). Services: **`ShopService`** (assets, via DataSource), **`EntitlementService`**
(wrapping `ib-entitlements.js` for `shopCatalogue`/`promotion`/`campaign`/`placement`/`reach` + the `shop` module gate),
and **`EnquiryService`** for shop-sourced enquiries flowing to the shared spine.
