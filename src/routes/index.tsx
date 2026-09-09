import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import heroImg from "@/assets/hero.jpg";
import editorial1 from "@/assets/editorial-1.jpg";
import editorial2 from "@/assets/editorial-2.jpg";
import { categories, categoryImages } from "@/lib/catalog";
import { newArrivalsQuery, trendingQuery } from "@/lib/queries";
import { ProductCard, ProductGridSkeleton } from "@/components/ProductCard";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "VÉRA — AI Fashion Studio | Define Your Style" },
      {
        name: "description",
        content:
          "VÉRA is a monochrome fashion studio: 560 editorial pieces across ten collections, curated with AI styling, outfit building and a personal wishlist.",
      },
      { property: "og:title", content: "VÉRA — AI Fashion Studio" },
      {
        property: "og:description",
        content: "Define your style. Editorial monochrome fashion, curated by VÉRA.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Home,
});

const editorialEdits = [
  { title: "The Minimal Edit", collection: "tops" },
  { title: "The Evening Edit", collection: "dresses" },
  { title: "Everyday Luxury", collection: "women" },
  { title: "Weekend Style", collection: "men" },
];

function Home() {
  const newArrivals = useQuery(newArrivalsQuery(8));
  const trending = useQuery(trendingQuery(8));

  return (
    <>
      {/* HERO */}
      <section className="relative flex min-h-[92vh] items-end overflow-hidden">
        <img
          src={heroImg}
          alt="Model in a floor-length black wool coat, photographed in monochrome"
          width={1536}
          height={1024}
          className="absolute inset-0 size-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-black/40" />
        <div className="relative mx-auto w-full max-w-[1600px] px-5 pb-16 text-white md:px-10 md:pb-24">
          <p className="eyebrow reveal text-white/70">VÉRA — AI Fashion Studio</p>
          <h1 className="display-xl reveal mt-6" style={{ animationDelay: "120ms" }}>
            DEFINE
            <br />
            YOUR
            <br />
            STYLE.
          </h1>
          <p className="reveal mt-8 max-w-md text-sm text-white/75" style={{ animationDelay: "260ms" }}>
            Discover pieces that feel uniquely you.
          </p>
          <div className="reveal mt-10 flex flex-wrap gap-4" style={{ animationDelay: "360ms" }}>
            <Link
              to="/collections/$category"
              params={{ category: "new-arrivals" }}
              className="border border-white bg-white px-8 py-4 text-[11px] uppercase tracking-[0.25em] text-black transition-colors hover:bg-transparent hover:text-white"
            >
              Explore Collection
            </Link>
            <Link
              to="/stylist"
              className="border border-white/70 px-8 py-4 text-[11px] uppercase tracking-[0.25em] transition-colors hover:bg-white hover:text-black"
            >
              Meet Your AI Stylist
            </Link>
          </div>
          <p className="mt-14 flex items-center gap-3 text-[10px] uppercase tracking-[0.3em] text-white/60">
            Scroll to discover <ArrowDown className="size-3 animate-bounce" />
          </p>
        </div>
      </section>

      {/* NEW ARRIVALS */}
      <Section
        eyebrow="New Arrivals"
        title="The latest pieces curated by VÉRA."
        href="new-arrivals"
      >
        {newArrivals.isPending ? <ProductGridSkeleton /> : null}
        {newArrivals.data && (
          <div className="grid grid-cols-2 gap-x-4 gap-y-12 md:grid-cols-4">
            {newArrivals.data.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </Section>

      {/* CATEGORIES */}
      <section className="mx-auto max-w-[1600px] px-5 py-16 md:px-10">
        <p className="eyebrow">Shop by category</p>
        <div className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-4">
          {categories.map((c) => (
            <Link
              key={c.slug}
              to="/collections/$category"
              params={{ category: c.slug }}
              className="group relative aspect-[3/4] overflow-hidden bg-muted"
            >
              <img
                src={categoryImages[c.slug]}
                alt={c.label}
                loading="lazy"
                className="absolute inset-0 size-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black/25 transition-colors group-hover:bg-black/45" />
              <div className="absolute inset-x-0 bottom-0 flex items-center justify-between p-5 text-white">
                <span className="font-display text-2xl tracking-wide">{c.label}</span>
                <ArrowUpRight className="size-4 transition-transform duration-500 group-hover:translate-x-1 group-hover:-translate-y-1" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* TRENDING */}
      <Section eyebrow="Trending Now" title="Most viewed, most saved, most worn." href="women">
        {trending.isPending ? <ProductGridSkeleton /> : null}
        {trending.data && (
          <div className="grid grid-cols-2 gap-x-4 gap-y-12 md:grid-cols-4">
            {trending.data.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </Section>

      {/* AI STYLIST + CAMERA */}
      <section className="mx-auto grid max-w-[1600px] gap-3 px-5 py-16 md:grid-cols-2 md:px-10">
        <div className="relative flex min-h-[420px] flex-col justify-end overflow-hidden bg-primary p-8 text-primary-foreground md:p-12">
          <p className="eyebrow text-primary-foreground/60">AI Stylist</p>
          <h2 className="display-lg mt-4">
            YOUR STYLE.
            <br />
            CURATED BY VÉRA.
          </h2>
          <p className="mt-5 max-w-sm text-sm opacity-70">
            Tell VÉRA what you're looking for and discover a look curated around your style,
            occasion and budget.
          </p>
          <Link
            to="/stylist"
            className="mt-8 w-fit border border-primary-foreground px-8 py-4 text-[11px] uppercase tracking-[0.25em] transition-colors hover:bg-primary-foreground hover:text-primary"
          >
            Start AI Stylist
          </Link>
        </div>
        <div className="relative flex min-h-[420px] flex-col justify-end overflow-hidden p-8 text-white md:p-12">
          <img
            src={editorial2}
            alt="Close-up of draped black fabric"
            loading="lazy"
            className="absolute inset-0 size-full object-cover"
          />
          <div className="absolute inset-0 bg-black/45" />
          <div className="relative">
            <p className="eyebrow text-white/60">Style Camera</p>
            <h2 className="display-lg mt-4">STYLE WITH YOUR PHOTO.</h2>
            <p className="mt-5 max-w-sm text-sm text-white/70">
              Upload a photo or use your camera to explore personalized recommendations.
            </p>
            <Link
              to="/stylist"
              className="mt-8 inline-block border border-white px-8 py-4 text-[11px] uppercase tracking-[0.25em] transition-colors hover:bg-white hover:text-black"
            >
              Open Style Camera
            </Link>
          </div>
        </div>
      </section>

      {/* EDITORIAL EDITS */}
      <section className="mx-auto max-w-[1600px] px-5 py-16 md:px-10">
        <p className="eyebrow">The Edits</p>
        <div className="mt-8 grid gap-3 md:grid-cols-4">
          {editorialEdits.map((e) => (
            <Link
              key={e.title}
              to="/collections/$category"
              params={{ category: e.collection }}
              className="group border p-8 transition-colors hover:bg-primary hover:text-primary-foreground"
            >
              <p className="font-display text-3xl leading-tight">{e.title}</p>
              <p className="mt-10 text-[11px] uppercase tracking-[0.25em] opacity-60">Explore →</p>
            </Link>
          ))}
        </div>
      </section>

      {/* EDITORIAL BANNER */}
      <section className="relative mx-auto max-w-[1600px] px-5 md:px-10">
        <div className="relative aspect-[16/9] overflow-hidden">
          <img
            src={editorial1}
            alt="Two models walking in monochrome tailoring"
            loading="lazy"
            className="absolute inset-0 size-full object-cover"
          />
          <div className="absolute inset-0 bg-black/30" />
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white">
            <p className="eyebrow text-white/70">New Season</p>
            <h2 className="display-lg mt-4 max-w-2xl px-6">A wardrobe reduced to what matters.</h2>
          </div>
        </div>
      </section>

      {/* REVIEWS */}
      <section className="mx-auto max-w-[1600px] px-5 py-20 md:px-10">
        <p className="eyebrow">Customer Reviews</p>
        <div className="mt-8 grid gap-3 md:grid-cols-3">
          {[
            {
              name: "Ananya R.",
              product: "Sculpted Wrap Coat",
              text: "The cut is extraordinary. It reads expensive without saying anything at all.",
            },
            {
              name: "Devan M.",
              product: "Structured Wool Blazer",
              text: "Third piece from VÉRA. The fabric quality is consistently better than the price.",
            },
            {
              name: "Meera S.",
              product: "Bias-Cut Slip Dress",
              text: "Wore it to a wedding and to work in the same week. That is the whole point.",
            },
          ].map((r) => (
            <figure key={r.name} className="border p-8">
              <p className="text-[11px] tracking-[0.3em]">★★★★★</p>
              <blockquote className="mt-5 font-display text-2xl leading-snug">"{r.text}"</blockquote>
              <figcaption className="mt-6 text-xs uppercase tracking-[0.2em] text-muted-foreground">
                {r.name} — {r.product}
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      {/* GALLERY */}
      <section className="mx-auto max-w-[1600px] px-5 pb-8 md:px-10">
        <p className="eyebrow">@veraStudio</p>
        <div className="mt-8 grid grid-cols-2 gap-1 md:grid-cols-4">
          {[...categories].slice(0, 8).map((c) => (
            <div key={c.slug} className="group relative aspect-square overflow-hidden">
              <img
                src={categoryImages[c.slug]}
                alt={`VÉRA ${c.label} editorial`}
                loading="lazy"
                className="absolute inset-0 size-full object-cover transition-transform duration-[1200ms] group-hover:scale-110"
              />
              <div className="absolute inset-0 grid place-items-center bg-black/0 text-white opacity-0 transition-all duration-500 group-hover:bg-black/40 group-hover:opacity-100">
                <span className="font-display text-xl tracking-[0.35em]">VÉRA</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}

function Section({
  eyebrow,
  title,
  href,
  children,
}: {
  eyebrow: string;
  title: string;
  href: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mx-auto max-w-[1600px] px-5 py-16 md:px-10">
      <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow">{eyebrow}</p>
          <h2 className="display-lg mt-3 max-w-xl">{title}</h2>
        </div>
        <Link
          to="/collections/$category"
          params={{ category: href }}
          className="link-underline text-[11px] uppercase tracking-[0.25em]"
        >
          View all
        </Link>
      </div>
      {children}
    </section>
  );
}
