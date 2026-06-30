import type { IconName } from "@/components/ui";

export interface HelpFaq {
  category: string;
  q: string;
  a: string;
}

export const HELP_CONTENT = {
  seo: {
    title: "Help & Support",
    description:
      "Search help articles & FAQs, browse help topics, watch tutorials, or talk to a human — most people get an answer in under 12 minutes on Interior Bazzar.",
  },
  hero: {
    eyebrow: "Help centre",
    title: "Search our help articles & FAQs",
    titleEm: "help articles",
    placeholder: "Try: 'how to send enquiry', 'change my password', 'cancel plan'…",
    tags: ["Enquiries", "Account", "Billing", "Verification", "Sellers"],
  },
  ribbon: {
    eyebrow: "we're here to help",
    title: "How can we help you today?",
    titleEm: "help you",
    subtitle:
      "Browse common questions, chat with us, or reach a human — most people get an answer in under 12 minutes.",
  },
  // Contact channels (kept name `contact` + same item shape used by db.ts).
  contact: [
    { icon: "chat", title: "Live chat", text: "Avg response 2 minutes · 24/7", action: "4 agents online" },
    { icon: "whatsapp", title: "WhatsApp us", text: "+91 8920898168", action: "Mon–Sat · 9 AM – 9 PM IST" },
    { icon: "mail", title: "Email us", text: "help@interiorbazzar.com", action: "Replies within 4 hours" },
    { icon: "phone", title: "Call us", text: "+91 8920898168", action: "Mon–Sat · 10 AM – 7 PM IST" },
  ] as { icon: IconName; title: string; text: string; action: string }[],
  // Help-topic category cards.
  topics: [
    { icon: "user", name: "Account & profile", count: "14 articles" },
    { icon: "send", name: "Enquiries & messaging", count: "11 articles" },
    { icon: "billing", name: "Billing & plans", count: "9 articles" },
    { icon: "lock", name: "Trust & safety", count: "8 articles" },
    { icon: "shops", name: "Become a seller", count: "12 articles" },
    { icon: "products", name: "Orders & deliveries", count: "7 articles" },
    { icon: "history", name: "Refunds & returns", count: "6 articles" },
    { icon: "flag", name: "Report a bug", count: "5 articles" },
  ] as { icon: IconName; name: string; count: string }[],
  // Categories used by the FAQ filter chips (kept name + string[] type).
  categories: ["Enquiries", "Buying", "Trust & safety", "Account", "Selling"],
  faqs: [
    {
      category: "Enquiries",
      q: "How do I send an enquiry to a business?",
      a: "Open any business or product profile and tap Send enquiry. Share a quick brief — your contact details, timeline, location, and what you need. Your enquiry goes to that one business only and most reply within 12 minutes.",
    },
    {
      category: "Buying",
      q: "Is it free for me as a buyer?",
      a: "Yes — sending enquiries, browsing profiles, saving items, and chatting with businesses is completely free for buyers. We only charge businesses for premium plans and verified listings.",
    },
    {
      category: "Trust & safety",
      q: "How are businesses verified?",
      a: "Verified businesses (★ badge) have submitted proof of identity, GST/tax ID, business address, and at least 3 completed projects. We also re-verify every 12 months.",
    },
    {
      category: "Account",
      q: "Can I change my mind after sending an enquiry?",
      a: "Of course. You can withdraw an enquiry, ask the business not to contact you, or block any business from your account settings. No penalty either way.",
    },
    {
      category: "Trust & safety",
      q: "What if I have a dispute with a business?",
      a: "Open the ticket from Help & Support, attach screenshots or messages, and our trust & safety team will mediate within 48 hours. We hold seller payouts during open disputes.",
    },
    {
      category: "Selling",
      q: "How do I become a seller on Interior Bazzar?",
      a: "From the profile dropdown, choose Become a member. Pick a plan, register your business, and you'll go live within 48 hours after verification.",
    },
  ] as HelpFaq[],
  status: {
    eyebrow: "all systems normal",
    title: "Platform status",
    titleEm: "status",
    items: [
      "Search & discovery",
      "Enquiries & messaging",
      "Payments & billing",
      "Seller dashboards",
    ],
  },
  tutorials: {
    eyebrow: "watch & learn",
    title: "2-minute video tutorials",
    items: [
      { title: "Sending your first enquiry", duration: "2:14", views: "8,420 views" },
      { title: "Saving & organising profiles", duration: "1:48", views: "5,210 views" },
      { title: "Picking the right architect", duration: "3:02", views: "12,180 views" },
      { title: "Becoming a seller in 5 steps", duration: "2:40", views: "3,420 views" },
    ],
  },
  community: {
    title: "Join the community",
    titleEm: "community",
    text: "12,400+ homeowners & pros sharing what worked, what didn't, and what they'd do differently.",
    primary: "Visit forum",
    secondary: "Browse threads",
  },
  feedback: {
    title: "Share feedback",
    titleEm: "Share",
    text: "Spotted something we should fix? Have an idea? Tell us — we read every message.",
    action: "Send feedback",
  },
};
