# TAB: Pipeline — Seller Dashboard

```
PARENT: README.md  ·  VIEW id: pipeline  ·  GROUP: main (WORK — "Inbox & pipeline")  ·  PROTOTYPE: pages/dashboard-seller.html
```

> Links: parent overview = [README.md](README.md) · pages index = [../README.md](../README.md) · modules-features-flow = [../../modules-features-flow.md](../../modules-features-flow.md) · style = [../../style.md](../../style.md) · copywriting = [../../copywriting.md](../../copywriting.md) · environment seam = [../../../Environment-Management-backend.md](../../../Environment-Management-backend.md) · integration = [../../../Integration.md](../../../Integration.md) · prototype = [../../../Prototype/ib_prototype_7.2.1/pages/dashboard-seller.html](../../../Prototype/ib_prototype_7.2.1/pages/dashboard-seller.html)

---

## 1. Page-tab

**What it is.** Pipeline is the seller's **kanban deal board** — every enquiry tracked through its sales **stage** (not its inbox status). It's the "Convert" surface of the seller console: the same enquiries that land in Enquiries are dragged here across six columns toward **won**/**lost**. Section header (verbatim):

- H1 `.dm-title`: **"Pipeline"**
- Sub `.dm-sub`: *"Track every enquiry through your sales stages. Drag cards to move between columns."*

**Where it sits in the nav.** Group `main` — the **WORK** block labelled **"Inbox & pipeline"** (`renderNav()` group label). Nav item registration (verbatim): `{id:'pipeline', label:'Pipeline', icon:'ti-layout-kanban', group:'main'}`.

- **Label:** "Pipeline" · **Icon:** `ti-layout-kanban`.
- **Chip/count:** `ib_getSidebarChip('pipeline')` → count of **active (non-terminal) deals** — every enquiry whose `dealStage` is not `won` and not `lost` (`stage !== 'won' && stage !== 'lost'`); renders `String(active)` or `null` (no chip) when zero.

**Default view?** No. Default section is Overview. Pipeline is reached on demand.

**How it's reached.**
- Mirror the prototype hash (`#pipeline`) as **`?tab=pipeline`** via `useSearchParams`; `goSection('pipeline')` switches + re-renders.
- Entry points into it: Overview header **"Open pipeline"** button (`openPipeline()`), Overview **Pipeline snapshot** rows and **"Open full pipeline"** link (all call `openPipeline()` → `goSection('pipeline')`), and the Insights "sales pipeline" link.
- No deep-link sub-route of its own; it routes **out** to Enquiries via `#connections/<id>` (clicking a card — see §5).

**Who sees it (visibility gating).** `ib_sectionAllowed('pipeline')` → `ib_anySellingModule()`: visible only when the seller holds **any selling module** (autogrowth / business / shop / architect / bannerAds). A logged-in buyer with no selling module (resolves to `FREE`) does **not** see Pipeline in nav.

---

## 2. Module

**Belongs to:** the WORK group, gated by **any selling module** (not one specific subscription). Pipeline is not its own purchasable module — it's an operating surface that any seller with a live selling subscription gets.

**Visibility gate (verbatim logic):**
- `ib_sectionAllowed('pipeline')` returns `ib_anySellingModule()`.
- `ib_anySellingModule()` → `IB_SELLING_MODULES.some(k => !!ib_sellerModules()[k])`.
- Pipeline is **not** in `IB_SECTION_MODULE` (that map gates autogrowth/business/shop/architecture/banner-ads to a single module). So no single `IB_SECTION_MODULE` key applies — the gate is the any-module check.

**Depth-by-plan (read, never hardcode).** The pipeline **capability tier** ladders by plan via `IBEntitlements.of(planKey).pipeline` (from `ib-entitlements.js`):

| `pipeline` value | Example plan (entitlement key) |
|---|---|
| `tracker` | Business **Verified** (`business-verified`) |
| `visual` | Business **Trusted Business** (`business-trusted`) |
| `multi-stage` | Business **Industry Leader** (`business-leader`) |

Read the tier through `EntitlementService` wrapping `IBEntitlements.of(plan)` — **never** hardcode a tier word or a stage count. (The prototype board itself always renders all six stages; the `pipeline` entitlement is the authoritative depth signal the React build reads to grade the experience — surface higher tiers via signalling, never silently widen/narrow.)

**Entitlement reads to wire:** `IBEntitlements.of(plan)` (→ `.pipeline`, `.family`, `.networkTier`). No `.limit`/`.atCap`/`.meters` caps apply to the board itself (the pipeline has no item cap of its own — it mirrors the enquiry spine). Any per-module caps surface in Enquiries / Business / Plans, not here.

---

## 3. Features

Discrete features / sub-areas in this tab (verbatim names from the prototype):

- **Pipeline** section header ("Pipeline" + drag instruction).
- **Toolbar** — **filters** (`renderPipelineFilters`, reuses Inbox source/form/label filter state) + **summary stats**.
- **Summary stats:** **"Total"**, **"Active"**, **"Won value"** (`₹{n}L`, shown only when > 0).
- **Kanban board** (`.pl-board`) — six **stage columns**: **New · Contacted · Quoted · Meeting · Won · Lost**.
- **Pipeline card** (`.pl-card`) — buyer name, days-in-stage badge, value, city, form chip, source mini-pill, last activity, **"View enquiry"** link.
- **Drag-and-drop stage move** (HTML5 DnD across columns) — and the equivalent inline writes from the Enquiries action bar: **"Mark as won"** / **"Mark as lost"** + the **Deal stage** selector.

---

## 4. Functionality

All reads/writes go through services → DataSource (never raw `localStorage`/`fetch`). The pipeline reads and writes the **same enquiry records** as Enquiries/Overview — `EnquiryService` over the `enquiries` spine group (`ib:sharedenquiry`). Moving a card mutates the enquiry's `dealStage` (+ `dealStageChangedAt`, and `status`/`dealStatus` for terminal stages); that write is what surfaces in the buyer's view and admin.

### 4.1 Section header
Static. H1 "Pipeline" + sub "*Track every enquiry through your sales stages. Drag cards to move between columns.*" No controls.

### 4.2 Toolbar — filters
`renderPipelineFilters(...)` renders source / form / label chips, **reusing the Inbox filter state** (`dashState.connSourceFilter`, `connFormFilter`, `connLabelFilter`) so the seller's filtering persists across Enquiries ↔ Pipeline. A reset chip clears all three dimensions.

| Filter | Reads | Behaviour |
|---|---|---|
| Source | `connSourceFilter` (`all` / `shop` / `architect` / `business`); counts via `ib_sourceCounts()` | Source filter only appears when more than one source is in play (`sc.available`). |
| Form | `connFormFilter` (`all` / form type); `formCounts` from all connections | Filters cards by `formType`. |
| Label | `connLabelFilter` | Filters by `c.labels`. |

Note: Pipeline deliberately does **not** apply the inbox *status* filter — *"Pipeline is about \*stage\*, not status, so showing all statuses makes sense."*

### 4.3 Summary stats
Computed over the filtered `conns`:

| Stat | Label | Value |
|---|---|---|
| Total | "Total" | `conns.length` |
| Active | "Active" | non-terminal count (`stage !== 'won' && stage !== 'lost'`) |
| Won value | "Won value" | `₹{Σ dealValue of won}L` via `parseDealVal` — rendered **only when > 0** (`.is-won`) |

### 4.4 Kanban board — stages
`renderPipelineBoard(conns)` groups via the **shared bucketer** `ib_groupByStage(conns)` (single source of truth used by both the board and the Overview snapshot, so counts never drift). Stage order = `IB_PIPELINE_STAGES = ['new','contacted','quoted','meeting','won','lost']`. Any missing/unknown stage (e.g. a freshly-routed `qualified`) folds into **`new`**.

Per column: ball icon, **stage label**, **count** (`items.length`), and a meta line `{desc}` + `· ₹{totVal}L` (column value, when > 0). Verbatim stage labels (`ib_getStageMeta`) + descriptions (`stageDescs`):

| id | Label | Icon | Description (meta) |
|---|---|---|---|
| new | "New" | `ti-mail-opened` | "Just landed" |
| contacted | "Contacted" | `ti-progress` | "Replied, waiting" |
| quoted | "Quoted" | `ti-receipt` | "Quote sent" |
| meeting | "Meeting" | `ti-calendar` | "Site visit / call" |
| won | "Won" | `ti-trophy` | "Deal closed" |
| lost | "Lost" | `ti-x` | "Not converted" |

Empty column placeholder: **"Drop here"** (`ti-drag-drop`).

### 4.5 Pipeline card
`renderPipelineCard(co)` — compact deal card:
- **Name** (`co.to`) + **days-in-stage badge** `{n}d` (from `dealStageChangedAt`, fallback `sentAt`; capped "99+"). Tiered colour AND text (not colour-only): tooltip `data-tip="In this stage for {n} day(s)"`; 0–3d ok, 4–7d warn (`-warn`), 8+d danger (`-danger`).
- **Value** `~{dealValueEst|dealValue}` · **City** (`ti-map-pin`).
- **Form chip** (`sh_getFormMeta`, `data-tip` = form desc) · **Source mini-pill** (`ib_getSourceMeta`, `data-tip="Via your {source} profile"`) · **Last activity** (`co.time`, `ti-clock`).
- **"View enquiry"** button (`ti-arrow-up-right`) and a card click → `ib_openEnquiryFromPipeline(co.id)` (see §5).

### 4.6 Stage move — drag-and-drop + inline writes
**Drag-and-drop:** cards are `draggable`; `ib_pipelineDragStart/Over/Leave/Drop` track `window._plDraggingId` and highlight the drop target (`.is-drop-target`). On drop (`ib_pipelineDrop`), a no-op drop on the same stage is ignored; otherwise it delegates to `ib_setStageInline(connId, stageId)` (falls back to `ib_setStage`) — keeping **stage and status in lockstep** (won → closed, lost → declined). In React, this write goes through `EnquiryService.update(id, { dealStage })` → DataSource.

**The write itself** (`changeDealStage` semantics — the canonical mutation):
- sets `dealStage` + `dealStageChangedAt` (days-in-stage tracking);
- `won` → `status='closed'`, `dealStatus='won'`, carries `dealValueEst`→`dealValue` if unset;
- `lost` → `status='declined'`, `dealStatus='lost'` (lands in the "Reject" bucket, not "Accept");
- success toast `"Moved {name} from {prev} → {next}"`, then re-render.

**Equivalent writes from the Enquiries action bar** (`renderSellerActionBar`, surfaced in the opened thread — same `dealStage` write, reflected here live):
- **Deal stage** `<select>` (label "Deal stage:") with options **New / Contacted / Quoted / Meeting scheduled** → `changeDealStage(id, value)`.
- **"Mark as lost"** (`ti-x`) → `sellerMarkLost` → confirm "*Mark deal with {name} as lost? This closes the conversation.*" → `dealStage='lost'`, status `declined`, toast "*Marked as lost*".
- **"Mark as won"** (`ti-trophy`) → `sellerMarkWon` → modal **"Mark as won — final deal value?"**:
  - body: "*Capturing the final deal value helps us track your ROI vs your subscription cost.*" (+ "*You estimated {est} when this came in.*" when present);
  - field label **"Final deal value"** (required), placeholder "*e.g. 3.5L  or  85k*", hint "*Format: ₹3.5L for 3.5 lakhs, ₹85k for 85 thousand. This stays private to you.*";
  - footer **"Cancel"** / **"Mark won"** → `confirmSellerWon`: empty value → warning "*Please enter the deal value*"; else `dealStage='won'`, `status='closed'`, `dealValue='₹{val}'`, success toast "*Deal won — {dealValue} from {name}*".

**Caps/gating UI here:** the board has **no item cap** (it mirrors the enquiry spine). Depth-by-plan (`pipeline: tracker→visual→multi-stage`) is read from `ib-entitlements.js` and used to grade/signal the experience — never to silently hide a column or control.

---

## 5. Working flow

**Core loop — work a deal to close:**
1. **Entry.** Seller opens Pipeline via `?tab=pipeline` (or Overview "Open pipeline" / snapshot row / "Open full pipeline"). Gate `ib_sectionAllowed('pipeline')` must pass (any selling module).
2. **Read the board.** Six columns; cards grouped by `dealStage` (`EnquiryService.list()` → `ib_groupByStage`). Days-in-stage badges flag stalled deals (4–7d warn, 8+d danger). Filter by source/form/label if needed (reuses Inbox filters).
3. **Advance a deal.** Drag a card to the next column (or use the Enquiries action-bar stage selector). Write goes `EnquiryService.update(id,{dealStage})` → DataSource; toast confirms "*Moved {name} from {prev} → {next}*".
4. **Open the enquiry to act.** Click a card / "View enquiry" → `ib_openEnquiryFromPipeline` sets `#connections/{id}` and jumps to **Enquiries** with that thread open (respond, message, send quotation).
5. **Convert.** From the thread (or after "Quoted"), create a quotation → **Quotations** tab (`new-quotation.html`); the spine advances `dealStage` to `quoted` when a quotation is sent.
6. **Close.** "Mark as won" (capture final deal value → `won`/`closed`) or "Mark as lost" (`lost`/`declined`). Won value rolls into the **Won value** summary stat and the **Overview** "Deals won this month" KPI / ROI band.
7. **Exit.** Active chip decrements; the deal leaves the working columns into Won/Lost.

**How it connects to other tabs + the shared spine:**
- **Enquiries → Pipeline → Quotations** is the spine: the enquiry record (`enquiries` / `ib:sharedenquiry`) is one object; its `dealStage` is owned here and in the Enquiries action bar — change it in either place and **both update live** (shared bucketer keeps Overview snapshot + board in sync).
- **Overview** "Pipeline snapshot" reads the *same* `ib_groupByStage` counts and deep-links here.
- A **won** write surfaces in the buyer/admin views (status `closed`) and feeds Overview ROI + Insights "Your sales pipeline".

---

## 6. Data · States · A11y · Copy

**Data.** Service: `EnquiryService.list()` / `.update(id,{dealStage,dealStageChangedAt,status,dealStatus,dealValue})` over spine group **`enquiries`** (`ib:sharedenquiry`, written by the Connect modal). Depth tier via `EntitlementService` → `IBEntitlements.of(plan).pipeline`. Filters reuse Enquiries state (`connSourceFilter`/`connFormFilter`/`connLabelFilter`). All via services → DataSource; never raw storage/fetch.

**States.**
- **Loading:** section skeleton (board column skeletons), not a bare spinner; nav renders immediately from `dashSections`.
- **Empty (per column):** "Drop here" (`ti-drag-drop`). Empty whole board → still shows columns; next action is to work enquiries (Enquiries tab) — no dead end.
- **Locked / gated (seller):** no selling module → Pipeline is **not** rendered in nav (`ib_anySellingModule()` false). Depth tier (`tracker`/`visual`/`multi-stage`) read live from `ib-entitlements.js` — a higher-tier capability must be signalled, never silently hidden. No per-item cap toast on this board.
- **Error:** failed section degrades to inline retry; rest of console still renders.
- **Success:** stage move toast "*Moved {name} from {prev} → {next}*"; won "*Deal won — {dealValue} from {name}*"; lost "*Marked as lost*".

**A11y.** Landmarks `header`/`aside`/`main` (`#dashMain`). One **H1** = "Pipeline". Active `.dn-item` is `aria-current`; nav items are real `<button>`s. Days-in-stage status is icon **+ text + tooltip**, not colour alone (ok/warn/danger tiers also carry `{n}d` text and `data-tip`). Kanban moves must be keyboard-operable (provide a non-drag stage control — the Enquiries action-bar `<select>` `<label for>`-linked "Deal stage:" is the keyboard path); modals (Mark as won) focus-trapped, `aria-live="polite"`, Esc/backdrop close.

**Copy (verbatim).** "Pipeline" · "*Track every enquiry through your sales stages. Drag cards to move between columns.*" · stages "New / Contacted / Quoted / Meeting / Won / Lost" + descs "Just landed / Replied, waiting / Quote sent / Site visit / call / Deal closed / Not converted" · "Drop here" · "View enquiry" · "Total" / "Active" / "Won value" · "Deal stage:" · "Mark as lost" / "Mark as won" · modal "Mark as won — final deal value?" / "Final deal value" / "*Format: ₹3.5L for 3.5 lakhs, ₹85k for 85 thousand. This stays private to you.*" / "Cancel" / "Mark won". CTAs Title Case, British "enquiry", lowercase-b "Interior bazzar".

---

**Build notes (React):** `components/SellerDashboard/Pipeline/` (board + `PipelineCard` + filters/toolbar; shares the stage-move modal with the Enquiries action bar). Services: **`EnquiryService`** (read/update `dealStage` over the `enquiries` spine → DataSource) and **`EntitlementService`** (wrapping `ib-entitlements.js` for the `pipeline` depth tier and the any-selling-module gate). No hardcoded plan numbers.
