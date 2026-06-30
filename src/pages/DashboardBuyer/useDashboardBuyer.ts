import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSearchParam } from "@/hooks/useSearchParam";
import { useAppSelector } from "@/redux/hooks";
import { selectIsLoggedIn } from "@/redux/slice/authSlice";
import { PAGES } from "@/lib/constants";
import { BUYER_TITLES, type BuyerView } from "@/content/dashboard-buyer.content";

const TABS = Object.keys(BUYER_TITLES) as BuyerView[];

/** Buyer dashboard logic: ?tab routing + auth guard. */
export function useDashboardBuyer() {
  const navigate = useNavigate();
  const loggedIn = useAppSelector(selectIsLoggedIn);
  const [tab, setTab] = useSearchParam("tab", "connections");

  // client-side auth guard (prototype): logged-out users go to sign-in
  useEffect(() => {
    if (!loggedIn) navigate(PAGES.AUTH, { replace: true });
  }, [loggedIn, navigate]);

  const view: BuyerView = (TABS.includes(tab as BuyerView) ? tab : "connections") as BuyerView;

  return { loggedIn, view, setTab, meta: BUYER_TITLES[view] };
}
