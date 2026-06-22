import { useState, useEffect } from 'react';
import { WeatherData } from '../types';
import WeatherIcon from './WeatherIcon';
import { Thermometer, Droplets, Compass } from 'lucide-react';

interface CurrentWeatherProps {
  weather: WeatherData;
  theme: 'light' | 'dark';
}

export default function CurrentWeather({ weather, theme }: CurrentWeatherProps) {
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
    
    const weekdayString = roundedDate.toLocaleDateString('en-US', { weekday: 'long' }).toUpperCase();
    const dateDetailString = `${roundedDate.getDate()}. ${roundedDate.toLocaleDateString('en-US', { month: 'long' }).toUpperCase()}`;

    return { timeString, weekdayString, dateDetailString };
  };

  const { timeString, weekdayString, dateDetailString } = getRoundedTimeAndDate();

  // Determine what is coming next based on the weather condition
  const getNextUpMessage = () => {
    const cond = weather.condition.toLowerCase();
    switch (cond) {
      case 'rainy':
        return 'Rain easing in 1 hr';
      case 'cloudy':
        return 'Sunny this afternoon';
      case 'sunny':
        return 'Clear skies tonight';
      case 'stormy':
        return 'Storm passing in 1 hr';
      case 'snowy':
        return 'Snow easing tonight';
      case 'windy':
        return 'Winds easing later';
      default:
        return 'Conditions stable';
    }
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
          <span className="text-base md:text-lg font-sans font-black tracking-wide uppercase leading-tight">
            {weekdayString}
          </span>
          <span className="text-sm md:text-base font-sans font-medium tracking-wide uppercase leading-tight opacity-75">
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
            <div className="flex flex-col mt-2.5">
              <div className="flex">
                <span className={`px-3.5 py-1.5 text-sm md:text-base font-mono uppercase font-black tracking-widest leading-none rounded-sm ${isDark ? 'bg-white text-black' : 'bg-black text-white'}`}>
                  {capitalize(weather.condition)}
                </span>
              </div>
              <span className={`text-sm md:text-base font-sans font-black tracking-wide mt-2.5 leading-snug ${isDark ? 'text-white' : 'text-black'}`}>
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
            <span className="text-xs font-mono uppercase tracking-widest font-black block mb-2">
              Outdoor
            </span>
            <div className="flex flex-col gap-2.5 mt-1">
              <div className="flex items-center gap-2">
                <Droplets size={16} strokeWidth={2.5} />
                <div className="flex justify-between items-baseline w-full">
                  <span className="text-xs font-sans font-black uppercase">Humidity</span>
                  <span className="text-sm font-mono font-black tabular-nums">{weather.humidity}%</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Compass size={16} strokeWidth={2.5} />
                <div className="flex justify-between items-baseline w-full">
                  <span className="text-xs font-sans font-black uppercase">Wind</span>
                  <span className="text-sm font-mono font-black uppercase tabular-nums">
                    {weather.windSpeed} km/h {weather.windDirection}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Thermometer size={16} strokeWidth={2.5} />
                <div className="flex justify-between items-baseline w-full">
                  <span className="text-xs font-sans font-black uppercase">Apparent</span>
                  <span className="text-sm font-mono font-black tabular-nums">{weather.feelsLike.toFixed(1)}&deg;C</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* INDOOR ENVIRONMENT MONITOR */}
        <div className={`p-4.5 rounded-lg flex flex-col justify-between ${isDark ? 'bg-neutral-900 text-white' : 'bg-neutral-100 text-black'}`}>
          <div>
            <span className="text-xs font-mono uppercase tracking-widest font-black block mb-1">
              Indoor
            </span>
            <div className="flex items-baseline gap-1.5 mt-1.5">
              <span className="text-3xl font-display font-black tracking-tight leading-none tabular-nums">
                {weather.indoorTemp.toFixed(1)}&deg;
              </span>
              <span className="text-xs font-sans font-black uppercase">Inside</span>
            </div>
            
            <div className="border-t border-neutral-300 dark:border-neutral-700 mt-4.5 pt-3.5 flex items-center justify-between">
              <span className="text-[11px] font-mono uppercase tracking-wider font-black">
                Inside Humidity
              </span>
              <span className="text-sm font-mono font-black tabular-nums">
                {weather.indoorHumidity}%
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
