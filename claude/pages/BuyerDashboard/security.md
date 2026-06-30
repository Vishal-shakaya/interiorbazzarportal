# TAB: Password & security — Buyer Dashboard

```
PARENT: README.md  ·  VIEW id: security  ·  GROUP: account  ·  PROTOTYPE: pages/dashboard-buyer.html
```

> Links: parent overview [README.md](README.md) · pages index [../README.md](../README.md) · [modules-features-flow](../../modules-features-flow.md) · [style](../../style.md) · [copywriting](../../copywriting.md) · [environment seam](../../../../docs/environment-and-backend.md) · [integration](../../../../docs/integration.md) · prototype [`../../../Prototype/ib_prototype_7.2.1/pages/dashboard-buyer.html`](../../../Prototype/ib_prototype_7.2.1/pages/dashboard-buyer.html) (`renderSecurity()`)

## 1. Page-tab

**What it is.** The account-security view: the buyer manages **password**, **two-factor authentication**, **active sessions** and a **recent-activity** audit trail in one place. Rendered by `renderSecurity()` (prototype line ~7504), dispatched from `renderContent()`'s switch via `case 'security': return renderSecurity();`.

**Where it sits in nav.** Dashboard left nav `<aside class="dash-nav">`, group **account** ("Profile & settings"), item label **"Password & security"**, icon **`ti-lock`** (README §5 row 8). No chip/count. The view header shows breadcrumb **"Dashboard › Password & security"**, H1 **"Password & security"**, sub **"Keep your account secure by using a strong password and enabling 2-factor authentication."**

**Default view?** No. The default working view is **My connections** (README §5; `dashState.section` default `'saved'` in the prototype map). Security is reached only on demand.

**How it's reached.** Nav button → `goSection('security')` (sets `dashState.section`, writes `window.location.hash`, re-renders). React port maps this to **`?tab=security`** (`setSearchParams({tab}, {replace:true})`, README §6). No deep-link sub-route — this tab has no nested id param.

**Who sees it.** Every logged-in buyer (auth-gated page per README §3: logged-out → `auth.html`, seller → `dashboard-seller.html`). No per-feature visibility gating.

## 2. Module

**Universal / account.** This is a buyer tab — it belongs to the **account** nav group, not to any paid module or subscription. There is **no plan-gating, no entitlement read, no cap, no upsell**. It is available in full to every authenticated buyer. (Seller-only constructs — `IBEntitlements.of` / `.limit` / `.atCap` / `.meters`, `IB_SECTION_MODULE` / `ib_sectionAllowed` — do **not** apply here.)

## 3. Features

Verbatim feature cards from `renderSecurity()`, in render order (two-column `.dm-grid-2`; left column then right column):

- **Change password** (`ti-key`)
- **Two-factor authentication** (`ti-shield-lock`)
- **Active sessions** (`ti-device-mobile`)
- **Recent activity** (`ti-history`)

## 4. Functionality

Reads/writes go through services → DataSource (house rule: never raw `localStorage`/`fetch`). The proposed buyer-side service is **`SecurityService`** over the **`ib_auth`** user spine (same auth state README §6 hydrates from `IBAuth.getAuth()`); session/activity records are an account-security sub-store of that spine.

### Change password (`ti-key`)
| Control | Verbatim label / copy | Behaviour |
|---|---|---|
| Current password | label **"Current password"**, `type=password`, placeholder `••••••••` | reads nothing; submitted with the update |
| New password | label **"New password"**, placeholder `••••••••`; help **"At least 8 characters, with one uppercase and one number"** | client-validated against the help rule |
| Confirm new password | label **"Confirm new password"**, placeholder `••••••••` | must equal New password |
| Submit | `.dm-action primary` **"Update password"** (`ti-key`), `align-self:flex-start` | `SecurityService.changePassword()` → DataSource → success toast (`showToast(...,'success')`) |
| Reset link | **"Forgot your password? Reset via email →"** (green inline link) | triggers the reset-email flow |

Writes the user credential via service; on success the **Recent activity** "Password last updated" entry refreshes.

### Two-factor authentication (`ti-shield-lock`)
Three `.form-toggle` rows; in the prototype each is a `.toggle-switch` whose handler is inline `onclick="this.classList.toggle('on')"` (React replaces with a controlled toggle persisting via `SecurityService.set2FA(channel, on)`):

| Toggle | Title | Sub-copy | Prototype default |
|---|---|---|---|
| SMS | **"SMS verification"** | **"Receive a code via SMS when logging in from a new device"** | **off** |
| Email | **"Email verification"** | **"Receive a confirmation email for new device logins"** | **on** (`toggle-switch on`) |
| Authenticator | **"Authenticator app"** | **"Use Google Authenticator or similar for code generation"** | **off** |

### Active sessions (`ti-device-mobile`)
A device list; each row = icon tile + name + location/last-seen + action.

| Row | Verbatim | Action |
|---|---|---|
| Current device | **"MacBook Pro · Chrome"** · **"New Delhi · Active now"** | badge **"CURRENT"** (no sign-out) |
| Other device | **"iPhone · IB app"** · **"New Delhi · 2 hours ago"** | `.conn-btn` (`ti-logout`, title **"Sign out"**) → `signOutDevice(this)`: toast **"Device signed out"** (success), row dims to 0.5 opacity |
| Footer | `.dm-action` **"Sign out all other devices"** (`ti-logout`) | `signOutAllDevices()` → confirm modal (see Working flow) |

In React, rows read from `SecurityService.listSessions()`; sign-out actions write via `SecurityService.revokeSession(id)` / `.revokeAllOthers()` → DataSource. The session list is **live data** (the prototype's two rows are sample data).

### Recent activity (`ti-history`)
Read-only `.activity-feed` audit log of `.activity-row`s (icon + message + time):

| Verbatim message | Verbatim time |
|---|---|
| **"Logged in from Chrome on MacBook"** | **"Just now · New Delhi"** (`ti-login`) |
| **"Password last updated"** | **"3 months ago"** (`ti-key`) |

Reads `SecurityService.activity()`. No write controls.

## 5. Working flow

**Flow A — change password (core loop).**
1. Buyer opens nav → **"Password & security"** (`?tab=security`).
2. Fills **Current password**, **New password** (meets "At least 8 characters, with one uppercase and one number"), **Confirm new password**.
3. Clicks **"Update password"** → `SecurityService.changePassword()` → DataSource → success toast.
4. **Recent activity** updates ("Password last updated"); buyer stays on the tab or returns to **My connections**.
5. Forgot-path exit: **"Reset via email →"** → reset-email flow (off-dashboard).

**Flow B — harden 2FA.** Toggle **SMS / Email / Authenticator** → each persists via `SecurityService.set2FA()`. Email verification ships **on** by default.

**Flow C — sign out a device.**
1. Under **Active sessions**, click the **iPhone** row's **"Sign out"** (`ti-logout`) → toast **"Device signed out"**, row dims.
2. Or **"Sign out all other devices"** → confirm modal **"Sign out all other devices?"** body *"This will sign you out everywhere except this device. Use this if you suspect someone else has access to your account."* → **Cancel** / **"Sign out all"** → on confirm: toast **"All other devices signed out"**.

**Connections to other tabs / shared spine.** This tab governs the **`ib_auth`** user state that every dashboard view hydrates from (README §3/§6: `dashState.user` ← `IBAuth.getAuth()`). A password change or device sign-out is an auth-spine write, so it reflects across the session everywhere `IBAuth` is read (avatar menu, **Settings**, **My profile**) and ends the journey at the dashboard, never a dead end. Unlike **My connections** (the `enquiries` spine shared live with the seller dashboard), security writes stay on the buyer's own account — there is no cross-dashboard surfacing here.

## 6. Data · States · A11y · Copy

**Data.** Service **`SecurityService`** (changePassword / set2FA / listSessions / revokeSession / revokeAllOthers / activity) over the **`ib_auth`** user spine + its account-security sub-store; all via services → DataSource (never raw `localStorage`/`fetch`). No entitlement reads (buyer/universal).

**States.**
- **Loading:** skeleton for the two-column cards (session rows, activity rows) — not a bare spinner (README §8).
- **Empty:** no other active sessions → show only the **CURRENT** device (hide "Sign out all other devices"); empty recent-activity → quiet "No recent activity yet" line. No paid-cap/upsell states (buyer tab).
- **Error:** failed password update → inline field error (e.g. wrong current password / mismatch / weak password) keeping chrome usable; failed session load → quiet inline retry (README §8).
- **Success:** toasts — **"Device signed out"**, **"All other devices signed out"**, and a password-updated success toast (`showToast(...,'success')`); destructive sign-out-all confirms first.

**A11y.** Landmarks: dashboard `header` + `<aside class="dash-nav">` (the nav) + `<main>`; this tab is one labelled `section`. Exactly **one H1** = `.dm-title` "Password & security". Nav: each view is a real `<button>`; current item carries **`aria-current`** (prototype uses `.on`). Password inputs are labelled (Current/New/Confirm) with the help text associated (`aria-describedby`); toggle switches are operable buttons with state in **text + icon** (title + sub), not colour alone — the **CURRENT** badge pairs label + colour. Icon-only **"Sign out"** (`.conn-btn`) gets `aria-label`; decorative `ti` icons `aria-hidden`. The sign-out-all confirm modal is `role="dialog"` + `aria-modal`, focus-trapped, Esc + backdrop close, focus returns to trigger.

**Copy (verbatim).** Sub: "Keep your account secure by using a strong password and enabling 2-factor authentication." · Password help: "At least 8 characters, with one uppercase and one number" · CTA "Update password" · "Forgot your password? Reset via email →" · 2FA titles "SMS verification" / "Email verification" / "Authenticator app" (+ their subs above) · "Active sessions", "CURRENT", "Sign out", "Sign out all other devices" · toasts "Device signed out" / "All other devices signed out" · modal "Sign out all other devices?" / "This will sign you out everywhere except this device. Use this if you suspect someone else has access to your account." / "Cancel" / "Sign out all" · "Recent activity", "Logged in from Chrome on MacBook", "Just now · New Delhi", "Password last updated", "3 months ago". Brand lowercase-b **"Interior bazzar"**; CTAs Title Case, no caps/"!".

**Build notes (React):** `components/BuyerDashboard/Security/` (cards: `ChangePassword`, `TwoFactor`, `ActiveSessions`, `RecentActivity`), rendered by the `<ViewSwitch>` on `?tab=security`; uses **`SecurityService`** (over the `ib_auth` spine) → DataSource.
