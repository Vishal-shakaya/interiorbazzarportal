import { type ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { Icon } from "@/components/ui";
import { PAGES } from "@/lib/constants";

/** Minimal wrapper for focused flows (auth, contact): no navbar, just a Back button. */
export function CleanLayout({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const goBack = () => {
    if (window.history.length > 1) navigate(-1);
    else navigate(PAGES.HOME);
  };

  return (
    <div className="min-h-screen bg-bone">
      <button
        onClick={goBack}
        className="fixed right-4 top-4 z-50 flex items-center gap-1.5 rounded-full border border-line bg-bone-card px-3 py-2 text-[14px] text-forest shadow-card hover:border-forest"
      >
        <Icon name="chevron-left" size={18} /> Back
      </button>
      {children}
    </div>
  );
}
