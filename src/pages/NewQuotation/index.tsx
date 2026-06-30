import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Button, Input, Select, Icon } from "@/components/ui";
import { PublicPage } from "@/components/shared";
import { useAlert } from "@/providers";
import { PAGES, canonical } from "@/lib/constants";

interface Line {
  id: number;
  kind: "product" | "service";
  desc: string;
  hsn: string;
  qty: number;
  unit: string;
  rate: number;
  discType: "percent" | "flat";
  discVal: number;
}

const SELLER = {
  name: "Feelsafe Technology India",
  addr: "New Delhi, Delhi",
  phone: "+91 89208 98168",
  email: "help@interiorbazzar.com",
  gstin: "07AAFCF1234A1ZK",
  state: "Delhi",
};

const UNITS = ["pieces", "sqft", "sqm", "kg", "meter", "box", "hours", "days", "lump sum", "set"];

const STATES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Delhi", "Goa", "Gujarat",
  "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra",
  "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu",
  "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal", "Jammu and Kashmir", "Ladakh",
  "Chandigarh", "Puducherry", "Andaman and Nicobar Islands",
  "Dadra and Nagar Haveli and Daman and Diu", "Lakshadweep",
];

const GST_RATES = [0, 5, 12, 18, 28];

const TERMS_TEMPLATE = [
  "1. This quotation is valid for 30 days from the date of issue.",
  "2. 50% advance on order confirmation. Balance payable before delivery / on completion of work.",
  "3. GST as applicable is shown above.",
  "4. Delivery timelines mentioned are indicative and may vary based on order volume.",
  "5. Goods once sold will not be taken back or exchanged.",
  "6. Any disputes shall be subject to the jurisdiction of New Delhi courts only.",
  "7. Subject to Force Majeure conditions.",
].join("\n");

const fmt = (n: number) =>
  "₹" + (Number(n) || 0).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const isoToday = (off = 0) => {
  const d = new Date();
  if (off) d.setDate(d.getDate() + off);
  return d.toISOString().slice(0, 10);
};

function genNumber() {
  return `IB-Q-${new Date().getFullYear()}-0015`;
}

function numberToWords(value: number) {
  let num = Math.round(Number(value) || 0);
  if (num === 0) return "Rupees Zero Only";
  const a = ["", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten",
    "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"];
  const b = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];
  const two = (n: number) => (n < 20 ? a[n] : b[Math.floor(n / 10)] + (n % 10 ? " " + a[n % 10] : ""));
  const three = (n: number) =>
    (n > 99 ? a[Math.floor(n / 100)] + " Hundred" + (n % 100 ? " " : "") : "") + (n % 100 ? two(n % 100) : "");
  let out = "";
  const cr = Math.floor(num / 10000000); num %= 10000000;
  const l = Math.floor(num / 100000); num %= 100000;
  const t = Math.floor(num / 1000); num %= 1000;
  if (cr) out += two(cr) + " Crore ";
  if (l) out += two(l) + " Lakh ";
  if (t) out += two(t) + " Thousand ";
  if (num) out += three(num);
  return "Rupees " + out.trim().replace(/\s+/g, " ") + " Only";
}

function lineNet(it: Line) {
  const gross = (Number(it.qty) || 0) * (Number(it.rate) || 0);
  const d = Number(it.discVal) || 0;
  let disc = it.discType === "percent" ? (gross * d) / 100 : Math.min(d, gross);
  disc = Math.min(disc, gross);
  return { gross, disc, net: Math.max(0, gross - disc) };
}

let nextId = 2;

export default function NewQuotation() {
  const { success, error: showError } = useAlert();

  const [qNumber] = useState(genNumber);
  const [qDate, setQDate] = useState(() => isoToday(0));
  const [qValid, setQValid] = useState(() => isoToday(30));
  const [placeOfSupply, setPlaceOfSupply] = useState(SELLER.state);

  const [buyer, setBuyer] = useState({
    name: "", gstin: "", phone: "", email: "", city: "", state: SELLER.state, addr: "",
  });
  const setB = (patch: Partial<typeof buyer>) => setBuyer((b) => ({ ...b, ...patch }));

  const [lines, setLines] = useState<Line[]>([
    { id: 1, kind: "product", desc: "", hsn: "", qty: 1, unit: "pieces", rate: 0, discType: "percent", discVal: 0 },
  ]);
  const [gstRate, setGstRate] = useState(18);
  const [notes, setNotes] = useState("");
  const [terms, setTerms] = useState(TERMS_TEMPLATE);
  const [savedMsg, setSavedMsg] = useState("");

  const update = (id: number, patch: Partial<Line>) =>
    setLines((ls) => ls.map((l) => (l.id === id ? { ...l, ...patch } : l)));
  const remove = (id: number) =>
    setLines((ls) => {
      const next = ls.filter((l) => l.id !== id);
      return next.length ? next : ls;
    });
  const add = (kind: "product" | "service") =>
    setLines((ls) => [
      ...ls,
      {
        id: nextId++, kind, desc: "", hsn: "", qty: 1,
        unit: kind === "service" ? "hours" : "pieces", rate: 0, discType: "percent", discVal: 0,
      },
    ]);
  const toggleDisc = (id: number) =>
    setLines((ls) =>
      ls.map((l) => (l.id === id ? { ...l, discType: l.discType === "percent" ? "flat" : "percent" } : l)));

  const totals = useMemo(() => {
    let gross = 0, totalDisc = 0;
    lines.forEach((it) => {
      const n = lineNet(it);
      gross += n.gross;
      totalDisc += n.disc;
    });
    const taxable = Math.max(0, gross - totalDisc);
    const intra = placeOfSupply === SELLER.state;
    let cgst = 0, sgst = 0, igst = 0;
    if (intra) {
      cgst = (taxable * (gstRate / 2)) / 100;
      sgst = cgst;
    } else {
      igst = (taxable * gstRate) / 100;
    }
    const grand = taxable + cgst + sgst + igst;
    return { gross, disc: totalDisc, taxable, intra, cgst, sgst, igst, grand };
  }, [lines, placeOfSupply, gstRate]);

  const validate = () => {
    const p: string[] = [];
    if (!buyer.name.trim()) p.push("buyer name");
    if (!qDate) p.push("date");
    const hasLine = lines.some(
      (it) => it.desc.trim() && (Number(it.qty) || 0) > 0 && (Number(it.rate) || 0) > 0,
    );
    if (!hasLine) p.push("at least one item with a description, quantity and rate");
    return p;
  };

  const ensure = () => {
    const p = validate();
    if (p.length) {
      showError("Please add: " + p.join(" · "));
      return false;
    }
    return true;
  };

  const saveQuote = () => {
    if (!ensure()) return;
    setSavedMsg(`Saved · ${qNumber}`);
    success(`Saved · ${qNumber}`);
  };

  const downloadPdf = () => {
    if (!ensure()) return;
    success("Quotation PDF prepared.");
  };

  const shareWhatsapp = () => {
    if (!ensure()) return;
    const msg = `Hi ${buyer.name || "there"}, here is your quotation ${qNumber} from ${SELLER.name} — total ${fmt(totals.grand)}.${qValid ? ` Valid until ${qValid}.` : ""} Please review and let me know if you have any questions.`;
    let digits = (buyer.phone || "").replace(/[^0-9]/g, "");
    const hadPlus = /\+/.test(buyer.phone || "");
    if (digits.length === 11 && digits.charAt(0) === "0") digits = digits.slice(1);
    if (digits.length === 10 && !hadPlus) digits = "91" + digits;
    window.open(`https://wa.me/${digits}?text=${encodeURIComponent(msg)}`, "_blank", "noopener");
  };

  const half = gstRate / 2;
  const grandWords = numberToWords(totals.grand);

  const fieldCls =
    "w-full rounded-field border border-line bg-bone-card px-3 py-2 text-[13px] text-ink outline-none transition-colors focus:border-forest";
  const cellCls =
    "w-full rounded-[6px] border border-transparent bg-transparent px-1.5 py-1.5 text-[13px] text-ink outline-none transition-colors hover:border-line hover:bg-white focus:border-forest focus:bg-white";

  return (
    <div className="min-h-screen bg-bone pb-10">
      <PublicPage title="New quotation" canonicalUrl={canonical(PAGES.NEW_QUOTATION)} noindex />

      {/* topbar */}
      <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-line bg-bone-card px-6">
        <Link
          to={`${PAGES.DASHBOARD_SELLER}?tab=quotations`}
          className="flex items-center gap-1.5 rounded-field px-2.5 py-1.5 text-[13px] font-semibold text-muted transition-colors hover:bg-bone hover:text-ink"
        >
          <Icon name="chevron-left" size={16} /> Back
        </Link>
        <span className="h-5 w-px bg-line" />
        <span className="text-[14.5px] font-bold text-ink">New quotation</span>
      </header>

      <div className="mx-auto max-w-shell px-4 py-5 md:px-7">
        <div className="mb-4">
          <h1 className="font-editorial text-[24px] font-bold tracking-tight text-ink">New quotation</h1>
          <p className="mt-0.5 text-[13px] text-muted">
            Add the buyer and items, apply per-line discounts, set tax, then save or share.
          </p>
        </div>

        <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_312px]">
          {/* LEFT: builder */}
          <div className="min-w-0 rounded-card border border-line bg-bone-card p-5 shadow-card md:px-6">
            {/* meta */}
            <div className="mb-[18px] grid gap-[18px] rounded-card border border-line bg-bone p-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="flex min-w-0 flex-col gap-1.5">
                <span className="text-[10.5px] font-bold uppercase tracking-wider text-muted">Quotation no.</span>
                <span className="font-mono text-[13px] font-bold tabular-nums text-ink">{qNumber}</span>
              </div>
              <div className="flex flex-col gap-1.5">
                <span className="text-[10.5px] font-bold uppercase tracking-wider text-muted">Date</span>
                <input type="date" value={qDate} onChange={(e) => setQDate(e.target.value)} className={fieldCls} />
              </div>
              <div className="flex flex-col gap-1.5">
                <span className="text-[10.5px] font-bold uppercase tracking-wider text-muted">Valid until</span>
                <input type="date" value={qValid} onChange={(e) => setQValid(e.target.value)} className={fieldCls} />
              </div>
              <div className="flex flex-col gap-1.5">
                <span className="text-[10.5px] font-bold uppercase tracking-wider text-muted">Place of supply</span>
                <select
                  value={placeOfSupply}
                  onChange={(e) => setPlaceOfSupply(e.target.value)}
                  className={`${fieldCls} cursor-pointer`}
                >
                  {STATES.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* FROM */}
            <div className="mb-[18px]">
              <div className="mb-2.5 pl-0.5 text-[10.5px] font-bold uppercase tracking-wider text-muted">From</div>
              <div className="flex flex-wrap items-center gap-4 rounded-card border border-line-strong bg-bone px-[18px] py-3.5">
                <span className="text-[15px] font-bold tracking-tight text-ink">{SELLER.name}</span>
                <span className="hidden h-6 w-px bg-line-strong sm:block" />
                <div className="flex flex-wrap items-center gap-4 text-[12.5px] text-muted">
                  <span>
                    <span className="mr-1 text-[9.5px] font-bold uppercase tracking-wide text-muted">GSTIN</span>
                    {SELLER.gstin}
                  </span>
                  <span>{SELLER.addr}</span>
                  <span className="flex items-center gap-1">
                    <Icon name="phone" size={12} /> {SELLER.phone}
                  </span>
                  <span className="flex items-center gap-1">
                    <Icon name="mail" size={12} /> {SELLER.email}
                  </span>
                </div>
                <Link
                  to={`${PAGES.DASHBOARD_SELLER}?tab=business`}
                  className="ml-auto inline-flex items-center gap-1 rounded-[6px] border border-line-strong px-2.5 py-1.5 text-[11px] font-bold text-forest-deep transition-colors hover:border-green-mint hover:bg-green-light"
                >
                  <Icon name="settings" size={12} /> Edit
                </Link>
              </div>
            </div>

            {/* BILL TO */}
            <div className="mb-[18px]">
              <div className="mb-2.5 pl-0.5 text-[10.5px] font-bold uppercase tracking-wider text-muted">Bill to</div>
              <div className="rounded-card border border-line-strong bg-bone p-[18px]">
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  <Input
                    label={<>Buyer name <span className="text-forest">*</span></>}
                    value={buyer.name}
                    onChange={(e) => setB({ name: e.target.value })}
                    placeholder="e.g. Kajaria Ceramics"
                    autoComplete="off"
                  />
                  <Input
                    label="Buyer GSTIN"
                    value={buyer.gstin}
                    onChange={(e) => setB({ gstin: e.target.value.toUpperCase() })}
                    placeholder="e.g. 07ABCDE1234F1Z5"
                    autoComplete="off"
                    className="uppercase"
                  />
                  <Input
                    label="Phone"
                    value={buyer.phone}
                    onChange={(e) => setB({ phone: e.target.value })}
                    placeholder="+91 9xxxxxxxxx"
                    autoComplete="off"
                  />
                  <Input
                    label="Email"
                    type="email"
                    value={buyer.email}
                    onChange={(e) => setB({ email: e.target.value })}
                    placeholder="buyer@example.com"
                    autoComplete="off"
                  />
                  <Input
                    label="City"
                    value={buyer.city}
                    onChange={(e) => setB({ city: e.target.value })}
                    placeholder="New Delhi"
                    autoComplete="off"
                  />
                  <Select
                    label="State"
                    value={buyer.state}
                    onChange={(e) => {
                      setB({ state: e.target.value });
                      setPlaceOfSupply(e.target.value);
                    }}
                  >
                    {STATES.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </Select>
                  <div className="sm:col-span-2 lg:col-span-3">
                    <Input
                      label="Address (optional)"
                      value={buyer.addr}
                      onChange={(e) => setB({ addr: e.target.value })}
                      placeholder="Street / area / pincode"
                      autoComplete="off"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* ITEMS */}
            <div className="mb-[18px]">
              <div className="mb-2.5 flex flex-wrap items-center justify-between gap-2.5">
                <span className="pl-0.5 text-[10.5px] font-bold uppercase tracking-wider text-muted">Items</span>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => add("product")}
                    className="inline-flex items-center gap-1.5 rounded-[14px] border border-line-strong bg-white px-2.5 py-1.5 text-[11.5px] font-bold text-ink transition-colors hover:border-forest hover:bg-green-light hover:text-forest"
                  >
                    <Icon name="plus" size={13} /> Add product
                  </button>
                  <button
                    type="button"
                    onClick={() => add("service")}
                    className="inline-flex items-center gap-1.5 rounded-[14px] border border-line-strong bg-white px-2.5 py-1.5 text-[11.5px] font-bold text-ink transition-colors hover:border-forest hover:bg-green-light hover:text-forest"
                  >
                    <Icon name="plus" size={13} /> Add service
                  </button>
                </div>
              </div>

              <div className="overflow-hidden rounded-card border border-line-strong bg-bone">
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[880px] border-collapse">
                    <thead>
                      <tr className="border-b border-line bg-bone-tint text-[10.5px] font-bold uppercase tracking-wider text-muted">
                        <th className="w-[26px] px-2.5 py-2.5 text-right">#</th>
                        <th className="min-w-[200px] px-2.5 py-2.5 text-left">Description</th>
                        <th className="w-24 px-2.5 py-2.5 text-left">HSN / SAC</th>
                        <th className="w-[58px] px-2.5 py-2.5 text-right">Qty</th>
                        <th className="w-24 px-2.5 py-2.5 text-left">Unit</th>
                        <th className="w-[104px] px-2.5 py-2.5 text-right">Rate (₹)</th>
                        <th className="w-32 px-2.5 py-2.5 text-right">Discount</th>
                        <th className="w-[120px] px-2.5 py-2.5 text-right">Amount (₹)</th>
                        <th className="w-[34px] px-2.5 py-2.5" />
                      </tr>
                    </thead>
                    <tbody>
                      {lines.map((it, i) => {
                        const n = lineNet(it);
                        const ph =
                          it.kind === "service"
                            ? "e.g. Modular kitchen — design & install"
                            : "e.g. Carrara White Italian Marble 800×1200";
                        return (
                          <tr key={it.id} className="border-b border-line last:border-b-0 hover:bg-black/[0.012]">
                            <td className="px-1.5 py-1 text-right text-[11.5px] font-bold tabular-nums text-muted">
                              {i + 1}
                            </td>
                            <td className="px-1.5 py-1">
                              <input
                                value={it.desc}
                                onChange={(e) => update(it.id, { desc: e.target.value })}
                                placeholder={ph}
                                className={cellCls}
                              />
                            </td>
                            <td className="px-1.5 py-1">
                              <input
                                value={it.hsn}
                                onChange={(e) => update(it.id, { hsn: e.target.value })}
                                placeholder="—"
                                className={cellCls}
                              />
                            </td>
                            <td className="px-1.5 py-1">
                              <input
                                type="number"
                                min={0}
                                step={1}
                                value={it.qty}
                                onChange={(e) => update(it.id, { qty: +e.target.value })}
                                className={`${cellCls} text-right tabular-nums`}
                              />
                            </td>
                            <td className="px-1.5 py-1">
                              <select
                                value={it.unit}
                                onChange={(e) => update(it.id, { unit: e.target.value })}
                                className={`${cellCls} cursor-pointer`}
                              >
                                {UNITS.map((u) => (
                                  <option key={u} value={u}>{u}</option>
                                ))}
                              </select>
                            </td>
                            <td className="px-1.5 py-1">
                              <input
                                type="number"
                                min={0}
                                step={0.01}
                                value={it.rate}
                                onChange={(e) => update(it.id, { rate: +e.target.value })}
                                className={`${cellCls} text-right tabular-nums`}
                              />
                            </td>
                            <td className="px-1.5 py-1">
                              <div className="flex items-center gap-1">
                                <input
                                  type="number"
                                  min={0}
                                  step={0.01}
                                  value={it.discVal}
                                  onChange={(e) => update(it.id, { discVal: +e.target.value })}
                                  className={`${cellCls} min-w-[44px] flex-1 text-right tabular-nums`}
                                />
                                <button
                                  type="button"
                                  title="Switch between % and ₹"
                                  onClick={() => toggleDisc(it.id)}
                                  className="h-7 w-7 flex-shrink-0 rounded-[7px] border border-line-strong bg-white text-[12px] font-extrabold text-forest transition-colors hover:border-forest hover:bg-green-light"
                                >
                                  {it.discType === "percent" ? "%" : "₹"}
                                </button>
                              </div>
                            </td>
                            <td className="whitespace-nowrap px-2.5 py-1 text-right text-[13px] font-bold tabular-nums text-ink">
                              {fmt(n.net)}
                            </td>
                            <td className="px-1.5 py-1 text-right">
                              <button
                                type="button"
                                title="Remove"
                                onClick={() => remove(it.id)}
                                disabled={lines.length <= 1}
                                className="rounded-[6px] p-1.5 text-muted transition-colors hover:bg-err-bg hover:text-err disabled:cursor-not-allowed disabled:opacity-25"
                              >
                                <Icon name="trash" size={15} />
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* NOTES + SUMMARY */}
            <div className="grid items-start gap-[18px] lg:grid-cols-2">
              <div>
                <div className="mb-2.5 pl-0.5 text-[10.5px] font-bold uppercase tracking-wider text-muted">
                  Notes to buyer (optional)
                </div>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Anything the buyer should know — scope, exclusions, lead time, payment preference…"
                  className="min-h-[130px] w-full resize-y rounded-field border border-line bg-bone-card px-3 py-2.5 text-[13px] leading-relaxed text-muted outline-none transition-colors focus:border-forest"
                />
              </div>
              <div>
                <div className="mb-2.5 pr-0.5 text-right text-[10.5px] font-bold uppercase tracking-wider text-muted">
                  Summary
                </div>
                <div className="rounded-card border border-line-strong bg-bone px-[18px] py-3.5">
                  <SumRow label="Gross amount" value={fmt(totals.gross)} />
                  {totals.disc > 0 && (
                    <SumRow label="Discount on items" value={`−${fmt(totals.disc)}`} valueClass="text-err" />
                  )}
                  <SumRow label="Taxable value" value={fmt(totals.taxable)} />
                  <div className="flex items-center justify-between gap-3.5 py-1.5 text-[13px]">
                    <span className="flex items-center gap-2 font-bold text-muted">
                      GST rate
                      <select
                        value={gstRate}
                        onChange={(e) => setGstRate(+e.target.value)}
                        className="cursor-pointer rounded-[6px] border border-line bg-white px-2 py-0.5 pr-5 text-[11.5px] font-bold text-ink outline-none focus:border-forest"
                      >
                        {GST_RATES.map((r) => (
                          <option key={r} value={r}>{r}%</option>
                        ))}
                      </select>
                    </span>
                    <span />
                  </div>
                  {totals.intra ? (
                    <>
                      <SumRow label={`CGST (${half}%)`} value={fmt(totals.cgst)} />
                      <SumRow label={`SGST (${half}%)`} value={fmt(totals.sgst)} />
                    </>
                  ) : (
                    <SumRow label={`IGST (${gstRate}%)`} value={fmt(totals.igst)} />
                  )}
                  <div className="mt-1.5 flex items-center justify-between gap-3.5 border-t border-line pt-2.5 text-[14.5px]">
                    <span className="font-bold text-ink">Grand total</span>
                    <span className="text-[17px] font-bold tabular-nums tracking-tight text-forest">
                      {fmt(totals.grand)}
                    </span>
                  </div>
                  <div className="mt-2 text-right text-[11.5px] italic leading-relaxed text-muted">{grandWords}</div>
                </div>
              </div>
            </div>

            {/* TERMS */}
            <div className="mt-[18px]">
              <div className="mb-2.5 pl-0.5 text-[10.5px] font-bold uppercase tracking-wider text-muted">
                Terms &amp; conditions
              </div>
              <textarea
                value={terms}
                onChange={(e) => setTerms(e.target.value)}
                className="min-h-24 w-full resize-y rounded-field border border-line bg-bone-card px-3 py-2.5 text-[13px] leading-relaxed text-muted outline-none transition-colors focus:border-forest"
              />
            </div>

            <div className="mt-[18px] flex items-center justify-center gap-2 text-[12px] text-muted">
              <Icon name="sparkles" size={14} className="text-green-mint" /> Generated via Interior bazzar ·
              interiorbazzar.com
            </div>
          </div>

          {/* RIGHT: actions */}
          <aside className="rounded-card border border-line bg-bone-card p-[18px] shadow-card lg:sticky lg:top-[74px]">
            <div className="text-[10.5px] font-bold uppercase tracking-wider text-muted">Grand total</div>
            <div className="mt-1 text-[26px] font-extrabold tabular-nums tracking-tight text-forest">
              {fmt(totals.grand)}
            </div>
            <div className="mt-1 text-[11px] italic leading-snug text-muted">{grandWords}</div>
            <div className="my-4 border-t border-line" />
            <Button block onClick={saveQuote} className="mb-2.5">
              <Icon name="download" size={16} /> Save
            </Button>
            <Button block variant="secondary" onClick={downloadPdf} className="mb-2.5">
              <Icon name="download" size={16} /> Download PDF
            </Button>
            <Button block variant="secondary" onClick={shareWhatsapp}>
              <Icon name="whatsapp" size={16} /> Share on WhatsApp
            </Button>
            {savedMsg && (
              <div className="mt-3 flex items-center gap-2 rounded-field border border-green-mint bg-green-light px-3 py-2.5 text-[12px] font-bold text-forest-deep">
                <Icon name="check" size={15} /> {savedMsg}
              </div>
            )}
            <Link
              to={`${PAGES.DASHBOARD_SELLER}?tab=quotations`}
              className="mt-3 block text-center text-[12px] font-semibold text-muted transition-colors hover:text-ink"
            >
              Cancel
            </Link>
          </aside>
        </div>
      </div>
    </div>
  );
}

function SumRow({ label, value, valueClass = "" }: { label: string; value: string; valueClass?: string }) {
  return (
    <div className="flex items-center justify-between gap-3.5 py-1.5 text-[13px]">
      <span className="font-bold text-muted">{label}</span>
      <span className={`whitespace-nowrap text-right font-bold tabular-nums text-ink ${valueClass}`}>{value}</span>
    </div>
  );
}
