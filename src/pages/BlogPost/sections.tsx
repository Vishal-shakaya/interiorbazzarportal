import { Link } from "react-router-dom";
import { Icon, type IconName } from "@/components/ui";
import { SectionHeader } from "@/components/shared";
import { initialsOf } from "@/lib/listing";
import { PAGES, toBlogPost } from "@/lib/constants";
import type { BlogPost } from "@/content/blog.content";

/** Share row — matches the prototype share affordances under the article. */
export function ShareBar({ title }: { title: string }) {
  const buttons: { icon: IconName; label: string }[] = [
    { icon: "share", label: "Share" },
    { icon: "whatsapp", label: "WhatsApp" },
    { icon: "mail", label: "Email" },
    { icon: "bookmark", label: "Save" },
  ];
  return (
    <div className="mx-auto mt-12 flex max-w-3xl flex-wrap items-center gap-3 border-y border-line py-5">
      <span className="text-[13px] font-semibold uppercase tracking-[0.1em] text-muted">Share this story</span>
      <span className="sr-only">{title}</span>
      <div className="flex flex-wrap gap-2">
        {buttons.map((b) => (
          <button
            key={b.label}
            type="button"
            className="inline-flex items-center gap-2 rounded-full border border-line bg-bone-card px-4 py-2 text-[13px] font-semibold text-ink transition-colors hover:border-forest hover:text-forest"
          >
            <Icon name={b.icon} size={15} />
            {b.label}
          </button>
        ))}
      </div>
    </div>
  );
}

/** Author bio card. */
export function AuthorCard({ post }: { post: BlogPost }) {
  return (
    <div className="mx-auto mt-10 flex max-w-3xl items-start gap-4 rounded-card border border-line bg-bone-card p-6 shadow-card">
      <span className="grid h-14 w-14 shrink-0 place-items-center rounded-full bg-forest font-editorial text-[18px] italic text-white">
        {initialsOf(post.author)}
      </span>
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-accent">Written by</p>
        <p className="mt-0.5 font-editorial text-[20px] text-ink">{post.author}</p>
        <p className="mt-1.5 text-[14px] leading-relaxed text-muted">
          Contributor at the IB Journal, writing on design, materials and the business of building
          beautiful spaces.
        </p>
      </div>
    </div>
  );
}

/** Related posts grid — prototype "More from the journal". */
export function RelatedPosts({ posts }: { posts: BlogPost[] }) {
  if (!posts.length) return null;
  return (
    <section className="mx-auto mt-14 max-w-shell px-4 md:px-7">
      <SectionHeader title={<>More from the <em>journal</em></>} moreTo={PAGES.BLOG} moreLabel="Browse all" />
      <div className="grid gap-5 md:grid-cols-3">
        {posts.map((p) => (
          <Link
            key={p.slug}
            to={toBlogPost(p.slug)}
            className="group overflow-hidden rounded-card border border-line bg-bone-card shadow-card transition-all hover:-translate-y-1 hover:border-green-mint hover:shadow-lg"
          >
            <div className="h-32" style={{ background: p.bg }} />
            <div className="p-4">
              <p className="text-[10.5px] font-semibold uppercase tracking-[0.1em] text-amber">{p.category}</p>
              <h3 className="mt-1.5 line-clamp-2 font-editorial text-[16px] leading-snug text-ink">{p.title}</h3>
              <p className="mt-2 text-[12px] text-muted">
                {p.readTime} · {p.date}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
