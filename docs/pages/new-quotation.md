# PAGE: New quotation

```
PROTOTYPE: pages/new-quotation.html        ROUTE: PAGES.NEW_QUOTATION        LAYOUT: Clean (focused builder — own slim topbar, no portal sidebar)
```

The seller's **convert** tool: build a GST-correct quotation PDF (line items, per-line discounts, tax,
totals, terms) and save or share it. Everything in [README.md](README.md) §B is
answered below.

---

## 1. Purpose
Let a seller turn a live deal into a professional, GST-compliant quotation — add the buyer and line
items (products/services), apply per-line discounts, set the tax, then **save**, **download a PDF**, or
**share on WhatsApp**.

## 2. Journey
- **Actor:** Seller.
- **Stage:** Convert (the last seller-journey step: Receive → Respond → **Convert**).
- **Precedes:** seller dashboard → Pipeline / Quotations (`dashboard-seller.html#quotations`), often
  pre-filled from an enquiry (`ib_newquote_prefill`).
- **Leads to:** a saved quotation (numbered `IB-Q-YYYY-NNNN`) back in the dashboard Quotations list, or
  a PDF / WhatsApp message to the buyer.

## 3. Auth
**Auth-required (seller).** The "From" block is the seller's own business identity (name, GSTIN, phone,
email — `SELLER` object, editable at `dashboard-seller.html#business`). Reached only from the seller
dashboard.

## 4. Layout
**Clean focused builder.** Own slim sticky topbar (56px: "← Back" to `#quotations`, divider, "New
quotation"), no portal sidebar. Two-column shell (`.layout`): left **form card** (`1fr`) + right
**sticky actions panel** (312px). Collapses to single column ≤980px.

## 5. Sections (top → bottom — exact prototype order)
1. **Page head** — H1 "New quotation" + sub "Add the buyer and items, apply per-line discounts, set tax,
   then save or share."
2. **Error strip** (`#errStrip`) — hidden until validation fails.
3. **Meta row** (`.meta`, 4 cells) — Quotation no. (`IB-Q-YYYY-NNNN`, auto from `ib_nq_seq`), Date,
   Valid until (default +30 days), Place of supply (state select).
4. **From** (`.from-row`) — seller identity: name, GSTIN, address, phone, email + "Edit" link.
5. **Bill to** (`.bill`) — buyer fields: Buyer name **\***, Buyer GSTIN, Phone, Email, City, State,
   Address (optional). State selection sets place of supply (drives intra/inter-state GST).
6. **Items** (`.tbl`) — line-item table with "Add product" / "Add service" buttons. Columns:
   #, Description, HSN / SAC, Qty, Unit, Rate (₹), Discount (per-line, `%` ⇄ `₹` toggle), Amount (₹),
   remove. Units: pieces, sqft, sqm, kg, meter, box, hours, days, lump sum, set.
7. **Notes to buyer (optional)** + **Summary** (two columns) — Summary computes Gross amount → Discount
   on items → Taxable value → **GST rate** select (0/5/12/18[default]/28%) → CGST+SGST (intra-state) or
   IGST (inter-state) → **Grand total** + amount in words ("Rupees … Only").
8. **Terms & conditions** — textarea pre-filled with the 7-clause `TERMS_TEMPLATE` ("valid for 30 days",
   "50% advance on order confirmation", jurisdiction New Delhi, force majeure, etc.).
9. **"Generated via Interior bazzar · interiorbazzar.com"** footer line.
10. **Actions panel** (right, sticky) — mirrors Grand total + words, then **Save**, **Download PDF**,
    **Share on WhatsApp**, saved-confirmation chip, "Cancel".

## 6. Data
Seller identity and quotation read/write via the service seam → DataSource (**never** raw
`localStorage`/`fetch`; the prototype's `localStorage` + `jspdf` calls are the seam to replace):

| Read | Source |
|------|--------|
| Seller "From" block | `SellerService.profile()` (prototype `SELLER` constant) |
| Next quotation number | `QuotationService.nextNumber()` (prototype `ib_nq_seq` → `IB-Q-YYYY-NNNN`) |
| Prefill (buyer name/phone/email/city) | enquiry handoff (prototype `ib_newquote_prefill`) |
| States / units / terms template | static config (prototype `STATES`, `UNITS`, `TERMS_TEMPLATE`) |

| Write | Target spine |
|-------|--------------|
| Save quotation | `QuotationService.save(quote)` → quotations group (surfaces in dashboard → Quotations); bumps the sequence |
| PDF | client-side render (jspdf port) — no spine write |
| WhatsApp share | opens `wa.me/<buyer>` with a templated message (total + valid-until) |

Quotation shape = the spine contract: `{ number, date, valid, placeOfSupply, buyer{name,gstin,phone,
email,city,state,addr}, items[{kind,desc,hsn,qty,unit,rate,discType,discVal,gross,disc,net}],
totals{gross,disc,taxable,gstRate,intra,cgst,sgst,igst,gstTotal,grand}, notes, terms }`.
GST logic: `intra = (placeOfSupply === seller.state)` → split CGST+SGST, else IGST.

## 7. Primary CTA
**"Save"** is the most important action (writes the quotation to the spine). Per the assignment this is
the page's primary "Send quotation" intent — surfaced here as **Save** + **Share on WhatsApp** (the
seller's send channel). Secondary: **Download PDF**, "Add product", "Add service", per-line discount
`%`/`₹` toggle, "Edit" (from), "Cancel". `ensureQuote()` validates before any save/share/PDF.

## 8. States
- **Loading:** form renders immediately with one empty product line (`addItem('product')`); seller
  block hydrates from `SellerService`.
- **Empty:** at least one line always present; removing the last line re-adds an empty product row
  (no dead end). Grand total shows ₹0.00 / "Rupees Zero Only".
- **Error:** `showErr()` lists missing required fields inline ("Please add: buyer name · date · at least
  one item with a description, quantity and rate") and scrolls to top.
- **Success:** saved chip "Saved · IB-Q-YYYY-NNNN"; WhatsApp opens with the buyer message; PDF downloads
  as `<number>.pdf`.

## 9. Responsive
- Desktop: form `1fr` + sticky 312px actions panel; item table scrolls horizontally (min 880px).
- ≤980px: single column, actions panel static, Bill-to/meta grids → 2-up.
- ≤560px: meta / bill / notes-summary → single column; from-row separator hidden. Touch targets ≥ 38px.

## 10. Accessibility
- Landmarks: `header` (topbar), `main` (builder), `aside` (actions panel). **One H1** = "New quotation".
- Every input has a `<label>`; required marked with text + `*` (`aria-required`), not colour only.
- Item table is a real `<table>` with header cells; per-line controls labelled; discount `%`/`₹` toggle
  is a labelled `<button>` (`aria-pressed` / `aria-label`); remove button `aria-label="Remove"`,
  `disabled` when only one line remains.
- Live totals/words and the error strip use `aria-live="polite"` (announce recompute + validation).
- Action buttons (Save / Download PDF / Share on WhatsApp) are labelled `<button>`s with visible focus.
  Full checklist: [../modules-features-flow.md](../modules-features-flow.md) §5.

## 11. Copy
- All headings, field labels, placeholders, terms template, summary labels — **verbatim** from the
  prototype. Brand name lowercase-b "Interior bazzar"; British "enquiry".
- CTA strings Title Case, no caps/"!": "Save", "Download PDF", "Share on WhatsApp", "Add product",
  "Add service", "Cancel". WhatsApp message and "Generated via Interior bazzar · interiorbazzar.com"
  footer verbatim. Words sourced from [../copywriting.md](../copywriting.md).

## 12. SEO
Auth-gated tool — **noindex**. `<title>` "New Quotation — Interior bazzar" (verbatim). No canonical /
public description needed (not a discovery surface).

---

### Build notes (React)
- Page shell: `src/pages/NewQuotation/index.tsx` + `useNewQuotation.ts` (line-item state, `recalc`
  totals, GST intra/inter logic) + module CSS.
- Replace the prototype seams: `SELLER`/`ib_nq_seq`/`ib_newquote_prefill` → `SellerService` /
  `QuotationService`; jspdf render kept client-side behind a `QuotationPdf` util; **no raw localStorage**.
- The GST + number-to-words logic (`lineNet`, `recalc`, `numberToWords`) ports as pure helpers and is
  unit-testable in isolation.
- Verify visually with the headless-screenshot method (portal-conversion memory) against
  `file:///…/pages/new-quotation.html`; verify a sample PDF renders. Gate with `tsc -b` + `vite build`.
</content>
