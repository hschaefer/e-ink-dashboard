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

## Run Locally

**Prerequisites:** Node.js

1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`
4. Type-check and build:
   `npm run lint`
   `npm run build`
