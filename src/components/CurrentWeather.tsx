import { WeatherData } from "../types";
import WeatherIcon from "./WeatherIcon";
import { WiRaindrops } from "weather-icons-react";

interface CurrentWeatherProps {
  weather: WeatherData;
  theme: "light" | "dark";
  isNight?: boolean;
}

const CONDITION_LABELS: Record<string, string> = {
  sunny: "Sonnig",
  "clear-night": "Klare Nacht",
  rainy: "Regnerisch",
  pouring: "Starkregen",
  showers: "Schauer",
  drizzle: "Nieselregen",
  cloudy: "Bewölkt",
  fog: "Neblig",
  stormy: "Stürmisch",
  lightning: "Gewitter",
  hail: "Hagel",
  snowy: "Schneefall",
  sleet: "Schneeregen",
  windy: "Windig",
  "partly-cloudy": "Teils Bewölkt",
  "partly-cloudy-night": "Teils Bewölkt",
};

/**
 * Full-column outdoor hero weather stacked above a full-column indoor climate strip.
 */
export default function CurrentWeather({
  weather,
  theme,
  isNight,
}: CurrentWeatherProps) {
  const isDark = theme === "dark";

  const effectiveCondition = (() => {
    const cond = weather.condition.toLowerCase().trim();
    if (isNight) {
      if (cond === "sunny" || cond === "clear") return "clear-night";
      if (
        cond === "partly-cloudy" ||
        cond === "partlycloudy" ||
        cond === "sunny-intervals"
      ) {
        return "partly-cloudy-night";
      }
    }
    return cond;
  })();

  const conditionLabel =
    CONDITION_LABELS[effectiveCondition] ||
    effectiveCondition.charAt(0).toUpperCase() + effectiveCondition.slice(1);

  return (
    <div className="flex flex-col gap-5 select-none">
      {/* 1. Outdoor Hero spanning the full column width */}
      <div className="flex items-center justify-between gap-6 py-1">
        <div className="flex items-center justify-center shrink-0">
          <WeatherIcon
            condition={effectiveCondition}
            size={124}
          />
        </div>

        <div className="flex flex-col items-start justify-center min-w-0">
          <div className="flex items-start leading-none">
            <span className="text-7xl lg:text-8xl font-display font-black tracking-tight leading-none tabular-nums">
              {weather.currentTemp.toFixed(1)}
            </span>
            <span className="text-3xl lg:text-4xl font-sans font-bold leading-none mt-1 ml-2">
              &deg;C
            </span>
          </div>

          <div className="flex mt-2.5">
            <span
              className={`px-3.5 py-1.5 text-sm md:text-base font-mono uppercase font-black tracking-widest leading-none rounded-sm whitespace-nowrap ${
                isDark ? "bg-white text-black" : "bg-black text-white"
              }`}
            >
              {conditionLabel}
            </span>
          </div>
        </div>
      </div>

      {/* 2. Indoor Climate Strip below, spanning the full column width */}
      <div
        className={`py-3.5 border-y-2 flex items-center justify-between gap-4 ${
          isDark
            ? "border-neutral-700 text-white"
            : "border-neutral-300 text-black"
        }`}
      >
        <div className="flex items-baseline gap-4">
          <span className="text-sm font-mono uppercase tracking-widest font-black">
            Innen
          </span>
          <div className="flex items-start leading-none">
            <span className="text-4xl font-display font-black tracking-tight leading-none tabular-nums">
              {weather.indoorTemp.toFixed(1)}
            </span>
            <span className="text-xl font-sans font-bold leading-none mt-0.5 ml-1">
              &deg;C
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 leading-none">
          <WiRaindrops size={28} />
          <span className="text-2xl font-mono font-black tabular-nums">
            {Math.round(weather.indoorHumidity)}%
          </span>
        </div>
      </div>
    </div>
  );
}
