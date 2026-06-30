import { useState } from "react";
import { Button, Input, Select, Icon, type IconName } from "@/components/ui";
import { PublicPage, Breadcrumb } from "@/components/shared";
import { PAGES, canonical } from "@/lib/constants";

type Method = {
  icon: IconName;
  iconClass: string;
  title: string;
  value: string;
  meta: string;
};

const METHODS: Method[] = [
  {
    icon: "chat",
    iconClass: "bg-green-light text-forest",
    title: "Live chat",
    value: "Avg response 2 minutes",
    meta: "Available 24/7 · 4 agents online",
  },
  {
    icon: "whatsapp",
    iconClass: "bg-green-light text-forest",
    title: "WhatsApp us",
    value: "+91 89208 98168",
    meta: "Mon–Sat · 9 AM – 9 PM IST",
  },
  {
    icon: "mail",
    iconClass: "bg-amber-light text-amber",
    title: "Email us",
    value: "help@interiorbazzar.com",
    meta: "Replies within 4 hours",
  },
  {
    icon: "phone",
    iconClass: "bg-sel-bg text-forest",
    title: "Call us",
    value: "+91 89208 98168",
    meta: "Mon–Sat · 10 AM – 7 PM IST",
  },
];

export default function Contact() {
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", topic: "", message: "" });
  const set = (k: keyof typeof form) => (e: { target: { value: string } }) => setForm((f) => ({ ...f, [k]: e.target.value }));

  return (
    <>
      <PublicPage title="Contact us" description="Get in touch with the Interior Bazzar team." canonicalUrl={canonical(PAGES.CONTACT)} />

      <div className="mx-auto max-w-5xl px-4 py-5 md:px-7">
        <Breadcrumb items={[{ label: "Home", to: PAGES.HOME }, { label: "Contact" }]} />

        <header className="mt-5 max-w-2xl">
          <span className="sec-eye">get in touch</span>
          <h1 className="font-editorial text-[32px] font-normal leading-tight text-ink md:text-[38px]">
            Talk to <span className="italic text-forest">a human</span>
          </h1>
          <p className="mt-3 text-[15px] leading-relaxed text-muted">
            Questions, feedback or partnerships — reach us on any channel below, or drop a note and we'll
            get back within one business day.
          </p>
        </header>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_1.1fr] lg:items-start">
          {/* CONTACT METHODS */}
          <div className="space-y-6">
            <div className="grid gap-3 sm:grid-cols-2">
              {METHODS.map((m) => (
                <div
                  key={m.title}
                  className="rounded-card border border-line bg-bone-card p-5 shadow-card transition hover:border-forest"
                >
                  <span className={`mb-3 grid h-10 w-10 place-items-center rounded-field text-[19px] ${m.iconClass}`}>
                    <Icon name={m.icon} size={20} />
                  </span>
                  <p className="font-editorial text-[18px] text-ink">{m.title}</p>
                  <p className="mt-0.5 text-[13px] font-semibold text-ink">{m.value}</p>
                  <p className="mt-1 text-[12.5px] text-muted">{m.meta}</p>
                </div>
              ))}
            </div>

            {/* OFFICE ADDRESS */}
            <div className="rounded-card border border-line bg-bone-card p-5 shadow-card">
              <div className="mb-3 flex items-center gap-2">
                <span className="grid h-10 w-10 place-items-center rounded-field bg-green-light text-forest">
                  <Icon name="business" size={20} />
                </span>
                <p className="font-editorial text-[18px] text-ink">Visit our office</p>
              </div>
              <p className="text-[14px] leading-relaxed text-muted">
                Interior Bazzar HQ
                <br />
                3rd Floor, Connaught Place
                <br />
                New Delhi, 110001, India
              </p>
              <div className="mt-3 flex items-center gap-2 border-t border-line pt-3 text-[13px] text-muted">
                <Icon name="clock" size={15} className="text-forest" />
                <span>Mon–Fri · 10 AM – 6 PM IST</span>
              </div>
            </div>
          </div>

          {/* CONTACT FORM */}
          <div className="rounded-card border border-line bg-bone-card p-6 shadow-card md:p-7">
            {sent ? (
              <div className="flex flex-col items-center gap-3 py-10 text-center">
                <span className="grid h-16 w-16 place-items-center rounded-full bg-green-light text-forest">
                  <Icon name="check" size={34} />
                </span>
                <h2 className="font-editorial text-[24px] text-ink">Message sent.</h2>
                <p className="max-w-xs text-[14px] leading-relaxed text-muted">
                  Thanks for reaching out — we'll get back to you within one business day.
                </p>
              </div>
            ) : (
              <>
                <h2 className="font-editorial text-[22px] text-ink">Send us a message</h2>
                <p className="mt-1 text-[13.5px] text-muted">We typically reply within one business day.</p>

                <form
                  className="mt-5"
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (form.name && form.email && form.message) setSent(true);
                  }}
                >
                  <Input label="Your name" placeholder="Full name" value={form.name} onChange={set("name")} required />
                  <Input
                    label="Email"
                    type="email"
                    placeholder="you@email.com"
                    value={form.email}
                    onChange={set("email")}
                    required
                  />
                  <Select label="Subject" value={form.topic} onChange={set("topic")}>
                    <option value="">Select a topic</option>
                    <option>General enquiry</option>
                    <option>Seller support</option>
                    <option>Partnerships</option>
                    <option>Press</option>
                  </Select>
                  <div className="mb-3.5 last:mb-0">
                    <label htmlFor="contact-message" className="mb-1.5 block text-[13px] font-semibold text-forest">
                      Message
                    </label>
                    <textarea
                      id="contact-message"
                      value={form.message}
                      onChange={set("message")}
                      rows={5}
                      required
                      placeholder="How can we help?"
                      className="w-full rounded-field border-[1.5px] border-line bg-bone px-3.5 py-3 font-sans text-base text-ink outline-none transition-colors duration-150 placeholder:text-muted/70 focus:border-forest focus:bg-white"
                    />
                  </div>
                  <Button type="submit" size="md" block className="mt-1">
                    <Icon name="send" size={17} />
                    Send message
                  </Button>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
