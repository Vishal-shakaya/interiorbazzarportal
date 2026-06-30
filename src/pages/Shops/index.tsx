import { ListingPage } from "@/components/shared";
import { PAGES, canonical } from "@/lib/constants";

export default function Shops() {
  return (
    <ListingPage
      seo={{
        title: "Shops — Interior Bazzar",
        description: "Find showrooms and experience centres near you to see products in person.",
        canonicalUrl: canonical(PAGES.SHOPS),
      }}
      title="Shops"
      subtitle="Showrooms & experience centres worth a visit"
      type="shop"
      showBanner
    />
  );
}
