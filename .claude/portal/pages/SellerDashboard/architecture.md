# TAB: Architecture — Seller Dashboard

```
PARENT: README.md  ·  VIEW id: architecture  ·  GROUP: business (ASSETS — "My business")  ·  PROTOTYPE: pages/dashboard-seller.html
```

> Cross-refs: parent overview [README.md](README.md) · pages index [../README.md](../README.md) ·
> [../../modules-features-flow.md](../../modules-features-flow.md) · [../../style.md](../../style.md) ·
> [../../copywriting.md](../../copywriting.md) · [environment seam](../../../Environment-Management-backend.md) ·
> [integration](../../../Integration.md) · prototype `../../../Prototype/ib_prototype_7.2.1/pages/dashboard-seller.html`.

---

## 1. Page-tab

**What it IS.** Architecture is the seller's **architect profile** surface — a personal page on Interior
bazzar "*where buyers can find your work, send qualified enquiries, and book a consultation. Designed
for individual architects — not businesses or showrooms.*" It is a **single profile** (one per seller,
no list), edited through a tabbed wizard (`renderArchitectureDetailPage`) with an inline setup
checklist + subscription rail.

**Where it sits in the nav.** Group **`business`** ("My business" / ASSETS); label **"Architecture"**;
sidebar dot/icon `ti-pencil-bolt` (the empty-state hero icon). **One profile → no chip/count** (unlike
Business/Shop which carry totals). It is **not** the default view (default is `overview`).

**How it's reached.** In the prototype the active section is hash-routed (`#architecture`); in React,
mirror as **`?tab=architecture`** via `useSearchParams`, keeping the `#section/sub` nested form for
deep links (the active tab strip — identity/practice/portfolio/personality/contact/analytics — maps to
the sub-route). `arch_setDetailTab(id)` switches tabs; `renderArchitectureSection()` dispatches the body.

**Who sees it (visibility gating).** `ib_sectionAllowed('architecture')` → `ib_hasModule('architect')`
(`IB_SECTION_MODULE.architecture = 'architect'`). The nav item only renders when the seller holds the
**Architect** module. A seller without it never sees the tab in nav — but the standard gating rule still
applies: a paid capability is never silently hidden, it is surfaced from the **Plans** grid (the module
activation surface) and the seller dashboard's upsell standard, not buried.

## 2. Module

**Module.** **Architect** (`family: 'architect'`, entitlement keys `arch-*`). Three tiers in
[`ib-entitlements.js`](../../../Prototype/ib_prototype_7.2.1/assets/ib-entitlements.js):

| Plan key | label | `team` | `awards` | `insights` | reach | routing | networkTier | badge |
|----------|-------|:---:|:---:|:---:|-------|---------|-------------|-------|
| `arch-verified` | Architect Verified | false | false | false | local | shared | limited | Verified Architect |
| `arch-plus` | Architect Plus | true | true | false | city | shared | premium | Trusted Architect |
| `arch-pro` | Architect Pro | true | true | **true** | state | priority | full | Premium Architect |

`projects` and `catalogues` are `Infinity` (→ "Unlimited" via `fmtLimit`) on **all** architect tiers —
portfolio size is **not** plan-capped (the prototype caps come from constants `ARCH_MAX_PROJECTS` /
`ARCH_MAX_COVER_IMAGES`, applied uniformly, not from a tier number).

**Plan-gating (visibility + depth).** Read **every** gate from `ib-entitlements.js` — never hardcode:

- **Visibility:** `ib_sectionAllowed('architecture')` → `ib_hasModule('architect')`; the gate map is
  `IB_SECTION_MODULE.architecture = 'architect'`; default tier on activation is
  `ib_defaultTierFor('architect') = 'arch-verified'`.
- **Depth reads:** `IBEntitlements.of(planKey)` → `.team` / `.awards` / `.insights` /
  `.networkTier` / `.routing` / `.reach`. Per the README this tab's depth grades: **`team`/`awards`
  off on Verified, on Plus+** (`arch-plus`/`arch-pro`); **`insights` only on Pro** (`arch-pro` →
  `.insights === true`, which is also what `ent_analyticsDepth` reads to grade analytics to
  `'professional'`).
- **Limit/cap reads:** `IBEntitlements.limit(plan, feat)` / `.atCap(plan, feat, used)` for any tiered
  number; `IBEntitlements.meters(plan, usage)` feeds the **Plans** "My Plan" panel (Projects meter etc.).
- Architecture's own **subscription** is per-profile (`profile.subscriptionPlanId` /
  `subscriptionExpiresAt`, `IB_ARCH_SUBSCRIPTION_PLANS`) and surfaced in the right rail — "*Free to start
  · Subscribe only when you're ready to go live · Cancel anytime*". Expiry auto-pauses a live profile
  (`arch_runAutoPauseLoop` → status `paused`, red pill + "Renew now").

## 3. Features

The discrete sub-areas of this tab (verbatim names):

- **Empty state** — "**Build your architect profile.**" first-run card with CTA "**Create my architect profile**".
- **Editor shell** — progress ring (`{n}% setup complete`), title + status pill, **Preview** button,
  "Saved {ago}" pill, three-dot header menu.
- **Tab strip** (the wizard sections): **Identity · Practice · Portfolio · Personality · Contact & forms · Analytics** (Analytics only in edit mode).
- **Right action rail** — **Setup checklist**, **Your profile URL** (share/copy/view-as-live), **Subscription** panel (auto-renew, extend/renew).
- **Footer actions** — state-aware (Save as draft / **Go live** / Pause / Resume / Move to Draft).
- **Project editor modal** (`arch_renderProjectEditorModal`) and **Preview modal** (`arch_renderPreviewModal`).

## 4. Functionality

All reads/writes go through **`ArchitectService`** → DataSource (never raw `localStorage`/`fetch`);
spine group **seller assets** (the prototype's `window.architects` / `arch_getProfile()`). Entitlement
gates go through **`EntitlementService`** wrapping `ib-entitlements.js`.

### Empty state — `renderArchitectureEmptyState()`
Shown when there is no profile and no in-progress draft. Eyebrow "**For architects & designers**", H1
"**Build your architect profile.**", three value points (verbatim):

| Point | Copy |
|-------|------|
| Qualified enquiries only | "*Buyers screened by genuineness and urgency before they reach you — no time-wasters.*" |
| A shareable profile URL | "*interiorbazzar.com/arch/your-name — put it on your business card, Instagram bio, anywhere.*" |
| A verified badge | "*COA-registered, education-credentialed, and award-decorated architects get an IB Verified badge.*" |

CTA "**Create my architect profile**" (`arch_createProfile()`); fineprint "*Free to start · Subscribe
only when you're ready to go live · Cancel anytime*".

### Editor shell — `renderArchitectureDetailPage()`
Writes through `ArchitectService.save()` on a live draft; **autosaves every 8 seconds**
(`arch_startAutoSave`, pill "*Auto-saves every 8 seconds*"). Header carries a **progress ring**
(`arch_setupPercent` over 6 content pillars, ex-subscription) data-tip "*{n}% setup complete*"; a status
pill (`arch_statusMeta`: draft/active/paused/archived); **Preview** (`arch_openPreview`, data-tip "*See
what buyers will see*"); "Saved {ago}" / "Not yet saved"; three-dot menu (`arch_renderHeaderMenu`).
Tab strip carries a **missing-pillar dot** per tab (`arch_missingPillars` → data-tip "*{n} pending
item(s)*").

### Tabs (verbatim section titles + key controls)

| Tab | Key fields / controls (verbatim) | Writes / behaviour |
|-----|----------------------------------|--------------------|
| **Identity** (`ti-id`) | **Basics**: Your name `*` ("e.g. Ar. Priya Sharma"), Professional title `*`, Studio or firm name (· optional), Type of practice `*` (`IB_ARCH_TYPES` cards). **Profile URL & headshot**: slug `interiorbazzar.com/arch/…` (auto-suggested, reserved-word guarded), headshot (5 MB, 600×600). **Credentials**: COA registration number, Education & affiliations chips, Years of experience, Awards & recognitions textarea. | `arch_updateField` (focus-safe, no re-render); `arch_toggleArrayField` (re-renders); `arch_setHeadshot` → toast "Headshot updated". Slug sanitised live (`arch_sanitizeSlug`); reserved collision → "*This URL is reserved. Try {slug}-design or {slug}-studio.*" |
| **Practice** (`ti-briefcase`) | **Specialisation & style**: "What do you specialise in?" `*` (1–3), "What design styles do you work in?" `*` (2–4). **Practice capacity**: Team size cards, Projects completed, States you've worked in, Service radius. **Project terms**: lead time, min project size. | Chip counts ("*{n} selected · pick 1–3*"); states add/remove (`arch_addStateServed`); pillar = ≥1 specialisation AND ≥1 style. |
| **Portfolio** (`ti-photo-square-rounded`) | **Cover carousel** ("· {n} of {max}", "Add cover image", min `ARCH_MIN_COVERS_PUBLISH` to go live) + **Projects** grid ("· {n} of {max}", "Add project", pin up to 3 featured, empty: "**No projects yet**" + "Add my first project"). | Cover/project caps from constants `ARCH_MAX_COVER_IMAGES` / `ARCH_MAX_PROJECTS` (uniform, not tier — `projects: Infinity` on every plan). Inline warn "*Add at least {n} more cover image(s) to go live.*" Project editor modal. |
| **Personality** (`ti-message-circle-heart`) | Intro "**Make your profile feel human**". **Why I do what I do** `*` (USP, ≥`ARCH_MIN_WHYI_CHARS`), magical words, philosophy. | Char-count tiers (short/ok/long/overflow); pillar = Why-I min length. |
| **Contact & forms** (`ti-mail-fast`) | "**How can buyers reach you?**" — "*At least one of phone or WhatsApp is required to publish.*" Routing mode (phone/whatsapp/both), response time ("4hr"), "Use business X" copy shortcuts from the linked business profile. | Soft warn if a routed channel is empty. Enquiries land in the unified inbox (`sourceType:'architect'`). |
| **Analytics** (`ti-chart-bar`, edit-only) | Locked until live: "**Analytics unlock when you go live**" with `—` preview cards (Profile views · Qualified enquiries · Projects booked · Avg response time). Live: KPI strip + "Recent enquiries from your profile" + tip. | Gated on `profile.publishedAt`. Plan depth: README says **`insights` only on Pro** — `IBEntitlements.of(plan).insights === true` (`arch-pro`) unlocks the professional analytics depth (`ent_analyticsDepth`). |

### Action rail — `arch_renderActionRail()`
- **Setup checklist** — `arch_pillarStatus` pillars ("{ok}/{n}"); each row deep-links its tab; the
  **subscription** pillar opens checkout (`arch_showCheckout({action:'publish-existing'})`) or renew.
- **Your profile URL** — `interiorbazzar.com/arch/{slug}`; "**Copy link**" (`arch_copyShareLink`) and,
  when active, "**View as live**" (`arch_openPreview`, data-tip "*See your live buyer profile*").
- **Subscription** — plan label + price, Renews/Expired date, **Auto-renew** toggle (data-tip "*…switch
  off to be billed only once*"), "**Extend subscription**" / "**Renew now**" (urgent when expired).

### Footer actions — `arch_renderFooterActions()` (state-aware)
| Status | Buttons |
|--------|---------|
| draft | "Save as draft" + "**Go live**" — disabled until `arch_setupPercent ≥ 100`, gated tooltip "*Finish the setup checklist on the right to unlock this*" |
| active | "Pause profile" + "Save changes" |
| paused | "Save changes" + "Resume profile" |
| archived | "Move to Draft" |

**Plan-depth gating UI (signal, never hide):** on **Verified** the **team** and **awards** capabilities
(`.team`/`.awards === false`) must be signalled — disabled control + `ti ti-lock` + `data-tip` upsell
(e.g. "Upgrade to Architect Plus") — not removed; the **Analytics professional depth** on non-Pro reads
`.insights === false` and shows the locked/limited surface, not a blank. Every such limit is read from
`ib-entitlements.js`.

## 5. Working flow

**A — First-time architect → live profile**
1. Seller activates the **Architect** module from **Plans** → `ib_hasModule('architect')` true → nav
   shows **Architecture**. Enter via `?tab=architecture`.
2. No profile yet → **empty state**; "**Create my architect profile**" → `arch_createProfile()` opens
   the editor with a blank draft.
3. Work the tab strip (Identity → Practice → Portfolio → Personality → Contact & forms). Autosave every
   8s; the right-rail **Setup checklist** tracks the 6 content pillars; tab dots show what's pending.
4. At **100% setup**, footer "**Go live**" unlocks → `arch_save('active')`; the **subscription** pillar
   gates payment (`arch_showCheckout`). Status pill flips to active; share URL becomes copy/"View as live".
5. Exit: profile is live at `interiorbazzar.com/arch/{slug}` — discoverable by buyers.

**B — Connection to other tabs + shared spine**
- A buyer enquiry from the architect profile lands in **Enquiries** (`connections`) tagged
  `sourceType:'architect'` (`EnquiryService` / `enquiries` spine `ib:sharedenquiry`) — the same inbox
  used across the console.
- That enquiry flows **enquiry → Pipeline → Quotation** like any other seller deal (Architecture is the
  *source*; Pipeline/Quotations are the *workflow*) — those tabs need any selling module, satisfied by
  Architect.
- **Analytics** tab mirrors the inbox: it counts architect-sourced enquiries live from `connections`
  and links rows back to **Enquiries** ("See all {n} enquiries →").
- **Plans** "My Plan" panel reads the architect usage **meter** (Projects) via
  `IBEntitlements.meters`; the **subscription** rail here and **Billing** (`membership`) stay in step.
- Going live writes a public listing surfaced to buyers immediately (local-first → API unchanged later).

## 6. Data · States · A11y · Copy

**Data.** `ArchitectService` (profile CRUD, autosave, publish/pause/renew) + `EntitlementService`
(`IBEntitlements.of/limit/atCap/meters`) → DataSource. Spine groups: **seller assets** (profile),
**enquiries** (`ib:sharedenquiry`, architect-sourced), **authoritative entitlement source**
(`ib-entitlements.js` — read, never hardcode). Reads from the linked **business profile** for
contact-copy shortcuts.

**States.**
- *Loading* — section skeleton (standard skeleton, not a bare spinner); nav renders immediately.
- *Empty* — "**Build your architect profile.**" card + CTA "Create my architect profile" (always a next
  action); per-tab empties: Portfolio "**No projects yet**" + "Add my first project"; Analytics
  pre-live "**Analytics unlock when you go live**".
- *Locked / gated (seller)* — module not held → tab hidden from nav, surfaced via Plans (never silently
  hidden); **team/awards** off-tier → disabled control + lock + upsell tooltip; **Analytics
  professional** off-Pro → locked surface; **Go live** disabled until setup 100% (gated tooltip);
  subscription expired → red pill + "Renew now". All limits read from `ib-entitlements.js`.
- *Error* — failed section degrades to inline retry; rest of console still renders.
- *Success* — toasts: "Headshot updated", save/publish/renew success; module activate →
  `showToast('Architecture activated')`.

**A11y.** Landmarks `header`/`aside`/`main` (`#dashMain`); **one H1** per view (empty-state
"Build your architect profile." / editor `arch-edit-title`); active `.dn-item` `aria-current`; tabs
real `<button>`s. **Locked state exposed to AT, not colour-only**: gated controls carry `aria-disabled`
+ the `data-tip` text in the DOM; status pill pairs an icon (dot) **and** text; missing-pillar dots and
the "Go live" gate carry their tooltip text. Headshot/project modals focus-trapped, Esc/backdrop close;
form fields `<label for>`-linked. Status conveyed by icon + text, never colour alone.

**Copy (verbatim).** Empty H1 "**Build your architect profile.**"; CTA "**Create my architect
profile**"; fineprint "*Free to start · Subscribe only when you're ready to go live · Cancel anytime*";
tab labels "Identity / Practice / Portfolio / Personality / Contact & forms / Analytics"; setup
checklist "Setup checklist"; "**Go live**" with gate tooltip "*Finish the setup checklist on the right
to unlock this*"; share "Copy link" / "View as live"; subscription "Extend subscription" / "Renew
now"; Analytics locked "*Analytics unlock when you go live*". British "enquiry"; lowercase-b "Interior
bazzar"; CTAs Title Case (no caps, no "!").

---

Build notes (React): `components/SellerDashboard/Architecture/` (editor shell + Identity/Practice/
Portfolio/Personality/Contact/Analytics tab components, action-rail, project-editor + preview modals);
services — **`ArchitectService`** (profile/projects/publish/subscription → DataSource) and
**`EntitlementService`** wrapping `ib-entitlements.js` (`of`/`limit`/`atCap`/`meters` for the
team/awards/insights/networkTier gates — no hardcoded plan numbers); enquiries via `EnquiryService`.
