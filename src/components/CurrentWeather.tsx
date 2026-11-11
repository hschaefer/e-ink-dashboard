import { WeatherData } from "../types";
import WeatherIcon from "./WeatherIcon";
import { WiRaindrops, WiStrongWind, WiThermometer } from "weather-icons-react";

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
            size={160}
            className="-my-4"
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

      {/* 2. Outdoor & Indoor Climate Cards below, spanning the full column width */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Outdoor Vitals Card */}
        <div
          className={`p-3.5 md:p-4 rounded-lg border-2 flex flex-col justify-between gap-3 ${
            isDark
              ? "border-neutral-500 bg-black text-white"
              : "border-neutral-300 bg-white text-black"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-sm font-mono uppercase tracking-widest font-black leading-none">
              Außen
            </span>
          </div>

          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2 w-full">
              <WiRaindrops size={28} className="shrink-0" />
              <div className="flex justify-between items-baseline w-full gap-1.5 min-w-0">
                <span className="text-sm font-mono font-bold uppercase tracking-wide">
                  Feuchte
                </span>
                <span className="text-xl lg:text-2xl font-mono font-black tabular-nums leading-none">
                  {Math.round(weather.humidity)}%
                </span>
              </div>
            </div>

            <div
              className={`flex items-center gap-2 w-full pt-2.5 border-t ${
                isDark ? "border-neutral-700" : "border-neutral-200"
              }`}
            >
              <WiStrongWind size={28} className="shrink-0" />
              <div className="flex justify-between items-baseline w-full gap-1.5 min-w-0">
                <span className="text-sm font-mono font-bold uppercase tracking-wide">
                  Wind
                </span>
                <span className="text-xl lg:text-2xl font-mono font-black tabular-nums leading-none flex items-baseline gap-1 whitespace-nowrap">
                  {Math.round(weather.windSpeed)}
                  <span className="text-sm font-sans font-bold lowercase">
                    km/h
                  </span>
                  <span>{getWindArrow(weather.windDirection)}</span>
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Indoor Climate Gray Counter-Weight Card */}
        <div
          className={`p-3.5 md:p-4 rounded-lg flex flex-col justify-between gap-3 ${
            isDark
              ? "bg-neutral-900 text-white"
              : "bg-neutral-100 text-black"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-sm font-mono uppercase tracking-widest font-black leading-none">
              Innen
            </span>
            <WiThermometer size={26} className="shrink-0 -my-1" />
          </div>

          <div className="flex items-start leading-none">
            <span className="text-4xl font-display font-black tracking-tight leading-none tabular-nums">
              {weather.indoorTemp.toFixed(1)}
            </span>
            <span className="text-xl font-sans font-bold leading-none mt-0.5 ml-1">
              &deg;C
            </span>
          </div>

          <div
            className={`flex items-center gap-2 w-full pt-2.5 border-t ${
              isDark ? "border-neutral-500" : "border-neutral-300"
            }`}
          >
            <WiRaindrops size={28} className="shrink-0" />
            <div className="flex justify-between items-baseline w-full gap-1.5 min-w-0">
              <span className="text-sm font-mono font-bold uppercase tracking-wide">
                Feuchte
              </span>
              <span className="text-xl lg:text-2xl font-mono font-black tabular-nums leading-none">
                {Math.round(weather.indoorHumidity)}%
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
