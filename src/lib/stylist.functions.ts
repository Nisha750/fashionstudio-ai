import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const schema = z.object({
  brief: z.string().min(3).max(600),
  budget: z.number().int().positive().max(100000).nullable().optional(),
});

const CATEGORIES = [
  "women",
  "men",
  "dresses",
  "tops",
  "bottoms",
  "outerwear",
  "shoes",
  "accessories",
] as const;

export type StylistResult = {
  note: string;
  categories: string[];
  maxPrice: number | null;
};

export const getStylistLook = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => schema.parse(data))
  .handler(async ({ data }): Promise<StylistResult> => {
    const key = process.env["LOVABLE_API_KEY"];
    if (!key) throw new Error("AI is not configured");

    const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "google/gemini-3.8-flash",
        messages: [
          {
            role: "system",
            content:
              "You are VÉRA, a minimal monochrome fashion stylist. Reply ONLY with compact JSON: " +
              '{"note": string (max 220 chars, elegant, second person), "categories": string[] (2-4 values from ' +
              CATEGORIES.join(", ") +
              '), "maxPrice": number|null (INR budget per piece)}.',
          },
          {
            role: "user",
            content: `Brief: ${data.brief}. Budget per piece: ${data.budget ? `INR ${data.budget}` : "no limit"}.`,
          },
        ],
      }),
    });

    if (res.status === 429) throw new Error("The stylist is busy right now. Try again in a moment.");
    if (res.status === 402) throw new Error("AI credits are exhausted for this workspace.");
    if (!res.ok) throw new Error(`Stylist unavailable (${res.status})`);

    const json = (await res.json()) as { choices?: { message?: { content?: string } }[] };
    const raw = json.choices?.[0]?.message?.content ?? "";
    const match = raw.match(/\{[\s\S]*\}/);

    let parsed: Partial<StylistResult> = {};
    try {
      parsed = match ? (JSON.parse(match[0]) as Partial<StylistResult>) : {};
    } catch {
      parsed = {};
    }

    const categories = (parsed.categories ?? [])
      .map((c) => String(c).toLowerCase().trim())
      .filter((c): c is string => (CATEGORIES as readonly string[]).includes(c));

    return {
      note: parsed.note?.slice(0, 300) ?? "A quiet, monochrome edit built around your brief.",
      categories: categories.length ? categories.slice(0, 4) : ["women", "outerwear"],
      maxPrice: typeof parsed.maxPrice === "number" ? parsed.maxPrice : (data.budget ?? null),
    };
  });
