# TAB: Enquiries — Seller Dashboard

```
PARENT: README.md  ·  VIEW id: connections  ·  GROUP: WORK (main · "Inbox & pipeline")  ·  PROTOTYPE: pages/dashboard-seller.html
```

The seller's inbox workspace — the single screen where qualified enquiries land, get
triaged, accepted/declined, and worked into deals. It is the home of the seller's
**primary CTA "Respond"** and the surface the whole exclusive-routing model depends on.
Plan-aware throughout via [`ib-entitlements.js`](../../../Prototype/ib_prototype_7.2.1/assets/ib-entitlements.js);
nothing here is hardcoded. See the parent overview [README.md](README.md) §5 (row 2) and the
[pages index](../README.md).

## 1. Page-tab

- **What it is:** the **Enquiries** inbox — a three-pane workspace (`conn-workspace`): left
  enquiry **list**, middle **chat/thread**, right **Enquiry brief**. The seller's operating
  console for receiving and answering qualified, exclusive enquiries.
- **Where it sits in nav:** group **WORK** (`s.group === 'main'`, labelled **"Inbox &
  pipeline"**), label **"Enquiries"**, rendered by `renderNav()` as a `.dn-item` button (`.on`
  when active, `aria-current`). Chip/count = the **pending** count from `ib_getSidebarChip('connections')`
  ("Needs your attention").
- **Default view?** No. The dashboard default is **Overview** (`overview`); Enquiries is reached
  by selection or deep-link.
- **How it's reached:** prototype routes via `window.location.hash` — `#connections` (whole
  inbox) or nested `#connections/<enquiryId>` (a specific opened thread; set by
  `selectConnection(id)`). **In React mirror as `?tab=connections` via `useSearchParams`, keeping
  the `#connections/<id>` deep-link** for an opened enquiry. The `<main>` switches to
  `dash-main conn-workspace-mode` (full-height, sticky composer) while this tab is active.
- **Who sees it:** **universal** — `ib_sectionAllowed('connections')` is always true for a logged-in
  seller (no module gate on the tab itself). What differs by plan is the **routing/exclusivity
  signalling and qualification depth** inside it (see §2), not visibility.

## 2. Module

- **Module / subscription:** none — the tab is **account/universal** (every seller has an inbox).
  It is **plan-aware routing**: the *content* of each enquiry is graded by the seller's resolved
  plan, but the tab is never hidden or upsell-carded.
- **Entitlement reads (authoritative — via `EntitlementService` wrapping `ib-entitlements.js`):**
  | Read | Drives |
  |------|--------|
  | `IBEntitlements.of(sellerPlan).exclusivity` | exclusivity chip → `exclusive` ("Exclusive to you") |
  | `.of(plan).routing` (`'priority'` / `'priority-exclusive'` / `'shared'` / `'controlled'`) | chip → `priority` ("Priority routed") vs `shared` ("Shared") |
  | `.of(plan).networkTier` (`exclusive`/`full`/`premium`/`limited`/`none`) | priority lane band |
  | `.of(plan).qualification` (`'3-step'` / `'4-step'`) | whether the 4th **"Agent"** cleared-step + `Confirmed` intent appear |
  | `IBEntitlements.priorityFor(qualTier, plan)` → `{tier P1–P4, label, lane, color, exclusive}` | per-row priority pill + opened-header lane |
- **Gate:** `ent_exclusivityInfo()` returns `null` (chips suppressed) when the engine is missing or
  `!u.isSeller || !u.sellerPlan` — so a seller with **no active plan (`FREE`)** sees the inbox but
  every enquiry reads **"Shared"** with the upgrade tooltip. No `IB_SECTION_MODULE` entry for
  `connections`; the routing depth (not a section gate) is what `of(plan)` modulates. **Never
  hardcode** a tier — all of the above read from `ib-entitlements.js`.

## 3. Features

Verbatim sub-areas of the `conn-workspace`:

- **Enquiries list** (`cw-list`) — title "Enquiries" + total count; "**+ Enquiry**" add button;
  title kebab (Source filter + "Keyboard shortcuts").
- **Search** (`cwSearch`) — "Search by name, subject... (press /)".
- **Filter chips** (`cw-filters`) — **All** reset; **Status** dropdown (All statuses / New /
  Working / Accept / Reject); **Type** dropdown (form types); **Labels** dropdown (+ "Manage labels…").
- **Source filter** (in kebab) — All sources / Shop / Business / Architect.
- **Bulk action bar** (`cw-bulk-bar`) — select-all + **Label / Decline / Close / Delete**.
- **Enquiry rows** (`renderCwRow`) — avatar, name, deal value `~{value}`, preview, city/source meta,
  status chip, form-type chip, SLA pill, label chips, note-flag. Each carries the **intent/qualification
  tag** (`ent_qualChip`/`ent_enquiryIntent`) and **priority pill** (`ent_priorityChip`).
- **Chat / thread** (`renderCwChat`) — header (name, status, **exclusivity banner** `ent_exclusivityChip('banner')`,
  contact icons, status-action zone), labels strip, thread scroll, sticky composer/footer.
- **Status actions** (`renderHeaderStatusActions`) — pending: **Decline / Accept**; active: **Stage**
  picker + **Quotation**; closed: **Won/Lost** outcome chip.
- **Enquiry brief** (`renderCwTimeline`, right column) — structured intent panel (what/where/when/value/urgency + timeline).
- **Add a new enquiry** modal (`openAddEnquiryModal`) — manual capture of off-platform leads.
- **Private sales notes** (`openNotesModal` / `IBNotes`) and **labels** (user-defined).

## 4. Functionality

### Enquiries list, search & filters
| Control | Verbatim | Behaviour / data |
|---------|----------|------------------|
| Add | "**+ Enquiry**" · tip *"Add an enquiry from GMB, WhatsApp, phone, or walk-in"* | opens **"Add a new enquiry"** modal → `EnquiryService.create()` |
| Search | placeholder *"Search by name, subject... (press /)"* | `onConnSearch` filters by name/subject/id |
| All | *"Clear every filter"* | `ib_resetAllFilters()` |
| Status | "Status" → **All statuses / New / Working / Accept / Reject** | `setConnFilter(key)`; buckets: New = pending+viewed, Working = active/accepted, Accept = closed, Reject = declined+expired |
| Type | "Type" (form types from `IB_ENQUIRY_FORMS`) | `setConnFormFilter` |
| Labels | "Labels" + *"Manage labels…"* | `setLabelFilter` |
| Source | All sources / Shop / Business / Architect | `setConnSourceFilter` (only when >1 source present) |
| Empty filter | *"No matches" / "Try a different filter or search term."* | shown when filtered list is empty |

Bulk bar appears only with a selection: **"{n} selected"** + **Label** (*"Apply a label to all
selected"*), **Decline** (*"Decline {n} pending…"*), **Close** (*"Close {n} active…"*), **Delete**
(*"Permanently delete all selected"*). Reads/writes via `EnquiryService.update()` / `.list()` on the
`enquiries` spine (`ib:sharedenquiry`).

### Qualification (intent) tag — plan-graded
`ent_enquiryIntent(co)` derives a stable per-enquiry intent; `ent_intentMeta` maps it (verbatim
labels + tips):

| Intent | Label | Tooltip |
|--------|-------|---------|
| confirmed | **Confirmed** | *"Spoken to and confirmed by our agent — the highest-confidence enquiries, ready to close."* |
| high | **Urgent** | *"Ready to start now — fully screened and time-sensitive. Call this one first."* |
| med | **Intent** | *"Actively planning — genuine enquiry with clear intent and a timeline."* |
| planning | **Interested** | *"Exploring options — verified, genuine contact with no firm timeline yet."* |

**`Confirmed`** only appears on **`qualification:'4-step'`** plans (Autogrowth Scale/Dominance). The
cleared-step strip (`ent_qualSteps`) shows **Contact · Genuine · Intent** on 3-step plans and adds a
4th **Agent** step only on 4-step plans. The banner variant reads "**Qualified · {label}**".

### Priority pill (qualification × plan)
`ent_priorityChip` calls `IBEntitlements.priorityFor(tier, plan)` → P-tier:
**P1 Immediate** · **P2 Priority** · **P3 Standard** · **P4 Nurture** (lane + colour from the engine).
Row shows the compact tier code (e.g. "P2") with a lock glyph when `exclusive`; the opened-header
banner shows the full *"{tier} · {label}"* and lane tooltip. **Higher plan lifts the same enquiry into
a faster lane** — never hardcoded; read live.

### Exclusivity chip — the routing signal (gated, never hidden)
`ent_exclusivityInfo()` reads the **plan**, not the enquiry:

| Plan property | kind | Chip label | Tooltip (verbatim) |
|---------------|------|-----------|--------------------|
| `exclusivity: true` | exclusive | **Exclusive to you** (`ti-lock`) | *"Routed only to you — never shared with competitors."* |
| `routing: 'priority' \| 'priority-exclusive'` | priority | **Priority routed** (`ti-bolt`) | *"You are served before standard tiers. Upgrade to Autogrowth for full exclusivity."* |
| else | shared | **Shared** (`ti-users`) | *"This enquiry may be offered to a few matched businesses. Upgrade for priority or exclusivity."* |

Rendered as a compact row chip and a banner in the opened-enquiry header. The **upgrade path stays
legible** in the tooltip — never re-worded to hide that exclusivity is a paid capability.

### Chat / thread + status actions
- **Pending:** sticky footer *"{buyer} is waiting for your response. Accept or decline within 72 hours
  to maintain your response rate."* Header zone → **Decline** (`sellerDecline`, tip *"Decline this
  enquiry"*) + **Accept** (`sellerAccept`, tip *"Accept and reveal buyer contact"*). Accept reveals
  WhatsApp/Phone/Email icons.
- **Viewed:** footer *"You opened this enquiry but haven't replied yet. {buyer} is waiting."*
- **Active/accepted:** **Stage** picker (`new · contacted · quoted · meeting · won · lost`,
  `ib_setStageInline` → writes `dealStage` to the shared **pipeline** spine) + **Quotation** (tip
  *"Build and send a quotation to this buyer"* → `qb_openBuilder`) or **"Quotation sent"** chip
  (`qb_viewSent`). Composer (`renderReplyComposer`) for replies.
- **Closed:** outcome chip **Won** (`ti-trophy`) / **Lost** + value; footer summarises outcome.
- **Contact:** **WhatsApp** (`openWhatsApp`), **Call** (`tel:`), **Email** (`mailto:`) — revealed on
  accept/closed. Kebab: *"Copy link to enquiry" / "Export conversation" / "Manage labels" / "Manage
  templates" / "Report this enquiry" / "Delete enquiry"*.

### Add a new enquiry (off-platform capture)
Modal **"Add a new enquiry"**, body *"Capture an enquiry that came in off-platform — via GMB cold
call, WhatsApp, walk-in, or referral. It will appear in your inbox and pipeline so nothing falls
through the cracks."* Fields: Buyer name*, Phone, Source (GMB call/WhatsApp/Phone call/Walk-in/Referral/
Instagram·DM/Other), City, *"What are they looking for?"*\*, Quantity/scope, Estimated deal value,
Notes. CTA **"Add to inbox"** → `EnquiryService.create()` (surfaces in inbox + pipeline).

## 5. Working flow

1. **Entry** — seller opens `?tab=connections` (or deep-link `#connections/<id>` from Overview "Reply
   now" / sidebar chip "Needs your attention"). Workspace mounts (`conn-workspace-mode`).
2. **Triage** — scan the list: status, deal value, SLA pill, **intent tag** (Confirmed/Urgent/Intent/
   Interested) + **priority pill** (P1–P4) + **exclusivity chip** (Exclusive to you / Priority routed /
   Shared). Filter by Status / Type / Source / Labels or search.
3. **Open** — click a row → `selectConnection(id)` sets `#connections/<id>`; chat + brief load.
4. **Respond (primary CTA)** — for a pending enquiry: **Accept** (reveal contact) or **Decline**;
   reply in the composer; contact via WhatsApp/Phone/Email.
5. **Advance** — set **Stage** (writes `dealStage`) → the deal surfaces live on the **Pipeline** tab;
   build a **Quotation** → surfaces on the **Quotations** tab (`new-quotation.html` builder).
6. **Close** — mark **Won/Lost**; outcome feeds Overview KPIs ("Deals won this month") and Insights.
7. **Exit** — back to list, next enquiry, or jump to Pipeline/Quotations.

**Spine connections:** enquiry (`ib:sharedenquiry`, written by the Connect modal on the **buyer**
side) → inbox here → **stage write surfaces on Pipeline** → **Quotation** → won/lost feeds **Overview/
Insights**. A buyer's Connect submission appears here live; an accept here updates the buyer's view of
their enquiry. Manual "Add to inbox" injects an off-platform lead into the same spine.

## 6. Data · States · A11y · Copy

- **Data:** `EnquiryService.list()` / `.update(stage)` / `.create()` → `enquiries` spine
  (`ib:sharedenquiry`); `QuotationService` (builder hand-off); `EntitlementService` wrapping
  `ib-entitlements.js` (`of` / `priorityFor` / `networkTier`); `IBNotes` for private notes; labels via
  the labels store. **All via services → DataSource — never raw `localStorage`/`fetch`.**
- **States:**
  - *Loading:* workspace skeleton (nav renders immediately from `dashSections`).
  - *Empty (filtered):* "**No matches**" + *"Try a different filter or search term."* No-selection brief:
    *"Pick an enquiry to see what the buyer wants, where, when, and how urgent it is."*; chat empty:
    "**No replies yet**" + status-aware hint.
  - *Locked/gated:* not section-hidden (universal). Plan depth signalled **in-place** — `FREE`/lower
    plans read "**Shared**" with the upgrade tooltip; `Confirmed`/`Agent` step appear only on 4-step
    plans (their absence is the signal, paired with the upgrade copy on the exclusivity chip). No silent
    hiding of the paid exclusivity capability.
  - *Error:* failed section degrades to inline retry; nav + rest of console still render.
  - *Success:* accept/decline/close → status toast; reply sent / stage moved / "Add to inbox" → toast.
- **A11y:** landmarks `header`/`aside`/`main`; one **H1** per section; active `.dn-item` `aria-current`;
  nav + row controls are real `<button>`s with `aria-label` (e.g. "Select all visible enquiries");
  status/intent/exclusivity convey via **icon + text + colour** (`ti-lock`/`ti-bolt`/`ti-users`,
  `ti-flame`/`ti-target`/`ti-eye`/`ti-headset`), not colour alone; modals focus-trapped, Esc/backdrop
  close, `aria-live` toasts; `/` focuses search.
- **Copy (verbatim):** "Enquiries" · "+ Enquiry" · "Search by name, subject... (press /)" ·
  "All statuses / New / Working / Accept / Reject" · "Exclusive to you" / "Priority routed" / "Shared" ·
  "Confirmed / Urgent / Intent / Interested" · "Qualified · {label}" · "Decline" / "Accept" /
  "Quotation" / "Quotation sent" · "Won" / "Lost" · "Accept or decline within 72 hours to maintain your
  response rate." · "Add a new enquiry" → "Add to inbox" · "No matches" · "Pick an enquiry to see what
  the buyer wants, where, when, and how urgent it is." CTAs Title Case; British "enquiry"; brand
  "Interior bazzar".

---

**Build notes (React):** `components/SellerDashboard/Enquiries/` (workspace shell + `EnquiryList`,
`EnquiryChat`, `EnquiryBrief`, `AddEnquiryModal`); driven by `?tab=connections` (+ `#connections/<id>`
deep link). Services: `EnquiryService` (enquiries spine), `QuotationService` (builder hand-off),
`EntitlementService` wrapping [`ib-entitlements.js`](../../../Prototype/ib_prototype_7.2.1/assets/ib-entitlements.js)
for `of`/`priorityFor`/`networkTier`/`exclusivity`/`qualification` — no plan number hardcoded. Cross-refs:
[README.md](README.md), [../README.md](../README.md), [modules-features-flow.md](../../modules-features-flow.md),
[style.md](../../style.md), [copywriting.md](../../copywriting.md),
[Environment-Management-backend.md](../../../../docs/environment-and-backend.md), [Integration.md](../../../../docs/integration.md).
