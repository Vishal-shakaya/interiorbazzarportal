# TAB: Membership — Buyer Dashboard

```
PARENT: README.md  ·  VIEW id: membership  ·  GROUP: account  ·  PROTOTYPE: pages/dashboard-buyer.html
```

> Links: parent overview = [README.md](README.md) · pages index = [../README.md](../README.md) · modules-features-flow = [../../modules-features-flow.md](../../modules-features-flow.md) · style = [../../style.md](../../style.md) · copywriting = [../../copywriting.md](../../copywriting.md) · environment seam = [../../../../docs/environment-and-backend.md](../../../../docs/environment-and-backend.md) · integration = [../../../../docs/integration.md](../../../../docs/integration.md) · prototype = [../../../Prototype/ib_prototype_7.2.1/pages/dashboard-buyer.html](../../../Prototype/ib_prototype_7.2.1/pages/dashboard-buyer.html)

## 1. Page-tab

The **Membership** tab is the buyer's **buyer→seller upgrade pitch** — not a billing screen for the buyer. For a logged-in buyer it is a sell page: four plan categories (**Automation / Business / Shop / Architecture**), each selling an *outcome* (not a feature list), framed by the H1 *"A system that attracts, qualifies, and helps you convert buyers — exclusively for you."* It is the one place in the buyer dashboard that pivots the journey from "buyer who enquires" to "seller who receives enquiries".

- **Nav group:** **Profile & settings** (`group:'account'`) — the second nav group, below **My account**.
- **Nav label:** **Membership** (verbatim), rendered as a `<button class="dn-item">` calling `goSection('membership')`.
- **Icon:** `ti-rosette`.
- **Chip / count:** none (no badge on this nav item).
- **Default view?** No. The default working view is **My connections** (`connections`); `dashState.section` baseline is `'saved'`. Membership only renders when selected.
- **How it's reached:** the dashboard nav button, **or** the topbar avatar menu (which jumps to profile / membership / settings). React route: **`?tab=membership`** via `setSearchParams({tab:'membership'}, {replace:true})`. Deep-link sub-route: the four category anchors (`scrollToCategory(catId)` scrolls to `#mbr-<catId>` — `mbr-automation` / `mbr-business` / `mbr-shop` / `mbr-architect`); in React these map to an in-page hash anchor, not a separate `?tab`.
- **Who sees it:** every logged-in buyer (auth-gated page; logged-out → `auth.html`, sellers → `dashboard-seller.html`). The same `renderMembership()` also serves a **seller** (branch on `u.isSeller`) but in the buyer dashboard the actor is always a buyer, so the buyer branch always renders here.

## 2. Module

**Buyer side: universal / account.** This tab is part of the buyer's **account** nav group and is **not plan-gated for the buyer** — there is no buyer subscription and no entitlement read. It is a *marketing surface that sells seller plans*. The buyer has nothing locked; the entire tab is the upsell.

The plan families it advertises (the seller-side modules) are: **Automation**, **Business**, **Shop**, **Architecture** — each `priceFrom` **₹79,999** **per year**. These map to the seller entitlement plan families; on the buyer side they are read from a **plan catalogue / `EntitlementsService`** purely to render the pitch (titles, price-from, taglines), never to gate the buyer's own UI. No `IBEntitlements.of/.limit/.atCap/.meters` reads and no `IB_SECTION_MODULE` / `ib_sectionAllowed` gate apply on the buyer dashboard — those are seller-dashboard concerns (`renderMembership()`'s seller branch shows "Your membership", current plan, and **Billing history**; the buyer branch never does).

## 3. Features

Verbatim sub-areas of the buyer's `renderMembership()`:

- **Hero header** — centered breadcrumb + H1 (`mbr-hero-head mbr-hero-head-centered`).
- **Poster strip** — four dark **plan-category picker cards** (`mbr-picker-strip`): **Automate / Business / Shop / Architect**.
- **Bottom CTA** — *"Register your business"* black button (`mbr-bottom-cta`).
- **Register your business** modal (`openRegisterBusiness()`).
- **Talk to founder first** / **Founder support** (founder contact thread, `contactFounder(catId)`) — copy present in the category data and trust strip.
- **Trust strip** differentiators: **Never shared · Verified buyers only · Founder support**.

## 4. Functionality

### Hero header
- **Breadcrumb:** `<i ti-layout-dashboard></i> Dashboard › Membership` (`dm-breadcrumb`).
- **H1 (buyer):** *"A system that attracts, qualifies, and helps you convert buyers — exclusively for you."* (`dm-title mbr-hero-title`). The seller branch instead reads *"Your membership"* + a sub *"You are on the **{sellerPlan}** plan…"* and a **Billing history** action — **not shown to buyers**.
- **Data:** reads `dashState.user` (auth state) only — to test `u.isSeller`. No writes.

### Poster strip — plan-category picker cards
Four cards, one per category. Each card is an `<a class="mbr-picker mbr-picker-<color>">` whose click calls **`scrollToCategory('<id>')`** (smooth-scrolls to the category's detail anchor and pulses it). Verbatim per-card data:

| id | Picker title | Picker tag (verbatim) | Value pill | Color | Card CTA |
|----|--------------|------------------------|-----------|-------|----------|
| `automation` | **Automate** | "Attract · Qualify · Convert · The IB plan" | **5x signal** (`ti-bolt`) | green | "See plans" |
| `business` | **Business** | "Brand that sells before you speak · Business plan" | **4.8 rated** (`ti-star-filled`) | amber | "See plans" |
| `shop` | **Shop** | "Walk-ins, not just clicks · Shop plan" | **+47% walk-ins** (`ti-trending-up`) | blue | "See plans" |
| `architect` | **Architect** | "A wall between you and noise · Architect plan" | **0 spam** (`ti-shield-check`) | purple | "See plans" |

Each card carries the category's outcome copy (used in the detail section it scrolls to): `headline`, `subhead`, `pain` (the named enemy), `metric` + `metricLabel` (the anchor stat — **1 in 5** / **4.8★** / **+47%** / **0**), three `values` blocks (qualification before contact, exclusive routing, ROI; etc.), `priceFrom` **₹79,999** `priceCadence` **per year**, a `notFor` counter-trust line (e.g. *"Not for businesses that want raw, unfiltered enquiry volume."*), primary `cta` (**"See Automation plans" / "See Business plans" / "See Shop plans" / "See Architect plans"**) and `ctaSecondary` **"Talk to founder first"**.

- **Card footer CTA** label: **"See plans"** (`mbr-picker-cta`) with a `ti-arrow-down-right`.
- **Behaviour:** picker click does **not** leave the page — it scrolls to the matching detail card. The detail card's primary CTA (`cta`, e.g. **"See Automation plans"**) routes to plans-checkout via **`goToPlanCategory(catId)`** → `plans-checkout.html#<catId>` (in React: navigate to the plans/checkout route filtered by category). The secondary **"Talk to founder first"** → `contactFounder(catId)` → success toast *"Founder will reach out within 24 hours about {Category} plans"*.
- **Data:** category catalogue (titles / price-from / taglines) comes from the **plan catalogue / `EntitlementsService`** (read-only); the buyer reads, never writes.

### Bottom CTA — Register your business
- **Button:** **"Register your business"** (`mbr-bottom-cta-btn`, `ti-rocket`) → **`openRegisterBusiness()`**.
- **Sub-copy (verbatim):** *"Free to register · Verified buyers routed exclusively to you · No setup fee"*.

### Register your business modal
- **Title:** **"Register your business"** (`ti-rocket`). Intro: *"Tell us a bit about your business. The founding team will reach out within 24 hours to walk you through verification and plan selection."*
- **Fields:** **Business name** * (`e.g. Kajaria Ceramics, Studio Verma`), **Owner name** * (`Your full name`), **Phone** * (`+91 9xxxxxxxxx`), **City** (`e.g. New Delhi`), **Which category fits your business?** * (select: *Select a category…* / Automation — the IB qualification system / Business — designers, studios, modular kitchens / Shop — showrooms, tile, sanitary, lighting, retail / Architect — practising architects & studios / I'm not sure yet), **Anything else we should know?** (textarea `Tell us about your current setup, what you sell, where you're based...`).
- **Footer:** **Cancel** · **Send registration** (`ti-rocket`).
- **Validation + submit** (`submitRegisterBusiness()`): missing name → toast *"Please enter your business name"*; missing owner → *"Please enter your name"*; missing phone → *"Please enter your phone number"*; no category → *"Please pick a category"* (all `warning`). On success → close modal + toast *"Registration received — the founding team will call you within 24 hours"* (`success`).
- **Data/write:** the lead should persist through a **service → DataSource** (seller-registration / onboarding lead), **never** raw `localStorage`/`fetch`; the prototype only toasts.

### Trust strip
Three differentiators (read-only copy, no controls): **Never shared** (*"Each qualified enquiry routes to exactly one seller — yours. Not blasted to 5 competitors like Justdial or IndiaMART."*) · **Verified buyers only** (*"Every contact is phone-verified and intent-scored before reaching you. No bots, no agents, no school projects."*) · **Founder support** (*"Direct line to the founding team for setup, escalations, and renewals. Not a ticket queue — a phone call."*).

## 5. Working flow

**Buyer reads the pitch → registers as a seller (cross-into the seller world).**

1. **Entry:** buyer opens the dashboard nav **Membership** (or topbar avatar menu) → `?tab=membership` → `renderMembership()` (buyer branch). Sees the H1 pitch + four poster cards.
2. **Browse outcomes:** buyer taps a poster card (e.g. **Automate**) → `scrollToCategory('automation')` scrolls to the **Automation** detail card and pulses it; reads headline / pain / metric (**1 in 5**) / three value blocks / price-from **₹79,999 per year** / `notFor`.
3. **Two forward paths:**
   - **See {Category} plans** → `goToPlanCategory()` → **plans-checkout** route filtered by category (the start of seller subscription checkout).
   - **Talk to founder first** → `contactFounder()` → toast *"Founder will reach out within 24 hours about {Category} plans"* (a founder-contact lead).
4. **Or register directly:** buyer clicks **"Register your business"** → modal → fills business name / owner / phone / (city) / category → **Send registration** → validation → success toast *"Registration received — the founding team will call you within 24 hours"*.
5. **Exit:** buyer returns to any other view via nav (no dead-end). After they become a seller, the **same `renderMembership()`** serves the **seller branch** (*"Your membership"* + current plan + **Billing history**) inside the seller dashboard — so this tab is the literal hinge from buyer to seller.

**Connections to other tabs / the shared spine:** unlike the buyer's other tabs, Membership does **not** read the `enquiries`/`saved`/`recently-viewed` spine — it is forward-facing. Its conceptual link is to the **seller dashboard**: the categories it sells are the seller plan families read via `EntitlementsService`, and a completed registration / checkout converts the account so the seller-side **Enquiries / Membership / billing** surfaces light up. The "exclusive routing / phone-verified" promises mirror the buyer's own **My connections** workspace (enquiry → pipeline → quotation), reframed from the seller's receiving side.

## 6. Data · States · A11y · Copy

- **Data:** `dashState.user` (auth state, for `isSeller`); **`EntitlementsService` / plan catalogue** (read-only, category titles + price-from + taglines, seller plan families); register-lead **write → DataSource** via an onboarding/registration service. No buyer entitlement gate; no `enquiries`/`saved` reads. All reads/writes go through services → DataSource — never raw `localStorage`/`fetch`.
- **States:**
  - **Loading:** skeleton the poster strip (four card placeholders) — not a bare spinner.
  - **Empty:** not applicable — this is a static pitch page; it always renders all four categories. (No "no items" state.)
  - **Error:** if the plan catalogue read fails, degrade to a quiet inline retry while keeping nav/chrome usable; never block the page.
  - **Success:** registration sent → toast *"Registration received — the founding team will call you within 24 hours"*; founder contact → toast *"Founder will reach out within 24 hours about {Category} plans"*; both `'success'`, modal closes/re-renders.
- **A11y:** dashboard `header` + `<aside class="dash-nav">` (nav, **Membership** carries `aria-current` when active) + `<main>`; exactly **one H1** = the `.dm-title` hero. Poster cards are real links/buttons with accessible names (title + tag); the modal is `role="dialog"` + `aria-modal`, focus-trapped, Esc + backdrop close, focus returns to the **Register your business** trigger; required fields use `aria-required` and label the `*`; decorative `ti` icons `aria-hidden`; value-pill stats convey meaning by **icon + text**, not colour alone.
- **Copy (verbatim):** H1 *"A system that attracts, qualifies, and helps you convert buyers — exclusively for you."* · breadcrumb *"Dashboard › Membership"* · poster titles **Automate / Business / Shop / Architect** · card CTA **"See plans"** · detail CTAs **"See Automation plans" / "See Business plans" / "See Shop plans" / "See Architect plans"** · **"Talk to founder first"** · bottom CTA **"Register your business"** + sub *"Free to register · Verified buyers routed exclusively to you · No setup fee"* · trust strip **Never shared / Verified buyers only / Founder support** · register toasts as above. Brand lowercase-b **"Interior bazzar"**; British **"enquiry"**; CTAs Title Case (no ALL-CAPS, no "!").

---

**Build notes (React):** `components/BuyerDashboard/Membership/` (poster strip + category detail cards + `RegisterBusinessModal`), rendered by the dashboard `<ViewSwitch>` on `?tab=membership`. Services: **`EntitlementsService`** / plan catalogue (read seller plan families, price-from, taglines) and an **onboarding/registration service** for the "Register your business" lead — both via DataSource, never raw `localStorage`/`fetch`. Reads `dashState.user` from the auth service for the buyer/seller branch.
