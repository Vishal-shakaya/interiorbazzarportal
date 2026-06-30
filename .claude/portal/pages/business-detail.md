# PAGE: Business detail

```
PROTOTYPE: pages/business-detail.html        ROUTE: PAGES.BUSINESS_DETAIL ("/business/:slug")        LAYOUT: Browsing (topbar + centred reading column)
```

The buyer's **evaluate** page for a studio/showroom. Everything in
[README.md](README.md) §B is answered below. The whole point of the page is to
earn enough trust that the buyer opens the Connect modal — every section feeds that one decision.

---

## 1. Purpose
Give a buyer everything they need to evaluate one studio/shop — who they are, what they've built, what
they sell or book, what clients say, and where to find them — and route a decided buyer into a Connect
enquiry (intent `project`/`service`/`product`/`shop`).

## 2. Journey
- **Actor:** Buyer (primary).
- **Stage:** Evaluate.
- **Precedes:** the Connect modal (the enquiry); recently-viewed re-entry.
- **Leads to:** Connect (intent `project` from header/rail/final-CTA; `service` from offerings/"Request a
  call"; `product` from a product card; `shop` from "Book a visit"), Auth (login gate on Connect step 1),
  Buyer dashboard (after a sent enquiry).

## 3. Auth
**Public.** No login to view the profile, browse offerings, or read reviews. The login gate fires later —
on the Connect action — specifically when the buyer hits **Continue** on Connect step 1 (see
[../modules-features-flow.md](../modules-features-flow.md) §1.1 gating rule). The
page tracks itself into recently-viewed on load (`IBRV.track`, type `business`).

## 4. Layout
**Browsing layout** — fixed topbar (`#ib-topbar`, `data-active="businesses"`, `--nav-h:60px`) over a
**centred reading column** (`.wrap`, `max-width:1080px`), not the listing 4-col shell. Two page-level
navigation chrome pieces sit above the column:
- **Top tabs** (`.toptabs`, sticky at `top:var(--nav-h)`, `z:25`) — Overview / Products / Services /
  Catalogue / Reviews — switch `.toppane`s.
- **Sticky action rail** (`.rail#rail`) — fixed, hidden until scrolled past the header
  (`.rail.visible`), carrying scroll-spy section nav + share/save/report + the primary "Send enquiry".

## 5. Sections (top → bottom — exact prototype order)
Section headers use `.sec-eyebrow` (uppercase green, with an icon) + `.sec-title` (Fraunces serif 27px).
Quote eyebrows/titles **verbatim**. The page is the **Overview** pane plus four alternate tab panes.

| # | Section / pane | Anchor / id | Eyebrow → Title (verbatim) | Content |
|---|----------------|-------------|----------------------------|---------|
| 1 | Banner | `.banner` | — | Gradient cover image; `.banner-badge` "IB Verified · Top 8%". |
| 2 | Light header | `header.lhead` | — | `.lhead-logo` "VS"; **H1** `.lhead-name` "Verma Design Studio"; tagline "Interior · Architecture · Turnkey — led by **Ar. Rahul Verma** in New Delhi"; trust chips ("IB Verified", "4.6 · 52 reviews", "Open · 10am–7pm", "15 years active", "Serves 8 states"); save/share icon buttons; `#bdHeadCta` (mounted contact-CTA buttons); 5-up stats strip (120+ / 4.6 / &lt;4h / 98% / ₹25L+). |
| 3 | Top tabs | `#toptabs` | — | Overview · Products · Services · Catalogue · Reviews (`.toptab`, `data-toptab`). |
| 4 | Sticky rail | `#rail` | — | Logo + "★ 4.6 · IB Verified"; rail-nav About/Work/Offerings/Reviews/Visit (scroll-spy); share/save/report; "Send enquiry" (`IBConnect.open({intent:'project'…})`). |
| **Overview pane** (`#top-overview`) | | | | |
| 5 | About | `#sec-about` | "About the studio" → (no title; intro prose) | About prose + "Read more" expander (`#aboutExtra`); `.about-card` "At a glance" snapshot (Founded/Team/Languages/Project range/Response time); trust strip ("COA registered", "GST active", "Professional liability insured", "Responds in &lt;4h"). |
| 5a | Specializations | (within About) | "What they specialize in" → — | `.spec-grid` 6 tiles (Residential interiors, Commercial fit-outs, Hospitality design, Architectural design, Turnkey execution, Material consulting). |
| 6 | Work | `#sec-work` | "Selected work" → "Projects that show the range" | Architect feature card (Ar. Rahul Verma + tags + quote); `.proj-grid` 6 project cards; "Full portfolio (120+)" link. |
| 7 | Offerings | `#sec-offerings` | "What you can buy or book" → "Products, services & catalogues" | `.off-tabs` Products (6) / Services (6) / Catalogue (4); product `.prod` grid → `askProduct()`; service `.svc-list` + "Book a consultation"; catalogue `.cat-list` → `viewCatalogue()`. |
| 8 | Reviews | `#sec-reviews` | "What clients say" → "Reviews from real projects" | `.rev-score` 4.6 + star histogram (74/18/6/1/1%); 3 verified `.rev` cards; "See all 52" link; "Write a review". |
| 9 | Visit | `#sec-visit` | "Showroom & contact" → "Come visit, or reach out" | Contact card (address/phone/WhatsApp/website/email — masked); business-hours card (today highlighted, Open/Closed) + "Book a visit" (`intent:'shop'`); "Get directions" link. |
| 10 | Final CTA | `.final-cta` | — | H2 "Like what you see? Start a conversation."; sub; "Send enquiry" / "WhatsApp" / "Request a call"; privacy line "Your contact stays private until you choose to share it"; "What happens after enquiry" 3-step list. |
| 11 | Footer | `.bd-foot` | — | "Verma Design Studio · IB Verified · Member since 2024 · Share this profile". |
| **Alt panes** | `#top-products` / `#top-services` / `#top-catalogue` / `#top-reviews` | — | "Products"/"Services"/"Catalogue"/"Reviews" eyebrows | Standalone tab views mirroring the Overview offerings/reviews content. |

> A functional **share sheet** (`#shareSheet`) and a **report** action (`IBReport.open`) are present but
> are secondary chrome, not journey sections.

## 6. Data
Read-mostly page; the only write is the Connect enquiry (owned by the modal — see
[connect-modal.md](connect-modal.md)) and the save/recently-viewed writes. All via services →
DataSource, **never** raw `localStorage`/`fetch` (see
[../../Environment-Management-backend.md](../../Environment-Management-backend.md) and
[../../Integration.md](../../Integration.md)).

| Section | Service (local-first) | Spine/source |
|---------|-----------------------|--------------|
| Profile / header / about / stats | `BusinessService.get(slug)` | business listing content |
| Projects (Work) | `BusinessService.projects(slug)` | portfolio content |
| Offerings (products/services/catalogues) | `ProductService.byBusiness(slug)`, `ServiceService.byBusiness(slug)`, `CatalogueService.byBusiness(slug)` | listing content |
| Reviews | `ReviewService.forBusiness(slug)` | reviews content |
| Save (bookmark) | `SaveService.toggle(id)` | saved group |
| Recently viewed | `RecentlyViewedService.track({type:'business',…})` | `ib_rv` (replaces prototype `IBRV.track`) |
| Connect enquiry (write) | `EnquiryService.submit(record)` → modal | `enquiries` group → `ib:sharedenquiry` |

In the prototype the page reads from one hardcoded record ("Verma Design Studio"). The React port loads
the same shape by `:slug` through `BusinessService` so content edits surface unchanged when wired to API.

## 7. Primary CTA
**"Send enquiry"** — opens the Connect modal at `intent:'project'`
(`IBConnect.open({intent:'project',sellerName:'Verma Studio'})`); appears in the rail and the final CTA
band. Secondary CTAs (each resolving to the next step), all verbatim:
- Header `#bdHeadCta` mounted buttons (WhatsApp / Call / "Send query") via `IBContact.renderButtons`
  (`routingMode:'both'`), forms: "Start an interior project", "Book a consultation", "Product / material enquiry".
- "Book a consultation" (offerings/services) → Connect `intent:'service'`.
- "Request a call" (final CTA) → Connect `intent:'service'`.
- "Book a visit" (visit) → Connect `intent:'shop'`.
- Product card → `askProduct(name)` → Connect `intent:'product'`, `itemName`.
- Catalogue card → `viewCatalogue(name)` → toast then Connect `intent:'project'`.
- Save (`toggleSave`, syncs rail + header), Share (`shareBiz` → share sheet / Web Share), Report (`IBReport.open`).

Use exact strings from [../copywriting.md](../copywriting.md) (§3 — "Connect", "Send enquiry",
"Send query", "Book a consultation", "Request a callback", "Visit the showroom", "Check availability").

## 8. States
- **Loading:** skeleton for header, stats strip, and each section grid (standard skeleton component — not
  a bare spinner; the prototype has none, the React port adds it).
- **Empty:** a studio with no projects/products/services/catalogues/reviews **omits that offerings tab or
  section** rather than showing an empty grid; an offerings tab with zero items isn't rendered. The page
  always still offers Connect (never a dead end).
- **Error:** a failed section degrades to hidden with a quiet inline retry; the rest of the profile still
  renders; a failed profile load (bad slug) → not-found with "Start browsing".
- **Success:** the save toast ("Saved to your list" / "Removed from saved", "Link copied!"); the Connect
  success screen is owned by the modal ([connect-modal.md](connect-modal.md)).

## 9. Responsive
- Desktop: centred 1080px column; about `1.7fr / 1fr`; specs/projects 3-col; products 4-col; reviews
  `300px / 1fr`; visit + final CTA 2-col.
- ≤880px: about/reviews/visit/final-grid → single column; specs/projects → 2-col; products → 2-col;
  services/catalogue → 1-col; architect feature stacks + centres; **rail-nav hidden** (`.rail-nav{display:none}`).
- ≤560px: specs/projects/products → 1-col; column padding tightens; rail sub-line hidden.
- Sticky top tabs + sticky rail stay usable; touch targets ≥ 38px (rail icon buttons are 38px).

## 10. Accessibility
- Landmarks: `header` (topbar) + `header.lhead`, `<main class="wrap">`, each Overview block a `<section>`
  named by its `.sec-title`/eyebrow (`aria-labelledby`); the rail nav is a labelled `<nav>`.
- Headings: **one H1** = `.lhead-name` "Verma Design Studio"; each `.sec-title` is an H2; no skipped levels.
- Tabs: top tabs + offerings tabs are a real tablist (`role="tab"`/`tabpanel"`, `aria-selected`,
  arrow-key operable); scroll-spy rail links set `aria-current` on the active section.
- Rating/histogram: star rating has a text equivalent ("4.6 · 52 reviews"); the review histogram rows
  pair the number with its bar (state, not colour alone).
- Icon-only buttons (save/share/report/close) carry `aria-label`; decorative `ti` icons `aria-hidden`.
- Open/Closed status pairs an icon + text, never colour alone.
- Full checklist: [../modules-features-flow.md](../modules-features-flow.md) §5.

## 11. Copy
- Section eyebrows/titles **verbatim** from §5 (serif titles, uppercase green eyebrows).
- Brand name lowercase-b "Interior bazzar"; British "enquiry"/"catalogue". CTAs Title Case, no caps/"!".
- Trust/process microcopy from the prototype: "Your contact stays private until you choose to share it",
  "We forward only serious enquiries — so when Verma Studio replies, you know it's a genuine fit",
  "Responds in &lt;4h". Save toasts "Saved to your list" / "Removed from saved".
- All strings reconciled against [../copywriting.md](../copywriting.md) (§2 — studio/showroom,
  enquiry, verified; §3 — CTA library).

## 12. SEO
`PublicPage` with: title "<Studio name> — Interior bazzar" (prototype `<title>` = "Verma Design Studio —
Interior bazzar"), description echoing the studio's specialisations + city + verified status, canonical
"/business/:slug". (Final strings confirmed against the prototype `<title>`/meta before build.)

---

### Build notes (React)
- Page shell: `src/pages/BusinessDetail/index.tsx` + `useBusinessDetail.ts` (reads `:slug` via the
  router, **not** `useState`) + `BusinessDetail.module.css`; composes the section components +
  Overview/Products/Services/Catalogue/Reviews tab panes.
- The Connect CTAs call the shared `IBConnect.open(...)` overlay (see [connect-modal.md](connect-modal.md));
  the page never builds its own enquiry form. The header contact buttons port `IBContact.renderButtons`.
- Save / recently-viewed / report go through services → DataSource; replace the prototype's `IBRV.track`,
  `toggleSave` localStorage and `IBReport.open` with `RecentlyViewedService`/`SaveService`/`ReportService`.
- Verify visually with the headless-screenshot method (portal-conversion memory): compare
  `/business/verma-design-studio` against `file:///…/pages/business-detail.html`. Gate with `tsc -b` + `vite build`.
