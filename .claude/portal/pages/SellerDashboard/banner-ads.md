# TAB: Banner Ads — Seller Dashboard

```
PARENT: README.md  ·  VIEW id: banner-ads  ·  GROUP: business (ASSETS — "My business")  ·  PROTOTYPE: pages/dashboard-seller.html
```

Cross-refs: parent overview [README.md](README.md) · pages index [../README.md](../README.md) ·
[modules-features-flow.md](../../modules-features-flow.md) · [style.md](../../style.md) ·
[copywriting.md](../../copywriting.md) · [Environment-Management-backend.md](../../../Environment-Management-backend.md) ·
[Integration.md](../../../Integration.md) · prototype
[`pages/dashboard-seller.html`](../../../Prototype/ib_prototype_7.2.1/pages/dashboard-seller.html).

---

## 1. Page-tab

**Banner Ads** is the seller's self-serve display-advertising surface — a **per-banner purchase model**:
the seller builds a creative, picks one or more on-portal **spots** + a **duration**, **pays for that one
banner**, and only then (after our team's review) does it go live. There is **no** account-level add-on
that unlocks everything once — *every* banner is bought individually.

- **Where it sits in the nav.** Group **`business`** — the **ASSETS** block labelled **"My business"**
  (`renderNav()` groups by `s.group`). Nav row registered as
  `{id:'banner-ads', label:'Banner Ads', icon:'ti-photo', group:'business'}`.
- **Label / icon / chip.** Label **"Banner Ads"**, icon `ti ti-photo` (amber accent in the header
  breadcrumb: `<i class="ti ti-photo" style="color:var(--amber)">`). No live count chip is wired for this
  id (`ib_getSidebarChip` has no `banner-ads` case → no static `s.chip`); the live-banner count is shown
  inside the section, not as a nav badge.
- **Default view?** No. The default seller section is **Overview**; Banner Ads is reached on demand.
- **How it's reached.** In the prototype the active section comes from `window.location.hash`
  (`renderDash` → `goSection('banner-ads')`). **In React, mirror as `?tab=banner-ads`** via
  `useSearchParams`. Deep sub-routes within the tab (kept as `#section/sub` form): the **sub-tab**
  (`bannerTab` = `banners` | `performance`) and the open **editor** (`bannerEditId` = a banner id, with
  `bannerStep` 1–3). Reasonable React deep links: `?tab=banner-ads&view=performance` and
  `?tab=banner-ads&banner=<id>`.
- **Who sees it (visibility gating).** `ib_sectionAllowed('banner-ads')` →
  `ib_hasModule(IB_SECTION_MODULE['banner-ads'])` = `ib_hasModule('bannerAds')`. The nav row only renders
  when the **`bannerAds`** module is held. House rule: a seller who could buy it must still see the path —
  so when the module is absent the section resolves to a **whole-section upsell card** (§2), never a silent
  hide.

## 2. Module

This tab belongs to the **Banner Ads** module — **`bannerAds`** in the seller's module map
(`{ autogrowth, business, shop, architect, bannerAds }`). It is an **add-on, not a selling surface**
(`IB_SELLING_MODULES = ['autogrowth','business','shop','architect']` deliberately excludes it), so it does
**not** confer Pipeline/Quotations/Reviews access.

**Module shape (verbatim from the prototype).** Unlike the selling modules, `bannerAds` is a **boolean
module** — `ib_setModule(modKey, planKey)` sets `m['bannerAds'] = true` (not a plan tier). The header
comment is explicit: *"bannerAds uses boolean true."*

**Gate read (the only entitlement check this tab makes):**

```
function ba_isPaidSeller(){
  // Banner Ads is now its own subscribable module.
  try { return ib_hasModule('bannerAds'); } catch(e){ return false; }
}
```

- `renderBannerAds()` → `if(!ba_isPaidSeller()) return ba_renderUpsell();`
- The plan **label** used in copy is read live, never hardcoded:
  `ba_planLabel()` → `IBEntitlements.of(window.dashState.user.sellerPlan).label`.

**How deep the feature goes / limits.** This tab has **no entitlement meter or numeric cap** — confirmed by
grepping `ib-entitlements.js`, which carries `promotion: 'featured-banner'` for the *shop* featured-banner
(a different feature) but **no `bannerAds` limit/meter/cap**. Banner Ads is gate-only at the entitlement
layer: held vs not-held. All *pricing* (per-spot monthly rates, duration discounts) lives in the page's
own **`BA_SPOTS` / `BA_DURATIONS`** tables, computed by `ba_price()` — those are prototype figures, not
entitlement limits. **Build rule:** the `bannerAds` held/not-held read goes through
`EntitlementService` (wrapping `ib-entitlements.js`); the spot/duration price tables are owned by
`BannerAdService` config, **never hardcoded inside a component**.

> Because there is no per-plan cap, the only gating UI on this tab is the **whole-section upsell card**
> (module not held) plus **inline validation toasts** in the build flow — there is no at-cap modal here.

## 3. Features

Verbatim sub-areas of the Banner Ads tab (prototype):

- **Upsell card** — shown when `bannerAds` is not held (`ba_renderUpsell`). Headline **"Banner Ads needs a
  paid plan"**.
- **Banner Ads header** — `dm-header`: breadcrumb + H1 **"Banner Ads"** + sub-line + **"New banner"** CTA.
- **Sub-tabs** — **"Banners"** and **"Performance"** (`ba_renderInner` → `ba_setTab`).
- **Banners list / table** (`ba_renderBanners`) — YouTube-Studio-style table; **empty state "No banners
  yet"** with **"Create your first banner"**.
- **Per-banner row** (`ba_renderBannerRow`) — thumbnail + meta, status pill, spots, date, views, clicks,
  primary action + kebab menu.
- **Banner editor / build & buy** (`ba_renderEditor`) — 3-step stepper: **"Details" · "Spots & duration" ·
  "Review & pay"**, with a **"Live preview"** pane.
- **Edit ad (paid banner)** — `ba_editLive` / `ba_resubmitForReview` re-review flow for live banners.
- **Performance tab** (`ba_renderPerformance`) — KPI tiles + per-banner bars.

## 4. Functionality

Reads/writes go through **`BannerAdService`** → **DataSource** (local-first; the prototype persists to
`localStorage['ib_banner_addon']` for banners and `localStorage['ib_banner_submissions']` for the admin
review queue, and flattens live banners to `localStorage['ib_sponsored_live']` — in React these become the
`bannerAds` spine groups behind the service, **never raw localStorage**). The gate read goes through
**`EntitlementService`** (`bannerAds`). Spot/duration price config: `BannerAdService` (`BA_SPOTS`,
`BA_DURATIONS`, `ba_price`).

### 4.1 Upsell card (module not held)

| Element | Verbatim copy |
|---|---|
| H1 (header) | **"Banner Ads"** |
| Header sub | "Get branded banners in front of buyers across the portal — available on any paid plan." |
| Upsell headline | **"Banner Ads needs a paid plan"** |
| Upsell body | "Pick up any paid plan first. Then you can build banners, choose the spots each one runs on — Home, Explore, Products, listings and more — and pay per banner. Every click lands in your exclusive enquiry inbox." |
| Feature 1 | **"Pick spots per banner"** — "Home, Explore, Products, listings & more" |
| Feature 2 | **"Reviewed before live"** — "Our team verifies every banner" |
| Feature 3 | **"Exclusive enquiries"** — "One click → one business, never broadcast" |
| CTA | **"See plans"** → `goSection('plans')` (React: `?tab=plans`) |

Behaviour: the **only** thing rendered when `ba_isPaidSeller()` is false. Read goes through
`EntitlementService.has('bannerAds')`. This satisfies the house rule — the paid capability is **signalled**
(whole-section upsell), never hidden.

### 4.2 Header + sub-tabs (module held)

- H1 **"Banner Ads"**; breadcrumb `ti ti-photo` (amber); sub-line:
  *"Build a banner, choose where it runs, and pay per banner. Every click routes to a qualified enquiry,
  exclusively yours."*
- Header action: **"New banner"** (`ba_newBanner`) — creates a `draft` banner and opens the editor at step 1.
- Sub-tabs: **"Banners"** (`ti ti-photo`) and **"Performance"** (`ti ti-chart-bar`); active tab held in
  `bannerTab`.

### 4.3 Banners list / table

- **Empty state** (`!s.banners.length`): icon `ti ti-photo-plus`, **"No banners yet"**, body *"Create a
  banner, choose where it runs, and pay to put it live. We'll review it before it runs."*, CTA
  **"Create your first banner"** (`ba_newBanner`).
- **Populated**: info bar *"Each banner is paid for separately and verified by our team before it goes
  live."* + table. Columns: **Banner · Status · Spots · Date · Views · Clicks** (+ action).
- **Row** (`ba_renderBannerRow`): creative thumbnail (or headline+CTA placeholder), title (`headline ||
  'Untitled banner'`), sub, `id · ₹amount`. Spot chips show first 2 + `+n`. `Views`/`Clicks` show real
  numbers only when `live`, else `—`; CTR shown as a sub-metric. Premium styling when `home` or `explore`
  is among the spots.
- **Primary action by status:** `draft` → **"Build & pay"** (or **"Edit"** if already paid) ·
  `rejected` → **"Fix"** (`ba_editAgain`) · `live` → **"Edit ad"** (`ba_editLive`).
- **Kebab menu** (`ba_rowMenu`): `draft` → *Build & pay / Edit*; `rejected` → *Fix & resubmit*; `live` →
  *View stats*; always *Delete* (`ba_deleteBanner` → toast **"Banner deleted"**).
- **Live-without-image warning** on the row: *"Add a banner image — it won't show publicly without one"*.

### 4.4 Banner editor — build, choose spots, pay (`ba_renderEditor`)

Three-step stepper (`ba_goStep` enforces forward validation); a **"Live preview"** pane mirrors the creative.

| Step | Label | Controls (verbatim) | Data written | Validation |
|---|---|---|---|---|
| 1 | **Details** | **Banner image** *(required)* uploader — *"Upload your banner creative"*, hint *"Recommended 864 × 264 px · ratio ≈ 3.3 : 1 · JPG / PNG / WebP · max 5 MB"*; **Internal name** *(only you see this)*; **Headline** *(required, max 48)*; **Sub-text** *(optional, max 64)*; **Button text** (default "Enquire now", max 20); **Destination link** *(required)*. | `image`, `title`, `headline`, `sub`, `cta`, `ctaUrl` via `ba_field`/`ba_setImage`. | Image > 5 MB → *"Image must be under 5 MB"*; non-image → *"Please choose an image file"*. To advance: headline → *"Add a headline to continue"*; ctaUrl → *"Add a destination link to continue"*. |
| 2 | **Spots & duration** | **"Where should it run?"** *pick one or more* — spot chips from `BA_SPOTS` each showing `₹{monthly}/mo`; **"For how long?"** duration radios from `BA_DURATIONS` showing live `₹net` + `save ₹{n}`. | `spots[]` via `ba_toggleBannerSpot`; `months` via `ba_setBannerMonths`. | "Next: review & pay" disabled until ≥1 spot; *"Choose at least one spot to continue"*. |
| 3 | **Review & pay** | Review card **"You're paying for this banner"** (Headline, Links to, per-spot lines, spots/mo subtotal, Duration, You save, **Total**); CTA **"Pay ₹{net} & submit for review"**. Note: *"Payment is required before review. Our team verifies every banner within one working day before it goes live."* | On pay: `amountINR=net`; writes pending checkout intent; navigates to checkout. | Re-validates headline / ctaUrl / ≥1 spot (toasts *"Add a headline first" / "Add a destination link first" / "Choose at least one spot"*). |

**Spot catalog (`BA_SPOTS`, prototype rates — read from config, never hardcode in component):**

| Spot | Where it runs | ₹/mo |
|---|---|---|
| Home | Homepage hero strip | 9,999 |
| Explore | Explore + category pages | 7,999 |
| Business listing | Businesses listing page | 6,999 |
| Products | Products listing & category pages | 5,999 |
| Services | Services listing pages | 5,999 |
| Catalogue | Catalogue browse pages | 4,999 |
| Architects listing | Architects listing page | 4,999 |
| Shops listing | Shops listing page | 4,499 |

**Durations (`BA_DURATIONS`):** 1 month (0%) · 3 months (15%) · 6 months (25%) · 1 year (35%). Price =
`Σ(spot monthly) × months × (1 − discount)` (`ba_price`).

**Pay handoff (`ba_payBanner`).** Writes a pending intent then routes to checkout —
`plans-checkout.html?addon=banner&banner=<id>&spots=<keys>&months=<n>`. On payment confirmed the lifecycle
is `submitted → in_review → live → expired` (`rejected → edit → resubmit` on failure). React: route to the
plan-checkout page with the same params; `BannerAdService.payBanner(id)` records the intent.

**Status meta (`ba_statusMeta`) — icon + text, not colour alone:**

| status | Label | Icon | Tooltip |
|---|---|---|---|
| draft | "Not paid" | `ti-pencil` | "Build it, choose spots, then pay to submit" |
| submitted | "Submitted" | `ti-send` | "Paid — queued for review" |
| in_review | "In review" | `ti-clock-search` | "Our team is verifying this banner" |
| live | "Live" | `ti-broadcast` | "Running on portal pages" |
| rejected | "Needs edits" | `ti-alert-triangle` | "Changes needed before it can run" |
| expired | "Expired" | `ti-circle-off` | "Run period ended" |

**Edit-a-live-ad (re-review, brand safety).** `ba_editLive` unlocks a paid banner's creative without
re-charging; an edit warning shows *"Editing a live ad pauses it — your changes go back to review and the
ad restarts once approved."* Saving via **"Update & resubmit for review"** (`ba_resubmitForReview`) sets
`in_review` and drops it from the public mirror until re-approved (toast *"Changes submitted for review —
your ad is paused until approved"*). Editing copy/creative on a `live` banner also auto-re-reviews
(`ba_maybeReReview` → toast *"Changes need review — the live ad is paused until approved"*). Locked
(paid/under-review) banners render read-only: *"Paid and locked while under review. You can edit if changes
are requested."*

### 4.5 Performance tab (`ba_renderPerformance`)

- **Empty** (no live banners): icon `ti-chart-bar`, **"No performance data yet"**, *"Once a banner is live,
  views, clicks and the qualified enquiries it drives appear here."*, CTA **"Go to banners"**.
- **KPI tiles:** **Impressions**, **Clicks**, **Click-through** (CTR), **Qualified enquiries** (accent tile,
  `ti-mail-check`).
- **Per-banner performance** list: bar per banner (share of impressions) + stats *views · clicks · CTR ·
  enquiries*.
- **Note:** *"Every click is captured as an exclusive enquiry and screened (contact, genuineness, urgency)
  before it reaches your inbox — never shared with another business."*

## 5. Working flow

**A. First banner (entry → core loop → exit).**
1. Seller (module held) opens **Banner Ads** (`?tab=banner-ads`) → empty **"No banners yet"**.
2. Taps **"Create your first banner"** → `ba_newBanner` creates a `draft` and opens the editor at
   **Step 1 · Details**.
3. Uploads the creative, writes headline / sub / button / destination link (live preview updates).
4. **Step 2 · Spots & duration** — picks spots (e.g. Home + Products) and a duration; the price updates live.
5. **Step 3 · Review & pay** — confirms the summary, taps **"Pay ₹{net} & submit for review"** → checkout.
6. On payment: status `submitted → in_review`. Our team reviews; on approval → **live** (flattened to the
   public sponsored band on Home/Explore/listings etc.); on failure → **"Needs edits"** → **"Fix"** →
   resubmit. Exit: banner runs until `expired`.

**B. Manage a running ad.** From the **Banners** list, **"Edit ad"** on a `live` row → edit creative →
**"Update & resubmit for review"** → ad pauses, re-reviews, restarts on approval.

**C. Measure.** Switch to **Performance** → see Impressions / Clicks / CTR / **Qualified enquiries** and
per-banner bars.

**Connection to other tabs + the shared spine.** Every banner **click becomes an exclusive, screened
enquiry** — it does **not** stop here: it lands in **Enquiries** (`connections`, the inbox), then flows the
shared seller spine **enquiry → Pipeline → Quotation** (Performance's "Qualified enquiries" tile is the
top of that funnel). Live banners write to the **public sponsored band** (`ib_sponsored_live`) that
buyer-facing portal pages render — a write here surfaces in the live marketplace. **Plans**
(`?tab=plans`/`goSection('plans')`) is the upsell destination when the module isn't held. The admin **Banner
review queue** (`ib_banner_submissions`) is the cross-dashboard counterpart: a submit here surfaces in the
admin review console live, and the admin's approve/reject flips the seller-side status.

## 6. Data · States · A11y · Copy

**Data — services + spine groups (all via DataSource; never raw localStorage/fetch):**

| Surface | Service | Spine group |
|---|---|---|
| Module held? (gate) + plan label | `EntitlementService` (wraps `ib-entitlements.js`: `has('bannerAds')`, `of(plan).label`) | entitlements |
| Banners CRUD + lifecycle + pricing | `BannerAdService` (`list/new/field/setImage/toggleSpot/setMonths/pay/submit/editLive/resubmit/delete`; `BA_SPOTS`/`BA_DURATIONS`/`ba_price` config) | `bannerAds` (prototype `ib_banner_addon`) |
| Admin review submissions | `BannerAdService.submitForReview` | banner submissions (`ib_banner_submissions`) — read by admin |
| Public sponsored band | `BannerAdService.flushSponsored` | `ib_sponsored_live` — read by public portal |

**States:**
- **Loading:** section skeleton (standard skeleton, not a bare spinner); nav renders immediately.
- **Empty:** Banners — **"No banners yet"** + **"Create your first banner"**; Performance — **"No
  performance data yet"** + **"Go to banners"**. No dead ends.
- **Locked / gated (seller):** module not held → **whole-section upsell card** ("Banner Ads needs a paid
  plan" + **"See plans"**) — never silently hidden. No numeric cap exists for this tab (no at-cap modal);
  build-flow guards surface as **inline validation toasts**.
- **Error:** failed section degrades to inline retry; rest of the console still renders.
- **Success:** submit → toast *"Banner submitted for review — usually approved within one working day"*;
  resubmit → *"Changes submitted for review — your ad is paused until approved"*; delete → *"Banner
  deleted"*.

**A11y:** landmarks `header`/`aside`/`main`; one **H1** per view (`.dm-title` "Banner Ads"); active nav
`.dn-item` is `aria-current`. Status pills pair **icon + text** (`ba_statusMeta`) — never colour alone;
the live-without-image warning is text + `ti-alert-triangle`. Editor fields use `<label class="ba-lbl">`
with required/optional markers in text; toasts announced `aria-live="polite"`; the kebab row-menu is
keyboard-operable and closes on outside click/Esc; stepper buttons are real `<button>`s and disabled-next
exposes its reason via the toast.

**Copy (verbatim):** header sub *"Build a banner, choose where it runs, and pay per banner. Every click
routes to a qualified enquiry, exclusively yours."*; **"New banner"**, **"Create your first banner"**,
**"Build & pay"**, **"Edit ad"**, **"Fix"**, **"Update & resubmit for review"**, **"Pay ₹{net} & submit for
review"**, **"See plans"**, **"Go to banners"**. Upsell: **"Banner Ads needs a paid plan"**. Empty: **"No
banners yet"** / **"No performance data yet"**. Submit note: *"Payment is required before review. Our team
verifies every banner within one working day before it goes live."* Performance note: *"Every click is
captured as an exclusive enquiry and screened (contact, genuineness, urgency) before it reaches your inbox
— never shared with another business."* (Brand voice: lowercase-b "Interior bazzar", British "enquiry",
CTAs Title Case, no ALL-CAPS, no "!".)

---

**Build notes (React):** `components/SellerDashboard/BannerAds/` (list table, 3-step editor with live
preview, performance tab, upsell card). Services: **`BannerAdService`** (banners CRUD + lifecycle +
`BA_SPOTS`/`BA_DURATIONS` price config + sponsored-band flush + admin-submission write) and
**`EntitlementService`** (the `bannerAds` held/not-held gate + plan label) — both via DataSource, never raw
localStorage. Drive sub-tab + open editor from `?tab=banner-ads&view=…&banner=…`.
