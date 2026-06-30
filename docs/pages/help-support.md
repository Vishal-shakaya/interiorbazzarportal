# PAGE: Help & support

```
PROTOTYPE: pages/help-support.html        ROUTE: PAGES.HELP ("/help")        LAYOUT: Browsing (topbar + sidebar)
```

The buyer's (and seller's) self-serve help desk: search articles, browse topics, watch tutorials —
and, when that isn't enough, reach a human. Every contact action **logs a support ticket** to the
Admin Help Desk (`support` spine group → `ib:support`), so nothing is missed. Everything in
[README.md](README.md) §B is answered below.

---

## 1. Purpose
Let a user resolve a question themselves (search → FAQ → topic articles → tutorials) and, failing
that, contact Interior bazzar through a real channel (live chat / WhatsApp / email / call) — where
each enquiry is captured as a tracked support ticket.

## 2. Journey
- **Actor:** Both (buyer primary; sellers use the same page). The page reads the signed-in user if
  present (`ib_auth`) but is fully usable as a guest ("Guest user").
- **Stage:** Manage / support (a side journey reachable from anywhere).
- **Precedes:** a contact channel (chat widget / WhatsApp / email / call) and the Admin support desk.
- **Leads to:** an opened ticket (tracked in "My tickets" + Admin Help Desk), help-article drawers,
  the feedback flow, or back into browsing.

## 3. Auth
**Public.** No login to read help or to contact. A ticket is logged whether or not the user is
signed in — `logTicket()` stamps `user`/`email` from `ib_auth` when present, else `'Guest user'`.
"My tickets" shows tickets for the current signed-in user / this device.

## 4. Layout
**Browsing layout** — fixed topbar (`#ib-topbar`, **`data-active="help"`**, 60px) + collapsible left
sidebar (`#sidebar`, with a **"Support"** `.sb-heading` group) + `<main class="main" id="main">`
(`.main-inner`). Sidebar visible.

## 5. Sections (top → bottom — exact prototype order)
Each is its own 3-file component under `components/Help/`. Section headers use the shared
**SectionHeader** = `.sec-eye` (uppercase green eyebrow + `.sec-eye-line`) + `.sec-title` (serif 28px,
`<em>` in green italic). Eyebrow/title quoted **verbatim**:

| # | Section | Component | Eyebrow → Title (verbatim) | Content |
|---|---------|-----------|----------------------------|---------|
| 1 | Top ribbon | `HelpRibbon` | "we're here to help" → "How can we *help you* today?" | Subhead "Browse common questions, chat with us, or reach a human — most people get an answer in under 12 minutes." + two buttons: "Start 24/7 chat" (`data-help-action="chat"`), "Send feedback" (`data-help-action="feedback"`). |
| 2 | Hero search | `HelpSearch` | (in-band eyebrow) "help centre" → "Search our *help articles* & FAQs" | Dark green band. `#helpSearch` input (placeholder `Try: 'how to send enquiry', 'change my password', 'cancel plan'…`) + `#helpSearchBtn` "Search" + `#helpTagChips` suggestion chips. Opens the help-article drawer. |
| 3 | Contact channels | `ContactChannels` | "get in touch" → "Talk to *a human*" | 4 `.hs-channel` cards → each `data-help-action`: **Live chat** ("Avg response 2 minutes · 24/7", "4 agents online"), **WhatsApp us** ("+91 8920898168", "Mon–Sat · 9 AM – 9 PM IST"), **Email us** ("help@interiorbazzar.com", "Replies within 4 hours"), **Call us** ("+91 8920898168", "Mon–Sat · 10 AM – 7 PM IST"). |
| 4 | Browse by topic | `HelpTopics` | "by topic" → "Browse *help topics*" | 8 `.hs-topic` buttons (`data-topic`): Account & profile (14), Enquiries & messaging (11), Billing & plans (9), Trust & safety (8), Become a seller (12), Orders & deliveries (7), Refunds & returns (6), Report a bug (5). Each opens a topic article drawer. |
| 5 | Top FAQ + status/tickets | `HelpFaq` + `StatusTicketsRail` | "top questions" → "FAQs *everyone asks*" | Two-column. Left: `#hsFaq` accordion (`.hs-faq` open/close, `"All FAQs"` link). Right rail: **Platform *status*** card ("all systems normal"; Search & discovery / Enquiries & messaging / Payments & billing / Seller dashboards all "✓ Operational"; "Subscribe to updates") + **My tickets** card (`#myTicketsCard`, live, amber). |
| 6 | Video tutorials | `VideoTutorials` | "watch & learn" → "*2-minute* video tutorials" | 4 `.hs-tut` cards ("Sending your first enquiry", "Saving & organising profiles", "Picking the right architect", "Becoming a seller in 5 steps") + "All tutorials" link. |
| 7 | Community + feedback | `CommunityFeedback` | (card titles) "Join the *community*" · "*Share* feedback" | Two cards: forum ("Visit forum" / "Browse threads") + feedback ("Send feedback", `data-help-action="feedback"`, "we read every message"). |

> Footer follows the feed (shared layout component, not Help-specific).

### Contact channels → support tickets (the load-bearing behaviour)
Every contact action is wired in the prototype's `logTicket(rec)` → `window.IBStore.support.add(rec)`.
In React this is **`SupportService.add(ticket)` → DataSource** (the `support` spine group →
`ib_support_tickets` / `ib:support`, Portal ↔ Admin — see [../../../docs/integration.md](../../../docs/integration.md) §3). The
ticket reaches the **Admin support desk** and is mirrored back into "My tickets".

| Channel | Trigger | Behaviour (verbatim flow) | Ticket record |
|---------|---------|---------------------------|---------------|
| **Live chat** | `data-help-action="chat"` | Opens the right-side chat widget (`ibOpenChatModal`). | `ch:'chat'` |
| **WhatsApp** | `data-help-action="whatsapp"` | Picker drawer ("Pick what you need help with… we'll open WhatsApp with a ready message and log it to our team so nothing is missed"). On pick: **logs ticket** then opens `wa.me/918920898168` with the ready message; toast "Logged · opening WhatsApp". | `ch:'whatsapp', subject, body, tag` |
| **Email** | `data-help-action="email"` | Picker drawer ("Choose a subject — we'll open your email ready to send to help@interiorbazzar.com, and log it to our team"). On pick: **logs ticket** then `mailto:help@interiorbazzar.com?subject=…`. | `ch:'email', subject, tag` |
| **Call** | `data-help-action="call"` | Drawer showing **+91 8920898168** with "Call now" (`tel:+918920898168`) + "Copy". | (no ticket; direct call) |
| **Feedback** | `data-help-action="feedback"` | The shared feedback flow (`feedback` spine group → `ib:feedback`), separate from support. | n/a (feedback group) |

Each ticket carries `source:'help-center'` and (when signed in) `user`/`email` from `ib_auth`.

## 6. Data
Mostly static content (articles, FAQ, topics, tutorials, status); the live writes are support tickets,
and the live read is "My tickets". All via services → DataSource — **never** raw `localStorage`/
`IBStore`/`fetch` (see [../../../docs/environment-and-backend.md](../../../docs/environment-and-backend.md)).

| Section | Service (local-first) | Spine/source |
|---------|-----------------------|--------------|
| Search / FAQ / topics / tutorials / channels / status | `SupportService` content getters (e.g. `articles()`, `faqs()`, `topics()`, `tutorials()`, `channels()`) | static content (`help-support.content.ts`) |
| Contact actions (chat/WhatsApp/email) | **`SupportService.add(ticket)`** (write) | `support` (`ib_support_tickets` → `ib:support`) — Admin Help Desk |
| My tickets | **`SupportService.list()` / `SupportService.mine()`** (read, filtered to current user/device) | `support` |
| Feedback | `FeedbackService.add()` | `feedback` (`ib_feedback_queue` → `ib:feedback`) |

Tickets surface live in the Admin support desk and re-render "My tickets" via `subscribe('ib:support', …)`.

## 7. Primary CTA
**Primary** — "Start 24/7 chat" (the fastest human path; also the "Live chat" channel card). Secondary:
- "Send feedback" (ribbon + feedback card) → feedback flow.
- "WhatsApp us" / "Email us" / "Call us" channel cards → picker drawer → ticket + channel.
- "Search" (hero) and topic buttons → help-article drawer.
- "All FAQs" / "All tutorials" / "Subscribe to updates" / "Visit forum" → their lists.
- "Contact us" (empty My-tickets state) → opens the WhatsApp picker.

Use exact strings from [../copywriting.md](../copywriting.md) ("Send feedback", "Send query").

## 8. States
- **Loading:** skeleton for FAQ / topics / tutorials / My-tickets rows (standard skeleton, not a bare
  spinner); the static bands render immediately.
- **Empty (My tickets):** "No tickets yet. Reach us on WhatsApp, email, or chat and we'll track it
  here for you." + a "Contact us" CTA (never a dead end).
- **Empty (search):** the article drawer shows "No articles matched. Try a contact option below — a
  real person will help." with the contact footer.
- **Success:** ticket logged → toast ("Logged · opening WhatsApp" / "Number copied") then the channel
  opens; My tickets updates live.
- **Error:** a failed ticket write keeps the drawer open with a quiet retry; the page still renders.

## 9. Responsive
- Desktop: 4-up channel/topic/tutorial grids; FAQ row is `1.6fr / 1fr` (`.hs-twocol`).
- ≤720px: sidebar → drawer; grids reflow to 1–2 up; the two-column FAQ/status stacks; channel cards
  full width.
- Contact drawers (`.hsd-panel`) are right-side, `width:420px` desktop → **full width ≤480px**.
- Touch targets ≥ 38px (channel cards, topic buttons, drawer picks already exceed this).

## 10. Accessibility
- Landmarks: `header` (topbar), `nav`/`aside` (sidebar), `main`; each section a `<section>` named by
  its `.sec-title` (`aria-labelledby`).
- Headings: **one H1** = "How can we *help you* today?"; each `.sec-title` is an H2.
- Search: labelled `#helpSearch` (combobox-style); chips are real buttons.
- FAQ / topic accordions: `<button>` headers with `aria-expanded`; panels keyboard-operable.
- Channel cards: real `<button>`s with accessible names (not bare `<div data-help-action>` — fix the
  prototype gap); icons `aria-hidden`.
- Contact drawers (`hsDrawer`): already `role="dialog"` + `aria-modal="true"`; add `aria-labelledby`
  the title, **trap focus**, Esc + backdrop close (Esc already wired), return focus to the trigger.
- Status uses icon+text ("✓ Operational"), not colour alone.
- Full checklist: [../modules-features-flow.md](../modules-features-flow.md) §5.

## 11. Copy
- Eyebrows/titles **verbatim** from §5 (lowercase eyebrows; serif titles with green `<em>`).
- Brand name lowercase-b "Interior bazzar"; British "enquiry"; CTAs Title Case, no caps/"!".
- Reassurance copy verbatim where trust matters: "we'll open WhatsApp with a ready message and log it
  to our team so nothing is missed", "we read every message", "most people get an answer in under 12
  minutes". WhatsApp/email ready-messages from `WA_TAGS` (e.g. "Hi Interior bazzar, my enquiry hasn't
  reached the business yet. Can you help me check?").
- Channel facts verbatim: phone **+91 8920898168**, email **help@interiorbazzar.com**, hours.
- All strings cross-checked against [../copywriting.md](../copywriting.md).

## 12. SEO
`PublicPage` with: title "Help & Support — Interior bazzar" (matches prototype `<title>`), a one-line
description ("Search help articles & FAQs, or reach a human on chat, WhatsApp, email or call"),
canonical "/help". (Final strings confirmed against the prototype before build.)

---

### Build notes (React)
- Page shell: `src/pages/Help/index.tsx` + `useHelp.ts` + `Help.module.css`; composes the 7 sections in
  order. Content from `src/content/help-support.content.ts` (`HELP_CONTENT`).
- **All contact writes go through `SupportService` → DataSource** — never `window.IBStore.support` or
  raw `localStorage`. `SupportService.add()` mirrors the prototype's `logTicket()` (stamps
  `source:'help-center'`, user/email, `ch`/`subject`/`body`/`tag`) and lands in the Admin Help Desk
  (`support` group, [../../../docs/integration.md](../../../docs/integration.md)).
- "My tickets" reads `SupportService.mine()` and re-renders on `subscribe('ib:support', …)`.
- The chat widget, WhatsApp/email/call drawers and feedback flow are shared overlays, opened by the
  channel buttons.
- Verify visually with the headless-screenshot method (portal-conversion memory): compare `/help`
  against `file:///…/pages/help-support.html`. Gate with `tsc -b` + `vite build`.
