import {
  WiDaySunny,
  WiNightClear,
  WiCloudy,
  WiFog,
  WiDayCloudy,
  WiNightAltPartlyCloudy,
  WiRain,
  WiShowers,
  WiThunderstorm,
  WiLightning,
  WiHail,
  WiSnow,
  WiSleet,
  WiStrongWind,
  type WeatherIconComponent,
} from 'weather-icons-react';

interface WeatherIconProps {
  condition: string;
  size?: number;
  strokeWidth?: number;
  className?: string;
}

const CONDITION_ICON_MAP: Record<string, WeatherIconComponent> = {
  sunny: WiDaySunny,
  clear: WiDaySunny,
  'clear-night': WiNightClear,
  moon: WiNightClear,
  night: WiNightClear,
  cloudy: WiCloudy,
  overcast: WiCloudy,
  fog: WiFog,
  foggy: WiFog,
  misty: WiFog,
  'sunny-intervals': WiDayCloudy,
  'partly-cloudy': WiDayCloudy,
  partlycloudy: WiDayCloudy,
  'partly-cloudy-night': WiNightAltPartlyCloudy,
  'partlycloudy-night': WiNightAltPartlyCloudy,
  rainy: WiRain,
  pouring: WiRain,
  drizzle: WiShowers,
  showers: WiShowers,
  stormy: WiThunderstorm,
  thunderstorm: WiThunderstorm,
  'lightning-rainy': WiThunderstorm,
  lightning: WiLightning,
  hail: WiHail,
  snowy: WiSnow,
  sleet: WiSleet,
  'snowy-rainy': WiSleet,
  windy: WiStrongWind,
  breezy: WiStrongWind,
};

/**
 * Renders a monochrome weather glyph from weather-icons-react matching the condition.
 */
export default function WeatherIcon({
  condition,
  size = 48,
  className = '',
}: WeatherIconProps) {
  const normCondition = condition.toLowerCase().trim();
  const IconComponent = CONDITION_ICON_MAP[normCondition] || WiDayCloudy;

  return (
    <IconComponent
      size={size}
      className={`text-current ${className}`.trim()}
    />
  );
}
