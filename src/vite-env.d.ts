/// <reference types="vite/client" />

declare module 'weather-icons-react' {
  import type { ComponentType, SVGProps } from 'react';

  export interface WeatherIconsReactProps extends SVGProps<SVGSVGElement> {
    size?: number | string;
    color?: string;
  }

  export type WeatherIconComponent = ComponentType<WeatherIconsReactProps>;

  export const WiDaySunny: WeatherIconComponent;
  export const WiNightClear: WeatherIconComponent;
  export const WiCloud: WeatherIconComponent;
  export const WiCloudy: WeatherIconComponent;
  export const WiDayCloudy: WeatherIconComponent;
  export const WiNightAltPartlyCloudy: WeatherIconComponent;
  export const WiNightPartlyCloudy: WeatherIconComponent;
  export const WiRain: WeatherIconComponent;
  export const WiShowers: WeatherIconComponent;
  export const WiSprinkle: WeatherIconComponent;
  export const WiThunderstorm: WeatherIconComponent;
  export const WiLightning: WeatherIconComponent;
  export const WiHail: WeatherIconComponent;
  export const WiSnow: WeatherIconComponent;
  export const WiSleet: WeatherIconComponent;
  export const WiFog: WeatherIconComponent;
  export const WiStrongWind: WeatherIconComponent;
  export const WiWindy: WeatherIconComponent;
  export const WiRaindrop: WeatherIconComponent;
  export const WiRaindrops: WeatherIconComponent;
  export const WiHumidity: WeatherIconComponent;
  export const WiThermometer: WeatherIconComponent;
}
