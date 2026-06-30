import { PAGES } from "@/lib/constants";

export interface LegalSection {
  h: string;
  p: string;
}
export interface LegalDoc {
  key: string;
  title: string;
  updated: string;
  intro: string;
  sections: LegalSection[];
}

const S = (h: string, p: string): LegalSection => ({ h, p });

/** Keyed by route path so one <Legal> template serves all five. */
export const LEGAL_DOCS: Record<string, LegalDoc> = {
  [PAGES.TERMS]: {
    key: "terms",
    title: "Terms & Conditions",
    updated: "20 June 2026",
    intro:
      "These terms govern your access to and use of Interior Bazzar, a software-as-a-service networking, portfolio and enquiry-routing platform operated by Feelsafe Technology India Private Limited. By creating an account, subscribing to a plan, or otherwise using the Platform, you confirm that you have read, understood and agree to these Terms, together with our Privacy Policy, Refund Policy and Cookies Policy.",
    sections: [
      S(
        "Definitions",
        "In these Terms, capitalised words have specific meanings. A User is any person who accesses the Platform. A Consumer or Buyer uses the Platform to discover businesses and send enquiries. A Business or Seller maintains a profile and may subscribe to receive verified enquiries. An Enquiry is a qualified request from a Consumer. Content is any material made available on or through the Platform.",
      ),
      S(
        "Our role — what the Platform is, and is not",
        "Interior Bazzar is a software-as-a-service platform providing network access, profile and portfolio presence, and an enquiry-routing engine. We act as an intermediary within the meaning of the Information Technology Act, 2000. We are not a party to your dealings — any contract, sale or dispute between a Consumer and a Business is solely between those parties. We charge subscription fees for access, not for contacts. Each qualified enquiry is routed to a single matched Business based only on contact information, genuineness and urgency, never budget.",
      ),
      S(
        "Eligibility and accounts",
        "You must be at least 18 years old and competent to contract under the Indian Contract Act, 1872. If you use the Platform on behalf of an entity, you confirm you are authorised to bind it. You agree to provide accurate, current information and keep it updated. You are responsible for all activity under your account and for keeping your credentials confidential. We may require business, identity or document verification before activating certain features.",
      ),
      S(
        "Subscriptions, plans and billing",
        "Businesses may subscribe to a paid plan, organised into families (Automation, Business, Shop and Architecture) with different capabilities. The price, billing cycle and entitlements are those shown at checkout. Fees are exclusive of applicable taxes including GST. Where a plan renews automatically, it renews at the then-current price unless you cancel before the renewal date. If a payment fails, we may suspend or downgrade access. Cancellations and refunds are governed by our Refund Policy.",
      ),
      S(
        "Acceptable use and your obligations",
        "You agree to use the Platform lawfully and only for its intended purpose. You must not misuse, resell or redistribute verified enquiries or Consumer data; contact a Consumer beyond the subject of their enquiry; circumvent the exclusive routing model; create false or impersonating profiles or fake reviews; upload unlawful or infringing Content; scrape or use bots; or attack, disrupt or reverse-engineer the Platform. We may investigate violations, remove Content, and suspend or terminate accounts that breach this clause.",
      ),
      S(
        "User Content and licence",
        "You retain ownership of the User Content you submit. You grant Interior Bazzar a worldwide, non-exclusive, royalty-free, sub-licensable licence to host, store, adapt, publish and display your User Content to operate, promote and improve the Platform. You confirm you own or have all necessary rights to your Content, including images and catalogues. We may review, refuse, label or remove any Content at our discretion but are not obliged to monitor it. You are solely responsible for your User Content.",
      ),
      S(
        "Intellectual property of the Platform",
        "The Platform, including its software, design, graphics, databases and the marks \"Interior Bazzar\" and our logo, are owned by or licensed to Feelsafe Technology India Private Limited and protected by intellectual-property laws. We grant you a limited, non-exclusive, non-transferable, revocable right to access and use the Platform for its intended purpose. You must not copy, modify, distribute, sell, frame or create derivative works from any part of the Platform, or use our marks, without prior written consent.",
      ),
      S(
        "Third-party services (Google, Meta and others)",
        "The Platform integrates third-party services whose own terms and privacy policies may apply. We use Google services such as analytics, tag management, advertising, sign-in and maps. We use Meta tools such as the Meta Pixel and advertising features. Payments are processed by third-party gateways and we do not store full card details. Messaging features may use services such as WhatsApp. We are not responsible for the availability, accuracy or practices of third-party services.",
      ),
      S(
        "Enquiries, matching and exclusivity",
        "When a Consumer submits an enquiry, it passes through qualification based on contact information, genuineness and urgency, then is routed to one matched Business. We do not guarantee the volume, quality or commercial value of any enquiry, or that any enquiry will result in a transaction. A Business receiving an enquiry must handle the Consumer's information responsibly and use it only to respond. We may decline, withhold, re-route or remove enquiries that appear fraudulent, abusive or non-genuine.",
      ),
      S(
        "Disclaimers and limitation of liability",
        "To the maximum extent permitted by law, the Platform and all Content and services are provided on an \"as is\" and \"as available\" basis, without warranties of any kind. We do not warrant that the Platform will be uninterrupted, secure or error-free, and we make no guarantee regarding enquiries, responses, conversions or business results. Our total aggregate liability for all claims in any twelve-month period will not exceed the subscription fees you paid in that period, or INR 1,000 if you have paid nothing.",
      ),
      S(
        "Suspension and termination",
        "You may stop using the Platform at any time and may cancel a subscription as described in the Refund Policy. We may suspend or terminate your access, with or without notice, if you breach these Terms, if required by law, or to protect the Platform or other Users. On termination, your right to use the Platform ends. Clauses that by their nature should survive — including intellectual property, disclaimers, limitation of liability, indemnity and confidentiality — will survive.",
      ),
      S(
        "Governing law and disputes",
        "These Terms are governed by the laws of India, and the courts at New Delhi have exclusive jurisdiction. Please contact our Grievance Officer before taking any other step. Any dispute not resolved amicably may be referred to arbitration by a sole arbitrator under the Arbitration and Conciliation Act, 1996, seated in New Delhi, in English. Nothing here takes away rights available to a Consumer under the Consumer Protection Act, 2019.",
      ),
      S(
        "Grievance Officer and contact",
        "In accordance with the Information Technology Act, 2000 and the Consumer Protection (E-Commerce) Rules, 2020, you can reach our Grievance Officer for any complaint about Content, your account, or use of the Platform at help@interiorbazzar.com or +91-88823-14255. We will acknowledge a complaint within a reasonable time and within the timelines required by law, and endeavour to resolve it promptly.",
      ),
    ],
  },
  [PAGES.PRIVACY]: {
    key: "privacy",
    title: "Privacy Policy",
    updated: "20 June 2026",
    intro:
      "How Feelsafe Technology India Private Limited collects, uses, shares and protects personal data on Interior Bazzar, and the rights you have, under the Digital Personal Data Protection Act, 2023 and other applicable laws. For the purpose of the DPDP Act, Feelsafe Technology India Private Limited is the Data Fiduciary, and a User whose personal data is processed is a Data Principal.",
    sections: [
      S(
        "Who we are",
        "The Platform is operated by Feelsafe Technology India Private Limited, CIN U62090DL2024PTC434514, based in New Delhi, Delhi, India. For privacy questions or to exercise your rights, the contact details are in the Grievance and contact section below.",
      ),
      S(
        "Personal data we collect",
        "You give us account and profile data (name, email, phone, password, city and business details), enquiry data, content you upload, verification data and communications. We collect automatically usage and device data — pages viewed, approximate location, IP address, device and browser type — and cookies as described in our Cookies Policy. We receive from others sign-in provider information, analytics and advertising data from Google and Meta, and payment status from gateways. We do not knowingly collect a Consumer's budget when qualifying or routing an enquiry.",
      ),
      S(
        "Why we use your data and our legal basis",
        "We process personal data to operate the Platform, relying on your consent and on legitimate uses permitted by law: to create and manage your account; to qualify enquiries and route each to a single matched Business; to enable Businesses to respond; to display profiles, portfolios and reviews; to process payments and renewals; to verify accounts and prevent fraud; to provide support; to send service and, with consent, marketing communications; to measure and improve the Platform; and to comply with law and enforce our Terms.",
      ),
      S(
        "How enquiry data flows",
        "When a Consumer submits an enquiry, it is qualified and then routed to a single matched Business so that the Business can respond. The receiving Business sees the Consumer's contact details and enquiry details. An enquiry is routed to one Business, not broadcast to competitors. The receiving Business must use the information only to respond, keep it confidential, and comply with this policy. We do not sell Consumer personal data, and we do not sell contacts as a commodity.",
      ),
      S(
        "Who we share data with",
        "We share personal data only as needed to run the Platform: with the single matched Business an enquiry is routed to; with service providers such as hosting, storage, analytics, communications and payment partners (including Google, Meta, payment gateways and WhatsApp); with professional advisers and authorities where required by law; and in connection with a business transfer such as a merger or sale of assets. We do not sell your personal data.",
      ),
      S(
        "Google, Meta and advertising",
        "We use analytics tools such as Google Analytics and Google Tag Manager to understand how the Platform is used. We use Google Ads and the Meta Pixel to measure campaigns and reach relevant audiences; these may set cookies and process identifiers, as described in our Cookies Policy. You can manage cookie-based tracking through your browser and the opt-out options described there. Information that Google or Meta processes as independent controllers is governed by their own privacy policies.",
      ),
      S(
        "How long we keep data and how we protect it",
        "We keep personal data only as long as needed for the purposes described, or as required by law, and then delete or anonymise it. If you close your account, we delete or anonymise your personal data within a reasonable period, except where we must retain records for legal, tax, accounting or dispute purposes. We use reasonable technical and organisational measures to protect personal data against unauthorised access, alteration, disclosure or loss, consistent with the Information Technology Act, 2000.",
      ),
      S(
        "Your rights as a Data Principal",
        "Subject to applicable law, you have the right to access a summary of the personal data we process; to correct, complete or update inaccurate data; to erase data no longer needed, subject to legal retention; to withdraw consent at any time where processing is based on consent; to nominate another person to exercise your rights; and to grievance redressal, including escalation to the Data Protection Board of India. To exercise any right, contact us using the details below — we may need to verify your identity first.",
      ),
      S(
        "Children's data, cookies and transfers",
        "The Platform is intended for adults. We do not knowingly collect children's personal data except in accordance with the DPDP Act, including verifiable parental consent where required. We use cookies and similar technologies; for details see our Cookies Policy. Your personal data is processed in India and may be processed by our service providers in other locations; where data is transferred outside India, we do so in accordance with applicable law and with appropriate safeguards in place.",
      ),
      S(
        "Changes, grievance and contact",
        "We may update this Privacy Policy from time to time; the current version is the one published here with the latest effective date. For any privacy question, to exercise your rights, or to make a complaint, contact our Grievance Officer at help@interiorbazzar.com, +91-88823-14255, or wa.me/918920898168. We will acknowledge and respond within a reasonable time and within the timelines required by law.",
      ),
    ],
  },
  [PAGES.REFUND]: {
    key: "refund",
    title: "Return & Refund Policy",
    updated: "20 June 2026",
    intro:
      "How subscription cancellation and refunds work on Interior Bazzar. This policy explains what you are paying for, when refunds apply, and how deals between Consumers and Businesses are handled. It forms part of, and should be read with, our Terms & Conditions.",
    sections: [
      S(
        "What you are paying for",
        "Interior Bazzar charges subscription fees for access to the Platform and its features — network access, profile and portfolio presence, and the enquiry-routing engine. We do not sell contacts as a commodity and we do not take a cut of any project, order or sale. A subscription gives access to features and entitlements; it is not a guarantee of any number of enquiries, responses, conversions or commercial outcomes.",
      ),
      S(
        "Cancellation",
        "You can cancel renewal of a paid plan at any time from your dashboard or by contacting us. When you cancel, your plan does not renew at the end of the current billing cycle, and you keep access to your plan's features until the end of the period you have already paid for. Cancelling stops future charges; it does not by itself trigger a refund of the current period unless this policy provides otherwise.",
      ),
      S(
        "Refund eligibility",
        "Because plans provide immediate access to the Platform, fees are generally non-refundable once a billing period has started. We will, however, review refund requests in good faith where a payment was charged in error, where a duplicate charge occurred, or where a clear technical fault on our side prevented you from accessing the core features of your plan. Founding-member and promotional rates are non-refundable beyond these limited circumstances.",
      ),
      S(
        "How to request a refund",
        "To request a refund, contact us at help@interiorbazzar.com within 7 days of the charge, with your account details, the transaction reference and the reason for your request. We will acknowledge your request, review it, and respond within a reasonable time. Where a refund is approved, it is made to the original payment method, and the time to appear in your account depends on your bank or payment provider.",
      ),
      S(
        "Buyer and Business transactions",
        "Any contract, quotation, sale, service, project or payment between a Consumer and a Business is solely between those parties. Interior Bazzar is not the buyer, seller, agent or guarantor of any such dealing. Refunds, returns, cancellations or disputes relating to a product, service or project are handled directly between the Consumer and the Business, and are not covered by this policy, which applies only to subscription fees paid to Interior Bazzar.",
      ),
      S(
        "Taxes and non-payment",
        "Subscription fees are exclusive of applicable taxes, including GST, unless stated otherwise, and any refund is calculated on the amount actually paid to us. If a payment fails or is overdue, we may suspend or downgrade your access until the amount is settled; reinstatement of access does not extend the original billing period.",
      ),
      S(
        "Contact",
        "For any question about cancellation or refunds, contact us at help@interiorbazzar.com or +91-88823-14255. We will acknowledge a request within a reasonable time and within the timelines required by law, and endeavour to resolve it promptly.",
      ),
    ],
  },
  [PAGES.DISCLAIMER]: {
    key: "disclaimer",
    title: "Disclaimer",
    updated: "20 June 2026",
    intro:
      "Our role, and the limits of what we warrant. Please read this disclaimer carefully before using Interior Bazzar. It explains what the Platform is, what it is not, and the basis on which Content and services are provided. It should be read with our Terms & Conditions.",
    sections: [
      S(
        "Our role as an intermediary",
        "Interior Bazzar is a software-as-a-service platform that connects Consumers and Businesses through network access, profile and portfolio presence, and an enquiry-routing engine. We act as an intermediary within the meaning of the Information Technology Act, 2000. We are not a party to any contract, sale, service or dispute between a Consumer and a Business; those dealings are solely between the parties involved.",
      ),
      S(
        "Information accuracy",
        "Listing content, profiles, portfolios, catalogues and reviews are provided by Businesses and Users. We verify where we reasonably can, but we cannot guarantee that every detail is accurate, current or complete. Verification badges and similar indicators reflect checks carried out at a point in time and are provided as a convenience; they are not a warranty by us of a Business's quality, conduct or outcomes.",
      ),
      S(
        "No professional advice",
        "Content on the Platform is for general information only and is not professional, legal, financial, design or engineering advice. You should make your own enquiries and, where appropriate, seek independent professional advice before acting on any Content or before entering into any contract with a Business.",
      ),
      S(
        "No warranty and no guaranteed outcomes",
        "To the maximum extent permitted by law, the Platform and all Content and services are provided on an \"as is\" and \"as available\" basis, without warranties of any kind, express or implied. We do not warrant that the Platform will be uninterrupted, timely, secure or error-free. We make no guarantee regarding the number of enquiries, responses, conversions, revenue, ranking or business results that any Business may obtain.",
      ),
      S(
        "Third parties",
        "We are not responsible for the products, services, content, conduct or practices of third-party Businesses, advertisers or service providers, including Google, Meta, payment gateways and messaging services. Any reliance you place on a Business or third party is at your own risk, and your use of third-party features may be subject to their own terms and policies.",
      ),
      S(
        "Limitation of liability and contact",
        "Nothing in this disclaimer excludes liability that cannot be excluded under applicable law. Subject to that, Interior Bazzar is not liable for any loss arising from your use of, or reliance on, the Platform or its Content, as further described in our Terms & Conditions. For any question about this disclaimer, contact us at help@interiorbazzar.com or +91-88823-14255.",
      ),
    ],
  },
  [PAGES.COOKIES]: {
    key: "cookies",
    title: "Cookies Policy",
    updated: "20 June 2026",
    intro:
      "Cookies and similar technologies we use on Interior Bazzar, why we use them, and how you can control them. This policy is part of, and should be read with, our Privacy Policy. By using the Platform you agree to our use of cookies as described here, except where your consent is required and not given.",
    sections: [
      S(
        "What cookies are",
        "Cookies are small text files placed on your device when you visit a website. Similar technologies include pixels, tags, local storage and software development kits. They allow a site to recognise your device, keep you signed in, remember your preferences, and understand how the Platform is used so we can improve it.",
      ),
      S(
        "Types of cookies we use",
        "We use essential cookies that are necessary for core functionality such as signing in, security and remembering your session — these cannot be switched off. We use preference cookies that remember choices such as language or location. We use analytics cookies, including Google Analytics and Google Tag Manager, to understand usage. And we use advertising and measurement cookies, including Google Ads and the Meta Pixel, to measure campaigns and reach relevant audiences.",
      ),
      S(
        "Third-party cookies",
        "Some cookies are set by third parties whose services we use, including Google and Meta. These third parties may process identifiers and set their own cookies as independent controllers, governed by their own privacy and cookie policies. We use these tools for analytics, tag management, advertising and measurement, as described in our Privacy Policy.",
      ),
      S(
        "Managing cookies",
        "You can control and delete cookies through your browser settings at any time, including blocking or removing them. If you block essential cookies, parts of the Platform may not work properly. You can also manage advertising and analytics tracking through the opt-out tools provided by Google and Meta and through any cookie controls we make available on the Platform.",
      ),
      S(
        "Changes and contact",
        "We may update this Cookies Policy from time to time to reflect changes in the technologies we use or in the law; the current version is the one published here with the latest effective date. For any question about our use of cookies, contact us at help@interiorbazzar.com or +91-88823-14255.",
      ),
    ],
  },
};
