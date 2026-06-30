# TAB: Insights — Seller Dashboard

```
PARENT: README.md  ·  VIEW id: insights  ·  GROUP: main (WORK — "Inbox & pipeline")  ·  PROTOTYPE: pages/dashboard-seller.html
```

> Cross-refs: parent overview = [README.md](README.md) · pages index = [../README.md](../README.md) ·
> [modules-features-flow.md](../../modules-features-flow.md) · [style.md](../../style.md) ·
> [copywriting.md](../../copywriting.md) · [environment seam](../../../../docs/environment-and-backend.md) ·
> [Integration.md](../../../../docs/integration.md) ·
> prototype `renderInsights()` ≈ lines 31247–31484 of [dashboard-seller.html](../../../Prototype/ib_prototype_7.2.1/pages/dashboard-seller.html).

---

## 1. Page-tab

**What it is.** A read-only **performance analytics** surface — "Insights" — that the seller's own
records roll up into: a KPI strip, an enquiry-conversion funnel, and (on richer plans) a content
leaderboard, an enquiries-by-city breakdown and a reviews snapshot. No new data is created here; it is a
mirror of what the rest of the console already holds. Header H1 is **"Insights"** with sub
`${businessName} · <depth chip> · computed from your records`.

**Where it sits in the nav.** Group **`main`** ("Inbox & pipeline" — the WORK group). Item defined in
`window.dashSections` as `{id:'insights', label:'Insights', icon:'ti-chart-histogram', group:'main'}`,
rendered last in that group (after Reviews). **No chip/count** — `ib_getSidebarChip('insights')` returns
`null` (it falls through to the default), so the nav item shows label + icon only.

**Default view?** No. The dashboard default is `overview` (`renderContent()` `default: renderOverview()`).
Insights is reached explicitly.

**How it's reached.** Prototype routes via `window.location.hash` → `goSection('insights')` sets
`#insights` → `renderContent()` `case 'insights': return renderInsights()`. **In React: `?tab=insights`**
via `useSearchParams` (mirror the hash router per the page brief). No nested sub-route — Insights has no
`#insights/<sub>` deep link. Two header buttons jump out, not in: **"Enquiries"** (`goSection('connections')`)
and **"Pipeline"** (`openPipeline()` → `goSection('pipeline')`). The KPI tiles also deep-link (see §4).

**Who sees it (visibility gating).** **Universal** — every authenticated seller, and a logged-in buyer
with no selling module (resolves to `FREE`). `ib_sectionAllowed('insights')` falls through to
`return true` (it is **not** in `IB_SECTION_MODULE`, and not one of `pipeline`/`quotations`/`reviews`).
The tab is **always in the nav** for an authed dashboard user; what changes by plan is the *depth* of
content, never the visibility.

## 2. Module

**Subscription/module.** None — Insights is an **always-on universal surface** (listed in
`ib_sectionAllowed`'s ALWAYS set: `overview, connections, insights, saved, activity, profile, plans,
membership, settings, security`). It belongs to no single module; it reads across all of them.

**Plan-gating = depth, not visibility.** The section renders for everyone; a **3-tier depth ladder**
(`basic` → `advanced` → `professional`) decides how much shows. Depth is resolved by `ins_depth()` reading
**`ib-entitlements.js`** — never hardcoded:

| Source read (`IBEntitlements.of(plan)`) | Resolves depth to |
|---|---|
| `ent.analytics` present (Business family carries explicit `'basic'`/`'advanced'`/`'professional'`) | that value |
| `ent.insights === true` (Architect Pro) | `professional` |
| `ent.family === 'autogrowth'` | `professional` (acquisition engine = full depth) |
| `ent.networkTier === 'full'` or `'exclusive'` | `professional` |
| `ent.networkTier === 'premium'` | `advanced` |
| else / `FREE` (`networkTier:'none'`) / any error | `basic` |

Entitlement reads used by this tab: **`IBEntitlements.of(planKey)`** (→ `.analytics`, `.insights`,
`.family`, `.networkTier`) via `ins_depth()`, `ins_planFamily()`. Gate helper **`ins_has(min)`** compares
ordinal depth (`{basic:0, advanced:1, professional:2}`) against a required minimum. There is **no
`atCap`/`limit`/`meters`/`ib_capGuard`** here — Insights writes nothing, so no usage caps. Section
visibility uses **`ib_sectionAllowed('insights')` → universal** (no `IB_SECTION_MODULE` entry). All depth
must flow through one `EntitlementService.of(plan)` in React; no component hardcodes a tier word.

Concrete depth by family (from `ib-entitlements.js`): Business `business-verified` → `analytics:'basic'`;
`business-trusted` → `'advanced'`; `business-leader` → `'professional'`. Architect `arch-*` →
`insights:false` until Pro (`insights:true` → `professional`). All Autogrowth `ag-*` →
`professional` (family rule). FREE → `basic`.

## 3. Features

Verbatim sub-areas of `renderInsights()`, in render order:

- **Depth chip** — `ins_depthLabel()`: "Basic analytics" / "Advanced analytics" / "Professional analytics".
- **KPI strip** (4 tiles, always): **Verified enquiries**, **Listing views**, **Response rate**, **Win rate**.
- **"Enquiry conversion"** funnel (always): 5 monotonic bars — *Enquiries received · Responded · Quoted · Meeting · Won*.
- **"Top content by views"** leaderboard (advanced+) — top 6 assets by `viewCount`.
- **"Enquiries by city"** (advanced+) — top 6 cities by enquiry count.
- **"Reviews"** snapshot (advanced+) — avg score, stars, published/awaiting counts, "Manage" link.
- **Advanced insights lock card** (basic only) — upsell shown in place of the three advanced blocks.

## 4. Functionality

Everything here is **read-only and derived**: `renderInsights()` computes from `window.connections`,
`window.products`, `window.services`, `window.catalogues`, `window.shops` (non-archived) and
`window.sellerReviews`. **No writes.** In React all reads go through services → DataSource (never raw
`localStorage`/`fetch`).

### Header + depth chip
H1 **"Insights"**; sub line `${businessName||name} · <chip> · computed from your records`. Chip =
`<span class="ins-depth"><i ti-chart-histogram></i> {Basic|Advanced|Professional} analytics</span>` from
`ins_depthLabel()` (reads `ins_depth()` → entitlements). Header actions: **"Enquiries"**
(`goSection('connections')`) and primary **"Pipeline"** (`openPipeline()`).

### KPI strip (always — `basic`+)
Four `.ov-kpi` tiles. Several are clickable deep-links.

| Tile label | Value (derived) | Foot copy | Click → |
|---|---|---|---|
| **Verified enquiries** | `total` = `connections.length` | `{newCount} awaiting reply` (newCount = `status==='pending'`) else **"All caught up"** | `goSection('connections')` |
| **Listing views** | `listingViews` = Σ `viewCount` over products+services+catalogues+shops, `toLocaleString('en-IN')` | "Across your profile & catalogue" | — |
| **Response rate** | `responseRate}%` = round(responded/total), responded = not `pending`/`expired` | `{responded} of {total} responded` | `goSection('connections')` |
| **Win rate** | `winRate}%` = round(won/(won+lost)); shows **"—"** when none decided | `{won} won · {fmtMoney(wonValue)} value` | `openPipeline()` |

`fmtMoney`: `≥100L → "₹{x} Cr"`, else `"₹{x}L"` (verbatim). `wonValue` sums `parseDealVal(c.dealValue)`
over won deals.

### "Enquiry conversion" funnel (always — `basic`+)
Section title `<i ti-filter></i> Enquiry conversion`. Five **monotonic** bars (each a subset of the
previous, so bars only shrink), `funnelMax = max(1, total)`, each row shows count + `{pct}%`:

| Step (verbatim) | n | icon |
|---|---|---|
| Enquiries received | `total` | ti-inbox |
| Responded | `responded` | ti-message-2 |
| Quoted | deals in `['quoted','meeting','won']` | ti-receipt |
| Meeting | deals in `['meeting','won']` | ti-calendar-event |
| Won | `won.length` | ti-trophy |

Empty (`total===0`): *"No enquiries yet. Your funnel will build here as verified enquiries arrive."*

### Advanced blocks — gated by `ins_has('advanced')`
Rendered **only** when depth ≥ advanced; otherwise the **lock card** (below) takes their place.

- **"Top content by views"** (`<i ti-trophy>`). Top 6 across products/services/catalogues sorted by
  `viewCount` desc; each row: name + uppercase type tag (Product/Service/Catalogue) + mint bar
  (`v/contentMax`) + `<i ti-eye> {v}` (en-IN). Empty: *"Add products, services or catalogues to see
  what's drawing views."*
- **"Enquiries by city"** (`<i ti-map-pin>`). Top 6 cities from `(c.enquiry.city)||c.city||'Unknown'`
  counted; bar = `count/cityMaxV`. Empty: *"City breakdown appears once you receive enquiries."*
- **"Reviews"** (`<i ti-star>`). `.ins-rev`: serif avg score (`avgRating` over published reviews with a
  derived `reviewScore`, else **"—"**) + star glyphs (`★`×n + `☆`×(5−n)); meta:
  *"**{pubReviews}** published review(s)[ · **{unreplied}** awaiting your reply | · all replied].
  Replying to reviews builds trust and lifts your placement."* Action **"Manage"** → `goSection('reviews')`.

### Advanced insights lock card (basic only — gating UI)
When `!ins_has('advanced')` the three advanced blocks are **replaced** by a single dark **upsell card**
(`.ins-lock`) — the paid capability is **signalled, never hidden**:

- Eyebrow: `<i ti-lock></i> Advanced insights`
- Headline: **"See what's working — content leaderboard, enquiry sources, reviews"**
- Sub: *"Your current plan shows the core numbers. Upgrade to unlock your top-performing listings, where
  your enquiries come from, and review performance — so you know exactly where to focus."*
- CTA button: **"Compare plans"** (`<i ti-arrow-up-right>`) → `goSection('plans')`.

This is the whole-section upsell pattern from the Gating UI standard. KPI strip + funnel still render
above it, so even a `basic`/FREE seller gets the core numbers.

## 5. Working flow

**A. Read your numbers (core loop).**
1. Seller opens `?tab=insights` (from nav, or a future Overview deep-link).
2. `EntitlementService.of(plan)` resolves depth; the **depth chip** announces the tier.
3. Seller scans the **KPI strip** — enquiries, listing views, response rate, win rate.
4. Reads the **Enquiry conversion** funnel to see where deals drop off.
5. *(advanced+)* reads **Top content**, **Enquiries by city**, **Reviews** snapshot.
6. Exit by acting: a KPI tile or header button deep-links into the relevant tab.

**B. Act on a finding (connects to other tabs).**
- Low response rate / "X awaiting reply" → **Verified enquiries** or **Response rate** tile →
  **Enquiries** (`connections`) to respond. (Same `EnquiryService` spine the funnel counted.)
- Win-rate / value question → **Win rate** tile or header **"Pipeline"** → the kanban
  (`pipeline`), where moving a deal to `won`/`quoted`/`meeting` **changes the funnel and KPIs here**
  on next render — Insights is a live mirror, not a snapshot.
- Reviews snapshot **"Manage"** → **Reviews** (`reviews`) to reply (which clears the "awaiting" line here).

**C. Hit the depth ceiling (gated, basic).**
1. Below the funnel a `basic` seller sees the **Advanced insights** lock card instead of the three deep
   blocks.
2. **"Compare plans"** → **Plans** (`plans`) → checkout (`plans-checkout.html`).
3. On a richer plan, `ins_depth()` returns `advanced`/`professional` and the deep blocks render in place
   of the card — no other change needed.

**Spine connection.** Insights reads the same shared groups the WORK tabs write: the enquiry →
pipeline → quotation → review chain. A write in another dashboard (e.g. a buyer's enquiry lands on the
`enquiries` spine) surfaces here as a higher "Enquiries received" / new city row on the seller's next view.

## 6. Data · States · A11y · Copy

**Data (services → spine; reads only, no writes).**

| Surface | Service (local-first) | Spine/source |
|---|---|---|
| KPI enquiries, response/win rate, funnel, enquiries-by-city | `EnquiryService.list()` | `enquiries` (`ib:sharedenquiry`) — written by Connect modal/pipeline |
| Listing views + content leaderboard | `ProductService` / `ServiceService` / `CatalogueService` (+ `ShopService` for shop views) | listing content (`viewCount`) |
| Reviews snapshot | `ReviewService.forSeller()` | seller reviews (published / `seller_reply`) |
| Depth / family / networkTier | `EntitlementService.of(plan)` wrapping **`ib-entitlements.js`** | authoritative — read, never hardcode |

**States.**
- **Loading:** standard section skeleton (KPI tiles + bar rows), not a bare spinner; nav renders
  immediately from `dashSections`.
- **Empty (per block, with next action):** funnel — *"No enquiries yet. Your funnel will build here as
  verified enquiries arrive."*; top content — *"Add products, services or catalogues to see what's drawing
  views."*; cities — *"City breakdown appears once you receive enquiries."*; win-rate KPI shows **"—"**.
- **Locked/gated (basic):** the **Advanced insights** upsell card replaces the three deep blocks (signalled,
  not hidden); CTA **"Compare plans"** → Plans. No cap toasts — Insights writes nothing.
- **Error:** failed section degrades to an inline retry; KPI/funnel that did load still show; rest of
  console unaffected.
- **Success:** N/A (read-only) — Insights has no mutating action of its own; success toasts belong to the
  tabs it links to.

**A11y.** Landmarks `header`/`aside`/`main`; the active nav `.dn-item` is `aria-current`. **One H1**
(`.dm-title` "Insights"). Status conveyed by **icon + text**, not colour: each funnel/list row pairs an
icon and a number; the depth chip carries the word ("Basic/Advanced/Professional analytics") not just a
colour; the lock card pairs `ti-lock` + "Advanced insights" text. KPI tiles that navigate are real
focusable buttons with discernible labels. Bars are decorative — the numeric value is the accessible
truth.

**Copy (verbatim).** KPI labels "Verified enquiries", "Listing views", "Response rate", "Win rate";
foots "All caught up", "Across your profile & catalogue", "{n} of {n} responded", "{n} won · {money}
value". Section titles "Enquiry conversion", "Top content by views", "Enquiries by city", "Reviews".
Depth chips "Basic analytics" / "Advanced analytics" / "Professional analytics". Funnel steps "Enquiries
received", "Responded", "Quoted", "Meeting", "Won". Lock card: eyebrow "Advanced insights"; headline "See
what's working — content leaderboard, enquiry sources, reviews"; sub "Your current plan shows the core
numbers. Upgrade to unlock your top-performing listings, where your enquiries come from, and review
performance — so you know exactly where to focus."; CTA **"Compare plans"**. Reviews meta "Replying to
reviews builds trust and lifts your placement." CTAs Title Case, no caps/"!"; British "enquiry"; brand
"Interior bazzar".

---

**Build notes (React):** `components/SellerDashboard/Insights/` (read-only `InsightsSection` rendering the
KPI strip, conversion funnel, and advanced leaderboard/city/reviews blocks behind one depth gate). Uses
`EnquiryService`, `ProductService`/`ServiceService`/`CatalogueService` (+`ShopService` for view sums),
`ReviewService.forSeller()`, and **`EntitlementService.of(plan)`** for the `ins_depth()`/`ins_has()` depth
ladder — every tier read from `ib-entitlements.js`, never hardcoded; no writes, no caps.
