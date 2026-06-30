import type { ReactNode } from "react";
import { Icon, type IconName } from "@/components/ui";
import { initialsOf } from "@/lib/listing";
import type { ListingItem } from "@/types/marketplace";

/* =========================================================================
   ProductDetail sub-sections — ported 1:1 from the prototype
   product-detail.html (process box · spec tables · description · company
   profile / about-the-seller). Copy and structure match the prototype.
   ========================================================================= */

/* ── "What happens after you connect" 4-step block (.pd-process) ────────── */
const PROCESS_STEPS = [
  "IB qualifies your interest and intent automatically — no manual screening",
  "Your project brief is sent to the verified seller",
  "Seller responds in your IB dashboard — typically within 4 hours",
  "Your contact details remain private until you choose to share them",
];

export function ProcessBox() {
  return (
    <div className="rounded-card bg-green-light p-4">
      <p className="mb-2.5 flex items-center gap-1.5 text-[10.5px] font-bold uppercase tracking-[0.1em] text-forest">
        <Icon name="about" size={13} /> What happens after you connect
      </p>
      {PROCESS_STEPS.map((step, i) => (
        <div
          key={i}
          className="flex items-start gap-2.5 border-b border-forest/10 py-1.5 text-[12.5px] leading-relaxed text-ink last:border-b-0"
        >
          <span className="mt-0.5 grid h-[18px] w-[18px] shrink-0 place-items-center rounded-full bg-forest text-[9.5px] font-bold text-white">
            {i + 1}
          </span>
          <span>{step}</span>
        </div>
      ))}
    </div>
  );
}

/* ── Trust chips (.pd-trust) ────────────────────────────────────────────── */
export function TrustRow({ rating }: { rating: number }) {
  const items: { icon: IconName; label: string }[] = [
    { icon: "lock", label: "Secure connection" },
    { icon: "invoice", label: "GST invoice" },
    { icon: "rocket", label: "Pan India delivery" },
    { icon: "star-filled", label: `${rating} seller rating` },
  ];
  return (
    <div className="flex flex-wrap gap-1.5">
      {items.map((t) => (
        <span
          key={t.label}
          className="flex items-center gap-1 rounded-full border border-line bg-chip px-2.5 py-1 text-[11px] text-muted"
        >
          <Icon name={t.icon} size={12} className="text-forest" /> {t.label}
        </span>
      ))}
    </div>
  );
}

/* ── Spec table (.spec-tbl) with optional grouped rows ──────────────────── */
export type SpecRow = { label: string; value: string } | { group: string };

export function SpecTable({ rows }: { rows: SpecRow[] }) {
  return (
    <table className="w-full border-collapse">
      <tbody>
        {rows.map((row, i) =>
          "group" in row ? (
            <tr key={i}>
              <td
                colSpan={2}
                className="pb-1 pt-4 text-[10.5px] font-bold uppercase tracking-[0.1em] text-forest"
              >
                {row.group}
              </td>
            </tr>
          ) : (
            <tr key={i} className="border-b border-line last:border-b-0">
              <td className="w-[34%] py-2.5 pr-4 align-top text-[13.5px] font-medium text-muted">
                {row.label}
              </td>
              <td className="py-2.5 align-top text-[13.5px] font-semibold text-ink">{row.value}</td>
            </tr>
          ),
        )}
      </tbody>
    </table>
  );
}

/* ── Section head inside a tab pane (.pd-sec-head) ──────────────────────── */
export function PaneHead({ title, sub }: { title: string; sub: string }) {
  return (
    <div className="mb-4">
      <h3 className="font-editorial text-[25px] italic leading-tight text-ink">{title}</h3>
      <p className="mt-1 text-[13px] text-muted">{sub}</p>
    </div>
  );
}

/* ── Description pane (.desc-lead / .desc-body / .desc-tags) ─────────────── */
const DESC_LEAD =
  "“No two slabs of Carrara marble are identical — each is a geological fingerprint shaped over 200 million years in the Apuan Alps.”";
const DESC_PARAS = [
  "Sourced directly from the Apuan Alps quarries in Tuscany, Italy — home to the world's finest white marble since the time of Michelangelo. Each slab features the distinctive grey feathering on a pure snow-white background that has defined luxury interiors for centuries.",
  "Our supply chain connects directly to quarry partners, removing intermediary markups. Every consignment is inspected for consistency in background colour, vein density, and surface quality before being polished to a mirror finish at our processing facility in India.",
  "Supplied in full slabs or cut-to-size tiles. Suitable for all applications including flooring, wall cladding, kitchen islands, bathroom countertops, reception desks, and high-end staircase cladding. Fire resistant, hypoallergenic, and compliant with BIS IS 1130:2013 specifications.",
];
const DESC_TAGS = [
  "Italian marble",
  "Carrara white",
  "Luxury flooring",
  "Natural stone",
  "Bathroom countertop",
  "Kitchen island",
  "Wall cladding",
  "Commercial flooring",
  "Polished marble",
];

export function DescriptionPane({ lead, body }: { lead?: string; body?: string }) {
  return (
    <div>
      <p className="mb-3.5 font-editorial text-[16px] italic leading-[1.75] text-forest-deep">
        {lead ?? DESC_LEAD}
      </p>
      <div className="mb-3.5 text-[13.5px] leading-[1.85] text-ink">
        {body ? (
          <p>{body}</p>
        ) : (
          DESC_PARAS.map((p, i) => (
            <p key={i} className="mb-3 last:mb-0">
              {p}
            </p>
          ))
        )}
      </div>
      <div className="flex flex-wrap gap-1.5">
        {DESC_TAGS.map((t) => (
          <span key={t} className="rounded-full border border-line bg-chip px-2.5 py-1 text-[12px] text-muted">
            {t}
          </span>
        ))}
      </div>
    </div>
  );
}

/* ── Company / "About the seller" profile (.co-profile) ─────────────────── */
const CO_BADGES: { label: string; icon?: IconName; tone: "green" | "grey" }[] = [
  { label: "IB Verified", icon: "verified", tone: "green" },
  { label: "GST Registered", icon: "invoice", tone: "green" },
  { label: "MSME Certified", tone: "grey" },
  { label: "Export capable", tone: "grey" },
];
const CO_CONTACT: { icon: IconName; text: string }[] = [
  { icon: "city", text: "B-27, Lajpat Nagar II, New Delhi — 110024" },
  { icon: "clock", text: "Mon–Sat: 10:00 AM – 7:00 PM" },
  { icon: "explore", text: "www.thetilestudiodel.com" },
  { icon: "invoice", text: "GST: 07AABCT2135Q1ZC" },
  { icon: "business", text: "CIN: U45209DL2011PTC218712" },
];

export function CompanyProfile({
  item,
  onConnect,
}: {
  item: ListingItem;
  onConnect: () => void;
}) {
  const stats: { n: string; l: string }[] = [
    { n: `${item.experience ?? 13}`, l: "Years active" },
    { n: item.projects ? `${item.projects}+` : "500+", l: "Products listed" },
    { n: `${item.rating ?? 4.4}★`, l: "Platform rating" },
    { n: "14", l: "States served" },
  ];
  return (
    <div className="grid items-start gap-6 lg:grid-cols-[1fr_260px]">
      <div>
        <div className="mb-4 flex items-start gap-3.5">
          <span className="grid h-16 w-16 shrink-0 place-items-center rounded-card border-[1.5px] border-green-mint bg-green-light text-[20px] font-bold text-forest">
            {initialsOf(item.by)}
          </span>
          <div className="flex-1">
            <p className="text-[19px] font-bold text-ink">{item.by}</p>
            <p className="mb-1.5 mt-0.5 flex items-center gap-1.5 text-[12.5px] text-muted">
              <Icon name="business" size={13} className="text-forest" /> Manufacturer &amp; Wholesaler · {item.city}
            </p>
            <div className="flex flex-wrap gap-1.5">
              {CO_BADGES.map((b) => (
                <span
                  key={b.label}
                  className={`flex items-center gap-1 rounded-full px-2 py-0.5 text-[10.5px] font-semibold ${
                    b.tone === "green"
                      ? "bg-green-light text-forest"
                      : "border border-line bg-chip text-muted"
                  }`}
                >
                  {b.icon && <Icon name={b.icon} size={11} />} {b.label}
                </span>
              ))}
            </div>
          </div>
        </div>
        <div className="mb-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
          {stats.map((s) => (
            <div key={s.l} className="rounded-[10px] bg-chip px-2 py-3 text-center">
              <p className="font-editorial text-[20px] font-bold text-forest">{s.n}</p>
              <p className="mt-0.5 text-[10.5px] text-muted">{s.l}</p>
            </div>
          ))}
        </div>
        <p className="text-[13px] leading-[1.75] text-ink">
          {item.by} has been supplying premium natural stone, engineered tiles, and surface materials to
          architects, interior designers, and contractors since 2011. With direct quarry partnerships in
          Italy, Turkey, and Rajasthan, they offer competitive pricing without compromising on quality. Their
          {" "}
          {item.city} facility includes a 12,000 sq ft warehouse with over 200 SKUs in permanent stock.
        </p>
      </div>

      <div className="rounded-card bg-chip p-4">
        <p className="mb-2.5 flex items-center gap-1.5 text-[11.5px] font-bold uppercase tracking-[0.09em] text-ink">
          <Icon name="user" size={13} className="text-forest" /> Contact information
        </p>
        {CO_CONTACT.map((c) => (
          <div
            key={c.text}
            className="flex items-start gap-2 border-b border-line py-2 text-[12.5px] leading-relaxed text-ink last:border-b-0"
          >
            <Icon name={c.icon} size={15} className="mt-0.5 shrink-0 text-forest" />
            <span>{c.text}</span>
          </div>
        ))}
        <button
          onClick={onConnect}
          className="mt-3.5 flex w-full items-center justify-center gap-1.5 rounded-full bg-forest px-4 py-2.5 text-[13.5px] font-bold text-white transition hover:bg-forest-deep"
        >
          <Icon name="sparkles" size={15} /> Connect with this seller
        </button>
      </div>
    </div>
  );
}

/* ── Installation & care pane ───────────────────────────────────────────── */
const INSTALL_STEPS: { title: string; body: string }[] = [
  {
    title: "Substrate preparation",
    body: "Ensure surface is level, clean, and free of dust. Use cement-based levelling compound if required. Allow to cure fully.",
  },
  {
    title: "Adhesive selection",
    body: "Use white polymer-modified tile adhesive (C2TES1 grade minimum). Avoid grey adhesive — it may bleed through white marble.",
  },
  {
    title: "Laying & spacing",
    body: "Use 1.5–2mm spacers. Full back-buttering recommended for slabs. Check level continuously using spirit level.",
  },
  {
    title: "Grouting",
    body: "Use white epoxy grout for joints. Avoid grey cement grout — staining risk. Clean excess grout within 15 minutes.",
  },
  {
    title: "Sealing & curing",
    body: "Apply penetrating marble sealer after 24-hour cure. Reapply annually. Do not walk on surface for 48 hours.",
  },
];
const CARE_ITEMS: { text: string; warn?: boolean }[] = [
  { text: "Clean spills immediately — marble is porous and acid-sensitive" },
  { text: "Use pH-neutral stone cleaner only — never vinegar, bleach, or acidic products" },
  { text: "Use felt pads under furniture legs to prevent scratching" },
  { text: "Re-seal every 12 months with a penetrating stone sealer" },
  { text: "Professional polishing every 3–5 years restores mirror finish" },
  { text: "Do not use in high-moisture areas without proper waterproofing membrane", warn: true },
];

export function InstallPane() {
  return (
    <div className="grid gap-7 md:grid-cols-2">
      <div>
        <p className="mb-4 flex items-center gap-1.5 text-[13px] font-bold uppercase tracking-[0.09em] text-ink">
          <Icon name="settings" size={16} className="text-forest" /> Installation steps
        </p>
        <div className="flex flex-col gap-3">
          {INSTALL_STEPS.map((s, i) => (
            <div key={s.title} className="flex gap-3 text-[13.5px] text-ink">
              <span className="mt-0.5 grid h-[26px] w-[26px] shrink-0 place-items-center rounded-full bg-forest text-[11px] font-bold text-white">
                {i + 1}
              </span>
              <div>
                <strong>{s.title}</strong>
                <br />
                <span className="text-muted">{s.body}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div>
        <p className="mb-4 flex items-center gap-1.5 text-[13px] font-bold uppercase tracking-[0.09em] text-ink">
          <Icon name="sparkles" size={16} className="text-forest" /> Care &amp; maintenance
        </p>
        <div className="flex flex-col gap-2.5 rounded-card bg-green-light p-4">
          {CARE_ITEMS.map((c) => (
            <div key={c.text} className="flex gap-2 text-[13px]">
              <Icon
                name={c.warn ? "close" : "check"}
                size={14}
                className={c.warn ? "mt-0.5 shrink-0 text-danger" : "mt-0.5 shrink-0 text-forest"}
              />
              <span className={c.warn ? "text-danger" : undefined}>{c.text}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── Detail / spec table data (.spec-tbl content) ───────────────────────── */
export function detailRows(item: ListingItem): SpecRow[] {
  return [
    { label: "Category", value: `Natural marble · ${item.category}` },
    { label: "Material", value: "Italian Carrara white marble" },
    { label: "Surface finish", value: "Mirror polished" },
    { label: "Thickness", value: "18mm (slab) · 10mm (tile) available on request" },
    { label: "Standard sizes", value: "600×600mm · 900×600mm · 1200×600mm · Custom cut available" },
    { label: "Application", value: "Flooring · Wall cladding · Countertops · Feature walls · Staircases" },
    { label: "Min order qty", value: "50 sq ft per order" },
    { label: "Lead time", value: "3–5 business days (stock sizes) · 14–21 days (custom cut)" },
    { label: "Delivery", value: "Pan India via logistics partner · International on request" },
    { label: "Sample", value: "Available — ₹250 fully refundable on order" },
    { label: "HSN code", value: "2515 12 20" },
    { label: "Country of origin", value: "Italy (quarried) · India (processed & polished)" },
    { label: "Suitable for", value: "Residential · Commercial · Hospitality · Luxury projects" },
  ];
}

export const SPEC_ROWS: SpecRow[] = [
  { group: "Physical properties" },
  { label: "Compressive strength", value: "140–160 MPa" },
  { label: "Water absorption", value: "< 0.2%" },
  { label: "Flexural strength", value: "12–15 MPa" },
  { label: "Scratch resistance (Mohs)", value: "3.0 – 3.5" },
  { label: "Density", value: "2.71 g/cm³" },
  { label: "Thermal expansion", value: "4.8 × 10⁻⁶ /°C" },
  { group: "Surface & finish" },
  { label: "Standard finish", value: "Mirror polished" },
  { label: "Alternative finishes", value: "Honed · Sandblasted · Brushed (on request, +7 days)" },
  { label: "Colour consistency", value: "Grade A — white background, fine grey veining" },
  { group: "Standards & compliance" },
  { label: "IS standard", value: "IS 1130:2013 (Marble — Specification)" },
  { label: "REACH compliance", value: "Compliant" },
  { label: "Fire rating", value: "Non-combustible — Class A1 (EN 13501)" },
  { label: "Slip resistance", value: "R9 (polished) · R11 (sandblasted)" },
];

/* Small shared wrapper so panes share the prototype's card padding. */
export function Pane({ children }: { children: ReactNode }) {
  return <div>{children}</div>;
}
