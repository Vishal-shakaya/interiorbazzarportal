import type { IconName } from "@/components/ui";
import type { HeroSlide } from "@/components/shared";
import { PAGES, canonical } from "@/lib/constants";

export interface CategoryChip {
  key: string;
  label: string;
  icon: IconName;
}

export interface HomeContent {
  seo: { title: string; description: string; canonicalUrl: string };
  categories: CategoryChip[];
  heroSlides: HeroSlide[];
  sellerBand: {
    eyebrow: string;
    title: string;
    titleEm: string;
    sub: string;
    ctaLabel: string;
    points: string[];
  };
}

export const HOME_CONTENT: HomeContent = {
  seo: {
    title: "Interior bazzar — Find your interior match",
    description:
      "A curated marketplace connecting you with verified interior products, services, businesses and architects across India.",
    canonicalUrl: canonical(PAGES.HOME),
  },

  categories: [
    { key: "all", label: "All", icon: "explore" },
    { key: "near", label: "Near me", icon: "city" },
    { key: "verified", label: "Verified", icon: "verified" },
    { key: "open", label: "Open now", icon: "clock" },
    { key: "interior", label: "Interior design", icon: "services" },
    { key: "architecture", label: "Architecture", icon: "architects" },
    { key: "kitchen", label: "Modular kitchen", icon: "services" },
    { key: "tiles", label: "Tiles & marble", icon: "products" },
    { key: "sanitary", label: "Sanitary ware", icon: "products" },
    { key: "lighting", label: "Lighting", icon: "products" },
    { key: "furniture", label: "Furniture", icon: "products" },
    { key: "turnkey", label: "Turnkey", icon: "services" },
    { key: "3d", label: "3D visualization", icon: "services" },
    { key: "sustainable", label: "Sustainable", icon: "products" },
    { key: "vastu", label: "Vastu compliant", icon: "services" },
    { key: "office", label: "Office interior", icon: "business" },
  ],

  // Ported 1:1 from the prototype hero (assets/ib-hero.js DEFAULT_SLIDES) —
  // photographic bands with themed gradient + Unsplash photo + scrim.
  heroSlides: [
    {
      id: "h1",
      theme: "linear-gradient(120deg,#04342c 0%,#085041 60%,#1d9e75 100%)",
      accent: "#9fe7cf",
      scrim: "linear-gradient(100deg,rgba(4,52,44,.93) 0%,rgba(6,58,48,.80) 44%,rgba(8,80,65,.30) 100%)",
      bgImage: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=1200&h=480&fit=crop&q=80",
      cardImage: "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=300&h=200&fit=crop&q=72",
      eyebrow: "Verified interior & sanitary",
      icon: "rosette",
      title: "Find your interior",
      titleEm: "match.",
      sub: "Interior bazzar runs the process your business never had time to build. We attract the right people, qualify their interest, intent, and urgency — then connect the genuine ones to you.",
      ctas: [
        { label: "Find your match", to: PAGES.PRODUCTS },
        { label: "List your business", to: PAGES.PLANS, variant: "secondary" },
      ],
      stats: [
        { value: "500+", label: "Verified businesses" },
        { value: "120/mo", label: "Projects matched" },
        { value: "4.8 ★", label: "5-star rated" },
      ],
    },
    {
      id: "h2",
      theme: "linear-gradient(120deg,#7a3a00 0%,#b35c00 55%,#e88c2a 100%)",
      accent: "#fddba5",
      scrim: "linear-gradient(100deg,rgba(46,22,0,.94) 0%,rgba(90,42,0,.80) 44%,rgba(122,58,0,.30) 100%)",
      bgImage: "https://images.unsplash.com/photo-1556909212-d5b604d0c90d?w=1200&h=480&fit=crop&q=80",
      cardImage: "https://images.unsplash.com/photo-1631679706909-1844bbd07221?w=300&h=200&fit=crop&q=72",
      eyebrow: "Seller growth platform",
      icon: "trending",
      title: "Stop chasing clients.",
      titleEm: "Let them find you.",
      sub: "3-step qualification filters every enquiry by contact, genuineness and urgency before it reaches you. No more cold chasing — only genuine buyers.",
      ctas: [
        { label: "List my business", to: PAGES.PLANS },
        { label: "See plans", to: PAGES.PLANS, variant: "secondary" },
      ],
      stats: [
        { value: "3×", label: "Higher close rate" },
        { value: "₹0", label: "Commission on deals" },
        { value: "48h", label: "Avg. first connection" },
      ],
    },
    {
      id: "h3",
      theme: "linear-gradient(120deg,#0d1f3c 0%,#1a3a6e 55%,#2e5aa8 100%)",
      accent: "#a8c8ff",
      scrim: "linear-gradient(100deg,rgba(7,16,34,.94) 0%,rgba(12,28,56,.80) 44%,rgba(13,31,60,.30) 100%)",
      bgImage: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&h=480&fit=crop&q=80",
      cardImage: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=300&h=200&fit=crop&q=72",
      eyebrow: "India's verified network",
      icon: "verified",
      title: "Every business.",
      titleEm: "Verified.",
      sub: "Manual verification, not algorithms. Every listing reviewed by a human. Every review from a real buyer. The only platform where trust is the product.",
      ctas: [
        { label: "Browse businesses", to: PAGES.BUSINESSES },
        { label: "How it works", to: PAGES.ABOUT, variant: "secondary" },
      ],
      stats: [
        { value: "100%", label: "Manual verified" },
        { value: "28+", label: "Indian cities" },
        { value: "MSME", label: "Govt. registered" },
      ],
    },
    {
      id: "h4",
      theme: "linear-gradient(120deg,#2d0a3e 0%,#5a1a7a 55%,#8b3fad 100%)",
      accent: "#e0b8ff",
      scrim: "linear-gradient(100deg,rgba(24,7,34,.94) 0%,rgba(40,10,56,.80) 44%,rgba(45,10,62,.30) 100%)",
      bgImage: "https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?w=1200&h=480&fit=crop&q=80",
      cardImage: "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=300&h=200&fit=crop&q=72",
      eyebrow: "Made for India",
      icon: "city",
      title: "Designed for",
      titleEm: "India's",
      titleAfter: "design industry.",
      sub: "UPI payments. Hindi interface coming. Regional cities prioritised. Built from New Delhi, for every city where great design happens.",
      ctas: [
        { label: "Explore near me", to: PAGES.PRODUCTS },
        { label: "About IB", to: PAGES.ABOUT, variant: "secondary" },
      ],
      stats: [
        { value: "🇮🇳", label: "India-first" },
        { value: "UPI", label: "Native payments" },
        { value: "हिन्दी", label: "Coming soon" },
      ],
    },
  ],

  sellerBand: {
    eyebrow: "Grow with Interior Bazzar",
    title: "Turn your craft into",
    titleEm: "a steady pipeline.",
    sub: "Get discovered by buyers who are ready to start. We verify intent so you spend time on real projects.",
    ctaLabel: "List your business",
    points: ["Contact-verified leads", "Exclusive routing", "No commission on deals"],
  },
};
