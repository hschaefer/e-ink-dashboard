import { useState, useEffect } from 'react';
import { DashboardData, WeatherData, SystemStatus, AirQuality, HourlyForecast, DailyForecast, PollenInfo } from './types';
import { mockWeatherData } from './mockData';

// Map HA weather conditions to our internal ones if necessary
const mapCondition = (haCondition: string) => {
  const mapping: Record<string, string> = {
    'clear-night': 'clear-night',
    'cloudy': 'cloudy',
    'exceptional': 'stormy',
    'fog': 'cloudy',
    'hail': 'stormy',
    'lightning': 'stormy',
    'lightning-rainy': 'stormy',
    'partlycloudy': 'partly-cloudy',
    'pouring': 'rainy',
    'rainy': 'rainy',
    'snowy': 'snowy',
    'snowy-rainy': 'snowy',
    'sunny': 'sunny',
    'windy': 'windy',
    'windy-variant': 'windy'
  };
  return mapping[haCondition] || haCondition || 'cloudy';
};

const mapWindDirection = (bearing: number): string => {
  if (bearing === undefined || bearing === null) return 'N';
  const dirs = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
  const val = Math.floor((bearing / 22.5) + 0.5);
  return dirs[(val % 16)];
};

const format24hTime = (date: Date): string => {
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${hours}:${minutes}`;
};

// Calculate approximate sunrise and sunset for a given date and coordinates (defaulting to Central Europe)
const getSolarTimes = (date: Date, lat = 51.1657, lon = 10.4515): { sunrise: Date; sunset: Date } => {
  const year = date.getFullYear();
  const start = new Date(year, 0, 0);
  const diff = date.getTime() - start.getTime();
  const dayOfYear = Math.floor(diff / (1000 * 60 * 60 * 24));

  const rad = Math.PI / 180;
  const declination = -23.44 * Math.cos((360 / 365) * (dayOfYear + 10) * rad);
  const zenith = 90.833 * rad;
  const latRad = lat * rad;
  const decRad = declination * rad;

  const cosH = (Math.cos(zenith) - Math.sin(latRad) * Math.sin(decRad)) / (Math.cos(latRad) * Math.cos(decRad));
  const H = Math.acos(Math.max(-1, Math.min(1, cosH))) / rad;

  const B = ((360 / 365) * (dayOfYear - 81)) * rad;
  const eot = 9.87 * Math.sin(2 * B) - 7.53 * Math.cos(B) - 1.5 * Math.sin(B);

  const solarNoonUTC = 12 - (lon / 15) - (eot / 60);
  const sunriseUTC = solarNoonUTC - (H / 15);
  const sunsetUTC = solarNoonUTC + (H / 15);

  const sunrise = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), Math.floor(sunriseUTC), Math.floor(((sunriseUTC % 1 + 1) % 1) * 60)));
  const sunset = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), Math.floor(sunsetUTC), Math.floor(((sunsetUTC % 1 + 1) % 1) * 60)));

  return { sunrise, sunset };
};

const checkIsNight = (itemDate: Date, sunEntity?: any): boolean => {
  if (sunEntity?.attributes) {
    const nextRising = sunEntity.attributes.next_rising ? new Date(sunEntity.attributes.next_rising).getTime() : null;
    const nextSetting = sunEntity.attributes.next_setting ? new Date(sunEntity.attributes.next_setting).getTime() : null;
    
    if (nextRising && nextSetting) {
      if (nextRising < nextSetting) {
        // Sun is currently below horizon: night is until nextRising
        if (itemDate.getTime() < nextRising) return true;
      } else {
        // Sun is currently above horizon: night starts at nextSetting
        if (itemDate.getTime() >= nextSetting) return true;
      }
    }
  }

  // Fallback to solar calculation
  const { sunrise, sunset } = getSolarTimes(itemDate);
  const time = itemDate.getTime();
  return time < sunrise.getTime() || time >= sunset.getTime();
};

export function useHomeAssistant(activeScenario: string) {
  const [data, setData] = useState<DashboardData>(mockWeatherData[activeScenario] || mockWeatherData.springShowers);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    
    const fetchHA = async () => {
      try {
        const fetchEntity = async (entityId: string) => {
          if (!entityId) return null;
          try {
            const res = await fetch(`/api/ha/states/${entityId}`);
            if (!res.ok) {
              if (res.status === 503) {
                throw new Error("Home Assistant proxy is not configured on the server");
              }
              return null;
            }
            return await res.json();
          } catch (e) {
            console.error(`Failed to fetch ${entityId}`, e);
            // Re-throw if it's the 503 configuration error so we can fall back to mock data
            if (e instanceof Error && e.message.includes("proxy is not configured")) {
              throw e;
            }
            return null;
          }
        };

        // Get configured entities
        const env = import.meta.env;
        const eWeather = env.HA_ENTITY_WEATHER || (window as any).EINK_ENV?.HA_ENTITY_WEATHER;
        const eInTemp = env.HA_ENTITY_INDOOR_TEMP || (window as any).EINK_ENV?.HA_ENTITY_INDOOR_TEMP;
        const eInHum = env.HA_ENTITY_INDOOR_HUMIDITY || (window as any).EINK_ENV?.HA_ENTITY_INDOOR_HUMIDITY;
        const eBattery = env.HA_ENTITY_BATTERY || (window as any).EINK_ENV?.HA_ENTITY_BATTERY;
        const eWifi = env.HA_ENTITY_WIFI || (window as any).EINK_ENV?.HA_ENTITY_WIFI;
        const ePm25 = env.HA_ENTITY_PM25 || (window as any).EINK_ENV?.HA_ENTITY_PM25;
        const eLqi = env.HA_ENTITY_LQI || (window as any).EINK_ENV?.HA_ENTITY_LQI;
        const eSummary = env.HA_ENTITY_WEATHER_SUMMARY || (window as any).EINK_ENV?.HA_ENTITY_WEATHER_SUMMARY;
        const eShortSummary = env.HA_ENTITY_WEATHER_SHORT_SUMMARY || (window as any).EINK_ENV?.HA_ENTITY_WEATHER_SHORT_SUMMARY;
        const eSun = env.HA_ENTITY_SUN || (window as any).EINK_ENV?.HA_ENTITY_SUN || 'sun.sun';

        // Helper to fetch forecast
        const fetchForecast = async (entityId: string, type: 'hourly' | 'daily') => {
          if (!entityId) return null;
          try {
            const res = await fetch(`/api/ha/forecasts/${entityId}?type=${type}`);
            if (!res.ok) return null;
            return await res.json();
          } catch (e) {
            console.error(`Failed to fetch forecast ${type} for ${entityId}`, e);
            return null;
          }
        };

        // Fetch all requested entities and forecasts
        const [
          weatherState, hourlyForecast, dailyForecast, inTempState, inHumState, batteryState, wifiState, pm25State, lqiState, summaryState, shortSummaryState, sunState
        ] = await Promise.all([
          fetchEntity(eWeather),
          fetchForecast(eWeather, 'hourly'),
          fetchForecast(eWeather, 'daily'),
          fetchEntity(eInTemp),
          fetchEntity(eInHum),
          fetchEntity(eBattery),
          fetchEntity(eWifi),
          fetchEntity(ePm25),
          fetchEntity(eLqi),
          fetchEntity(eSummary),
          fetchEntity(eShortSummary),
          fetchEntity(eSun)
        ]);

        if (!mounted) return;

        // Base on the mock data for structure, override with HA data where available
        const baseData = mockWeatherData[activeScenario] || mockWeatherData.springShowers;
        const newData: DashboardData = JSON.parse(JSON.stringify(baseData)); // deep clone

        newData.status.haConnected = true;

        const now = new Date();
        const isCurrentTimeNight = sunState?.state === 'below_horizon' || checkIsNight(now, sunState);
        newData.sun = {
          isNight: isCurrentTimeNight,
          nextSetting: sunState?.attributes?.next_setting,
          nextRising: sunState?.attributes?.next_rising
        };

        if (weatherState) {
          const attrs = weatherState.attributes || {};
          newData.weather.currentTemp = attrs.temperature !== undefined ? parseFloat(attrs.temperature) : newData.weather.currentTemp;
          newData.weather.humidity = attrs.humidity !== undefined ? parseFloat(attrs.humidity) : newData.weather.humidity;
          newData.weather.barometricPressure = attrs.pressure !== undefined ? parseFloat(attrs.pressure) : newData.weather.barometricPressure;
          newData.weather.windSpeed = attrs.wind_speed !== undefined ? parseFloat(attrs.wind_speed) : newData.weather.windSpeed;
          newData.weather.windDirection = attrs.wind_bearing !== undefined ? mapWindDirection(parseFloat(attrs.wind_bearing)) : newData.weather.windDirection;
          let cond = mapCondition(weatherState.state);
          if (isCurrentTimeNight && (cond === 'sunny' || cond === 'clear')) {
            cond = 'clear-night';
          }
          newData.weather.condition = cond;
          newData.weather.lastUpdated = `${format24hTime(new Date())} HA`;
          // we don't always get feelsLike from HA weather entity, keeping base or computing could be done, we keep base for now.
        } else {
          if (isCurrentTimeNight && (newData.weather.condition === 'sunny' || newData.weather.condition === 'clear')) {
            newData.weather.condition = 'clear-night';
          }
        }

        if (hourlyForecast && hourlyForecast.service_response) {
          const forecastData = Object.values(hourlyForecast.service_response)[0] as any;
          if (forecastData && Array.isArray(forecastData.forecast)) {
            newData.hourly = forecastData.forecast.slice(0, 8).map((f: any) => {
              const itemDate = new Date(f.datetime);
              const isNight = f.condition === 'clear-night' || checkIsNight(itemDate, sunState);
              return {
                time: format24hTime(itemDate),
                temp: Math.round(f.temperature),
                rainProbability: f.precipitation_probability || 0,
                condition: mapCondition(f.condition),
                datetime: f.datetime,
                isNight
              };
            });
          }
        } else {
          // If in mock data mode or HA forecast unavailable, annotate hourly items with isNight
          newData.hourly = newData.hourly.map((item, idx) => {
            const hourMatch = item.time.match(/^(\d{1,2})/);
            const hour = hourMatch ? parseInt(hourMatch[1], 10) : (now.getHours() + idx) % 24;
            const itemDate = new Date();
            itemDate.setHours(hour, 0, 0, 0);
            return {
              ...item,
              isNight: checkIsNight(itemDate, sunState)
            };
          });
        }

        if (dailyForecast && dailyForecast.service_response) {
          const forecastData = Object.values(dailyForecast.service_response)[0] as any;
          if (forecastData && Array.isArray(forecastData.forecast)) {
            newData.daily = forecastData.forecast.slice(0, 5).map((f: any) => {
              const date = new Date(f.datetime);
              return {
                day: date.toLocaleDateString('de-DE', { weekday: 'short' }),
                tempMin: Math.round(f.templow !== undefined ? f.templow : f.temperature),
                tempMax: Math.round(f.temperature),
                condition: mapCondition(f.condition),
                rainProbability: f.precipitation_probability || 0
              };
            });
          }
        }

        if (inTempState && !isNaN(parseFloat(inTempState.state))) {
          newData.weather.indoorTemp = parseFloat(inTempState.state);
        }
        if (inHumState && !isNaN(parseFloat(inHumState.state))) {
          newData.weather.indoorHumidity = parseFloat(inHumState.state);
        }

        if (batteryState && !isNaN(parseFloat(batteryState.state))) {
          newData.status.batteryPercent = parseFloat(batteryState.state);
        }
        if (wifiState) {
          // Simplistic mapping, depending on what the wifi sensor returns (dBm, percentage, or string)
          const val = wifiState.state.toLowerCase();
          if (['excellent', 'good', 'fair', 'poor', 'offline'].includes(val)) {
            newData.status.wifiSignal = val as any;
          } else if (!isNaN(parseFloat(val))) {
             const numVal = parseFloat(val);
             // Assume dBm (negative) or percentage (positive)
             if (numVal < 0) {
               if (numVal > -60) newData.status.wifiSignal = 'excellent';
               else if (numVal > -70) newData.status.wifiSignal = 'good';
               else if (numVal > -80) newData.status.wifiSignal = 'fair';
               else newData.status.wifiSignal = 'poor';
             } else {
               if (numVal > 80) newData.status.wifiSignal = 'excellent';
               else if (numVal > 60) newData.status.wifiSignal = 'good';
               else if (numVal > 40) newData.status.wifiSignal = 'fair';
               else newData.status.wifiSignal = 'poor';
             }
          }
        }

        if (pm25State || lqiState) {
          newData.airQuality = newData.airQuality || { lqiValue: 0, lqiLabel: 'Unknown', pm25Value: 0, pm25Label: 'Unknown' };
          if (pm25State && !isNaN(parseFloat(pm25State.state))) {
            newData.airQuality.pm25Value = parseFloat(pm25State.state);
            newData.airQuality.pm25Label = pm25State.state + ' µg/m³';
          }
          if (lqiState && !isNaN(parseFloat(lqiState.state))) {
            newData.airQuality.lqiValue = parseFloat(lqiState.state);
            newData.airQuality.lqiLabel = lqiState.state;
          } else if (lqiState) {
            newData.airQuality.lqiLabel = lqiState.state;
          }
        }

        if (summaryState) {
          if (summaryState.attributes?.full_summary) {
            newData.aiSummary = summaryState.attributes.full_summary;
          } else if (summaryState.state && summaryState.state !== 'unknown') {
            newData.aiSummary = summaryState.state;
          }
        }

        if (shortSummaryState && shortSummaryState.state && shortSummaryState.state !== 'unknown') {
          newData.aiShortSummary = shortSummaryState.state;
        }

        setData(newData);
        setError(null);
      } catch (e: any) {
        if (mounted) {
          console.error("Home Assistant fetch error", e);
          setError(e.message);
          // Fall back to mock data if proxy fails or isn't configured
          setData(mockWeatherData[activeScenario] || mockWeatherData.springShowers);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    fetchHA();
    
    // Poll every 5 minutes
    const interval = setInterval(fetchHA, 5 * 60 * 1000);
    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, [activeScenario]);

  // If HA isn't configured, we fall back to mock data in the catch block above


  return { data, loading, error };
}
