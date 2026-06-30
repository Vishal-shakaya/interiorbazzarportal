# PAGE: Plans & checkout

```
PROTOTYPE: pages/plans-checkout.html        ROUTE: PAGES.PLANS_CHECKOUT        LAYOUT: Clean (focused flow — portal sidebar hidden; own left "category" rail)
```

The buyer → seller conversion. A buyer picks a plan **family** + **tier**, then runs a 2-step
manual-payment checkout that ends in seller activation. Everything in
[README.md](README.md) §B is answered below.

---

## 1. Purpose
Turn a logged-in buyer into a paying seller: let them choose one of four plan **families**
(Business · Shop · Architecture · Autogrowth), each with three tiers and a billing-period toggle, then
complete checkout so their seller subscription is written and the seller dashboard unlocks.

## 2. Journey
- **Actor:** Buyer upgrading to **Seller** (the seller journey's "Choose plan" stage).
- **Stage:** Convert (Register → **Choose plan** → Set up).
- **Precedes:** `auth.html` (register / pick account type), or the buyer dashboard "Upgrade plan" action.
- **Leads to:** manual payment → proof upload → confirmation → onboarding → `dashboard-seller.html`.
  (Seller journey continued in [../modules-features-flow.md](../modules-features-flow.md) Part 1.2.)

## 3. Auth
**Auth-required.** Checkout assumes an auth state — `testSubscribe()`/`upgradeToSeller` "assumes an auth
state", and contact fields pre-fill from `IBAuth.getAuth()` for logged-in users. A not-logged-in visitor
hitting checkout must be sent through the login gate first (`IB_POST_LOGIN_REDIRECT`), then returned here.

## 4. Layout
**Clean focused flow.** The portal topbar is present (`#ib-topbar`, `data-active="plans"`) but the
browsing sidebar is **hidden**; the page has its own left **category rail** (`.cat-tabs-bar`, 240px,
sticky) that switches plan families, and a right `.cat-plans-area`. On ≤900px the rail becomes a
horizontal scroll strip. Checkout/confirm/onboarding render as full-width focused screens.

## 5. Sections (top → bottom — exact prototype order)
The page is a **single-page multi-screen flow**: one `.screen.active` at a time
(`screen-plans` → `screen-pay` → `screen-proof` → `screen-confirm` → `screen-onboarding`), driven by
`showScreen()`. Within `screen-plans`, the left rail (`switchCat()`) swaps four `.cat-content` family
panels. Quote labels **verbatim**:

### 5a. Category rail (`#catTabsBar`) — picks the family
Header "Presence plans", then tabs:
| Tab id | Name | Sub | Family key |
|--------|------|-----|------------|
| `ctab-business` | Business | "Firms & studios" | `business-*` |
| `ctab-shops` | Shop | "Showrooms & retailers" | `shop-*` |
| `ctab-architect` | Architecture | "Profile & portfolio" | `arch-*` |
| (separator "Growth engine") | | | |
| `ctab-autogrowth` (`.cat-tab-growth`, "Growth" badge) | Autogrowth | "AI qualified enquiries" | `ag-*` |

Rail footer promo: "Not sure which plan?" → "Talk to us — we'll match you to the right one for your
business." → "Chat with us" (WhatsApp `wa.me/918920898168`).

### 5b. Each family panel (`.cat-content`) — top → bottom
1. **Hero** — eyebrow + serif `.hero-h1` (`<em>` keyword) + sub + trust bar. Verbatim H1s:
   - Business: "Your *business profile*, built to attract."
   - Shop: "Your storefront, *found first.*"
   - Architecture: "Your profile, your *portfolio.*"
   - Autogrowth: "The process your business never had time to *build.*" (eyebrow "attract · qualify · convert").
2. **(Autogrowth only) Qualification-engine strip** (`.qual-engine`) — "How every enquiry is qualified":
   1 Requirement verification → 2 Intent verification → 3 Urgency (AI-Intent) → 4 Human verification;
   note "Screened on genuineness, intent & urgency only — never on budget."
3. **Billing-period toggle** (`.duration-toggle`, presence families only) — **Monthly · Quarterly ·
   Annual** (`setDuration(prefix,'mo'|'q'|'yr')`). Annual default + save badge: Business "Save 17%",
   Shop "Save 14%", Architecture "Save 17%". Autogrowth is annual-only (no toggle).
4. **Plan cards** — three `.plan` cards (middle = `.plan.popular` "Most popular"). See §6 matrix for
   tiers / prices / CTAs. Cards read `data-mo`/`data-q`/`data-yr` + `data-gst-*` so the toggle swaps
   price + GST line live.
5. **(Autogrowth only) Custom-plan banner** (`.custom-cta`) — "None of these fit? *Design your own
   plan.*" → "Build your own plan" (`openCustomForm()`), note "Takes 30 seconds · sales team responds
   the same day".
6. **Add-ons** (`.addon-section`, "Boost your reach" / per-page pricing) — Homepage placement, Category
   page listing, City page listing (prices vary by family, see §6).

### 5c. Checkout screens (after a "Get {Tier}" CTA)
| Screen | Section | Key content |
|--------|---------|-------------|
| `screen-pay` | Step **1 — Pay** | Step indicator (1 Pay · 2 Confirm payment). India (₹) / International ($) region toggle; **Bank Transfer** + **UPI** tabs; verified IDFC bank details (account "FEELSAFE TECHNOLOGY INDIA PRIVATE LIMITED", A/C `70651211205`, IFSC `IDFB0020106`, UPI `feelsafe@idfcbank`); order summary card + coupon; **"I've made the payment"** buy-btn → `goToProof()`. |
| `screen-proof` | Step **2 — Confirm payment** | Upload payment receipt (`.file-upload`), reference fields; buy-btn → `submitProof()`. |
| `screen-confirm` | Confirmation | Icon + "Payment submitted." + sub (verify & activate in **1–3 business days**); 4-step strip (Payment submitted → Verification → Account activated → First connection); actions "Set up my profile", "Go to home", "Contact us". |
| `screen-onboarding` | Profile setup | Business-type grid (Interior Designer, Architect, Modular Kitchen, Shop / Showroom, Manufacturer, Contractor) + logo/cover/project uploads; "Continue" / "Complete setup". |

> The custom-plan modal (`.cf-overlay`) and the dev-only **Test subscription** path are overlays, not
> screens. Footer follows the flow.

## 6. Data
**Authoritative plan values live in `assets/ib-entitlements.js`** — the React port **reads** them via
the service seam, never hardcodes a price/limit/CTA per component. The family/tier matrix (prices are
verbatim annual cards; GST line shown):

| Family | Tier (CTA) | Plan key | Annual price | GST line | Headline entitlements (from ib-entitlements.js) |
|--------|-----------|----------|--------------|----------|--------------------------------------------------|
| **Autogrowth** (annual only) | **Get Launch** | `ag-launch` | ₹79,999/year | + ₹14,400 GST = **₹94,399** total (₹9,999/mo · ₹24,999/quarter) | 2-state · 2 segments · 3 rankings · 3-step qual · WhatsApp verify · premium tier · 24/7 |
| | **Get Scale** *(Most popular)* | `ag-scale` | ₹2,12,399/year | + ₹38,232 GST = **₹2,50,631** total | 5-state · 3 segments · 6 rankings · 4-step qual + human · full tier · exclusivity · dedicated |
| | **Get Dominance** | `ag-dominance` | ₹4,99,999/year | + ₹90,000 GST = **₹5,89,999** total | pan-india · ∞ segments · 10 rankings · exclusive tier · account manager |
| **Business** | **Get Verified** | `business-verified` | ₹14,999/year | + GST = **₹17,699** total (₹1,499/mo · ₹3,999/q) | 25 products · 10 services · 2 catalogues · 1 category · 3 keywords · CRM basic · badge "IB Verified" |
| | **Get Trusted Business** *(popular)* | `business-trusted` | ₹39,999/year | + GST = **₹47,199** total | 100 / 50 / 10 · 2 categories · 5 keywords · CRM advanced · badge "Trusted Business" |
| | **Get Industry Leader** | `business-leader` | ₹89,999/year | + GST = **₹1,06,199** total (note "For firms closing ₹1Cr+ annual projects") | ∞ products/services/catalogues · 3 categories · 10 keywords · CRM professional · badge "Industry Leader" |
| **Shop** | **Get Shop Verified** | `shop-verified` | ₹7,999/year | + GST = **₹9,439** total | one shop · ∞ shop catalogue · badge "Verified Shop" |
| | **Get Shop Plus** *(popular)* | `shop-plus` | ₹14,999/year | + GST = **₹17,699** total | featured banner · badge "Trusted Seller" |
| | **Get Shop Pro** | `shop-pro` | ₹24,999/year | + GST = **₹29,499** total | campaign mgr · badge "Premium Seller" |
| **Architecture** | **Get Verified** | `arch-verified` | ₹9,999/year | + GST = **₹11,799** total | ∞ projects/catalogues · team off · awards off · badge "Verified Architect" |
| | **Get Architect Plus** *(popular)* | `arch-plus` | ₹19,999/year | + GST = **₹23,599** total (note "For studios handling ₹50L+ projects") | team on · awards on · insights off · badge "Trusted Architect" |
| | **Get Architect Pro** | `arch-pro` | ₹39,999/year | + GST = **₹47,199** total | team on · awards on · insights **on** · badge "Premium Architect" |

Add-ons (verbatim): Homepage placement (Business ₹9,999/mo · Shop ₹999/mo), Category page listing
(Business ₹4,999/mo per page · Shop ₹1,499/mo per page), City page listing (Business ₹2,999/mo per city
· Shop ₹999/mo per city). Autogrowth add-ons: Homepage featured ₹9,999/mo, Category ₹4,999/mo per page,
City ₹2,999/mo per city.

**Reads:** `PlanService.families()` / `PlanService.tier(key)` → resolve display name via `IBPlans.full()`
/ `IBPlans.tier()` and entitlements via `IBEntitlements.of(key)`. **Writes** (all through services →
DataSource, never raw `localStorage`):
- **On checkout submit** → `IBAuth.upgradeToSeller(plan)` writes the **seller subscription** to the
  **subs spine** (`subs` group), flips the user to seller, fires `ib:authchange`. In the prototype this
  fires on **manual approval** (or the dev `testSubscribe()` bypass) — `submitProof()` itself keeps the
  user a **buyer** and writes a **pending payment** record; the upgrade happens out of band on approval.
- Custom-plan request → `planChanges`/custom-request store (admin-reviewed).
See [../../../docs/integration.md](../../../docs/integration.md) and
[../../../docs/environment-and-backend.md](../../../docs/environment-and-backend.md).

## 7. Primary CTA
**"Get {Tier}"** — the per-card subscribe button (verbatim: "Get Launch", "Get Scale", "Get Dominance",
"Get Verified", "Get Trusted Business", "Get Industry Leader", "Get Shop Verified", "Get Shop Plus",
"Get Shop Pro", "Get Architect Plus", "Get Architect Pro"). Calls `selectPlan(name, key)` → method
dialog. Secondary: billing-period toggle, "Chat with us", "Build your own plan", add-on actions,
checkout buy-btn ("I've made the payment"), confirmation "Set up my profile". Every CTA advances the
seller journey.

## 8. States
- **Loading:** plan grids skeleton per family; checkout summary placeholder.
- **Empty:** n/a (plans are always present); a family with no live data still shows its three static tiers.
- **Error:** payment-proof failure → inline error, stay on `screen-proof`; coupon invalid → inline note.
- **Success:** `screen-confirm` ("Payment submitted.", 1–3 business-day timeline) → onboarding →
  `dashboard-seller.html`. Always a forward action ("Set up my profile" / "Go to home").
- **"Coming soon":** the online-gateway pay option is **disabled** with a `.soon-pill` — never silently
  hidden (Part 3 gating standard).

## 9. Responsive
- Desktop: 240px rail + 3-up plan grid; checkout `1fr / 420px` with sticky right rail.
- ≤1024px: plan grid → 1 col, popular card un-scaled, checkout single-column.
- ≤900px: category rail → horizontal scroll strip (tabs become bottom-border).
- ≤640px: shell 94%, hero H1 36px, add-on/onboarding grids reflow. Touch targets ≥ 38px.

## 10. Accessibility
- Landmarks: `header` (topbar), `nav`/`aside` (category rail with `aria-current` on active family),
  `main` (plans area). **One H1** = the active family hero; tier names are H2/H3.
- Plans are a **comparable list/table**; each "Get {Tier}" is a labelled `<button>`; popular/recommended
  marked in **text** (the "Most popular" badge), not colour alone.
- Billing toggle = labelled radio/segmented control with `aria-pressed`; price updates announced
  (`aria-live="polite"`).
- Method dialog / custom-plan modal: `role="dialog"` + `aria-modal="true"` + `aria-labelledby`, focus
  trapped, Esc + backdrop close, focus returns to trigger.
- Disabled "Pay online" exposes its locked state to AT (`aria-disabled` + the "Coming soon" text in DOM).
- Step indicators convey progress with text + number, not colour only. Full checklist:
  [../modules-features-flow.md](../modules-features-flow.md) §5.

## 11. Copy
- Family/tier names, prices, GST lines, CTAs, add-on copy — **verbatim** from §6 and the prototype.
- Brand name lowercase-b "Interior bazzar"; British "enquiry". CTAs Title Case, no caps/"!".
- Manual-pay sub: "Transfer to our account, then upload your receipt. Verified in 1–3 business days."
- Confirmation: "Payment submitted." / "We've received your payment details… activate your plan within
  1–3 business days." All strings from [../copywriting.md](../copywriting.md).

## 12. SEO
`PublicPage` (but auth-gated content) with: title "Interior bazzar — Plans & Pricing" (verbatim
prototype `<title>`), description echoing the value prop ("one qualified enquiry → one business, never
broadcast"), canonical "/plans". Strings confirmed against prototype before build.

---

### Build notes (React)
- Page shell: `src/pages/PlansCheckout/index.tsx` + `usePlansCheckout.ts` + module CSS; a `family` state
  drives the rail, a `period` state drives the toggle, a `screen` state drives the flow machine
  (plans → pay → proof → confirm → onboarding).
- **Never hardcode prices/limits/CTAs per component** — read the family/tier matrix and entitlements
  from the ported `ib-entitlements.js` (+ `ib-plans.js` for display names) through `PlanService`.
- Checkout writes go through the service seam: `selectPlan` → method dialog → manual flow → on
  approval `AuthService.upgradeToSeller(plan)` writes the **subs spine**. Keep the dev "Test
  subscription" bypass behind an env flag (local/dev only).
- Verify visually with the headless-screenshot method (portal-conversion memory): compare each family
  panel + each checkout screen against `file:///…/pages/plans-checkout.html`. Gate with `tsc -b` +
  `vite build`.
</content>
</invoke>
