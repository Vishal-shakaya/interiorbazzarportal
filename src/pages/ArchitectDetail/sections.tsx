import { type ReactNode } from "react";
import { Icon, type IconName } from "@/components/ui";
import { initialsOf } from "@/lib/listing";
import type { ListingItem } from "@/types/marketplace";
import { GRADIENTS } from "@/content/marketplace.content";

/* ── Deterministic project imagery (real Unsplash photos, per architect) ── */
const PROJECT_IMG = [
  "1618221195710-dd6b41faaea6", "1600210492486-724fe5c67fb0", "1600585154340-be6161a56a0c",
  "1600566753086-00f18fb6b3ea", "1600121848594-d8644e57abab", "1505691938895-1758d7feb511",
  "1586023492125-27b2c045efd7", "1556912173-3bb406ef7e77", "1556909114-f6e7ad7d3136",
  "1565182999561-18d7dc61c393", "1502672260266-1c1ef2d93688", "1493809842364-78817add7ffb",
  "1567016432779-094069958ea5", "1604014237800-1c9102c219da", "1583847268964-b28dc8f51f92",
  "1616486338812-3dadae4b4ace",
];

export function projImg(archId: string, idx: number) {
  const seed = Math.abs([...archId].reduce((a, c) => a + c.charCodeAt(0), 0)) || 1;
  const base = (seed * 3) % PROJECT_IMG.length;
  const id = PROJECT_IMG[(base + idx) % PROJECT_IMG.length];
  return `https://images.unsplash.com/photo-${id}?w=640&h=640&fit=crop&q=75`;
}

export interface Project {
  title: string;
  cat: string;
  bg: string;
  img: string;
}

export interface Award {
  year: string;
  title: string;
  desc: string;
}

export interface ArchDerived {
  firm: string;
  titleLabel: string;
  jobTitle: string;
  styleHint: string;
  services: string[];
  expYrs: string;
  expLabel: string;
  projectNum: string;
  fullLoc: string;
  credList: string[];
  langList: string[];
  moq: string;
  bg: string;
  booked: boolean;
  projects: Project[];
  awards: Award[];
}

/** Synthesize the prototype's derived architect detail fields from the listing item. */
export function deriveArchitect(item: ListingItem): ArchDerived {
  const firm = `${item.title.split(" ")[0]} Studio`;
  const titleLabel = "Principal Architect";
  const styleHint = item.category.split("·")[0].trim();
  const services = item.category.split(/[·,]/).map((s) => s.trim()).filter(Boolean);
  const expYrs = String(item.experience ?? 10);
  const expLabel = `${expYrs}+ years`;
  const projectNum = String(item.projects ?? 0);
  const fullLoc = item.city;
  const credList = ["COA", "IIA"];
  const langList = ["English", "Hindi"];
  const moq = "New projects from ₹15 Lakh";
  const bg = item.bg ?? GRADIENTS[item.title.length % GRADIENTS.length];

  const projectDefs = [
    { title: "Mehta Villa, Saket", cat: "Residential · 4,200 sqft" },
    { title: "Café Bloom, Hauz Khas", cat: "Hospitality · 1,400 sqft" },
    { title: "Verma Penthouse", cat: "Residential · 3,800 sqft" },
    { title: "TechCo Office, Cyber City", cat: "Commercial · 12,000 sqft" },
    { title: "Heritage Bungalow, Jaipur", cat: "Restoration · 5,500 sqft" },
    { title: "Studio Apartment, Bandra", cat: "Compact · 650 sqft" },
  ];
  const projects: Project[] = projectDefs.map((p, i) => ({ ...p, bg, img: projImg(item.id, i) }));

  const awards: Award[] = [
    { year: "2024", title: "IIA Excellence Award", desc: "Best Residential Project — Mehta Villa" },
    { year: "2023", title: "Architect+ Top 50", desc: "Featured in national architecture annual" },
    { year: "2022", title: "GRIHA Sustainability", desc: "5-star rating for Café Bloom project" },
    { year: "2021", title: "AD India Feature", desc: "Penthouse project featured in Architectural Digest India" },
  ];

  return {
    firm, titleLabel, jobTitle: titleLabel, styleHint, services, expYrs, expLabel,
    projectNum, fullLoc, credList, langList, moq, bg, booked: false, projects, awards,
  };
}

/* ────────────────────────── primitives ────────────────────────── */

export function Card({ children }: { children: ReactNode }) {
  return (
    <div className="mb-[18px] rounded-[14px] border border-line bg-bone-card px-6 py-[22px]">{children}</div>
  );
}

export function CardHead({ icon, title, link }: { icon: IconName; title: string; link?: ReactNode }) {
  return (
    <div className="mb-4 flex items-center justify-between">
      <div className="flex items-center gap-2 text-[14px] font-bold text-ink">
        <Icon name={icon} size={17} className="text-forest" /> {title}
      </div>
      {link}
    </div>
  );
}

export function CardLink({ children, onClick }: { children: ReactNode; onClick?: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center gap-0.5 text-[12.5px] font-bold text-forest hover:underline"
    >
      {children}
    </button>
  );
}

export function Chip({ children }: { children: ReactNode }) {
  return (
    <span className="rounded-[24px] border border-green-mint bg-green-light px-3.5 py-[7px] text-[12.5px] font-semibold text-forest">
      {children}
    </span>
  );
}

export function SpecRow({ icon, main, sub }: { icon: IconName; main: string; sub: string }) {
  return (
    <div className="flex items-start gap-3">
      <Icon name={icon} size={18} className="mt-px shrink-0 text-forest" />
      <div>
        <div className="mb-0.5 text-[14px] font-semibold leading-snug text-ink">{main}</div>
        <div className="text-[12.5px] leading-normal text-muted">{sub}</div>
      </div>
    </div>
  );
}

/* ────────────────────────── projects ────────────────────────── */

export function ProjectsGrid({ projects }: { projects: Project[] }) {
  return (
    <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-3">
      {projects.map((p) => (
        <div key={p.title} className="group flex cursor-pointer flex-col transition hover:-translate-y-0.5">
          <div
            className="relative mb-2.5 grid aspect-[4/3] place-items-center overflow-hidden rounded-[10px] transition group-hover:shadow-card"
            style={{ background: p.bg }}
          >
            <img
              src={p.img}
              alt={p.title}
              loading="lazy"
              decoding="async"
              className="absolute inset-0 h-full w-full object-cover"
            />
          </div>
          <div className="mb-0.5 text-[13.5px] font-bold leading-snug text-ink">{p.title}</div>
          <div className="text-[11.5px] font-medium text-muted">{p.cat}</div>
        </div>
      ))}
    </div>
  );
}

/* ────────────────────────── awards ────────────────────────── */

export function Awards({ awards }: { awards: Award[] }) {
  return (
    <div className="flex flex-col gap-3.5">
      {awards.map((aw) => (
        <div
          key={aw.title}
          className="flex items-center gap-4 rounded-[12px] bg-chip px-[18px] py-4 transition hover:bg-green-light"
        >
          <div className="min-w-[60px] shrink-0 font-editorial text-[24px] leading-none text-forest">{aw.year}</div>
          <div className="min-w-0 flex-1">
            <div className="mb-0.5 text-[14.5px] font-bold text-ink">{aw.title}</div>
            <div className="text-[12.5px] leading-normal text-muted">{aw.desc}</div>
          </div>
          <Icon name="rosette" size={22} className="shrink-0 text-amber" />
        </div>
      ))}
    </div>
  );
}

/* ────────────────────────── reviews (prototype layout) ────────────────────────── */

export interface DetailReview {
  name: string;
  rating: number;
  date: string;
  text: string;
}

function Stars({ value }: { value: number }) {
  return (
    <span className="inline-flex text-amber">
      {[1, 2, 3, 4, 5].map((n) => (
        <Icon key={n} name={n <= Math.round(value) ? "star-filled" : "star"} size={13} />
      ))}
    </span>
  );
}

export function ReviewsPane({
  rating,
  count,
  breakdown,
  reviews,
}: {
  rating: number;
  count: number;
  breakdown: { stars: number; pct: number }[];
  reviews: DetailReview[];
}) {
  return (
    <Card>
      <div className="mb-[18px] grid grid-cols-1 items-center gap-8 border-b border-line py-5 sm:grid-cols-[200px_1fr]">
        <div>
          <div className="font-editorial text-[60px] leading-none text-forest">{rating.toFixed(1)}</div>
          <div className="my-1">
            <Stars value={rating} />
          </div>
          <div className="text-[13px] font-medium text-muted">{count} client reviews</div>
        </div>
        <div className="flex flex-col gap-[7px]">
          {breakdown.map((b) => (
            <div key={b.stars} className="flex items-center gap-2.5">
              <span className="flex w-[30px] items-center gap-0.5 text-[12px] font-semibold text-ink">
                {b.stars}
                <Icon name="star-filled" size={11} className="text-amber" />
              </span>
              <span className="h-[7px] flex-1 overflow-hidden rounded bg-chip">
                <span className="block h-full rounded bg-forest" style={{ width: `${b.pct}%` }} />
              </span>
              <span className="w-8 text-right text-[11px] font-semibold text-muted">{b.pct}%</span>
            </div>
          ))}
        </div>
      </div>
      {reviews.map((rv, i) => (
        <div key={i} className="border-b border-line py-[18px] last:border-0 last:pb-0">
          <div className="mb-2.5 flex items-center gap-3">
            <span className="grid h-[38px] w-[38px] shrink-0 place-items-center rounded-full bg-sel-bg font-editorial text-[15px] text-forest">
              {initialsOf(rv.name)}
            </span>
            <div className="flex-1">
              <div className="text-[13.5px] font-bold text-ink">{rv.name}</div>
              <div className="text-[11.5px] text-muted">{rv.date}</div>
            </div>
            <Stars value={rv.rating} />
          </div>
          <div className="ml-[50px] text-[13.5px] leading-relaxed text-ink">{rv.text}</div>
        </div>
      ))}
    </Card>
  );
}
