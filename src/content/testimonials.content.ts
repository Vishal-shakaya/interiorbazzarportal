import type { TestimonialItem } from "@/types/marketplace";

export const TESTIMONIALS: TestimonialItem[] = [
  {
    id: "t1",
    type: "video",
    name: "Asha Mehta",
    role: "Homeowner",
    business: "3BHK turnkey · New Delhi",
    city: "New Delhi",
    rating: 5,
    youtubeId: "aqz-KE-bpKQ",
    videoCaption: "How I found a verified kitchen team in two days",
    quote:
      "Found a verified modular kitchen team in two days. The whole process felt calm and considered — exactly what I needed.",
    verified: true,
    bg: "linear-gradient(135deg,#0c5a49,#1d9e75)",
  },
  {
    id: "t2",
    type: "video",
    name: "Rahul Verma",
    role: "Seller",
    business: "Verma Studio · Mumbai",
    city: "Mumbai",
    rating: 5,
    youtubeId: "ScMzIvxBSi4",
    videoCaption: "Less noise, more real projects",
    quote:
      "The enquiries that reach me are genuinely qualified. Less noise, more real projects. It changed how we sell.",
    verified: true,
    bg: "linear-gradient(135deg,#1a3a6e,#3f6fb0)",
  },
  {
    id: "t3",
    type: "video",
    name: "Saket Rao",
    role: "Architect",
    business: "Rao Associates · Bangalore",
    city: "Bangalore",
    rating: 4.8,
    youtubeId: "YE7VzlLtp-4",
    videoCaption: "A portfolio that gets seen by the right clients",
    quote:
      "A portfolio that actually gets seen by the right clients. Clean, fast, and refreshingly free of clutter.",
    bg: "linear-gradient(135deg,#ba7517,#e0a44a)",
  },
];
