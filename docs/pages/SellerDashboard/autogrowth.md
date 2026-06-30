# TAB: Autogrowth — Seller Dashboard

```
PARENT: README.md  ·  VIEW id: autogrowth  ·  GROUP: main (WORK — "Inbox & pipeline")  ·  PROTOTYPE: pages/dashboard-seller.html
```

> Links: parent overview = [README.md](README.md) · pages index = [../README.md](../README.md) ·
> modules/features/flow = [../../modules-features-flow.md](../../modules-features-flow.md) ·
> style = [../../style.md](../../style.md) · copywriting = [../../copywriting.md](../../copywriting.md) ·
> environment seam = [../../../../docs/environment-and-backend.md](../../../../docs/environment-and-backend.md) ·
> integration = [../../../../docs/integration.md](../../../../docs/integration.md) ·
> prototype = [../../../Prototype/ib_prototype_7.2.1/pages/dashboard-seller.html](../../../Prototype/ib_prototype_7.2.1/pages/dashboard-seller.html)

---

## 1. Page-tab

**Autogrowth** is the seller's **acquisition engine**, framed like an ads dashboard: it shows the
growth funnel — reach, enquiries, the qualification/screening funnel — and lets the seller tune
*who* and *what* they want enquiries for (states, segments, search terms). The header sub-title is
verbatim: *"Your acquisition engine — targeting, qualification &amp; performance in one place."*

- **Where it sits:** nav group **`main`** (labelled **"Inbox & pipeline"**, the WORK group), 4th item.
  Nav descriptor: `{id:'autogrowth', label:'Autogrowth', icon:'ti-sparkles', group:'main'}` — so the
  nav label is **"Autogrowth"** with the `ti-sparkles` icon. **No chip/count** (no `ib_getSidebarChip`
  entry; no static `s.chip`).
- **Default view?** No. Within the tab, the default **sub-tab is `analytics`** (`ag_renderInner`:
  `var sub = (window.dashState.agTab) || 'analytics'`), not `setup`.
- **How it's reached:** prototype routes by hash → React mirrors as **`?tab=autogrowth`** (per the page
  brief / `useSearchParams`). The two sub-tabs are in-tab state (`ag_setTab('setup'|'analytics')` →
  `dashState.agTab`); keep a nested deep-link form (e.g. `#autogrowth/setup`) if addressable sub-routing
  is wanted.
- **Who sees it (visibility gating):** module-gated by `ib_sectionAllowed('autogrowth')` → the
  **`autogrowth`** module. Per `IB_SECTION_MODULE`, the item only appears in nav when that module is
  active. When the seller is **not** on an Autogrowth plan but reaches the view, it renders a
  full-section **upsell card** (`ag_renderUpsell`) rather than the engine — a paid capability is signalled,
  never silently blank.

## 2. Module

Belongs to the **`autogrowth`** module (one of the independent seller subscriptions —
`IB_SELLING_MODULES = ['autogrowth','business','shop','architect']`). Plan family **`autogrowth`**, tiers
**Autogrowth Launch → Scale → Dominance** (`ag-launch · ag-scale · ag-dominance`).

**Visibility gate:** `ib_sectionAllowed('autogrowth')` → `IB_SECTION_MODULE.autogrowth === 'autogrowth'`.
The nav item is hidden unless that module is held; the view itself splits on **`ag_isAutogrowth()`**,
which is `IBEntitlements.of(user.sellerPlan).family === 'autogrowth'`. False → `ag_renderUpsell()`.

**Entitlement reads (authoritative — never hardcode a plan number).** All caps come from
`ag_caps()` reading `IBEntitlements.of(plan)`:

| Read | Source | Launch | Scale | Dominance |
|------|--------|--------|-------|-----------|
| `ent.states` (`states` cap) | `of(plan).states` | 2 | 5 | ∞ (Unlimited → "Pan-India") |
| `ent.segments` (`segments` cap) | `of(plan).segments` | 2 | 3 | ∞ (all segments) |
| `ent.rankings` (search-terms cap) | `of(plan).rankings` | 3 | 6 | 10 |
| `ent.qualification` (`depth`) | `of(plan).qualification` | `3-step` | `4-step` | `4-step` |
| `ent.exclusivity` (`exclusive`) | `of(plan).exclusivity` | false (priority) | true | true |

`ag_planLabel()` = `of(plan).label` ("Autogrowth Launch/Scale/Dominance"). `∞` renders via `fmtLimit`
→ "Unlimited" (surfaced here as "Pan-India" / "All segments"). **EntitlementService** wraps
`ib-entitlements.js` (`of`/`limit`/`atCap`/`meters`); the React tab calls it — no component bakes in
"3", "6" or "10".

> How deep the feature goes: presence/business sellers get the **upsell teaser only**. On Autogrowth,
> depth grades by tier — caps above, plus the **4-step agent-verification** screen is Scale+ only (gated
> on Launch), and **exclusive routing** is Scale+ (Launch is priority routing).

## 3. Features

Verbatim sub-areas from the prototype:

- **Sub-tabs:** `Setup` and `Analytics` (`ag-subtab`).
- Header badges: **"How priority works"** (→ `ad-enquiry-flow.html`) and the **plan badge** → Plans.
- **Setup** (`ag_renderSetup`):
  - **Target states**
  - **Project segments**
  - **Search terms you rank for**
  - **Qualification depth** (read-only — plan-set)
  - **Your exclusivity** (read-only — plan-set)
  - status strip: *"`<plan>` · active"* + coverage summary + *"changes save automatically"*
- **Analytics** (`ag_renderAnalytics`):
  - **"What changes when Autogrowth is on"** (animated before → engine → after flow)
  - **"Reach &amp; enquiries · this month"** (Reach / Enquiries / Qualified stat row)
  - **"Processing — how {n} enquiries get screened"** (live funnel) + **"What you're getting"** (output list)
  - **"Your results · this period"** (Exclusive enquiries / Project value won / Win rate / Your avg response)
- **Upsell** (`ag_renderUpsell`, when not on Autogrowth): **"You're not on Autogrowth yet"**.

## 4. Functionality

### Setup — Target states
Pick the states Autogrowth finds buyers in. Sub: *"Choose the states you want Autogrowth to find buyers
in."* Selected states show as removable `ag-pchip` chips; add via an **"+ Add a state…"** dropdown
(`ag_pickState`); remove via `ag_removeState`. Counter shows **"`{n}` of `{cap}`"**. Pool =
`AG_STATE_POOL` (Delhi … Uttarakhand).

- **Cap-gated** at `c.states` (`ent.states`). On Dominance (`states===Infinity`) the whole block becomes
  *"Pan-India — every state is included with your plan"* (counter "Pan-India"); no picker.
- **At cap** (`cfg.states.length >= cap`): dropdown replaced by lock row — *"You've added all `{cap}`
  states."* + **"Upgrade to add more"** (→ Plans). Trying to add over cap fires a warning toast:
  *"Your `{plan}` plan covers `{cap}` states — upgrade to add more."*

### Setup — Project segments
*"Choose the kinds of projects you want enquiries for."* Same chip+dropdown pattern (`ag_pickSegment` /
`ag_removeSegment`), pool = `AG_SEGMENT_POOL` (Modular kitchen … Furniture). Counter "`{n}` of `{cap}`".

- Cap = `c.segments` (`ent.segments`). Unlimited → *"All project segments are included with your plan"*
  (counter "All"). At cap → *"You've added all `{cap}` segments."* + "Upgrade to add more"; over-cap toast
  *"Your `{plan}` plan covers `{cap}` segments — upgrade to add more."*

### Setup — Search terms you rank for
*"The buyer searches that should surface your business."* Free-text input
(`#agTermInput`, placeholder **"Add a search term, e.g. luxury kitchen gurugram"**, `maxlength=48`) +
**"Add"** button (`ag_addTerm`, Enter-to-add via `ag_termKey`). Terms normalise to lowercase, single-spaced;
shown as `ag-pchip term` chips with a `ti-hash`; remove via `ag_removeTerm`. Counter
"`{n}` of `{cap}`" (or "Unlimited"). Empty: *"No search terms yet — add the buyer searches you want to
rank for."*

- Cap = `c.terms` (`ent.rankings`). **At cap** → input replaced by `ag-term-cap` lock row:
  *"You've used all `{n}` terms."* + **"Upgrade to add more"** (→ Plans). Over-cap add fires toast:
  *"You've used all `{n}` search terms — upgrade to add more."* Duplicate add → *"That term is already added."*

### Setup — Qualification depth *(read-only — plan-set)*
Counter is a **lock**: `ti-lock` **"set by your plan"**. Sub: *"How deep we screen every enquiry before
it reaches you."* + (4-step) *"Your plan runs the full agent-verified screen."* / (else) *"Upgrade for
deeper screening."* Three cards, the seller's depth marked `on ✓`:
**"2-step" / "Requirement · Intent"**, **"3-step" / "+ Urgency (AI)"**, **"4-step" / "+ Agent
verification"**. Driven by `ent.qualification` (`d2`/`d3`/`d4`). No write — display only.

### Setup — Your exclusivity *(read-only — plan-set)*
Title **"Your exclusivity"**, lock icon. Heading = *"Exclusive routing · `{plan}`"* if `ent.exclusivity`
else *"Priority routing · `{plan}`"*. Body: *"Qualified enquiries in your segments &amp; states are routed
to you exclusively — never shared with a crowd."* (exclusive) / *"…ahead of standard listings."*
(priority). No write.

**Persistence.** Setup config (`states`/`segments`/`terms`) writes via **AutogrowthService** (spine group
**`autogrowth-config`**) → DataSource. (Prototype seam: `ib_ag_config`; React must NOT touch
localStorage directly.) Every mutation saves immediately and toasts *"Autogrowth settings saved"* — the
status strip reads *"changes save automatically"*.

### Analytics — "What changes when Autogrowth is on"
Animated explanatory flow: raw side (*"The usual way · raw"* — tags "unknown intent", "shared with 4–5",
"goes cold") → engine (*"Autogrowth screens it"*, checks contact / genuine / intent / agent — `agent`
**locked** unless 4-step) → qualified side (*"Qualified · yours"* — "tagged by intent", "exclusive to you",
"ready to call"). Caption: *"Same enquiries by form, WhatsApp or call — now they arrive **screened**."*
Display-only; the `agent` check reflects `ag_qualDepth() === '4-step'`.

### Analytics — "Reach & enquiries · this month"
Note: *"Representative figures for your segments &amp; states — your own numbers build as enquiries route
to you."* Three stats (benchmark badges): **Reach in your space** (*"buyers searching your segments &amp;
states"*) → **Enquiries / queries started** (*"via form, WhatsApp or call · `{n}`% of reach"*) →
**Qualified · routed to you** (*"exclusively yours · `{n}`% of enquiries"*). Representative figures until
the seller's real enquiry data instruments it.

### Analytics — "Processing" + "What you're getting"
Left card **"Processing — how `{n}` enquiries get screened"** with a `live` pill: stacked funnel bars from
the real engine — **Contact verified**, **Genuine**, **Intent & urgency**, and (4-step only) **Agent
verified**; each bar shows note + *"`{n}`% kept · filtered out `{n}`"*. Below: a disclaimer —
*"**A prediction process, not a guarantee.** Autogrowth scores how likely an enquiry is to convert so you
can prioritise — it doesn't promise a sale."*

- **Agent-verification gate (`ag-stage-locked`):** on Launch (3-step) a locked stage renders — **"Agent
  verified"** + lock + **"Upgrade"** chip + a `Confirmed` tag, `data-tip="Add agent verification — upgrade
  to Scale"`, clicking → `goSection('plans')`. Caption: *"A human agent call confirms your hottest
  enquiries — the premium **Confirmed** tier, on Scale &amp; above."*

Right card **"What you're getting"** + **"View all →"** (→ Enquiries / `connections`). Intro: *"The
qualified, exclusive enquiries this engine hands you — tap any to open it."* A tag legend explains the
intent tiers — **Interested** "exploring", **Intent** "planning", **Urgent** "ready now", **Confirmed**
"agent-verified" (or, when not 4-step, **Confirmed** locked → "on Scale ↑"). Then a list of real qualified
enquiries (from **EnquiryService** / `connections`, filtered to non-pending/non-declined, top 4); each
**`ag-out-row`** opens that enquiry (`selectConnection(id)`) → the Enquiries workspace. Empty:
*"Qualified enquiries will appear here as they're routed to you."* Estimated value tip:
*"Estimated project value — never used to qualify or rank enquiries."*

### Analytics — "Your results · this period"
Four outcome cards: **Exclusive enquiries** (*"yours only · never shared"*), **Project value won** (₹26L,
*"across `{n}` projects"*), **Win rate** (*"of qualified enquiries closed"*), **Your avg response**
(*"faster = more wins"*). Derived from EnquiryService + QuotationService outcomes; plan cost (used only for
internal CPQE) reads from `IBEntitlements.resolve(plan)`.

### Upsell (not on Autogrowth)
Full-section card. Illustration `ti-chart-arrows-vertical`; headline **"You're not on Autogrowth yet"**;
sub explains screening + exclusive routing + funnel visibility. Three feats: **"Qualified, not raw"** /
*"Every enquiry screened &amp; tagged by intent"*; **"Exclusive to you"** / *"One enquiry → one business,
never broadcast"*; **"Full visibility"** / *"Reach → qualified → won, in one funnel"*. CTA **"See
Autogrowth plans"** (→ `goSection('plans')`). Note: *"A prediction process to help you prioritise — not a
guarantee. Outcomes are subject to market conditions."*

## 5. Working flow

**A. Tune targeting (Setup loop).**
1. Seller opens `?tab=autogrowth` → lands on **Analytics**; taps **Setup**.
2. Reads the status strip (*"`{plan}` · active"* + coverage). Adds/removes **states**, **segments**,
   **search terms** within plan caps; each change auto-saves (toast *"Autogrowth settings saved"*).
3. Hits a cap → cap row + **"Upgrade to add more"** / warning toast → **Plans** (`goSection('plans')`) →
   checkout. New tier → bigger caps flow straight back into Setup (caps reread live).
4. Qualification depth & exclusivity are read-only — seeing the locked **4-step / Agent verification** is
   itself the upgrade nudge.

**B. Watch the funnel → act on enquiries (Analytics loop, cross-tab spine).**
1. Setup choices (states/segments/terms) define *which* qualified enquiries route here — the shared
   **enquiry spine** screens incoming enquiries against this config.
2. **Analytics** shows reach → enquiries → **qualified, exclusive** count and the screening funnel.
3. **"What you're getting"** lists the qualified enquiries; **tap a row → opens that enquiry in
   Enquiries** (`connections`) → seller **Responds** (the dashboard's primary CTA).
4. From there the spine continues: enquiry → **Pipeline** (`dealStage`) → **Quotations** — and the
   outcome rolls back into Autogrowth's **"Your results"** (won projects, win rate) and Overview KPIs.
   "View all →" jumps straight to Enquiries; the plan badge / cap rows jump to **Plans**;
   "How priority works" opens the ad-enquiry-flow explainer.

## 6. Data · States · A11y · Copy

**Data (services → DataSource; never raw localStorage/fetch).**

| Surface | Service | Spine group |
|---------|---------|-------------|
| Targeting config (states/segments/terms) | `AutogrowthService.getConfig()` / `.save()` | `autogrowth-config` |
| Qualified enquiry list + "View all" + open | `EnquiryService.list()` (filter non-pending/declined) | `enquiries` (`ib:sharedenquiry`) |
| Results (won, win rate, value) | `EnquiryService` + `QuotationService` outcomes | enquiries / quotations |
| Caps, depth, exclusivity, plan label, plan cost | `EntitlementService` → `IBEntitlements.of/limit/atCap/resolve` | `ib-entitlements.js` (authoritative) |

**States.**
- *Loading:* per-card skeletons (standard skeleton); nav + sub-tabs render immediately.
- *Empty:* no qualified enquiries yet → *"Qualified enquiries will appear here as they're routed to you."*;
  no terms → *"No search terms yet — add the buyer searches you want to rank for."* (next action present).
- *Locked / gated (seller):* not on Autogrowth → upsell card (**"See Autogrowth plans"**); at a cap →
  inline lock row + **"Upgrade to add more"** and a warning toast; 4-step stage locked on Launch (lock +
  "Upgrade", tip "Add agent verification — upgrade to Scale"); Qualification depth & exclusivity read-only
  (lock "set by your plan"). Never silently hidden.
- *Error:* a failing card degrades to inline retry; the rest of the tab renders.
- *Success:* config save → toast *"Autogrowth settings saved"*.

**A11y.** Landmarks `header`/`aside`/`main`; one **H1** = `.dm-title` **"Autogrowth"** (upsell view too).
Active nav `.dn-item` is `aria-current`; sub-tabs are real `<button>`s. Locked controls expose
`aria-disabled` + the `data-tip` text in the DOM (not colour-only). Intent tags pair **icon + text** with
colour. Cap toasts via `aria-live="polite"`, focus-managed; dropdowns `<label>`/`<select>` linked; term
input `<label for>`-linked.

**Copy (verbatim).** Sub-title *"Your acquisition engine — targeting, qualification &amp; performance in
one place."* · Headers: "Target states", "Project segments", "Search terms you rank for",
"Qualification depth", "Your exclusivity". · CTAs (Title Case): **"Upgrade to add more"**, **"See
Autogrowth plans"**, **"How priority works"**, **"View all"**, **"Add"**. · Cap toasts:
*"Your {plan} plan covers {cap} states — upgrade to add more."*, *"…{cap} segments — upgrade to add
more."*, *"You've used all {n} search terms — upgrade to add more."* · *"That term is already added."* ·
Disclaimer *"A prediction process, not a guarantee."* · Upsell **"You're not on Autogrowth yet"**.
Brand voice lowercase-b "Interior bazzar"; British "enquiry"; no ALL-CAPS, no "!".

---

**Build notes (React):** `components/SellerDashboard/Autogrowth/` (sub-tabs `AutogrowthSetup` /
`AutogrowthAnalytics`, plus `AutogrowthUpsell`) — uses **`AutogrowthService`** (targeting config),
**`EnquiryService`** + **`QuotationService`** (funnel/results/qualified list), and **`EntitlementService`**
(caps/depth/exclusivity/plan label — every limit read from `ib-entitlements.js`, never hardcoded).
