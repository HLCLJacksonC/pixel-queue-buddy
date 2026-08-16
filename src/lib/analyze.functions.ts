import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import {
  PRODUCT_SERVICE_TIMES,
  busyLevel,
  type AnalyzeResult,
  type ProductKey,
} from "./queue";

const schema = z.object({
  imageDataUrl: z.string().min(32),
  product: z.enum(["coffee", "boba", "sandwich", "pastry", "custom"]),
  customLabel: z.string().max(40).optional(),
});

export const analyzeQueue = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => schema.parse(data))
  .handler(async ({ data }): Promise<AnalyzeResult> => {
    const apiKey = process.env["LOVABLE_API_KEY"];
    const base = process.env["AGW_URL"] ?? "https://ai.gateway.lovable.dev";
    if (!apiKey) throw new Error("AI is not configured for this project.");

    const productLabel =
      data.product === "custom" ? data.customLabel?.trim() || "something tasty" : data.product;

    const res = await fetch(`${base.replace(/\/$/, "")}/v1/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Lovable-API-Key": apiKey,
      },
      body: JSON.stringify({
        model: "google/gemini-3.6-flash",
        messages: [
          {
            role: "system",
            content:
              "You are a computer-vision queue analyst. Count only people who appear to be waiting in line (queueing) in the photo. Reply with strict JSON only.",
          },
          {
            role: "user",
            content: [
              {
                type: "text",
                text: `Analyze this cafe photo. People are queueing for: ${productLabel}.
Return JSON exactly like:
{"people_count": <integer>, "confidence": "low"|"medium"|"high", "summary": "<one cute sentence, max 18 words>"}
If nobody is queueing, people_count is 0.`,
              },
              { type: "image_url", image_url: { url: data.imageDataUrl } },
            ],
          },
        ],
      }),
    });

    if (!res.ok) {
      const body = await res.text();
      throw new Error(`Vision request failed (${res.status}): ${body.slice(0, 300)}`);
    }

    const json = (await res.json()) as {
      choices?: { message?: { content?: string } }[];
    };
    const raw = json.choices?.[0]?.message?.content ?? "";
    const match = raw.match(/\{[\s\S]*\}/);
    if (!match) throw new Error("Could not read the vision response.");
    const parsed = JSON.parse(match[0]) as {
      people_count?: number;
      confidence?: string;
      summary?: string;
    };

    const count = Math.max(0, Math.round(Number(parsed.people_count ?? 0)) || 0);
    const product = data.product as ProductKey;
    const serviceTime = PRODUCT_SERVICE_TIMES[product];

    return {
      people_count: count,
      product,
      service_time_seconds: serviceTime,
      estimated_wait_seconds: count * serviceTime,
      busy_level: busyLevel(count),
      confidence:
        parsed.confidence === "high" || parsed.confidence === "low"
          ? parsed.confidence
          : "medium",
      summary: parsed.summary?.slice(0, 160) || "The line looks manageable right now.",
    };
  });
