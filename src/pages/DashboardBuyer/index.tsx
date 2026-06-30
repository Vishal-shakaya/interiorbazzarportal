import { PublicPage } from "@/components/shared";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { canonical, PAGES } from "@/lib/constants";
import { BUYER_NAV, type BuyerView } from "@/content/dashboard-buyer.content";
import { useDashboardBuyer } from "./useDashboardBuyer";
import {
  ConnectionsView,
  SavedView,
  ActivityView,
  ReportsView,
  ProfileView,
  MembershipView,
  SettingsView,
  SecurityView,
} from "./views";

const VIEWS: Record<BuyerView, () => JSX.Element> = {
  connections: ConnectionsView,
  saved: SavedView,
  activity: ActivityView,
  reports: ReportsView,
  profile: ProfileView,
  membership: MembershipView,
  settings: SettingsView,
  security: SecurityView,
};

export default function DashboardBuyer() {
  const { loggedIn, view, setTab, meta } = useDashboardBuyer();
  if (!loggedIn) return null; // guard redirects in the hook

  const Active = VIEWS[view];

  return (
    <>
      <PublicPage title="Buyer dashboard" canonicalUrl={canonical(PAGES.DASHBOARD_BUYER)} noindex />
      <DashboardShell
        kind="Buyer"
        groups={BUYER_NAV}
        active={view}
        onSelect={setTab}
        title={meta.title}
        subtitle={meta.subtitle}
      >
        <Active />
      </DashboardShell>
    </>
  );
}
