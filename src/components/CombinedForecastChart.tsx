import { Clock, Moon, Sun } from 'lucide-react';
import { HourlyForecast } from '../types';
import WeatherIcon from './WeatherIcon';

interface CombinedForecastChartProps {
  data: HourlyForecast[];
  theme: 'light' | 'dark';
  currentCondition?: string;
  isNight?: boolean;
}

/**
 * Formats any supported time string into compact 24-hour notation (e.g. "16h", "8h").
 */
const format24hHour = (timeStr: string): string => {
  if (!timeStr) return '';

  const ampmMatch = timeStr.match(/^(\d{1,2})(?::(\d{2}))?\s*(am|pm)/i);
  if (ampmMatch) {
    let hours = parseInt(ampmMatch[1], 10);
    const isPM = ampmMatch[3].toLowerCase() === 'pm';
    if (isPM && hours < 12) hours += 12;
    if (!isPM && hours === 12) hours = 0;
    return `${hours}h`;
  }

  if (timeStr.includes('T')) {
    const d = new Date(timeStr);
    if (!isNaN(d.getTime())) {
      return `${d.getHours()}h`;
    }
  }

  if (timeStr.includes(':')) {
    const hours = parseInt(timeStr.split(':')[0].trim(), 10);
    if (!isNaN(hours)) {
      return `${hours}h`;
    }
  }

  const clean = timeStr.replace(/h$/i, '').trim();
  const num = parseInt(clean, 10);
  if (!isNaN(num)) {
    return `${num}h`;
  }

  return timeStr;
};

/**
 * Formats time strings into standard 24h "HH:MM" for titles and screen readers.
 */
const format24hFullTime = (timeStr: string): string => {
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

/**
 * Resolves the effective weather condition for an hourly slot, honoring day/night state.
 */
const resolveHourlyCondition = (
  item: HourlyForecast,
  currentCondition?: string,
  fallbackIsNight?: boolean
): { condition: string; isNightSlot: boolean } => {
  const parentCond = (currentCondition || 'sunny').toLowerCase().trim();
  const isNightSlot =
    item.isNight ??
    fallbackIsNight ??
    (parentCond === 'clear-night' ||
      item.condition === 'clear-night' ||
      item.condition === 'partly-cloudy-night');

  if (item.condition) {
    const cond = item.condition.toLowerCase().trim();
    if (isNightSlot) {
      if (cond === 'sunny' || cond === 'clear') {
        return { condition: 'clear-night', isNightSlot };
      }
      if (
        cond === 'partly-cloudy' ||
        cond === 'partlycloudy' ||
        cond === 'sunny-intervals'
      ) {
        return { condition: 'partly-cloudy-night', isNightSlot };
      }
    }
    return { condition: cond, isNightSlot };
  }

  const rainProb = item.rainProbability;
  if (rainProb >= 60) {
    if (parentCond.includes('storm')) return { condition: 'stormy', isNightSlot };
    if (parentCond.includes('snow')) return { condition: 'snowy', isNightSlot };
    return { condition: 'rainy', isNightSlot };
  }

  if (rainProb >= 25) {
    if (parentCond.includes('mist') || parentCond.includes('fog')) {
      return { condition: 'cloudy', isNightSlot };
    }
    return {
      condition: isNightSlot ? 'partly-cloudy-night' : 'partly-cloudy',
      isNightSlot,
    };
  }

  if (
    parentCond.includes('mist') ||
    parentCond.includes('fog') ||
    parentCond.includes('cloud')
  ) {
    return { condition: 'cloudy', isNightSlot };
  }
  if (parentCond.includes('wind')) {
    return { condition: 'windy', isNightSlot };
  }

  return {
    condition: isNightSlot ? 'clear-night' : 'sunny',
    isNightSlot,
  };
};

/**
 * E-Ink hourly forecast strip displaying time/day-night markers, sky icons,
 * and temperature figures below each icon.
 */
export default function CombinedForecastChart({
  data,
  theme,
  currentCondition,
  isNight,
}: CombinedForecastChartProps) {
  const isDark = theme === 'dark';

  if (!data || data.length === 0) {
    return (
      <div className="w-full flex flex-col gap-3 select-none" id="hourly-forecast-unified-section">
        <div className="flex items-center justify-between pb-1.5 border-b-2 border-current">
          <span className="text-sm font-mono tracking-widest uppercase font-extrabold flex items-center gap-2">
            <Clock size={16} strokeWidth={3} />
            Stündliche Vorhersage
          </span>
        </div>
        <p className="text-sm font-mono opacity-60 py-4">
          Keine stündlichen Vorhersagedaten verfügbar.
        </p>
      </div>
    );
  }

  const count = data.length;
  const temps = data.map((d) => d.temp);
  const minRounded = Math.round(Math.min(...temps));
  const maxRounded = Math.round(Math.max(...temps));

  const resolvedSlots = data.map((item) =>
    resolveHourlyCondition(item, currentCondition, isNight)
  );

  const gridTemplateColumns = `repeat(${count}, minmax(0, 1fr))`;
  const hairlineColor = isDark ? 'border-neutral-600' : 'border-neutral-200';
  const nightTextureStyle = {
    backgroundImage: `radial-gradient(${isDark ? '#444444' : '#AAAAAA'} 1px, transparent 1px)`,
    backgroundSize: '10px 10px',
    backgroundPosition: '5px 5px',
  };

  return (
    <div
      className="w-full flex flex-col gap-3 select-none"
      id="hourly-forecast-unified-section"
    >
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-1.5 border-b-2 border-current">
        <span className="text-sm font-mono tracking-widest uppercase font-extrabold flex items-center gap-2">
          <Clock size={16} strokeWidth={3} />
          Stündliche Vorhersage
        </span>
      </div>

      {/* Synchronized Hourly Strip */}
      <div
        className={`relative w-full overflow-hidden ${
          isDark ? 'bg-black text-white' : 'bg-white text-black'
        }`}
        id="hourly-hybrid-view"
        role="region"
        aria-label={`Stündliche Vorhersage von ${format24hHour(data[0].time)} bis ${format24hHour(data[count - 1].time)}, Temperatur ${minRounded} bis ${maxRounded} Grad`}
      >
        {/* Background vertical column matrix & nocturnal stipple texture */}
        <div
          className="absolute inset-0 grid pointer-events-none"
          style={{ gridTemplateColumns }}
          aria-hidden="true"
        >
          {resolvedSlots.map((slot, idx) => {
            const prevIsNight = idx > 0 ? resolvedSlots[idx - 1].isNightSlot : slot.isNightSlot;
            const isPhaseShift = idx > 0 && prevIsNight !== slot.isNightSlot;

            return (
              <div
                key={`bg-${data[idx].time}-${idx}`}
                className={`h-full ${
                  idx > 0
                    ? isPhaseShift
                      ? `border-l-2 border-dashed ${isDark ? 'border-white' : 'border-black'}`
                      : `border-l border-dashed ${hairlineColor}`
                    : ''
                }`}
                style={slot.isNightSlot ? nightTextureStyle : undefined}
              />
            );
          })}
        </div>

        {/* Row 1: Time axis + day/night transition indicators */}
        <div
          className={`relative z-10 grid items-center border-b ${hairlineColor}`}
          style={{ gridTemplateColumns }}
        >
          {data.map((item, idx) => {
            const slot = resolvedSlots[idx];
            const prevIsNight = idx > 0 ? resolvedSlots[idx - 1].isNightSlot : slot.isNightSlot;
            const isPhaseShift = idx > 0 && prevIsNight !== slot.isNightSlot;
            const isNextHour = idx === 0;

            return (
              <div
                key={`time-${item.time}-${idx}`}
                className="relative flex items-center justify-center py-2"
                title={`${format24hFullTime(item.time)} Uhr · ${Math.round(item.temp)}°C`}
              >
                {isPhaseShift && (
                  <span
                    className={`absolute left-0 -translate-x-1/2 top-1/2 -translate-y-1/2 p-0.5 rounded-full flex items-center justify-center ${
                      isDark ? 'bg-black text-white' : 'bg-white text-black'
                    }`}
                    title={slot.isNightSlot ? 'Beginn Nacht' : 'Beginn Tag'}
                  >
                    {slot.isNightSlot ? (
                      <Moon size={10} strokeWidth={2.75} />
                    ) : (
                      <Sun size={10} strokeWidth={2.75} />
                    )}
                  </span>
                )}

                <span
                  className={`text-lg sm:text-xl font-mono font-black tracking-tight tabular-nums leading-none ${
                    isNextHour
                      ? `px-1.5 py-0.5 rounded-sm ${
                          isDark ? 'bg-white text-black' : 'bg-black text-white'
                        }`
                      : ''
                  }`}
                >
                  {format24hHour(item.time)}
                </span>
              </div>
            );
          })}
        </div>

        {/* Row 2: Sky condition icons */}
        <div
          className="relative z-10 grid items-center pt-3 pb-1.5"
          style={{ gridTemplateColumns }}
        >
          {data.map((item, idx) => {
            const { condition } = resolvedSlots[idx];
            return (
              <div
                key={`icon-${item.time}-${idx}`}
                className="flex items-center justify-center"
                title={`${format24hFullTime(item.time)} Uhr: ${condition}`}
              >
                <WeatherIcon condition={condition} size={42} />
              </div>
            );
          })}
        </div>

        {/* Row 3: Temperature figures below each weather icon */}
        <div
          className="relative z-10 grid items-center pt-1 pb-2.5 text-center"
          style={{ gridTemplateColumns }}
        >
          {data.map((item, idx) => (
            <div
              key={`temp-${item.time}-${idx}`}
              className="flex items-center justify-center"
            >
              <span
                className={`px-1 rounded-sm text-lg sm:text-xl font-sans font-black tracking-tight tabular-nums leading-none ${
                  isDark ? 'bg-black text-white' : 'bg-white text-black'
                }`}
              >
                {Math.round(item.temp)}°
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
