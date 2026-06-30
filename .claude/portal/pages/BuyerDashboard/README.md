# PAGE: Buyer dashboard

```
PROTOTYPE: pages/dashboard-buyer.html    ROUTE: PAGES.DASHBOARD_BUYER ("/dashboard")    LAYOUT: Dashboard (self-contained chrome, NO portal layout)
```

The buyer's home after the gate — where a discovered, enquired-upon journey becomes something
**tracked and managed**. This folder breaks the buyer dashboard into **one spec per tab**: this README
is the shared overview; each tab below has its own **page-tab → module → feature → functionality →
working-flow** spec. The 12-point page template is in [../README.md](../README.md) §A.

## Tabs in this folder
Status: ☐ not started · ◐ drafting · ✅ spec complete · 🔨 built in React

| # | Tab (nav label) | Spec | View id | Group | Status |
|---|-----------------|------|---------|-------|--------|
| 1 | **My connections** (default) | [connections.md](connections.md) | `connections` | main | ✅ |
| 2 | Saved items | [saved.md](saved.md) | `saved` | main | ✅ |
| 3 | Recently viewed | [recently-viewed.md](recently-viewed.md) | `activity` | main | ✅ |
| 4 | Reports & feedback | [reports-feedback.md](reports-feedback.md) | `reports` | main | ✅ |
| 5 | My profile | [profile.md](profile.md) | `profile` | account | ✅ |
| 6 | Membership | [membership.md](membership.md) | `membership` | account | ✅ |
| 7 | Settings | [settings.md](settings.md) | `settings` | account | ✅ |
| 8 | Password & security | [security.md](security.md) | `security` | account | ✅ |

## How each tab spec is structured
Every tab spec answers, in order:
1. **Page-tab** — what the tab is; nav group/label/icon/chip; default?; how it's reached (`?tab=<id>`); who sees it.
2. **Module** — which module/subscription it belongs to + plan-gating (visibility + depth). Buyer tabs are universal/account.
3. **Features** — the discrete features/sub-areas in the tab (verbatim names).
4. **Functionality** — what each feature does: controls, data (services → DataSource), gating, behaviour.
5. **Working flow** — the step-by-step user flow(s), and how the tab connects to other tabs + the shared spine.

Then a compact **Data · States · A11y · Copy** footer (services/spine; loading/empty/error/success; a11y; verbatim copy) for build-readiness.

---

## 1. Purpose
Give a logged-in buyer one place to **track their connections** (enquiries → conversations with sellers)
and **manage** their saved items, history, reports, profile, membership and settings — the Track/Manage
end of the buyer journey.

## 2. Journey
- **Actor:** Buyer (the only actor — sellers are redirected to `dashboard-seller.html`; logged-out
  users to `auth.html`).
- **Stage:** Track → Manage (the tail of [../modules-features-flow.md](../../modules-features-flow.md) §1.1).
- **Precedes:** continued browsing (every empty state routes back to Home/listings).
- **Leads from:** a successful Connect enquiry (the success screen forwards here), the topbar avatar
  menu, or a returning login. Deep-linkable per view via `?tab=` / hash.

## 3. Auth
**Auth-required (gated page).** Guard runs on load: `IBAuth.isLoggedIn()` false → `window.location
.replace('auth.html')`; logged-in **seller** → `replace('dashboard-seller.html')`. The signed-in user
hydrates `dashState.user` from shared auth state (`IBAuth.getAuth()`) — never replacing the model. In
React this is a route guard + redirect, reading auth via the auth service, not raw `localStorage`.

## 4. Layout
**Dashboard layout — self-contained chrome, NO portal layout** (no `#ib-topbar`/`#sidebar`). Own chrome:
a dashboard topbar (`.dt-*` with avatar menu, saved-items badge `#dtSavedBadge`, section tag
`#dtSectionTag`) + a left **dashboard nav** `<aside class="dash-nav">` (`.dn-user`, grouped `.dn-item`s,
hidden ≤900px) + `<main class="dash-main" id="dashMain">`. The Connections view swaps `dash-main` to a
full-bleed workspace (`dash-main conn-workspace-mode`).

## 5. Sections / views (the `dashSections` nav — verbatim)
The nav is data-driven from `window.dashSections`; each item is a `<button class="dn-item">` calling
`goSection(id)`. Two groups: **My account** (`group:'main'`) and **Profile & settings**
(`group:'account'`). One view renders at a time via `renderContent()`'s `switch`. Labels/ids/icons are
**verbatim** from the prototype:

| # | View id | Nav label | Group | Icon | What it shows + key actions |
|---|---------|-----------|-------|------|------------------------------|
| 1 | `connections` | **My connections** (chip `2`) | main | `ti-send` | **Default working view.** The connection workspace (see §5a). |
| 2 | `saved` | **Saved items** | main | `ti-bookmark` | `renderSaved()` — grid of `.dcard` saved listings across products/services/businesses/architects. Header actions "Share list" / "Export"; filter chips `.dm-fchip` **All / Products / Services / Businesses / Architects**; per-card `.dcard-unsave`. Empty → "No saved items yet" + **"Start browsing"**. |
| 3 | `activity` | **Recently viewed** | main | `ti-history` | `renderActivity()` — items from last 30 days grouped **Today / Yesterday / This week / Earlier** (`.rv-row`). Search + chips **All / Products / Services / Businesses / Architects**; per-row save / remove; header "Clear history". Empty → "Nothing here yet" + **"View saved items"**. |
| 4 | `reports` | **Reports & feedback** | main | `ti-flag` | `renderMyReports()` — two `.rpfb-panel`s: **Your reports** (flagged listings) + **Your feedback**, each row showing an admin-pipeline status chip. Read-only tracking. Empties: "No reports yet…" / "No feedback yet…". |
| 5 | `profile` | **My profile** | account | `ti-user-circle` | `renderProfile()` — public-facing identity card (avatar, name, verified/seller badge, Saved/Connections/Member-since stats). Actions "View public profile" / **"Edit profile"** (→ settings). |
| 6 | `membership` | **Membership** | account | `ti-rosette` | `renderMembership()` — buyer→seller **upgrade pitch**: plan categories (Automation / Business / Shop / Architecture) each selling an outcome; CTAs "See Automation plans" etc. → plans-checkout. |
| 7 | `settings` | **Settings** | account | `ti-settings` | `renderSettings()` — Account information form, Email notifications toggles, Preferences (language/currency/country), Privacy toggles, Danger zone (Deactivate / Delete account). |
| (8) | `security` | **Password & security** | account | `ti-lock` | `renderSecurity()` — password + 2FA. (Present in nav; not in the brief's seven but ships with them.) |

> `sectionLabels` map + `dashState.section` default `'saved'`; the avatar menu also jumps to profile /
> membership / settings. "Back to platform" → Home; "Sign out" clears auth → Home.

### 5a. Connections view (default) — the connection workspace
`renderConnections()` → a 3-pane `<div class="conn-workspace">`:

**Left — `.cw-list`:** title "Connections" + `.cw-list-count`; **"Enquire"** button (`.cw-new-btn`,
`ti-send`, tip "Send a qualified enquiry to a seller") → `openNewEnquiryModal()`; search
(`#cwSearch`, placeholder "Search by name, subject…") matching name/subject/id; **filter chips**
(`.cw-fchip`, only rendered when count > 0, each with a count badge), labels verbatim:

| Chip | `connFilter` key | Icon | Maps to status |
|------|------------------|------|----------------|
| **All** | `all` | — | everything |
| **Pending** | `pending` | `ti-clock` | `pending` |
| **Awaiting** | `viewed` | `ti-eye` | `viewed` |
| **Active** | `active` | `ti-message-circle` | `accepted` + `active` |
| **Declined** | `declined` | `ti-x` | `declined` |
| **Expired** | `expired` | `ti-clock-exclamation` | `expired` |
| **Closed** | `closed` | `ti-archive` | `closed` |

Then user-defined **label chips** (`renderLabelFilterChips()`, separator `.cw-filter-sep`) toggling
`connLabelFilter`. List rows = `.cw-row` (avatar, name, time, preview, `.cw-row-status` pill). Empty
filter/search → "No matches" / "Try a different filter or search term."

**Middle — `.cw-chat`:** the conversation thread for the selected connection (`renderCwChat`):
- **Header:** avatar, seller name + verified tick, `.cw-row-status` pill, enquiry id (`IB-2891`) + time.
- **Contact actions** (`.cw-contact-actions`) — revealed only when status is active/closed:
  **WhatsApp** (`.cw-contact-btn.whatsapp`, `openWhatsApp(phone,id)`), **call** (`tel:` icon-only),
  **email** (`mailto:` icon-only); otherwise a `.cw-contact-locked` chip "Contact hidden" (tip "Phone &
  email reveal once the seller accepts your enquiry"). **Close** button (`openCloseModal`) when not closed.
- **Menu** (`.cw-menu-btn` `ti-dots-vertical` → `.detail-menu`) — items **verbatim**: "Copy link to
  enquiry", "Mark as unread", "Export conversation" · "Manage labels", "Manage templates" · "Report this
  enquiry", "Delete enquiry" (danger).
- **Enquiry summary strip** (product / quantity / timeline / city) + **labels strip** ("Add label").
- **Thread scroll** of `.msg-row` bubbles (mine/theirs, with attachments); "No replies yet" state per
  status (e.g. "Waiting for {seller} to respond. They have 72 hours.").
- **Composer** (active only) — `renderReplyComposer`: a **Quick replies / templates** panel
  (categories **All / My templates / Greetings / Follow-up / Info request / Quote / Closing**), `/`
  slash palette, attach, "Save current as template", **Send**. Non-active statuses show a `.thread-footer`
  explainer instead of a composer.

**Right — `.cw-timeline`:** "Activity" — original enquiry brief + a `ti`-iconed event timeline
(`co.timeline`). Hidden ≤1100px; on mobile the workspace collapses to list↔chat (`.show-list`).

## 6. Data
URL-driven, **read enquiries + saved via services**, **write via services → DataSource** — never raw
`localStorage`/`fetch` (see [../../Environment-Management-backend.md](../../../Environment-Management-backend.md)
and [../../Integration.md](../../../Integration.md)).

**URL state:** the active view is driven by **`?tab=<view>`** (`useSearchParams`, `replace:true` so view
switches don't stack history). The prototype uses a hash (`#connections/IB-2891`); the React port maps
that to `?tab=connections&id=IB-2891` — the selected connection (`subRoute`) is a second param. `goSection`
becomes a `setSearchParams({tab}, {replace:true})`.

| View | Reads (service) | Spine/group |
|------|-----------------|-------------|
| Connections | `EnquiryService.listForBuyer()` → rows; `EnquiryService.get(id)` → thread | `enquiries` (`ib:sharedenquiry`) — same spine the Connect modal writes |
| Saved | `SavedService.list()` | `saved` |
| Recently viewed | `RecentlyViewedService.list()` | recently-viewed history |
| Reports & feedback | `ReportService.mine()`, `FeedbackService.mine()` | `ib_reports` / `ib_feedback_queue` (admin-pipeline status) |
| Profile / Settings | `ProfileService.get()` / auth state | `ib_auth` user |
| Membership | `EntitlementsService` / plan catalogue | seller plan families |

**Writes (all via services → DataSource):** mark read/unread, **close** enquiry, send message, add/remove
**labels**, save/manage **templates**, save/unsave items, clear history, edit profile/settings, report/
delete enquiry, and creating a new enquiry (`openNewEnquiryModal` → routes to one seller).

## 7. Primary CTA
**Primary — "Enquire"** (`.cw-new-btn`, top of the connections list) → opens the new-enquiry flow that
routes a qualified enquiry exclusively to one seller (the workspace's reason to exist). Secondary CTAs:
- Conversation contact actions — **WhatsApp** / call / email (active connections only).
- **Send** (composer) and quick-reply templates.
- **Close** an enquiry; menu actions (export, mark unread, report, delete, manage labels/templates).
- "Share list" / "Export" (Saved); "Edit profile"; membership "See … plans".
- Every empty state's forward CTA (see §8).

Use exact strings from [../copywriting.md](../../copywriting.md). British **"enquiry/enquire"**; CTAs
Title Case, no caps/"!".

## 8. States
- **Loading:** skeletons per view (list rows, cards) — not a bare spinner.
- **Empty (always a next-action CTA — no dead ends):**
  - Saved → "No saved items yet" + **"Start browsing"** (→ Home).
  - Recently viewed → "Nothing here yet" + **"View saved items"**.
  - Connections list filter/search → "No matches"; no conversation selected → "No conversation selected"
    + **"Send your first enquiry"**; no replies yet → status-specific waiting copy.
  - Reports / Feedback → "No reports yet…" / "No feedback yet…" pointing to the flag/Feedback buttons.
- **Error:** a failed view degrades to a quiet inline retry; the nav/chrome stay usable.
- **Success:** message sent / item saved / enquiry closed → a toast (`showToast(...,'success')`) and the
  view re-renders; destructive actions (delete enquiry, clear history, delete account) confirm first.

## 9. Responsive
- ≤1100px: workspace timeline (`.cw-timeline`) hidden → 2-pane.
- ≤900px: left **dash-nav** hidden (view switching via topbar/avatar menu); workspace becomes single
  pane — list ↔ chat toggled by `.show-list` with a `.cw-mobile-back` "Back" button.
- Card grids (Saved) and row lists (Recently viewed) reflow to single column. Touch targets ≥ 38px
  (the 32px `.conn-btn`/icon-only contact buttons are acceptable as secondary, per Home's rule).

## 10. Accessibility
- Landmarks: dashboard `header` (own chrome), `<aside class="dash-nav">` as the view `nav`, `<main>`;
  the workspace's list/chat/timeline are `aside`/`section`/`aside`.
- Nav: each view is a real `<button>`; the **current view carries `aria-current`** (prototype uses the
  `.on` class — add the ARIA in React).
- Headings: exactly **one H1** per view = the `.dm-title` (the connections workspace's "Connections"
  list title is its labelled region name, `aria-labelledby`).
- Thread is a labelled log (`aria-label` the seller + enquiry id); status conveyed by **icon + text**,
  not colour alone (pills already pair label + colour).
- Menus/modals (`.detail-menu`, close/report/delete, new-enquiry, manage labels/templates):
  `role="dialog"`/`menu` + `aria-modal`, focus-trapped, Esc + backdrop close, focus returns to trigger.
- Icon-only buttons (call, email, save, menu) get `aria-label`; decorative `ti` icons `aria-hidden`.
- Composer: textarea labelled; slash-palette is keyboard-operable (↑↓ navigate, ↵ insert, Esc close).
- Full checklist: [../modules-features-flow.md](../../modules-features-flow.md) §5.

## 11. Copy
- Nav labels, filter chips, menu items, template categories, empty-state titles/CTAs — **verbatim** from
  §5 / §5a above. Brand name lowercase-b **"Interior bazzar"**; British **"enquiry"/"enquire"** throughout.
- CTAs Title Case, no caps/"!". Empty states always end on a forward CTA ("Start browsing", "View saved
  items", "Send your first enquiry"). Status microcopy (waiting/declined/expired) from the prototype's
  `renderThreadFooter`. All strings reconciled against [../copywriting.md](../../copywriting.md);
  tone/tokens against [../style.md](../../style.md).

## 12. SEO
Auth-gated app screen — `noindex` (not a `PublicPage`). Document `<title>` "Dashboard — Interior Bazzar"
(per-view suffix, e.g. "My connections · Interior Bazzar"); no canonical/marketing meta. Set
`<html lang="en-IN">` (prototype gap to fix).

---

### Build notes (React)
- Page shell: `src/pages/DashboardBuyer/index.tsx` + `useDashboardBuyer.ts` + `DashboardBuyer.module.css`;
  composes own chrome (`DashTopbar`, `DashNav`) + a `<ViewSwitch>` that renders one of
  `Connections / Saved / RecentlyViewed / Reports / Profile / Membership / Settings` by `?tab=`.
- The Connections workspace is its own sub-tree (`ConnList` / `ConnThread` / `ConnTimeline`) reading
  `EnquiryService`; selected id is a second search param; writes (mark read, close, labels, message,
  templates) go through services → DataSource so they also surface in seller **Enquiries**.
- Route guard redirects logged-out → Auth and sellers → Seller dashboard (auth service, never raw
  `localStorage`).
- Verify visually with the headless-screenshot method (portal-conversion memory): compare `/dashboard`
  (each `?tab=`) against `file:///…/pages/dashboard-buyer.html`. Gate with `tsc -b` + `vite build`.
