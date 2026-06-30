# 01 — Modules, Journeys & Accessibility

The core standard. For each **module** we state its **feature → functionality → use case**, place it
on the **buyer or seller journey**, and attach an **accessibility** requirement. Build every page as a
step in one of these journeys.

> All strings, intents, plan numbers and flows below are taken verbatim from the prototype.

---

## Part 1 — The two journeys (build with respect to these)

### 1.1 Buyer journey (non-linear, but gated at Connect)

```
DISCOVER ─▶ EVALUATE ─▶ CONNECT / ENQUIRE ─▶ (login gate) ─▶ TRACK ─▶ MANAGE
 home,       detail       Connect modal          auth.html      buyer dashboard
 listings    pages        (5 intents)                           connections / saved / profile
```

| Stage | Pages | What the buyer does | Key CTAs (verbatim) |
|-------|-------|---------------------|---------------------|
| **Discover** | home, products, services, explore, trending, shops, recently-viewed | Browse, search (with voice), filter, save | "Explore now", "Get catalogue", save (heart), "Browse more products" |
| **Evaluate** | product/service/business/architect detail | Read details, ratings, related items; decide | "Connect", "Get catalogue", save |
| **Connect** | Connect modal (overlay) | Qualify intent in ≤3 steps, OTP-verify phone | "Continue" → "Send enquiry" / "Verify phone" |
| **Track** | buyer dashboard → Connections | See enquiry status, message the seller | "Enquire", "Respond", WhatsApp/phone/email |
| **Manage** | buyer dashboard → Saved / Profile / Membership | Manage saves, profile, upgrade to seller | "Share list", "Export", "Upgrade plan" |

**Gating rule:** discovery and detail are **public**. The **login gate fires when the buyer hits
"Continue" on Connect step 1**; if not logged in → `auth.html` (stores `IB_POST_LOGIN_REDIRECT`) →
back to the modal. Dashboards require auth.

### 1.2 Seller journey (plan-aware throughout)

```
REGISTER ─▶ CHOOSE PLAN ─▶ SET UP ─▶ RECEIVE ENQUIRY ─▶ RESPOND ─▶ CONVERT
 auth        plans-checkout  dashboard   (routed, qualified)  pipeline   quotation
             (4 families)    listings/shop/portfolio
```

| Stage | Where | What the seller does | Key CTAs |
|-------|-------|----------------------|----------|
| **Register** | auth.html | Sign up, pick account type (Designer/Shop/Manufacturer…) | "Sign up", "Continue", "Complete registration" |
| **Choose plan** | plans-checkout.html | Pick a family + tier (see §3) | "Get Verified", "Get Scale", "Get Shop Pro"… |
| **Set up** | seller dashboard → Business/Shop/Architecture | Add products/services/catalogues, shop, portfolio | "Add product", "Create shop", "Add project" |
| **Receive** | seller dashboard → Enquiries | A routed, qualified enquiry arrives (tier A–E) | "Respond", "Accept", "Decline", "Message" |
| **Respond** | seller dashboard → Pipeline | Move deal stages new→quoted→negotiating→won/lost | "Move to next stage", "Mark as won" |
| **Convert** | new-quotation / Quotations | Build & send a quotation | "Create quotation", "Send quotation" |

**Plan-aware rule:** nearly every seller feature is **gated by entitlement** (§3). Locked features
show a disabled control + lock icon + tooltip, a modal toast at a cap, a "Soon" chip, or an upsell card.

---

## Part 2 — The Connect module (the heart of the product)

The single most important interaction. One overlay (`connect-modal.js`), reused everywhere, adapting
to **5 intents**. This is where a casual browser becomes a qualified enquiry.

**Feature:** intent-aware enquiry qualification.
**Functionality:** a ≤3-step wizard that captures *contact, genuineness, urgency* and routes the
enquiry **exclusively to one seller** (never broadcast).
**Use case:** "I found a product/studio I like and want to reach them — without spraying my number
to ten businesses."

```
IBConnect.open({ intent, sellerName, itemName })
intent ∈ { project | product | service | shop | catalogue }
```

| Intent | Step 1 | Step 2 | Step 3 | Success copy |
|--------|--------|--------|--------|--------------|
| **project** | Contact (phone + OTP, "we never share your number") | Project type (Residential/Commercial/Hospitality/Industrial) + name | Timeline (Within 30 days … Just exploring) | — |
| **product** | What you need (Check price / Sample / Bulk / Custom) + note | — | — | "Your question is sent to {seller}. Expect a reply within 2 hours." |
| **shop** | How to connect (Visit / Callback / Catalogue / Availability) | — | — | "Shop notified. {seller} will follow up shortly." |
| **service** | Requirement (New quote / In progress / Consultation) | Mode (On-site / Remote / Either) + readiness chips | Timeline (This week … Not sure) | "Consultation request sent. {seller} will reach out within 4 hours." |
| **catalogue** | Purpose (Pricing / Bulk / Availability / Custom) + name | Contact (phone OTP) | Timeline | "Routed exclusively to {seller}. They typically respond within 4 hours." |

**Standards for Connect:**
- Progress dots per step (`.ibc-pdot`); Back button on steps > 1; CTA label changes by step
  ("Continue" → "Verify phone" → "Send enquiry").
- **OTP-verify the phone** before submit — the trust gate the whole model depends on.
- On submit, write to the enquiry spine (`enquiries` group → `ib:sharedenquiry`) via the service layer
  (see [Integration](../../docs/integration.md)), so it surfaces in buyer dashboard + seller Enquiries.
- Always end on a **success screen with a concrete timeline** and a forward action.
- **A11y:** `role="dialog"` + `aria-modal="true"` + `aria-labelledby` the title; focus trapped;
  Esc + backdrop close; each option a real `<button>`/labelled radio; OTP fields auto-advance.

---

## Part 3 — Seller plans & entitlements (the gating spec)

The portal's plan UI and every seller feature gate read from one entitlement source
(`ib-entitlements.js`). These are the **real numbers** — match them.

### Families & tiers

| Family | Tiers (CTA) | Billing | Headline limits |
|--------|-------------|---------|-----------------|
| **Autogrowth** (sales automation) | "Get Launch" · "Get Scale" · "Get Dominance" | Annual | states 2/5/∞ · segments 2/3/∞ · search terms 3/6/10 |
| **Business** (presence) | "Get Verified" · "Get Trusted Business" · "Get Industry Leader" | M/Q/A | products 25/100/∞ · services 10/50/∞ · catalogues 2/10/∞ · categories 1/2/3 |
| **Shop** (retail) | "Get Shop Verified" · "Get Shop Plus" · "Get Shop Pro" | M/Q/A | one shop; covers ∞; featured banner (Plus+); campaign mgr (Pro) |
| **Architecture** | "Get Verified" · "Get Architect Plus" · "Get Architect Pro" | M/Q/A | team off/on/on · awards off/on/on · insights off/off/on |

Indicative pricing (annual, incl. GST): Autogrowth ₹94,399 / ₹2,50,631 / ₹5,89,999 · Business
₹17,699 / ₹47,199 / ₹1,06,199 · Shop ₹9,439 / ₹17,699 / ₹29,499. (Authoritative values live in
`ib-entitlements.js`; the React port reads them, never hardcodes per-component.)

### Entitlement gradients (what each tier unlocks)
- Business: CRM basic→advanced→professional · proposals smart→professional→branded · pipeline
  tracker→visual→multi-stage · badge "IB Verified"→"Trusted Business"→"Industry Leader".
- Autogrowth: qualification 3-step→4-step · placement standard→priority→featured · **agent
  verification** locked on Launch, unlocked Scale+ · support 24/7→dedicated→account manager.

### Priority routing (why plan matters to enquiry flow)
Enquiry **qual tier A–E** × **plan network rank** (exclusive/full/premium/limited) →
`score = qual×2 + plan` → **P1 Immediate (≥9) · P2 Priority (≥6) · P3 Standard (≥3) · P4 Nurture (<3)**.
Higher plans get higher-intent enquiries faster. The portal must surface the seller's tier/badge and,
on Autogrowth, the qualification funnel.

### Gating UI standard (how a locked feature looks)
1. Disabled control + `ti ti-lock` icon + `data-tip` tooltip.
2. At a cap → modal toast: e.g. *"You've used all {cap} search terms — upgrade to add more."*
3. Nav "Soon" chip (`.dn-item-chip.soon`, `.is-soon` dims the item).
4. Whole-section upsell card with "Upgrade to Autogrowth".
Never silently hide a paid capability without signalling it's a paid capability.

---

## Part 4 — Module reference (feature → functionality → use case → journey → a11y)

### Buyer-side modules

**Search & voice search** — Feature: global search with Web Speech voice. Functionality: query →
results panel with empty-state suggestion pills + "Tell us what you need" → Connect. Use case: "find
designers near me". Journey: Discover. A11y: `role="combobox"`/`listbox`, `aria-expanded`, "/" focuses
search, Esc closes, degrade gracefully when voice unsupported.

**Listing grid + filters** — Feature: paginated card grid with sticky filter chips. Functionality:
filter/sort via `useSearchParams` (`?page`, `?filter`, `?city`); card → detail; save. Use case: narrow
to relevant products. Journey: Discover. A11y: chips are real buttons with `aria-pressed`; pagination
buttons labelled; disabled "…"/boundary controls actually `disabled`.

**Listing card** — Feature: the unit of discovery. Functionality: 16:10 thumb, verified badge, price/
duration, save (heart, appears on hover). Use case: scan and pick. Journey: Discover/Evaluate. A11y:
whole card link has accessible name; save button has `aria-label="Save"`/`aria-pressed`; thumbnail
`alt` describes the item, not "image".

**Detail pages** — Feature: evaluate one entity. Functionality: gallery, specs, ratings, related row,
Connect CTA. Use case: decide whether to enquire. Journey: Evaluate → Connect. A11y: one H1 (the
title); ratings have text equivalent; related row is a labelled region.

**Connect modal** — see Part 2.

**Auth** — Feature: sign in/up, OTP, password rules, account type. Functionality: 15-screen flow,
persists `ib_auth`, fires `ib:authchange`, honours post-login redirect. Use case: cross the gate to
enquire / open dashboard. Journey: Connect (gate) / Register. A11y: labelled inputs, password rules as
a live checklist (`aria-live="polite"`), OTP auto-advance, errors announced not just colour-coded.

**Buyer dashboard** — Feature: track & manage. Functionality: sections **Connections, Saved, Recently
viewed, Profile, Membership, Settings**; `?tab=` driven; connection rows → conversation thread with
templates; WhatsApp/phone/email actions. Use case: follow up on enquiries. Journey: Track/Manage. A11y:
`<aside>` nav of `<button>`s, current view `aria-current`, thread is a labelled log, empty states give a
CTA ("Start browsing").

### Seller-side modules

**Plans & checkout** — Part 3. A11y: plans are a comparable list/table; each "Get …" a labelled button;
current/recommended marked in text not only colour.

**Seller dashboard** — Feature: run the business. Functionality: ~14 sections grouped —
*Work*: Overview, Enquiries, Pipeline, Autogrowth, Quotations, Reviews, Insights · *Assets*: Business
(Products/Services/Catalogues), Shop, Architecture, Banner ads · *Personal*: Saved, Activity ·
*Account*: Profile, Plans, Billing, Settings, Security. `?tab=` driven; own chrome (no portal layout).
Use case: daily seller operations. Journey: Set up → Receive → Respond → Convert. A11y: same dashboard
landmark/`aria-current` rules; locked items expose state to AT (`aria-disabled` + tooltip text in DOM).

**Enquiries / Pipeline / Quotations** — Part 1.2 + Part 3 routing. A11y: status conveyed by icon+text
(not colour alone); kanban moves keyboard-operable; quotation builder fields labelled.

**Plan change** — Feature: request a different plan/term without re-checkout. Functionality:
`IBPlanEdit.openRequestModal` → writes `planChanges` → admin approves → `subs` reflects on next login.
Use case: upgrade/downgrade. Journey: Manage. Note copy: *"A request does not charge you. Billing is
settled with our team after approval."*

---

## Part 5 — Accessibility standard (every page passes this)

Baseline derived from the prototype's good patterns, with its gaps fixed:

1. **Landmarks & headings** — `header / nav / main / aside / section / footer`; exactly **one H1** per
   page; no skipped heading levels.
2. **Controls** — `<button>` for actions, `<a>` for navigation. Every input has a `<label for>`; helper
   text and errors linked via `aria-describedby`.
3. **Icon-only buttons** — always `aria-label`. Decorative icons/SVGs `aria-hidden="true"`.
4. **Modals/menus** — `role="dialog"` + `aria-modal="true"` + `aria-labelledby`; **focus trapped**;
   Esc + backdrop close; focus returns to the trigger on close.
5. **State, not just colour** — status/intent/verified always pair an icon or text with the colour.
6. **Focus visible** — every interactive element has a visible focus style (the green ring
   `box-shadow: 0 0 0 3px rgba(8,80,65,.08)` is the standard; never remove outlines without a replacement).
7. **Live regions** — form validation and async results use `aria-live="polite"` (a prototype gap to fix).
8. **Touch & contrast** — targets ≥ 38×38px; text contrast ≥ 4.5:1 (the green/cream palette already meets this).
9. **Document language** — set `<html lang="en-IN">` (a prototype gap to fix).
10. **Keyboard parity** — anything doable with a mouse (carousel, filters, save, kanban) is doable with
    the keyboard; tab order follows visual order.

> Apply these via the per-page template's **A11Y** field ([pages/README.md §A](pages/README.md)).
> UI tokens and components that satisfy these states live in [style.md](style.md); the words live
> in [copywriting.md](copywriting.md).
