import type { DashNavGroup } from "@/components/dashboard/DashboardShell";

export type BuyerView = "connections" | "saved" | "activity" | "reports" | "profile" | "membership" | "settings" | "security";

export const BUYER_NAV: DashNavGroup[] = [
  {
    items: [
      { key: "connections", label: "Connections", icon: "send", badge: "2" },
      { key: "saved", label: "Saved items", icon: "bookmark" },
      { key: "activity", label: "Recently viewed", icon: "history" },
      { key: "reports", label: "Reports & feedback", icon: "flag" },
    ],
  },
  {
    title: "Account",
    items: [
      { key: "profile", label: "My profile", icon: "user" },
      { key: "membership", label: "Membership", icon: "rosette" },
      { key: "settings", label: "Settings", icon: "settings" },
      { key: "security", label: "Password & security", icon: "lock" },
    ],
  },
];

export const BUYER_TITLES: Record<BuyerView, { title: string; subtitle: string }> = {
  connections: { title: "Connections", subtitle: "Enquiries you've sent and their status" },
  saved: { title: "Saved items", subtitle: "Products, services, businesses and architects you've bookmarked" },
  activity: { title: "Recently viewed", subtitle: "Listings you've visited in the last 30 days" },
  reports: { title: "Reports & feedback", subtitle: "Track what happens after you flag a listing or send feedback" },
  profile: { title: "My profile", subtitle: "This is how other members and businesses see you" },
  membership: { title: "Membership", subtitle: "Your plan and benefits" },
  settings: { title: "Settings", subtitle: "Manage your account information, notifications and preferences" },
  security: { title: "Password & security", subtitle: "Keep your account secure with a strong password and 2FA" },
};

export interface Connection {
  id: string;
  seller: string;
  item: string;
  status: "Pending" | "Responded" | "Closed";
  date: string;
}

export const BUYER_CONNECTIONS: Connection[] = [
  { id: "IB-2891", seller: "Kajaria Ceramics", item: "Bulk tile order for 8 BHK villa project", status: "Responded", date: "2 days ago" },
  { id: "IB-2884", seller: "Stone Studio India", item: "Carrara marble quotation for 1,200 sqft", status: "Pending", date: "4 days ago" },
  { id: "IB-2865", seller: "Ar. Priya Sharma", item: "Consultation for 4 BHK residential in Saket", status: "Responded", date: "1 week ago" },
  { id: "IB-2823", seller: "BuildRight Contractors", item: "Civil work quote — duplex renovation", status: "Closed", date: "2 weeks ago" },
  { id: "IB-2789", seller: "Hettich India", item: "Kitchen hardware showroom visit", status: "Closed", date: "3 weeks ago" },
  { id: "IB-2745", seller: "ArtLight Studio", item: "Quote for 12 brass pendant lamps", status: "Pending", date: "4 weeks ago" },
];
