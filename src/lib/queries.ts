import { queryOptions } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Product } from "@/lib/catalog";

const COLUMNS =
  "id,slug,name,category,description,price,sale_price,rating,review_count,image_key,popularity,is_new,stock";

function num(p: Record<string, unknown>): Product {
  return {
    ...(p as unknown as Product),
    price: Number(p.price),
    sale_price: p.sale_price === null ? null : Number(p.sale_price),
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
      let q = supabase.from("products").select(COLUMNS);
      if (collection === "new-arrivals") q = q.eq("is_new", true);
      else if (collection === "sale") q = q.not("sale_price", "is", null);
      else q = q.eq("category", collection);

      if (maxPrice) q = q.lte("price", maxPrice);

      if (sort === "price-asc") q = q.order("price", { ascending: true });
      else if (sort === "price-desc") q = q.order("price", { ascending: false });
      else if (sort === "rating") q = q.order("rating", { ascending: false });
      else q = q.order("popularity", { ascending: false });

      const { data, error } = await q.limit(120);
      if (error) throw error;
      return (data ?? []).map(num);
    },
  });
}

export function newArrivalsQuery(limit = 8) {
  return queryOptions({
    queryKey: ["new-arrivals", limit],
    queryFn: async (): Promise<Product[]> => {
      const { data, error } = await supabase
        .from("products")
        .select(COLUMNS)
        .eq("is_new", true)
        .order("popularity", { ascending: false })
        .limit(limit);
      if (error) throw error;
      return (data ?? []).map(num);
    },
  });
}

export function trendingQuery(limit = 8) {
  return queryOptions({
    queryKey: ["trending", limit],
    queryFn: async (): Promise<Product[]> => {
      const { data, error } = await supabase
        .from("products")
        .select(COLUMNS)
        .order("popularity", { ascending: false })
        .limit(limit);
      if (error) throw error;
      return (data ?? []).map(num);
    },
  });
}

export function productQuery(slug: string) {
  return queryOptions({
    queryKey: ["product", slug],
    queryFn: async (): Promise<Product | null> => {
      const { data, error } = await supabase
        .from("products")
        .select(COLUMNS)
        .eq("slug", slug)
        .maybeSingle();
      if (error) throw error;
      return data ? num(data) : null;
    },
  });
}

export function relatedQuery(category: string, slug: string) {
  return queryOptions({
    queryKey: ["related", category, slug],
    queryFn: async (): Promise<Product[]> => {
      const { data, error } = await supabase
        .from("products")
        .select(COLUMNS)
        .eq("category", category)
        .neq("slug", slug)
        .order("popularity", { ascending: false })
        .limit(4);
      if (error) throw error;
      return (data ?? []).map(num);
    },
  });
}

export function searchQuery(term: string) {
  return queryOptions({
    queryKey: ["search", term],
    enabled: term.trim().length > 1,
    queryFn: async (): Promise<Product[]> => {
      const { data, error } = await supabase
        .from("products")
        .select(COLUMNS)
        .ilike("name", `%${term.trim()}%`)
        .order("popularity", { ascending: false })
        .limit(40);
      if (error) throw error;
      return (data ?? []).map(num);
    },
  });
}

export function productsByIdsQuery(ids: string[]) {
  return queryOptions({
    queryKey: ["products-by-ids", [...ids].sort()],
    enabled: ids.length > 0,
    queryFn: async (): Promise<Product[]> => {
      const { data, error } = await supabase.from("products").select(COLUMNS).in("id", ids);
      if (error) throw error;
      return (data ?? []).map(num);
    },
  });
}
