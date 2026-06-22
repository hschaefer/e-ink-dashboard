import { DashboardData } from '../types';
import { Info } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface WeatherSummaryProps {
  data: DashboardData;
  theme: 'light' | 'dark';
}

export default function WeatherSummary({ data, theme }: WeatherSummaryProps) {
  const isDark = theme === 'dark';
  
  const { weather, hourly, daily } = data;
  const tomorrow = daily[0];

  const translateCondition = (cond: string) => {
    const mapping: Record<string, string> = {
      sunny: 'sonnig',
      rainy: 'regnerisch',
      cloudy: 'bewölkt',
      stormy: 'stürmisch',
      snowy: 'schneefall',
      windy: 'windig',
      'partly-cloudy': 'teils bewölkt'
    };
    return mapping[cond.toLowerCase()] || cond;
  };

  const todayCond = translateCondition(weather.condition);
  const todayTemp = weather.currentTemp.toFixed(1);
  
  let todayPrecip = '';
  const rainPoints = hourly.filter(h => h.rainProbability > 30);
  if (rainPoints.length > 0) {
    const peakRain = Math.max(...hourly.map(h => h.rainProbability));
    const peakTime = hourly.find(h => h.rainProbability === peakRain)?.time || '';
    todayPrecip = `Regen wahrscheinlich, Höchstwert von ${peakRain}% um ${peakTime} Uhr.`;
  } else {
    todayPrecip = 'Keine nennenswerten Niederschläge erwartet.';
  }

  const todayWind = weather.windSpeed > 15 ? ` Windig (${weather.windSpeed} km/h).` : '';

  let tomorrowText = '';
  if (tomorrow) {
    const tomCond = translateCondition(tomorrow.condition);
    const tomPrecip = tomorrow.rainProbability > 40 
      ? `Regen wahrscheinlich (${tomorrow.rainProbability}%)` 
      : 'überwiegend trocken';
    tomorrowText = `überwiegend ${tomCond} (${tomorrow.tempMin}°C bis ${tomorrow.tempMax}°C), ${tomPrecip}.`;
  }

  return (
    <div className="w-full flex flex-col select-none" id="intelligence-summary-section">
      {/* Title Header with crisp matching E-Ink layout styling */}
      <div className="flex justify-between items-baseline mb-3 pb-1.5 border-b-2 border-current">
        <span className="text-sm font-mono tracking-widest uppercase font-extrabold flex items-center gap-2">
          <Info size={16} strokeWidth={3} />
          Wetterübersicht
        </span>
      </div>

      {/* Narrative Container Block - matches table styling */}
      <div className={`p-5 rounded-lg ${
        isDark 
          ? 'bg-transparent text-white shadow-neutral-950/20' 
          : 'bg-transparent text-black shadow-neutral-100/50'
      }`}>
        <div className="flex flex-col gap-4 text-sm md:text-base font-sans font-medium leading-relaxed text-current">
          
          {data.aiSummary ? (
            <div className="[&>p]:mb-3 [&>p:last-child]:mb-0 [&>strong]:font-black [&>ul]:list-disc [&>ul]:pl-5 [&>ul]:mb-3 [&>ul:last-child]:mb-0 [&>em]:italic">
              <ReactMarkdown>
                {data.aiSummary}
              </ReactMarkdown>
            </div>
          ) : (
            <>
              {/* Today section with inline tag */}
              <p>
                <span className="inline-flex items-center justify-center h-5 px-2 py-0.5 rounded text-[10px] font-mono uppercase tracking-wider font-extrabold bg-black text-white mr-2 select-none align-middle">
                  Heute
                </span>
                ist überwiegend {todayCond} ({todayTemp}°C). {todayPrecip}{todayWind}
              </p>

              {/* Tomorrow section with inline tag */}
              {tomorrow && (
                <p className="pt-3 border-t-2 border-dashed border-neutral-400 dark:border-neutral-700">
                  <span className="inline-flex items-center justify-center h-5 px-2 py-0.5 rounded text-[10px] font-mono uppercase tracking-wider font-extrabold bg-black text-white mr-2 select-none align-middle">
                    Morgen
                  </span>
                  wird {tomorrowText}
                </p>
              )}
            </>
          )}
          
        </div>
      </div>
    </div>
  );
}
