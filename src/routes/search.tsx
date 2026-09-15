import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { searchQuery } from "@/lib/queries";
import { ProductCard, ProductGridSkeleton } from "@/components/ProductCard";

type SearchParams = { q: string };

export const Route = createFileRoute("/search")({
  validateSearch: (search: Record<string, unknown>): SearchParams => ({
    q: typeof search['q'] === "string" ? (search['q'] as string) : "",
  }),
  head: () => ({
    meta: [
      { title: "Search — VÉRA" },
      { name: "description", content: "Search the VÉRA studio: coats, silk, tailoring, boots and more." },
      { property: "og:title", content: "Search — VÉRA" },
      { property: "og:description", content: "Search the VÉRA studio catalogue." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: SearchPage,
});

function SearchPage() {
  const { q } = Route.useSearch();
  const navigate = useNavigate();
  const [term, setTerm] = useState(q);
  const { data, isPending, isFetched } = useQuery(searchQuery(q));

  return (
    <div className="mx-auto max-w-[1600px] px-5 py-12 md:px-10">
      <p className="eyebrow">Search</p>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          navigate({ to: "/search", search: { q: term.trim() } });
        }}
        className="mt-4 max-w-2xl"
      >
        <input
          value={term}
          onChange={(e) => setTerm(e.target.value)}
          placeholder="Wrap coat, slip dress, loafer…"
          className="display-lg w-full border-b bg-transparent pb-4 outline-none placeholder:text-muted-foreground/50"
        />
      </form>

      <div className="mt-12">
        {q.trim().length > 1 && isPending && <ProductGridSkeleton count={8} />}
        {isFetched && data && data.length === 0 && (
          <p className="py-20 text-sm text-muted-foreground">No pieces match "{q}".</p>
        )}
        {data && data.length > 0 && (
          <>
            <p className="mb-8 text-sm text-muted-foreground">{data.length} results for "{q}"</p>
            <div className="grid grid-cols-2 gap-x-4 gap-y-12 md:grid-cols-4">
              {data.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
