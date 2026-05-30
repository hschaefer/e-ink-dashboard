export interface WeatherData {
  currentTemp: number;
  feelsLike: number;
  condition: string; // e.g., "sunny", "cloudy", "rainy", "stormy", "snowy", "windy"
  humidity: number; // in %
  barometricPressure: number; // in hPa
  windSpeed: number; // in km/h
  windDirection: string; // e.g. "NNE"
  indoorTemp: number;
  indoorHumidity: number;
  lastUpdated: string; // ISO string or simple time e.g., "15:09 UTC"
}

export interface HourlyForecast {
  time: string; // e.g., "16:00"
  temp: number;
  rainProbability: number; // percentage (0 to 100)
}

export interface DailyForecast {
  day: string; // e.g., "Thursday", "Thu"
  tempMin: number;
  tempMax: number;
  condition: string;
  rainProbability: number;
}

export interface SystemStatus {
  wifiSignal: 'excellent' | 'good' | 'fair' | 'poor' | 'offline';
  batteryUrl?: string; // empty if wired
  batteryPercent?: number; // e.g. 85% if tablet based e-ink display
  haConnected: boolean;
}

export interface PollenInfo {
  name: string;
  category: 'Tree' | 'Grass' | 'Weed';
  level: number; // 0 to 5 visual strength mapping
  status: 'None' | 'Low' | 'Moderate' | 'High' | 'Very High';
  desc: string;
}

export interface AirQuality {
  lqiValue: number;
  lqiLabel: string;
  pm25Value: number;
  pm25Label: string;
}

export interface DashboardData {
  weather: WeatherData;
  hourly: HourlyForecast[];
  daily: DailyForecast[];
  status: SystemStatus;
  pollen: PollenInfo[];
  airQuality?: AirQuality;
}

export type EInkTheme = 'light' | 'dark';
