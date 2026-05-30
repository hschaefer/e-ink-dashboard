import { PollenInfo, AirQuality } from '../types';
import { TreePine, Sprout, Flower, AlertTriangle, HelpCircle, Wind, ShieldAlert } from 'lucide-react';

interface PollenPanelProps {
  pollenData: PollenInfo[];
  airQuality?: AirQuality;
  theme: 'light' | 'dark';
}

export default function PollenPanel({ pollenData, airQuality, theme }: PollenPanelProps) {
  const isDark = theme === 'dark';

  // Crisp e-paper themes suited perfectly for high-contrast e-readers
  const containerBg = isDark ? 'bg-neutral-950 text-white' : 'bg-white text-black';
  const itemBg = isDark ? 'bg-neutral-900/60 border-neutral-800 hover:bg-neutral-900' : 'bg-neutral-100 border-neutral-200 hover:bg-neutral-200/75';
  const borderStyle = isDark ? 'border-neutral-800' : 'border-neutral-200';

  // Default values for robustness
  const fallbackAQ: AirQuality = {
    lqiValue: 2,
    lqiLabel: "Good",
    pm25Value: 9,
    pm25Label: "Excellent"
  };

  const aq = airQuality || fallbackAQ;

  // Choose category icon helper
  const getCategoryIcon = (category: 'Tree' | 'Grass' | 'Weed') => {
    switch (category) {
      case 'Tree':
        return <TreePine className="shrink-0" size={14} strokeWidth={2.5} />;
      case 'Grass':
        return <Sprout className="shrink-0" size={14} strokeWidth={2.5} />;
      case 'Weed':
        return <Flower className="shrink-0" size={14} strokeWidth={2.5} />;
      default:
        return <HelpCircle className="shrink-0" size={14} strokeWidth={2.5} />;
    }
  };

  const getPM25Level = (val: number): number => {
    if (val <= 10) return 1;
    if (val <= 20) return 2;
    if (val <= 25) return 3;
    if (val <= 50) return 4;
    return 5;
  };

  const maxPollenLevel = Math.max(0, ...pollenData.map((p) => p.level));
  const hasSevereAllergens = maxPollenLevel >= 4 || aq.lqiValue >= 4;

  return (
    <div className={`w-full flex flex-col select-none ${containerBg}`} id="air-quality-allergens-section">
      {/* HEADER SECTION */}
      <div className="flex justify-between items-baseline mb-3 pb-1.5 border-b-2 border-current">
        <span className="text-sm font-mono tracking-widest uppercase font-extrabold flex items-center gap-2">
          <Wind size={16} strokeWidth={3} />
          Air Quality &amp; Allergens
        </span>
        <span className="text-[10px] font-mono font-bold tracking-wider opacity-60 uppercase">
          Atmospheric Telemetry
        </span>
      </div>

      {/* AIR QUALITY METRICS (COMPACT STRIP) */}
      <div className="grid grid-cols-2 gap-3 mb-3">
        {/* LQI */}
        <div 
          id="card-lqi"
          className={`flex items-center justify-between p-2 rounded border ${borderStyle} ${itemBg} min-h-[48px]`}
        >
          <div className="flex items-center gap-2 min-w-0">
            <ShieldAlert className="shrink-0 opacity-75" size={14} strokeWidth={2.5} />
            <div className="min-w-0">
              <div className="text-[9px] font-mono uppercase opacity-55 tracking-wider leading-none">Air Quality (LQI)</div>
              <div className="text-xs font-sans font-extrabold truncate mt-0.5 leading-tight">{aq.lqiLabel}</div>
            </div>
          </div>
          <div className="flex gap-0.5 w-12 shrink-0">
            {[1, 2, 3, 4, 5].map((idx) => {
              const isFilled = idx <= Math.min(5, Math.max(0, aq.lqiValue));
              const barBg = isFilled 
                ? (isDark ? 'bg-white' : 'bg-black') 
                : (isDark ? 'bg-neutral-800' : 'bg-neutral-300');
              return (
                <div key={idx} className={`h-1.5 flex-1 rounded-sm ${barBg}`} />
              );
            })}
          </div>
        </div>

        {/* PM2.5 */}
        <div 
          id="card-pm25"
          className={`flex items-center justify-between p-2 rounded border ${borderStyle} ${itemBg} min-h-[48px]`}
        >
          <div className="flex items-center gap-2 min-w-0">
            <Wind className="shrink-0 opacity-75" size={14} strokeWidth={2.5} />
            <div className="min-w-0">
              <div className="text-[9px] font-mono uppercase opacity-55 tracking-wider leading-none">Particulates (PM2.5)</div>
              <div className="text-xs font-sans font-extrabold truncate mt-0.5 leading-tight">
                {aq.pm25Value} µg/m³
              </div>
            </div>
          </div>
          <div className="flex gap-0.5 w-12 shrink-0">
            {[1, 2, 3, 4, 5].map((idx) => {
              const isFilled = idx <= getPM25Level(aq.pm25Value);
              const barBg = isFilled 
                ? (isDark ? 'bg-white' : 'bg-black') 
                : (isDark ? 'bg-neutral-800' : 'bg-neutral-300');
              return (
                <div key={idx} className={`h-1.5 flex-1 rounded-sm ${barBg}`} />
              );
            })}
          </div>
        </div>
      </div>

      {/* ALLERGENS SECTION */}
      <div className={`p-3 rounded border ${borderStyle} ${isDark ? 'bg-neutral-900/40' : 'bg-neutral-50/50'}`}>
        <div className="text-[9px] font-mono uppercase tracking-widest opacity-65 mb-2.5 flex items-center justify-between border-b pb-1 border-neutral-250 dark:border-neutral-800">
          <span>Active Allergen Load</span>
          <span>5-Bar Scale</span>
        </div>

        {/* 2-COLUMN LIST */}
        <div className="grid grid-cols-2 gap-x-6 gap-y-2">
          {pollenData.map((item) => {
            return (
              <div 
                key={item.name} 
                id={`allergen-${item.name}`}
                className="flex items-center justify-between py-1 border-b border-dashed border-neutral-200/60 dark:border-neutral-800/60 text-xs text-sans"
              >
                <div className="flex items-center gap-1.5 min-w-0">
                  <span className="opacity-70 shrink-0">{getCategoryIcon(item.category)}</span>
                  <div className="truncate flex items-baseline gap-1">
                    <span className="font-extrabold truncate">{item.name}</span>
                    <span className="text-[9px] font-mono opacity-50 font-semibold uppercase">{item.status}</span>
                  </div>
                </div>
                {/* 5-bar Strength Indicator */}
                <div className="flex gap-0.5 w-12 shrink-0 ml-2">
                  {[1, 2, 3, 4, 5].map((idx) => {
                    const isFilled = idx <= item.level;
                    const barBg = isFilled 
                      ? (isDark ? 'bg-white' : 'bg-black') 
                      : (isDark ? 'bg-neutral-800' : 'bg-neutral-300');
                    return (
                      <div 
                        key={idx} 
                        className={`h-2 flex-1 rounded-sm ${barBg}`} 
                      />
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* HEALTH ADVISORY WARNING */}
      {hasSevereAllergens && (
        <div 
          className={`mt-2.5 p-2 rounded flex items-start gap-2 ${
            isDark ? 'bg-neutral-100 text-black' : 'bg-neutral-900 text-white'
          }`}
          id="health-advisory-warning"
        >
          <AlertTriangle className="shrink-0 mt-0.5" size={13} strokeWidth={3} />
          <p className="text-[10px] font-sans font-medium leading-tight">
            <span className="font-mono uppercase font-bold tracking-wider mr-1">Advisory:</span>
            Elevated particulates or pollen counts. Keep air filtration active.
          </p>
        </div>
      )}
    </div>
  );
}
