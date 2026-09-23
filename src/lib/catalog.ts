import women from "@/assets/women.jpg";
import men from "@/assets/men.jpg";
import dresses from "@/assets/dresses.jpg";
import tops from "@/assets/tops.jpg";
import bottoms from "@/assets/bottoms.jpg";
import outerwear from "@/assets/outerwear.jpg";
import shoes from "@/assets/shoes.jpg";
import accessories from "@/assets/accessories.jpg";
import editorial1 from "@/assets/editorial-1.jpg";
import editorial2 from "@/assets/editorial-2.jpg";
import dress01 from "@/assets/dresses/dress-01.jpg";
import dress02 from "@/assets/dresses/dress-02.jpg";
import dress03 from "@/assets/dresses/dress-03.jpg";
import dress04 from "@/assets/dresses/dress-04.jpg";
import dress05 from "@/assets/dresses/dress-05.jpg";
import dress06 from "@/assets/dresses/dress-06.jpg";
import dress07 from "@/assets/dresses/dress-07.jpg";
import dress08 from "@/assets/dresses/dress-08.jpg";
import dress09 from "@/assets/dresses/dress-09.jpg";
import dress10 from "@/assets/dresses/dress-10.jpg";
import dress11 from "@/assets/dresses/dress-11.jpg";
import dress12 from "@/assets/dresses/dress-12.jpg";
import dress13 from "@/assets/dresses/dress-13.jpg";
import dress14 from "@/assets/dresses/dress-14.jpg";
import dress15 from "@/assets/dresses/dress-15.jpg";
import dress16 from "@/assets/dresses/dress-16.jpg";
import dress17 from "@/assets/dresses/dress-17.jpg";
import dress18 from "@/assets/dresses/dress-18.jpg";
import dress19 from "@/assets/dresses/dress-19.jpg";
import dress20 from "@/assets/dresses/dress-20.jpg";
import dress21 from "@/assets/dresses/dress-21.jpg";
import dress22 from "@/assets/dresses/dress-22.jpg";
import dress23 from "@/assets/dresses/dress-23.jpg";
import dress24 from "@/assets/dresses/dress-24.jpg";

export type Product = {
  id: string;
  slug: string;
  name: string;
  category: string;
  description: string;
  price: number;
  sale_price: number | null;
  rating: number;
  review_count: number;
  image_key: string;
  popularity: number;
  is_new: boolean;
  stock: number;
};

export const categoryImages: Record<string, string> = {
  women,
  men,
  dresses,
  tops,
  bottoms,
  outerwear,
  shoes,
  accessories,
};

export const altImages = [editorial1, editorial2];

// Explicit imports keep every photograph available in preview and production builds.
export const dressImages: Record<string, string> = {
  "dress-01": dress01,
  "dress-02": dress02,
  "dress-03": dress03,
  "dress-04": dress04,
  "dress-05": dress05,
  "dress-06": dress06,
  "dress-07": dress07,
  "dress-08": dress08,
  "dress-09": dress09,
  "dress-10": dress10,
  "dress-11": dress11,
  "dress-12": dress12,
  "dress-13": dress13,
  "dress-14": dress14,
  "dress-15": dress15,
  "dress-16": dress16,
  "dress-17": dress17,
  "dress-18": dress18,
  "dress-19": dress19,
  "dress-20": dress20,
  "dress-21": dress21,
  "dress-22": dress22,
  "dress-23": dress23,
  "dress-24": dress24,
};

const dressKeys = Object.keys(dressImages).sort();


export const categories = [
  { slug: "women", label: "Women" },
  { slug: "men", label: "Men" },
  { slug: "dresses", label: "Dresses" },
  { slug: "tops", label: "Tops" },
  { slug: "bottoms", label: "Bottoms" },
  { slug: "outerwear", label: "Outerwear" },
  { slug: "shoes", label: "Shoes" },
  { slug: "accessories", label: "Accessories" },
];

export const collections = [
  ...categories,
  { slug: "new-arrivals", label: "New Arrivals" },
  { slug: "sale", label: "Sale" },
];

export function productImage(p: Pick<Product, "image_key">) {
  return dressImages[p.image_key] ?? categoryImages[p.image_key] ?? editorial1;
}

export function hoverImage(p: Pick<Product, "slug" | "image_key">) {
  if (dressImages[p.image_key]) {
    const i = dressKeys.indexOf(p.image_key);
    const next = dressKeys[(i + 1) % dressKeys.length]!;
    return dressImages[next] ?? dresses;
  }
  const n = p.slug.split("-").pop() ?? "1";
  return altImages[Number(n) % altImages.length] ?? editorial1;
}


export function formatPrice(value: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
}

export function effectivePrice(p: Product) {
  return p.sale_price ?? p.price;
}

export function categoryLabel(slug: string) {
  return collections.find((c) => c.slug === slug)?.label ?? slug;
}
