import type { AuthUser } from "@/redux/slice/authSlice";

export interface DemoPersona {
  key: string;
  label: string;
  role: string;
  user: Partial<AuthUser>;
}

/** One-tap demo logins (prototype). Each dispatches authSlice.login(user). */
export const DEMO_PERSONAS: DemoPersona[] = [
  {
    key: "buyer",
    label: "Asha Mehta",
    role: "Buyer",
    user: { name: "Asha Mehta", email: "asha@example.com", city: "New Delhi", verified: true },
  },
  {
    key: "seller",
    label: "Verma Studio",
    role: "Seller · Autogrowth Scale",
    user: {
      name: "Rahul Verma",
      email: "rahul@vermastudio.in",
      city: "Mumbai",
      verified: true,
      isSeller: true,
      sellerPlan: "Autogrowth Scale",
      sellerPlanStatus: "active",
    },
  },
  {
    key: "pending",
    label: "Saket Interiors",
    role: "Seller · payment pending",
    user: {
      name: "Saket Rao",
      email: "saket@saketinteriors.in",
      city: "Bangalore",
      isSeller: true,
      sellerPlan: "Verified Business",
      sellerPlanStatus: "pending_payment",
    },
  },
];

export const AUTH_CONTENT = {
  brand: { name: "Interior bazzar", tagline: "find your match" },
  headline: "attract. qualify. convert.",
  description:
    "India's dedicated platform for the interior & sanitary industry. The process your business never had time to build — running for you, every day.",
  featurePills: ["Verified businesses", "Global & local", "WhatsApp delivery", "Within 4 hours"],
  trust: ["Govt of India", "MSME registered", "4.8 rated"],
};
