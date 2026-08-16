import { PixelPerson } from "./PixelPerson";
import { PRODUCTS, type ProductKey } from "@/lib/queue";

type Props = { count: number; product: ProductKey };

export function PixelQueueStrip({ count, product }: Props) {
  const sprite = PRODUCTS.find((p) => p.key === product)?.sprite ?? "❓";
  const shown = Math.min(count, 14);
  const overflow = count - shown;

  return (
    <div className="pixel-inset overflow-x-auto p-4">
      <div className="flex min-h-[140px] items-end gap-3">
        <div className="flex flex-col items-center gap-1 pr-2">
          <span className="text-3xl">{sprite}</span>
          <div className="h-16 w-10 border-4 border-border bg-primary" />
          <span className="font-pixel text-[8px] text-muted-foreground">COUNTER</span>
        </div>

        {count === 0 ? (
          <p className="font-pixel pb-6 text-[10px] text-muted-foreground">
            NO ONE WAITING — GO GO GO!
          </p>
        ) : (
          Array.from({ length: shown }).map((_, i) => (
            <div key={i} className="flex flex-col items-center gap-1">
              <PixelPerson seed={i} />
              <span className="font-pixel text-[8px] text-muted-foreground">{i + 1}</span>
            </div>
          ))
        )}

        {overflow > 0 && (
          <span className="font-pixel pb-6 text-[10px] text-secondary">+{overflow} MORE</span>
        )}
      </div>
      <div className="mt-2 h-2 w-full bg-border" />
    </div>
  );
}
