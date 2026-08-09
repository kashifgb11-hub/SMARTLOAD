# SmartLoad Frontend

React + Vite frontend for SmartLoad — a tool that predicts building heating and cooling energy demand from early-stage architectural design parameters. Talks to the SmartLoad FastAPI backend.

## Prerequisites

- Node.js 18+
- The SmartLoad backend running on `http://localhost:8000` (`uvicorn main:app --reload --port 8000` from the backend project)

## Setup

```bash
npm install
```

## Run

```bash
npm run dev
```

Opens on `http://localhost:5173`.

## Sections

A single scrolling page — the navbar smooth-scrolls between sections rather than navigating routes.

- **Home** — hero landing section with stats and CTA buttons.
- **Energy Predictor** — adjust building parameters with sliders/dropdowns; predictions, SHAP attributions, and plain-language explanations update automatically (debounced) as you type. Mark any parameter "Unknown" to have the backend fall back to its training median.
- **Optimize** — enter a complete design and click "Analyze" to get ranked recommendations for reducing predicted heating load.

## Build

```bash
npm run build
npm run preview
```
