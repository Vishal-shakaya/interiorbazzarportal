import { useEffect, type ReactNode } from "react";
import { useLocation } from "react-router-dom";
import { cn } from "@/lib/cn";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { setSidebar, toggleSidebar } from "@/redux/slice/uiSlice";
import { Topbar } from "../Topbar";
import { Sidebar } from "../Sidebar";
import { Footer } from "../Footer";

interface PortalLayoutProps {
  children: ReactNode;
  /** Suppress the sidebar entirely (pages that ship their own, e.g. plans). */
  hideSidebar?: boolean;
}

/** Standard wrapper for all browsing pages: topbar + collapsible sidebar + main. */
export function PortalLayout({ children, hideSidebar = false }: PortalLayoutProps) {
  const dispatch = useAppDispatch();
  const open = useAppSelector((s) => s.ui.sidebarOpen);
  const { pathname } = useLocation();

  // auto-close the mobile drawer on navigation
  useEffect(() => {
    dispatch(setSidebar(false));
  }, [pathname, dispatch]);

  return (
    <div className="min-h-screen bg-bone">
      <Topbar onMenu={() => dispatch(toggleSidebar())} showMenu={!hideSidebar} />
      {!hideSidebar && <Sidebar open={open} onClose={() => dispatch(setSidebar(false))} />}

      <div className={cn("pt-[60px]", !hideSidebar && "lg:pl-[240px]")}>
        <main className="min-h-[calc(100vh-60px)]">{children}</main>
        <Footer />
      </div>
    </div>
  );
}
