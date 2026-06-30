# TAB: Reports & feedback — Buyer Dashboard

```
PARENT: README.md  ·  VIEW id: reports  ·  GROUP: main  ·  PROTOTYPE: pages/dashboard-buyer.html
```

A read-only **tracking** tab. It does not let the buyer *create* a report or feedback — those are
written elsewhere (the **flag** button on a listing page; the **Feedback** button at the bottom-right of
every page). This tab is where the buyer comes back to see *what happened next*: each submission they made
is shown with the **status it currently sits at in the Interior bazzar admin review pipeline**. The whole
view is `renderMyReports()` -> two `.rpfb-panel`s: **Your reports** and **Your feedback**.

Links: parent overview = [README.md](README.md) · pages index = [../README.md](../README.md) ·
modules-features-flow = [../../modules-features-flow.md](../../modules-features-flow.md) ·
style = [../../style.md](../../style.md) · copywriting = [../../copywriting.md](../../copywriting.md) ·
environment seam = [../../../Environment-Management-backend.md](../../../Environment-Management-backend.md) ·
integration = [../../../Integration.md](../../../Integration.md) ·
prototype = [../../../Prototype/ib_prototype_7.2.1/pages/dashboard-buyer.html](../../../Prototype/ib_prototype_7.2.1/pages/dashboard-buyer.html).

## 1. Page-tab
- **What it IS:** the buyer's record of their own submissions to the platform — listings they **flagged
  for review** and **feedback notes** they sent — each annotated with its live admin-pipeline status. Pure
  tracking; nothing is authored here.
- **Where it sits in the nav:** dashboard left nav `<aside class="dash-nav">`, group **main** ("My
  account"). Nav entry (verbatim): `{id:'reports', label:'Reports & feedback', icon:'ti-flag', group:'main'}`.
  Rendered as a `<button class="dn-item">` calling `goSection('reports')`.
- **Icon:** `ti-flag`. **Chip/count:** a live nav chip (`sec.chip`) set by `_rpfbSyncChip()` = count of
  *in-pipeline* items = reports with status `open` or `reviewing` **plus** feedback with status `new`
  (empty string when zero, so no badge shows). The chip refreshes on `ib:report` / `ib:feedback` events and
  on the `storage` event for keys `ib_reports` / `ib_feedback_queue`.
- **Default view?** No. The buyer dashboard default working view is **My connections** (`connections`);
  `dashState.section` falls back to `'saved'` in the prototype. Reports is reached on demand.
- **How it's reached:** `?tab=reports` (React port of the prototype's `goSection('reports')` ->
  `window.location.hash = 'reports'`). No deep-link sub-route — there is no per-item detail route; the tab
  is a flat two-panel list. `subRoute` is cleared on entry.
- **Who sees it:** every logged-in buyer (auth-gated page guard; logged-out -> `auth.html`, seller ->
  `dashboard-seller.html`). No per-buyer gating beyond that — see §2.

## 2. Module
**Buyer — universal / account.** This is a core buyer-account tab, not a paid module. There is **no
subscription, entitlement read, or plan-gate** on it: no `IBEntitlements.of/.limit/.atCap/.meters` and no
`IB_SECTION_MODULE` / `ib_sectionAllowed` check (those govern *seller* sections). Every buyer sees the full
feature at full depth. The only "gating" is the standard page auth guard. Visibility of *content* is by
ownership: `_rpfbMine()` filters all platform reports/feedback down to the signed-in user (record email ===
user email, case-insensitive; records with no email fall back to exact name match).

## 3. Features
Verbatim sub-areas from the prototype (`renderMyReports()`):

- **Your reports** — `.rpfb-panel`, head `Your reports · {count}`, sub *"Listings you've flagged for review."*
- **Your feedback** — `.rpfb-panel`, head `Your feedback · {count}`, sub *"Notes you've sent us through the Feedback button. Little things."*
- **Admin-pipeline status chip** (`.rpfb-chip`) — per row, on both panels; the live state of each submission.
- **Empty states** — distinct per panel, each pointing back to where the submission is *made*.

(Header above both panels: breadcrumb `Dashboard > Reports & feedback`, H1 `Reports & feedback`, sub
*"Track what happens after you flag a listing or send us feedback — every submission is reviewed by the
Interior bazzar team."*)

## 4. Functionality

### Your reports (`.rpfb-panel`)
- **What it does:** lists the listings this buyer flagged, newest first (`mine.reports.slice().reverse()`).
  Read-only — no controls, no edit/withdraw in the prototype.
- **Reads:** `ReportService.mine()` -> spine group **`ib_reports`** (`_rpfbRead('ib_reports')`, filtered by
  `_rpfbMine()`). Written upstream by the flag flow on public listing pages (`ib-report.js`), not here.
- **Each row (`.rpfb-row`):**
  - **Title** (`.rpfb-title`): a type icon + `r.targetName || r.targetId || 'Listing'`. Type->icon map:
    `business -> ti-building`, `shop -> ti-building-store`, `architect -> ti-ruler-2`, `product -> ti-box`,
    `service -> ti-tools` (fallback `ti-flag`).
  - **Meta** (`.rpfb-meta`): `{Reason} · reported {ago}` — reason via `_rpfbPretty(r.reason)`
    (slug->Sentence case), time via `_rpfbAgo(r.createdAt)`.
  - **Note** (`.rpfb-note`): `r.note` if present.
  - **Status chip** (`.rpfb-chip`): `_rpfbChip(r.status)` — see status table below.

### Your feedback (`.rpfb-panel`)
- **What it does:** lists feedback notes this buyer sent, newest first (`mine.feedback.slice().reverse()`).
  Read-only.
- **Reads:** `FeedbackService.mine()` -> spine group **`ib_feedback_queue`**
  (`_rpfbRead('ib_feedback_queue')`, filtered by `_rpfbMine()`). Written upstream by the global Feedback
  button (`ib-feedback.js`).
- **Each row (`.rpfb-row`):**
  - **Title** (`.rpfb-title`): a sentiment icon + `_rpfbPretty(f.category) || 'General feedback'`.
    Sentiment->icon map: `love -> ti-mood-smile`, `okay -> ti-mood-neutral`, `confusing -> ti-mood-confuzed`,
    `bug -> ti-bug` (fallback `ti-message-2-heart`).
  - **Meta** (`.rpfb-meta`): `sent {ago}` and, if `f.page` set, `· from {last path segment}`.
  - **Note** (`.rpfb-note`): `f.message` if present.
  - **Status chip** (`.rpfb-chip`): `_rpfbChip(f.status)`.

### Admin-pipeline status chip (`_rpfbChip` / `_rpfbStatusMeta`) — verbatim
Status conveyed by **icon + text + colour class** (not colour alone). Unknown statuses fall back to the raw
slug with `ti-point` / gray.

| status (slug) | Chip label (verbatim) | class | icon | used by |
|---|---|---|---|---|
| `open` | Open — awaiting review | amber | `ti-clock` | reports |
| `reviewing` | Being reviewed | teal | `ti-eye` | reports |
| `actioned` | Actioned | green | `ti-check` | reports |
| `dismissed` | Reviewed — no action | gray | `ti-circle-minus` | reports |
| `new` | Received | amber | `ti-inbox` | feedback |
| `triaged` | Triaged | teal | `ti-list-check` | feedback |
| `closed` | Closed | gray | `ti-circle-check` | feedback |

> Colour classes: `rpfb-amber` (#BA7517), `rpfb-teal` (#0e7a5c), `rpfb-green` (#085041), `rpfb-gray`
> (#8b887d).

### Live nav chip (`_rpfbSyncChip`)
Recomputes `sec.chip` for the `reports` nav item = `reports` where status is `open`/`reviewing` **+**
`feedback` where status is `new`. Empty -> no badge. Re-runs when an admin moves a submission along the
pipeline (cross-tab `storage` event) or when the buyer files a new one (`ib:report` / `ib:feedback`).

### Gating UI
None. Buyer tab — no caps, no locks, no upsell card, no "Soon" chip.

## 5. Working flow

**Flow A — track a flagged listing (cross-page -> cross-pipeline):**
1. On a public listing page (Home/listings/detail), the buyer hits the **flag** button -> the report flow
   (`ib-report.js`) writes a record via the report service -> DataSource (`ib_reports`).
2. The buyer opens their dashboard and selects **Reports & feedback** (`?tab=reports`). The nav chip already
   shows the in-pipeline count.
3. `renderMyReports()` reads `ReportService.mine()`, filters to the signed-in user, and lists the report
   under **Your reports** with chip **Open — awaiting review**.
4. The **admin console** (Integration: shared `ib_reports` spine) moves it: `reviewing` -> **Being reviewed**,
   then `actioned` -> **Actioned** or `dismissed` -> **Reviewed — no action**.
5. Back in the buyer dashboard, the `storage` / `ib:report` listener re-renders the open section and resyncs
   the nav chip **live** — the buyer sees the status change without reloading. Exit: nothing to act on; this
   is the terminus of the report's buyer-side journey.

**Flow B — track sent feedback:** same loop via the global **Feedback** button (bottom-right of every page)
-> `ib_feedback_queue`; statuses `new -> triaged -> closed` surface as **Received -> Triaged -> Closed**.

**Connections to other tabs / shared spine:**
- Unlike **My connections** (which writes to the `enquiries` spine and surfaces live in the *seller*
  dashboard), this tab is a **one-way mirror of the admin pipeline** — the counterpart actor is the
  **Interior bazzar admin/moderation console**, not a seller. The write happens on public pages; the status
  updates come from admin. See [../../../Integration.md](../../../Integration.md) for the shared
  `ib_reports` / `ib_feedback_queue` spine.
- It shares the buyer dashboard nav + chrome with the other `main`-group tabs (Connections, Saved, Recently
  viewed) and switches via the same `?tab=` mechanism.

## 6. Data · States · A11y · Copy

**Data (services -> DataSource; never raw localStorage/fetch):**
- `ReportService.mine()` -> spine group `ib_reports`.
- `FeedbackService.mine()` -> spine group `ib_feedback_queue`.
- Ownership filter = signed-in user (email match, case-insensitive; name fallback). Both panels are
  **read-only** — no writes originate in this tab.

**States:**
- **Loading:** skeleton rows inside each panel (per README: skeletons, not a bare spinner).
- **Empty (per panel, each ends on a forward pointer — no dead end):**
  - Your reports -> *"No reports yet. If a listing looks wrong, use the **flag** button on its page."*
    (`ti-flag-off`).
  - Your feedback -> *"No feedback yet. The **Feedback** button lives at the bottom-right of every page."*
    (`ti-message-2`).
- **Error:** failed read degrades to a quiet inline retry; nav/chrome stay usable.
- **Success / live update:** when admin advances a submission, the section re-renders and the nav chip
  resyncs automatically (no explicit success toast — this tab consumes status, it doesn't author it).
- *(No seller locked-gate / cap-toast — buyer universal tab.)*

**A11y:**
- Landmarks: dashboard `header` (own chrome), `<aside class="dash-nav">` as view nav, `<main>`; each panel a
  `section` labelled by its `.rpfb-panel-head`.
- Exactly **one H1** = `.dm-title` "Reports & feedback".
- Active nav button carries `aria-current` (prototype `.on` -> add ARIA in React).
- Status conveyed by **icon + text, not colour alone** (each chip pairs a `ti` icon + label).
- Decorative `ti` icons `aria-hidden`; the breadcrumb chevrons/icons decorative.

**Copy (verbatim):**
- Breadcrumb: `Dashboard > Reports & feedback`. H1: `Reports & feedback`.
- Sub: "Track what happens after you flag a listing or send us feedback — every submission is reviewed by
  the Interior bazzar team."
- Panel heads: "Your reports", "Your feedback". Panel subs: "Listings you've flagged for review." /
  "Notes you've sent us through the Feedback button. Little things."
- Status labels + empty states: as quoted in §4 / States above. Brand lowercase-b **"Interior bazzar"**;
  British **"flag"/"review"**; no CTA buttons in this read-only tab (the forward actions live on other pages).

---

Build notes (React): `components/BuyerDashboard/ReportsFeedback/` (a `ViewSwitch` case for `?tab=reports`,
rendering two read-only panels) — uses `ReportService.mine()` (`ib_reports`) and `FeedbackService.mine()`
(`ib_feedback_queue`) via DataSource, with a live nav-chip sync on `ib:report` / `ib:feedback` / spine
change.
