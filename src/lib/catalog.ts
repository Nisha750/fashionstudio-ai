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
  return categoryImages[p.image_key] ?? editorial1;
}

export function hoverImage(p: Pick<Product, "slug">) {
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
