import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { productsByIdsQuery } from "@/lib/queries";
import { ProductCard, ProductGridSkeleton } from "@/components/ProductCard";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/wishlist")({
  head: () => ({
    meta: [
      { title: "Wishlist — VÉRA" },
      { name: "description", content: "The VÉRA pieces you saved for later." },
      { property: "og:title", content: "Wishlist — VÉRA" },
      { property: "og:description", content: "The VÉRA pieces you saved for later." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: WishlistPage,
});

function WishlistPage() {
  const { wishlist, ready } = useStore();
  const { data, isPending } = useQuery(productsByIdsQuery(wishlist));

  return (
    <div className="mx-auto max-w-[1600px] px-5 py-12 md:px-10">
      <p className="eyebrow">Saved</p>
      <h1 className="display-lg mt-3">Wishlist</h1>

      <div className="mt-12">
        {ready && wishlist.length === 0 && (
          <div className="py-24 text-center">
            <p className="text-sm text-muted-foreground">Nothing saved yet.</p>
            <Link
              to="/collections/$category"
              params={{ category: "new-arrivals" }}
              className="mt-8 inline-block border px-8 py-4 text-[11px] uppercase tracking-[0.25em] hover:bg-accent"
            >
              Discover new arrivals
            </Link>
          </div>
        )}
        {wishlist.length > 0 && isPending && <ProductGridSkeleton count={4} />}
        {data && data.length > 0 && (
          <div className="grid grid-cols-2 gap-x-4 gap-y-12 md:grid-cols-4">
            {data.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
