import { ListingPage } from "@/components/shared";
import { PAGES, canonical } from "@/lib/constants";

export default function Products() {
  return (
    <ListingPage
      seo={{
        title: "Products — Interior Bazzar",
        description: "Browse furniture, tiles, lighting, sanitary ware and more from verified sellers.",
        canonicalUrl: canonical(PAGES.PRODUCTS),
      }}
      title="Products"
      subtitle="Furniture, tiles, lighting & more from verified sellers"
      type="product"
      showBanner
    />
  );
}
