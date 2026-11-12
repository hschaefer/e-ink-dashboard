<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://ai.google.dev/static/site-assets/images/share-ais-513315318.png" />
</div>

# E-Ink Weather Dashboard

A monochrome, 6-contrast-level e-ink weather dashboard built with React, Vite, and Tailwind CSS, with Home Assistant integration and German weather labels.

## Features

- **E-Ink Contrast Palette:** Strictly mapped to six grayscale contrast levels (`#FFFFFF`, `#AAAAAA`, `#666666`, `#444444`, `#222222`, `#000000`) with `light` and `dark` themes.
- **Weather Icons (`weather-icons-react`):** Monochrome meteorological glyphs across current outdoor weather, indoor humidity (`WiRaindrops`), hourly forecast ribbon, and the 5-day forecast list, supporting distinct Home Assistant conditions (`sunny`, `clear-night`, `partly-cloudy`, `partly-cloudy-night`, `cloudy`, `fog`, `rainy`, `pouring`, `showers`, `drizzle`, `stormy`, `lightning`, `hail`, `snowy`, `sleet`, `windy`).
- **Home Assistant & Mock Scenarios:** Connects to Home Assistant weather, indoor climate, sun, air quality, and system status entities via `/api/ha/*`, or falls back to built-in mock scenarios.
- **Display Calibration:** Built-in `/calibration` view for testing grayscale levels, patterns, and typography on e-ink panels.

## Architecture

This repository bundles two services orchestrated via `docker-compose.yml`:

- `dashboard/`: Monochrome, 6-contrast-level e-ink weather dashboard (React, Vite, Express `/api/ha/*` proxy) served on port `3000`.
- `renderer/`: Headless Chromium + Sharp service (`eink-web-renderer`) that captures `http://dashboard:3000` on a cron schedule and serves the processed grayscale PNG on port `8080` for the e-ink display.

## Run with Docker Compose

1. Copy `.env.example` to `.env` and configure your Home Assistant and renderer settings.
2. Build and start both containers:
   `docker compose up -d --build`
3. Access the dashboard preview at `http://localhost:3000` and the rendered PNG at `http://localhost:8080`.

## Run Dashboard Locally

**Prerequisites:** Node.js

1. `cd dashboard && npm install`
2. Configure `../.env` (or `.env` in `dashboard/`)
3. Run the app:
   `npm run dev`
4. Type-check and build:
   `npm run lint`
   `npm run build`
