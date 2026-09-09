import { Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Heart, Menu, Search, ShoppingBag, User, X } from "lucide-react";
import { collections } from "@/lib/catalog";
import { useStore } from "@/lib/store";
import { useAuth } from "@/hooks/useAuth";

export function SiteHeader() {
  const { cartCount, wishlist } = useStore();
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [term, setTerm] = useState("");
  const [searching, setSearching] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!term.trim()) return;
    setSearching(false);
    setOpen(false);
    navigate({ to: "/search", search: { q: term.trim() } });
  };

  return (
    <header
      className={`sticky top-0 z-50 border-b bg-background/90 backdrop-blur-md transition-all ${
        scrolled ? "py-2" : "py-4"
      }`}
    >
      <div className="mx-auto flex max-w-[1600px] items-center gap-6 px-5 md:px-10">
        <button
          className="md:hidden"
          aria-label="Open menu"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>

        <Link to="/" className="font-display text-2xl tracking-[0.35em] leading-none">
          VÉRA
        </Link>

        <nav className="hidden flex-1 justify-center gap-6 md:flex">
          {collections.map((c) => (
            <Link
              key={c.slug}
              to="/collections/$category"
              params={{ category: c.slug }}
              className="link-underline text-[11px] uppercase tracking-[0.2em] text-muted-foreground transition-colors hover:text-foreground"
            >
              {c.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-4 md:ml-0">
          <button aria-label="Search" onClick={() => setSearching((v) => !v)}>
            <Search className="size-[18px]" />
          </button>
          <Link to="/wishlist" aria-label="Wishlist" className="relative">
            <Heart className="size-[18px]" />
            {wishlist.length > 0 && (
              <span className="absolute -right-2 -top-2 text-[10px] tabular-nums">{wishlist.length}</span>
            )}
          </Link>
          <Link to="/auth" aria-label="Account" className="hidden sm:block">
            <User className={`size-[18px] ${user ? "opacity-100" : "opacity-60"}`} />
          </Link>
          <Link to="/cart" aria-label="Cart" className="relative">
            <ShoppingBag className="size-[18px]" />
            {cartCount > 0 && (
              <span className="absolute -right-2 -top-2 text-[10px] tabular-nums">{cartCount}</span>
            )}
          </Link>
        </div>
      </div>

      {searching && (
        <form onSubmit={submit} className="mx-auto max-w-[1600px] px-5 pt-4 md:px-10">
          <input
            autoFocus
            value={term}
            onChange={(e) => setTerm(e.target.value)}
            placeholder="Search the studio — coats, silk, boots…"
            className="w-full border-b bg-transparent pb-3 text-lg outline-none placeholder:text-muted-foreground"
          />
        </form>
      )}

      {open && (
        <nav className="grid gap-3 px-5 pt-5 md:hidden">
          {collections.map((c) => (
            <Link
              key={c.slug}
              to="/collections/$category"
              params={{ category: c.slug }}
              onClick={() => setOpen(false)}
              className="text-sm uppercase tracking-[0.22em]"
            >
              {c.label}
            </Link>
          ))}
          <Link to="/auth" onClick={() => setOpen(false)} className="text-sm uppercase tracking-[0.22em]">
            Account
          </Link>
        </nav>
      )}
    </header>
  );
}
