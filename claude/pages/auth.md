# PAGE: Auth

```
PROTOTYPE: pages/auth.html        ROUTE: PAGES.AUTH ("/auth")        LAYOUT: Clean/focused (no sidebar)
```

The login gate and registration flow. This is the page the buyer lands on when they hit "Continue"
on Connect step 1 (or any auth-gated action) — and the page it returns them from, back to exactly
where they were. Everything in [README.md](README.md) §B is answered below.

---

## 1. Purpose
Let a user sign in or sign up (email, phone, or social), verify by OTP, set a password, and pick an
account type — then drop them back into the journey they came from (Connect modal, a detail page, or
their dashboard).

## 2. Journey
- **Actor:** Both. Buyers cross the gate to enquire; sellers start their registration here.
- **Stage:** Connect (gate) for buyers · Register for sellers.
- **Precedes:** the buyer's Connect modal / detail page they were on; the seller's Plans & checkout.
- **Leads to:** `IB_POST_LOGIN_REDIRECT` if set (where they came from); else the role's dashboard via
  `IBAuth.getDestination()` — buyer → `dashboard-buyer`, seller → `dashboard-seller`. Pending sellers
  (`sellerPlanStatus === 'pending_payment'`) route to Plans & checkout.

## 3. Auth
**This page IS the auth gate.** It is reached when an action elsewhere requires login (the Connect
"Continue", a dashboard link). It stores nothing about *which* action — that's the caller's
`IB_POST_LOGIN_REDIRECT`. On success it honours that redirect and returns the user to where they were.
No login is needed to *view* this page.

## 4. Layout
**Clean/focused layout — no sidebar, no topbar.** Two-column shell (`.page`, `grid 1fr 1fr`): a
fixed left brand panel (`.left-panel`, hidden ≤768px) and a right `.right-panel` holding the
`.auth-box` (max-width 440px). One screen visible at a time (`.auth-step.active`); a circular back
button (`#backBtn`, `.auth-back`) appears on sub-screens. The persona quick-login panel
(`#personaPanel`) sits above screen 1 and hides on every sub-screen.

## 5. Screen flow (15 screens — exact prototype ids, top of flow → success)
One `.auth-step` per screen; navigation is `goTo(id)` / `goBack()` with a `history` stack.
`backableScreens` lists which screens show the back button. CTA strings are **verbatim**.

| # | Screen id | Purpose | Fields / controls | CTA (verbatim) |
|---|-----------|---------|-------------------|----------------|
| — | `#personaPanel` | Demo quick-login — pre-built personas | 3 `.pp-card` buttons: Asha Mehta (Buyer · New Delhi), Verma Studio (Seller · Elite plan · Interior Design), Saket Interiors (Business plan · Pending activation) | card → `quickLogin('buyer'|'seller'|'saket_interiors')` |
| 1 | `screen-choose` | Choose method | Email + Phone primary `method-btn`s; Google / LinkedIn / Facebook social | "Continue with Email", "Continue with Phone", social tiles |
| 2 | `screen-email-entry` | Enter email | `#emailInput` (validated, `validateEmail()`) | "Continue" · "Send OTP to email instead" |
| 3 | `screen-password-login` | Returning user password | `#passwordInput` (+ "Forgot password?" link) | "Sign in" · "Sign in with OTP instead" |
| 4 | `screen-email-otp-entry` | Email OTP | 6× `.otp-input` (`#otp0…otp5`), 2:00 timer, resend | "Verify & continue" |
| 5 | `screen-phone-entry` | Enter phone | country selector (`#countrySelector` + searchable dropdown), `#phoneInput`, SMS/WhatsApp radio | "Send OTP" |
| 6 | `screen-phone-otp` | Phone OTP | 6× `.otp-input` (`#potp0…potp5`), 2:00 timer, resend / change number | "Verify & continue" |
| 7 | `screen-signup` | Create account (1/3) | `#signupName`, `#signupEmail`, `#signupPhone` (optional, country selector 2); progress dots | "Continue" |
| 8 | `screen-signup-pw` | Set password (2/3) | `#newPw` + strength bars + live rules checklist, `#confirmPw` | "Continue" |
| 9 | `screen-signup-type` | Account type (3/3) | 6 `.type-card`s (select-one) | "Complete registration" |
| 10 | `screen-signup-success` | Signup success | success icon | "Go to home" |
| 11 | `screen-forgot-step1` | Forgot password | `#forgotIdentifier` (email or phone) | "Send reset code" |
| 12 | `screen-forgot-otp` | Reset OTP | 6× `.otp-input` (`#fotp0…fotp5`), 10:00 timer, resend / change contact | "Verify code" |
| 13 | `screen-forgot-newpw` | New password | `#resetPw` + strength bars, `#confirmResetPw` | "Reset password" |
| 14 | `screen-forgot-success` | Reset success | lock-open icon | "Sign in now" |
| 15 | `screen-social-success` | Social sign-in landing | confirmation copy ("Connected via …") | "Continue" (→ account type) |

**Account-type cards (screen 9, verbatim name → desc):** Homeowner ("Looking for services,
products or businesses") · Designer / Architect ("Offering interior or architectural services") ·
Shop / Retailer ("Selling products from a showroom or store") · Manufacturer / Wholesaler ("B2B
product supply, bulk orders, exports") · Contractor ("Execution, installation, turnkey services") ·
International buyer ("Sourcing products or services from India").

**Password rules (screen 8, verbatim — the live checklist):** "At least 8 characters" · "One
uppercase letter" · "One number" · "One special character (!@#$...)". Strength labels: Too short /
Weak / Fair / Good / Strong.

## 6. Data
Writes the session via the **AuthService → DataSource seam** — never raw `localStorage`. (In the
prototype this is `IBAuth` over the `ib_auth` key; the React port keeps the same contract behind the
service — see [../../../docs/environment-and-backend.md](../../../docs/environment-and-backend.md).)

| Action | Service (local-first) | Effect |
|--------|-----------------------|--------|
| Sign in / sign up / quick-login | `AuthService.login(user)` | persists session (`ib_auth` shape); fires `ib:authchange` so navbar/dashboards re-render live |
| Account type → seller upgrade | `AuthService.upgradeToSeller(plan)` | sets `isSeller`; role is **derived** (`isSeller ? 'seller' : 'buyer'`), never stored separately |
| Registration record | `AuthService` → users registry | upserts into the admin-readable user list (`recordRegistration`) |
| Resolve destination | `AuthService.getDestination()` / honour `IB_POST_LOGIN_REDIRECT` | buyer → buyer dashboard, seller → seller dashboard; redirect wins if present |

- **`ib:authchange`** is the cross-app signal: every write dispatches it; the React port wires it
  through the service so any subscriber (topbar, gated action) updates without a reload.
- **`IB_POST_LOGIN_REDIRECT`**: when set by the caller (e.g. the Connect gate), `completeAuth()` sends
  the user there instead of the dashboard — this is the "return to where you were" rule.
- **Account-type routing:** Homeowner / International buyer → buyer surfaces; Designer-Architect /
  Shop-Retailer / Manufacturer-Wholesaler / Contractor → seller path (everyone is created a buyer,
  then `upgradeToSeller` on plan purchase).

## 7. Primary CTA
**Per-screen single CTA**, each resolving to the next step in the flow (full list in §5). The flow's
two outcomes: **"Sign in"** (returning user) and **"Complete registration"** (new user) — both call
`completeAuth()`, which writes the session and honours the redirect. Use exact strings from
[../copywriting.md](../copywriting.md) (Auth block).

## 8. States
- **Loading:** OTP send / verify and login show an in-button busy state (disabled `.btn-full`); no
  full-page spinner.
- **Empty/idle:** screen 1 is the resting state; sub-screens require their field before the CTA
  proceeds.
- **Error:** field-level, **announced** — invalid email ("Enter a valid email address"), bad password
  ("Incorrect password. Try again."), short phone ("Enter a valid phone number"), password mismatch
  ("Passwords don't match"). Errors pair an icon + text + `aria-describedby` (not colour alone).
- **Success:** dedicated success screens (10, 14, 15) — each ends with a forward CTA, never a dead end.

## 9. Responsive
- Desktop: two-column shell; left brand panel visible.
- ≤768px: left panel `display:none`; right panel becomes full-width, top-aligned (`.auth-box` 440px).
- OTP row stays on one line; tap targets ≥ 38px (CTAs and method buttons already exceed this).
- Country dropdown is a scrollable searchable list on small screens.

## 10. Accessibility
- Landmarks: `main` wraps the `.auth-box`; each `.auth-step` a labelled `<section>` (its `.auth-title`
  is the accessible name). One H1 per visible screen = that screen's title.
- **Labelled inputs:** every field gets a real `<label for>` (prototype uses `.field-label` divs —
  fix to `<label>`); helper/hint and error linked via `aria-describedby`.
- **Password rules as a live checklist:** `aria-live="polite"` on the rules region so each met rule is
  announced (a prototype gap to fix); rule state conveyed by icon (`ti-check`/`ti-x`) + text, not just
  colour.
- **OTP auto-advance:** focus moves to the next box on input (`otpMove*`); also support paste-to-fill
  and Backspace-to-previous; group has an accessible label ("Enter the 6-digit code").
- **Errors announced:** validation messages live in an `aria-live` region, not colour-only.
- Back button (`#backBtn`) has `aria-label="Go back"`; social/method buttons are real `<button>`s with
  text labels; decorative `ti` icons `aria-hidden`.
- Country selector: keyboard-operable combobox; focus visible (green ring
  `box-shadow: 0 0 0 3px rgba(8,80,65,.08)`). Full checklist:
  [../modules-features-flow.md](../modules-features-flow.md) §5 (and the Auth
  module entry in Part 4).

## 11. Copy
- Brand name lowercase-b **"Interior bazzar"** throughout (left panel `.lp-name`, success copy).
- CTAs Title Case, no caps/"!": "Continue with Email", "Continue with Phone", "Sign in", "Sign up",
  "Verify & continue", "Complete registration", "Go to home", "Send reset code", "Sign in now" —
  verbatim from [../copywriting.md](../copywriting.md).
- British spelling ("enquiry") in any supporting copy; account-type names/descriptions, password
  rules, OTP timer/resend strings all **verbatim** from the prototype (§5). Tokens/voice per
  [../style.md](../style.md).

## 12. SEO
`PublicPage` with: title "Interior bazzar — Sign in" (matches prototype `<title>`), a one-line
description (sign in or create an account on Interior bazzar), canonical "/auth". `noindex` is
acceptable for an auth route. (Final strings confirmed against prototype before build.)

---

### Build notes (React)
- Page shell: `src/pages/Auth/index.tsx` + `useAuth.ts` + `Auth.module.css`; renders one
  `<AuthStep>` at a time from a screen state machine mirroring `goTo`/`goBack` + `history`.
- **No raw localStorage.** All session reads/writes go through `AuthService` (wrapping the `ib_auth`
  contract) → DataSource; `ib:authchange` is re-emitted through the service so subscribers stay live
  (see [../../../docs/environment-and-backend.md](../../../docs/environment-and-backend.md)).
- On success, read `IB_POST_LOGIN_REDIRECT` first, else `AuthService.getDestination()`; pending
  sellers → Plans & checkout.
- Fix the prototype a11y gaps noted above (live regions, real `<label>`s, `lang="en-IN"`) as part of
  the port.
- Verify visually with the headless-screenshot method (portal-conversion memory): compare `/auth`
  against `file:///…/pages/auth.html`, screen by screen. Gate with `tsc -b` + `vite build`.
