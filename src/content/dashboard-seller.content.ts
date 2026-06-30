import type { DashNavGroup } from "@/components/dashboard/DashboardShell";

export type SellerView =
  | "overview" | "enquiries" | "pipeline" | "autogrowth" | "quotations" | "reviews" | "insights"
  | "business" | "shop" | "architecture" | "bannerads"
  | "saved" | "activity"
  | "profile" | "plans" | "billing" | "settings" | "security";

export const SELLER_NAV: DashNavGroup[] = [
  {
    title: "Inbox & pipeline",
    items: [
      { key: "overview", label: "Overview", icon: "dashboard" },
      { key: "enquiries", label: "Enquiries", icon: "mail-opened", badge: "3" },
      { key: "pipeline", label: "Pipeline", icon: "kanban" },
      { key: "autogrowth", label: "Autogrowth", icon: "sparkles" },
      { key: "quotations", label: "Quotations", icon: "invoice" },
      { key: "reviews", label: "Reviews", icon: "star" },
      { key: "insights", label: "Insights", icon: "insights" },
    ],
  },
  {
    title: "Business",
    items: [
      { key: "business", label: "Business", icon: "business" },
      { key: "shop", label: "Shop", icon: "shops" },
      { key: "architecture", label: "Architecture", icon: "architecture" },
      { key: "bannerads", label: "Banner ads", icon: "photo" },
    ],
  },
  {
    title: "Personal",
    items: [
      { key: "saved", label: "Saved", icon: "bookmark" },
      { key: "activity", label: "Recent activity", icon: "history" },
    ],
  },
  {
    title: "Account",
    items: [
      { key: "profile", label: "Profile", icon: "user" },
      { key: "plans", label: "Plans", icon: "plans" },
      { key: "billing", label: "Billing", icon: "billing" },
      { key: "settings", label: "Settings", icon: "settings" },
      { key: "security", label: "Password & security", icon: "lock" },
    ],
  },
];

export const SELLER_TITLES: Record<SellerView, { title: string; subtitle: string }> = {
  overview: { title: "Overview", subtitle: "Your business at a glance" },
  enquiries: { title: "Enquiries", subtitle: "Qualified, contact-verified leads" },
  pipeline: { title: "Pipeline", subtitle: "Move deals from new to won" },
  autogrowth: { title: "Autogrowth", subtitle: "Automated growth & upsells" },
  quotations: { title: "Quotations", subtitle: "Create and track quotes" },
  reviews: { title: "Reviews", subtitle: "What customers are saying" },
  insights: { title: "Insights", subtitle: "Views, clicks and conversion" },
  business: { title: "Business profile", subtitle: "How buyers see your business" },
  shop: { title: "Shop", subtitle: "Your showroom listing" },
  architecture: { title: "Architecture", subtitle: "Your portfolio profile" },
  bannerads: { title: "Banner ads", subtitle: "Promote across the marketplace" },
  saved: { title: "Saved", subtitle: "Items you've bookmarked" },
  activity: { title: "Recent activity", subtitle: "Your browsing history" },
  profile: { title: "Profile", subtitle: "Your personal details" },
  plans: { title: "Plans", subtitle: "Your subscription & entitlements" },
  billing: { title: "Billing", subtitle: "Invoices and payment" },
  settings: { title: "Settings", subtitle: "Preferences and notifications" },
  security: { title: "Password & security", subtitle: "Keep your account safe" },
};

export interface Enquiry {
  id: string;
  name: string;
  need: string;
  tier: "A" | "B" | "C" | "D";
  priority: "P1" | "P2" | "P3";
  when: string;
}

export const SELLER_ENQUIRIES: Enquiry[] = [
  { id: "e1", name: "Asha Mehta", need: "Full home interior — 3BHK", tier: "A", priority: "P1", when: "12 min ago" },
  { id: "e2", name: "Imran Q.", need: "Modular kitchen quote", tier: "B", priority: "P2", when: "1 hour ago" },
  { id: "e3", name: "Divya R.", need: "Marble flooring, 1200 sq ft", tier: "A", priority: "P1", when: "3 hours ago" },
  { id: "e4", name: "Karthik N.", need: "Lighting consultation", tier: "C", priority: "P3", when: "Yesterday" },
];

export const PIPELINE_STAGES = [
  { key: "new", label: "New", desc: "Just landed", deals: ["Asha Mehta — 3BHK interior", "Divya R. — Marble flooring"] },
  { key: "contacted", label: "Contacted", desc: "Replied, waiting", deals: ["Imran Q. — Modular kitchen"] },
  { key: "quoted", label: "Quoted", desc: "Quote sent", deals: ["Sana M. — Office fit-out"] },
  { key: "meeting", label: "Meeting", desc: "Site visit / call", deals: ["Karthik N. — Lighting consult"] },
  { key: "won", label: "Won", desc: "Deal closed", deals: ["Rohit P. — 2BHK turnkey"] },
  { key: "lost", label: "Lost", desc: "Not converted", deals: [] },
];

export interface Quotation {
  id: string;
  number: string;
  client: string;
  amount: number;
  status: "Draft" | "Sent" | "Accepted";
  date: string;
}

export const SELLER_QUOTATIONS: Quotation[] = [
  { id: "q1", number: "IB-Q-2026-0042", client: "Asha Mehta", amount: 285000, status: "Sent", date: "2 days ago" },
  { id: "q2", number: "IB-Q-2026-0041", client: "Rohit P.", amount: 540000, status: "Accepted", date: "1 week ago" },
  { id: "q3", number: "IB-Q-2026-0040", client: "Sana M.", amount: 120000, status: "Draft", date: "1 week ago" },
];

export const SELLER_INVOICES = [
  { id: "i1", number: "INV-2026-06", plan: "Autogrowth Scale", amount: 9999, date: "1 Jun 2026", status: "Paid" },
  { id: "i2", number: "INV-2026-05", plan: "Autogrowth Scale", amount: 9999, date: "1 May 2026", status: "Paid" },
  { id: "i3", number: "INV-2026-04", plan: "Autogrowth Launch", amount: 4999, date: "1 Apr 2026", status: "Paid" },
];
