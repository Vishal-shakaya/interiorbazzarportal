# TAB: Overview — Seller Dashboard

```
PARENT: README.md  ·  VIEW id: overview  ·  GROUP: main (WORK — "Inbox & pipeline")  ·  PROTOTYPE: pages/dashboard-seller.html
```

The seller's landing surface — the daily-triage cockpit. It opens with a time-of-day greeting, four
KPI tiles, a **Cost of inaction** money-at-risk band, a two-column *Needs your attention* + *Pipeline
snapshot* grid, and a *Plan ROI* banner. Every tile and row is a deep-link into another tab; it writes
nothing — it's a read-only dashboard whose only job is to push the seller toward the one action the
whole exclusive-routing model depends on: **Reply now**.

Cross-refs: parent overview [README.md](README.md) · pages index [../README.md](../README.md) ·
[modules-features-flow.md](../../modules-features-flow.md) · [style.md](../../style.md) ·
[copywriting.md](../../copywriting.md) ·
[environment seam](../../../Environment-Management-backend.md) ·
[Integration.md](../../../Integration.md) ·
prototype [pages/dashboard-seller.html](../../../Prototype/ib_prototype_7.2.1/pages/dashboard-seller.html).

---

## 1. Page-tab

**What it is.** The seller dashboard home — a glance-and-go console that summarises the seller's live
state (new enquiries, active conversations, deals won, plan ROI) and routes every signal to the tab that
acts on it. It owns no editor and persists no data of its own.

| Aspect | Value (verbatim from prototype) |
|--------|----------------------------------|
| Nav group | `main` → group label **"Inbox & pipeline"** (README §5 calls this group **WORK**) |
| Nav label | **Overview** (`{id:'overview', label:'Overview', icon:'ti-layout-dashboard', group:'main'}`) |
| Icon | `ti ti-layout-dashboard` |
| Chip / count | **None.** `ib_getSidebarChip('overview')` returns nothing and `dashSections` sets no static `s.chip`, so the nav item renders with no count chip. |
| Default view? | **Yes** — `window.dashState.section = 'overview'`. It is also the **gate fallback**: `renderContent()` resets any disallowed section to `overview` (`if(!ib_sectionAllowed(section)) section = 'overview'`). |
| Reached via | `?tab=overview` (React mirror of the prototype's `#overview` hash via `useSearchParams`); it is the no-tab default. No deep-link sub-route — opening an enquiry from here navigates *away* to `connections`/`pipeline`. |
| Who sees it | **Universal** — `ib_sectionAllowed('overview')` falls through to `return true`. Every authenticated seller sees it on every plan (incl. a buyer-with-no-module resolving to `FREE`). |

## 2. Module

**Module / gate: universal.** Overview is one of the "ALWAYS (every seller)" surfaces named in the
prototype's access-feature comment (`overview, connections, insights, saved, activity, profile, plans,
membership, settings, security`). It is **not** in `IB_SECTION_MODULE` and is **not** in the
any-selling-module set, so `ib_sectionAllowed('overview')` returns `true` for all plans. There is **no
upsell card, no lock, no cap** on the tab itself.

**Plan-awareness (depth, not visibility).** The tab is always visible but two of its values are
plan-derived and must read through the entitlement service, not be hardcoded:

- **Plan cost / subscription figure** — prototype hardcodes a ladder
  (`u.sellerPlan === 'Enterprise' ? 499999 : 'Elite' ? 212399 : 79999`). **In React this MUST come from
  the resolved plan price via the entitlement/plan source** (`EntitlementService`/`IBPlans` →
  `ib-entitlements.js`), never a literal — the parent README mandates "ROI/plan cost derive from the
  resolved plan."
- **Return on plan (ROI)** — `roi = (wonValue × 100000 / planCost).toFixed(1)`; depends entirely on the
  plan-cost read above, so it inherits the same rule.

Entitlement reads relevant here: `IBEntitlements.of(plan)` (→ `family`, used by `ib_primaryModule`
fallback that drives the plan badge) and the plan price from the same authoritative source. No
`.limit` / `.atCap` / `.meters` are consulted on this tab — there is nothing to cap. The plan word
itself surfaces in the header sub-line (`${u.sellerPlan} plan`) and renew date (`u.planRenewsOn`).

## 3. Features

Verbatim sub-areas rendered by `renderOverview()`, in DOM order:

- **Header** — greeting + plan sub-line + two header actions (`View inbox`, `Open pipeline`).
- **KPI strip** (`.ov-kpi-row`) — four tiles: **New enquiries**, **Active conversations**, **Deals won
  this month**, **Return on plan**.
- **Cost of inaction** band (`.ov-coi`) — money-at-risk banner with **Reply now** CTA (conditional).
- **Needs your attention** panel (`.ov-panel`) — the pending-enquiry list (left column).
- **Pipeline snapshot** panel (`.ov-panel`) — the by-stage deal counts (right column).
- **Plan ROI this period** banner (`.ov-roi-banner`) — ROI headline + **View billing** CTA (conditional).

## 4. Functionality

All data is **read-only** on this tab. Counts derive from the shared enquiry/deal spine via
`EnquiryService.list()` (prototype `window.connections`, spine `enquiries` / `ib:sharedenquiry`, written
by the Connect modal in the *other* dashboard) and the shared stage bucketer `ib_groupByStage()` (the
same one the Pipeline kanban uses, so the snapshot can never under-count the board). Every tile/row is a
navigation control — nothing writes.

### Header
- **Greeting** — `${greeting}, ${firstName}` where greeting is time-of-day (`Good morning` < 12h,
  `Good afternoon` < 17h, else `Good evening`); `firstName` = first token of `u.name`.
- **Sub-line** — `${u.businessName} · ${u.sellerPlan} plan · Renews ${u.planRenewsOn}` (plan word in
  green). *React: `sellerPlan` label + price from the resolved plan, not literals.*
- **Actions** — `View inbox` (`goSection('connections')`) and primary `Open pipeline`
  (`openPipeline()`).

### KPI strip (four tiles — each a deep-link)
| Tile label (verbatim) | Number | Foot text (verbatim) | On click |
|------------------------|--------|----------------------|----------|
| **New enquiries** (urgent style) | `pending` count (`status==='pending'`) | `Needs your reply` (>0) / `All caught up` (0) | `goSection('connections')` |
| **Active conversations** | `status==='active' \|\| 'accepted'` count | `In progress` | `goSection('connections')` |
| **Deals won this month** | `stageCounts.won` | `₹{wonValue}L total` | `openPipeline()` |
| **Return on plan** | `{roi}×` or `—` | `vs ₹{planCost/1000}k subscription` | `goSection('membership')` |

> Note: the parent README quotes a near-identical alternate KPI variant ("Active conversations",
> "Deals won this month" `₹{}L total`, "Return on plan" `{roi}×` vs `₹{}k subscription`). The strings
> above are the verbatim live `renderOverview()` strip; build to these.

### Cost of inaction band — conditional
Renders **only when** `pending.length > 0 && atRiskLakh > 0`. `atRiskLakh` = sum of
`parseDealVal(c.dealValueEst || c.dealValue)` across pending enquiries (lakhs). `expiringSoon` =
pending whose `computeSLA(sentAt).tier` is `urgent`/`warning` (72h SLA clock).

- Amount: **`{fmtMoney(atRiskLakh)} on the table`** (`fmtMoney` → `₹{n}L`, or `₹{n} Cr` at ≥100L).
- Sub-copy (verbatim): *"`{n}` qualified `enquiry is`/`enquiries are` waiting on your reply`{ · N expiring
  soon}`. **Every exclusive enquiry you don't answer expires — and goes nowhere else.**"* (the
  "expiring soon" clause renders only when `expiringSoon.length > 0`).
- CTA: **`Reply now`** (`ti ti-arrow-right`) → `goSection('connections')` (the whole band is also
  clickable to the same place; CTA `stopPropagation`s).

### Needs your attention (left panel)
- Title **`Needs your attention`** (`ti ti-flame`); sub: *"`{n}` pending · respond fast to keep your
  response rate"*.
- **Empty state** (`pending.length === 0`): icon `ti ti-mood-happy`, title **`Inbox zero`**, sub *"No
  pending enquiries right now. Great work staying on top of replies."*
- **List**: first 5 pending (oldest-first = most urgent), each row `openConn('${co.id}')` → opens that
  enquiry in the Enquiries workspace. Row shows avatar/initials, `co.to` name, optional `{dealValueEst}
  est.` chip, `co.subject`, an SLA pill `ov-sla-{tier}` (`ti ti-clock` + `computeSLA().label`, e.g.
  `68h 24m left` / `Overdue`), city (`ti ti-map-pin`).
- **Overflow**: if > 5 pending, **`See all {n} pending`** → `goSection('connections')`.

### Pipeline snapshot (right panel)
- Title **`Pipeline snapshot`** (`ti ti-layout-kanban`); sub *"Where your deals stand right now"*.
- Six stage rows from `ib_groupByStage()`, each `openPipeline()`: **New**, **Contacted**, **Quoted**,
  **Meeting scheduled**, **Won**, **Lost / Expired** — coloured dot + label + count.
- Footer **`Open full pipeline`** → `openPipeline()`.

### Plan ROI banner — conditional
Renders **only when** `roi` is truthy (i.e. `wonValue > 0`).
- Eyebrow **`Plan ROI this period`** (`ti ti-chart-arrows`).
- Headline (verbatim): *"You closed **₹{wonValue}L** in deals on a **₹{planCost/1000}k** plan."*
- Sub: *"That's **{roi}× return** on your subscription. Plan renews `{planRenewsOn}`."*
- CTA **`View billing`** → `goSection('membership')`.

*Caps/gating UI:* none on this tab. The only plan-sensitive numbers (plan cost, ROI) must be read from
the entitlement/plan source — never hardcode the `499999/212399/79999` ladder.

## 5. Working flow

**Primary loop — triage to reply (the seller's core job):**
1. Seller signs in → lands on **Overview** (`?tab=overview`, the default section).
2. Scans the KPI strip; the **New enquiries** tile (urgent style) shows the count + `Needs your reply`.
3. If money is unanswered, the **Cost of inaction** band shows `{₹} on the table` + `N expiring soon`.
4. Seller clicks **Reply now** (or the urgent KPI tile, or a row in **Needs your attention**) →
   `goSection('connections')` / `openConn(id)` → opens the **Enquiries** tab thread.
5. Seller responds there. The reply flips that enquiry's `status` off `pending`; on return to Overview the
   **New enquiries** count and **Cost of inaction** amount drop — closing the loop.

**Secondary loop — pipeline review:**
1. From **Pipeline snapshot** (or **Open pipeline** / **Deals won** tile) → `openPipeline()` opens the
   **Pipeline** kanban.
2. Seller advances a deal (e.g. → Quoted → "Create quotation"), which feeds the **Quotations** tab.
3. Marking a deal **Won** raises `stageCounts.won` and `wonValue`, which lifts the **Deals won this
   month** tile and the **Return on plan** / **Plan ROI** banner on next Overview render.

**Spine connections (live, cross-dashboard).** The enquiry counts read the **shared `enquiries` spine**
(`ib:sharedenquiry`) that the *buyer/Connect* side writes — so a buyer sending an enquiry surfaces here
as a new `pending` row without any extra wiring (enquiry → pipeline → quotation is one chain). Overview is
the read mirror; the writes happen in Enquiries, Pipeline, Quotations and Billing, all reached by the
deep-links above.

## 6. Data · States · A11y · Copy

**Data (services → DataSource; never raw localStorage/fetch).**
- `EnquiryService.list()` → spine `enquiries` (`ib:sharedenquiry`): drives all KPI counts, pending list,
  at-risk total, and (via `ib_groupByStage`) the pipeline snapshot stage counts.
- `EntitlementService` / plan source wrapping **`ib-entitlements.js`** (`IBEntitlements.of` /
  `IBPlans`): resolved plan label, price (plan cost) and family/badge — feeds ROI + sub-line. **Read,
  never hardcode.**
- Helpers: `ib_groupByStage`, `computeSLA` (72h SLA), `parseDealVal`, `fmtMoney`.

**States.**
- *Loading:* section skeleton (standard skeleton, not a bare spinner); nav renders immediately from
  `dashSections`.
- *Empty:* per-zone, always with a next action — **Needs your attention** empty = **`Inbox zero`** /
  *"No pending enquiries right now. Great work staying on top of replies."*; **Cost of inaction** and
  **Plan ROI** banners simply don't render when their condition is false (no dead UI).
- *Locked/gated:* **none** — universal tab; no cap, no upsell, no lock. (Plan-cost/ROI degrade to `—`
  when `wonValue` is 0, not a lock.)
- *Error:* a failed section degrades to an inline retry; the rest of the console still renders.
- *Success:* no writes on this tab; success toasts belong to the destination tabs (reply sent, deal won).

**A11y.**
- Landmarks: `header` (dash-topbar), `aside` (dash-nav), `main` (`#dashMain`); the active `.dn-item`
  **Overview** is `aria-current`; nav items are real `<button>`s.
- One **H1** = `.dm-title` greeting ("Good morning, {name}"); no skipped heading levels.
- KPI tiles / pending rows / pipeline rows are keyboard-operable controls (not bare clickable divs) and
  expose their destination; SLA urgency is conveyed by **icon + text** (`ti ti-clock` + "68h left" /
  "Overdue"), not colour alone.
- Toasts/modals (raised by destination tabs) announced `aria-live="polite"`, focus-trapped, Esc/backdrop
  close. Full checklist: [modules-features-flow.md](../../modules-features-flow.md) §5.

**Copy (verbatim).** Tiles: "New enquiries" / "Needs your reply" / "All caught up" · "Active
conversations" / "In progress" · "Deals won this month" / "₹{}L total" · "Return on plan" / "vs ₹{}k
subscription". Header CTAs: "View inbox", "Open pipeline". Cost of inaction: "{₹} on the table" +
*"Every exclusive enquiry you don't answer expires — and goes nowhere else."* + CTA **"Reply now"**.
Panels: "Needs your attention", "respond fast to keep your response rate", "Inbox zero", "No pending
enquiries right now. Great work staying on top of replies.", "See all {n} pending", "Pipeline snapshot",
"Where your deals stand right now", "Open full pipeline". ROI: "Plan ROI this period", *"You closed
₹{}L in deals on a ₹{}k plan."*, *"That's {roi}× return on your subscription. Plan renews {date}."*, CTA
**"View billing"**. Brand voice: lowercase-b "Interior bazzar", British "enquiry", CTAs Title Case
(no caps/"!").

---

**Build notes (React):** `components/SellerDashboard/Overview/` (rendered by
`src/pages/DashboardSeller/index.tsx` when `?tab=overview` or no tab). Read-only; uses
`EnquiryService.list()` (enquiry/deal counts, pending list, stage snapshot via a shared `groupByStage`
helper) and `EntitlementService` (resolved plan label + price for the plan-cost/ROI figures — never the
hardcoded `499999/212399/79999` ladder). All deep-links call the page's `goSection`/`openPipeline`/
`openConn` equivalents.
