import type { ReactNode } from "react";
import { Button, Input, Icon } from "@/components/ui";
import { PublicPage } from "@/components/shared";
import { cn } from "@/lib/cn";
import { canonical, PAGES } from "@/lib/constants";
import { AUTH_CONTENT, DEMO_PERSONAS } from "@/content/auth.content";
import { useAuth } from "./useAuth";

/** Eyebrow label shown above each step's title (matches prototype). */
function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <p className="mb-2.5 flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.1em] text-forest">
      <span className="h-px w-5 bg-forest" />
      {children}
    </p>
  );
}

export default function Auth() {
  const c = AUTH_CONTENT;
  const a = useAuth();

  return (
    <>
      <PublicPage title="Sign in" description={c.description} canonicalUrl={canonical(PAGES.AUTH)} noindex />

      <div className="grid min-h-screen lg:grid-cols-2">
        {/* ── brand / marketing panel ── */}
        <aside
          className="relative hidden flex-col justify-between overflow-hidden p-11 text-white lg:flex"
          style={{ background: "linear-gradient(160deg,#04342c 0%,#085041 55%,#1d9e75 100%)" }}
        >
          <div className="relative z-10">
            <div className="mb-16 flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-[10px] bg-white/15 font-editorial text-[20px] backdrop-blur">
                ib
              </div>
              <div>
                <p className="font-editorial text-[20px] italic">{c.brand.name}</p>
                <p className="text-[12px] uppercase tracking-[0.1em] text-white/50">{c.brand.tagline}</p>
              </div>
            </div>
            <h1 className="mb-4 font-editorial text-[46px] font-normal leading-[1.08]">
              attract.
              <br />
              qualify.
              <br />
              <em className="not-italic text-green-mint">convert.</em>
            </h1>
            <p className="mb-10 max-w-[380px] text-[17px] leading-relaxed text-white/70">{c.description}</p>
            <div className="flex flex-wrap gap-2">
              {c.featurePills.map((p) => (
                <span
                  key={p}
                  className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3.5 py-1.5 text-[13px] backdrop-blur"
                >
                  {p}
                </span>
              ))}
            </div>
          </div>
          <div className="relative z-10">
            <div className="flex flex-wrap gap-4">
              {c.trust.map((t) => (
                <span
                  key={t}
                  className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[11px] text-white/60"
                >
                  <Icon name="rosette" size={12} className="text-green-mint" /> {t}
                </span>
              ))}
            </div>
            <p className="mt-3.5 text-[11px] text-white/30">
              © 2026 Feelsafe Technology India Pvt Ltd · CIN: U62090DL2024PTC434514
            </p>
          </div>
        </aside>

        {/* ── form panel ── */}
        <main className="relative flex items-center justify-center bg-bone-card px-6 py-16 lg:px-10">
          {/* back button — shown on sub-screens */}
          {a.step !== "method" && (
            <button
              onClick={() => a.setStep("method")}
              title="Go back"
              className="absolute left-7 top-7 grid h-10 w-10 place-items-center rounded-full border border-line bg-bone text-ink shadow-card transition hover:border-forest hover:bg-green-light hover:text-forest"
            >
              <Icon name="chevron-left" size={18} />
            </button>
          )}

          <div className="w-full max-w-[440px]">
            {/* ════════ STEP: choose method ════════ */}
            {a.step === "method" && (
              <div className="space-y-6">
                {/* demo persona quick-login */}
                <div className="space-y-3">
                  <p className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.08em] text-muted">
                    <Icon name="sparkles" size={14} className="text-amber" /> Demo quick-login — choose a persona
                  </p>
                  <div className="space-y-2">
                    {DEMO_PERSONAS.map((p) => {
                      const pending = p.user.sellerPlanStatus === "pending_payment";
                      return (
                        <button
                          key={p.key}
                          onClick={() => a.loginAsPersona(p.key)}
                          disabled={a.busy}
                          className={cn(
                            "group flex w-full items-center gap-3.5 rounded-[13px] border-[1.5px] bg-bone px-3.5 py-3 text-left transition hover:border-forest hover:bg-bone-card hover:shadow-card disabled:opacity-60",
                            pending ? "border-dashed border-line-strong" : "border-line",
                          )}
                        >
                          <span className="grid h-9 w-9 flex-none place-items-center rounded-[10px] bg-green-light text-[14px] font-bold text-forest">
                            {p.label
                              .split(" ")
                              .map((w) => w[0])
                              .join("")
                              .slice(0, 2)
                              .toUpperCase()}
                          </span>
                          <span className="flex-1">
                            <span className="block text-[13.5px] font-bold text-ink">{p.label}</span>
                            <span className="flex items-center gap-1 text-[12px] text-muted">
                              {pending && <Icon name="clock" size={12} />}
                              {p.role}
                            </span>
                          </span>
                          <Icon
                            name="arrow-right"
                            size={16}
                            className="text-muted transition group-hover:translate-x-0.5 group-hover:text-forest"
                          />
                        </button>
                      );
                    })}
                  </div>
                  <div className="relative pt-1 text-center text-[12px] text-muted">
                    <span className="absolute left-0 top-1/2 h-px w-full bg-line" />
                    <span className="relative bg-bone-card px-3">or sign in with your account</span>
                  </div>
                </div>

                {/* email entry */}
                <div>
                  <Eyebrow>Welcome</Eyebrow>
                  <h2 className="font-editorial text-[34px] leading-[1.1] text-ink">
                    Sign in or
                    <br />
                    create account
                  </h2>
                  <p className="mt-2.5 text-[15px] leading-relaxed text-muted">
                    Enter your email — we'll check if you have an account or create one for you.
                  </p>
                </div>

                <form
                  className="space-y-3"
                  onSubmit={(e) => {
                    e.preventDefault();
                    a.submitEmail();
                  }}
                >
                  <Input
                    label="Email address"
                    type="email"
                    placeholder="you@example.com"
                    value={a.email}
                    onChange={(e) => a.setEmail(e.target.value)}
                    required
                  />
                  <Button type="submit" block loading={a.busy}>
                    Continue <Icon name="arrow-right" size={18} />
                  </Button>
                </form>

                <p className="text-center text-[12px] leading-relaxed text-muted">
                  By continuing you agree to our <span className="text-forest">Terms of Service</span> and{" "}
                  <span className="text-forest">Privacy Policy</span>. Interior bazzar serves India and international
                  markets — your data is handled per applicable law.
                </p>
              </div>
            )}

            {/* ════════ STEP: email OTP ════════ */}
            {a.step === "otp" && (
              <div className="space-y-6">
                <div>
                  <Eyebrow>Verification</Eyebrow>
                  <h2 className="font-editorial text-[34px] leading-[1.1] text-ink">
                    Check your
                    <br />
                    email
                  </h2>
                  <p className="mt-2.5 text-[15px] leading-relaxed text-muted">
                    We sent a 6-digit code to <span className="font-semibold text-ink">{a.email}</span>. Enter it below.
                  </p>
                </div>
                <form
                  className="space-y-3"
                  onSubmit={(e) => {
                    e.preventDefault();
                    a.submitOtp();
                  }}
                >
                  <Input
                    label="One-time code"
                    inputMode="numeric"
                    placeholder="••••••"
                    value={a.otp}
                    onChange={(e) => a.setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                    required
                  />
                  <p className="text-[12px] text-muted">Didn't receive it? Check spam. Demo: type any 6 digits.</p>
                  <Button type="submit" block loading={a.busy} disabled={a.otp.length !== 6}>
                    Verify &amp; continue <Icon name="arrow-right" size={18} />
                  </Button>
                </form>
              </div>
            )}

            {/* ════════ STEP: signup (name + account type) ════════ */}
            {a.step === "signup" && (
              <div className="space-y-6">
                {/* progress dots */}
                <div className="flex gap-1.5">
                  <span className="h-1.5 w-5 rounded-full bg-forest" />
                  <span className="h-1.5 w-1.5 rounded-full bg-line" />
                  <span className="h-1.5 w-1.5 rounded-full bg-line" />
                </div>
                <div>
                  <Eyebrow>Create account</Eyebrow>
                  <h2 className="font-editorial text-[34px] leading-[1.1] text-ink">
                    You're new here.
                    <br />
                    Let's set you up.
                  </h2>
                  <p className="mt-2.5 text-[15px] leading-relaxed text-muted">
                    Tell us who you are — so we show the right experience.
                  </p>
                </div>
                <form
                  className="space-y-5"
                  onSubmit={(e) => {
                    e.preventDefault();
                    a.submitSignup();
                  }}
                >
                  <Input
                    label="Full name"
                    placeholder="Your name"
                    value={a.name}
                    onChange={(e) => a.setName(e.target.value)}
                    required
                  />
                  <div>
                    <p className="mb-2 text-[13px] font-semibold text-forest">What best describes you?</p>
                    <div className="grid grid-cols-2 gap-2.5">
                      {(
                        [
                          { type: "buyer", icon: "home", name: "Homeowner", desc: "Looking for services, products or businesses" },
                          { type: "seller", icon: "architecture", name: "Designer / Seller", desc: "Offering interior services or selling products" },
                        ] as const
                      ).map((t) => {
                        const selected = a.accountType === t.type;
                        return (
                          <button
                            type="button"
                            key={t.type}
                            onClick={() => a.setAccountType(t.type)}
                            className={cn(
                              "rounded-[12px] border-[1.5px] p-4 text-left transition",
                              selected ? "border-forest bg-green-light" : "border-line hover:border-forest hover:bg-green-light",
                            )}
                          >
                            <span
                              className={cn(
                                "mb-2.5 grid h-9 w-9 place-items-center rounded-[9px] transition",
                                selected ? "bg-forest text-white" : "bg-bone text-forest",
                              )}
                            >
                              <Icon name={t.icon} size={19} />
                            </span>
                            <span className="block text-[14px] font-bold text-ink">{t.name}</span>
                            <span className="block text-[12px] leading-snug text-muted">{t.desc}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                  <Button type="submit" block loading={a.busy} disabled={!a.name.trim()}>
                    Complete registration <Icon name="arrow-right" size={18} />
                  </Button>
                  <p className="text-center text-[12px] leading-relaxed text-muted">
                    By registering, you agree to our <span className="text-forest">Terms of Service</span>,{" "}
                    <span className="text-forest">Privacy Policy</span>, and{" "}
                    <span className="text-forest">Refund Policy</span>.
                  </p>
                </form>
              </div>
            )}
          </div>
        </main>
      </div>
    </>
  );
}
