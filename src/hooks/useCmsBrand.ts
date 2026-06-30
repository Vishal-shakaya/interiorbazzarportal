import { getCms } from "@/cms/store";
import { NAV_CONTENT } from "@/content/nav.content";
import { useCmsVersion } from "./useCmsVersion";

const DEFAULT_LOGO = "/brand/IB_Icon.png";

export interface ResolvedBrand {
  name: string;
  tagline: string;
  logo: string;
}

/**
 * The site brand, with admin CMS overrides layered over the seed nav content.
 * Empty CMS fields fall back to the defaults. Re-renders on CMS change.
 */
export function useCmsBrand(): ResolvedBrand {
  useCmsVersion();
  const b = getCms().brand;
  return {
    name: b.name || NAV_CONTENT.brand.name,
    tagline: b.tagline || NAV_CONTENT.brand.tagline,
    logo: b.logo || DEFAULT_LOGO,
  };
}
