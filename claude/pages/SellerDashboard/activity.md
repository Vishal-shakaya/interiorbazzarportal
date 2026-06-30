# TAB: Recent activity — Seller Dashboard

```
PARENT: README.md  ·  VIEW id: activity  ·  GROUP: personal  ·  PROTOTYPE: pages/dashboard-seller.html
```

> Parent overview: [README.md](README.md) · Pages index: [../README.md](../README.md) ·
> Modules/features/flow: [../../modules-features-flow.md](../../modules-features-flow.md) ·
> Style: [../../style.md](../../style.md) · Copywriting: [../../copywriting.md](../../copywriting.md) ·
> Environment seam: [../../../../docs/environment-and-backend.md](../../../../docs/environment-and-backend.md) ·
> Integration: [../../../../docs/integration.md](../../../../docs/integration.md) ·
> Prototype: [../../../Prototype/ib_prototype_7.2.1/pages/dashboard-seller.html](../../../Prototype/ib_prototype_7.2.1/pages/dashboard-seller.html)

---

## 1. Page-tab

**What it is.** A read-only **audit log** of the seller's recent activity — *"events that happened TO
their business in the last 30 days"* (`renderActivity` comment). It is the seller's passive timeline:
profile views, enquiries received/accepted/declined, deals won, quotations sent, meetings scheduled,
new ratings, and plan/platform updates. No actions are taken here — the seller just reads, and may
click a connection-linked event to jump into that enquiry.

**Where it sits in the nav.**
- **Group:** `personal` — rendered under the nav-group label **"Personal"** (`renderNav()` groups by
  `s.group`; the `personal` block holds **Saved** + **Recent activity**, separated from the main work
  surfaces *"so the main group stays focused on inbound work"*).
- **Section def (verbatim):** `{id:'activity', label:'Recent activity', icon:'ti-history', group:'personal'}`.
- **Label:** **Recent activity** · **Icon:** `ti-history` · **Chip/count:** **none** — `ib_getSidebarChip('activity')`
  falls through to the default `return null` (the comment lists *"Overview / Activity / Profile /
  Membership / Settings / Security: no count"*). The active-section topbar tag reads **"Recent activity"**
  (`sectionLabels.activity = 'Recent activity'`).
- **Default view?** No. The default section is **Overview** (`overview`); Activity is reached only by
  explicit navigation.

**How it's reached.** In the prototype the active section is driven by `window.location.hash`
(`#activity`) → `dashState.section`; `goSection('activity')` switches + re-renders. **In React, mirror
as `?tab=activity`** via `useSearchParams`. A connection-linked event row calls `openConn(connId)`
(deep-link into that enquiry), so keep the nested `#activity` / enquiry-id linkage available even though
Activity itself takes no sub-route.

**Who sees it (visibility gating).** **Universal** — every authenticated seller, on **any** plan
(including a buyer-with-no-selling-module resolving to `FREE`). `ib_sectionAllowed('activity')` is not
in `IB_SECTION_MODULE` and is not a selling-module surface, so it always renders. No upsell, no lock.

## 2. Module

**Universal / account-level — no subscription module, no plan-gating.** Recent activity belongs to the
`personal` nav group, not to any seller subscription (Autogrowth / Business / Shop / Architecture /
Banner Ads). It is **never** module-gated:

- **No `IB_SECTION_MODULE` entry** and **not** in `ib_anySellingModule()` — so `ib_sectionAllowed('activity')`
  is always `true`.
- **No entitlement reads** — there is no `IBEntitlements.of` / `.limit` / `.atCap` / `.meters` call for
  this tab, and a grep of [`ib-entitlements.js`](../../../Prototype/ib_prototype_7.2.1/assets/ib-entitlements.js)
  for `activity` / `audit` / `history` returns **no matches**. There is **no cap, no meter, no locked
  state** on this surface.
- **Depth does not grade by plan.** Every seller sees the same log shape. (The events *shown* simply
  reflect what the seller's account has done — e.g. a richer plan tends to surface a plan-activation
  event like *"Your Elite plan was activated"* — but the feature itself is the same for all.)

Because nothing here is a paid capability, the seller-house-rule *"a paid capability is never silently
hidden"* has nothing to signal on this tab — there is no disabled control, lock, "Soon" chip, or upsell.

## 3. Features

Verbatim sub-areas of `renderActivity()`:

- **Header** — `h1` **"Recent activity"** + sub-line *"{n} events in the last 30 days · profile views,
  enquiries, deals, and platform updates"*.
- **Time-bucketed event groups** — **Today · Yesterday · This week · Earlier**, each a `rv-section`
  with a label + per-group event count (*"{n} events"*) + divider line.
- **Activity event rows** (`renderActivityEvent`) — icon-tinted timeline entries with title, optional
  buyer name, optional source/sub-line, time, and optional deal value; connection-linked rows are
  clickable into the enquiry.
- **Empty state** — *"No activity yet"* card.

## 4. Functionality

Read-only throughout; the only write-shaped interaction is *navigating away* via a clicked event.

| Feature | What it does | Controls | Data (Service → spine) | Gating UI | Behaviour |
|---|---|---|---|---|---|
| **Header** | States scope + count. `h1` **"Recent activity"**; sub *"`${events.length}` event(s) in the last 30 days · profile views, enquiries, deals, and platform updates"* (singular/plural on `events.length===1`). | — (read) | `ActivityService.list()` (count of resolved events) | none | Static; recomputed each render. |
| **Time-bucket grouping** | Buckets every event by `now − sortAt`: `<24h` → **Today**, `<48h` → **Yesterday**, `<7d` → **This week**, else **Earlier**. Empty buckets are omitted. Order fixed: **Today · Yesterday · This week · Earlier**. | — | derived from `ActivityService.list()` | none | Each shown group renders `rv-section-label`, `rv-section-count` (*"{n} event(s)"*), `rv-section-line`. |
| **Activity event row** | One timeline entry. Title = the event text; appends `— {buyer}` when the event came from a connection; optional `ra-event-sub` source line; `ra-event-time` ("2 hours ago", "yesterday, 6:30pm", "3 days ago", "1 month ago"); optional `ra-event-value` deal value on the right. Icon + tint by `type`. | **Click** (only on connection-linked rows) → `openConn(connId)` | `ActivityService.list()`; connection-sourced events come from `EnquiryService` / `enquiries` (`ib:sharedenquiry`) timelines | none | `cursor:pointer` + `onclick="openConn(...)"` **only** when `e.connId` is set; platform events (profile view / rating / plan) are non-clickable. |
| **Empty state** | Shown when `events.length === 0`. Icon `ti-history-toggle`, title **"No activity yet"**, sub *"Profile views, enquiries received, deals closed, and platform events will show up here."* | — | — | none (no CTA — it's a passive log, nothing to create) | Dashed `empty-state` card. |

**Event types, icons + tints** (`renderActivityEvent` `config`, verbatim) — status is conveyed by
**icon + text, never colour alone**:

| Event `type` | Icon | Tint | Source / mapping |
|---|---|---|---|
| `deal-won` | `ti-trophy` | green | timeline `ti-trophy` |
| `enquiry-received` | `ti-mail-opened` | amber | timeline `ti-mail-opened` |
| `enquiry-accepted` | `ti-check` | green | timeline `ti-check` |
| `enquiry-declined` | `ti-x` | gray | timeline `ti-x` |
| `quote-sent` | `ti-receipt` | blue | timeline `ti-receipt` |
| `meeting-scheduled` | `ti-calendar` | purple | timeline `ti-calendar` |
| `profile-view` | `ti-eye` | blue | platform event |
| `rating` | `ti-star-filled` | amber | platform event |
| `plan` | `ti-rosette` | green | platform event |
| `other` | `ti-point` | gray | fallback |

**Data composition (verbatim sources).** `renderActivity()` builds `events` from two sources, then
sorts by `sortAt` descending:
1. **Connection timelines** — for each connection, each `timeline[]` entry maps `t.icon` → an event
   `type`, carrying `t.event` (title), `t.when`, `buyer: co.to`, `avatar: co.initials`, and
   `dealValue: co.dealValue || co.dealValueEst`. *(In React these are read via `EnquiryService`; the
   prototype's synthetic platform pushes below become `ActivityService` server events.)*
2. **Platform events** (prototype-synthetic, *"would come from server in production"*) — e.g.
   *"Your business profile was viewed"* (source *"A buyer searching for \"carrara tiles delhi\""* /
   *"A buyer from Gurugram"*), *"You received a new 5-star rating"* (source
   *"Aman Khurana — \"Excellent work, on time and as promised.\""*), *"Your Elite plan was activated"*
   (source *"Renews 12 Aug 2026 · ₹2,12,399"*).

All reads go through services → DataSource — **never** raw `localStorage`/`fetch`.

## 5. Working flow

**A. Read the log (core loop).**
1. Seller opens the nav **"Personal"** group → clicks **Recent activity** (`?tab=activity`).
2. `ActivityService.list()` resolves events (connection timelines via `EnquiryService` + platform
   events), sorted newest-first and bucketed into **Today / Yesterday / This week / Earlier**.
3. Seller scans the timeline: header shows *"{n} events in the last 30 days …"*; each group shows its
   count; each row shows icon-tint + title (+ buyer, source, time, deal value).
4. **Exit:** the seller leaves to another tab, or clicks a connection-linked event.

**B. Jump into an enquiry (connection-linked event → spine).**
1. Seller clicks an `enquiry-received` / `quote-sent` / `deal-won` row that carries a `connId`
   (`cursor:pointer`).
2. `openConn(connId)` opens that enquiry — i.e. it routes into the **Enquiries** (`connections`)
   workspace for that thread.
3. From there the seller can **Respond**, move the deal in **Pipeline**, or **Create quotation** — the
   normal **enquiry → pipeline → quotation** spine.

**C. Empty / new seller.**
1. A seller with no history sees the **"No activity yet"** card; nothing to create here (passive log).
2. As enquiries arrive, deals close, and the profile is viewed, rows appear — surfacing the same shared
   spine writes (an enquiry the buyer sent, a quotation the seller sent) that drive Overview/Enquiries.

**Cross-tab / shared-spine connections.** This tab is a **mirror**, not a source: it reflects writes
made on the spine elsewhere. An enquiry written by the buyer's **Connect** modal (`ib:sharedenquiry`)
surfaces here as `enquiry-received` and in **Enquiries**; a quotation **sent** from Quotations surfaces
as `quote-sent`; a deal moved to won in **Pipeline** surfaces as `deal-won`; a plan activated in
**Plans/Billing** surfaces as a `plan` event. Clicking through returns the seller to the live working
surfaces.

## 6. Data · States · A11y · Copy

**Data.** `ActivityService.list()` → spine **audit log** (per README §6 *"Saved / Activity →
`SavedService.list()` / `ActivityService.list()` → buyer-shape saved + audit log"*); connection-sourced
events read via `EnquiryService` / the `enquiries` (`ib:sharedenquiry`) spine. **Read-only — no writes
on this tab.** No entitlement reads (universal).

**States.**
- **Loading:** standard section skeleton (not a bare spinner); nav renders immediately from `dashSections`.
- **Empty:** *"No activity yet"* — sub *"Profile views, enquiries received, deals closed, and platform
  events will show up here."* No CTA (passive log; nothing to create — by design).
- **Locked / gated:** **none** — universal tab, no module gate, no cap, no meter, no upsell.
- **Error:** failed section degrades to inline retry; the rest of the console still renders.
- **Success:** N/A — no writes originate here (navigation only).

**A11y.**
- Landmarks unchanged: `header` (dash-topbar), `aside` (dash-nav), `main` (`#dashMain`). The
  **Recent activity** `.dn-item` is `aria-current` when active; nav items are real `<button>`s.
- **One H1** per section — `.dm-title` **"Recent activity"**; no skipped heading levels (group label →
  event rows).
- Status is conveyed by **icon + text + tint, never colour alone** (each event row pairs an icon and
  the title/source text; the tint is decorative).
- Connection-linked rows are keyboard-operable buttons (`openConn`), with a visible focus ring;
  non-linked platform rows are not interactive (no false affordance).
- `aria-live="polite"` for any inline retry/toast announcement.

**Copy (verbatim).**
- Title: **"Recent activity"**
- Sub: *"{n} event(s) in the last 30 days · profile views, enquiries, deals, and platform updates"*
- Group head count: *"{n} event(s)"*; group labels **"Today" · "Yesterday" · "This week" · "Earlier"**
- Empty title: **"No activity yet"**; empty sub: *"Profile views, enquiries received, deals closed, and
  platform events will show up here."*
- Sample event titles: *"Your business profile was viewed"*, *"You received a new 5-star rating"*,
  *"Your Elite plan was activated"*; buyer suffix rendered as *"— {buyer}"*.
- CTAs: **none** on this tab.

---

**Build notes (React):** `components/SellerDashboard/Activity/` (read-only audit timeline; bucketed
groups + event rows; clickable connection rows route into Enquiries via `openConn`-equivalent).
Service: **`ActivityService.list()`** (audit-log spine) with connection-sourced events via
**`EnquiryService`**; reads only, all through services → DataSource. No `EntitlementService` reads —
universal, ungated.
