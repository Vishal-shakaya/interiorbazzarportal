/** Canonical plan catalogue (prototype IBPlans/IBEntitlements-equivalent). */

export type BillingCycle = "mo" | "q" | "yr";

export interface Plan {
  id: string;
  name: string;
  tagline: string;
  /** Annual price (₹/year) used as the canonical headline & for checkout. */
  priceMonthly: number;
  features: string[];
  highlight?: boolean;
  /** Who the plan is for (prototype "plan-target"). */
  target?: string;
  /** One-line headline outcome (prototype "plan-outcome"). */
  outcome?: string;
  /** Small savings/visibility tag under the price (prototype "plan-saving"). */
  saving?: string;
  /** Footer note under the CTA (prototype "plan-note"). */
  note?: string;
  /** Display price per billing cycle (prototype data-mo/q/yr). */
  prices?: Record<BillingCycle, string>;
  /** GST line per billing cycle (prototype data-gst-*). */
  gst?: Record<BillingCycle, string>;
}

export interface PlanFamily {
  key: string;
  label: string;
  /** Sidebar sub-label (prototype cat-tab-sub). */
  sub?: string;
  blurb: string;
  /** Hero eyebrow / heading / sub for the family (prototype hero). */
  eyebrow?: string;
  heading?: string;
  headingEm?: string;
  heroSub?: string;
  /** Annual-billing savings badge on the toggle (prototype dur-save-badge). */
  saveBadge?: string;
  /** Whether this family offers the monthly/quarterly/annual toggle. */
  cycles?: boolean;
  /** Marks the "growth engine" family (Autogrowth) for distinct styling. */
  growth?: boolean;
  plans: Plan[];
}

export const PLAN_FAMILIES: PlanFamily[] = [
  {
    key: "business",
    label: "Business",
    sub: "Firms & studios",
    blurb: "Get verified and discovered as a trusted business.",
    eyebrow: "for designers, studios & firms",
    heading: "Your business profile,",
    headingEm: "built to attract.",
    heroSub:
      "A networking, visibility & authority platform for the interior & sanitary ecosystem. Plans differ by market reach, visibility and opportunity access.",
    saveBadge: "Save 17%",
    cycles: true,
    plans: [
      {
        id: "business-verified",
        name: "Verified",
        tagline: "Businesses starting their digital journey",
        target: "Businesses starting their digital journey",
        priceMonthly: 14999,
        prices: { mo: "₹1,499", q: "₹3,999", yr: "₹14,999" },
        gst: { mo: "billed monthly", q: "billed quarterly", yr: "+ GST = ₹17,699 total" },
        saving: "3-state visibility",
        outcome: "Get discovered across 3 states",
        note: "No hidden charges · Cancel anytime",
        features: [
          "3-state visibility",
          "1 category · 3 search keywords",
          "25 product · 10 service listings",
          "Business portfolio showcase",
          "Smart proposal builder + CRM hub",
          "Basic analytics dashboard",
          "IB Verified badge · 24/7 support",
        ],
      },
      {
        id: "business-trusted",
        name: "Trusted Business",
        tagline: "Growing businesses seeking more reach",
        target: "Growing businesses seeking more reach",
        priceMonthly: 39999,
        highlight: true,
        prices: { mo: "₹3,999", q: "₹10,999", yr: "₹39,999" },
        gst: { mo: "billed monthly", q: "billed quarterly", yr: "+ GST = ₹47,199 total" },
        saving: "Pan-India · priority placement",
        outcome: "Pan-India priority visibility",
        note: "Best for growing studios & firms",
        features: [
          "Pan-India · priority placement",
          "2 categories · 5 search keywords",
          "100 product · 50 service listings",
          "Premium network access",
          "Advanced CRM + visual deal pipeline",
          "Professional proposal builder",
          "Advanced analytics dashboard",
          "Trusted Business badge · priority support",
        ],
      },
      {
        id: "business-leader",
        name: "Industry Leader",
        tagline: "Established firms · high-value projects",
        target: "Established firms · high-value projects",
        priceMonthly: 89999,
        prices: { mo: "₹8,999", q: "₹24,999", yr: "₹89,999" },
        gst: { mo: "billed monthly", q: "billed quarterly", yr: "+ GST = ₹1,06,199 total" },
        saving: "Pan-India · featured placement",
        outcome: "High-value project pipeline",
        note: "For firms closing ₹1Cr+ annual projects",
        features: [
          "Pan-India · featured placement",
          "3 categories · 10 search keywords",
          "Unlimited listings & catalogues",
          "Full network access",
          "Priority opportunity routing · limited competition",
          "Professional CRM + branded proposals",
          "Multi-stage deal pipeline",
          "Industry Leader badge · personal support",
        ],
      },
    ],
  },
  {
    key: "shops",
    label: "Shop",
    sub: "Showrooms & retailers",
    blurb: "Bring your showroom online and invite visits.",
    eyebrow: "for showrooms, retailers & distributors",
    heading: "Your storefront,",
    headingEm: "found first.",
    heroSub:
      "Turn your storefront into an always-on digital shop — discoverable, contactable, ready to convert. Every plan captures WhatsApp, call & form enquiries into one dashboard.",
    saveBadge: "Save 14%",
    cycles: true,
    plans: [
      {
        id: "shop-verified",
        name: "Shop Verified",
        tagline: "Local retailers & small shops",
        target: "Local retailers & small shops",
        priceMonthly: 7999,
        prices: { mo: "₹775", q: "₹1,999", yr: "₹7,999" },
        gst: { mo: "billed monthly", q: "billed quarterly", yr: "+ GST = ₹9,439 total" },
        saving: "Local reach, real footfall",
        outcome: "Local buyers find your shop first",
        note: "Single city · 1 shop location",
        features: [
          "Complete digital profile",
          "Customer & enquiry dashboard",
          "Product & service showcase + gallery",
          "Smart quotation builder",
          "WhatsApp enquiries · click-to-call",
          "Offers & promotions",
          "Verified Shop badge · 24/7 support",
        ],
      },
      {
        id: "shop-plus",
        name: "Shop Plus",
        tagline: "Growing retailers, dealers & distributors",
        target: "Growing retailers, dealers & distributors",
        priceMonthly: 14999,
        highlight: true,
        prices: { mo: "₹1,499", q: "₹3,999", yr: "₹14,999" },
        gst: { mo: "billed monthly", q: "billed quarterly", yr: "+ GST = ₹17,699 total" },
        saving: "City-wide · priority visibility",
        outcome: "City-wide buyers + priority visibility",
        note: "Best for tile, sanitary, furniture & lighting",
        features: [
          "Complete digital profile",
          "Customer & enquiry dashboard",
          "Product & service showcase + gallery",
          "Smart quotation builder",
          "City-wide reach · priority visibility",
          "Featured product banner · IB Connect Plus",
          "Trusted Seller badge · priority support",
        ],
      },
      {
        id: "shop-pro",
        name: "Shop Pro",
        tagline: "Established retailers & multi-location stores",
        target: "Established retailers & multi-location stores",
        priceMonthly: 24999,
        prices: { mo: "₹2,499", q: "₹6,999", yr: "₹24,999" },
        gst: { mo: "billed monthly", q: "billed quarterly", yr: "+ GST = ₹29,499 total" },
        saving: "State-wide · featured placement",
        outcome: "State-wide reach + campaign tools",
        note: "Wholesalers & multi-location stores",
        features: [
          "Complete digital profile",
          "Customer & enquiry dashboard",
          "Product & service showcase",
          "State-wide reach · featured placement",
          "Premium product promotion · IB Connect Elite",
          "Campaign manager + sales dashboard",
          "Premium Seller badge · personal support",
        ],
      },
    ],
  },
  {
    key: "architecture",
    label: "Architecture",
    sub: "Profile & portfolio",
    blurb: "Showcase your portfolio to the right clients.",
    eyebrow: "for individual architects",
    heading: "Your profile,",
    headingEm: "your portfolio.",
    heroSub:
      "Showcase your design expertise. Turn your practice into a discoverable design portfolio — projects, credentials & consultation booking in one profile.",
    saveBadge: "Save 17%",
    cycles: true,
    plans: [
      {
        id: "arch-verified",
        name: "Architect Verified",
        tagline: "Freelance architects & emerging studios",
        target: "Freelance architects & emerging studios",
        priceMonthly: 9999,
        prices: { mo: "₹999", q: "₹2,499", yr: "₹9,999" },
        gst: { mo: "billed monthly", q: "billed quarterly", yr: "+ GST = ₹11,799 total" },
        saving: "Local project visibility",
        outcome: "Discovered by local buyers & studios",
        note: "Solo architects & consultants",
        features: [
          "Complete architect profile",
          "Project portfolio showcase + gallery",
          "Consultation booking",
          "Customer & project dashboard",
          "Smart proposal builder",
          "WhatsApp & call enquiries",
          "Verified Architect badge · 24/7 support",
        ],
      },
      {
        id: "arch-plus",
        name: "Architect Plus",
        tagline: "Growing architecture & design studios",
        target: "Growing architecture & design studios",
        priceMonthly: 19999,
        highlight: true,
        prices: { mo: "₹1,999", q: "₹5,499", yr: "₹19,999" },
        gst: { mo: "billed monthly", q: "billed quarterly", yr: "+ GST = ₹23,599 total" },
        saving: "City-wide · priority visibility",
        outcome: "City-wide reach + credibility tools",
        note: "For studios handling ₹50L+ projects",
        features: [
          "Complete architect profile",
          "Project portfolio showcase + gallery",
          "Consultation booking",
          "Customer & project dashboard",
          "City-wide reach · priority visibility",
          "Team showcase · awards & certifications",
          "IB Architect Network Plus",
          "Trusted Architect badge · priority support",
        ],
      },
      {
        id: "arch-pro",
        name: "Architect Pro",
        tagline: "Established firms · turnkey projects",
        target: "Established firms · turnkey projects",
        priceMonthly: 39999,
        prices: { mo: "₹3,999", q: "₹10,999", yr: "₹39,999" },
        gst: { mo: "billed monthly", q: "billed quarterly", yr: "+ GST = ₹47,199 total" },
        saving: "State-wide · featured placement",
        outcome: "State-wide reach + performance insights",
        note: "Residential, commercial & turnkey firms",
        features: [
          "Premium architect profile",
          "Premium portfolio showcase",
          "Consultation booking",
          "Customer & project dashboard",
          "State-wide reach · featured placement",
          "Advanced proposal builder",
          "Project performance insights",
          "IB Network Elite · personal support",
        ],
      },
    ],
  },
  {
    key: "autogrowth",
    label: "Autogrowth",
    sub: "AI qualified enquiries",
    blurb: "Done-for-you ad campaigns that turn into qualified, exclusive enquiries.",
    eyebrow: "attract · qualify · convert",
    heading: "The process your business never had time to",
    headingEm: "build.",
    heroSub:
      "A full AI qualification engine — every enquiry screened before it reaches you. One qualified enquiry → one business. Never broadcast to competitors.",
    growth: true,
    cycles: false,
    plans: [
      {
        id: "ag-launch",
        name: "Autogrowth Launch",
        tagline: "For firms starting structured growth",
        target: "For firms starting structured growth",
        priceMonthly: 79999,
        prices: { mo: "₹79,999", q: "₹79,999", yr: "₹79,999" },
        gst: { mo: "+ ₹14,400 GST = ₹94,399 total", q: "+ ₹14,400 GST = ₹94,399 total", yr: "+ ₹14,400 GST = ₹94,399 total" },
        saving: "₹9,999/mo · ₹24,999/quarter",
        outcome: "Structured, qualified growth",
        note: "No hidden charges · Cancel anytime",
        features: [
          "2-state market reach",
          "2 project segments",
          "3 high-intent search rankings",
          "Customer enquiry qualification",
          "WhatsApp verification",
          "Smart proposal builder · real-time chat",
          "ROI dashboard",
          "24/7 support",
        ],
      },
      {
        id: "ag-scale",
        name: "Autogrowth Scale",
        tagline: "Scaling across states with exclusivity",
        target: "Scaling across states with exclusivity",
        priceMonthly: 212399,
        highlight: true,
        prices: { mo: "₹2,12,399", q: "₹2,12,399", yr: "₹2,12,399" },
        gst: { mo: "+ ₹38,232 GST = ₹2,50,631 total", q: "+ ₹38,232 GST = ₹2,50,631 total", yr: "+ ₹38,232 GST = ₹2,50,631 total" },
        saving: "Billed annually only",
        outcome: "Exclusive multi-state acquisition",
        note: "Most popular among growing firms",
        features: [
          "5-state exclusive reach",
          "3 high-value project segments",
          "6 high-intent search rankings",
          "Advanced customer qualification",
          "WhatsApp verification",
          "Opportunity tracking dashboard",
          "Controlled competition",
          "Dedicated support",
        ],
      },
      {
        id: "ag-dominance",
        name: "Autogrowth Dominance",
        tagline: "Market leaders · maximum exclusivity",
        target: "Market leaders · maximum exclusivity",
        priceMonthly: 499999,
        prices: { mo: "₹4,99,999", q: "₹4,99,999", yr: "₹4,99,999" },
        gst: { mo: "+ ₹90,000 GST = ₹5,89,999 total", q: "+ ₹90,000 GST = ₹5,89,999 total", yr: "+ ₹90,000 GST = ₹5,89,999 total" },
        saving: "Billed annually only",
        outcome: "Pan-India category dominance",
        note: "Maximum reach & exclusivity",
        features: [
          "Pan-India reach · maximum visibility",
          "All project segments",
          "10+ high-intent search rankings",
          "Premium customer verification",
          "Priority opportunity routing",
          "Category exclusivity",
          "Personal account manager",
          "Customer & enquiry dashboard + chat",
        ],
      },
    ],
  },
];

export const PLANS_FAQ = [
  { q: "Can I change my plan later?", a: "Yes — upgrade, downgrade or change duration anytime from your seller dashboard." },
  { q: "What does 'qualified lead' mean?", a: "Every enquiry is contact-verified (OTP) and intent-checked before it reaches you. No spam, no tyre-kickers." },
  { q: "Is there a commission on deals?", a: "No. You keep 100% of every deal — we only charge for the plan." },
  { q: "How is billing handled?", a: "Plans are billed monthly, quarterly or annually. This is a prototype, so no real payment is taken." },
];
