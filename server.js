import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Home Assistant Configuration
const HA_URL = (process.env.HA_URL || '').replace(/\/$/, ''); // Remove trailing slash
const HA_TOKEN = process.env.HA_TOKEN || '';

// --- Dynamic Configuration Endpoint ---
// Injects environment variables into the frontend at runtime
app.get('/config.js', (req, res) => {
  const config = {
    THEME: process.env.EINK_THEME || 'light',
    SCENARIO: process.env.EINK_SCENARIO || 'springShowers',
    SHOW_CONTROLS: process.env.EINK_SHOW_CONTROLS || 'true',
    // We only expose non-sensitive entity configuration to the frontend
    HA_ENTITY_WEATHER: process.env.HA_ENTITY_WEATHER || '',
    HA_ENTITY_INDOOR_TEMP: process.env.HA_ENTITY_INDOOR_TEMP || '',
    HA_ENTITY_INDOOR_HUMIDITY: process.env.HA_ENTITY_INDOOR_HUMIDITY || '',
    HA_ENTITY_BATTERY: process.env.HA_ENTITY_BATTERY || '',
    HA_ENTITY_WIFI: process.env.HA_ENTITY_WIFI || '',
    HA_ENTITY_PM25: process.env.HA_ENTITY_PM25 || '',
    HA_ENTITY_LQI: process.env.HA_ENTITY_LQI || ''
  };

  res.type('application/javascript');
  res.send(`window.EINK_ENV = ${JSON.stringify(config)};`);
});

// --- Home Assistant API Proxy ---
// Hides the token and bypasses browser CORS entirely
app.get('/api/ha/states/:entityId', async (req, res) => {
  const entityId = req.params.entityId;

  if (!HA_URL || !HA_TOKEN) {
    return res.status(503).json({ error: 'Home Assistant is not configured on the server.' });
  }

  try {
    const response = await fetch(`${HA_URL}/api/states/${entityId}`, {
      headers: {
        'Authorization': `Bearer ${HA_TOKEN}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      return res.status(response.status).json({ error: 'Failed to fetch from Home Assistant' });
    }

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error(`HA Proxy Error for ${entityId}:`, error.message);
    res.status(500).json({ error: 'Internal Server Error fetching from Home Assistant' });
  }
});

// Proxy for Weather Forecasts (HA 2024.4+ requires service calls for forecasts)
app.get('/api/ha/forecasts/:entityId', async (req, res) => {
  const entityId = req.params.entityId;
  const type = req.query.type || 'hourly';

  if (!HA_URL || !HA_TOKEN) {
    return res.status(503).json({ error: 'Home Assistant is not configured on the server.' });
  }

  try {
    const response = await fetch(`${HA_URL}/api/services/weather/get_forecasts?return_response=true`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${HA_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ entity_id: entityId, type })
    });

    if (!response.ok) {
      return res.status(response.status).json({ error: 'Failed to fetch forecasts from Home Assistant' });
    }

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error(`HA Forecast Proxy Error for ${entityId}:`, error.message);
    res.status(500).json({ error: 'Internal Server Error fetching forecasts' });
  }
});

// --- Static Frontend Serving ---
// Serve the Vite build output
app.use(express.static(path.join(__dirname, 'dist')));

// Fallback for React Router (Single Page App)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`E-Ink Dashboard Server running on http://0.0.0.0:${PORT}`);
  if (HA_URL && HA_TOKEN) {
    console.log(`✅ Home Assistant Proxy enabled (${HA_URL})`);
  } else {
    console.log(`⚠️  Home Assistant not configured (Missing HA_URL or HA_TOKEN)`);
  }
});
