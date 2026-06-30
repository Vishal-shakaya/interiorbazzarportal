import { useMemo, useState } from "react";
import { Spinner } from "@/components/ui";
import { PublicPage, Breadcrumb, useOverlays } from "@/components/shared";
import { useAsync } from "@/hooks/useAsync";
import { ContentService } from "@/api";
import { PAGES, canonical } from "@/lib/constants";
import {
  TopRibbon,
  HeroSearch,
  ContactChannels,
  HelpTopics,
  FaqAndStatus,
  Tutorials,
  CommunityAndFeedback,
} from "./sections";

export default function Help() {
  const [query, setQuery] = useState("");
  const [cat, setCat] = useState("All");
  const { openFeedback } = useOverlays();
  const { data: c, status } = useAsync(() => ContentService.help(), []);

  const filtered = useMemo(() => {
    if (!c) return [];
    const q = query.trim().toLowerCase();
    return c.faqs.filter((f) => {
      if (cat !== "All" && f.category !== cat) return false;
      if (q && !`${f.q} ${f.a}`.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [query, cat, c]);

  if (status === "loading" || status === "idle" || !c) {
    return (
      <div className="grid place-items-center py-24">
        <Spinner />
      </div>
    );
  }

  return (
    <>
      <PublicPage title={c.seo.title} description={c.seo.description} canonicalUrl={canonical(PAGES.HELP)} />

      <div className="mx-auto max-w-shell px-4 py-5 md:px-7">
        <Breadcrumb items={[{ label: "Home", to: PAGES.HOME }, { label: "Help & Support" }]} />

        <div className="mt-3">
          <TopRibbon ribbon={c.ribbon} onChat={openFeedback} onFeedback={openFeedback} />
        </div>

        <HeroSearch hero={c.hero} query={query} onQuery={setQuery} onTag={setQuery} />

        <ContactChannels contact={c.contact} onAction={openFeedback} />

        <HelpTopics topics={c.topics} />

        <FaqAndStatus
          faqs={filtered}
          categories={c.categories}
          cat={cat}
          onCat={setCat}
          query={query}
          status={c.status}
          onFeedback={openFeedback}
        />

        <Tutorials tutorials={c.tutorials} />

        <CommunityAndFeedback community={c.community} feedback={c.feedback} onFeedback={openFeedback} />
      </div>
    </>
  );
}
