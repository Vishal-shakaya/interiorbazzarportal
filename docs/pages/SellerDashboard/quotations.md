# TAB: Quotations — Seller Dashboard

```
PARENT: README.md  ·  VIEW id: quotations  ·  GROUP: main (WORK — "Inbox & pipeline")  ·  PROTOTYPE: pages/dashboard-seller.html
```

> Cross-refs: parent overview = [README.md](README.md) · pages index = [../README.md](../README.md) ·
> [../../modules-features-flow.md](../../modules-features-flow.md) · [../../style.md](../../style.md) ·
> [../../copywriting.md](../../copywriting.md) · [../../../../docs/environment-and-backend.md](../../../../docs/environment-and-backend.md) ·
> [../../../../docs/integration.md](../../../../docs/integration.md) · prototype = [../../../Prototype/ib_prototype_7.2.1/...](../../../Prototype/ib_prototype_7.2.1/pages/dashboard-seller.html)

---

## 1. Page-tab

**Quotations** is the seller's quotation **tracking + history console** — *"Active tracking + history in one place"*. It is where the seller (per the prototype header comment) comes to: *"See what's awaiting buyer response … Audit past quotations (search by number / buyer, filter by date) … Re-download PDFs without hunting through individual chats … Jump back to the underlying enquiry from any quotation row."* It is the read/manage surface for the quotation artefacts that the **builder modal** (prefix `qb-`, a separate flow) produces; this section is prefix `qs-` (Quotations Section).

- **Where it sits:** nav group `main` (**"Inbox & pipeline"**, the WORK group), rendered from `window.dashSections` entry `{id:'quotations', label:'Quotations', icon:'ti-file-invoice', group:'main'}`. It sits 5th in the WORK group, after Pipeline, before Reviews.
- **Label / icon:** "Quotations" · `ti-file-invoice`.
- **Chip / count:** live chip via `ib_getSidebarChip('quotations')` = count of **open** quotations (derived status `sent` or `viewed`, expired excluded), `null` (no chip) when zero. *"Open quotations — sent or viewed, not yet expired or terminal … the ones the seller is waiting to hear back on."*
- **Default view?** No. Overview (`overview`) is the default section.
- **Reached via:** the prototype drives the active section from `window.location.hash`; **in React mirror as `?tab=quotations`** (per the page brief). Deep-link sub-routes are not used by this tab itself — but its row/kebab action **"Open enquiry"** hands off to `connections` with `dashState.subRoute = connId` (the enquiry deep link lives on the Enquiries tab).
- **Who sees it:** gated by `ib_sectionAllowed('quotations')` → `ib_anySellingModule()`. Needs **any selling module** active. A logged-in buyer with no selling module (resolves to `FREE`) does **not** see this item — it is hidden from nav by the any-module gate (consistent with Pipeline and Reviews).

## 2. Module

Belongs to **no single module** — it is an **any-selling-module** surface. Visibility gate (verbatim from the prototype access table):

```js
// ib_sectionAllowed(id):
if (id === 'pipeline' || id === 'quotations' || id === 'reviews') return ib_anySellingModule();
```

So the tab appears whenever the seller holds **any** selling subscription (Business / Shop / Architecture / Autogrowth). It is **not** in `IB_SECTION_MODULE` (which maps single-module sections like `business`→`business`), and it is **not** universal.

**Entitlement reads (depth, not visibility):** the *proposal style* grades by plan via `IBEntitlements.of(planKey).proposals` — read live, never hardcoded:

| Plan (family · tier) | `proposals` value |
|---|---|
| `business-verified` (Verified) | `smart` |
| `business-trusted` (Trusted Business) | `professional` |
| `business-leader` (Industry Leader) | `branded` |
| `arch-*` Verified / Plus | `smart` |
| `arch-*` Pro | `advanced` |

The Quotations **section** in the 7.2.1 prototype does not itself read `proposals` at render time (no cap, no meter on quotation count — quotations are unlimited), so there is **no cap toast or lock inside this tab**. The plan grading affects the **builder's** output styling, surfaced on the Plans tab. Per house rules, if a future branded-proposal capability is gated, it must be **signalled** (disabled control + lock + tooltip, or "Soon" chip) and read from `ib-entitlements.js` — never silently hidden, never a hardcoded plan number.

## 3. Features

Verbatim sub-areas of `renderQuotationsSection()`:

- **Section header** — H1 "Quotations" + subtitle (`dm-sub`).
- **New Quotation picker** — hero button "New Quotation" → dropdown ("Start fresh" / "From an active enquiry").
- **Analytics strip** (collapsible) — "Hide / Show analytics": KPI cards, "Conversion funnel", "Last 8 weeks" trend, "Top buyers by value", "Needs attention".
- **Toolbar** — status **filter pills**, free-text **search**, **date range** dropdown, **sort** dropdown, results hint, "Clear N filters".
- **Quotations table** — sortable columns (#, Buyer, Value, Status, Sent, Valid until, kebab) with derived-status pills + revision/edit lineage badges.
- **Row status dropdown** — change status (Sent / Viewed / Accepted / Declined).
- **Row kebab menu** — View quotation, Edit quotation / Create revision, Download PDF, Open enquiry, Copy quotation number.
- **Empty state** ("No quotations yet") and **no-matches state** ("No quotations …").

## 4. Functionality

All reads/writes go through services → DataSource (local-first), **never** raw `localStorage`/`fetch`. The quotation spine is the `QuotationService` over the `quotations` group; the linked-enquiry writes go through `EnquiryService` over the `enquiries` spine.

### Section header
H1 `dm-title` "Quotations". Subtitle (`dm-sub`):
- zero: *"No quotations yet — send one from any active enquiry."*
- otherwise: *"`{n}` total · `{openCount}` awaiting buyer response"* where `openCount` counts derived `sent`/`viewed`.

### New Quotation picker (`qs_renderCreateMenu`)
Hero button **"New Quotation"** (`ti-plus` + `ti-chevron-down` caret) opens a dropdown (render-once, toggle `.open` class — no full re-render, no scroll jump):

| Group | Item | Behaviour |
|---|---|---|
| **"Start fresh"** | **"Free-form quotation"** (`ti-square-plus`), meta *"For a buyer not yet in your inbox — fill in their details manually."* | `qs_createBlank()` → opens the builder blank (free-form, `enquiryId: null`). |
| **"From an active enquiry"** | one row per **eligible** enquiry (buyer name + `{id}` · `{dealValueEst} est.` · city) | `qs_createFromEnquiry(connId)` → stashes buyer prefill and opens the builder for that connection. |

Eligible enquiries = `status` `active` or `accepted` **and** `!hasQuotation`. Empty: *"No eligible enquiries — all active enquiries already have a quotation."* First 6 shown; overflow behind **"Show `{n}` more"** (`qs_toggleCreateMenuShowAll`).

### Analytics strip (`qs_computeAnalytics` + `qs_renderAnalytics`)
Toggle button **"Hide analytics" / "Show analytics"** (`qs_toggleAnalytics`, default shown; persists in UI state). Computed against the **full** (unfiltered) set — *"analytics should reflect the whole business, not just what's currently filtered to."* Statuses are **derived** so expired-by-`validUntil` is consistent with the table + chip.

- **KPI cards (4):** **"Total sent"** (all-time count + delta "↑ N vs prev 30d" / "no change" / "—"); **"Acceptance rate"** (`accepted / (accepted+declined)`, "—" if none decided; sub "`{accepted}` of `{decided}` decided"); **"Total value"** (sum grandTotal, short ₹L/₹Cr; sub "`{openValue}` still open"); **"Avg accepted deal"** (avg grandTotal of accepted; MoM money delta).
- **"Conversion funnel"** — Sent → Viewed → Accepted bars with count + %. Insight line varies: *"Many buyers haven't viewed — consider following up after sending."* / *"Low acceptance rate — try shorter, more specific quotes."* / *"Strong conversion — keep doing what you're doing."* / *"Healthy funnel — room to improve view-to-accept."*
- **"Last 8 weeks"** — sparkline of quotes-sent per week; `data-tip="{n} sent"`; footer "This week: `{n}`".
- **"Top buyers by value"** (sub *"lifetime across all quotations"*) — top 5 by lifetime value; `REPEAT` tag when ≥2 quotes; row click → `qb_viewQuotation(latestQ.id)`. Empty: *"No buyer history yet"*.
- **"Needs attention"** — actionable items (cap 6), each ranked by urgency bucket: **EXPIRING** (`ti-clock-exclamation`, sent/viewed, validUntil ≤7d — reason "expires today/tomorrow/in N days"), **STALE** (`ti-hourglass`, sent ≥10d never viewed — "no response · N days"), **BIG OPEN** (`ti-flame`, sent/viewed ≥₹1L), **REVIVABLE** (`ti-heart-broken`, declined ≥₹50K within 30d). Sub: *"`{n}` deals need follow-up"* / *"your pipeline is clean"*. Empty: *"Everything is on track. No expiring, stale, or recently-lost deals."* Overflow: *"+N more — see table below"*. Row click → `qb_viewQuotation(id)`.

### Toolbar (`qs-toolbar-v2`)
- **Status filter pills** (`qs_renderFilterPills`) — `all` | `sent` | `viewed` | `accepted` | `declined` | `expired` (`qs_setStatusFilter`).
- **Search** (`qs_setSearch`) — placeholder *"Search number, buyer, or city…"*; matches number + buyer name + city; clear `×` `data-tip="Clear search"`.
- **Date range** (`qs_setDateRange`) — *"All time"* / *"Last 7 days"* / *"Last 30 days"* / *"Last 90 days"* (by sent date; `data-tip="Filter by sent date"`).
- **Sort** (`qs_setSortPreset`, `data-tip="Sort order"`) — *"By urgency" · "Newest first" · "Oldest first" · "Highest value" · "Lowest value" · "Buyer A→Z" · "Quotation # (newest)"*. **Smart default** (`qs_resolveSort`): if any urgent item → urgency-asc, else sentAt-desc; the active auto-chosen option shows " (auto)" until the seller picks one (then it sticks).
- **Hint** — *"`{n}` quotations"*, or when filtered *"Showing **`{x}`** of `{n}`"*; **"Clear `{N}` filter(s)"** (`qs_clearFilters`) appears when any filter is active.

### Quotations table (`qs_renderTable` / `qs_renderTableRow`)
Sortable headers (`qs_setSort` toggles direction; arrow on active): **# · Buyer · Value · Status · Sent · Valid until · ⋯**. Per row (`onclick` → `qb_viewQuotation(q.id)`):

| Column | Content |
|---|---|
| **#** | `q.number` + enquiry ref (`q.enquiryId` or *"free-form"*) + lineage badges: *"edited `{rel}`"*, *"superseded by `{number}`"*, *"revision of `{number}`"*. |
| **Buyer** | `q.to.name` (+ city). |
| **Value** | `grandTotal` (₹ formatted). |
| **Status** | derived-status **pill** (dot + label + caret) → opens status dropdown; `data-tip="Click to change status"`. |
| **Sent** | relative time. |
| **Valid until** | `q.validUntil` display or "—". |
| **⋯** | kebab → row action menu; `data-tip="More actions"`. |

**Derived status** (`qb_getDerivedStatus`): `accepted`/`declined` are terminal; otherwise if `validUntil` has passed → `expired`; else the stored status. Used everywhere (table, chip, analytics) so no daily cron is needed.

**Status dropdown** (`qs_renderStatusMenu` → `qs_setStatus`): section "Change status"; options Sent (*"Awaiting buyer response"*) · Viewed (*"Buyer has seen it"*) · Accepted (*"Buyer confirmed — deal won"*) · Declined (*"Buyer rejected"*). "Expired" is **not** here (derived only). Any→any allowed. Going **to Accepted** prompts a styled confirm — *"Mark as accepted?"* … *"This affects your acceptance rate, top-buyer rankings, and average deal value. Only confirm if the buyer has actually accepted out-of-band (phone, WhatsApp, in person)."* CTA "Yes, mark accepted". On apply (`qs_doApplyStatusChange`): writes `q.status` + `statusUpdatedAt`; if linked, pushes a timeline entry *"Quotation `{number}` marked as `{status}`"* onto the connection; targeted DOM updates (pill, analytics, subtitle, sidebar chip) with scroll anchoring; toast *"`{number}` marked as `{Status}`"*.

**Kebab menu** (`qs_renderKebabMenu`): **View quotation** (`qs_actionView`→`qb_viewQuotation`) · **Edit quotation** / **Create revision** (label is status-aware: terminal → revision via `qb_openBuilderForRevision`, else free edit via `qb_openBuilderForEdit`; `qs_actionEdit`) · **Download PDF** (`qs_actionDownload`→`qb_downloadPdf`) · **Open enquiry** (`qs_actionOpenEnquiry` → switches to `connections`; disabled for free-form → *"Open enquiry (free-form — no link)"*) · **Copy quotation number** (`qs_actionCopyNumber`). The revision path shows a *"Create a revision?"* modal explaining *"Committed quotations can't be edited in place — they're your audit record."* and predicts the next number (`{root}-R{n}`); CTA "Create `{root}-R{n}`".

## 5. Working flow

**A. Quote a live deal (the spine: enquiry → pipeline → quotation).**
1. A buyer enquiry lands via the Connect modal → `enquiries` spine; it appears in **Enquiries** and as a card in **Pipeline**.
2. Seller responds, advances stages; from Pipeline (or directly here) chooses **"New Quotation" → "From an active enquiry"** (only `active`/`accepted` enquiries without a quote are eligible).
3. The **builder** (`qb-`) creates and sends the quotation → it appends a quotation card to the enquiry chat, sets `co.hasQuotation`, advances the pipeline stage to **Quoted**, and pushes the new record into the `quotations` spine.
4. Back here, the new row shows with derived status **sent** (open). The sidebar chip and "awaiting buyer response" subtitle increment **live**, and the buyer dashboard's view of that quotation updates from the same spine.
5. Seller tracks it: **Needs attention** flags it if it goes stale/expiring; seller updates status via the pill (→ Viewed/Accepted/Declined). Marking **Accepted** writes a timeline entry on the enquiry and feeds Acceptance rate / Top buyers / Avg deal.
6. Exit: **Download PDF** / view, or **Open enquiry** to return to the chat thread in **Enquiries** (`subRoute = connId`).

**B. Quote a buyer not in the inbox (free-form).** "New Quotation" → "Free-form quotation" → builder with `enquiryId: null`. The row shows the *"free-form"* ref; "Open enquiry" stays disabled (no link to follow).

**C. Revise a committed quote.** For an Accepted/Declined/Expired row, kebab → **"Create revision"** → confirm → builder pre-filled as `{root}-R{n}`; the original stays unchanged as the audit record, and both link in the table (lineage badges).

**Connects to:** Pipeline (deals → quotations; "Quoted" stage), Enquiries (chat card + "Open enquiry" hand-off), Overview KPIs (deals won this month), Plans (proposal-style grading), and the **buyer dashboard** (the buyer sees/acts on the same quotation via the shared spine).

## 6. Data · States · A11y · Copy

**Data (services → DataSource):** `QuotationService.list()/.create()/.send()/.updateStatus()` over the **`quotations`** spine; `EnquiryService` over the **`enquiries`** (`ib:sharedenquiry`) spine for linked-enquiry eligibility, timeline writes, and the "Open enquiry" hand-off; `EntitlementService` wrapping `ib-entitlements.js` for `of(plan).proposals` depth. Sidebar chip = open (`sent`/`viewed`) count via the chip resolver. No raw `localStorage`/`fetch`.

**States:**
- **Loading:** section skeleton (standard skeleton, not a bare spinner); nav renders immediately.
- **Empty (zero quotes):** `qs_renderEmptyState` — title *"No quotations yet"*, sub *"Build your first quotation from an active enquiry, or create a free-form one for a buyer not yet in your inbox."*, CTA **"New Quotation"** (no dead end).
- **No matches (filters active):** `qs_renderNoMatchesState` — *"No quotations `{matching "…" / with status …}`"*, sub *"Try a different search or status, or clear the filters to see all `{n}` quotations."*, CTA **"Clear filters"**.
- **Locked / gated:** the whole tab is hidden from nav when `ib_anySellingModule()` is false (no upsell card inside the tab — the gate is at nav level). No per-row cap (quotations unlimited).
- **Error:** failed section degrades to inline retry; the rest of the console still renders. Lookup failures toast *"Quotation not found"*.
- **Success:** status change → toast *"`{number}` marked as `{Status}`"*; builder send → *"Quotation sent"* confirm + the enquiry *"moved to the **Quoted** stage"*.

**A11y:** landmarks `header`/`aside`/`main` (`#dashMain`); one **H1** ("Quotations"); active nav `.dn-item` is `aria-current`; menus are `role="menu"` / `role="menuitem"`; disabled "Open enquiry" carries `disabled aria-disabled="true"` with its reason in text (free-form), not colour-only; status is conveyed by **dot + text label** (icon + word), not colour alone; confirm modals announced (`aria-live="polite"`), focus-trapped, Esc/backdrop close; row/popover menus keyboard-operable; toolbar selects `<label>`-wrapped.

**Copy (verbatim):** "Quotations" · "New Quotation" · "Free-form quotation" · "From an active enquiry" · "Hide/Show analytics" · "Total sent" · "Acceptance rate" · "Total value" · "Avg accepted deal" · "Conversion funnel" · "Last 8 weeks" · "Top buyers by value" · "Needs attention" · "Search number, buyer, or city…" · "All time / Last 7 days / Last 30 days / Last 90 days" · "By urgency / Newest first / Oldest first / Highest value / Lowest value / Buyer A→Z / Quotation # (newest)" · "Clear `{N}` filter(s)" · "View quotation / Edit quotation / Create revision / Download PDF / Open enquiry / Copy quotation number" · "Mark as accepted?" / "Yes, mark accepted" · "Create a revision?" / "Create `{root}-R{n}`" · "No quotations yet" · "Everything is on track. No expiring, stale, or recently-lost deals."

---

**Build notes (React):** `components/SellerDashboard/Quotations/` (section list + analytics strip + toolbar + table + row status/kebab menus; the `qb-` builder is a sibling `components/SellerDashboard/QuotationBuilder/`). Services: `QuotationService` (quotations spine) + `EnquiryService` (enquiries spine, for eligibility / timeline / "Open enquiry") + `EntitlementService` (proposal-style depth via `ib-entitlements.js`). Drive the tab from `?tab=quotations`; gate render on `ib_anySellingModule()`.
