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
    
    const dateString = roundedDate.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    }).toUpperCase();

    return { timeString, dateString };
  };

  const { timeString, dateString } = getRoundedTimeAndDate();

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
      {/* Primary Weather Layout with Clock side-by-side */}
      <div className="flex flex-row items-center justify-between gap-6 border-b border-neutral-200 dark:border-neutral-800 pb-5">
        <div className="flex items-center gap-4">
          <div className={`p-3.5 rounded-full ${isDark ? 'bg-neutral-900' : 'bg-neutral-100'}`}>
            <WeatherIcon condition={weather.condition} size={56} strokeWidth={2.5} />
          </div>
          <div className="flex flex-col">
            <span className="text-4xl font-display font-semibold tracking-tight tabular-nums animate-[fade-in_0.5s_ease-out]">
              {weather.currentTemp.toFixed(1)}&deg;C
            </span>
            <span className="text-sm font-mono uppercase tracking-widest font-bold opacity-80">
              {capitalize(weather.condition)}
            </span>
            <span className={`text-[11px] font-sans font-extrabold tracking-wide mt-1 leading-tight ${isDark ? 'text-white' : 'text-black'}`}>
              {getNextUpMessage()}
            </span>
          </div>
        </div>

        {/* E-ink Time/Date Display */}
        <div className="flex flex-col items-end text-right">
          <span className="text-4xl font-mono font-black tracking-tight tabular-nums leading-none">
            {timeString}
          </span>
          <span className="text-xs font-mono uppercase tracking-wider font-extrabold opacity-75 mt-1.5">
            {dateString}
          </span>
        </div>
      </div>

      {/* Inside vs Outside Block Highlights (No Borders) */}
      <div className="grid grid-cols-2 gap-4">
        {/* OUTDOOR STATUS */}
        <div className={blockClass}>
          <div className="text-xs font-mono tracking-widest uppercase font-bold mb-1 flex items-center gap-1.5">
            <Thermometer size={14} strokeWidth={2.5} />
            Outdoor Temp
          </div>
          <div className="text-3xl font-display font-bold tracking-tight tabular-nums">
            {weather.currentTemp.toFixed(1)}&deg;
          </div>
          <div className="text-sm font-mono tracking-wider uppercase font-bold mt-1">
            Humidity: {weather.humidity}%
          </div>
        </div>

        {/* INDOOR STATUS */}
        <div className={reverseBlockClass}>
          <div className="text-xs font-mono tracking-widest uppercase font-bold mb-1 flex items-center gap-1.5">
            <Thermometer size={14} strokeWidth={2.5} />
            Indoor Temp
          </div>
          <div className="text-3xl font-display font-bold tracking-tight tabular-nums">
            {weather.indoorTemp.toFixed(1)}&deg;
          </div>
          <div className="text-sm font-mono tracking-wider uppercase font-bold mt-1">
            Humidity: {weather.indoorHumidity}%
          </div>
        </div>
      </div>

      {/* Grid of secondary statistics, now larger and fully black/white */}
      <div className="grid grid-cols-2 gap-y-4 gap-x-6 mt-2">
        <div className="flex items-center gap-3">
          <Droplets size={20} strokeWidth={2.5} />
          <div className="flex flex-col">
            <span className="text-xs font-mono tracking-wider uppercase font-bold">Humidity</span>
            <span className="text-base font-sans font-bold tracking-tight tabular-nums">{weather.humidity}%</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Compass size={20} strokeWidth={2.5} />
          <div className="flex flex-col">
            <span className="text-xs font-mono tracking-wider uppercase font-bold">Wind Speed</span>
            <span className="text-base font-sans font-bold tracking-tight uppercase tabular-nums">{weather.windSpeed} km/h {weather.windDirection}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
