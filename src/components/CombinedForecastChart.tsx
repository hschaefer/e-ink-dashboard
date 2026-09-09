import { HourlyForecast } from '../types';
import WeatherIcon from './WeatherIcon';
import { Clock } from 'lucide-react';

interface CombinedForecastChartProps {
  data: HourlyForecast[];
  theme: 'light' | 'dark';
  currentCondition?: string;
  isNight?: boolean;
}

// Helper to define grayscale shades based on weather conditions
const getSegmentStyle = (condition: string, isDark: boolean) => {
  if (isDark) {
    switch (condition) {
      case 'stormy':
        return { 
          bg: 'bg-neutral-100', 
          text: 'text-black border-r border-neutral-300 last:border-r-0' 
        };
      case 'rainy':
        return { 
          bg: 'bg-neutral-300', 
          text: 'text-black border-r border-neutral-400 last:border-r-0' 
        };
      case 'snowy':
        return { 
          bg: 'bg-neutral-400', 
          text: 'text-black border-r border-neutral-500 last:border-r-0' 
        };
      case 'cloudy':
        return { 
          bg: 'bg-neutral-700', 
          text: 'text-white border-r border-neutral-600 last:border-r-0' 
        };
      case 'partly-cloudy':
      case 'partly-cloudy-night':
        return { 
          bg: 'bg-neutral-800', 
          text: 'text-white border-r border-neutral-700 last:border-r-0' 
        };
      case 'windy':
        return { 
          bg: 'bg-neutral-800', 
          text: 'text-white border-r border-neutral-700 last:border-r-0' 
        };
      case 'clear-night':
      case 'moon':
      case 'sunny':
      default:
        return { 
          bg: 'bg-neutral-950', 
          text: 'text-white border-r border-neutral-900 last:border-r-0' 
        };
    }
  } else {
    // Light e-paper theme
    switch (condition) {
      case 'stormy':
        return { 
          bg: 'bg-neutral-900', 
          text: 'text-white border-r border-neutral-950 last:border-r-0' 
        };
      case 'rainy':
        return { 
          bg: 'bg-neutral-700', 
          text: 'text-white border-r border-neutral-800 last:border-r-0' 
        };
      case 'snowy':
        return { 
          bg: 'bg-neutral-100 border-r border-neutral-200 last:border-r-0', 
          text: 'text-black' 
        };
      case 'cloudy':
        return { 
          bg: 'bg-neutral-300 border-r border-neutral-400 last:border-r-0', 
          text: 'text-black' 
        };
      case 'partly-cloudy':
      case 'partly-cloudy-night':
        return { 
          bg: 'bg-neutral-200 border-r border-neutral-300 last:border-r-0', 
          text: 'text-black' 
        };
      case 'windy':
        return { 
          bg: 'bg-neutral-200 border-r border-neutral-300 last:border-r-0', 
          text: 'text-black' 
        };
      case 'clear-night':
      case 'moon':
      case 'sunny':
      default:
        return { 
          bg: 'bg-white border-r border-neutral-100 last:border-r-0', 
          text: 'text-black' 
        };
    }
  }
};

// Helper to format any time string reliably into 24-hour hour format without leading zeros (e.g. "20h", "8h")
const format24hHour = (timeStr: string): string => {
  if (!timeStr) return '';

  // 12-hour AM/PM format (e.g., "08:00 PM", "8:00 PM", "8 PM", "12:00 AM")
  const ampmMatch = timeStr.match(/^(\d{1,2})(?::(\d{2}))?\s*(am|pm)/i);
  if (ampmMatch) {
    let hours = parseInt(ampmMatch[1], 10);
    const isPM = ampmMatch[3].toLowerCase() === 'pm';
    if (isPM && hours < 12) hours += 12;
    if (!isPM && hours === 12) hours = 0;
    return `${hours}h`;
  }

  // ISO string e.g. "2026-09-09T20:00:00"
  if (timeStr.includes('T')) {
    const d = new Date(timeStr);
    if (!isNaN(d.getTime())) {
      return `${d.getHours()}h`;
    }
  }

  // Standard "HH:MM" (e.g., "20:00", "08:00", "8:00")
  if (timeStr.includes(':')) {
    const hours = parseInt(timeStr.split(':')[0].trim(), 10);
    if (!isNaN(hours)) {
      return `${hours}h`;
    }
  }

  // Standalone number or existing "h" notation (e.g., "20", "20h", "08", "08h")
  const clean = timeStr.replace(/h$/i, '').trim();
  const num = parseInt(clean, 10);
  if (!isNaN(num)) {
    return `${num}h`;
  }

  return timeStr;
};

// Helper to format tooltip time into standard 24h "HH:MM" format
const format24hTooltipTime = (timeStr: string): string => {
  if (!timeStr) return '';
  const ampmMatch = timeStr.match(/^(\d{1,2})(?::(\d{2}))?\s*(am|pm)/i);
  if (ampmMatch) {
    let hours = parseInt(ampmMatch[1], 10);
    const minutes = ampmMatch[2] || '00';
    const isPM = ampmMatch[3].toLowerCase() === 'pm';
    if (isPM && hours < 12) hours += 12;
    if (!isPM && hours === 12) hours = 0;
    return `${String(hours).padStart(2, '0')}:${minutes}`;
  }
  return timeStr;
};

export default function CombinedForecastChart({ data, theme, currentCondition, isNight }: CombinedForecastChartProps) {
  const isDark = theme === 'dark';
  const borderStyle = isDark ? 'border-neutral-800' : 'border-neutral-200';

  // Context-aware dynamic weather condition for each hourly tile
  const getHourlyCondition = (item: HourlyForecast) => {
    const rainProb = item.rainProbability;
    const parentCond = (currentCondition || 'sunny').toLowerCase().trim();
    const itemIsNight = item.isNight ?? isNight ?? (parentCond === 'clear-night');
    
    if (rainProb >= 60) {
      if (parentCond.includes('storm')) return 'stormy';
      if (parentCond.includes('snow')) return 'snowy';
      return 'rainy';
    }
    
    if (rainProb >= 25) {
      if (parentCond.includes('mist') || parentCond.includes('fog')) return 'cloudy';
      return itemIsNight ? 'partly-cloudy-night' : 'partly-cloudy';
    }
    
    if (parentCond.includes('mist') || parentCond.includes('fog') || parentCond.includes('cloud')) {
      return 'cloudy';
    }
    if (parentCond.includes('wind')) {
      return 'windy';
    }
    
    return itemIsNight ? 'clear-night' : 'sunny';
  };

  return (
    <div className="w-full flex flex-col gap-5 select-none" id="hourly-forecast-unified-section">
      
      {/* HEADER - No view toggles, Unified Hybrid baked as the default */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-5 pb-1 border-b-2 border-current">
        <span className="text-sm font-mono tracking-widest uppercase font-extrabold flex items-center gap-2">
          <Clock size={16} strokeWidth={3} />
          Stündliche Vorhersage
        </span>
      </div>

      {/* UNIFIED HYBRID VIEW */}
      <div className="flex flex-col gap-4 animate-fade-in" id="hourly-hybrid-view">
        <div className="p-4 md:p-5 rounded-lg bg-transparent">
          <div className="w-full flex flex-col">
            
            {/* Row A: Times */}
            <div className="grid grid-cols-8 gap-0 mb-3">
              {data.map((item) => (
                <div key={item.time} className="text-center">
                  <span className={`text-lg sm:text-xl font-mono font-black tracking-tight ${isDark ? 'text-white' : 'text-black'}`}>
                    {format24hHour(item.time)}
                  </span>
                </div>
              ))}
            </div>

            {/* Row B: Continuous Weather Ribbon */}
            <div className={`grid grid-cols-8 gap-0 h-12 border ${isDark ? 'border-neutral-800' : 'border-neutral-300'} rounded-md overflow-hidden`}>
              {data.map((item) => {
                const condition = getHourlyCondition(item);
                const style = getSegmentStyle(condition, isDark);
                
                return (
                  <div 
                    key={item.time}
                    className={`flex items-center justify-center h-full ${style.bg} ${style.text} transition-colors`}
                    title={`${format24hTooltipTime(item.time)}: ${condition}`}
                  >
                    <WeatherIcon 
                      condition={condition} 
                      size={32} 
                      strokeWidth={2.5} 
                    />
                  </div>
                );
              })}
            </div>

            {/* Row C: Just Temperature (Plain figures per segment aligning with times, replacing the SVG graph entirely) */}
            <div className="grid grid-cols-8 gap-0 my-4 text-center">
              {data.map((item) => (
                <div key={item.time} className="flex flex-col items-center justify-center">
                  <span className="text-lg sm:text-xl font-sans font-black tracking-tight tabular-nums text-current">
                    {Math.round(item.temp)}°
                  </span>
                </div>
              ))}
            </div>

          </div>
        </div>
      </div>

    </div>
  );
}
