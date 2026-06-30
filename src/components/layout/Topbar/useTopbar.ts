import { useCallback, useEffect, useRef, useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { selectAuth, selectRole, logout } from "@/redux/slice/authSlice";
import { PAGES } from "@/lib/constants";

/** All Topbar logic: auth state, profile menu, search submit, navigation. */
export function useTopbar() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const auth = useAppSelector(selectAuth);
  const role = useAppSelector(selectRole);

  const [query, setQuery] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // close the profile menu on outside click / Escape
  useEffect(() => {
    if (!menuOpen) return;
    const onDoc = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMenuOpen(false);
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, [menuOpen]);

  const dashboardPath = role === "seller" ? PAGES.DASHBOARD_SELLER : PAGES.DASHBOARD_BUYER;

  const onSearch = useCallback(
    (e: FormEvent) => {
      e.preventDefault();
      const q = query.trim();
      navigate(q ? `${PAGES.PRODUCTS}?q=${encodeURIComponent(q)}` : PAGES.PRODUCTS);
    },
    [query, navigate],
  );

  const goAuth = useCallback(() => navigate(PAGES.AUTH), [navigate]);
  const goPlans = useCallback(() => navigate(PAGES.PLANS), [navigate]);
  const goDashboard = useCallback(() => {
    setMenuOpen(false);
    navigate(dashboardPath);
  }, [navigate, dashboardPath]);

  const onLogout = useCallback(() => {
    dispatch(logout());
    setMenuOpen(false);
    navigate(PAGES.HOME);
  }, [dispatch, navigate]);

  return {
    auth,
    role,
    query,
    setQuery,
    onSearch,
    menuOpen,
    setMenuOpen,
    menuRef,
    dashboardPath,
    goAuth,
    goPlans,
    goDashboard,
    onLogout,
  };
}
