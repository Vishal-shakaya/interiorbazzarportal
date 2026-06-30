import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSearchParam } from "@/hooks/useSearchParam";
import { useAppSelector } from "@/redux/hooks";
import { selectIsLoggedIn } from "@/redux/slice/authSlice";
import { PAGES } from "@/lib/constants";
import { SELLER_TITLES, type SellerView } from "@/content/dashboard-seller.content";

const TABS = Object.keys(SELLER_TITLES) as SellerView[];

/** Seller dashboard logic: ?tab routing + auth guard. */
export function useDashboardSeller() {
  const navigate = useNavigate();
  const loggedIn = useAppSelector(selectIsLoggedIn);
  const [tab, setTab] = useSearchParam("tab", "overview");

  useEffect(() => {
    if (!loggedIn) navigate(PAGES.AUTH, { replace: true });
  }, [loggedIn, navigate]);

  const view: SellerView = (TABS.includes(tab as SellerView) ? tab : "overview") as SellerView;

  return { loggedIn, view, setTab, meta: SELLER_TITLES[view] };
}
