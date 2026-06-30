import type { IconName } from "@/components/ui";

export const ABOUT_CONTENT = {
  seo: {
    title: "About Interior Bazzar — Find your match",
    description:
      "Interior Bazzar connects interior designers, architects, showrooms and retailers with people actively looking for them — through qualified enquiries, not noise.",
  },
  hero: {
    eyebrow: "India's interior design marketplace",
    title: "Where design businesses",
    titleEm: "find their next client.",
    lead: "Interior bazzar connects interior designers, architects, showrooms and retailers with people actively looking for them — through qualified enquiries, not noise.",
    trust: [
      { icon: "verified" as IconName, text: "Govt. of India · MSME registered" },
      { icon: "business" as IconName, text: "Feelsafe Technology India Pvt Ltd" },
      { icon: "city" as IconName, text: "Based in New Delhi" },
    ],
    graphicBig: "Interior bazzar",
    graphicSmall: "FIND YOUR MATCH",
  },
  stats: [
    { value: "500+", label: "Verified businesses" },
    { value: "12K+", label: "Qualified enquiries" },
    { value: "28+", label: "Cities covered" },
    { value: "4.8★", label: "Average listing rating" },
  ],
  problem: {
    eyebrow: "The problem we solve",
    title: "The interior industry had a",
    titleEm: "discovery problem.",
    lead: "India's interior and design sector is massive — but painfully fragmented. Great designers struggle to be found. Homeowners waste weeks on dead-end searches. We built Interior bazzar to change that.",
    before: {
      emoji: "😩",
      title: "Before Interior bazzar",
      body: "Homeowners scroll through Instagram, ask neighbours, or use platforms designed for something else. Interior professionals rely on referrals and hope. Enquiries are unqualified, generic, and usually ghosted.",
    },
    after: {
      emoji: "✅",
      title: "With Interior bazzar",
      body: "Buyers find verified professionals with real portfolios and reviews. Sellers receive genuinely qualified enquiries — people who know what they want, where they are, and what they can spend. Both sides get clarity.",
    },
  },
  how: {
    eyebrow: "How it works",
    title: "Simple for buyers.",
    titleEm: "Powerful",
    titleAfter: "for sellers.",
    columns: [
      {
        label: "For homeowners & buyers",
        steps: [
          {
            title: "Search by category + location",
            text: "Find interior designers, architects, showrooms or retailers near you — filtered by city, style, and specialty.",
          },
          {
            title: "Browse verified profiles",
            text: "Every listing is manually reviewed. See real portfolios, authentic reviews, and project ranges before reaching out.",
          },
          {
            title: "Connect with confidence",
            text: "Send an enquiry directly. We verify contact genuineness and route it to the right professional. No spam, no cold calls.",
          },
        ],
      },
      {
        label: "For interior professionals & businesses",
        steps: [
          {
            title: "List your business",
            text: "Create a verified profile, showcase your portfolio, define your specialties and service areas. Takes one afternoon.",
          },
          {
            title: "Receive qualified enquiries",
            text: "Our 3-step qualification filters by contact, genuineness and urgency — so you only talk to real, motivated buyers.",
          },
          {
            title: "Grow on your terms",
            text: "Upgrade to a plan that matches your ambition — from a single-city Signature listing to a national Elite profile.",
          },
        ],
      },
    ],
  },
  values: {
    eyebrow: "Our principles",
    title: "Built on things we actually",
    titleEm: "believe in.",
    items: [
      {
        icon: "verified" as IconName,
        title: "Manual verification, always",
        text: "Every business is reviewed by a human before going live. We'd rather grow slowly than grow with noise.",
      },
      {
        icon: "explore" as IconName,
        title: "Qualified, not volume",
        text: "We don't sell leads. We qualify enquiries — contact, genuineness, urgency — before they reach a seller. The seller's time is worth protecting.",
      },
      {
        icon: "rosette" as IconName,
        title: "No ads. No broker fees.",
        text: "Interior bazzar is a direct-connect platform. No middlemen, no commissions on conversions. What you earn, you keep.",
      },
      {
        icon: "star" as IconName,
        title: "Honest reviews",
        text: "Reviews are from verified buyers only. We do not allow paid placements or review manipulation. Trust is the product.",
      },
      {
        icon: "phone" as IconName,
        title: "India-first design",
        text: "Built for Indian cities, Indian workflows, Indian payment patterns. UPI. Hindi coming. Regional cities prioritised. Not a Western product retrofitted.",
      },
      {
        icon: "rocket" as IconName,
        title: "Builder mindset",
        text: "We ship fast, listen harder, and iterate based on what professionals and homeowners actually tell us — not assumptions.",
      },
    ],
  },
  team: {
    eyebrow: "The team",
    title: "Small team.",
    titleEm: "Big",
    titleAfter: "conviction.",
    lead: "Interior bazzar is built by Feelsafe Technology India Pvt Ltd — a small team of builders who believe India's interior industry deserves better infrastructure.",
    members: [
      {
        initials: "VS",
        gradient: "linear-gradient(135deg,#085041,#1d9e75)",
        name: "Vishal Shakya",
        role: "Founder · CEO",
        bio: "Builder. Has spent most of his career deep in technology — not to build for the sake of it, but to solve problems that matter.",
      },
      {
        initials: "IB",
        gradient: "linear-gradient(135deg,#3c3489,#6b63c9)",
        name: "Interior bazzar Team",
        role: "Design · Engineering · Ops",
        bio: "A growing team across product, design, and operations. We're hiring people who care about India's built environment.",
      },
      {
        initials: "",
        gradient: "",
        name: "We're hiring",
        role: "Join us",
        bio: "We're looking for people who want to build something real for India's interior industry. Say hi.",
        hiring: true,
      },
    ],
  },
  cta: {
    title: "Ready to find your match?",
    sub: "Whether you're looking for a designer, or you are one — Interior bazzar was built for you.",
    primary: { icon: "search" as IconName, label: "Find designers near me" },
    ghost: { icon: "rosette" as IconName, label: "List my business" },
    contactEmail: "help@interiorbazzar.com",
    contactPhone: "+91 8920898168",
    socialLabel: "Follow Interior bazzar",
    socials: [
      { icon: "share" as IconName, label: "Instagram", href: "https://instagram.com/interiorbazzar" },
      { icon: "share" as IconName, label: "Facebook", href: "https://facebook.com/interiorbazzar" },
      { icon: "share" as IconName, label: "X (Twitter)", href: "https://x.com/interiorbazzar" },
      { icon: "share" as IconName, label: "LinkedIn", href: "https://linkedin.com/company/interiorbazzar" },
      { icon: "play" as IconName, label: "YouTube", href: "https://youtube.com/@interiorbazzar" },
      { icon: "whatsapp" as IconName, label: "WhatsApp", href: "https://wa.me/918920898168" },
    ],
  },
};
