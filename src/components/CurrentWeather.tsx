import { useState, useEffect } from "react";
import { WeatherData } from "../types";
import WeatherIcon from "./WeatherIcon";
import { Thermometer, Droplets, Compass } from "lucide-react";

const getWindArrow = (dir: string): string => {
  const cleanDir = dir.toUpperCase().trim();
  switch (cleanDir) {
    case "N": return "↑";
    case "NNE":
    case "NE":
    case "ENE": return "↗";
    case "E": return "→";
    case "ESE":
    case "SE":
    case "SSE": return "↘";
    case "S": return "↓";
    case "SSW":
    case "SW":
    case "WSW": return "↙";
    case "W": return "←";
    case "WNW":
    case "NW":
    case "NNW": return "↖";
    default: return "";
  }
};

interface CurrentWeatherProps {
  weather: WeatherData;
  theme: "light" | "dark";
  aiShortSummary?: string;
  isNight?: boolean;
}

export default function CurrentWeather({
  weather,
  theme,
  aiShortSummary,
  isNight,
}: CurrentWeatherProps) {
  const isDark = theme === "dark";
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setNow(new Date());
    }, 15000); // refresh time every 15 seconds
    return () => clearInterval(interval);
  }, []);

  // Crisp visual style classes for high contrast solid sections (replaces borders)
  const blockClass = isDark
    ? "bg-neutral-900 text-white p-4"
    : "bg-neutral-100 text-black p-4";

  const reverseBlockClass = isDark
    ? "bg-neutral-100 text-black p-4"
    : "bg-neutral-900 text-white p-4";

  // Capitalize first letter helper
  const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

  // Rounding minutes to 15-minute steps
  const getRoundedTimeAndDate = () => {
    const roundedDate = new Date(now);
    const minutes = roundedDate.getMinutes();
    const roundedMinutes = Math.round(minutes / 15) * 15;
    if (roundedMinutes === 60) {
      roundedDate.setHours(roundedDate.getHours() + 1);
      roundedDate.setMinutes(0);
    } else {
      roundedDate.setMinutes(roundedMinutes);
    }

    const hours = roundedDate.getHours();
    const formattedHours = String(hours).padStart(2, "0");
    const formattedMinutes = String(roundedDate.getMinutes()).padStart(2, "0");
    const timeString = `${formattedHours}:${formattedMinutes}`;

    const weekdayString = roundedDate
      .toLocaleDateString("de-DE", { weekday: "long" })
      .toUpperCase();
    const dateDetailString = `${roundedDate.getDate()}. ${roundedDate.toLocaleDateString("de-DE", { month: "long" }).toUpperCase()}`;

    return { timeString, weekdayString, dateDetailString };
  };

  const { timeString, weekdayString, dateDetailString } =
    getRoundedTimeAndDate();

  const effectiveCondition = (() => {
    const cond = weather.condition.toLowerCase().trim();
    if (isNight) {
      if (cond === 'sunny' || cond === 'clear') {
        return 'clear-night';
      }
      if (cond === 'partly-cloudy' || cond === 'partlycloudy' || cond === 'sunny-intervals') {
        return 'partly-cloudy-night';
      }
    }
    return cond;
  })();

  const getNextUpMessage = () => {
    if (aiShortSummary) {
      // Return the short summary as is, trim any potential periods added by the LLM
      return aiShortSummary.replace(/\.$/, "").trim();
    }
    switch (effectiveCondition) {
      case "rainy":
        return "Regen lässt in 1 Std. nach";
      case "cloudy":
        return "Sonnig heute Nachmittag";
      case "sunny":
        return "Klare Sicht heute Nacht";
      case "clear-night":
        return "Klare Sicht heute Nacht";
      case "partly-cloudy":
      case "partly-cloudy-night":
        return "Teils bewölkt heute Nacht";
      case "stormy":
        return "Sturm zieht in 1 Std. vorüber";
      case "snowy":
        return "Schnee lässt heute Nacht nach";
      case "windy":
        return "Wind lässt später nach";
      default:
        return "Stabile Wetterlage";
    }
  };

  const translateCondition = (cond: string) => {
    const mapping: Record<string, string> = {
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
    return mapping[cond.toLowerCase()] || capitalize(cond);
  };

  return (
    <div className="flex flex-col gap-6 select-none">
      {/* 1. Timepiece & Status Header */}
      <div
        className={`p-5 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${isDark ? "bg-neutral-950 text-white" : "bg-neutral-50 text-black"}`}
      >
        <div className="flex flex-col">
          <div className="flex items-baseline gap-2">
            <span className="text-6xl md:text-7xl font-mono font-black tracking-tight tabular-nums leading-none">
              {timeString}
            </span>
          </div>
        </div>

        <div className="flex flex-col text-left sm:text-right justify-center">
          <span className="text-2xl md:text-3xl font-sans font-black tracking-wide uppercase leading-tight whitespace-nowrap">
            {weekdayString}
          </span>
          <span className="text-xl md:text-2xl font-sans font-black tracking-wide uppercase leading-tight whitespace-nowrap">
            {dateDetailString}
          </span>
        </div>
      </div>

      {/* 2. Hero Weather Showcase */}
      <div className="flex flex-col gap-4">
        <div className="grid grid-cols-[auto_minmax(0,1fr)] gap-x-6 gap-y-3 py-2 items-start">
          {/* Row 1, Col 1: Weather Icon */}
          <div className="flex items-center justify-center">
            <WeatherIcon
              condition={effectiveCondition}
              size={112}
              strokeWidth={2.5}
            />
          </div>

          {/* Row 1, Col 2: Massive Outdoor Temp */}
          <div className="flex flex-wrap items-start leading-none min-w-0">
            <span className="text-7xl lg:text-8xl font-display font-black tracking-tight leading-none tabular-nums">
              {weather.currentTemp.toFixed(1)}
            </span>
            <span className="text-3xl lg:text-4xl font-sans font-bold leading-none mt-1 ml-2">
              &deg;C
            </span>
          </div>

          {/* Row 2, Col 1: Condition Badge */}
          <div className="flex justify-center">
            <span
              className={`px-3.5 py-1.5 text-sm md:text-base font-mono uppercase font-black tracking-widest leading-none rounded-sm whitespace-nowrap ${isDark ? "bg-white text-black" : "bg-black text-white"}`}
            >
              {translateCondition(effectiveCondition)}
            </span>
          </div>

          {/* Row 2, Col 2: AI Summary */}
          <div className="flex items-center">
            <span
              className={`text-sm md:text-base font-sans font-black tracking-wide leading-snug ${isDark ? "text-white" : "text-black"}`}
            >
              {getNextUpMessage()}
            </span>
          </div>
        </div>
      </div>

      {/* 3. Climate Coordinates */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* OUTDOOR VITALS BLOCK */}
        <div
          className={`p-4.5 rounded-lg flex flex-col justify-between ${isDark ? "bg-neutral-950 text-white" : "bg-white text-black"}`}
        >
          <div>
            <span className="text-xs font-mono uppercase tracking-widest font-black block mb-2">
              Außen
            </span>
            <div className="flex flex-col gap-2.5 mt-1">
              <div className="flex items-center gap-2 w-full">
                <Droplets size={18} strokeWidth={2.5} />
                <div className="flex justify-between items-baseline w-full">
                  <span className="text-sm font-sans font-black uppercase">
                    humidity
                  </span>
                  <span className="text-base font-mono font-black tabular-nums">
                    {weather.humidity}%
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2 w-full">
                <Compass size={18} strokeWidth={2.5} />
                <div className="flex justify-between items-baseline w-full">
                  <span className="text-sm font-sans font-black uppercase">
                    Wind
                  </span>
                  <span className="text-base font-mono font-black uppercase tabular-nums flex items-baseline gap-1">
                    {Math.round(weather.windSpeed)}
                    <span className="text-sm font-sans font-bold opacity-75 lowercase">kmh</span>
                    {getWindArrow(weather.windDirection)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* INDOOR ENVIRONMENT MONITOR */}
        <div
          className={`p-4.5 rounded-lg flex flex-col justify-between ${isDark ? "bg-neutral-900 text-white" : "bg-neutral-100 text-black"}`}
        >
          <div>
            <span className="text-xs font-mono uppercase tracking-widest font-black block mb-1">
              Innen
            </span>
            <div className="flex items-baseline gap-1.5 mt-1.5">
              <span className="text-4xl font-display font-black tracking-tight leading-none tabular-nums">
                {weather.indoorTemp.toFixed(1)}&deg;C
              </span>
            </div>

            <div className="mt-3 flex items-center gap-2 w-full">
              <Droplets size={18} strokeWidth={2.5} />
              <div className="flex justify-between items-baseline w-full">
                <span className="text-sm font-sans font-black uppercase">
                  humidity
                </span>
                <span className="text-base font-mono font-black tabular-nums">
                  {Math.round(weather.indoorHumidity)}%
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
