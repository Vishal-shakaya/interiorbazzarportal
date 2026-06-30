import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Icon, AsyncBoundary } from "@/components/ui";
import { PublicPage } from "@/components/shared";
import { cn } from "@/lib/cn";
import { useAsync } from "@/hooks/useAsync";
import { useCmsVersion } from "@/hooks/useCmsVersion";
import { PlansService } from "@/api";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { login, upgradeToSeller, selectIsLoggedIn } from "@/redux/slice/authSlice";
import { useAlert } from "@/providers";
import { formatPrice } from "@/lib/listing";
import { PAGES, canonical } from "@/lib/constants";
import { type BillingCycle, type Plan } from "@/content/plans.content";
import { BillingToggle, FamilyHero, FamilyTabs, PlanCard } from "./sections";

export default function Plans() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const loggedIn = useAppSelector(selectIsLoggedIn);
  const { success } = useAlert();

  const cmsV = useCmsVersion();
  const { data: families, status, retry } = useAsync(() => PlansService.families(), [cmsV]);
  const { data: faq } = useAsync(() => PlansService.faq(), [cmsV]);

  const [familyKey, setFamilyKey] = useState("");
  const [cycle, setCycle] = useState<BillingCycle>("yr");
  const [checkout, setCheckout] = useState<Plan | null>(null);
  const [done, setDone] = useState(false);

  // Default to the first family until the user picks one.
  const family = families?.find((f) => f.key === familyKey) ?? families?.[0] ?? null;
  const showCycles = family?.cycles ?? false;

  const confirmPayment = () => {
    if (!checkout) return;
    if (!loggedIn) dispatch(login({ name: "New Seller", email: "seller@example.com", verified: true }));
    dispatch(upgradeToSeller({ plan: checkout.name }));
    setDone(true);
    success("Payment submitted. You're live!");
  };

  // ---- confirmation screen ----
  if (done && checkout) {
    return (
      <>
        <PublicPage title="Payment confirmed" canonicalUrl={canonical(PAGES.PLANS)} noindex />
        <div className="mx-auto flex max-w-md flex-col items-center px-5 py-24 text-center">
          <span className="grid h-16 w-16 place-items-center rounded-full bg-sel-bg text-forest">
            <Icon name="check" size={36} />
          </span>
          <h1 className="display-1 mt-4">You're live.</h1>
          <p className="mt-2 text-muted">
            Your <span className="font-semibold text-ink">{checkout.name}</span> plan is active. Qualified enquiries will
            start flowing to your dashboard.
          </p>
          <div className="mt-4 w-full rounded-card border border-line bg-bone-card p-4 text-left text-[14px]">
            <Row label="Plan" value={checkout.name} />
            <Row label="Amount" value={`${formatPrice(checkout.priceMonthly)} / mo`} />
            <Row label="Activated" value="Today" />
          </div>
          <Button className="mt-6" onClick={() => navigate(PAGES.DASHBOARD_SELLER)}>
            Go to dashboard
          </Button>
        </div>
      </>
    );
  }

  // ---- checkout screen ----
  if (checkout) {
    return (
      <>
        <PublicPage title={`Checkout — ${checkout.name}`} canonicalUrl={canonical(PAGES.PLANS)} noindex />
        <div className="mx-auto max-w-md px-5 py-12">
          <button onClick={() => setCheckout(null)} className="mb-4 flex items-center gap-1 text-[13px] text-muted hover:text-forest">
            <Icon name="chevron-left" size={16} /> Back to plans
          </button>
          <h1 className="display-2">Confirm your plan</h1>
          <div className="mt-4 rounded-card border border-line bg-bone-card p-5">
            <p className="font-serif text-[20px] italic text-forest">{checkout.name}</p>
            <p className="text-[13px] text-muted">{checkout.tagline}</p>
            <p className="mt-3 text-[28px] font-semibold text-forest">
              {formatPrice(checkout.priceMonthly)}
              <span className="text-[14px] font-normal text-muted"> / month</span>
            </p>
            <ul className="mt-3 space-y-1.5">
              {checkout.features.map((f) => (
                <li key={f} className="flex items-center gap-1.5 text-[13px] text-ink/85">
                  <Icon name="check" size={15} className="text-accent" /> {f}
                </li>
              ))}
            </ul>
          </div>
          <p className="mt-3 text-[12px] text-muted">Prototype checkout — no real payment is taken.</p>
          <Button block className="mt-4" onClick={confirmPayment}>
            Pay {formatPrice(checkout.priceMonthly)} & go live
          </Button>
        </div>
      </>
    );
  }

  // ---- plans grid ----
  return (
    <>
      <PublicPage
        title="Plans & pricing"
        description="Choose a plan to get verified, get discovered, and receive qualified enquiries."
        canonicalUrl={canonical(PAGES.PLANS)}
      />
      <div className="mx-auto max-w-shell px-4 py-5 md:px-7">
        <AsyncBoundary
          status={status}
          onRetry={retry}
          skeleton={<div className="mx-auto mt-8 h-72 max-w-3xl animate-pulse rounded-card bg-bone-card" />}
        >
        {families && family && (
        <div className="grid gap-6 md:grid-cols-[240px_1fr]">
          <FamilyTabs families={families} activeKey={family.key} onSelect={setFamilyKey} />

          <div className="min-w-0">
            <FamilyHero family={family} />

            {showCycles && (
              <BillingToggle cycle={cycle} onChange={setCycle} saveBadge={family.saveBadge} />
            )}

            <div
              className={cn(
                "mx-auto grid gap-5",
                family.plans.length > 2
                  ? "max-w-6xl lg:grid-cols-3"
                  : family.plans.length > 1
                    ? "max-w-3xl md:grid-cols-2"
                    : "max-w-md",
              )}
            >
              {family.plans.map((p) => (
                <PlanCard
                  key={p.id}
                  plan={p}
                  cycle={cycle}
                  showCycles={showCycles}
                  onChoose={setCheckout}
                />
              ))}
            </div>
          </div>
        </div>
        )}
        </AsyncBoundary>

        {/* FAQ */}
        <section className="mx-auto mt-14 max-w-2xl">
          <h2 className="heading mb-4 text-center text-2xl">Questions, answered</h2>
          <div className="space-y-3">
            {(faq ?? []).map((f) => (
              <details key={f.q} className="group rounded-card border border-line bg-bone-card p-4">
                <summary className="flex cursor-pointer items-center justify-between font-medium text-ink">
                  {f.q}
                  <Icon name="chevron-down" size={18} className="text-muted transition group-open:rotate-180" />
                </summary>
                <p className="mt-2 text-[14px] text-muted">{f.a}</p>
              </details>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between border-b border-line py-1.5 last:border-0">
      <span className="text-muted">{label}</span>
      <span className="font-medium text-ink">{value}</span>
    </div>
  );
}
