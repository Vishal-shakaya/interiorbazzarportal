/** Blog content — used by the Blog post page (M6) and the Blog listing (M7). */

export interface BlogBlock {
  /** A subheading when `h` is set, otherwise a paragraph. */
  h?: string;
  p?: string;
}

export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  author: string;
  date: string;
  readTime: string;
  category: string;
  bg: string;
  featured?: boolean;
  body: BlogBlock[];
}

const lorem = (s: string): BlogBlock[] => [
  { p: s },
  { h: "Where to begin" },
  { p: "Start with how you actually live in the space. The best interiors are planned around daily rituals — where light falls in the morning, where people gather, where clutter tends to collect." },
  { p: "Then layer in materials. Warm woods, honest stone and considered lighting do more for a room than any single statement piece." },
  { h: "Working with verified professionals" },
  { p: "On Interior Bazzar every seller is reviewed for genuineness, so your shortlist starts from a place of trust. Send one enquiry and it's routed exclusively to that professional — no spam, no bidding war." },
  { p: "Take your time, compare a few options, and choose the partner whose work feels like yours." },
];

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: "10-ideas-small-spaces",
    title: "10 ideas to make small spaces feel twice as big",
    excerpt: "Smart, calm tricks for compact homes — from lighting to layout — that add room without adding walls.",
    author: "Asha Mehta",
    date: "12 Jun 2026",
    readTime: "6 min read",
    category: "Guides",
    bg: "linear-gradient(135deg,#1a3a2e 0%,#085041 55%,#2d7a5e 100%)",
    featured: true,
    body: lorem("Small homes don't have to feel small. With a few considered choices, a compact flat can feel open, calm and generous."),
  },
  {
    slug: "modular-kitchen-guide",
    title: "The honest guide to planning a modular kitchen",
    excerpt: "What actually matters when you plan a kitchen — and the questions to ask before you commit.",
    author: "Rahul Verma",
    date: "5 Jun 2026",
    readTime: "8 min read",
    category: "Guides",
    bg: "linear-gradient(160deg,#fdf3e3 0%,#e8c987 50%,#ba7517 100%)",
    body: lorem("A kitchen is the hardest-working room in the house. Planning it well pays back every single day."),
  },
  {
    slug: "choosing-marble-tiles",
    title: "Marble vs tiles: choosing surfaces that last",
    excerpt: "A practical comparison of cost, maintenance and feel — so you choose with confidence.",
    author: "Saket Rao",
    date: "28 May 2026",
    readTime: "5 min read",
    category: "Materials",
    bg: "linear-gradient(160deg,#fdf3e3 0%,#e8c987 50%,#ba7517 100%)",
    body: lorem("Surfaces set the tone of a space. The right choice balances how it looks, how it ages and how it lives."),
  },
  {
    slug: "lighting-layers",
    title: "Lighting in layers: the trick designers swear by",
    excerpt: "Ambient, task and accent — how to combine them for rooms that feel alive at any hour.",
    author: "Neha Iyer",
    date: "20 May 2026",
    readTime: "4 min read",
    category: "Studio",
    bg: "linear-gradient(135deg,#2c2c3e 0%,#4a4a6a 50%,#8a8aaa 100%)",
    body: lorem("Good lighting is invisible — you feel it before you notice it. The secret is layering."),
  },
  {
    slug: "working-with-architect",
    title: "What to expect when you work with an architect",
    excerpt: "From first brief to handover — a clear picture of the journey and how to make it smooth.",
    author: "Vikram Shah",
    date: "14 May 2026",
    readTime: "7 min read",
    category: "Routing",
    bg: "linear-gradient(135deg,#053b30 0%,#085041 50%,#1d9e75 100%)",
    body: lorem("A good architect turns a vague wish into a buildable plan. Knowing the process helps you collaborate well."),
  },
  {
    slug: "sustainable-interiors",
    title: "Sustainable interiors that don't compromise on style",
    excerpt: "Materials and choices that are kinder to the planet — and still beautiful.",
    author: "Priya Nair",
    date: "6 May 2026",
    readTime: "6 min read",
    category: "News",
    bg: "linear-gradient(160deg,#e1f5ee 0%,#9fe1cb 50%,#085041 100%)",
    body: lorem("Sustainability and beauty aren't opposites. The most timeless interiors are often the most responsible ones."),
  },
];

export const findPost = (slug: string) => BLOG_POSTS.find((p) => p.slug === slug);
