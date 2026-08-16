import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useMutation } from "@tanstack/react-query";
import { useRef, useState } from "react";
import { Upload, Loader2, ScanEye } from "lucide-react";

import { analyzeQueue } from "@/lib/analyze.functions";
import { PixelQueueStrip } from "@/components/PixelQueueStrip";
import {
  PRODUCTS,
  PRODUCT_SERVICE_TIMES,
  formatWait,
  type AnalyzeResult,
  type ProductKey,
} from "@/lib/queue";

export const Route = createFileRoute("/")({
  component: PixelQueuePage,
});

const BUSY_LABEL: Record<AnalyzeResult["busy_level"], string> = {
  chill: "CHILL",
  "warming-up": "WARMING UP",
  busy: "BUSY",
  packed: "PACKED",
};

function PixelQueuePage() {
  const [imageDataUrl, setImageDataUrl] = useState<string | null>(null);
  const [product, setProduct] = useState<ProductKey>("coffee");
  const [customLabel, setCustomLabel] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const analyze = useServerFn(analyzeQueue);
  const mutation = useMutation({
    mutationFn: (vars: { imageDataUrl: string; product: ProductKey; customLabel?: string }) =>
      analyze({ data: vars }),
  });
  const result = mutation.data;

  function onFile(file: File | undefined) {
    if (!file) return;
    mutation.reset();
    const reader = new FileReader();
    reader.onload = () => setImageDataUrl(String(reader.result));
    reader.readAsDataURL(file);
  }

  return (
    <main className="mx-auto max-w-5xl px-4 py-10">
      <header className="text-center">
        <h1 className="font-pixel text-2xl text-primary sm:text-4xl">PixelQueue</h1>
        <p className="mt-4 text-muted-foreground">
          Snap the line, get the wait. Computer vision meets 8-bit café life.
        </p>
      </header>

      <section className="pixel-panel mt-10 p-5">
        <h2 className="font-pixel text-[11px] text-accent">1 · UPLOAD THE LINE</h2>

        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          className="pixel-inset mt-4 flex w-full flex-col items-center gap-3 p-8 text-center"
        >
          {imageDataUrl ? (
            <img
              src={imageDataUrl}
              alt="Uploaded café queue photo"
              className="max-h-64 border-4 border-border"
            />
          ) : (
            <>
              <Upload className="size-8 text-primary" />
              <span className="font-pixel text-[10px] text-muted-foreground">
                CLICK TO PICK A QUEUE PHOTO
              </span>
            </>
          )}
        </button>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          className="sr-only"
          onChange={(e) => onFile(e.target.files?.[0])}
        />

        <h2 className="font-pixel mt-8 text-[11px] text-accent">2 · WHAT'S THE LINE FOR?</h2>
        <div className="mt-4 flex flex-wrap gap-3">
          {PRODUCTS.map((p) => {
            const active = p.key === product;
            return (
              <button
                key={p.key}
                type="button"
                onClick={() => setProduct(p.key)}
                className={`pixel-press font-pixel border-4 border-border px-3 py-2 text-[10px] active:pixel-press-active ${
                  active
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:bg-sidebar-accent"
                }`}
              >
                <span className="mr-2 text-base">{p.sprite}</span>
                {p.label.toUpperCase()}
                <span className="ml-2 opacity-70">{PRODUCT_SERVICE_TIMES[p.key]}s</span>
              </button>
            );
          })}
        </div>

        {product === "custom" && (
          <input
            value={customLabel}
            onChange={(e) => setCustomLabel(e.target.value)}
            placeholder="what are they waiting for?"
            maxLength={40}
            className="pixel-inset mt-4 w-full px-3 py-2 text-foreground outline-none focus:border-ring"
          />
        )}

        <button
          type="button"
          disabled={!imageDataUrl || mutation.isPending}
          onClick={() =>
            imageDataUrl &&
            mutation.mutate({
              imageDataUrl,
              product,
              customLabel: customLabel || undefined,
            })
          }
          className="pixel-press font-pixel mt-8 flex w-full items-center justify-center gap-3 border-4 border-border bg-secondary px-4 py-4 text-[12px] text-secondary-foreground active:pixel-press-active disabled:opacity-50"
        >
          {mutation.isPending ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <ScanEye className="size-4" />
          )}
          {mutation.isPending ? "SCANNING PIXELS..." : "ANALYZE QUEUE"}
        </button>

        {mutation.isError && (
          <p className="font-pixel mt-4 text-[10px] text-destructive">
            {(mutation.error as Error).message}
          </p>
        )}
      </section>

      {result && (
        <section className="pixel-panel mt-8 p-5">
          <h2 className="font-pixel text-[11px] text-accent">3 · QUEUE REPORT</h2>

          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            <Stat label="PEOPLE" value={String(result.people_count)} />
            <Stat label="EST. WAIT" value={formatWait(result.estimated_wait_seconds)} />
            <Stat label="VIBE" value={BUSY_LABEL[result.busy_level]} />
          </div>

          <p className="mt-5 text-muted-foreground">
            <span className="animate-pixel-blink text-primary">▮</span> {result.summary}
          </p>
          <p className="font-pixel mt-2 text-[9px] text-muted-foreground">
            {result.service_time_seconds}s PER ORDER · CONFIDENCE {result.confidence.toUpperCase()}
          </p>

          <div className="mt-6">
            <PixelQueueStrip count={result.people_count} product={result.product} />
          </div>
        </section>
      )}

      <footer className="font-pixel mt-10 text-center text-[9px] text-muted-foreground">
        MADE FOR HACK NIGHT · PIXELQUEUE V1
      </footer>
    </main>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="pixel-inset p-4 text-center">
      <p className="font-pixel text-[9px] text-muted-foreground">{label}</p>
      <p className="font-pixel mt-3 text-lg text-primary">{value}</p>
    </div>
  );
}
