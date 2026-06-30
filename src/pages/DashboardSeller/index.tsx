import { Button } from "@/components/ui";
import { useNavigate } from "react-router-dom";
import { PublicPage } from "@/components/shared";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { canonical, PAGES } from "@/lib/constants";
import { SELLER_NAV, type SellerView } from "@/content/dashboard-seller.content";
import { useDashboardSeller } from "./useDashboardSeller";
import {
  OverviewView, EnquiriesView, PipelineView, AutogrowthView, QuotationsView, SellerReviewsView,
  InsightsView, BusinessProfileView, ShopProfileView, ArchitectureProfileView, BannerAdsView,
  PlansView, BillingView,
} from "./views";
// reuse buyer views where identical
import { SavedView, ActivityView, ProfileView, SettingsView, SecurityView } from "@/pages/DashboardBuyer/views";

const VIEWS: Record<SellerView, () => JSX.Element> = {
  overview: OverviewView,
  enquiries: EnquiriesView,
  pipeline: PipelineView,
  autogrowth: AutogrowthView,
  quotations: QuotationsView,
  reviews: SellerReviewsView,
  insights: InsightsView,
  business: BusinessProfileView,
  shop: ShopProfileView,
  architecture: ArchitectureProfileView,
  bannerads: BannerAdsView,
  saved: SavedView,
  activity: ActivityView,
  profile: ProfileView,
  plans: PlansView,
  billing: BillingView,
  settings: SettingsView,
  security: SecurityView,
};

export default function DashboardSeller() {
  const { loggedIn, view, setTab, meta } = useDashboardSeller();
  const navigate = useNavigate();
  if (!loggedIn) return null;

  const Active = VIEWS[view];
  const actions =
    view === "overview" || view === "quotations" ? (
      <Button size="sm" onClick={() => navigate(PAGES.NEW_QUOTATION)}>
        New quotation
      </Button>
    ) : undefined;

  return (
    <>
      <PublicPage title="Seller dashboard" canonicalUrl={canonical(PAGES.DASHBOARD_SELLER)} noindex />
      <DashboardShell
        kind="Seller"
        groups={SELLER_NAV}
        active={view}
        onSelect={setTab}
        title={meta.title}
        subtitle={meta.subtitle}
        actions={actions}
      >
        <Active />
      </DashboardShell>
    </>
  );
}
