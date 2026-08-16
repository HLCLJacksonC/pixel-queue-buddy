const SPRITE = [
  "..HHHH..",
  ".HHHHHH.",
  ".HSSSSH.",
  ".SEWWES.",
  ".SSMMSS.",
  "..SSSS..",
  ".BBBBBB.",
  "SBBBBBBS",
  "SBBBBBBS",
  ".BBBBBB.",
  ".PP..PP.",
  ".PP..PP.",
  ".SS..SS.",
];

const PALETTES = [
  { H: "oklch(0.35 0.08 40)", S: "oklch(0.82 0.09 60)", B: "oklch(0.62 0.16 350)" },
  { H: "oklch(0.28 0.03 60)", S: "oklch(0.66 0.09 55)", B: "oklch(0.72 0.15 190)" },
  { H: "oklch(0.75 0.14 85)", S: "oklch(0.88 0.06 70)", B: "oklch(0.75 0.18 140)" },
  { H: "oklch(0.45 0.12 20)", S: "oklch(0.72 0.08 50)", B: "oklch(0.82 0.17 88)" },
];

type Props = { seed: number; scale?: number; bobbing?: boolean };

export function PixelPerson({ seed, scale = 4, bobbing = true }: Props) {
  const palette = PALETTES[seed % PALETTES.length];
  const colors: Record<string, string> = {
    H: palette.H,
    S: palette.S,
    B: palette.B,
    E: "oklch(0.15 0.02 265)",
    W: "oklch(0.98 0.01 95)",
    M: "oklch(0.55 0.14 20)",
    P: "oklch(0.32 0.05 265)",
  };

  return (
    <div
      className={bobbing ? "animate-pixel-bob" : undefined}
      style={{ animationDelay: `${(seed % 5) * 110}ms` }}
      aria-hidden="true"
    >
      <div
        className="grid"
        style={{
          gridTemplateColumns: `repeat(8, ${scale}px)`,
          gridAutoRows: `${scale}px`,
        }}
      >
        {SPRITE.flatMap((row, y) =>
          row.split("").map((cell, x) => (
            <div
              key={`${x}-${y}`}
              style={{ backgroundColor: cell === "." ? "transparent" : colors[cell] }}
            />
          )),
        )}
      </div>
    </div>
  );
}
