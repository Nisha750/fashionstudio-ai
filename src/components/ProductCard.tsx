import { Link } from "@tanstack/react-router";
import { Heart, Star } from "lucide-react";
import { toast } from "sonner";
import { formatPrice, hoverImage, productImage, type Product } from "@/lib/catalog";
import { useStore } from "@/lib/store";
import { Button } from "@/components/ui/button";

const cardSizes = ["XS", "S", "M", "L", "XL"];

export function ProductCard({ product }: { product: Product }) {
  const { addToCart, toggleWishlist, inWishlist } = useStore();
  const saved = inWishlist(product.id);
  const isDress = product.category === "dresses";

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
          width={1024}
          height={1280}
          className="absolute inset-0 size-full object-cover transition-all duration-[900ms] ease-out group-hover:scale-[1.06] group-hover:opacity-0"
        />
        <img
          src={hoverImage(product)}
          alt=""
          aria-hidden
          loading="lazy"
          width={1024}
          height={1280}
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

      <Button
        type="button"
        variant="ghost"
        size="icon"
        aria-label={saved ? "Remove from wishlist" : "Add to wishlist"}
        onClick={() => {
          toggleWishlist(product.id);
          toast(saved ? "Removed from wishlist" : "Saved to wishlist");
        }}
        className="absolute right-3 top-3 grid size-9 place-items-center bg-background/80 backdrop-blur transition-transform hover:scale-110"
      >
        <Heart className={`size-4 ${saved ? "fill-foreground" : ""}`} />
      </Button>

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
        {isDress && (
          <div className="mt-3 flex items-center justify-between gap-3 border-t pt-3">
            <span className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
              Sizes {cardSizes.join(" · ")}
            </span>
            <span className="shrink-0 text-[10px] uppercase tracking-[0.18em]">
              {product.stock > 0 ? "In stock" : "Unavailable"}
            </span>
          </div>
        )}
        <Button
          type="button"
          disabled={product.stock <= 0}
          onClick={() => {
            addToCart(product.id, "M");
            toast("Added to bag", { description: `${product.name} · Size M` });
          }}
          className="mt-3 h-11 w-full rounded-none text-[10px] uppercase tracking-[0.2em]"
        >
          {product.stock > 0 ? "Add to Bag · Size M" : "Unavailable"}
        </Button>
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
