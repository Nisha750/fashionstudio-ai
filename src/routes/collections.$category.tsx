import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { categoryLabel, collections } from "@/lib/catalog";
import { collectionQuery } from "@/lib/queries";
import { ProductCard, ProductGridSkeleton } from "@/components/ProductCard";

export const Route = createFileRoute("/collections/$category")({
  beforeLoad: ({ params }) => {
    if (!collections.some((c) => c.slug === params.category)) throw notFound();
  },
  head: ({ params }) => {
    const label = categoryLabel(params.category);
    return {
      meta: [
        { title: `${label} — VÉRA Collection | AI Fashion Studio` },
        {
          name: "description",
          content: `Shop the VÉRA ${label} collection: 70 monochrome editorial pieces, filtered by price and sorted your way.`,
        },
        { property: "og:title", content: `${label} — VÉRA` },
        { property: "og:description", content: `70 pieces in the VÉRA ${label} collection.` },
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
    };
  },
  component: CollectionPage,
});

const sorts = [
  { value: "featured", label: "Featured" },
  { value: "price-asc", label: "Price ↑" },
  { value: "price-desc", label: "Price ↓" },
  { value: "rating", label: "Top rated" },
];

function CollectionPage() {
  const { category } = Route.useParams();
  const [sort, setSort] = useState("featured");
  const [maxPrice, setMaxPrice] = useState<number | null>(null);
  const { data, isPending, isError, refetch, isFetching } = useQuery(collectionQuery({ collection: category, sort, maxPrice }));

  return (
    <div className="mx-auto max-w-[1600px] px-5 py-12 md:px-10">
      <p className="eyebrow">Collection</p>
      <h1 className="display-lg mt-3">{categoryLabel(category)}</h1>
      <p className="mt-4 max-w-lg text-sm text-muted-foreground">
        {isPending ? "Loading the collection…" : `${data?.length ?? 0} pieces, each with sizes and pricing ready to shop.`}
      </p>

      <div className="mt-10 flex flex-wrap items-center gap-3 border-y py-4">
        {sorts.map((s) => (
          <button
            key={s.value}
            onClick={() => setSort(s.value)}
            className={`px-4 py-2 text-[11px] uppercase tracking-[0.2em] transition-colors ${
              sort === s.value ? "bg-primary text-primary-foreground" : "border hover:bg-accent"
            }`}
          >
            {s.label}
          </button>
        ))}
        <div className="ml-auto flex items-center gap-3">
          <span className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">Under ₹1,999</span>
          <button
            onClick={() => setMaxPrice((v) => (v ? null : 1999))}
            className={`px-4 py-2 text-[11px] uppercase tracking-[0.2em] transition-colors ${
              maxPrice ? "bg-primary text-primary-foreground" : "border hover:bg-accent"
            }`}
          >
            {maxPrice ? "On" : "Off"}
          </button>
        </div>
      </div>

      <div className="mt-12">
        {isPending && <ProductGridSkeleton count={12} />}
        {isError && (
          <div className="border-y py-20 text-center">
            <p className="font-display text-3xl">The collection did not load.</p>
            <p className="mt-3 text-sm text-muted-foreground">Please try again to reconnect to the VÉRA catalogue.</p>
            <button
              type="button"
              disabled={isFetching}
              onClick={() => refetch()}
              className="mt-6 border px-8 py-3 text-[11px] uppercase tracking-[0.2em] disabled:opacity-50"
            >
              {isFetching ? "Loading…" : "Try again"}
            </button>
          </div>
        )}
        {data && data.length === 0 && (
          <p className="py-24 text-center text-sm text-muted-foreground">
            Nothing in this filter yet.{" "}
            <button className="underline" onClick={() => setMaxPrice(null)}>
              Clear filters
            </button>
          </p>
        )}
        {data && data.length > 0 && (
          <div className="grid grid-cols-2 gap-x-4 gap-y-12 md:grid-cols-4">
            {data.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </div>

      <div className="mt-20 flex flex-wrap gap-4 border-t pt-8">
        {collections
          .filter((c) => c.slug !== category)
          .map((c) => (
            <Link
              key={c.slug}
              to="/collections/$category"
              params={{ category: c.slug }}
              className="link-underline text-[11px] uppercase tracking-[0.2em] text-muted-foreground hover:text-foreground"
            >
              {c.label}
            </Link>
          ))}
      </div>
    </div>
  );
}
