import { useState, useEffect } from 'react';
import { WeatherData } from '../types';
import WeatherIcon from './WeatherIcon';
import { Thermometer, Droplets, Compass } from 'lucide-react';

interface CurrentWeatherProps {
  weather: WeatherData;
  theme: 'light' | 'dark';
  aiShortSummary?: string;
}

export default function CurrentWeather({ weather, theme, aiShortSummary }: CurrentWeatherProps) {
  const isDark = theme === 'dark';
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setNow(new Date());
    }, 15000); // refresh time every 15 seconds
    return () => clearInterval(interval);
  }, []);

  // Crisp visual style classes for high contrast solid sections (replaces borders)
  const blockClass = isDark
    ? 'bg-neutral-900 text-white p-4'
    : 'bg-neutral-100 text-black p-4';

  const reverseBlockClass = isDark
    ? 'bg-neutral-100 text-black p-4'
    : 'bg-neutral-900 text-white p-4';

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
    const formattedHours = String(hours).padStart(2, '0');
    const formattedMinutes = String(roundedDate.getMinutes()).padStart(2, '0');
    const timeString = `${formattedHours}:${formattedMinutes}`;
    
    const weekdayString = roundedDate.toLocaleDateString('de-DE', { weekday: 'long' }).toUpperCase();
    const dateDetailString = `${roundedDate.getDate()}. ${roundedDate.toLocaleDateString('de-DE', { month: 'long' }).toUpperCase()}`;

    return { timeString, weekdayString, dateDetailString };
  };

  const { timeString, weekdayString, dateDetailString } = getRoundedTimeAndDate();

  const getNextUpMessage = () => {
    if (aiShortSummary) {
      // Return the short summary as is, trim any potential periods added by the LLM
      return aiShortSummary.replace(/\.$/, '').trim();
    }
    const cond = weather.condition.toLowerCase();
    switch (cond) {
      case 'rainy':
        return 'Regen lässt in 1 Std. nach';
      case 'cloudy':
        return 'Sonnig heute Nachmittag';
      case 'sunny':
        return 'Klare Sicht heute Nacht';
      case 'stormy':
        return 'Sturm zieht in 1 Std. vorüber';
      case 'snowy':
        return 'Schnee lässt heute Nacht nach';
      case 'windy':
        return 'Wind lässt später nach';
      default:
        return 'Stabile Wetterlage';
    }
  };

  const translateCondition = (cond: string) => {
    const mapping: Record<string, string> = {
      sunny: 'Sonnig',
      rainy: 'Regnerisch',
      cloudy: 'Bewölkt',
      stormy: 'Stürmisch',
      snowy: 'Schneefall',
      windy: 'Windig',
      'partly-cloudy': 'Teils Bewölkt'
    };
    return mapping[cond.toLowerCase()] || capitalize(cond);
  };

  return (
    <div className="flex flex-col gap-6 select-none">
      {/* 1. Timepiece & Status Header */}
      <div className={`p-5 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${isDark ? 'bg-neutral-950 text-white' : 'bg-neutral-50 text-black'}`}>
        <div className="flex flex-col">
          <div className="flex items-baseline gap-2">
            <span className="text-6xl md:text-7xl font-mono font-black tracking-tight tabular-nums leading-none">
              {timeString}
            </span>
          </div>
        </div>
        
        <div className="flex flex-col text-left sm:text-right justify-center">
          <span className="text-2xl md:text-3xl font-sans font-black tracking-wide uppercase leading-tight">
            {weekdayString}
          </span>
          <span className="text-xl md:text-2xl font-sans font-black tracking-wide uppercase leading-tight">
            {dateDetailString}
          </span>
        </div>
      </div>

      {/* 2. Hero Weather Showcase */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-6 py-2">
          {/* Huge Weather Icon */}
          <div className="p-2 flex items-center justify-center">
            <WeatherIcon condition={weather.condition} size={112} strokeWidth={2.5} />
          </div>
          
          {/* Massive Outdoor Temp */}
          <div className="flex flex-col justify-center">
            <div className="flex items-start">
              <span className="text-7xl lg:text-8xl font-display font-black tracking-tight leading-none tabular-nums">
                {weather.currentTemp.toFixed(1)}
              </span>
              <span className="text-3xl lg:text-4xl font-sans font-bold leading-none mt-1 ml-1.5">
                &deg;C
              </span>
            </div>
            
            {/* Condition badge & status */}
            <div className="flex flex-row items-center gap-4 mt-2.5 flex-wrap">
              <span className={`px-3.5 py-1.5 text-sm md:text-base font-mono uppercase font-black tracking-widest leading-none rounded-sm ${isDark ? 'bg-white text-black' : 'bg-black text-white'}`}>
                {translateCondition(weather.condition)}
              </span>
              <span className={`text-sm md:text-base font-sans font-black tracking-wide leading-snug ${isDark ? 'text-white' : 'text-black'}`}>
                {getNextUpMessage()}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Climate Coordinates */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* OUTDOOR VITALS BLOCK */}
        <div className={`p-4.5 rounded-lg flex flex-col justify-between ${isDark ? 'bg-neutral-950 text-white' : 'bg-white text-black'}`}>
          <div>
            <span className="text-lg sm:text-xl font-mono uppercase tracking-widest font-black block mb-2">
              Außen
            </span>
            <div className="flex flex-col gap-3 mt-2">
              <div className="flex items-center justify-between">
                <Droplets size={24} strokeWidth={2.5} />
                <span className="text-lg sm:text-xl font-mono font-black tabular-nums">{weather.humidity}%</span>
              </div>
              <div className="flex items-center justify-between">
                <Compass size={24} strokeWidth={2.5} />
                <span className="text-lg sm:text-xl font-mono font-black uppercase tabular-nums">
                  {weather.windSpeed} km/h {weather.windDirection}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* INDOOR ENVIRONMENT MONITOR */}
        <div className={`p-4.5 rounded-lg flex flex-col justify-between ${isDark ? 'bg-neutral-900 text-white' : 'bg-neutral-100 text-black'}`}>
          <div>
            <span className="text-lg sm:text-xl font-mono uppercase tracking-widest font-black block mb-2">
              Innen
            </span>
            <div className="flex items-baseline gap-1.5 mt-2">
              <span className="text-4xl sm:text-5xl font-display font-black tracking-tight leading-none tabular-nums">
                {weather.indoorTemp.toFixed(1)}&deg;
              </span>
            </div>
            
            <div className="border-t border-neutral-300 dark:border-neutral-700 mt-5 pt-4 flex items-center justify-between">
              <Droplets size={24} strokeWidth={2.5} />
              <span className="text-lg sm:text-xl font-mono font-black tabular-nums">
                {weather.indoorHumidity}%
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
