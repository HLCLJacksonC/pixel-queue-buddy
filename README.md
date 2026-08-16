# PixelQueue

A tiny pixel-art app that estimates café queue length and wait time from a photo.

![PixelQueue preview](https://id-preview--cf62dda9-c239-4cd1-87a6-b9294e6bdab6.lovable.app)

## What it does

1. Upload a photo of a café line.
2. Pick what people are queueing for (coffee, boba, sandwich, pastry, or a custom item).
3. The app counts the people in line and estimates the wait based on typical service time.
4. You get a cute pixel-art queue report with a vibe check.

## Tech stack

- **Framework:** [TanStack Start](https://tanstack.com/start) (React + full-stack TypeScript)
- **Styling:** Tailwind CSS with a custom pixel-art theme
- **AI / computer vision:** [Lovable AI Gateway](https://docs.lovable.dev/features/cloud) — `google/gemini-3.6-flash` vision model
- **Fonts:** Press Start 2P, VT323

## How the image recognition works

When you click **Analyze Queue**, the browser sends the uploaded image (as a base64 data URL) to a TanStack Start server function at `src/lib/analyze.functions.ts`. That function calls the Lovable AI Gateway chat/completions endpoint with a vision prompt:

- System prompt: "You are a computer-vision queue analyst. Count only people who appear to be waiting in line."
- User message: the photo + instructions to return strict JSON with `people_count`, `confidence`, and `summary`.

The server function parses the JSON, calculates the estimated wait (`people_count × service_time_seconds`), and returns the report to the UI.

## Can the backend be changed?

Yes, but with one important constraint: this project is built for an edge/serverless runtime (Cloudflare Workers). That means you **cannot** run a traditional Python/FastAPI server or load local ML models like YOLO directly inside the app.

Realistic alternatives:

- **Keep the current approach** — vision model via Lovable AI Gateway (no setup, pay-per-use).
- **Call an external Python API** — host a FastAPI + OpenCV/YOLO service elsewhere and have the TanStack server function call it over HTTP.
- **Use a managed vision API** — e.g. Google Vision, Azure AI Vision, AWS Rekognition, etc.
- **Switch to a different gateway model** — any model supported by Lovable AI Gateway can be swapped in.

## Development

```sh
bun install
bun run dev
```

Open [http://localhost:8080](http://localhost:8080).

## Project structure

```text
src/
  lib/
    queue.ts              # product types, service times, wait formatting
    analyze.functions.ts  # server function that calls the vision model
  routes/
    index.tsx             # main PixelQueue UI
  components/
    PixelPerson.tsx       # procedural pixel-art person sprite
    PixelQueueStrip.tsx   # pixel queue visualization
  styles.css              # pixel-art design tokens & utilities
```

## Notes

- The original product spec mentioned a Python/FastAPI backend with YOLO person detection. That was adapted to fit this edge-first stack.
- Detection accuracy depends on the photo quality, angle, and how clearly people are separated in line.
