# PAGE: Architect detail

```
PROTOTYPE: pages/architect-detail.html   ROUTE: PAGES.ARCHITECT_DETAIL ("/architects/:id")   LAYOUT: Browsing (topbar + sidebar)
```

An **evaluate** page: one architect/designer profile, in full, so a buyer can decide and enquire.
Everything in [README.md](README.md) §B is answered below. The primary CTA opens
the shared **Connect modal** with intent **`project`**.

---

## 1. Purpose
Let a buyer fully evaluate a single architect — portrait carousel, quick stats, profile, projects,
reviews, awards, contact — and route them into a qualified Connect enquiry (intent `project`) to that
one designer.

## 2. Journey
- **Actor:** Buyer (primary).
- **Stage:** Evaluate (the step between the Architects listing and Connect).
- **Precedes:** the Connect modal; the buyer dashboard (after the enquiry lands).
- **Leads to:** Connect (intent `project`) → login gate → success; or back to `architects.html`.

## 3. Auth
**Public.** The whole profile and every tab (Overview, Profile, Projects, Reviews, Awards, Contact) are
browsable anonymous. The **login gate fires on the Connect action** — "Start a project" / "Book
consultation" / "Call" all call `openConn()`, which routes through `IBConnect.open()`; the gate is on
Connect step 1, not on the page. Save/Share are also gated at the action.

## 4. Layout
**Browsing layout** — fixed topbar (60px) + collapsible left sidebar (240/72px) + `<main class="main">`
(shell `max-width:1600px`). The profile body is `.arch-detail-page` (`#archDetailPage`), rendered by
`renderDetail()` from the `id` query param. The project lightbox (`#projLb`) lives outside `<main>`.

## 5. Sections (top → bottom — exact prototype order)
Detail pages do **not** use the feed `.sec-eye`/`.sec-title` SectionHeader; sections here are `.ad-card`
blocks with `.ad-card-title`. Quote copy **verbatim**:

| # | Section | Container | Content (verbatim from prototype) |
|---|---------|-----------|-----------------------------------|
| 1 | Top nav | `.ad-topnav` | "Back to architects" + breadcrumb (Architects › {name}) + actions: Save / Share / Report this listing. |
| 2 | Hero | `.ad-hero` | `.ad-portrait` 6-slide carousel (monogram + 5 project thumbs, prev/next, `1 / 6` counter, dots) with status pill "Available now" / "Booked through Q2 2026"; `.ad-hero-info`: eyebrow "IB Verified · {Principal Architect / Senior Designer}", **H1** `.ad-hero-name` ({architect name}), title + style tag, quick stats (Projects / Years / Rating / Reviews), bio; **CTAs** "Start a project" + "Book consultation" + "Call". |
| 3 | Tabs | `.ad-tabs` | **Overview · Profile · Projects (n) · Reviews (n) · Awards · Contact** (`adTab()` swaps `.ad-pane`). |
| 3a | Overview pane | `#ad-pane-overview` | Two-column: About snippet + chips ("Read full profile →"); Recent projects (3, "View all n →"); "What clients say" mini (rating + 1 review, "All n reviews →"); "Recent recognition" (2 awards); sidebar `.ad-sidebar-card` "Key details" + "Start a project" / "Book consultation". |
| 3b | Profile pane | `#ad-pane-profile` | "About" (2 paragraphs); "Areas of expertise" chips; "Engagement process" 4 steps (1 Discovery call → 4 Execution & handover); sidebar "Key details" (experience, location, credentials, languages, pricing, "Typical timeline 2–3 weeks concept · 8–24 weeks execution"). |
| 3c | Projects pane | `#ad-pane-projects` | "Featured projects" `.ad-projects` grid of 6 `.ad-project` (e.g. "Mehta Villa, Saket" / "Residential · 4,200 sqft"), each → `openProjLb()` lightbox. |
| 3d | Reviews pane | `#ad-pane-reviews` | `.ad-rev-summary` (big rating, stars, "{n} client reviews", 5→1 `.ad-rev-bar`) + 3 `.ad-review` (avatar, name, date, stars, text). |
| 3e | Awards pane | `#ad-pane-awards` | "Recognition & awards" `.ad-awards` list (year + title + desc) + sidebar "Credentials" chips. |
| 3f | Contact pane | `#ad-pane-contact` | "Ways to get in touch" (Start a project chat · Book a 30-min discovery call · phone/WhatsApp · email · studio address) + sidebar "Quick start" with "Start a project" / "Book consultation". |
| 4 | Connect modal | shared `IBConnect` | Shared enquiry overlay (see §7), opened by the Connect CTAs. |
| 5 | Project lightbox | `#projLb` | Project image carousel (outside `<main>`), opened from project thumbs. |

> Note: there is **no separate "related architects" row** in this prototype — discovery back-links are
> the top-nav "Back to architects" and breadcrumb.

## 6. Data
Read-only page plus the Connect write. All via services → DataSource — **never** raw `localStorage`/
`fetch` (see [../../../docs/environment-and-backend.md](../../../docs/environment-and-backend.md)).
The prototype renders client-side from a `products` array and stores saves in `ib_saved_architects` /
`ib_reports` directly — the port replaces both with the service layer.

| Section | Service (local-first) | Spine/source |
|---------|-----------------------|--------------|
| Hero, stats, bio, key details | `ArchitectService.get(id)` | listing content (architect) |
| Projects + lightbox | `ArchitectService.projects(id)` | portfolio content |
| Reviews | `ReviewService.forArchitect(id)` | reviews content |
| Awards / credentials | `ArchitectService.get(id)` (awards field) | listing content |
| Save / Report / Connect | `SaveService.toggle()` · `ReportService.open()` · `ConnectService.submit()` | `enquiries` (`ib:sharedenquiry`) |

**URL state:** `:id` (architect id) via route param (prototype reads `?id=`), in `useArchitectDetail.ts`.
Active tab may use `?tab=` so a tab is linkable.

## 7. Primary CTA
**"Start a project"** (`.ad-cta-primary`, `onclick="openConn()"`) — opens the Connect modal with intent
**`project`** (`PAGE_INTENT = 'project'`, routed via `IBConnect.open({ intent: 'project' })`).

Secondary CTAs (all resolve to the next step):
- **"Book consultation"** (`.ad-cta-secondary`) → Connect, intent `project`.
- **"Call"** (hero) → Connect, intent `project` (phone surfaced after qualification).
- Save (bookmark, "Saved to your list" toast) → writes to saved · Share (`navigator.share`) ·
  **Report this listing** (`IBReport.open`, `targetType:'architect'`).
- "Back to architects" / breadcrumb → `architects.html` listing.

Connect copy (prototype + [../modules-features-flow.md](../modules-features-flow.md)
§Part 2): the **project** intent runs Contact (phone + OTP) → Project type (Residential/Commercial/
Hospitality/Industrial) → Timeline; per-step CTA "Continue" → "Verify phone" → "Send enquiry"; success
ends on a concrete timeline + forward action. Use exact strings from
[../copywriting.md](../copywriting.md).

## 8. States
- **Loading:** skeleton for hero (portrait + stats) and the active pane; panes lazy-skeleton on switch.
- **Empty:** a pane with no data (e.g. no awards) shows a quiet "Nothing here yet" with a forward action,
  never a dead end. Booked architects still show the profile with the "Booked through Q2 2026" pill.
- **Not found:** invalid `:id` → the prototype's centered "Architect not found" + "Back to architects" CTA.
- **Error:** a failed section degrades to hidden + quiet inline retry; the rest still renders.
- **Success:** owned by the Connect overlay (success screen + timeline + forward action).

## 9. Responsive
- Desktop: `.ad-hero` portrait + info two-column; `.ad-content-grid` content + sidebar; projects grid 3-up.
- ≤720px: sidebar → drawer; hero stacks (portrait above info); `.ad-content-grid` → single column with the
  sidebar card below; projects grid reflows to 2-up/1-up; tab strip scrolls horizontally; lightbox full-screen.
- Touch targets ≥ 38px; portrait carousel arrows/dots and action icons sized for touch.

## 10. Accessibility
- Landmarks: `header` (topbar), `nav`/`aside` (sidebar), `main`; breadcrumb a `<nav aria-label>`; tab
  region a labelled `<section>`.
- Headings: **one H1** = `.ad-hero-name` (the architect name); `.ad-card-title` are H2; no skipped levels.
- Tabs: real `role="tablist"`/`tab`/`tabpanel` with `aria-selected`, arrow-key operable (prototype uses
  plain buttons — fix in the port).
- Portrait + project carousels: labelled prev/next buttons, dots are labelled buttons, counter exposed as
  text; respect `prefers-reduced-motion`.
- Rating "★★★★★ 4.9" needs a text equivalent; stars `aria-hidden`. Booked/available status conveyed by
  text, not colour alone.
- Project lightbox + Connect modal: `role="dialog"` + `aria-modal="true"` + `aria-labelledby`; focus
  trapped; Esc + backdrop close; focus returns to the trigger. Icon-only Save/Share/Report get `aria-label`.
- Full checklist: [../modules-features-flow.md](../modules-features-flow.md) §5.

## 11. Copy
- Brand name lowercase-b **"Interior bazzar"**; British **"enquiry"** in prose. CTAs Title Case, no caps,
  no "!".
- Tab labels and card titles verbatim ("Overview", "Engagement process", "Recognition & awards", "Ways to
  get in touch"). The architect title prefix "Ar." is stripped for display (prototype `replace('Ar. ','')`).
- Connect/save microcopy and the success timeline from [../copywriting.md](../copywriting.md); the
  save toast "Saved to your list" / "Removed from your list" kept verbatim.

## 12. SEO
`PublicPage` with: title "{architect name} — Interior bazzar" (the prototype sets
`document.title = a.name + ' — Interior bazzar'`; static `<title>` = "Architect Profile — Interior
bazzar"), description echoing speciality + value prop ("qualified enquiries, not noise"), canonical
"/architects/:id". (Final strings confirmed against prototype `<title>`/meta before build.)

---

### Build notes (React)
- Page shell: `src/pages/ArchitectDetail/index.tsx` + `useArchitectDetail.ts` +
  `ArchitectDetail.module.css`; composes Hero (portrait carousel), Tabs (Overview/Profile/Projects/
  Reviews/Awards/Contact), and the ProjectLightbox.
- The prototype builds the whole profile via a single `renderDetail()` template-string and reads
  `ib_saved_architects` / `ib_reports` from `localStorage` directly — the port renders from typed props
  and routes saves/reports/enquiries through the service layer (DataSource), never raw storage.
- Connect is the shared overlay — call `IBConnect.open({ intent: 'project', sellerName, itemName })`; do
  not re-implement an inline modal.
- Mock/local data flows from `src/content/architects.content.ts` through the services; same calls later hit
  the API unchanged. Verify visually with the headless-screenshot method (portal-conversion memory):
  compare `/architects/:id` against `file:///…/pages/architect-detail.html`. Gate with `tsc -b` +
  `vite build`.
