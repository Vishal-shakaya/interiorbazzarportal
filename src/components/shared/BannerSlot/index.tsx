import { Button, Icon, type IconName } from "@/components/ui";
import { getCms } from "@/cms/store";
import { useCmsVersion } from "@/hooks/useCmsVersion";
import { useOverlays } from "../overlays/useOverlays";

export interface BannerData {
  eyebrow: string;
  title: string;
  sub: string;
  ctaLabel: string;
  sellerName: string;
  bg: string;
  icon: IconName;
}

const DEMO: BannerData = {
  eyebrow: "Sponsored",
  title: "Premium modular kitchens, installed in 21 days",
  sub: "Verified seller · 4.9★ · serving your city",
  ctaLabel: "Get a quote",
  sellerName: "FormKitchens",
  bg: "linear-gradient(120deg,#0c5a49,#1d9e75)",
  icon: "services",
};

/** First admin-managed (enabled) banner ad, mapped to BannerData; else null. */
function cmsBanner(): BannerData | null {
  const ad = getCms().bannerAds.find((a) => a.enabled !== false);
  if (!ad) return null;
  return {
    eyebrow: ad.eyebrow,
    title: ad.title,
    sub: ad.sub,
    ctaLabel: ad.ctaLabel,
    sellerName: ad.sellerName,
    bg: ad.bg,
    icon: ad.icon as IconName,
  };
}

/**
 * A sponsored banner placement. Uses the explicit `data` prop, else the first
 * admin-managed banner ad from the CMS, else the built-in demo.
 */
export function BannerSlot({ data }: { data?: BannerData }) {
  useCmsVersion();
  const { openConnect } = useOverlays();
  const resolved = data ?? cmsBanner() ?? DEMO;
  return (
    <div
      className="flex flex-col items-start gap-4 overflow-hidden rounded-card p-5 text-white shadow-card md:flex-row md:items-center md:justify-between md:p-6"
      style={{ background: resolved.bg }}
    >
      <div className="flex items-center gap-4">
        <span className="hidden h-14 w-14 shrink-0 place-items-center rounded-card bg-white/15 sm:grid">
          <Icon name={resolved.icon} size={28} />
        </span>
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-white/80">{resolved.eyebrow}</p>
          <p className="mt-0.5 text-[17px] font-semibold leading-snug md:text-[19px]">{resolved.title}</p>
          <p className="mt-0.5 text-[13px] text-white/85">{resolved.sub}</p>
        </div>
      </div>
      <Button
        className="shrink-0 bg-white text-forest hover:bg-white/90"
        onClick={() => openConnect({ intent: "product", sellerName: resolved.sellerName })}
      >
        {resolved.ctaLabel}
      </Button>
    </div>
  );
}
