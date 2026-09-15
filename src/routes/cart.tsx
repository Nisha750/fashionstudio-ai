import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Minus, Plus, X } from "lucide-react";
import { toast } from "sonner";
import { formatPrice, productImage } from "@/lib/catalog";
import { productsByIdsQuery } from "@/lib/queries";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/cart")({
  head: () => ({
    meta: [
      { title: "Your Bag — VÉRA" },
      { name: "description", content: "Review the pieces in your VÉRA bag and complete your order." },
      { property: "og:title", content: "Your Bag — VÉRA" },
      { property: "og:description", content: "Review the pieces in your VÉRA bag." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: CartPage,
});

function CartPage() {
  const { cart, setQty, removeLine, clearCart } = useStore();
  const ids = [...new Set(cart.map((l) => l.id))];
  const { data } = useQuery(productsByIdsQuery(ids));
  const [placed, setPlaced] = useState(false);

  const lines = cart
    .map((l) => ({ line: l, product: data?.find((p) => p.id === l.id) }))
    .filter((x) => x.product);

  const subtotal = lines.reduce(
    (sum, x) => sum + (x.product!.sale_price ?? x.product!.price) * x.line.qty,
    0,
  );
  const shipping = subtotal > 4999 || subtotal === 0 ? 0 : 199;

  if (placed) {
    return (
      <div className="mx-auto max-w-xl px-5 py-32 text-center">
        <p className="eyebrow">Order confirmed</p>
        <h1 className="display-lg mt-4">Thank you.</h1>
        <p className="mt-6 text-sm text-muted-foreground">
          Your VÉRA order is being prepared. A confirmation is on its way.
        </p>
        <Link
          to="/collections/$category"
          params={{ category: "new-arrivals" }}
          className="mt-10 inline-block bg-primary px-8 py-4 text-[11px] uppercase tracking-[0.25em] text-primary-foreground"
        >
          Continue shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1600px] px-5 py-12 md:px-10">
      <p className="eyebrow">Shopping bag</p>
      <h1 className="display-lg mt-3">Your Bag</h1>

      {lines.length === 0 ? (
        <div className="py-24 text-center">
          <p className="text-sm text-muted-foreground">Your bag is empty.</p>
          <Link
            to="/collections/$category"
            params={{ category: "women" }}
            className="mt-8 inline-block border px-8 py-4 text-[11px] uppercase tracking-[0.25em] hover:bg-accent"
          >
            Start shopping
          </Link>
        </div>
      ) : (
        <div className="mt-12 grid gap-12 lg:grid-cols-[1fr_380px]">
          <ul className="divide-y border-y">
            {lines.map(({ line, product }) => (
              <li key={`${line.id}-${line.size}`} className="flex gap-5 py-6">
                <Link
                  to="/product/$slug"
                  params={{ slug: product!.slug }}
                  className="h-36 w-28 shrink-0 overflow-hidden bg-muted"
                >
                  <img src={productImage(product!)} alt={product!.name} loading="lazy" className="size-full object-cover" />
                </Link>
                <div className="flex flex-1 flex-col">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <Link to="/product/$slug" params={{ slug: product!.slug }} className="text-sm">
                        {product!.name}
                      </Link>
                      <p className="mt-1 text-xs uppercase tracking-[0.2em] text-muted-foreground">
                        Size {line.size}
                      </p>
                    </div>
                    <button aria-label="Remove" onClick={() => removeLine(line.id, line.size)}>
                      <X className="size-4" />
                    </button>
                  </div>
                  <div className="mt-auto flex items-center justify-between">
                    <div className="flex items-center border">
                      <button
                        aria-label="Decrease quantity"
                        className="px-3 py-2"
                        onClick={() => setQty(line.id, line.size, line.qty - 1)}
                      >
                        <Minus className="size-3" />
                      </button>
                      <span className="w-8 text-center text-sm tabular-nums">{line.qty}</span>
                      <button
                        aria-label="Increase quantity"
                        className="px-3 py-2"
                        onClick={() => setQty(line.id, line.size, line.qty + 1)}
                      >
                        <Plus className="size-3" />
                      </button>
                    </div>
                    <span className="text-sm">
                      {formatPrice((product!.sale_price ?? product!.price) * line.qty)}
                    </span>
                  </div>
                </div>
              </li>
            ))}
          </ul>

          <aside className="h-fit border p-8">
            <p className="eyebrow">Summary</p>
            <dl className="mt-6 space-y-3 text-sm">
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Subtotal</dt>
                <dd>{formatPrice(subtotal)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Delivery</dt>
                <dd>{shipping === 0 ? "Complimentary" : formatPrice(shipping)}</dd>
              </div>
              <div className="flex justify-between border-t pt-3 text-base">
                <dt>Total</dt>
                <dd>{formatPrice(subtotal + shipping)}</dd>
              </div>
            </dl>
            <button
              onClick={() => {
                clearCart();
                setPlaced(true);
                toast("Order placed", { description: "A demo checkout — no payment was taken." });
              }}
              className="mt-8 w-full bg-primary py-4 text-[11px] uppercase tracking-[0.25em] text-primary-foreground transition-opacity hover:opacity-85"
            >
              Checkout
            </button>
            <p className="mt-4 text-center text-[11px] text-muted-foreground">
              Demo checkout — no payment is taken.
            </p>
          </aside>
        </div>
      )}
    </div>
  );
}
