# PAGE: Blog

```
PROTOTYPE: pages/blog.html        ROUTE: PAGES.BLOG ("/blog")        LAYOUT: Browsing (topbar + sidebar)
```

The editorial index — "The *IB* Journal". An Admin-authored content surface (see
[../../../docs/integration.md](../../../docs/integration.md)): the Admin blog editor writes the same `posts`
records this page renders. Everything in [README.md](README.md) §B is answered below.

---

## 1. Purpose
Give a reader a scannable index of every published story — featured lead + latest grid — filtered by
category, and route them into a single article (and, by trust, toward listing/Connect) as fast as possible.

## 2. Journey
- **Actor:** Buyer/reader (primary); interior professionals also read for industry insight.
- **Stage:** Discover (trust/content surface, off the main funnel).
- **Precedes:** blog-post (single article).
- **Leads to:** blog-post via card/featured "Read article"; sidebar/topbar back into discovery.

## 3. Auth
**Public.** No login to read. The shared auth modal is present (topbar/sidebar), but the Journal itself
gates nothing — there is no Connect action on this page.

## 4. Layout
**Browsing layout** — fixed topbar (`#ib-topbar`, `data-active="blog"`) + collapsible left sidebar
(`#sidebar`) + `<main class="main" id="main">`. The inner uses full-bleed (`max-width:none`); the
masthead/category-bar/body run edge-to-edge inside the shell.

## 5. Sections (top → bottom — exact prototype order)
This page is the IB Journal, not the Home feed — it does **not** use the `.sec-eye`/`.sec-title`
SectionHeader. Its own editorial chrome (quote **verbatim**):

| # | Section | Component | Copy (verbatim) | Content |
|---|---------|-----------|-----------------|---------|
| 1 | Masthead | `JournalMasthead` | label "Interior bazzar"; H1 "The *IB* Journal"; tagline "Ideas, insights and inspiration for India's design industry — and the people who live in it."; issue line "Est. 2024 · Design & Business" | `.blog-masthead` + `#blogSearch` ("Search articles…", `oninput=filterBlog`). |
| 2 | Category bar | `CategoryBar` | "All stories" · "Guides" · "Studio" · "Materials" · "Routing" · "News" | `.cat-bar` / `#catBar`; `.cat-btn` with `data-cat`; first is `.active`. Filters the grid by `data-cat`. |
| 3 | Featured | `FeaturedPost` | badge "✦ Editor's pick"; CTA "Read article" | `#featuredBlock` — **newest published post** (`posts[0]`). `style="display:none"` until a post exists. Cat label + title + excerpt + byline ("IB", `{n} min read · {Mon YYYY}`). Whole block → blog-post. |
| 4 | Latest divider | `LatestDivider` | H2 "Latest *stories*" | `#latestDivider` (`.section-divider` + `.divider-line`); hidden when no posts. |
| 5 | Article grid | `BlogGrid` | per card: cat badge, title, excerpt, "{n} min read", up to 2 `.card-tag`, save (`.card-bookmark`, "Save article") | `#blogGrid` (`.blog-grid`) — `posts.slice(1)`. Each `.article-card` carries `data-cat`/`data-title`/`data-slug`; whole card → blog-post. |
| 6 | Newsletter | `JournalNewsletter` | H3 "Never miss a story from *IB Journal*"; "New articles on design, business and industry trends — every two weeks. No spam."; CTA "Subscribe" | `.newsletter` + `#nlEmail` ("your@email.com"). |

> The featured post is the newest; the grid is every remaining published post. Category + search filter
> client-side over the rendered set.

## 6. Data
Read-only page (plus the newsletter email capture). All via services → DataSource — **never** raw
`localStorage`/`fetch` (see [../../../docs/environment-and-backend.md](../../../docs/environment-and-backend.md)).

| Section | Service (local-first) | Spine/source |
|---------|-----------------------|--------------|
| Featured + grid | `BlogService.published()` | `posts` group (`ib_blog_posts`, event `ib:blogpost`) — **Admin-authored** |
| (prototype seed) | `posts.ensureSeeded()` → service-owned local seed | local content only |
| Newsletter | `NewsletterService.subscribe(email)` | local capture → API later |

Prototype reads `IBStore.posts.published()` and renders featured (`[0]`) + grid (`slice(1)`).
`BlogService.published()` is the React seam over the same `posts` group the Admin editor writes (see
[../../../docs/integration.md](../../../docs/integration.md), `posts → ib_blog_posts`, Admin → Portal, read-only first).

**URL state:** category + search are local UI state in the prototype. The React port should lift the
active category to `?cat=<slug>` and the query to `?q=` via `useSearchParams` (not `useState`) so a
filtered view is shareable.

## 7. Primary CTA
**"Read article"** (featured) — into the single article; whole featured block and every grid card are
the link. Secondary CTAs:
- Card save (`.card-bookmark`, `aria-label="Save"`) → writes to saved.
- Category buttons / `#blogSearch` → filter the rendered set.
- "Subscribe" (newsletter) → capture email.

Every CTA resolves to the next step. Use exact strings from [../copywriting.md](../copywriting.md).

## 8. States
- **Loading:** skeleton featured band + skeleton grid cards (standard skeleton, not a bare spinner).
- **Empty:** when no posts are published, the prototype hides featured + divider and shows the empty
  state **verbatim**: "The journal is being written" / "The first stories are on the way. Check back
  shortly." (`.empty-state`, `ti-article-off`). Keep it; it's the no-dead-end pattern for a content
  page (the forward action is the rest of the portal via sidebar/topbar).
- **Filter-empty:** a category/search with no matches shows "No stories found" + a "Clear filters"
  affordance, not a blank grid.
- **Error:** failed load degrades to the empty state with a quiet inline retry; chrome still renders.

## 9. Responsive
- Desktop: masthead two-column (title / search + issue), multi-column `.blog-grid`, featured a wide
  split.
- ≤720px: sidebar → drawer; masthead stacks; category bar scrolls horizontally (scroll-snap); grid
  reflows to one column; featured stacks image over body.
- Touch targets ≥ 38px; `.card-bookmark` (icon button) acceptable as secondary.

## 10. Accessibility
- Landmarks: `header` (topbar), `nav`/`aside` (sidebar), `main`; masthead/grid as `<section>`s with an
  accessible name (the H1 / "Latest stories").
- Headings: **one H1** = "The IB Journal"; "Latest stories" and section heads are H2; card titles H3.
  No skipped levels.
- Category bar: real `<button>`s with `aria-pressed` for the active filter; the bar a labelled group.
- Search: labelled input (`aria-label`), results announced via `aria-live="polite"`.
- Cards: whole-card link has an accessible name (the title); save button `aria-label="Save"` +
  `aria-pressed`; cover `alt` describes the story, not "image".
- Full checklist: [../modules-features-flow.md](../modules-features-flow.md) §5.

## 11. Copy
- Masthead, divider, newsletter, category labels, empty state: **verbatim** from §5/§8 (serif title,
  `<em>` keyword in green).
- Brand name lowercase-b "Interior bazzar". British "enquiry"/"catalogue". CTAs Title Case, no caps/"!".
- Card metadata, "Read article", "Subscribe", "Save article" — all per
  [../copywriting.md](../copywriting.md).

## 12. SEO
`PublicPage` with: title from the prototype `<title>` "IB Journal — Interior bazzar", a one-line
description echoing the tagline ("Ideas, insights and inspiration for India's design industry"),
canonical "/blog". (Final strings confirmed against prototype `<title>`/meta before build.)

---

### Build notes (React)
- Page shell: `src/pages/Blog/index.tsx` + `useBlog.ts` + `Blog.module.css`; composes Masthead,
  CategoryBar, FeaturedPost, LatestDivider, BlogGrid, JournalNewsletter in order.
- `useBlog.ts` calls `BlogService.published()`, splits featured (`[0]`) from grid (`slice(1)`), and
  derives category/search filtering from `useSearchParams` (`?cat`, `?q`).
- Mock/local data flows from the `posts` content through the service so the **Admin editor's records**
  surface here unchanged; the same call later hits the API (read-only `posts` first, per Integration §).
- Verify visually with the headless-screenshot method (portal-conversion memory): compare `/blog`
  against `file:///…/pages/blog.html`. Gate with `tsc -b` + `vite build`.
