import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Heart, Star, Truck } from "lucide-react";
import { toast } from "sonner";
import { categoryLabel, formatPrice, hoverImage, productImage } from "@/lib/catalog";
import { productQuery, relatedQuery } from "@/lib/queries";
import { ProductCard } from "@/components/ProductCard";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/product/$slug")({
  head: ({ params }) => ({
    meta: [
      { title: `${params.slug.replace(/-/g, " ")} — VÉRA` },
      {
        name: "description",
        content: "A VÉRA studio piece: considered fabric, clean silhouette, monochrome finish.",
      },
      { property: "og:title", content: "VÉRA studio piece" },
      { property: "og:description", content: "Considered fabric, clean silhouette, monochrome finish." },
      { property: "og:type", content: "product" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ProductPage,
});

const sizes = ["XS", "S", "M", "L", "XL"];

function ProductPage() {
  const { slug } = Route.useParams();
  const { data: product, isPending } = useQuery(productQuery(slug));
  const related = useQuery({
    ...relatedQuery(product?.category ?? "", slug),
    enabled: !!product,
  });
  const { addToCart, toggleWishlist, inWishlist } = useStore();
  const [size, setSize] = useState("M");

  if (isPending) {
    return (
      <div className="mx-auto grid max-w-[1600px] gap-10 px-5 py-12 md:grid-cols-2 md:px-10">
        <div className="aspect-[4/5] animate-pulse bg-muted" />
        <div className="space-y-4">
          <div className="h-8 w-2/3 animate-pulse bg-muted" />
          <div className="h-4 w-1/3 animate-pulse bg-muted" />
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="mx-auto max-w-xl px-5 py-32 text-center">
        <h1 className="display-lg">Piece not found</h1>
        <Link
          to="/collections/$category"
          params={{ category: "women" }}
          className="mt-8 inline-block border px-8 py-4 text-[11px] uppercase tracking-[0.25em]"
        >
          Browse the studio
        </Link>
      </div>
    );
  }

  const saved = inWishlist(product.id);
  const price = product.sale_price ?? product.price;

  return (
    <div className="mx-auto max-w-[1600px] px-5 py-10 md:px-10">
      <nav className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
        <Link to="/" className="hover:text-foreground">
          VÉRA
        </Link>{" "}
        /{" "}
        <Link to="/collections/$category" params={{ category: product.category }} className="hover:text-foreground">
          {categoryLabel(product.category)}
        </Link>
      </nav>

      <div className="mt-8 grid gap-10 md:grid-cols-2">
        <div className="grid gap-3">
          <div className="aspect-[4/5] overflow-hidden bg-muted">
            <img
              src={productImage(product)}
              alt={product.name}
              className="size-full object-cover"
              width={1024}
              height={1280}
            />
          </div>
          <div className="aspect-[4/5] overflow-hidden bg-muted">
            <img
              src={hoverImage(product)}
              alt={`${product.name} — alternate view`}
              loading="lazy"
              className="size-full object-cover"
            />
          </div>
        </div>

        <div className="md:sticky md:top-28 md:h-fit">
          <p className="eyebrow">{categoryLabel(product.category)}</p>
          <h1 className="display-lg mt-3">{product.name}</h1>

          <div className="mt-5 flex items-center gap-4 text-sm">
            <span className="text-xl">{formatPrice(price)}</span>
            {product.sale_price && (
              <span className="text-muted-foreground line-through">{formatPrice(product.price)}</span>
            )}
            <span className="flex items-center gap-1 text-muted-foreground">
              <Star className="size-3 fill-current" />
              {product.rating.toFixed(1)} ({product.review_count})
            </span>
          </div>

          <p className="mt-6 max-w-md text-sm leading-relaxed text-muted-foreground">{product.description}</p>

          <div className="mt-8">
            <p className="eyebrow">Size</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {sizes.map((s) => (
                <button
                  key={s}
                  onClick={() => setSize(s)}
                  className={`min-w-14 border px-4 py-3 text-xs tracking-[0.15em] transition-colors ${
                    size === s ? "bg-primary text-primary-foreground" : "hover:bg-accent"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <button
              onClick={() => {
                addToCart(product.id, size);
                toast("Added to bag", { description: `${product.name} · ${size}` });
              }}
              className="flex-1 bg-primary px-8 py-4 text-[11px] uppercase tracking-[0.25em] text-primary-foreground transition-opacity hover:opacity-85"
            >
              Add to bag
            </button>
            <button
              onClick={() => {
                toggleWishlist(product.id);
                toast(saved ? "Removed from wishlist" : "Saved to wishlist");
              }}
              className="flex items-center gap-2 border px-6 py-4 text-[11px] uppercase tracking-[0.25em] transition-colors hover:bg-accent"
            >
              <Heart className={`size-4 ${saved ? "fill-foreground" : ""}`} /> {saved ? "Saved" : "Save"}
            </button>
          </div>

          <p className="mt-6 flex items-center gap-2 text-xs text-muted-foreground">
            <Truck className="size-4" /> Complimentary delivery over ₹4,999 · {product.stock} in stock
          </p>
        </div>
      </div>

      {related.data && related.data.length > 0 && (
        <section className="mt-24">
          <p className="eyebrow">Complete the look</p>
          <div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-12 md:grid-cols-4">
            {related.data.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
