import { DailyForecast } from '../types';
import WeatherIcon from './WeatherIcon';

interface DailyForecastListProps {
  forecasts: DailyForecast[];
  theme: 'light' | 'dark';
  currentTemp?: number;
  currentCondition?: string;
}

export default function DailyForecastList({ 
  forecasts, 
  theme,
  currentTemp,
  currentCondition 
}: DailyForecastListProps) {
  const isDark = theme === 'dark';

  // Compute absolute minimum and absolute maximum limits across the entire 5 days for scaling
  const globalMin = Math.min(...forecasts.map(f => f.tempMin));
  const globalMax = Math.max(...forecasts.map(f => f.tempMax));
  const globalSpan = globalMax - globalMin || 1;

  // Rain probability level mapping (0 to 5 visual strength) to match active pollen levels
  const getRainIntensity = (probability: number) => {
    if (probability <= 10) return { level: 0 };
    if (probability <= 30) return { level: 1 };
    if (probability <= 55) return { level: 2 };
    if (probability <= 75) return { level: 3 };
    if (probability <= 90) return { level: 4 };
    return { level: 5 };
  };

  return (
    <div className="w-full flex flex-col select-none">
      {/* Title Header with crisp matching E-Ink layout styling */}
      <div className="flex justify-between items-baseline mb-3 pb-1.5 border-b-2 border-current">
        <span className="text-sm font-mono tracking-widest uppercase font-extrabold flex items-center gap-2">
          5-Day Weather Forecast
        </span>
        <span className="text-[10px] font-mono font-bold tracking-wider opacity-60 uppercase">
          E-Paper Bar Trends
        </span>
      </div>

      {/* Forecast Container Block */}
      <div className={`p-5 rounded-lg border ${
        isDark 
          ? 'bg-transparent border-neutral-800 text-white shadow-neutral-950/20' 
          : 'bg-transparent border-neutral-200 text-black shadow-neutral-100/50'
      }`}>
        {/* Table Header Row aligned to column system for high professional polish */}
        <div className="grid grid-cols-12 items-center gap-1.5 pb-2 mb-3 border-b border-neutral-300 dark:border-neutral-800 text-[10px] font-mono uppercase font-bold tracking-wider opacity-60">
          <div className="col-span-2">Day</div>
          <div className="col-span-1">View</div>
          <div className="col-span-3">Rain Scale</div>
          <div className="col-span-1 text-right pr-1">Min</div>
          <div className="col-span-4 text-center">Temp Range</div>
          <div className="col-span-1 pl-1">Max</div>
        </div>

        <div className="flex flex-col gap-4">
          {forecasts.map((fc, idx) => {
            // High-Low Range Positions Inside Global Graph Frame
            const leftPercent = ((fc.tempMin - globalMin) / globalSpan) * 100;
            const widthPercent = ((fc.tempMax - fc.tempMin) / globalSpan) * 100;

            // Placement overlay of real current weather temperature indicator
            const safeCurrentTemp = currentTemp ?? 14.2;
            const currentPos = ((safeCurrentTemp - globalMin) / globalSpan) * 100;
            const clampedPos = Math.max(0, Math.min(100, currentPos));

            const { level } = getRainIntensity(fc.rainProbability);

            return (
              <div 
                key={fc.day} 
                className="grid grid-cols-12 items-center gap-1.5 py-0.5 border-b border-dashed border-neutral-200/50 dark:border-neutral-800/50 last:border-0 pb-3 last:pb-0"
              >
                {/* 1. Day Description */}
                <div className="col-span-2 text-sm font-sans font-extrabold tracking-tight">
                  {fc.day}
                </div>

                {/* 2. Micro Weather Icon */}
                <div className="col-span-1 flex items-center justify-start">
                  <span className={isDark ? 'text-neutral-300' : 'text-neutral-800'}>
                    <WeatherIcon 
                      condition={fc.condition} 
                      size={20} 
                      strokeWidth={2.5} 
                    />
                  </span>
                </div>

                {/* 3. Rain Level & Intensity Scale (similar to the active pollen levels) */}
                <div className="col-span-3 flex items-center justify-between gap-1 w-full overflow-hidden" title={`Rain probability: ${fc.rainProbability}%`}>
                  <span className={`font-mono text-xs font-extrabold select-none shrink-0 ${isDark ? 'text-white' : 'text-black'}`}>
                    {fc.rainProbability}%
                  </span>
                  <div className="flex gap-0.5 shrink-0 select-none">
                    {[1, 2, 3, 4, 5].map((segment) => {
                      const filled = segment <= level;
                      return (
                        <div 
                          key={segment}
                          className={`w-1.5 h-3 border ${
                            filled 
                              ? (isDark ? 'bg-white border-white' : 'bg-black border-black') 
                              : (isDark ? 'border-neutral-800 bg-neutral-950/50' : 'border-neutral-300 bg-neutral-100')
                          }`}
                        />
                      );
                    })}
                  </div>
                </div>

                {/* 4. Minimum Forecast Temperature */}
                <div className={`col-span-1 text-right font-mono text-xs font-extrabold pr-1 select-all ${isDark ? 'text-white' : 'text-black'}`}>
                  {fc.tempMin}°
                </div>

                {/* 5. Horizontal Temperature Range Slider */}
                <div className="col-span-4 px-1.5 bg-transparent">
                  <div className="h-3 w-full bg-neutral-200 dark:bg-neutral-800 rounded-full relative flex items-center border border-neutral-300/30 dark:border-neutral-700/30">
                    
                    {/* Floating pill representing daily limits */}
                    <div 
                      className={`absolute h-full rounded-full transition-all duration-300 ${isDark ? 'bg-white' : 'bg-black'}`}
                      style={{
                        left: `${leftPercent}%`,
                        width: `${widthPercent}%`
                      }}
                    />

                    {/* Today's Cursor Indicator Dot displaying location of active temp */}
                    {idx === 0 && currentTemp !== undefined && (
                      <div 
                        className={`absolute w-3.5 h-3.5 rounded-full shadow-md transform -translate-x-1.75 z-20 hover:scale-110 active:scale-95 transition-all duration-300 ${
                          isDark 
                            ? 'bg-black border-2 border-white' 
                            : 'bg-white border-2 border-black'
                        }`}
                        style={{ left: `${clampedPos}%` }}
                        title={`Current Temp: ${currentTemp}°C`}
                      />
                    )}

                  </div>
                </div>

                {/* 6. Maximum Forecast Temperature */}
                <div className="col-span-1 text-left font-mono text-xs font-black pl-1 select-all">
                  {fc.tempMax}°
                </div>

              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
