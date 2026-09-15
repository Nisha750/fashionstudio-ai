import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useRef, useState } from "react";
import { Camera, Loader2, Upload } from "lucide-react";
import { toast } from "sonner";
import { getStylistLook, type StylistResult } from "@/lib/stylist.functions";
import { collectionQuery } from "@/lib/queries";
import { ProductCard, ProductGridSkeleton } from "@/components/ProductCard";
import { categoryLabel } from "@/lib/catalog";
import { useQueries } from "@tanstack/react-query";

export const Route = createFileRoute("/stylist")({
  head: () => ({
    meta: [
      { title: "AI Stylist — VÉRA | Curated Looks For Any Occasion" },
      {
        name: "description",
        content:
          "Describe an occasion, style and budget, or add a photo, and the VÉRA AI stylist curates a monochrome look from the studio catalogue.",
      },
      { property: "og:title", content: "AI Stylist — VÉRA" },
      { property: "og:description", content: "Your style, curated by VÉRA." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: StylistPage,
});

function StylistPage() {
  const [brief, setBrief] = useState("");
  const [budget, setBudget] = useState("");
  const [photo, setPhoto] = useState<string | null>(null);
  const [result, setResult] = useState<StylistResult | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const cameraRef = useRef<HTMLInputElement>(null);
  const callStylist = useServerFn(getStylistLook);

  const mutation = useMutation({
    mutationFn: (input: { brief: string; budget: number | null }) => callStylist({ data: input }),
    onSuccess: setResult,
    onError: (e: Error) => toast("Stylist unavailable", { description: e.message }),
  });

  const looks = useQueries({
    queries: (result?.categories ?? []).map((c) =>
      collectionQuery({ collection: c, sort: "rating", maxPrice: result?.maxPrice ?? null }),
    ),
  });

  const onFile = (file: File | undefined) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setPhoto(String(reader.result));
    reader.readAsDataURL(file);
  };

  return (
    <div className="mx-auto max-w-[1600px] px-5 py-12 md:px-10">
      <p className="eyebrow">AI Stylist</p>
      <h1 className="display-lg mt-3 max-w-2xl">
        YOUR STYLE.
        <br />
        CURATED BY VÉRA.
      </h1>

      <div className="mt-12 grid gap-10 lg:grid-cols-[420px_1fr]">
        <form
          className="h-fit border p-8"
          onSubmit={(e) => {
            e.preventDefault();
            if (brief.trim().length < 3) {
              toast("Tell VÉRA a little more about the look.");
              return;
            }
            mutation.mutate({ brief: brief.trim(), budget: budget ? Number(budget) : null });
          }}
        >
          <label className="eyebrow" htmlFor="brief">
            What are you looking for?
          </label>
          <textarea
            id="brief"
            value={brief}
            onChange={(e) => setBrief(e.target.value)}
            rows={4}
            placeholder="An evening wedding in Mumbai, minimal and sharp, nothing shiny."
            className="mt-3 w-full border-b bg-transparent pb-3 text-sm outline-none placeholder:text-muted-foreground"
          />

          <label className="eyebrow mt-8 block" htmlFor="budget">
            Budget per piece (₹)
          </label>
          <input
            id="budget"
            type="number"
            min={500}
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
            placeholder="4000"
            className="mt-3 w-full border-b bg-transparent pb-3 text-sm outline-none placeholder:text-muted-foreground"
          />

          <p className="eyebrow mt-8">Style camera</p>
          <div className="mt-3 flex gap-3">
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="flex flex-1 items-center justify-center gap-2 border py-3 text-[11px] uppercase tracking-[0.2em] hover:bg-accent"
            >
              <Upload className="size-4" /> Upload
            </button>
            <button
              type="button"
              onClick={() => cameraRef.current?.click()}
              className="flex flex-1 items-center justify-center gap-2 border py-3 text-[11px] uppercase tracking-[0.2em] hover:bg-accent"
            >
              <Camera className="size-4" /> Camera
            </button>
          </div>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            hidden
            onChange={(e) => onFile(e.target.files?.[0])}
          />
          <input
            ref={cameraRef}
            type="file"
            accept="image/*"
            capture="environment"
            hidden
            onChange={(e) => onFile(e.target.files?.[0])}
          />
          {photo && (
            <div className="mt-4 flex items-center gap-4">
              <img src={photo} alt="Your uploaded style reference" className="h-24 w-20 object-cover" />
              <button type="button" className="text-[11px] uppercase tracking-[0.2em] underline" onClick={() => setPhoto(null)}>
                Remove
              </button>
            </div>
          )}

          <button
            type="submit"
            disabled={mutation.isPending}
            className="mt-10 flex w-full items-center justify-center gap-2 bg-primary py-4 text-[11px] uppercase tracking-[0.25em] text-primary-foreground disabled:opacity-60"
          >
            {mutation.isPending && <Loader2 className="size-4 animate-spin" />}
            {mutation.isPending ? "Curating" : "Curate my look"}
          </button>
        </form>

        <div>
          {!result && !mutation.isPending && (
            <p className="max-w-md text-sm text-muted-foreground">
              Tell VÉRA the occasion, the mood and the budget. Your curated look appears here — pulled
              live from the studio catalogue.
            </p>
          )}
          {mutation.isPending && <ProductGridSkeleton count={8} />}

          {result && (
            <>
              <p className="font-display text-3xl leading-snug">{result.note}</p>
              <div className="mt-12 space-y-16">
                {result.categories.map((c, i) => (
                  <section key={c}>
                    <p className="eyebrow">{categoryLabel(c)}</p>
                    <div className="mt-6 grid grid-cols-2 gap-x-4 gap-y-12 md:grid-cols-4">
                      {(looks[i]?.data ?? []).slice(0, 4).map((p) => (
                        <ProductCard key={p.id} product={p} />
                      ))}
                    </div>
                  </section>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
