import { ListingPage } from "@/components/shared";
import { PAGES, canonical } from "@/lib/constants";

export default function Catalogues() {
  return (
    <ListingPage
      seo={{
        title: "Catalogues — Interior Bazzar",
        description: "Browse and download product lookbooks and catalogues from leading brands.",
        canonicalUrl: canonical(PAGES.CATALOGUES),
      }}
      title="Catalogues"
      subtitle="Lookbooks & catalogues from leading brands"
      type="catalogue"
    />
  );
}
