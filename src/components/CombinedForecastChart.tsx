import { useState } from 'react';
import { HourlyForecast } from '../types';
import WeatherIcon from './WeatherIcon';
import { Clock, Layers, Grid as GridIcon, BarChart3 } from 'lucide-react';

interface CombinedForecastChartProps {
  data: HourlyForecast[];
  theme: 'light' | 'dark';
  currentCondition?: string;
}

// Helper to define grayscale shades based on weather conditions
const getSegmentStyle = (condition: string, isDark: boolean) => {
  if (isDark) {
    switch (condition) {
      case 'stormy':
        return { 
          bg: 'bg-neutral-100', 
          text: 'text-neutral-950 border-r border-neutral-300 last:border-r-0' 
        };
      case 'rainy':
        return { 
          bg: 'bg-neutral-300', 
          text: 'text-neutral-900 border-r border-neutral-400 last:border-r-0' 
        };
      case 'snowy':
        return { 
          bg: 'bg-neutral-400', 
          text: 'text-neutral-950 border-r border-neutral-500 last:border-r-0' 
        };
      case 'cloudy':
        return { 
          bg: 'bg-neutral-700', 
          text: 'text-neutral-200 border-r border-neutral-600/50 last:border-r-0' 
        };
      case 'partly-cloudy':
        return { 
          bg: 'bg-neutral-850', 
          text: 'text-neutral-300 border-r border-neutral-750/50 last:border-r-0' 
        };
      case 'windy':
        return { 
          bg: 'bg-neutral-800', 
          text: 'text-neutral-355 border-r border-neutral-700/50 last:border-r-0' 
        };
      case 'sunny':
      default:
        return { 
          bg: 'bg-neutral-950', 
          text: 'text-neutral-250 border-r border-neutral-900 last:border-r-0' 
        };
    }
  } else {
    // Light e-paper theme
    switch (condition) {
      case 'stormy':
        return { 
          bg: 'bg-neutral-900', 
          text: 'text-neutral-100 border-r border-neutral-950 last:border-r-0' 
        };
      case 'rainy':
        return { 
          bg: 'bg-neutral-700', 
          text: 'text-neutral-100 border-r border-neutral-800 last:border-r-0' 
        };
      case 'snowy':
        return { 
          bg: 'bg-neutral-100 border-r border-neutral-200 last:border-r-0', 
          text: 'text-neutral-600' 
        };
      case 'cloudy':
        return { 
          bg: 'bg-neutral-300 border-r border-neutral-400 last:border-r-0', 
          text: 'text-neutral-850' 
        };
      case 'partly-cloudy':
        return { 
          bg: 'bg-neutral-200 border-r border-neutral-300 last:border-r-0', 
          text: 'text-neutral-800' 
        };
      case 'windy':
        return { 
          bg: 'bg-neutral-200/65 border-r border-neutral-300 last:border-r-0', 
          text: 'text-neutral-700' 
        };
      case 'sunny':
      default:
        return { 
          bg: 'bg-white border-r border-neutral-100 last:border-r-0', 
          text: 'text-neutral-800' 
        };
    }
  }
};

export default function CombinedForecastChart({ data, theme, currentCondition }: CombinedForecastChartProps) {
  const isDark = theme === 'dark';
  const [activeView, setActiveView] = useState<'hybrid' | 'grid' | 'timeline'>('hybrid');

  // Crisp e-paper themes suited perfectly for high-contrast e-readers
  const itemBg = isDark 
    ? 'bg-neutral-900/60 border-neutral-800 hover:bg-neutral-900' 
    : 'bg-neutral-100 border-neutral-200 hover:bg-neutral-200/75';
  const borderStyle = isDark ? 'border-neutral-800' : 'border-neutral-200';

  // Context-aware dynamic weather condition for each hourly tile
  const getHourlyCondition = (rainProb: number) => {
    const parentCond = (currentCondition || 'sunny').toLowerCase().trim();
    
    if (rainProb >= 60) {
      if (parentCond.includes('storm')) return 'stormy';
      if (parentCond.includes('snow')) return 'snowy';
      return 'rainy';
    }
    
    if (rainProb >= 25) {
      if (parentCond.includes('mist') || parentCond.includes('fog')) return 'cloudy';
      return 'partly-cloudy';
    }
    
    if (parentCond.includes('mist') || parentCond.includes('fog') || parentCond.includes('cloud')) {
      return 'cloudy';
    }
    if (parentCond.includes('wind')) {
      return 'windy';
    }
    
    return 'sunny';
  };

  // Sparkline point calculations for Unified Hybrid view
  const temps = data.map(item => item.temp);
  const minTemp = Math.min(...temps);
  const maxTemp = Math.max(...temps);
  const tempRange = maxTemp - minTemp;

  const points = data.map((item, idx) => {
    const x = idx * 100 + 50; // Align with center of each of 8 segments (view box 800 width)
    let y = 50;
    if (tempRange > 0) {
      // Keep points bounded elegantly inside [25, 75] vertical viewBox space
      y = 75 - ((item.temp - minTemp) / tempRange) * 50;
    }
    return { x, y, temp: item.temp };
  });

  const pathD = points.map((p, idx) => `${idx === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');

  return (
    <div className="w-full flex flex-col gap-5 select-none" id="hourly-forecast-unified-section">
      
      {/* WEATHER TABS SELECTOR - High contrast E-Paper switch buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-1 border-b-2 border-current">
        <span className="text-sm font-mono tracking-widest uppercase font-extrabold flex items-center gap-2">
          <Clock size={16} strokeWidth={3} />
          Hourly Forecast
        </span>
        
        {/* Toggle switch with genuine e-ink aesthetic */}
        <div className="flex gap-1.5 self-start sm:self-auto">
          <button
            onClick={() => setActiveView('hybrid')}
            className={`flex items-center gap-1 px-2 py-1 text-[10px] font-mono tracking-wider uppercase font-bold border transition-all ${
              activeView === 'hybrid'
                ? (isDark ? 'bg-white text-black border-white' : 'bg-black text-white border-black')
                : (isDark ? 'bg-neutral-900/40 text-neutral-400 border-neutral-800' : 'bg-neutral-100 text-neutral-600 border-neutral-200')
            }`}
          >
            <Layers size={11} />
            Unified Hybrid
          </button>
          <button
            onClick={() => setActiveView('grid')}
            className={`flex items-center gap-1 px-2 py-1 text-[10px] font-mono tracking-wider uppercase font-bold border transition-all ${
              activeView === 'grid'
                ? (isDark ? 'bg-white text-black border-white' : 'bg-black text-white border-black')
                : (isDark ? 'bg-neutral-900/40 text-neutral-400 border-neutral-800' : 'bg-neutral-100 text-neutral-600 border-neutral-200')
            }`}
          >
            <GridIcon size={11} />
            Grid Blocks
          </button>
          <button
            onClick={() => setActiveView('timeline')}
            className={`flex items-center gap-1 px-2 py-1 text-[10px] font-mono tracking-wider uppercase font-bold border transition-all ${
              activeView === 'timeline'
                ? (isDark ? 'bg-white text-black border-white' : 'bg-black text-white border-black')
                : (isDark ? 'bg-neutral-900/40 text-neutral-400 border-neutral-800' : 'bg-neutral-100 text-neutral-600 border-neutral-200')
            }`}
          >
            <BarChart3 size={11} />
            Continuous Bar
          </button>
        </div>
      </div>

      {/* VIEW RENDERER */}
      
      {/* 1. LATEST UNIFIED HYBRID VIEW (Combining Temperature Sparkline Curve, Segmented Color Ribbon, and Rain indicators) */}
      {activeView === 'hybrid' && (
        <div className="flex flex-col gap-4 animate-fade-in" id="hourly-hybrid-view">
          
          <div className={`p-4 md:p-5 rounded-lg border ${borderStyle} ${isDark ? 'bg-neutral-900/40' : 'bg-neutral-50/50'}`}>
            <div className="w-full flex flex-col">
              
              {/* Row A: Times */}
              <div className="grid grid-cols-8 gap-0 mb-2">
                {data.map((item) => (
                  <div key={item.time} className="text-center">
                    <span className="text-[10px] sm:text-xs font-mono font-black tracking-tight opacity-75">
                      {item.time}
                    </span>
                  </div>
                ))}
              </div>

              {/* Row B: Continuous Weather Ribbon */}
              <div className={`grid grid-cols-8 gap-0 h-10 border ${isDark ? 'border-neutral-800' : 'border-neutral-300'} rounded-md overflow-hidden`}>
                {data.map((item) => {
                  const condition = getHourlyCondition(item.rainProbability);
                  const style = getSegmentStyle(condition, isDark);
                  
                  return (
                    <div 
                      key={item.time}
                      className={`flex items-center justify-center h-full ${style.bg} ${style.text} transition-colors`}
                      title={`${item.time}: ${condition}`}
                    >
                      <WeatherIcon 
                        condition={condition} 
                        size={15} 
                        strokeWidth={2.5} 
                      />
                    </div>
                  );
                })}
              </div>

              {/* Row C: Dynamic SVG Sparkline Graph */}
              <div className="relative w-full h-[96px] my-3" id="hybrid-temp-graph">
                {/* Visual grid guides spanning the grid columns */}
                <div className="absolute inset-0 grid grid-cols-8 gap-0 pointer-events-none">
                  {data.map((_, i) => (
                    <div key={i} className="flex justify-center h-full">
                      <div className={`w-[1px] h-full border-r border-dotted ${isDark ? 'border-neutral-800/40' : 'border-neutral-300/60'}`} />
                    </div>
                  ))}
                </div>

                {/* Sparkling SVG Curve */}
                <svg className="absolute inset-0 w-full h-full overflow-visible" viewBox="0 0 800 100" preserveAspectRatio="none">
                  {/* Subtle drop guide line to make nodes pop */}
                  <path 
                    d={pathD} 
                    fill="none" 
                    className={`${isDark ? 'stroke-neutral-800' : 'stroke-neutral-200'} stroke-[3.5]`} 
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  {/* Outer Main Curve Line */}
                  <path 
                    d={pathD} 
                    fill="none" 
                    className={`${isDark ? 'stroke-white' : 'stroke-black'} stroke-3`} 
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  {/* Solid Point Markers with temperature figures */}
                  {points.map((p, idx) => (
                    <g key={idx}>
                      {/* Interactive hover circle backplate */}
                      <circle 
                        cx={p.x} 
                        cy={p.y} 
                        r={5.5} 
                        className={`${isDark ? 'fill-neutral-950 stroke-white' : 'fill-white stroke-black'} stroke-[3.5]`} 
                      />
                      {/* Highly styled matching temperatures */}
                      <text 
                        x={p.x} 
                        y={p.y - 12} 
                        textAnchor="middle" 
                        className={`font-sans font-black text-[12px] sm:text-[13px] leading-none select-all tracking-tighter tabular-nums ${isDark ? 'fill-white' : 'fill-black'}`}
                      >
                        {p.temp.toFixed(1)}°
                      </text>
                    </g>
                  ))}
                </svg>
              </div>

              {/* Row D: Precipitation Block Matrix */}
              <div className="grid grid-cols-8 gap-0 pt-3 border-t border-dashed border-neutral-300/70 dark:border-neutral-800/60 text-center">
                {data.map((item) => {
                  const hasRain = item.rainProbability > 0;
                  const rainMl = hasRain ? (item.rainProbability * 0.05).toFixed(1) + ' mm' : '0.0 mm';
                  
                  return (
                    <div key={item.time} className="flex flex-col items-center justify-between">
                      {/* Percent Tag */}
                      <span className={`text-[10px] font-mono leading-none ${hasRain ? 'font-black opacity-90' : 'opacity-40'}`}>
                        {item.rainProbability}%
                      </span>

                      {/* Micro Fill Bar proportional to probability */}
                      <div className="flex items-end justify-center h-8 my-1.5 w-full">
                        <div 
                          className={`w-3 rounded-t-sm transition-all duration-300 ${
                            hasRain 
                              ? (isDark ? 'bg-white' : 'bg-black') 
                              : (isDark ? 'bg-neutral-800/40' : 'bg-neutral-200/50')
                          }`}
                          style={{ 
                            height: `${Math.max(2, (item.rainProbability / 100) * 26)}px`,
                            opacity: hasRain ? 0.95 : 0.25
                          }}
                        />
                      </div>

                      {/* Volume */}
                      <span className={`text-[9px] font-mono leading-none tracking-tight ${hasRain ? 'font-bold opacity-80' : 'opacity-30'}`}>
                        {rainMl}
                      </span>
                    </div>
                  );
                })}
              </div>

            </div>
          </div>
        </div>
      )}

      {/* 2. CLASSIC GRID VIEW (Approach A) */}
      {activeView === 'grid' && (
        <div className="grid grid-cols-4 sm:grid-cols-8 md:grid-cols-4 gap-2.5 animate-fade-in" id="hourly-grid-view">
          {data.map((item, idx) => {
            const prevTemp = idx > 0 ? data[idx - 1].temp : null;
            const tempDiff = prevTemp !== null ? item.temp - prevTemp : null;
            const iconCondition = getHourlyCondition(item.rainProbability);
            const rainLevel = Math.min(5, Math.ceil(item.rainProbability / 20));

            return (
              <div 
                key={item.time} 
                id={`hourly-card-${idx}`}
                className={`flex flex-col justify-between p-2.5 rounded border ${borderStyle} ${itemBg} transition-all duration-150 min-h-[125px]`}
              >
                <div className="flex flex-col items-center gap-1">
                  <span className="text-[10px] font-mono font-bold uppercase opacity-55 tracking-wider">
                    {item.time}
                  </span>
                  <div className="text-current opacity-90 my-0.5">
                    <WeatherIcon 
                      condition={iconCondition} 
                      size={22} 
                      strokeWidth={2.5} 
                    />
                  </div>
                </div>

                <div className="flex flex-col items-center">
                  <span className="text-base font-display font-black tracking-tight tabular-nums select-all leading-none">
                    {item.temp.toFixed(1)}°
                  </span>
                  
                  {tempDiff !== null ? (
                    <span className="text-[9px] font-mono font-extrabold flex items-center gap-0.5 opacity-80 mt-1 leading-none">
                      {tempDiff > 0 ? (
                        <span className="text-neutral-900 dark:text-neutral-100 flex items-center gap-0.5">▲ {tempDiff.toFixed(1)}°</span>
                      ) : tempDiff < 0 ? (
                        <span className="text-neutral-900 dark:text-neutral-100 flex items-center gap-0.5">▼ {Math.abs(tempDiff).toFixed(1)}°</span>
                      ) : (
                        <span className="text-neutral-400 dark:text-neutral-500">—</span>
                      )}
                    </span>
                  ) : (
                    <span className="text-[9px] font-mono opacity-30 mt-1 leading-none">—</span>
                  )}
                </div>

                <div className="w-full flex flex-col mt-2 pt-1.5 border-t border-dashed border-neutral-300 dark:border-neutral-800">
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <span className="text-[9px] font-mono uppercase opacity-50 tracking-wider">
                      Rain
                    </span>
                    <span className="text-[9px] font-mono font-extrabold">
                      {item.rainProbability}%
                    </span>
                  </div>
                  <div className="flex gap-0.5 w-full">
                    {[1, 2, 3, 4, 5].map((barIdx) => {
                      const isFilled = barIdx <= rainLevel;
                      const barBg = isFilled 
                        ? (isDark ? 'bg-white' : 'bg-black') 
                        : (isDark ? 'bg-neutral-800' : 'bg-neutral-300');
                      return (
                        <div 
                          key={barIdx} 
                          className={`h-1 flex-1 rounded-sm ${barBg} transition-colors`} 
                        />
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 3. HOME ASSISTANT TIMELINE VIEW (Approach B) */}
      {activeView === 'timeline' && (() => {
        interface MergedSegment {
          condition: string;
          startIndex: number;
          colSpan: number;
          items: HourlyForecast[];
        }

        const timelineSegments: MergedSegment[] = [];
        data.forEach((item, idx) => {
          const condition = getHourlyCondition(item.rainProbability);
          if (timelineSegments.length === 0) {
            timelineSegments.push({
              condition,
              startIndex: idx,
              colSpan: 1,
              items: [item]
            });
          } else {
            const lastSeg = timelineSegments[timelineSegments.length - 1];
            if (lastSeg.condition === condition) {
              lastSeg.colSpan += 1;
              lastSeg.items.push(item);
            } else {
              timelineSegments.push({
                condition,
                startIndex: idx,
                colSpan: 1,
                items: [item]
              });
            }
          }
        });

        const getGridColsClass = (span: number) => {
          switch (span) {
            case 1: return 'grid-cols-1';
            case 2: return 'grid-cols-2';
            case 3: return 'grid-cols-3';
            case 4: return 'grid-cols-4';
            case 5: return 'grid-cols-5';
            case 6: return 'grid-cols-6';
            case 7: return 'grid-cols-7';
            case 8: return 'grid-cols-8';
            default: return 'grid-cols-1';
          }
        };

        return (
          <div className="w-full flex flex-col animate-fade-in" id="hourly-timeline-view">
            
            {/* Time Indicators ABOVE the Bar */}
            <div className="grid grid-cols-8 gap-0 text-center mb-2.5">
              {data.map((item, idx) => {
                const showEverySecond = idx % 2 === 0;
                return (
                  <div key={item.time} className="flex flex-col items-center">
                    <span className={`text-[11px] sm:text-xs font-mono font-bold opacity-60 tracking-tight ${showEverySecond ? '' : 'invisible'}`}>
                      {item.time}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Continuous Timeline Bar */}
            <div className={`grid grid-cols-8 gap-0 overflow-hidden rounded-full h-11 border ${isDark ? 'border-neutral-800' : 'border-neutral-300'} bg-neutral-100 dark:bg-neutral-900`}>
              {timelineSegments.map((segment, segIdx) => {
                const style = getSegmentStyle(segment.condition, isDark);
                const colSpan = segment.colSpan;
                
                return (
                  <div 
                    key={segIdx}
                    style={{ 
                      gridColumn: `span ${colSpan}`,
                      display: 'grid',
                      gridTemplateColumns: `repeat(${colSpan}, minmax(0, 1fr))`
                    }}
                    className={`grid ${getGridColsClass(colSpan)} h-full ${style.bg} ${style.text} transition-all duration-150`}
                    title={`Merged ${segment.condition} for ${colSpan} hours`}
                  >
                    {segment.items.map((item, localIdx) => {
                      const globalIdx = segment.startIndex + localIdx;
                      const showIcon = globalIdx % 2 === 0;
                      return (
                        <div key={item.time} className="flex items-center justify-center h-full">
                          {showIcon && (
                            <div className="flex items-center justify-center opacity-90 scale-105">
                              <WeatherIcon 
                                condition={segment.condition} 
                                size={18} 
                                strokeWidth={2.5} 
                              />
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </div>

            {/* Tick Indicators BELOW the Bar */}
            <div className="grid grid-cols-8 gap-0 px-2 mt-2 mb-1.5">
              {data.map((item, idx) => (
                <div key={item.time} className="flex justify-center">
                  <div className={`w-[1.5px] h-2 ${isDark ? 'bg-neutral-800' : 'bg-neutral-300'} rounded-full ${idx % 2 === 0 ? '' : 'invisible'}`} />
                </div>
              ))}
            </div>

            {/* Temp & Rain Indicators BELOW the Tick lines */}
            <div className="grid grid-cols-8 gap-0 text-center">
              {data.map((item, idx) => {
                const hasRain = item.rainProbability > 0;
                const rainMl = hasRain ? (item.rainProbability * 0.05).toFixed(1) + ' mm' : null;
                const showEverySecond = idx % 2 === 0;

                return (
                  <div key={item.time} className="flex flex-col items-center animate-fade-in">
                    <span className={`text-sm sm:text-base font-display font-black tracking-tight leading-none text-current mb-1.5 ${showEverySecond ? '' : 'invisible'}`}>
                      {item.temp.toFixed(1)}°
                    </span>

                    <span className={`text-[10px] font-mono leading-none min-h-[14px] ${hasRain && showEverySecond ? 'font-bold opacity-80 text-neutral-800 dark:text-neutral-200' : 'opacity-0 select-none'}`}>
                      {rainMl || '0.0 mm'}
                    </span>
                  </div>
                );
              })}
            </div>

          </div>
        );
      })()}

    </div>
  );
}

