export const PRODUCT_SERVICE_TIMES = {
  coffee: 120,
  boba: 180,
  sandwich: 90,
  pastry: 60,
  custom: 120,
} as const;

export type ProductKey = keyof typeof PRODUCT_SERVICE_TIMES;

export const PRODUCTS: { key: ProductKey; label: string; sprite: string }[] = [
  { key: "coffee", label: "Coffee", sprite: "☕" },
  { key: "boba", label: "Boba", sprite: "🧋" },
  { key: "sandwich", label: "Sandwich", sprite: "🥪" },
  { key: "pastry", label: "Pastry", sprite: "🥐" },
  { key: "custom", label: "Custom", sprite: "❓" },
];

export type BusyLevel = "chill" | "warming-up" | "busy" | "packed";

export function busyLevel(count: number): BusyLevel {
  if (count <= 2) return "chill";
  if (count <= 5) return "warming-up";
  if (count <= 9) return "busy";
  return "packed";
}

export function formatWait(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  if (m === 0) return `${s}s`;
  if (s === 0) return `${m}m`;
  return `${m}m ${s}s`;
}

export type AnalyzeResult = {
  people_count: number;
  product: ProductKey;
  service_time_seconds: number;
  estimated_wait_seconds: number;
  busy_level: BusyLevel;
  confidence: "low" | "medium" | "high";
  summary: string;
};
