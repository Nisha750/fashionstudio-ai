import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";
import type { Database } from "@/integrations/supabase/types";

const columns =
  "id,slug,name,category,description,price,sale_price,rating,review_count,image_key,popularity,is_new,stock";

const collectionInput = z.object({
  collection: z.string().min(1).max(40),
  sort: z.enum(["featured", "price-asc", "price-desc", "rating"]).default("featured"),
  maxPrice: z.number().positive().nullable().default(null),
  limit: z.number().int().min(1).max(120).default(120),
});

const productInput = z.object({ slug: z.string().min(1).max(160) });
const relatedInput = z.object({ category: z.string().min(1).max(40), slug: z.string().min(1).max(160) });
const searchInput = z.object({ term: z.string().trim().min(2).max(100) });
const idsInput = z.object({ ids: z.array(z.string().uuid()).max(100) });

function publicClient() {
  const key = process.env["SUPABASE_PUBLISHABLE_KEY"]!;
  return createClient<Database>(process.env["SUPABASE_URL"]!, key, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: {
      fetch: (input, init) => {
        const headers = new Headers(init?.headers);
        if (key.startsWith("sb_") && headers.get("Authorization") === `Bearer ${key}`) {
          headers.delete("Authorization");
        }
        headers.set("apikey", key);
        return fetch(input, { ...init, headers });
      },
    },
  });
}

export const getCollection = createServerFn({ method: "GET" })
  .inputValidator((input) => collectionInput.parse(input))
  .handler(async ({ data }) => {
    let query = publicClient().from("products").select(columns);
    if (data.collection === "new-arrivals") query = query.eq("is_new", true);
    else if (data.collection === "sale") query = query.not("sale_price", "is", null);
    else query = query.eq("category", data.collection);
    if (data.maxPrice) query = query.lte("price", data.maxPrice);
    if (data.sort === "price-asc") query = query.order("price", { ascending: true });
    else if (data.sort === "price-desc") query = query.order("price", { ascending: false });
    else if (data.sort === "rating") query = query.order("rating", { ascending: false });
    else query = query.order("popularity", { ascending: false });
    const { data: rows, error } = await query.limit(data.limit);
    if (error) throw new Error("The collection could not be loaded.");
    return rows ?? [];
  });

export const getProduct = createServerFn({ method: "GET" })
  .inputValidator((input) => productInput.parse(input))
  .handler(async ({ data }) => {
    const result = await publicClient().from("products").select(columns).eq("slug", data.slug).maybeSingle();
    if (result.error) throw new Error("The product could not be loaded.");
    return result.data;
  });

export const getRelatedProducts = createServerFn({ method: "GET" })
  .inputValidator((input) => relatedInput.parse(input))
  .handler(async ({ data }) => {
    const result = await publicClient().from("products").select(columns).eq("category", data.category).neq("slug", data.slug).order("popularity", { ascending: false }).limit(4);
    if (result.error) throw new Error("Related pieces could not be loaded.");
    return result.data ?? [];
  });

export const searchProducts = createServerFn({ method: "GET" })
  .inputValidator((input) => searchInput.parse(input))
  .handler(async ({ data }) => {
    const result = await publicClient().from("products").select(columns).ilike("name", `%${data.term}%`).order("popularity", { ascending: false }).limit(40);
    if (result.error) throw new Error("Search could not be completed.");
    return result.data ?? [];
  });

export const getProductsByIds = createServerFn({ method: "POST" })
  .inputValidator((input) => idsInput.parse(input))
  .handler(async ({ data }) => {
    if (data.ids.length === 0) return [];
    const result = await publicClient().from("products").select(columns).in("id", data.ids);
    if (result.error) throw new Error("Your saved pieces could not be loaded.");
    return result.data ?? [];
  });