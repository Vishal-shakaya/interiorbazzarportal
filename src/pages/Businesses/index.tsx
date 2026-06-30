import { ListingPage } from "@/components/shared";
import { PAGES, canonical } from "@/lib/constants";

export default function Businesses() {
  return (
    <ListingPage
      seo={{
        title: "Businesses — Interior Bazzar",
        description: "Discover verified interior businesses, brands and sellers across India.",
        canonicalUrl: canonical(PAGES.BUSINESSES),
      }}
      title="Businesses"
      subtitle="Verified brands & sellers across India"
      type="business"
      showBanner
    />
  );
}
