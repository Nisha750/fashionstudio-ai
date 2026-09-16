import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { categories } from "@/lib/catalog";
import { supabase } from "@/integrations/supabase/client";

function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);

  return (
    <form
      className="mt-4 flex border-b border-primary-foreground/40"
      onSubmit={async (e) => {
        e.preventDefault();
        setBusy(true);
        const { error } = await supabase.from("newsletter_subscribers").insert({ email });
        setBusy(false);
        if (error) {
          toast(
            error.code === "23505" ? "You're already on the list." : "Could not subscribe",
            error.code === "23505" ? undefined : { description: error.message },
          );
          return;
        }
        setEmail("");
        toast("You're on the list.", { description: "Editorials and early access, nothing else." });
      }}
    >
      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email address"
        aria-label="Email address"
        className="w-full bg-transparent py-2 text-sm outline-none placeholder:text-primary-foreground/50"
      />
      <button disabled={busy} className="text-xs uppercase tracking-[0.2em] disabled:opacity-50">
        Join
      </button>
    </form>
  );
}


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
          <NewsletterForm />
        </div>
      </div>
      <div className="border-t border-primary-foreground/15 px-5 py-6 text-center text-[11px] uppercase tracking-[0.25em] opacity-60 md:px-10">
        © {new Date().getFullYear()} VÉRA — AI Fashion Studio
      </div>
    </footer>
  );
}
