# PAGE: Connect modal (shared overlay)

```
PROTOTYPE: assets/connect-modal.js        ROUTE: (shared overlay — IBConnect.open)        LAYOUT: Overlay (role=dialog)
```

The heart of the product — **not a routed page** but one overlay (`window.IBConnect`) reused from every
discover/evaluate surface, adapting to **5 intents**. This is where a casual browser becomes a qualified,
exclusively-routed enquiry. Mirror [../modules-features-flow.md](../modules-features-flow.md)
**Part 2** exactly; everything in [README.md](README.md) §B is answered below.

---

## 1. Purpose
Qualify a buyer's intent in **≤3 steps** (contact, genuineness, urgency), OTP-verify the phone, and route
the resulting enquiry **exclusively to one seller** — so the buyer reaches the right business without
spraying their number, and the seller gets a genuine, scored enquiry rather than noise.

## 2. Journey
- **Actor:** Buyer.
- **Stage:** Connect / enquire (the gate between Evaluate and Track).
- **Opened from:** any detail/listing/home CTA — `IBConnect.open({ intent, sellerName, itemName })`
  (also auto-wired on `.js-ib-connect` / `[data-ib-connect]`, and `openDialog()` → `intent:'project'`).
- **Leads to:** the login gate (Auth) on submit if anonymous; then the **success screen** (with a
  concrete timeline); then the Buyer dashboard (`dashboard-buyer.html`) where the enquiry lands.

## 3. Auth
**Auth-gated action.** Browsing/opening the modal and answering steps are **public**. The login gate
fires at **submit** — when the buyer presses the final CTA on the last step (the standard frames this as
"Continue on Connect step 1"; in the prototype the gate fires at `submitEnquiry()`). If logged in →
save + success. If not → the in-progress enquiry is stashed (`ib_enquiry_in_progress`), `ibOpenLogin()`
opens, and a post-login callback (`IB_PENDING_AFTER_LOGIN`) completes the save and routes to the buyer
dashboard. `IB_POST_LOGIN_REDIRECT` is set `false` so the modal's own callback owns the redirect.

## 4. Layout
**Overlay** — `.ibc-backdrop` (z 9990, blur) + `.ibc-modal` (`role="dialog"`, `aria-modal="true"`,
`aria-labelledby="ibc-title"`, z 9991, `width:min(460px,100vw-32px)`, radius 18). Three regions:
**head** (`.ibc-eyebrow` + italic serif `.ibc-title` + `.ibc-x` close), **body** (`.ibc-progress` dots +
`#ibc-steps-wrap` steps), **foot** (`.ibc-back` + `.ibc-cta`). Animations `ibcFade`/`ibcPop`/`ibcSlide`.

## 5. The intent / step matrix (the core spec)
`IBConnect.open({ intent })`, `intent ∈ { project | product | service | shop | catalogue }`. Each intent
sets a `title`, an (uppercase) `eyebrow`, an ordered `steps[]`, and a `success(ctx)` message. Step types:
`phone` (OTP contact), `opts` (radio-style option buttons), with optional `nameField`, `conditional`,
`expander` (chips + note), and always-optional `note`. **Verbatim** from `INTENTS`:

| Intent | Title / eyebrow | Step 1 | Step 2 | Step 3 | Success copy (verbatim) |
|--------|-----------------|--------|--------|--------|--------------------------|
| **project** | "Send a qualified enquiry" / "attract · qualify · connect" | **Contact** "What's the best number to reach you?" (`phone`, hint "OTP-verified · we never share your number") | **Project** "What kind of project is this?" — Residential/Commercial/Hospitality/Industrial + `nameField` "Your name" + expander "Add project details" → note "Tell us a bit about the space or what you have in mind (optional)" | **Timeline** "When do you need to start?" — Within 30 days / 30–90 days / 90+ days / Just exploring | "Routed exclusively to **{seller || verified businesses}**. They typically respond within 4 hours." |
| **product** | "Ask about this product" / "product enquiry" | "What do you need for "{itemName}"?" — Check price & availability / Request a sample / Bulk · trade enquiry / Custom size or colour; `conditional` textarea required on bulk/custom; optional note "Anything else? (optional)" | — | — | "Your question is sent to **{seller || the seller}**. Expect a reply within 2 hours." |
| **shop** | "Connect with this shop" / "showroom enquiry" | "How would you like to connect?" — Visit the showroom / Request a callback / Send catalogue · quote / Just check availability; note "What are you looking for? (optional)" | — | — | "Shop notified. **{seller || The team}** will follow up shortly." |
| **service** | "Book a consultation" / "service request" | **Requirement** "What best describes your requirement?" — New project quote / Work in progress / Consultation · advice | **How you'll work** "How would you like to work together?" — On-site visit / Remote · online / Either works + expander "Add project readiness & details" → readiness chips (Just an idea / Have measurements / Have drawings · plans / Site is live) + note | **Timeline** "When do you need this?" — This week / This month / Planning ahead / Not sure yet | "Consultation request sent. **{seller || The team}** will reach out within 4 hours." |
| **catalogue** | "Connect with this maker" / "catalogue enquiry" | **Purpose** "What do you need from this maker?" — Pricing · quote / Bulk · trade order / Availability & lead time / Custom spec + `nameField` "Your name" | **Contact** "What's the best number to reach you?" (`phone`, OTP hint) | **Timeline** "When do you need to decide?" — Within 30 days / 30–90 days / 90+ days / Just exploring | "Routed exclusively to **{seller || the maker}** — no one else gets this enquiry. They typically respond within 4 hours." |

Step **labels** are rendered verbatim ("Step 1 of 3 — Contact", "Step 2 of 3 — Project", etc.). Note the
**catalogue** intent reverses contact/genuineness order vs project (Purpose → Contact → Timeline).

### Progress, CTA labels, OTP, login gate
- **Progress dots** `.ibc-pdot` — one per step, filled up to the current step (single-step intents show one).
- **CTA label by step** (`showStep` / `advance`): **"Continue"** on every non-final step → **"Send
  enquiry"** on the last step. The phone step's CTA dims (`opacity .5`) until ≥ 7 digits are entered.
  > **Standard vs prototype gap:** [01 §Part 2] specifies the contact step's CTA reads **"Verify phone"**;
  > the current `connect-modal.js` does **not** render that literal label (it stays "Continue") and there
  > is **no OTP-code entry screen** yet — phone validation is "7+ digits", not a real OTP challenge. The
  > React port should add the "Verify phone" CTA + an OTP-code step to honour the standard.
- **Back** button (`.ibc-back`) hidden on step 0, shown on steps > 1.
- **Validation:** option steps require a selection; `nameField` required when present; `conditional`
  textarea required when its triggering option (bulk/custom) is chosen; phone requires ≥ 7 digits.
- **Success step** = `steps.length`: green check, italic serif "Sent successfully" + the intent's
  `success(ctx)` line; foot hidden; auto-closes after **2800ms**.

## 6. Data
The modal's submit is the portal's single most important **write**. It must go through the service layer
→ DataSource, **never** the prototype's raw `localStorage` (see
[../../Environment-Management-backend.md](../../Environment-Management-backend.md) and
[../../Integration.md](../../Integration.md)).

| What | Prototype behaviour | React (local-first) |
|------|---------------------|---------------------|
| Build record | `buildEnquiryRecord()` → `{ id:'IB-…', to, intent, status:'pending', subject, enquiry, timeline:[…] }` | `EnquiryService.build(state)` (same shape = the spine contract) |
| Pending (buyer) | `IBStore.enquiries.addPending` / `ib_pending_enquiries` | `EnquiryService.addPending(rec)` |
| **Shared spine** (admin/seller) | `IBStore.enquiries.addShared` / `ib_shared_enquiries`, fires `ib:sharedenquiry` | `EnquiryService.submit(shared)` → **`enquiries` group → `ib:sharedenquiry`** |
| Login gate stash | `sessionStorage ib_enquiry_in_progress` + `IB_PENDING_AFTER_LOGIN` | `AuthService` post-login callback via DataSource-backed session |

The shared record carries the qualification result: `score = 40 + 20 + urgencyScore + (brief>20?10:0)`,
mapped to **tier A–E** (≥90 A · ≥75 B · ≥55 C · ≥35 D · else E), `urgency` (within_30d / 30_90d / 90_plus
/ browsing), `category` (from `[data-ib-category]`), `region`, `contact_verified:true`,
`status: 'assigned'` if a named seller else `'pending_routing'`. This feeds priority routing
([modules-features-flow.md §Part 3](../modules-features-flow.md)). **Never captures budget** (qualification is
contact/genuineness/urgency, by design).

## 7. Primary CTA
**"Send enquiry"** (the final-step CTA that submits + fires the login gate). The per-step CTA is
**"Continue"**; the React port adds **"Verify phone"** for the OTP contact step (see §5 gap). Secondary:
**Back**, **Close** (`.ibc-x` / backdrop / Esc). Every option button is itself a labelled control that
advances qualification. Use exact strings from [../copywriting.md](../copywriting.md) §3.

## 8. States
- **Step (in-progress):** active `.ibc-step.on`; CTA "Continue"; phone CTA disabled-dim until ≥ 7 digits.
- **Validation error:** offending field gets `.ibc-input-err` (danger border + ring) and focus; no advance.
  React adds `aria-live="polite"` announcement (prototype gap).
- **Loading/submit:** the React port shows a sending state on the CTA while `EnquiryService.submit` runs
  (prototype submits synchronously).
- **Success:** dedicated step with check icon + timeline copy; auto-close 2800ms; a forward action (the
  buyer lands in the dashboard) — **no dead end**.
- **Private mode:** storage falls back to in-memory (`IBStore` mirror) — preserve this graceful degradation.

## 9. Responsive
- Modal `width:min(460px, calc(100vw - 32px))`, `max-height:calc(100vh - 40px)`, body scrolls.
- On small screens it remains a centred dialog (not a bottom sheet in the prototype); option buttons and
  phone row stay full-width. Touch targets: option buttons `~46px`, CTA `~46px` (≥ 38px).
- Respect `prefers-reduced-motion` (replace `ibcPop`/`ibcSlide`).

## 10. Accessibility
- `role="dialog"` + `aria-modal="true"` + `aria-labelledby="ibc-title"`; close button `aria-label="Close"`.
- **Focus trap** + focus returns to the trigger on close; **Esc** and **backdrop** close (both wired).
  Prototype gap to fix in React: the focus trap + return-focus aren't implemented — add them.
- Each option is a real `<button>`; the React port should expose them as a labelled radio group per step.
- Progress dots `aria-hidden` (decorative) — convey step via the visible "Step n of 3" label, which is
  also the step's accessible context; announce step changes + validation via `aria-live="polite"`.
- Phone field: real `<label>`, `inputmode="tel"`, OTP fields auto-advance (when the OTP step is added).
- Decorative `ti` icons `aria-hidden`. Full checklist:
  [../modules-features-flow.md](../modules-features-flow.md) §5 + Part 2 a11y.

## 11. Copy
- Titles/eyebrows/questions/options/hints/success **verbatim** from §5 (`INTENTS`).
- Brand voice: lowercase-b "Interior bazzar", British "enquiry"/"catalogue"; CTAs Title Case, no caps/"!".
- Reassurance where trust matters: "OTP-verified · we never share your number". Success copy always pairs
  gratitude/confirmation with a **concrete timeline** (2 / 4 hours). Placeholders India-first ("Mobile
  number", "Your name", "Tell us a bit about the space…"). All reconciled against
  [../copywriting.md](../copywriting.md) (§3 CTA library, §4 confirmations/hints/placeholders).

## 12. SEO
**Not applicable** — a client overlay, never a routed/indexed URL (no `PublicPage`, no canonical, no
`<title>`). It inherits the host page's document; it must not change the URL or push history.

---

### Build notes (React)
- Implement as a singleton overlay/provider: `src/components/Connect/` (`ConnectModal.tsx` +
  `useConnect.ts` + intent config in `connect.intents.ts`) exposed as `IBConnect.open(...)`, mounted once
  at the app root so every page can call it. Preserve `open({intent,sellerName,itemName})` + auto-wire on
  `[data-ib-connect]` for parity.
- The intent/step config (`INTENTS`) ports 1:1 to typed data; the renderer drives steps from it. Keep the
  `phone | opts` + `nameField | conditional | expander | note` primitives.
- Submit writes the **shared enquiry** via `EnquiryService` → DataSource (`enquiries` group →
  `ib:sharedenquiry`); replace raw `localStorage`/`sessionStorage`. The login gate uses `AuthService`
  (`ibOpenLogin`) and the stash/`IB_PENDING_AFTER_LOGIN` callback, routing to the buyer dashboard.
- **Add to honour the standard:** "Verify phone" CTA + a real OTP-code step on the `phone` filter; focus
  trap + return-focus; `aria-live` announcements. Gate with `tsc -b` + `vite build`; verify the overlay
  visually against a host page (e.g. business-detail) per the portal-conversion memory.
