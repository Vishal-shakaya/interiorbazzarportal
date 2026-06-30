# PAGE: Ad enquiry flow

```
PROTOTYPE: pages/ad-enquiry-flow.html        ROUTE: PAGES.AD_ENQUIRY_FLOW        LAYOUT: Clean (focused explainer — masthead + content, no portal sidebar)
```

An **informational** explainer: how an enquiry from a Google / Meta ad becomes a **prioritised** enquiry
via the qualification engine × the seller's subscription tier. Everything in
[README.md](README.md) §B is answered below.

---

## 1. Purpose
Show a seller (and internal/sales readers) exactly how an ad-sourced enquiry is qualified (contact ·
genuineness · urgency — **never budget**) and how its handling priority (P1–P4) is computed by combining
its qualification **tier A–E** with the seller's **plan network rank** — using the *same* logic the
seller dashboard badges enquiries with.

## 2. Journey
- **Actor:** Seller (educational), reached from the seller dashboard.
- **Stage:** Receive (explains the routing behind Receive → Respond).
- **Precedes:** `dashboard-seller.html` (a "Back to dashboard" link is the masthead anchor).
- **Leads to:** back to the dashboard Enquiries view; reinforces the value of a higher plan
  (Plans & checkout). Mostly a read; no enquiry is created here.

## 3. Auth
**Auth-gated (seller).** A dashboard sub-page; not part of public discovery. No write actions.

## 4. Layout
**Clean focused explainer.** Full-width green **masthead** + a 1080px `.wrap` content column. No portal
topbar/sidebar — its own "← Back to dashboard" link. Interactive **scenario controls** (two chip groups)
recompute a vertical stage flow + a full matrix live.

## 5. Sections (top → bottom — exact prototype order)
1. **Masthead** (`.mast`) — eyebrow "Attract · Qualify · Convert", H1 "How an ad enquiry becomes a
   *prioritised* enquiry", sub explaining every ad enquiry runs the same engine and priority = qualification
   × subscription. "← Back to dashboard" link.
2. **Controls** (`.controls`, 2 cards) — pick a scenario:
   - **Buyer — qualification outcome:** chips **A** (premium · urgent) · **B** (strong) · **C** (warm) ·
     **D** (cool) · **E** (browsing). "The tier the engine assigns after the 3 filters."
   - **Seller — subscription:** chips **Dominance** (exclusive) · **Scale** (full) · **Launch** (premium)
     · **Trusted** (premium) · **Verified** (limited). "The plan sets the network/priority lane."
3. **Flow** (`.flow`, 4 connected stages):
   - **Stage 01 — Ad click → enquiry**: buyer clicks a Google Search / Meta ad, opens Connect. "No budget
     is ever asked — by design."
   - **Stage 02 — Qualification engine**: 3 filters — Filter 1 Contact (Phone OTP verified) · Filter 2
     Genuineness (Real, coherent request) · Filter 3 Urgency (varies by tier). Banner: "Budget is never a
     filter — it is deliberately excluded so the engine doesn't pre-screen people by spend."
   - **Stage 03 — Score → qualification tier**: additive score 0–100 (A 95 · B 82 · C 68 · D 52 · E 35)
     mapped to "Tier {A–E} — {premium/strong/warm/cool/browsing}".
   - **Stage 04 — Priority lane (tier × subscription)** (`.prio`): the resulting **P-tier** (P1–P4), its
     label + lane, the formula ("Tier {q} × plan network tier {nt} → priority score {score}"), and an
     **exclusive-routing** badge ("Routed exclusively — never shared with competitors") when applicable.
4. **The full priority matrix** (`.matrix-sec`) — every qual tier (A–E rows) × plan (Dominance/Scale/
   Trusted/Verified columns) → its P-tier + label, the active cell highlighted. Note: "Computed live from
   `IBEntitlements.priorityFor()` — the single source of truth shared with the seller dashboard."

## 6. Data
**Read-only, no writes.** All values are **computed live from the entitlement source of truth**
`assets/ib-entitlements.js` (`IBEntitlements.priorityFor(qualTier, planKey)`) — the React port **reads**
this, never re-implements the scoring per component.

| Read | Source |
|------|--------|
| Priority result + matrix | `IBEntitlements.priorityFor(q, plan)` → `{tier,label,lane,color,score,qualTier,networkTier,exclusive}` |
| Urgency / score / tier-name per A–E | static maps (`URG`, `SCORE`, `TIER_NAME`, `TIER_COLOR`) |
| Plan network rank | `IBEntitlements.networkTier(planKey)` |

Scoring contract (authoritative, from `ib-entitlements.js`): `qualBase = {A4 B3 C2 D1 E0}`,
`planRank = {exclusive3 full2 premium1 limited/none0}`, `score = qual×2 + plan` →
**P1 Immediate (≥9) · P2 Priority (≥6) · P3 Standard (≥3) · P4 Nurture (<3)**; lanes Director/senior
closer · Sales Head/BDM · Telesales→closer · Queue. `exclusive` flagged when network tier is
exclusive or full.

## 7. Primary CTA
**No transactional CTA** — this is an explainer. The primary action is **interaction**: toggle the two
chip groups to explore scenarios. The one navigational CTA is **"Back to dashboard"**. (Implicit upsell:
higher plans lift priority — links the reader toward Plans & checkout.)

## 8. States
- **Loading:** content is static + computed on mount (`render()`); a brief skeleton for the matrix is
  acceptable.
- **Empty:** n/a — defaults select Tier **A** × **Dominance** (P1 / exclusive) so the page is never blank.
- **Error:** if entitlements fail to load, degrade to the static narrative (stages/matrix) with a quiet retry.
- **Success:** n/a (no submission); selecting a chip re-renders stages 2–4 + the matrix highlight.

## 9. Responsive
- Desktop: controls 2-up, matrix full table, filters 3-up.
- ≤760px: controls → 1 col, filters → 1 col, masthead H1 34px, priority tier shrinks. Touch targets ≥ 38px.

## 10. Accessibility
- Landmarks: `main` with the masthead `header`; matrix is a real `<table>` with row/col headers.
  **One H1** = the masthead title; "The full priority matrix" is an H2.
- Chip groups are labelled radio-style `<button>`s (`aria-pressed`, group `aria-label`); the active
  scenario announced via `aria-live="polite"` when the stages/matrix recompute.
- Priority/tier conveyed by **text + icon**, not colour alone (P-tier label, lane text, "Routed
  exclusively" text). Decorative glows/icons `aria-hidden`.
- Full checklist: [../modules-features-flow.md](../modules-features-flow.md) §5.

## 11. Copy
- Stage titles, filter labels, the "Budget is never a filter…" banner, tier/priority labels — **verbatim**
  from the prototype. Brand name lowercase-b "Interior bazzar"; British "enquiry".
- No "!"/caps CTAs. Formula and matrix note ("Computed live from `IBEntitlements.priorityFor()`…")
  verbatim. Words per [../copywriting.md](../copywriting.md).

## 12. SEO
Auth-gated explainer — **noindex**. `<title>` "Ad Enquiry Flow — Interior bazzar" (verbatim). No public
canonical/description (internal/seller surface).

---

### Build notes (React)
- Page shell: `src/pages/AdEnquiryFlow/index.tsx` + `useAdEnquiryFlow.ts` (two scenario states `q` + `p`)
  + module CSS. The matrix and priority panel **call the ported `IBEntitlements.priorityFor()`** — do not
  re-derive the scoring; it is shared with the seller-dashboard enquiry badge so both must read one source.
- Pure presentational page (no spine writes); the entitlement helper is the only data dependency.
- Cross-checks: this routing spec is summarised in
  [../modules-features-flow.md](../modules-features-flow.md) Part 3 (priority
  routing) and visualised here; keep the P-tier thresholds in sync with `ib-entitlements.js`.
- Verify visually with the headless-screenshot method (portal-conversion memory) against
  `file:///…/pages/ad-enquiry-flow.html` (toggle a few chip combinations). Gate with `tsc -b` +
  `vite build`.
</content>
