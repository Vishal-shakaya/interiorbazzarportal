import { Spinner } from "@/components/ui";
import { PublicPage } from "@/components/shared";
import { useAsync } from "@/hooks/useAsync";
import { ContentService } from "@/api";
import { PAGES, canonical } from "@/lib/constants";
import { Cta, Hero, How, Problem, StatsStrip, Team, Values } from "./sections";

export default function About() {
  const { data: c, status } = useAsync(() => ContentService.about(), []);

  if (status === "loading" || status === "idle" || !c) {
    return (
      <div className="grid place-items-center py-24">
        <Spinner />
      </div>
    );
  }

  return (
    <>
      <PublicPage title={c.seo.title} description={c.seo.description} canonicalUrl={canonical(PAGES.ABOUT)} />

      <div className="mx-auto max-w-shell space-y-14 px-4 py-5 md:px-7">
        <Hero hero={c.hero} />
        <StatsStrip stats={c.stats} />
        <Problem problem={c.problem} />
        <How how={c.how} />
        <Values values={c.values} />
        <Team team={c.team} />
        <Cta cta={c.cta} />
      </div>
    </>
  );
}
