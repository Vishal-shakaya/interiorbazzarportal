import { ListingPage } from "@/components/shared";
import { PAGES, canonical } from "@/lib/constants";

export default function Architects() {
  return (
    <ListingPage
      seo={{
        title: "Architects — Interior Bazzar",
        description: "Connect with verified architects and designers for residential and commercial projects.",
        canonicalUrl: canonical(PAGES.ARCHITECTS),
      }}
      title="Architects"
      subtitle="Verified architects & designers for every brief"
      type="architect"
    />
  );
}
