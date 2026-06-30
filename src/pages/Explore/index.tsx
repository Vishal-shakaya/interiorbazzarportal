import { PublicPage } from "@/components/shared";
import { PAGES, canonical } from "@/lib/constants";
import {
  StyleBar,
  ExploreHero,
  RoomTiles,
  FeaturedProject,
  RealHomesGrid,
  CuratedCollections,
} from "./sections";

export default function Explore() {
  return (
    <>
      <PublicPage
        title="Explore — Interior Bazzar"
        description="Find inspiration for your space — real homes, design ideas, materials and the people who can make it happen."
        canonicalUrl={canonical(PAGES.EXPLORE)}
      />
      <div className="mx-auto max-w-shell px-4 py-5 md:px-7">
        <StyleBar />
        <ExploreHero />
        <RoomTiles />
        <FeaturedProject />
        <RealHomesGrid />
        <CuratedCollections />
      </div>
    </>
  );
}
