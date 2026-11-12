import { WeatherData } from "../types";
import WeatherIcon from "./WeatherIcon";
import { Thermometer, Droplets, Compass } from "lucide-react";

const getWindArrow = (dir: string): string => {
  const cleanDir = dir.toUpperCase().trim();
  switch (cleanDir) {
    case "N":
      return "↑";
    case "NNE":
    case "NE":
    case "ENE":
      return "↗";
    case "E":
      return "→";
    case "ESE":
    case "SE":
    case "SSE":
      return "↘";
    case "S":
      return "↓";
    case "SSW":
    case "SW":
    case "WSW":
      return "↙";
    case "W":
      return "←";
    case "WNW":
    case "NW":
    case "NNW":
      return "↖";
    default:
      return "";
  }
};

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
      <div className="flex items-center justify-between gap-4 py-1">
        <div className="flex-1 flex items-center justify-center shrink-0">
          <WeatherIcon
            condition={effectiveCondition}
            size={152}
            className="-my-3.5"
          />
        </div>

        <div className="flex flex-col items-start justify-center min-w-0">
          <div className="flex items-start leading-none">
            <span className="text-6xl lg:text-[84px] font-display font-black tracking-tight leading-none tabular-nums">
              {weather.currentTemp.toFixed(1)}
            </span>
            <span className="text-2xl lg:text-3xl font-sans font-bold leading-none mt-1 ml-2">
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

      {/* 2. Outdoor & Indoor Climate Cards below, spanning the full column width */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Outdoor Climate Card */}
        <div
          className={`px-3.5 py-4 rounded-lg flex flex-col justify-between ${
            isDark ? "bg-black text-white" : "bg-white text-black"
          }`}
        >
          <div className="flex items-center pb-2 mb-3 border-b-2 border-current">
            <span className="text-base font-mono uppercase tracking-widest font-black leading-none">
              Außen
            </span>
          </div>

          <div className="flex-1 flex flex-col justify-between">
            <div className="flex items-center justify-between gap-2 pb-2.5 min-h-[42px]">
              <div className="flex items-center gap-1.5 min-w-0">
                <Droplets size={20} strokeWidth={2.5} className="shrink-0" />
                <span className="text-base font-mono font-bold uppercase tracking-wide">
                  Feuchte
                </span>
              </div>
              <span className="text-xl font-mono font-black tabular-nums leading-none shrink-0">
                {Math.round(weather.humidity)}%
              </span>
            </div>

            <div
              className={`flex items-center justify-between gap-2 pt-2.5 border-t border-dashed ${
                isDark ? "border-eink-mid-dark" : "border-eink-mid-light"
              }`}
            >
              <div className="flex items-center gap-1.5 min-w-0">
                <Compass size={20} strokeWidth={2.5} className="shrink-0" />
                <span className="text-base font-mono font-bold uppercase tracking-wide">
                  Wind
                </span>
              </div>
              <span className="text-xl font-mono font-black tabular-nums leading-none flex items-baseline gap-1 whitespace-nowrap shrink-0">
                {Math.round(weather.windSpeed)}
                <span className="text-base font-sans font-bold lowercase">
                  km/h
                </span>
                <span>{getWindArrow(weather.windDirection)}</span>
              </span>
            </div>
          </div>
        </div>

        {/* Indoor Climate Gray Counter-Weight Card */}
        <div
          className={`px-3.5 py-4 rounded-lg flex flex-col justify-between ${
            isDark ? "bg-eink-dark text-eink-white" : "bg-eink-light text-eink-black"
          }`}
        >
          <div className="flex items-center pb-2 mb-3 border-b-2 border-current">
            <span className="text-base font-mono uppercase tracking-widest font-black leading-none">
              Innen
            </span>
          </div>

          <div className="flex-1 flex flex-col justify-between">
            <div className="flex items-center justify-between gap-2 pb-2.5 min-h-[42px]">
              <div className="flex items-center gap-1.5 min-w-0">
                <Thermometer size={20} strokeWidth={2.5} className="shrink-0" />
                <span className="text-base font-mono font-bold uppercase tracking-wide">
                  Temp
                </span>
              </div>
              <span className="text-4xl font-display font-black tabular-nums leading-none whitespace-nowrap shrink-0">
                {weather.indoorTemp.toFixed(1)}
                <span className="text-lg font-sans font-bold ml-0.5">
                  &deg;C
                </span>
              </span>
            </div>

            <div
              className={`flex items-center justify-between gap-2 pt-2.5 border-t border-dashed ${
                isDark ? "border-eink-mid-dark" : "border-eink-mid-light"
              }`}
            >
              <div className="flex items-center gap-1.5 min-w-0">
                <Droplets size={20} strokeWidth={2.5} className="shrink-0" />
                <span className="text-base font-mono font-bold uppercase tracking-wide">
                  Feuchte
                </span>
              </div>
              <span className="text-xl font-mono font-black tabular-nums leading-none shrink-0">
                {Math.round(weather.indoorHumidity)}%
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
