import { PublicPage, ShortsRow } from "@/components/shared";
import { SHORTS } from "@/content/shorts.content";
import { PAGES, canonical } from "@/lib/constants";
import {
  CategoryPillBar,
  TrendingHeader,
  LiveTicker,
  KpiStrip,
  TopHero,
  Leaderboard,
  CategoryMiniBoards,
  SearchAndSaved,
  HotByCity,
  RisingFast,
  BehindTheTrend,
  WeeklyDigest,
} from "./sections";

export default function Trending() {
  return (
    <>
      <PublicPage
        title="Trending now — Interior Bazzar"
        description="The most-viewed businesses, products and services on Interior Bazzar this week — ranked by enquiries, saves, and watch-time."
        canonicalUrl={canonical(PAGES.TRENDING)}
      />
      <div className="mx-auto max-w-shell px-4 py-5 md:px-7">
        {/* 1 — time range + category pills */}
        <CategoryPillBar />

        {/* 2 — page header */}
        <TrendingHeader />

        {/* 3 — live activity ticker */}
        <LiveTicker />

        {/* 4 — KPI strip */}
        <KpiStrip />

        {/* 5 — #1 dark hero card */}
        <TopHero />

        {/* 6 — top-10 leaderboard */}
        <Leaderboard />

        {/* 7 — category mini-boards */}
        <CategoryMiniBoards />

        {/* 8 — reels row (shared) */}
        <div className="mb-7">
          <ShortsRow eyebrow="video tours" title={<><em>Hot</em> studio reels</>} moreTo={PAGES.TRENDING} reels={SHORTS} />
        </div>

        {/* 9 — search trends + most saved */}
        <SearchAndSaved />

        {/* 10 — hot picks by city */}
        <HotByCity />

        {/* 11 — rising fast */}
        <RisingFast />

        {/* 12 — behind the trend editorial */}
        <BehindTheTrend />

        {/* 13 — weekly digest CTA */}
        <WeeklyDigest />
      </div>
    </>
  );
}
