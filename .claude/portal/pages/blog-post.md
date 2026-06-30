# PAGE: Blog post

```
PROTOTYPE: pages/blog-post.html        ROUTE: PAGES.BLOG_POST ("/blog/:slug")        LAYOUT: Browsing (topbar + sidebar)
```

A single article from the IB Journal, plus a related-by-tag row. Reads one Admin-authored `posts`
record by slug (see [../../Integration.md](../../Integration.md): the Admin blog editor writes the
record this page renders). Everything in [README.md](README.md) §B is answered below.

---

## 1. Purpose
Render one published story in full — headline, byline, cover, body — and offer the reader more from the
journal (related posts) so they keep reading and stay in the trust loop.

## 2. Journey
- **Actor:** Buyer/reader (primary); interior professionals reading for insight.
- **Stage:** Discover (content/trust surface).
- **Precedes:** another blog-post (via related row), or back to the blog index.
- **Leads to:** related blog-post; "Back to the journal" on not-found; sidebar/topbar back into discovery.

## 3. Auth
**Public.** No login to read a published story. A non-published post renders only as a **draft preview**
(see §8) — public listing of drafts is suppressed.

## 4. Layout
**Browsing layout** — fixed topbar (`#ib-topbar`, `data-active="blog"`) + collapsible left sidebar
(`#sidebar`) + `<main class="main" id="main">`. The article renders into a single mount point
`#artRoot` (`ArticleRoot`).

## 5. Sections (top → bottom — exact prototype order)
A single-article surface, not the Home feed — no `.sec-eye`/`.sec-title` SectionHeader. Its own article
chrome, all rendered into `#artRoot` (quote **verbatim**):

| # | Section | Component | Copy (verbatim) | Content |
|---|---------|-----------|-----------------|---------|
| 0 | Draft note | `DraftNote` | "Draft preview — this story is not publicly listed yet." | `.art-draft-note` (`ti-eye`); shown only when `post.status !== 'published'`. |
| 1 | Article head | `ArticleHead` | eyebrow = category label; H1 = post title; excerpt; byline ("IB" avatar, author name, "{n} min read · {Mon YYYY}") | `.art-head` (`.art-eyebrow`, `.art-title`, `.art-excerpt`, `.art-meta`/`.art-byline`). |
| 2 | Cover | `ArticleCover` | optional caption (`.art-cover-cap`) | `.art-cover` — `<img>` (`alt` from `cover.alt`) or `.art-cover--grad` fallback. |
| 3 | Body | `ArticleBody` | fallback "This story has no body yet." | `.art-body` — renders `post.html` (sanitised). Followed by `<hr class="art-divider">`. |
| 4 | Related | `RelatedPosts` | heading "More from the journal" | `.rel-wrap`/`.rel-grid` — up to 3 `BlogService.related(post,3)` cards (`.rel-card`: cat, title, "{n} min read · {date}"). Omitted when none. Card → blog-post. |
| 5 | Newsletter | `JournalNewsletter` | H3 "Never miss a story from *IB Journal*"; "New writing on design, business and the industry — every two weeks. No spam."; CTA "Subscribe" | `.newsletter` + `#nlEmail` ("your@email.com"). |

> Related is **by tag/category** and capped at 3; it disappears entirely when there are no siblings.

## 6. Data
Read-only page (plus newsletter email capture). All via services → DataSource — **never** raw
`localStorage`/`fetch` (see [../../Environment-Management-backend.md](../../Environment-Management-backend.md)).

| Section | Service (local-first) | Spine/source |
|---------|-----------------------|--------------|
| Article | `BlogService.bySlug(slug)` | `posts` group (`ib_blog_posts`, event `ib:blogpost`) — **Admin-authored** |
| Related | `BlogService.related(post, 3)` | same `posts` group (by tag/category) |
| Newsletter | `NewsletterService.subscribe(email)` | local capture → API later |

Prototype reads `?slug=` via `getParam`, then `IBStore.posts.bySlug(slug)`; `IBStore.posts.related(post,3)`
for the row. React route is **`/blog/:slug`** (`PAGES.BLOG_POST`) — read the slug from route params (not a
query string) and resolve through `BlogService` over the same `posts` group the Admin editor writes (see
[../../Integration.md](../../Integration.md), `posts → ib_blog_posts`, Admin → Portal, read-only first).

## 7. Primary CTA
This is a **read** page — its primary action is to keep reading: a **related "More from the journal"**
card → the next blog-post. Secondary CTAs/affordances:
- "Subscribe" (newsletter) → capture email.
- On not-found: **"Back to the journal"** → blog index (the no-dead-end forward action).

No Connect on this page. Use exact strings from [../copywriting.md](../copywriting.md).

## 8. States
- **Loading:** skeleton article head + cover band + body lines (standard skeleton, not a bare spinner).
- **Draft:** a non-published post renders with the `.art-draft-note` banner **verbatim** ("Draft preview
  — this story is not publicly listed yet.") and is excluded from public listing.
- **Empty body:** "This story has no body yet." (verbatim) in `.art-body`.
- **Not found:** missing/unpublished slug → `notFound()` `.art-404` (`ti-article-off`): "Story not found"
  / "The link may be broken, or the story is not published. The journal has plenty more to read." +
  "Back to the journal" link. Title set to "Story not found — IB Journal". Keep this verbatim.
- **Error:** failed load degrades to the not-found state; chrome still renders.

## 9. Responsive
- Desktop: centred reading column; related a 3-up grid; cover full-width within the column.
- ≤720px: sidebar → drawer; reading column full-width with comfortable measure; related reflows to one
  column; byline wraps.
- Touch targets ≥ 38px.

## 10. Accessibility
- Landmarks: `header` (topbar), `nav`/`aside` (sidebar), `main`; the article an `<article>`; related a
  labelled region ("More from the journal").
- Headings: **one H1** = the post title; "More from the journal" / newsletter heads are H2; related card
  titles a consistent level below. No skipped levels.
- Cover `<img>` has a meaningful `alt` (from `cover.alt`); the gradient fallback is decorative
  (`aria-hidden`).
- Related cards are real links with an accessible name (the title); "Back to the journal" a labelled link.
- Reading time/byline is text (not colour-only). Newsletter input labelled; result `aria-live="polite"`.
- Full checklist: [../modules-features-flow.md](../modules-features-flow.md) §5.

## 11. Copy
- Draft note, not-found, empty-body, "More from the journal", newsletter, byline format: **verbatim**
  from §5/§8.
- Brand name lowercase-b "Interior bazzar". British "enquiry"/"catalogue". CTAs Title Case, no caps/"!".
- "Read article", "Subscribe", "Back to the journal" — all per
  [../copywriting.md](../copywriting.md).

## 12. SEO
`PublicPage`, **per-post** from `post.seo` (prototype `applySeo`): title `{seo.metaTitle || post.title}
— IB Journal`; description `seo.metaDescription || post.excerpt`; canonical `seo.canonical || the post
URL`; `og:type=article`, `og:title`/`og:description`/`og:image` (cover); `twitter:card`
summary_large_image when an image exists; `robots noindex,nofollow` when `seo.noindex`. Drafts/not-found
must not be indexed. (Confirmed against prototype `<title>` "Story — IB Journal · Interior bazzar".)

---

### Build notes (React)
- Page shell: `src/pages/BlogPost/index.tsx` + `useBlogPost.ts` + `BlogPost.module.css`; composes
  DraftNote, ArticleHead, ArticleCover, ArticleBody, RelatedPosts, JournalNewsletter.
- `useBlogPost.ts` reads `:slug` from route params, calls `BlogService.bySlug(slug)` → not-found when
  null, then `BlogService.related(post, 3)`; applies per-post SEO (PublicPage head).
- Sanitise `post.html` before render (it is Admin-authored body); scroll to top on slug change.
- Mock/local data flows from the `posts` content through the service so the **Admin editor's records**
  surface here unchanged; same call later hits the API (read-only `posts` first, per Integration §).
- Verify visually with the headless-screenshot method (portal-conversion memory): compare
  `/blog/<slug>` against `file:///…/pages/blog-post.html?slug=…`. Gate with `tsc -b` + `vite build`.
