import { useMemo, useState } from "react";
import { AsyncBoundary } from "@/components/ui";
import { PublicPage, FilterChips, SectionHeader, type Chip } from "@/components/shared";
import { useAsync } from "@/hooks/useAsync";
import { useCmsVersion } from "@/hooks/useCmsVersion";
import { BlogService } from "@/api";
import { PAGES, canonical } from "@/lib/constants";
import { BlogMasthead, FeaturedStory, ArticleCard, NewsletterBar } from "./sections";

export default function Blog() {
  const cmsV = useCmsVersion();
  const { data: posts, status, retry } = useAsync(() => BlogService.list(), [cmsV]);
  const [cat, setCat] = useState("all");

  const chips: Chip[] = useMemo(() => {
    const cats = Array.from(new Set((posts ?? []).map((p) => p.category)));
    return [{ key: "all", label: "All stories" }, ...cats.map((c) => ({ key: c, label: c }))];
  }, [posts]);

  const featured = posts && posts.length ? (posts.find((p) => p.featured) ?? posts[0]) : null;
  const rest = featured && posts ? posts.filter((p) => p.slug !== featured.slug) : [];
  const isAll = cat === "all";
  const filtered = isAll ? rest : rest.filter((p) => p.category === cat);

  return (
    <>
      <PublicPage
        title="The IB Journal — Interior Bazzar"
        description="Ideas, insights and inspiration for India's design industry — and the people who live in it."
        canonicalUrl={canonical(PAGES.BLOG)}
      />

      <BlogMasthead />

      <div className="mx-auto max-w-shell px-4 py-5 md:px-7">
        <div className="mb-8 border-b-[1.5px] border-line">
          <FilterChips chips={chips} value={cat} onChange={setCat} />
        </div>

        <AsyncBoundary
          status={status}
          onRetry={retry}
          isEmpty={!posts?.length}
          empty={<p className="py-16 text-center text-muted">The journal is being written. Check back shortly.</p>}
          skeleton={<div className="h-64 animate-pulse rounded-card bg-bone-card" />}
        >
          {featured && (
            <>
              {isAll && <FeaturedStory post={featured} />}

              <SectionHeader title={<>Latest <em>stories</em></>} />

              {filtered.length ? (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {filtered.map((p) => (
                    <ArticleCard key={p.slug} post={p} />
                  ))}
                </div>
              ) : (
                <p className="py-16 text-center text-muted">No stories found. Try a different category.</p>
              )}

              <NewsletterBar />
            </>
          )}
        </AsyncBoundary>
      </div>
    </>
  );
}
