# PAGE: Legal

```
PROTOTYPE: pages/{terms,privacy,refund,disclaimer,cookies}.html        ROUTE: PAGES.LEGAL ("/legal/:doc")        LAYOUT: Browsing (topbar + sidebar)
```

ONE component renders all five compliance documents. `:doc ∈ { terms | privacy | refund | disclaimer
| cookies }` selects which long-form policy to show; the chrome (hero, table of contents, prose
layout, cross-links, footer) is identical across all five. In the prototype the policies are produced
by **`assets/generate-policies.js`** (one source of truth for terms / privacy / refund / cookies; the
disclaimer is a matching hand-written file) — so in React the **content is static prose**, not a live
read. Everything in [README.md](README.md) §B is answered below.

---

## 1. Purpose
Present Interior bazzar's binding legal/compliance documents — terms, privacy, refund, disclaimer,
cookies — as readable, navigable long-form prose, each selected by route, drafted for an Indian SaaS
marketplace (intermediary under the IT Act 2000; privacy to the DPDP Act 2023).

## 2. Journey
- **Actor:** Both (buyer & seller) — institutional/trust content.
- **Stage:** Trust (a side journey, reachable from any footer "Terms / Privacy / …" link and from
  Connect/Auth "you agree to our Terms of Service and Privacy Policy").
- **Precedes:** nothing in a flow; cross-links to its sibling documents.
- **Leads to:** another legal doc (via TOC sibling links) or back to wherever the user came from.

## 3. Auth
**Public.** Always readable; no login, no gated action. Pure reference content.

## 4. Layout
**Browsing layout** — fixed topbar (`#ib-topbar`, **`data-active=""`** — no nav item is highlighted)
+ sidebar + a dedicated long-form prose shell `.lx-wrap` (not the card grid). Structure:
`.lx-hero` (eyebrow + H1 + sub + meta) → `.lx-grid` = sticky `.lx-toc` (`<nav>`) + `.lx-art`
(`<article>` of `.lx-sec` sections). Sidebar visible.

## 5. The five documents + shared layout
**Same `lx-` chrome, one per route `:doc`.** Each: `.lx-eyebrow` "Interior bazzar · Legal" → `.lx-h1`
(title, verbatim below) → `.lx-sub` (one-line scope) → `.lx-meta` (Effective **20 June 2026**, Version
**v1.0**, Operated by **Feelsafe Technology India Private Limited**, CIN **U62090DL2024PTC434514**) →
`.lx-grid` with a `.lx-toc` ("On this page", a `<details open>` `<ol>` of `#anchor` links) and a
`.lx-art` of numbered `<section class="lx-sec" id="…"><h2><span class="n">NN</span>…</h2>` blocks,
opening with a `.lx-intro` and closing on a **Grievance Officer / contact** section. Sibling docs are
cross-linked in the intro (e.g. terms → `privacy.html`, `refund.html`, `cookies.html`).

| `:doc` | `.lx-h1` (verbatim) | `<title>` | Scope (`.lx-sub`, gist) | Notable sections |
|--------|---------------------|-----------|-------------------------|------------------|
| `terms` | **Terms & Conditions** | "Terms & Conditions — Interior bazzar" | The binding agreement to use the Platform (SaaS networking / portfolio / enquiry-routing). | 21 sections: Definitions; **Our role — what the Platform is, and is not**; Eligibility; Subscriptions, plans and billing; Acceptable use; User Content; IP; Third-party services; **Enquiries, matching and exclusivity**; Verification; Disclaimers; Limitation of liability; Indemnity; Suspension/termination; Confidentiality of enquiry data; Changes; Force majeure; Governing law (India, New Delhi); Dispute resolution; **Grievance Officer**; General. |
| `privacy` | **Privacy Policy** | "Privacy Policy — Interior bazzar" | How personal data is handled (Data Fiduciary / Data Principal under DPDP Act 2023). | Data collected, purposes, sharing, retention, your rights, Grievance Officer. |
| `refund` | **Return & Refund Policy** | "Return & Refund Policy — Interior bazzar" | Refund/return terms for Platform subscriptions (IB is not a party to buyer↔business transactions). | Plan refunds, eligibility, process, contact. |
| `disclaimer` | **Disclaimer** | "Disclaimer — Interior bazzar" | Platform is an intermediary; no endorsement/warranty of listed businesses. | Intermediary status, no project commission, limitation. |
| `cookies` | **Cookies Policy** | "Cookies Policy — Interior bazzar" | What cookies/storage are used and choices. | Categories of cookies, third-party (Google/Meta), choices. |

**Canonical facts (shared, from `generate-policies.js`):** legal entity **Feelsafe Technology India
Private Limited**, CIN **U62090DL2024PTC434514**, contact **help@interiorbazzar.com**, governing
law India / courts at New Delhi, Grievance Officer per IT Act 2000 + Consumer Protection (E-Commerce)
Rules 2020 + DPDP Act 2023.

## 6. Data
**No services, no writes, no spine** — content is static prose bundled at build (the React port of
`generate-policies.js`'s single source of truth). Read the five documents from a typed content module
(e.g. `legal.content.ts`, keyed by `:doc`); resolve the route param to the matching document. Cross-doc
links and the TOC anchors are part of that static content. (Still no raw `fetch`/`localStorage` — but
here there is simply nothing dynamic to read.)

## 7. Primary CTA
**None — reference content.** The only actions are navigation: TOC anchor links (jump within the
document) and the **sibling cross-links** (terms ↔ privacy ↔ refund ↔ cookies, and the disclaimer).
"Read the full disclaimer" (from [../copywriting.md](../copywriting.md)) is the canonical cross-link label where
another page points here.

## 8. States
- **Loading:** content is static/bundled — render immediately (skeleton only if code-split lazily).
- **Empty:** n/a (the documents always exist).
- **Error / bad `:doc`:** an unknown `:doc` value (not one of the five) → 404 / "Document not found"
  with a link back to Home and to the other documents (never a dead end).
- **Success:** n/a.

## 9. Responsive
- Desktop: `.lx-grid` = sticky TOC sidebar + prose column.
- ≤ tablet: the `.lx-toc` `<details>` collapses to a "On this page" disclosure above the prose; the
  prose column goes full width.
- Long prose stays comfortably measured (max line length); anchor links keep working on mobile.
- Touch targets ≥ 38px for TOC + cross links.

## 10. Accessibility
- Landmarks: `header` (topbar), `nav.lx-toc` (the in-page contents), `main` → `article.lx-art`.
- Headings: **one H1** = the document title (`.lx-h1`); each `.lx-sec` heading is an H2 with its
  number in a `<span class="n">` (decorative — `aria-hidden`, so the accessible name is the text).
  No skipped levels.
- TOC links target real section `id`s; ensure visible focus on each.
- `<details>` disclosure is keyboard-operable; respect `prefers-reduced-motion` on the open animation.
- Set `<html lang="en-IN">` (prototype gap to fix). Full checklist:
  [../modules-features-flow.md](../modules-features-flow.md) §5.

## 11. Copy
- **Do not rewrite the legal text** — it is reviewed prose; port it verbatim from the prototype
  (the generated HTML / `generate-policies.js`).
- Brand voice still enforced in the source: lowercase-b "Interior bazzar"; the word "lead" never
  appears (use "qualified enquiries"); **budget is never a qualification criterion** (qualification is
  only contact / genuineness / urgency); **no exclamation marks**; British/Indian spelling ("enquiry",
  "catalogue"). Tagline "Little things." (Cormorant Garamond italic, full stop).
- Eyebrow verbatim: "Interior bazzar · Legal". Meta verbatim (entity, CIN, effective date, version).

## 12. SEO
`PublicPage`, one per `:doc`. Title = the document's `<title>` verbatim (e.g. "Terms & Conditions —
Interior bazzar"); description = the `.lx-sub` scope line; canonical "/legal/<doc>". Each document is
independently indexable.

---

### Build notes (React)
- One page component: `src/pages/Legal/index.tsx` + `useLegal.ts` (reads `:doc` via `useParams`) +
  `Legal.module.css`; renders the resolved document from `src/content/legal.content.ts` (the React
  port of `generate-policies.js`'s canonical facts + clauses — one source of truth; edit once,
  all five stay consistent).
- Five routes (`/legal/terms`, `/legal/privacy`, `/legal/refund`, `/legal/disclaimer`,
  `/legal/cookies`) all map to this component via `PAGES.LEGAL` ("/legal/:doc").
- Reuse `.lx-` chrome (hero / TOC / prose) as a shared `LegalLayout`; the per-doc body is data.
- No spine, no `SupportService`/`fetch` — purely static. Cross-links use `PAGES.LEGAL` with the
  sibling `:doc`.
- Verify visually with the headless-screenshot method (portal-conversion memory): compare each
  `/legal/<doc>` against `file:///…/pages/<doc>.html`. Gate with `tsc -b` + `vite build`.
