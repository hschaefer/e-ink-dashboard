import { WeatherData } from "../types";
import WeatherIcon from "./WeatherIcon";
import { Droplets } from "lucide-react";

interface CurrentWeatherProps {
  weather: WeatherData;
  theme: "light" | "dark";
  isNight?: boolean;
}

const CONDITION_LABELS: Record<string, string> = {
  sunny: "Sonnig",
  "clear-night": "Klare Nacht",
  rainy: "Regnerisch",
  cloudy: "Bewölkt",
  stormy: "Stürmisch",
  snowy: "Schneefall",
  windy: "Windig",
  "partly-cloudy": "Teils Bewölkt",
  "partly-cloudy-night": "Teils Bewölkt",
};

/**
 * Paired outdoor hero weather and indoor climate readout for Proposal 1.
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
    <div className="flex items-center justify-between gap-4 py-2 select-none">
      {/* Outdoor: Icon + Temperature + Condition Badge */}
      <div className="flex items-center gap-4 min-w-0">
        <div className="flex items-center justify-center shrink-0">
          <WeatherIcon
            condition={effectiveCondition}
            size={88}
            strokeWidth={2.5}
          />
        </div>

        <div className="flex flex-col justify-center min-w-0">
          <div className="flex items-start leading-none">
            <span className="text-6xl font-display font-black tracking-tight leading-none tabular-nums">
              {weather.currentTemp.toFixed(1)}
            </span>
            <span className="text-2xl font-sans font-bold leading-none mt-1 ml-1">
              &deg;C
            </span>
          </div>

          <div className="flex mt-2.5">
            <span
              className={`px-3 py-1.5 text-sm font-mono uppercase font-black tracking-widest leading-none rounded-sm whitespace-nowrap ${
                isDark ? "bg-white text-black" : "bg-black text-white"
              }`}
            >
              {conditionLabel}
            </span>
          </div>
        </div>
      </div>

      {/* Indoor: Clean typographic readout beside outdoor temp */}
      <div
        className={`border-l-2 pl-5 flex flex-col justify-center gap-2 shrink-0 ${
          isDark ? "border-neutral-700 text-white" : "border-neutral-300 text-black"
        }`}
      >
        <span className="text-sm font-mono uppercase tracking-widest font-black leading-none">
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
        <div className="flex items-center gap-1.5 leading-none">
          <Droplets size={18} strokeWidth={2.5} />
          <span className="text-xl font-mono font-black tabular-nums">
            {Math.round(weather.indoorHumidity)}%
          </span>
        </div>
      </div>
    </div>
  );
}
