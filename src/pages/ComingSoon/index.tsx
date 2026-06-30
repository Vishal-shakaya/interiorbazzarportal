import { Link } from "react-router-dom";
import { Button } from "@/components/ui";
import { PublicPage } from "@/components/shared/Seo";
import { PAGES, canonical } from "@/lib/constants";

/**
 * Temporary placeholder for routes whose real page lands in a later milestone.
 * Keeps the whole route map navigable from M2 onward. Replace per milestone.
 */
export function ComingSoon({ name, milestone }: { name: string; milestone?: string }) {
  return (
    <>
      <PublicPage title={name} canonicalUrl={canonical(PAGES.HOME)} noindex />
      <div className="mx-auto flex max-w-2xl flex-col items-center px-5 py-24 text-center">
        <p className="eyebrow mb-3">Coming soon</p>
        <h1 className="display-1 mb-3">{name}</h1>
        <p className="max-w-md text-muted">
          This page is part of the portal build and will be implemented
          {milestone ? ` in ${milestone}` : " shortly"}. Navigation, layout and theme are live.
        </p>
        <Link to={PAGES.HOME} className="mt-6">
          <Button variant="secondary">Back to home</Button>
        </Link>
      </div>
    </>
  );
}
