import { queryOptions } from "@tanstack/react-query";
import type { Product } from "@/lib/catalog";
import {
  getCollection,
  getProduct,
  getProductsByIds,
  getRelatedProducts,
  searchProducts,
} from "@/lib/catalog.functions";

function num(row: unknown): Product {
  const p = row as Product;
  return {
    ...p,
    price: Number(p.price),
    sale_price: p.sale_price === null || p.sale_price === undefined ? null : Number(p.sale_price),
    rating: Number(p.rating),
  };
}

export type CollectionParams = {
  collection: string;
  sort?: string;
  maxPrice?: number | null;
};

export function collectionQuery({ collection, sort = "featured", maxPrice = null }: CollectionParams) {
  return queryOptions({
    queryKey: ["collection", collection, sort, maxPrice],
    queryFn: async (): Promise<Product[]> => {
      const data = await getCollection({ data: { collection, sort: sort as "featured" | "price-asc" | "price-desc" | "rating", maxPrice, limit: 120 } });
      return data.map(num);
    },
  });
}

export function newArrivalsQuery(limit = 8) {
  return queryOptions({
    queryKey: ["new-arrivals", limit],
    queryFn: async (): Promise<Product[]> => {
      const data = await getCollection({ data: { collection: "new-arrivals", sort: "featured", maxPrice: null, limit } });
      return data.map(num);
    },
  });
}

export function trendingQuery(limit = 8) {
  return queryOptions({
    queryKey: ["trending", limit],
    queryFn: async (): Promise<Product[]> => {
      const data = await getCollection({ data: { collection: "women", sort: "featured", maxPrice: null, limit } });
      return data.map(num);
    },
  });
}

export function productQuery(slug: string) {
  return queryOptions({
    queryKey: ["product", slug],
    queryFn: async (): Promise<Product | null> => {
      const data = await getProduct({ data: { slug } });
      return data ? num(data) : null;
    },
  });
}

export function relatedQuery(category: string, slug: string) {
  return queryOptions({
    queryKey: ["related", category, slug],
    queryFn: async (): Promise<Product[]> => {
      const data = await getRelatedProducts({ data: { category, slug } });
      return data.map(num);
    },
  });
}

export function searchQuery(term: string) {
  return queryOptions({
    queryKey: ["search", term],
    enabled: term.trim().length > 1,
    queryFn: async (): Promise<Product[]> => {
      const data = await searchProducts({ data: { term: term.trim() } });
      return data.map(num);
    },
  });
}

export function productsByIdsQuery(ids: string[]) {
  return queryOptions({
    queryKey: ["products-by-ids", [...ids].sort()],
    enabled: ids.length > 0,
    queryFn: async (): Promise<Product[]> => {
      const data = await getProductsByIds({ data: { ids } });
      return data.map(num);
    },
  });
}
