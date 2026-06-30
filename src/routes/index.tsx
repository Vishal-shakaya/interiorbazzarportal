import { Routes, Route } from "react-router-dom";
import { PortalLayout, CleanLayout } from "@/components/layout";
import { ComingSoon } from "@/pages/ComingSoon";
import Home from "@/pages/Home";
import Explore from "@/pages/Explore";
import Trending from "@/pages/Trending";
import RecentlyViewed from "@/pages/RecentlyViewed";
import Products from "@/pages/Products";
import Services from "@/pages/Services";
import Catalogues from "@/pages/Catalogues";
import Businesses from "@/pages/Businesses";
import Architects from "@/pages/Architects";
import Shops from "@/pages/Shops";
import ProductDetail from "@/pages/ProductDetail";
import ServiceDetail from "@/pages/ServiceDetail";
import BusinessDetail from "@/pages/BusinessDetail";
import ArchitectDetail from "@/pages/ArchitectDetail";
import BlogPost from "@/pages/BlogPost";
import Blog from "@/pages/Blog";
import About from "@/pages/About";
import Help from "@/pages/Help";
import Contact from "@/pages/Contact";
import Auth from "@/pages/Auth";
import Plans from "@/pages/Plans";
import Legal from "@/pages/Legal";
import DashboardBuyer from "@/pages/DashboardBuyer";
import DashboardSeller from "@/pages/DashboardSeller";
import NewQuotation from "@/pages/NewQuotation";
import AdEnquiryFlow from "@/pages/AdEnquiryFlow";
import { PAGES } from "@/lib/constants";

/**
 * Central route table. Each route maps a PAGES path → page element → layout.
 * Pages land milestone-by-milestone; until then a <ComingSoon> placeholder keeps
 * the whole map navigable. Replace the element as each milestone ships.
 */

// Convenience wrappers so route entries stay one line each.
const portal = (name: string, milestone: string, hideSidebar = false) => (
  <PortalLayout hideSidebar={hideSidebar}>
    <ComingSoon name={name} milestone={milestone} />
  </PortalLayout>
);

export function AppRoutes() {
  return (
    <Routes>
      {/* discovery */}
      <Route path={PAGES.HOME} element={<PortalLayout><Home /></PortalLayout>} />
      <Route path={PAGES.EXPLORE} element={<PortalLayout><Explore /></PortalLayout>} />
      <Route path={PAGES.TRENDING} element={<PortalLayout><Trending /></PortalLayout>} />
      <Route path={PAGES.RECENTLY_VIEWED} element={<PortalLayout><RecentlyViewed /></PortalLayout>} />

      {/* browse — listings */}
      <Route path={PAGES.PRODUCTS} element={<PortalLayout><Products /></PortalLayout>} />
      <Route path={PAGES.PRODUCT_DETAIL} element={<PortalLayout><ProductDetail /></PortalLayout>} />
      <Route path={PAGES.SERVICES} element={<PortalLayout><Services /></PortalLayout>} />
      <Route path={PAGES.SERVICE_DETAIL} element={<PortalLayout><ServiceDetail /></PortalLayout>} />
      <Route path={PAGES.CATALOGUES} element={<PortalLayout><Catalogues /></PortalLayout>} />
      <Route path={PAGES.BUSINESSES} element={<PortalLayout><Businesses /></PortalLayout>} />
      <Route path={PAGES.BUSINESS_DETAIL} element={<PortalLayout><BusinessDetail /></PortalLayout>} />
      <Route path={PAGES.ARCHITECTS} element={<PortalLayout><Architects /></PortalLayout>} />
      <Route path={PAGES.ARCHITECT_DETAIL} element={<PortalLayout><ArchitectDetail /></PortalLayout>} />
      <Route path={PAGES.SHOPS} element={<PortalLayout><Shops /></PortalLayout>} />

      {/* content */}
      <Route path={PAGES.BLOG} element={<PortalLayout><Blog /></PortalLayout>} />
      <Route path={PAGES.BLOG_POST} element={<PortalLayout><BlogPost /></PortalLayout>} />
      <Route path={PAGES.ABOUT} element={<PortalLayout><About /></PortalLayout>} />
      <Route path={PAGES.HELP} element={<PortalLayout><Help /></PortalLayout>} />
      <Route path={PAGES.CONTACT} element={<CleanLayout><Contact /></CleanLayout>} />

      {/* commerce & auth */}
      <Route path={PAGES.AUTH} element={<CleanLayout><Auth /></CleanLayout>} />
      <Route path={PAGES.PLANS} element={<PortalLayout hideSidebar><Plans /></PortalLayout>} />

      {/* legal — one template, five content sets */}
      <Route path={PAGES.TERMS} element={<PortalLayout><Legal /></PortalLayout>} />
      <Route path={PAGES.PRIVACY} element={<PortalLayout><Legal /></PortalLayout>} />
      <Route path={PAGES.REFUND} element={<PortalLayout><Legal /></PortalLayout>} />
      <Route path={PAGES.DISCLAIMER} element={<PortalLayout><Legal /></PortalLayout>} />
      <Route path={PAGES.COOKIES} element={<PortalLayout><Legal /></PortalLayout>} />

      {/* dashboards — self-contained chrome, no layout wrapper */}
      <Route path={PAGES.DASHBOARD_BUYER} element={<DashboardBuyer />} />
      <Route path={PAGES.DASHBOARD_SELLER} element={<DashboardSeller />} />
      <Route path={PAGES.NEW_QUOTATION} element={<NewQuotation />} />
      <Route path={PAGES.AD_ENQUIRY_FLOW} element={<AdEnquiryFlow />} />

      {/* 404 */}
      <Route path="*" element={portal("Page not found", "M2")} />
    </Routes>
  );
}
