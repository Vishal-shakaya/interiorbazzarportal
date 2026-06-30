# 02 — UI & UX

The Portal's design system, extracted verbatim from the prototype's `assets/theme.css` and component
files. **Never hardcode a colour, size, radius, or shadow** — use these tokens. The React port mirrors
them as CSS custom properties / Tailwind tokens 1:1.

---

## 1. Design tokens

### Colour
```
/* Brand */
--color-green:        #085041   /* primary: topbars, buttons, links */
--color-green-dark:   #04342c   /* dark hover */
--color-green-light:  #e1f5ee   /* tints, badge fills, hover */
--color-green-mint:   #9fe1cb   /* on-dark accents (hero) */
--color-accent:       #1d9e75   /* gradients, secondary highlight */

/* Category coding */
--color-amber: #ba7517  / --color-amber-light: #fdf3e3
--color-navy:  #1a3a6e  / --color-navy-light:  #dceeff
--color-plum:  #5a1a7a  / --color-plum-light:  #f3e8ff

/* Surfaces & ink */
--color-bg:     #f7f6f2   /* warm app background */
--color-paper:  #fffdf8   /* cards, sheets, topbar */
--color-border: #e8e6df   /* hairlines */
--color-chip:   #eeeae0   /  --color-chip-hover: #e2dfd3
--color-text:   #1a1a17   /* primary ink */
--color-muted:  #777777   /* secondary */
--color-light:  #aaaaaa   /* placeholders, icons */

/* Status */
--color-success: #27ae60 / --color-success-light: #e8f7ee
--color-danger:  #c0392b / --color-danger-light:  #fdecea
```

### Typography
```
--font-display: 'DM Serif Display', Georgia, serif   /* titles, eyebrows, stats — italic */
--font-body:    'DM Sans', system-ui, sans-serif     /* body & UI */
--font-mono:    ui-monospace, 'SFMono-Regular', Menlo, monospace

--fs-display 36 · --fs-2xl 28 · --fs-xl 22 · --fs-lg 18 · --fs-md 15
--fs-base 14 · --fs-sm 12.5 · --fs-xs 11           (px)
--fw-regular 400 · --fw-medium 500 · --fw-semibold 600 · --fw-bold 700
--lh-tight 1.15 · --lh-normal 1.6 · --lh-loose 1.8
```
> **Serif note (carry from prototype memory):** the prototype's hero/section/logo serif renders in
> **Georgia**, not DM Serif Display — match Georgia for `.font-editorial` / `.sec-title` equivalents.

### Spacing · radius · shadow · motion
```
--sp-1 4 · --sp-2 8 · --sp-3 12 · --sp-4 16 · --sp-6 24 · --sp-8 32 · --sp-12 48   (px)
--radius-sm 6 · --radius-md 10 · --radius-lg 14 · --radius-xl 16 · --radius-pill 30

--shadow-sm:  0 2px 8px  rgba(8,80,65,.05)
--shadow-md:  0 8px 22px rgba(8,80,65,.08)
--shadow-lg:  0 14px 36px rgba(8,80,65,.12)
--shadow-btn: 0 4px 14px rgba(8,80,65,.20)        /* green-tinted, brand-cohesive */

--t-fast .15s · --t-base .2s · --t-slow .35s
```

---

## 2. Layout

```
--nav-h            60px    /* fixed topbar height */
--sidebar-w        240px   /* expanded */
--sidebar-collapsed 72px   /* icon-only */
shell max-width    1600px  /* .main-inner */
content padding    16px 24px 60px
```
Grids: listings **4-col** (`repeat(4,1fr)`, gap `16px 12px`) · category tiles **6-col** (gap `10px`) ·
testimonials/plans **3-col**. Hero: `grid-template-columns: 1.5fr 1fr; gap: 28px`; carousel track
`width:400%`, slide transition `transform .55s cubic-bezier(.4,0,.2,1)`.
z-index ladder: sidebar 40 · topbar 50 · search panel 60 · profile dropdown 200 · modal 1002 · voice 9995.

---

## 3. Component inventory (with key classes)

| Component | Class root | Variants / notes |
|-----------|-----------|------------------|
| Button | `.ib-btn` | `--primary` (green/white), `--secondary` (mint), `--ghost`, `--danger`, `--link`; sizes `--sm/--lg`; disabled `opacity:.5`, hover `translateY(-1px)` + shadow |
| Filter chip | `.ib-chip` | rest `#eeeae0` → hover `#e2dfd3` → `.is-active` dark/white; 13.5px, radius 6 |
| Badge | `.ib-badge` | `--amber/--navy/--plum/--success/--danger`; 11px bold, radius 20 |
| Card (generic) | `.ib-card` | paper bg, border, radius 14, `--shadow-sm`; `--hover` lifts `translateY(-2px)` |
| Listing card | `.card` | 16:10 thumb (`.card-thumb`, hover scale 1.04), `.card-save` (top-right, hover-reveal), `.card-tag`/`.hot`, `.card-avatar` (g1–g12 gradients), `.card-title` (2-line clamp), `.card-price-tag`, `.card-duration` |
| Hero carousel | `.ib-hero` | gradient themes forest/amber/navy/plum/teal/slate; eyebrow + serif H1 (mint `titleEm`) + stats row + dual CTA + progress bar (2.5px) |
| Search bar | `.ib-srch-*` | input+button pill, `.ib-srch-clear`, `.ib-srch-panel` (scroll, z60), `.ib-srch-empty` suggestions |
| Topbar profile | `.pd-*`, `.tb-avatar` | gradient avatar (38px), 300px dropdown radius 16, `.pd-item` hover |
| Sidebar nav | `.sb-*` | `.sb-item` (10/14 pad, radius 10), active `#e1f5ee` + 3px left border; collapsed = icons, 12px labels; `.sb-promo` gradient box |
| Modal | `.ibm-*` / `.ibc-*` | overlay blur(3px) z1002; card max 460, radius 20, `--shadow-lg`; anims ibmFade/ibmRise; `.ibm-close` rotates on hover |
| Verified badge | `ti-rosette-discount-check-filled` | colour matches entity category |

Icons: **Tabler** webfont (`ti ti-*`), 17px standard / 21px sidebar / 50px hero.

---

## 4. Interaction patterns

- **Hover/focus:** buttons `translateY(-1px)`+shadow; cards `translateY(-2px)`; links gap 4→7px; inputs
  green border + ring `0 0 0 3px rgba(8,80,65,.08)`.
- **Sidebar collapse:** topbar menu button toggles 240↔72px (`.25s ease`); main margin follows.
- **Mobile drawer:** below `720px` sidebar/search become fixed overlays (search `left/right:8px; top:64px`).
- **Modal:** open on overlay; dismiss on backdrop click or Esc; focus trapped.
- **Sticky:** category bar `position:sticky; top:0; z:5`; hero progress animates width.
- **Carousel:** touch (≥40px delta) + arrow keys; auto-advance 7s; dots jump.
- **Voice search:** ring animation states listening/heard/error; live transcript; "try saying" chips;
  hides entirely if unsupported.

---

## 5. Responsive

| Breakpoint | Behaviour |
|------------|-----------|
| default (≤1600 shell) | full desktop, 4-col grids |
| ≤720px | search panel → fixed overlay; sidebar → drawer; layout reflows |
| ≤480px | chat/widgets full-width; hero band single-column |
| `prefers-reduced-motion` | disable/replace animations |

Type sizes don't scale per breakpoint — **layout reflows**, sizes hold. Touch targets ≥ 38×38px
(secondary 28px tolerated but avoid for primary actions).

---

## 6. States (every interactive surface defines all four)

- **Loading** — skeleton/shimmer placeholders (the prototype lacks a shared shimmer; the React port
  **adds** a standard skeleton component — do not leave bare spinners).
- **Empty** — icon + title + subtitle + **a next-action CTA** (e.g. search `.ib-srch-empty` →
  suggestion pills + "Tell us what you need"; dashboard → "Start browsing"). Never a blank panel.
- **Error** — `.is-error` (danger border + danger ring); inline message; a retry where relevant.
- **Disabled** — `opacity:.5; cursor:not-allowed`; no hover transform; for gated features pair with
  lock icon + tooltip (see [modules-features-flow.md §3](modules-features-flow.md)).
- **Success** — confirmation with a concrete next step (Connect success states; "Go to home").

---

## 7. UX principles (the prototype's design intent)

1. **Warm, trustworthy palette** — green anchor, mint on dark, cream surfaces; green-tinted shadows
   keep elevation cohesive.
2. **Editorial type hierarchy** — serif (Georgia) for emphasis/titles, DM Sans for everything else.
3. **Quiet motion** — micro-interactions signal interactivity; nothing flashy. Respect reduced-motion.
4. **Verification is visible** — verified/badge/tier surfaced wherever an entity appears (trust is the product).
5. **Context always present** — city scope and entity type shown across search/browse.
6. **Graceful degradation** — voice hides when unsupported; modals work without animation; private-mode
   storage falls back to in-memory (the prototype's `IBStore` mirror).

> These tokens/components must satisfy the accessibility states in [modules-features-flow.md §5](modules-features-flow.md)
> (focus ring, state-not-just-colour). The words that fill them come from [copywriting.md](copywriting.md).
