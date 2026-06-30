# PAGE: About

```
PROTOTYPE: pages/about-ib.html        ROUTE: PAGES.ABOUT ("/about")        LAYOUT: Browsing (topbar + sidebar)
```

The trust / "why we exist" story — the platform's argument for itself, ending on the seller invitation
"List my business". Everything in [README.md](README.md) §B is answered below.

---

## 1. Purpose
Earn belief: explain the discovery problem Interior bazzar solves, how it works for both sides, what it
stands for, and who builds it — then route the reader to the next step (find a designer, or list a business).

## 2. Journey
- **Actor:** Both — a buyer deciding whether to trust the platform, and a prospective seller deciding
  whether to list.
- **Stage:** Discover / consider (trust surface, off the main funnel).
- **Precedes:** Home (find a designer) or Plans & checkout (list a business).
- **Leads to:** "Find designers near me" → Home; **"List my business" → Plans & checkout**.

## 3. Auth
**Public.** Static trust content; no gated action on the page. The two final CTAs are plain navigation.

## 4. Layout
**Browsing layout** — fixed topbar (`#ib-topbar`, `data-active="about"`) + collapsible left sidebar
(`#sidebar`) + `<main class="main" id="main">`. A long-form single column of stacked `<section>`s.

## 5. Sections (top → bottom — exact prototype order)
A long-form story page, not the Home feed — it uses its own `.section-label` eyebrow + `.section-h2`
serif heading (with `<em>` in green), not the `.sec-eye`/`.sec-title` SectionHeader. Quote
**verbatim**:

| # | Section | Component | Eyebrow / Title (verbatim) | Content |
|---|---------|-----------|----------------------------|---------|
| 1 | Hero | `AboutHero` | eyebrow "India's interior design marketplace"; H1 "Where design *businesses*<br>find their next client." | `.about-hero`: lead "Interior bazzar connects interior designers, architects, showrooms and retailers with people actively looking for them — through qualified enquiries, not noise."; `.trust-row` badges ("Govt. of India · MSME registered", "Feelsafe Technology India Pvt Ltd", "Based in New Delhi"); graphic "Interior bazzar" / "FIND YOUR MATCH". |
| 2 | Stats strip | `StatsStrip` | — | `.stats-strip`: "500+ Verified businesses", "12K+ Qualified enquiries", "28+ Cities covered", "4.8★ Average listing rating". |
| 3 | Problem / solution | `ProblemSolution` | "The problem we solve" → "The interior industry had a *discovery problem.*" | `.ps-grid`: "Before Interior bazzar" vs "With Interior bazzar" cards. |
| 4 | How it works | `HowItWorks` | "How it works" → "Simple for buyers.<br>*Powerful* for sellers." | Two columns ("For homeowners & buyers" / "For interior professionals & businesses"), each a 3-step `.how-steps` list. |
| 5 | Values | `Values` | "Our principles" → "Built on things we actually *believe in.*" | `.values-grid` of 6: "Manual verification, always", "Qualified, not volume", "No ads. No broker fees.", "Honest reviews", "India-first design", "Builder mindset". |
| 6 | Team | `Team` | "The team" → "Small team. *Big* conviction." | `.team-grid`: "Vishal Shakya · Founder · CEO", "Interior bazzar Team · Design · Engineering · Ops", "We're hiring · Join us". Built by Feelsafe Technology India Pvt Ltd. |
| 7 | CTA band | `AboutCTA` | "Ready to find your match?" | `.about-cta`: sub "Whether you're looking for a designer, or you are one — Interior bazzar was built for you."; buttons "Find designers near me" (→ home) and **"List my business"** (→ plans-checkout); contact line `help@interiorbazzar.com` · `+91 8920898168`. |

> A static story page: no `posts`/listing reads. The numbers in the stats strip are brand copy in the
> prototype (not a live service).

## 6. Data
**No service reads or writes.** This is static trust copy — the page renders fixed content. No spine
groups, no `localStorage`/`fetch`. The only outbound links are navigation (Home, Plans & checkout) and
`mailto:`/`tel:` contact links. (Per the local-first rule there is simply nothing to fetch; see
[../../Environment-Management-backend.md](../../Environment-Management-backend.md).)

## 7. Primary CTA
**"List my business"** (the CTA band, `.cta-btn ghost`) → Plans & checkout — the seller invitation this
page builds toward. Secondary:
- "Find designers near me" (`.cta-btn primary`) → Home.
- Contact links: `help@interiorbazzar.com`, `+91 8920898168`.

Every CTA resolves to the next step. Use exact strings from [../copywriting.md](../copywriting.md)
("List my business", "Find designers near me" are both in the CTA library).

## 8. States
- **Loading / empty / error:** n/a — static content with no async data; the page always renders fully.
- The page is never a dead end: the closing CTA band always offers a forward action for both audiences.

## 9. Responsive
- Desktop: hero split (copy / graphic); 4-cell stats strip; two-column "How it works"; 6-card values
  grid; 3-card team grid.
- ≤720px: sidebar → drawer; hero stacks; stats strip wraps to 2×2; "How it works" and grids reflow to
  one column; CTA buttons stack full-width.
- Touch targets ≥ 38px.

## 10. Accessibility
- Landmarks: `header` (topbar), `nav`/`aside` (sidebar), `main`; each block a `<section>` named by its
  `.section-h2` (`aria-labelledby`).
- Headings: **one H1** = the hero "Where design businesses find their next client."; every `.section-h2`
  and the CTA head are H2. No skipped levels.
- Decorative icons/emoji (`ti-rosette`, 😩/✅ in cards) are `aria-hidden`; trust badges read as text.
- CTAs are real `<a>` links with accessible names; contact links use `mailto:`/`tel:`.
- Stats convey meaning in text (number + label), not colour. Focus visible on every link.
- Full checklist: [../modules-features-flow.md](../modules-features-flow.md) §5.

## 11. Copy
- All eyebrows, serif headings (`<em>` keyword in green), card and step text, stats, CTA band: **verbatim**
  from §5.
- Brand name lowercase-b "Interior bazzar" throughout. British "enquiry". CTAs Title Case, no caps/"!".
- This page is the canonical home of several brand-voice lines ("Where design *businesses* find their
  next client.", "qualified enquiries, not noise", "Manual verification, always") quoted in
  [../copywriting.md](../copywriting.md) — keep them word-for-word.

## 12. SEO
`PublicPage` with: title from the prototype `<title>` "About Interior bazzar — Find your match", a
one-line description echoing the lead ("connecting designers, architects, showrooms and retailers with
buyers through qualified enquiries, not noise"), canonical "/about". (Final strings confirmed against
prototype `<title>`/meta before build.)

---

### Build notes (React)
- Page shell: `src/pages/About/index.tsx` + `About.module.css`; composes AboutHero, StatsStrip,
  ProblemSolution, HowItWorks, Values, Team, AboutCTA in order. No data hook needed (static content) —
  copy lives in `src/content/about.content.ts` so it stays editable without touching markup.
- Cross-link the two CTAs to `PAGES.HOME` and `PAGES.PLANS` (Plans & checkout); contact via
  `mailto:`/`tel:`.
- Verify visually with the headless-screenshot method (portal-conversion memory): compare `/about`
  against `file:///…/pages/about-ib.html`. Gate with `tsc -b` + `vite build`.
