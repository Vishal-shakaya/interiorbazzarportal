# PAGE: Service detail

```
PROTOTYPE: pages/service-detail.html   ROUTE: PAGES.SERVICE_DETAIL ("/services/:id")   LAYOUT: Browsing (topbar + sidebar)
```

An **evaluate** page: one interior service, in full, so a buyer can decide and enquire. Everything in
[README.md](README.md) §B is answered below. The primary CTA opens the shared
**Connect modal** with intent **`service`**.

---

## 1. Purpose
Let a buyer fully evaluate a single interior service — gallery, price, process, portfolio, provider,
reviews, FAQ — and route them into a qualified Connect enquiry (intent `service`) to that one provider.

## 2. Journey
- **Actor:** Buyer (primary).
- **Stage:** Evaluate (the step between a listing and Connect).
- **Precedes:** the Connect modal; the buyer dashboard (after the enquiry lands).
- **Leads to:** Connect (intent `service`) → login gate → success; or sideways into a similar service,
  a sibling service from the same provider, or back to `services.html`.

## 3. Auth
**Public.** The page and every tab (Overview, Process, Portfolio, About provider, Reviews, FAQ) are
browsable anonymous. The **login gate fires on the Connect action** — "Contact provider" / "Book free
consult" / "Contact this provider" all call `openConn()`, which routes through `IBConnect.open()`; the
gate is on Connect step 1, not on the page. Save/Share are also gated at the action.

## 4. Layout
**Browsing layout** — fixed topbar (60px) + collapsible left sidebar (240/72px) + `<main class="main">`
(shell `max-width:1600px`, `.main-inner` 80% width). The page body is `.sd-page`.

## 5. Sections (top → bottom — exact prototype order)
Detail pages do **not** use the `.sec-eye`/`.sec-title` SectionHeader of the feed pages; the suggestion
rows at the bottom use `.section-title` with a green `<em>`. Quote copy **verbatim**:

| # | Section | Container | Content (verbatim from prototype) |
|---|---------|-----------|-----------------------------------|
| 1 | Gallery | `.sd-top` → `.sd-gallery` | `.sd-main-img` (`#mainPhoto`, `alt="Service preview"`) with prev/next arrows + `1 / 5` counter; badges "Most booked", "IB Verified"; 5 `.sd-thumb` strip. |
| 2 | Info / header + price + CTAs | `.sd-info` | Tags `Interior Design` · `IB Verified` · `Delhi NCR`; **H1** `.sd-title` "End-to-End Residential Interior Design"; provider "By Verma Design Studio" + "Responds in 4 hrs"; rating row "★★★★★ 4.8 (312 reviews) · 4.2k interested · 8 yrs trusted"; price "₹85 /sq ft onwards" + "12% off for IB users" + "+ 18% GST applicable…"; tag chips; meta chips ("45–60 day delivery", "IDA Award 2024", "8-person team"); **CTAs** "Contact provider" + "Book free consult"; save/share/report/back icon row; "What happens after you contact" 4-step box; trust row. |
| 3 | Tabs | `.sd-tabs-section` | Tab nav: **Overview · Process · Portfolio (9) · About provider · Reviews (312) · FAQ** (`sdTab()` swaps `.sd-tab-pane`). |
| 3a | Overview pane | `#st-overview` | Lead quote + 3 description paragraphs + `.desc-tag` chips. |
| 3b | Process pane | `#st-process` | 6 `.process-step-full` steps (01 Discovery & briefing call → 06 Handover & styling), each with duration/warranty pills. |
| 3c | Portfolio pane | `#st-portfolio` | `.portfolio-grid` of 9 `.pf-item` projects with `.pf-overlay-title` + location/sqft (e.g. "Mehta Residence — 4BHK Luxury", "Gurugram · 2,400 sqft"). |
| 3d | About provider pane | `#st-provider` | `.provider-grid`: logo "VD" / "Verma Design Studio" / badges (IB Verified, IDA Member, IDA Award 2024, GST Registered); stats (180+ projects · 8 yrs · 4.8★ · 3 cities); bio; "Meet the team" (3 members); `.pv-contact-card` with address/hours/web/Instagram/GST + "Contact this provider". |
| 3e | Reviews pane | `#st-reviews` | `.reviews-layout`: `.rev-summary` (4.8, "Based on 312 reviews", 5→1 bars, "Write a review") + `.rev-list` of 3 `.rev-card` (name, project line, date, stars, text, "Helpful? Yes/No"). |
| 3f | FAQ pane | `#st-faq` | 7 `.faq-item` accordions ("What's included in the ₹85/sq ft price?" …, `toggleFaq()`). |
| 4 | Suggestions | `.suggestions-wrap` | 4 `.suggestions-section`: "Similar **services**", "More from **Verma Design Studio**", "Frequently **combined with**", "Recently **viewed**" — card grids/scroll rows rendered from JS data; "View all interior designers", "Browse all services" links. |
| 5 | Connect modal | `#connOverlay` | Shared enquiry overlay (see §7). Present in DOM; opened by the Connect CTAs. |

## 6. Data
Read-only page plus the Connect write. All via services → DataSource — **never** raw `localStorage`/
`fetch` (see [../../../docs/environment-and-backend.md](../../../docs/environment-and-backend.md)).
The prototype's inline `saveBtn`/`ib_saved` and the JS suggestion arrays become service calls.

| Section | Service (local-first) | Spine/source |
|---------|-----------------------|--------------|
| Service header, gallery, price, tabs | `ServiceService.get(id)` | listing content (service) |
| Provider block | `BusinessService.get(providerId)` | listing content (business) |
| Reviews | `ReviewService.forService(id)` | reviews content |
| Similar / more-from-provider / combined / recently-viewed | `ServiceService.similar(id)`, `ServiceService.byProvider(providerId)`, `RecentlyViewedService.list()` | listing content |
| Save / Connect | `SaveService.toggle()` · `ConnectService.submit()` → enquiry spine | `enquiries` (`ib:sharedenquiry`) |

**URL state:** `:id` (service id) via route param, read in `useServiceDetail.ts`. Active tab may use
`?tab=` so a tab is linkable.

## 7. Primary CTA
**"Contact provider"** (`.sd-primary`, `onclick="openConn()"`) — opens the Connect modal with intent
**`service`** (`PAGE_INTENT = 'service'`, routed via `IBConnect.open({ intent: 'service' })`).

Secondary CTAs (all resolve to the next step):
- **"Book free consult"** (`.sd-secondary`, `openConn('consult')`) → Connect, intent `service`.
- **"Contact this provider"** (provider pane) → Connect, intent `service`.
- Save (`.sd-icon-btn` bookmark) → writes to saved · Share · **Report this listing** (`IBReport.open`).
- "View all interior designers" / "View provider profile" / "Browse all services" → matching listing.

Connect copy (prototype + [../modules-features-flow.md](../modules-features-flow.md)
§Part 2): per-step labels "Continue" → "Send connection request"; on success **"Connection sent.
Qualified and sent to Verma Design Studio. Expect a response in your IB dashboard within 4 hours."** with
"Continue browsing". Use exact strings from [../copywriting.md](../copywriting.md) ("Send enquiry"
in the React port; the prototype's privacy line "Contact shared only after provider responds.").

## 8. States
- **Loading:** skeleton for gallery + info block; tab panes lazy-skeleton on switch (not a bare spinner).
- **Empty:** a suggestion row with no items is omitted entirely. Portfolio/Reviews tabs with no data show
  a quiet "Nothing here yet" with the forward action (e.g. "Browse all services") — never a dead end.
- **Not found:** invalid `:id` → a centered "Service not found" with a "Back to services" CTA.
- **Error:** a failed section degrades to hidden + quiet inline retry; the rest still renders.
- **Success:** owned by the Connect overlay (success screen + 4-hour timeline + "Continue browsing").

## 9. Responsive
- Desktop: `.sd-top` two-column (gallery + info); portfolio grid 3-up; reviews `220px / 1fr`.
- ≤720px: sidebar → drawer; gallery + info stack single column; `.portfolio-grid` → 2-up then 1-up;
  `.reviews-layout` → single column; tab nav scrolls horizontally; suggestion rows scroll-snap.
- Touch targets ≥ 38px; the 28px save/share icon buttons acceptable as secondary controls.

## 10. Accessibility
- Landmarks: `header` (topbar), `nav`/`aside` (sidebar), `main`; tab region a labelled `<section>`.
- Headings: **one H1** = `.sd-title` (the service name); tab/section titles are H2; no skipped levels.
- Tabs: real `role="tablist"`/`role="tab"`/`role="tabpanel"` with `aria-selected`; arrow-key operable
  (prototype uses plain buttons — fix in the port).
- Gallery: arrows are labelled buttons (`aria-label="Previous image"` / `"Next image"` already present);
  thumbnails labelled; counter exposed as text.
- Rating "★★★★★ 4.8" needs a text equivalent ("4.8 out of 5, 312 reviews"); stars `aria-hidden`.
- FAQ: each item a `<button aria-expanded>` controlling its panel.
- Connect modal: `role="dialog"` + `aria-modal="true"` + `aria-labelledby`; focus trapped; Esc + backdrop
  close; focus returns to the trigger. Icon-only buttons get `aria-label`.
- Full checklist: [../modules-features-flow.md](../modules-features-flow.md) §5.

## 11. Copy
- Brand name lowercase-b **"Interior bazzar"**; British **"enquiry"** in prose. CTAs Title Case, no caps,
  no "!".
- Suggestion titles verbatim with green `<em>`: "Similar *services*", "More from *Verma Design Studio*",
  "Frequently *combined with*", "Recently *viewed*".
- Connect/save microcopy, "Send enquiry", and the success timeline from
  [../copywriting.md](../copywriting.md); privacy reassurance "Contact shared only after provider
  responds." kept verbatim.

## 12. SEO
`PublicPage` with: title "{service name} — Interior bazzar" (prototype `<title>` = "End-to-End
Residential Interior Design — Interior bazzar"), description echoing provider + value prop ("qualified
enquiries, not noise"), canonical "/services/:id". (Final strings confirmed against prototype
`<title>`/meta before build.)

---

### Build notes (React)
- Page shell: `src/pages/ServiceDetail/index.tsx` + `useServiceDetail.ts` + `ServiceDetail.module.css`;
  composes Gallery, InfoPanel, Tabs (Overview/Process/Portfolio/Provider/Reviews/FAQ), Suggestions.
- Connect is the shared overlay — do **not** re-implement the inline `#connOverlay`; call the central
  `IBConnect.open({ intent: 'service', sellerName, itemName })`. The prototype's local `cSubmit()` /
  `cNext()` are superseded by `connect-modal.js`.
- Mock/local data flows from `src/content/services.content.ts` through the services; same calls later hit
  the API unchanged. Verify visually with the headless-screenshot method (portal-conversion memory):
  compare `/services/:id` against `file:///…/pages/service-detail.html`. Gate with `tsc -b` + `vite build`.
