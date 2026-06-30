import { Link, useParams } from "react-router-dom";
import { Icon, Spinner } from "@/components/ui";
import { PublicPage, Breadcrumb } from "@/components/shared";
import { useAsync } from "@/hooks/useAsync";
import { useCmsVersion } from "@/hooks/useCmsVersion";
import { BlogService } from "@/api";
import { initialsOf } from "@/lib/listing";
import { PAGES, canonical, toBlogPost } from "@/lib/constants";
import { ShareBar, AuthorCard, RelatedPosts } from "./sections";

export default function BlogPost() {
  const { slug = "" } = useParams();
  const cmsV = useCmsVersion();
  const { data: post, status } = useAsync(() => BlogService.bySlug(slug), [slug, cmsV]);
  const { data: allPosts } = useAsync(() => BlogService.list(), [cmsV]);

  if (status === "loading" || status === "idle") {
    return (
      <div className="grid place-items-center py-24">
        <Spinner />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="mx-auto max-w-2xl px-5 py-24 text-center">
        <Icon name="blog" size={42} className="mx-auto text-line" />
        <h1 className="mt-4 font-editorial text-[26px] italic text-ink">Story not found</h1>
        <p className="mt-2 text-[14px] text-muted">
          The link may be broken, or the story is no longer published.
        </p>
        <Link
          to={PAGES.BLOG}
          className="mt-6 inline-flex items-center gap-2 rounded-full bg-forest px-5 py-2.5 text-[14px] font-semibold text-white"
        >
          <Icon name="chevron-left" size={16} /> Back to the journal
        </Link>
      </div>
    );
  }

  const related = (allPosts ?? []).filter((p) => p.slug !== post.slug).slice(0, 3);

  return (
    <>
      <PublicPage title={post.title} description={post.excerpt} canonicalUrl={canonical(toBlogPost(post.slug))} />

      <div className="mx-auto max-w-shell px-4 py-5 md:px-7">
        <Breadcrumb
          items={[
            { label: "Home", to: PAGES.HOME },
            { label: "The IB Journal", to: PAGES.BLOG },
            { label: post.category },
          ]}
        />

        {/* ── Article header (narrow reading column) ── */}
        <header className="mx-auto mt-7 max-w-3xl">
          <p className="text-[11.5px] font-semibold uppercase tracking-[0.12em] text-amber">{post.category}</p>
          <h1 className="mt-3.5 font-editorial text-[clamp(30px,4.4vw,46px)] leading-[1.12] tracking-[-0.01em] text-ink">
            {post.title}
          </h1>
          {post.excerpt && (
            <p className="mt-4 font-editorial text-[19px] italic leading-[1.55] text-muted">{post.excerpt}</p>
          )}
          <div className="mt-6 flex items-center gap-3">
            <span className="grid h-[42px] w-[42px] shrink-0 place-items-center rounded-full bg-forest font-editorial text-[17px] italic text-white">
              {initialsOf(post.author)}
            </span>
            <div className="leading-tight">
              <b className="block text-[14px] font-semibold text-ink">{post.author}</b>
              <span className="flex items-center gap-1.5 text-[12.5px] text-muted">
                <Icon name="clock" size={13} /> {post.readTime} · {post.date}
              </span>
            </div>
          </div>
        </header>

        {/* ── Cover ── */}
        <div
          className="mx-auto mt-8 aspect-[16/8] max-w-[980px] overflow-hidden rounded-card shadow-card"
          style={{ background: post.bg }}
        />

        {/* ── Article body ── */}
        <article className="mx-auto mt-9 max-w-3xl text-[17.5px] leading-[1.78] text-ink">
          {post.body.map((b, i) =>
            b.h ? (
              <h2 key={i} className="mb-3.5 mt-9 font-editorial text-[26px] leading-[1.25] text-ink">
                {b.h}
              </h2>
            ) : (
              <p key={i} className="mb-5 text-ink/90">
                {b.p}
              </p>
            ),
          )}

          {/* ── Pull-quote (prototype .art-body blockquote) ── */}
          <blockquote className="my-7 border-l-[3px] border-amber py-1.5 pl-5 font-editorial text-[20px] italic leading-[1.5] text-forest">
            "On Interior Bazzar every seller is reviewed for genuineness — your shortlist starts from a
            place of trust."
          </blockquote>
        </article>

        <ShareBar title={post.title} />
        <AuthorCard post={post} />
      </div>

      <RelatedPosts posts={related} />

      <div className="py-10" />
    </>
  );
}
