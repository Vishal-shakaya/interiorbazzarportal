import { ListingPage } from "@/components/shared";
import { PAGES, canonical } from "@/lib/constants";

export default function Services() {
  return (
    <ListingPage
      seo={{
        title: "Services — Interior Bazzar",
        description: "Find interior designers, modular kitchen installers, 3D visualisers and more.",
        canonicalUrl: canonical(PAGES.SERVICES),
      }}
      title="Services"
      subtitle="Verified professionals for every stage of your project"
      type="service"
      showBanner
    />
  );
}
