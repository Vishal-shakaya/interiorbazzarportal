import type { IconName } from "@/components/ui";
import type { ListingItem, ListingType } from "@/types/marketplace";

/**
 * Static demo dataset for the whole marketplace. Pages read from these arrays
 * via their page hook behind an API-swap seam — never fetch here:
 *   setItems(PRODUCTS); // ← future: const r = await api.products(); setItems(r.data)
 */

/** Warm, on-brand gradient placeholders (used when an item has no image). */
export const GRADIENTS = [
  "linear-gradient(135deg,#0c5a49,#1d9e75)",
  "linear-gradient(135deg,#ba7517,#e0a44a)",
  "linear-gradient(135deg,#1a3a6e,#3f6fb0)",
  "linear-gradient(135deg,#5a1a7a,#9b54c4)",
  "linear-gradient(135deg,#0c5a49,#0a3f34)",
  "linear-gradient(135deg,#7a4a1a,#c08a3e)",
];

const CITIES = ["New Delhi", "Mumbai", "Bangalore", "Hyderabad", "Chennai", "Pune"];

const grad = (i: number) => GRADIENTS[i % GRADIENTS.length];
const city = (i: number) => CITIES[i % CITIES.length];
const slug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

// Real cover photos by category — Unsplash IDs ported 1:1 from the prototype
// (home.html feed cards). The gradient `bg` stays as the onerror fallback.
const IMG: Record<string, string[]> = {
  interior: ["1493809842364-78817add7ffb", "1586023492125-27b2c045efd7", "1618220179428-22790b461013"],
  kitchen: ["1556909212-d5b604d0c90d", "1604709177225-055f99402ea3"],
  tiles: ["1597072689227-8882273e8f6a", "1581094794329-c8112a89af12"],
  lighting: ["1513506003901-1e6a229e2d15", "1543198126-a8ad8e47fb22"],
  furniture: ["1581858726788-75bc0f6a952d", "1631679706909-1844bbd07221", "1567538096630-e0c55bd6374c", "1506377247377-2a5b3b417ebb"],
  sanitary: ["1620626011761-996317b8d101", "1552321554-5fefe8c9ef14"],
  architecture: ["1503387762-592deb58ef4e", "1486406146926-c627a92ad1ab", "1497366216548-37526070297c"],
  office: ["1497366216548-37526070297c", "1486406146926-c627a92ad1ab"],
  "3d": ["1618220179428-22790b461013", "1586023492125-27b2c045efd7"],
};
const IMG_FALLBACK = ["1506439773649-6e0eb8cfb237", "1562259949-e8e7689d7828", "1589939705384-5185137a7f0f", "1487958449943-2429e8be8625", "1493809842364-78817add7ffb", "1581858726788-75bc0f6a952d"];
const photo = (cat: string, idx: number, w = 400, h = 260) => {
  const pool = IMG[cat] ?? IMG_FALLBACK;
  return `https://images.unsplash.com/photo-${pool[idx % pool.length]}?w=${w}&h=${h}&fit=crop&q=75`;
};

interface Seed {
  title: string;
  by: string;
  category: string;
  cat: string;
  icon: IconName;
  price?: number;
  unit?: string;
  scope?: string;
  experience?: number;
  projects?: number;
  tag?: string;
  hot?: boolean;
  distance?: string;
  hoursOpen?: string;
}

// Promotional tag pools per type (mirrors the prototype's varied card tags).
// A seed may override via `s.tag`. Shops use the ShopCard (no media tag).
const PROMO: Partial<Record<ListingType, string[]>> = {
  product: ["Bestseller", "New arrival", "Top rated", "Bulk available", "Trade price"],
  service: ["Most booked", "Fast delivery", "Top rated", "Same-day quote", "Verified pro"],
  business: ["Top rated", "Industry leader", "Verified seller", "Featured"],
  architect: ["Top rated", "Award winning", "Featured", "New"],
  catalogue: ["Updated", "New drop", "Free PDF", "Bulk ready"],
};
const SHOP_HOURS = ["10am – 7pm", "11am – 8pm", "9:30am – 6:30pm", "10:30am – 9pm"];

function build(type: ListingType, seeds: Seed[], offset = 0): ListingItem[] {
  const isShop = type === "shop";
  const pool = PROMO[type];
  return seeds.map((s, i) => {
    const idx = offset + i;
    const open = idx % 3 !== 0; // most shops open; some closed
    return {
      id: `${type}-${idx}`,
      slug: slug(s.title),
      type,
      title: s.title,
      by: s.by,
      city: city(idx),
      category: s.category,
      cat: s.cat,
      bg: grad(idx),
      image: photo(s.cat, idx),
      icon: s.icon,
      rating: +(4.3 + ((idx * 7) % 7) / 10).toFixed(1),
      reviews: 18 + ((idx * 13) % 240),
      verified: idx % 3 !== 0,
      open,
      sponsored: idx % 7 === 0,
      hot: s.hot ?? (!isShop && idx % 5 === 0),
      tag: s.tag ?? (isShop ? undefined : pool ? pool[idx % pool.length] : undefined),
      price: s.price,
      unit: s.unit,
      scope: s.scope,
      experience: s.experience,
      projects: s.projects,
      // shop-specific
      distance: s.distance ?? (isShop ? `${(0.8 + (idx % 6) * 0.9 + (idx % 3) * 0.3).toFixed(1)} km` : undefined),
      hoursOpen: s.hoursOpen ?? (isShop ? SHOP_HOURS[idx % SHOP_HOURS.length] : undefined),
      reopensAt: isShop && !open ? "Opens 10am" : undefined,
    };
  });
}

export const PRODUCTS: ListingItem[] = build("product", [
  { title: "Teak 3-Seater Sofa", by: "Wood & Co", category: "Furniture", cat: "furniture", icon: "products", price: 48900, unit: "piece" },
  { title: "Matte Porcelain Tiles", by: "TilecraftIndia", category: "Tiles & marble", cat: "tiles", icon: "products", price: 95, unit: "sq ft" },
  { title: "Brushed Brass Faucet", by: "AquaForm", category: "Sanitary ware", cat: "sanitary", icon: "products", price: 7250, unit: "piece" },
  { title: "Pendant Cluster Light", by: "Lumen Studio", category: "Lighting", cat: "lighting", icon: "products", price: 12400, unit: "set" },
  { title: "Modular Kitchen Shutter", by: "FormKitchens", category: "Modular kitchen", cat: "kitchen", icon: "products", price: 2100, unit: "sq ft" },
  { title: "Italian Marble Slab", by: "StoneAge", category: "Tiles & marble", cat: "tiles", icon: "products", price: 320, unit: "sq ft" },
  { title: "Linen Accent Chair", by: "Wood & Co", category: "Furniture", cat: "furniture", icon: "products", price: 18600, unit: "piece" },
  { title: "Rain Shower Panel", by: "AquaForm", category: "Sanitary ware", cat: "sanitary", icon: "products", price: 21500, unit: "piece" },
  { title: "Oak Veneer Wardrobe", by: "FormKitchens", category: "Furniture", cat: "furniture", icon: "products", price: 64500, unit: "piece" },
  { title: "Hexagon Mosaic Tiles", by: "Tilecraft", category: "Tiles & marble", cat: "tiles", icon: "products", price: 145, unit: "sq ft" },
  { title: "Smart LED Strip", by: "Lumen Studio", category: "Lighting", cat: "lighting", icon: "products", price: 1850, unit: "metre" },
  { title: "Quartz Counter Top", by: "StoneAge", category: "Modular kitchen", cat: "kitchen", icon: "products", price: 480, unit: "sq ft" },
  { title: "Wall-Hung Water Closet", by: "AquaForm", category: "Sanitary ware", cat: "sanitary", icon: "products", price: 16400, unit: "piece" },
  { title: "Walnut Dining Table", by: "Wood & Co", category: "Furniture", cat: "furniture", icon: "products", price: 72000, unit: "piece" },
  { title: "Track Spotlight Set", by: "Lumen Studio", category: "Lighting", cat: "lighting", icon: "products", price: 8900, unit: "set" },
  { title: "Anti-skid Bathroom Tiles", by: "Tilecraft", category: "Tiles & marble", cat: "tiles", icon: "products", price: 78, unit: "sq ft" },
]);

export const SERVICES: ListingItem[] = build("service", [
  { title: "Full Home Interior Design", by: "Studio Verde", category: "Interior design", cat: "interior", icon: "services", scope: "Turnkey" },
  { title: "3D Visualisation & Render", by: "PixelHaus", category: "3D visualization", cat: "3d", icon: "services", scope: "Per room" },
  { title: "Modular Kitchen Install", by: "FormKitchens", category: "Modular kitchen", cat: "kitchen", icon: "services", scope: "On-site" },
  { title: "Vastu Consultation", by: "Harmony Spaces", category: "Vastu compliant", cat: "vastu", icon: "services", scope: "Advisory" },
  { title: "Office Fit-out", by: "WorkAxis", category: "Office interior", cat: "office", icon: "services", scope: "Turnkey" },
  { title: "False Ceiling & POP", by: "CeilPro", category: "Interior design", cat: "interior", icon: "services", scope: "On-site" },
  { title: "Bathroom Renovation", by: "AquaForm", category: "Sanitary ware", cat: "sanitary", icon: "services", scope: "Turnkey" },
  { title: "Sustainable Home Audit", by: "EcoSpace", category: "Sustainable", cat: "sustainable", icon: "services", scope: "Advisory" },
  { title: "Lighting Design Plan", by: "Lumen Studio", category: "Lighting", cat: "lighting", icon: "services", scope: "Per room" },
  { title: "Wardrobe Carpentry", by: "Wood & Co", category: "Furniture", cat: "furniture", icon: "services", scope: "On-site" },
  { title: "Retail Store Design", by: "WorkAxis", category: "Office interior", cat: "office", icon: "services", scope: "Turnkey" },
  { title: "Marble Flooring Service", by: "StoneAge", category: "Tiles & marble", cat: "tiles", icon: "services", scope: "On-site" },
], 8);

export const BUSINESSES: ListingItem[] = build("business", [
  { title: "Studio Verde Interiors", by: "Verified business", category: "Interior design", cat: "interior", icon: "business", experience: 12, projects: 240 },
  { title: "FormKitchens", by: "Verified business", category: "Modular kitchen", cat: "kitchen", icon: "business", experience: 8, projects: 160 },
  { title: "AquaForm Sanitary", by: "Verified business", category: "Sanitary ware", cat: "sanitary", icon: "business", experience: 15, projects: 320 },
  { title: "Lumen Lighting Studio", by: "Verified business", category: "Lighting", cat: "lighting", icon: "business", experience: 6, projects: 90 },
  { title: "StoneAge Marble", by: "Verified business", category: "Tiles & marble", cat: "tiles", icon: "business", experience: 20, projects: 410 },
  { title: "WorkAxis Commercial", by: "Verified business", category: "Office interior", cat: "office", icon: "business", experience: 9, projects: 130 },
  { title: "EcoSpace Sustainable", by: "Verified business", category: "Sustainable", cat: "sustainable", icon: "business", experience: 7, projects: 70 },
  { title: "Tilecraft India", by: "Verified business", category: "Tiles & marble", cat: "tiles", icon: "business", experience: 16, projects: 290 },
  { title: "CeilPro Interiors", by: "Verified business", category: "Interior design", cat: "interior", icon: "business", experience: 5, projects: 60 },
  { title: "Harmony Spaces", by: "Verified business", category: "Vastu compliant", cat: "vastu", icon: "business", experience: 13, projects: 180 },
  { title: "PixelHaus Studio", by: "Verified business", category: "3D visualization", cat: "3d", icon: "business", experience: 4, projects: 95 },
  { title: "Wood & Co Furniture", by: "Verified business", category: "Furniture", cat: "furniture", icon: "business", experience: 18, projects: 350 },
], 14);

export const ARCHITECTS: ListingItem[] = build("architect", [
  { title: "Ar. Meera Kapoor", by: "Residential & Vastu", category: "Architecture", cat: "architecture", icon: "architects", experience: 14, projects: 86 },
  { title: "Ar. Rohan Desai", by: "Commercial & retail", category: "Architecture", cat: "architecture", icon: "architects", experience: 11, projects: 64 },
  { title: "Ar. Saira Nair", by: "Sustainable design", category: "Sustainable", cat: "sustainable", icon: "architects", experience: 9, projects: 52 },
  { title: "Ar. Vikram Shah", by: "Luxury residences", category: "Architecture", cat: "architecture", icon: "architects", experience: 18, projects: 120 },
  { title: "Ar. Neha Iyer", by: "Compact homes", category: "Architecture", cat: "architecture", icon: "architects", experience: 7, projects: 40 },
  { title: "Ar. Arjun Menon", by: "Hospitality & retail", category: "Architecture", cat: "architecture", icon: "architects", experience: 13, projects: 78 },
  { title: "Ar. Priya Rao", by: "Vastu & wellness", category: "Vastu compliant", cat: "vastu", icon: "architects", experience: 10, projects: 58 },
  { title: "Ar. Kabir Singh", by: "Industrial & warehouse", category: "Office interior", cat: "office", icon: "architects", experience: 15, projects: 90 },
  { title: "Ar. Tara Bose", by: "Heritage restoration", category: "Architecture", cat: "architecture", icon: "architects", experience: 22, projects: 140 },
  { title: "Ar. Dev Malhotra", by: "Modern minimal", category: "Architecture", cat: "architecture", icon: "architects", experience: 8, projects: 47 },
  { title: "Ar. Riya Sen", by: "Green buildings", category: "Sustainable", cat: "sustainable", icon: "architects", experience: 11, projects: 63 },
  { title: "Ar. Aman Gupta", by: "Apartment interiors", category: "Interior design", cat: "interior", icon: "architects", experience: 6, projects: 38 },
  { title: "Ar. Sneha Pillai", by: "Coastal homes", category: "Architecture", cat: "architecture", icon: "architects", experience: 12, projects: 71 },
], 20);

export const SHOPS: ListingItem[] = build("shop", [
  { title: "Wood & Co Showroom", by: "Furniture gallery", category: "Furniture", cat: "furniture", icon: "shops", experience: 7 },
  { title: "Tilecraft Experience Centre", by: "Tiles & surfaces", category: "Tiles & marble", cat: "tiles", icon: "shops", experience: 10 },
  { title: "Lumen Light Lounge", by: "Lighting studio", category: "Lighting", cat: "lighting", icon: "shops", experience: 5 },
  { title: "AquaForm Bath Studio", by: "Sanitary showroom", category: "Sanitary ware", cat: "sanitary", icon: "shops", experience: 12 },
  { title: "StoneAge Marble Gallery", by: "Stone & surfaces", category: "Tiles & marble", cat: "tiles", icon: "shops", experience: 14 },
  { title: "FormKitchens Studio", by: "Kitchen showroom", category: "Modular kitchen", cat: "kitchen", icon: "shops", experience: 9 },
  { title: "EcoSpace Materials Store", by: "Sustainable goods", category: "Sustainable", cat: "sustainable", icon: "shops", experience: 4 },
  { title: "WorkAxis Office Hub", by: "Commercial furniture", category: "Office interior", cat: "office", icon: "shops", experience: 8 },
  { title: "PixelHaus Design Lab", by: "Visualisation studio", category: "3D visualization", cat: "3d", icon: "shops", experience: 5 },
  { title: "Harmony Vastu Centre", by: "Wellness & vastu", category: "Vastu compliant", cat: "vastu", icon: "shops", experience: 11 },
  { title: "CeilPro Display Centre", by: "Ceilings & POP", category: "Interior design", cat: "interior", icon: "shops", experience: 6 },
], 24);

export const CATALOGUES: ListingItem[] = build("catalogue", [
  { title: "Modular Kitchen 2026 Lookbook", by: "FormKitchens", category: "Modular kitchen", cat: "kitchen", icon: "catalogue" },
  { title: "Premium Tiles Catalogue", by: "Tilecraft", category: "Tiles & marble", cat: "tiles", icon: "catalogue" },
  { title: "Lighting Collection Vol. 4", by: "Lumen Studio", category: "Lighting", cat: "lighting", icon: "catalogue" },
  { title: "Sanitary Ware Range 2026", by: "AquaForm", category: "Sanitary ware", cat: "sanitary", icon: "catalogue" },
  { title: "Office Furniture Catalogue", by: "WorkAxis", category: "Office interior", cat: "office", icon: "catalogue" },
  { title: "Sustainable Materials Guide", by: "EcoSpace", category: "Sustainable", cat: "sustainable", icon: "catalogue" },
  { title: "Furniture Collection 2026", by: "Wood & Co", category: "Furniture", cat: "furniture", icon: "catalogue" },
  { title: "Marble & Stone Portfolio", by: "StoneAge", category: "Tiles & marble", cat: "tiles", icon: "catalogue" },
  { title: "Smart Lighting Guide", by: "Lumen Studio", category: "Lighting", cat: "lighting", icon: "catalogue" },
  { title: "Vastu Home Handbook", by: "Harmony Spaces", category: "Vastu compliant", cat: "vastu", icon: "catalogue" },
  { title: "3D Render Showcase", by: "PixelHaus", category: "3D visualization", cat: "3d", icon: "catalogue" },
  { title: "Bathroom Fittings 2026", by: "AquaForm", category: "Sanitary ware", cat: "sanitary", icon: "catalogue" },
  { title: "Interior Design Portfolio", by: "Studio Verde", category: "Interior design", cat: "interior", icon: "catalogue" },
], 28);

/** Lookup a single item across every collection by slug (detail pages). */
export const ALL_ITEMS: ListingItem[] = [
  ...PRODUCTS,
  ...SERVICES,
  ...BUSINESSES,
  ...ARCHITECTS,
  ...SHOPS,
  ...CATALOGUES,
];

export const findBySlug = (slug: string) => ALL_ITEMS.find((i) => i.slug === slug);
