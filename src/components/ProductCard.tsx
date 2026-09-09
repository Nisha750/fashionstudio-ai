import { Link } from "@tanstack/react-router";
import { Heart, Star } from "lucide-react";
import { toast } from "sonner";
import { formatPrice, hoverImage, productImage, type Product } from "@/lib/catalog";
import { useStore } from "@/lib/store";

export function ProductCard({ product }: { product: Product }) {
  const { addToCart, toggleWishlist, inWishlist } = useStore();
  const saved = inWishlist(product.id);

  return (
    <article className="group relative">
      <Link
        to="/product/$slug"
        params={{ slug: product.slug }}
        className="relative block aspect-[4/5] overflow-hidden bg-muted"
      >
        <img
          src={productImage(product)}
          alt={product.name}
          loading="lazy"
          className="absolute inset-0 size-full object-cover transition-all duration-[900ms] ease-out group-hover:scale-[1.06] group-hover:opacity-0"
        />
        <img
          src={hoverImage(product)}
          alt=""
          aria-hidden
          loading="lazy"
          className="absolute inset-0 size-full scale-[1.06] object-cover opacity-0 transition-all duration-[900ms] ease-out group-hover:opacity-100"
        />
        {product.sale_price && (
          <span className="absolute left-3 top-3 bg-primary px-2 py-1 text-[10px] uppercase tracking-[0.2em] text-primary-foreground">
            Sale
          </span>
        )}
        {product.is_new && !product.sale_price && (
          <span className="absolute left-3 top-3 border border-foreground px-2 py-1 text-[10px] uppercase tracking-[0.2em]">
            New
          </span>
        )}
      </Link>

      <button
        aria-label={saved ? "Remove from wishlist" : "Add to wishlist"}
        onClick={() => {
          toggleWishlist(product.id);
          toast(saved ? "Removed from wishlist" : "Saved to wishlist");
        }}
        className="absolute right-3 top-3 grid size-9 place-items-center bg-background/80 backdrop-blur transition-transform hover:scale-110"
      >
        <Heart className={`size-4 ${saved ? "fill-foreground" : ""}`} />
      </button>

      <button
        onClick={() => {
          addToCart(product.id);
          toast("Added to bag", { description: product.name });
        }}
        className="absolute inset-x-0 bottom-[22%] mx-3 translate-y-3 bg-primary py-3 text-[11px] uppercase tracking-[0.25em] text-primary-foreground opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100"
      >
        Quick Add
      </button>

      <div className="mt-4 transition-transform duration-500 group-hover:-translate-y-0.5">
        <div className="flex items-start justify-between gap-4">
          <Link to="/product/$slug" params={{ slug: product.slug }} className="text-sm">
            {product.name}
          </Link>
          <span className="flex shrink-0 items-center gap-1 text-xs text-muted-foreground">
            <Star className="size-3 fill-current" />
            {product.rating.toFixed(1)}
          </span>
        </div>
        <p className="mt-1 text-sm">
          {product.sale_price ? (
            <>
              <span className="mr-2">{formatPrice(product.sale_price)}</span>
              <span className="text-muted-foreground line-through">{formatPrice(product.price)}</span>
            </>
          ) : (
            formatPrice(product.price)
          )}
        </p>
      </div>
    </article>
  );
}

export function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="animate-pulse">
          <div className="aspect-[4/5] bg-muted" />
          <div className="mt-4 h-3 w-2/3 bg-muted" />
          <div className="mt-2 h-3 w-1/3 bg-muted" />
        </div>
      ))}
    </div>
  );
}
