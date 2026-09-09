import { Link } from "@tanstack/react-router";
import { categories } from "@/lib/catalog";

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t bg-primary text-primary-foreground">
      <div className="mx-auto grid max-w-[1600px] gap-12 px-5 py-16 md:grid-cols-4 md:px-10">
        <div>
          <p className="font-display text-3xl tracking-[0.35em]">VÉRA</p>
          <p className="mt-4 max-w-xs text-sm opacity-70">
            Define your style. An AI fashion studio for considered, monochrome wardrobes.
          </p>
        </div>
        <div>
          <p className="eyebrow opacity-70">Shop</p>
          <ul className="mt-4 space-y-2 text-sm">
            {categories.slice(0, 5).map((c) => (
              <li key={c.slug}>
                <Link to="/collections/$category" params={{ category: c.slug }} className="opacity-80 hover:opacity-100">
                  {c.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="eyebrow opacity-70">Studio</p>
          <ul className="mt-4 space-y-2 text-sm">
            <li>
              <Link to="/collections/$category" params={{ category: "new-arrivals" }} className="opacity-80 hover:opacity-100">
                New Arrivals
              </Link>
            </li>
            <li>
              <Link to="/collections/$category" params={{ category: "sale" }} className="opacity-80 hover:opacity-100">
                Sale
              </Link>
            </li>
            <li>
              <Link to="/wishlist" className="opacity-80 hover:opacity-100">
                Wishlist
              </Link>
            </li>
            <li>
              <Link to="/auth" className="opacity-80 hover:opacity-100">
                Account
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <p className="eyebrow opacity-70">Newsletter</p>
          <p className="mt-4 text-sm opacity-70">Seasonal editorials, first access to drops.</p>
          <form
            className="mt-4 flex border-b border-primary-foreground/40"
            onSubmit={(e) => e.preventDefault()}
          >
            <input
              type="email"
              required
              placeholder="Email address"
              className="w-full bg-transparent py-2 text-sm outline-none placeholder:text-primary-foreground/50"
            />
            <button className="text-xs uppercase tracking-[0.2em]">Join</button>
          </form>
        </div>
      </div>
      <div className="border-t border-primary-foreground/15 px-5 py-6 text-center text-[11px] uppercase tracking-[0.25em] opacity-60 md:px-10">
        © {new Date().getFullYear()} VÉRA — AI Fashion Studio
      </div>
    </footer>
  );
}
