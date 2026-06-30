import { useState } from "react";
import { Link } from "react-router-dom";
import { Icon } from "@/components/ui";
import { initialsOf } from "@/lib/listing";
import { toBlogPost } from "@/lib/constants";
import type { BlogPost } from "@/content/blog.content";

/* ── MASTHEAD ── */
export function BlogMasthead() {
  return (
    <div className="border-b-2 border-ink bg-bone-card px-4 pb-5 pt-7 md:px-7">
      <div className="mx-auto flex max-w-shell flex-col items-start justify-between gap-5 md:flex-row md:items-end">
        <div>
          <p className="mb-1.5 text-[11px] font-bold uppercase tracking-[0.18em] text-forest">Interior Bazzar</p>
          <h1 className="font-editorial text-[44px] font-bold leading-[0.95] tracking-tight text-ink md:text-[58px]">
            The <em className="not-italic text-forest italic">IB</em>
            <br />
            Journal
          </h1>
          <p className="mt-2 max-w-[36ch] text-[14px] leading-relaxed text-muted">
            Ideas, insights and inspiration for India's design industry — and the people who live in it.
          </p>
        </div>
        <div className="text-left md:text-right">
          <div className="font-editorial text-[13px] tracking-wide text-muted">Est. 2024 · Design &amp; Business</div>
        </div>
      </div>
    </div>
  );
}

/* ── FEATURED HERO CARD ── */
export function FeaturedStory({ post }: { post: BlogPost }) {
  return (
    <Link
      to={toBlogPost(post.slug)}
      className="group mb-12 grid overflow-hidden rounded-card border border-line bg-bone-card shadow-card md:grid-cols-2"
    >
      <div className="relative aspect-[3/2] overflow-hidden">
        <div
          className="h-full w-full transition-transform duration-500 group-hover:scale-105"
          style={{ background: post.bg }}
        />
        <span className="absolute left-4 top-4 inline-flex items-center gap-1 rounded-full bg-forest px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-white">
          <Icon name="sparkles" size={12} /> Editor's pick
        </span>
      </div>
      <div className="flex flex-col justify-between gap-5 p-8 md:p-10">
        <div>
          <p className="mb-2.5 text-[11px] font-bold uppercase tracking-[0.12em] text-forest">{post.category}</p>
          <h2 className="mb-3.5 font-editorial text-[28px] font-bold leading-tight tracking-tight text-ink md:text-[32px]">
            {post.title}
          </h2>
          <p className="text-[15px] leading-relaxed text-muted">{post.excerpt}</p>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="grid h-[34px] w-[34px] place-items-center rounded-full bg-gradient-to-br from-forest to-accent text-[13px] font-bold text-white">
              {initialsOf(post.author)}
            </span>
            <div>
              <div className="text-[13px] font-semibold text-ink">{post.author}</div>
              <div className="text-[12px] text-muted">
                {post.readTime} · {post.date}
              </div>
            </div>
          </div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-forest px-5 py-2.5 text-[13.5px] font-bold text-white transition group-hover:bg-forest-deep">
            Read article <Icon name="arrow-right" size={15} />
          </span>
        </div>
      </div>
    </Link>
  );
}

/* ── ARTICLE CARD ── */
export function ArticleCard({ post }: { post: BlogPost }) {
  return (
    <Link
      to={toBlogPost(post.slug)}
      className="group flex flex-col overflow-hidden rounded-card border border-line bg-bone-card transition hover:-translate-y-1 hover:border-green-mint hover:shadow-card"
    >
      <div className="relative aspect-[16/10] overflow-hidden">
        <div
          className="h-full w-full transition-transform duration-500 group-hover:scale-105"
          style={{ background: post.bg }}
        />
        <span className="absolute left-3 top-3 rounded-full border border-green-mint bg-bone-card px-2.5 py-1 text-[10.5px] font-bold uppercase tracking-wider text-forest">
          {post.category}
        </span>
      </div>
      <div className="flex flex-1 flex-col p-5">
        <p className="mb-1.5 text-[11px] font-bold uppercase tracking-[0.1em] text-forest">{post.category}</p>
        <h3 className="mb-2 font-editorial text-[19px] font-bold leading-snug tracking-tight text-ink">
          {post.title}
        </h3>
        <p className="mb-3.5 line-clamp-3 flex-1 text-[13.5px] leading-relaxed text-muted">{post.excerpt}</p>
        <div className="flex items-center justify-between border-t border-line pt-3">
          <span className="flex items-center gap-1 text-[12px] text-muted">
            <Icon name="clock" size={13} /> {post.readTime}
          </span>
          <span className="text-[12px] text-muted">{post.date}</span>
        </div>
      </div>
    </Link>
  );
}

/* ── NEWSLETTER ── */
export function NewsletterBar() {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);

  const subscribe = () => {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) return;
    setDone(true);
    setEmail("");
  };

  return (
    <div className="mt-12 flex flex-col items-start justify-between gap-6 rounded-card border border-line bg-bone-card p-8 md:flex-row md:items-center md:p-10">
      <div>
        <h3 className="font-editorial text-[24px] font-bold text-ink">
          Never miss a story from <em className="not-italic text-forest italic">IB Journal</em>
        </h3>
        <p className="mt-1 text-[14px] text-muted">
          New articles on design, business and industry trends — every two weeks. No spam.
        </p>
      </div>
      <div className="flex w-full shrink-0 flex-col gap-2.5 sm:flex-row md:w-auto">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your@email.com"
          className="w-full rounded-lg border-[1.5px] border-line bg-bone px-4 py-3 text-[14px] outline-none transition focus:border-forest sm:w-60"
        />
        <button
          onClick={subscribe}
          className="shrink-0 rounded-lg bg-forest px-6 py-3 text-[14px] font-bold text-white transition hover:bg-forest-deep"
        >
          {done ? "✓ Subscribed" : "Subscribe"}
        </button>
      </div>
    </div>
  );
}
