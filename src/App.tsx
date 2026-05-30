import { useState, useEffect } from 'react';
import { mockWeatherData } from './mockData';
import { EInkTheme } from './types';
import CurrentWeather from './components/CurrentWeather';
import WeatherSummary from './components/WeatherSummary';
import CombinedForecastChart from './components/CombinedForecastChart';
import DailyForecastList from './components/DailyForecastList';
import PollenPanel from './components/PollenPanel';
import CalibrationPage from './components/CalibrationPage';
import { 
  Battery, 
  Settings, 
  EyeOff, 
  Eye,
  Sliders
} from 'lucide-react';

export default function App() {
  const [currentPath, setCurrentPath] = useState(() => window.location.pathname);

  useEffect(() => {
    const handleLocationChange = () => {
      setCurrentPath(window.location.pathname);
    };
    window.addEventListener('popstate', handleLocationChange);
    return () => {
      window.removeEventListener('popstate', handleLocationChange);
    };
  }, []);

  const navigate = (path: string) => {
    window.history.pushState({}, '', path);
    window.dispatchEvent(new PopStateEvent('popstate'));
  };

  const [theme, setTheme] = useState<EInkTheme>(() => {
    const envTheme = (window as any).EINK_ENV?.THEME;
    if (envTheme === 'light' || envTheme === 'dark') {
      return envTheme;
    }
    return 'light';
  });
  const [activeScenario, setActiveScenario] = useState<string>(() => {
    const envScenario = (window as any).EINK_ENV?.SCENARIO;
    if (envScenario && mockWeatherData[envScenario]) {
      return envScenario;
    }
    return 'springShowers';
  });
  const [showControls, setShowControls] = useState<boolean>(() => {
    const envShow = (window as any).EINK_ENV?.SHOW_CONTROLS;
    if (envShow === 'false') {
      return false;
    }
    return true;
  });

  const currentData = mockWeatherData[activeScenario] || mockWeatherData.springShowers;
  const isDark = theme === 'dark';

  // Apply base styling according to E-Ink Theme
  const bgClass = isDark ? 'bg-black text-white' : 'bg-white text-black';
  
  // Custom headers or dividers using solid fills instead of borders
  const statusBg = isDark ? 'bg-neutral-900 text-neutral-300' : 'bg-neutral-100 text-neutral-800';
  const controlBg = isDark ? 'bg-neutral-900 border border-neutral-800' : 'bg-neutral-100 border border-neutral-200';

  if (currentPath === '/calibration') {
    return (
      <CalibrationPage 
        onBack={() => navigate('/')} 
        currentTheme={theme} 
      />
    );
  }

  return (
    <div className={`${theme} min-h-screen w-full eink-crisp transition-colors duration-150 flex flex-col justify-between ${bgClass}`}>
      {/* MAIN CONTAINER */}
      <main className="relative w-full max-w-7xl mx-auto px-6 pt-4 pb-8 md:px-12 md:pt-6 md:pb-16 flex-grow flex flex-col justify-center">
        
        {/* Compact battery level in top right */}
        <div className="absolute top-3 right-6 md:top-4 md:right-12 flex items-center gap-1.5 text-xs font-mono font-bold tracking-wider uppercase opacity-75">
          <Battery size={14} strokeWidth={2.5} />
          <span>{currentData.status.batteryPercent}%</span>
        </div>

        {/* TWO COLUMN GRID LAYOUT (No borders, massive gap for visual partition) */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-16">
          
          {/* LEFT COLUMN: 5/12 grid columns - Current Weather & Hourly Forecast */}
          <div className="md:col-span-5 flex flex-col gap-10">
            {/* Current Weather & Summary grouped with a tighter gap */}
            <div className="flex flex-col gap-4">
              {/* Current Weather Module */}
              <CurrentWeather weather={currentData.weather} theme={theme} />

              {/* Weather Summary */}
              <WeatherSummary data={currentData} theme={theme} />
            </div>

            {/* Hourly Forecast Chart moved to bottom left */}
            <div className="w-full">
              <CombinedForecastChart 
                data={currentData.hourly} 
                theme={theme} 
                currentCondition={currentData.weather.condition}
              />
            </div>
          </div>

          {/* RIGHT COLUMN: 7/12 grid columns - 5-Day forecast list & Active Pollen */}
          <div className="md:col-span-7 flex flex-col gap-10">
            {/* 5-Day Forecast List */}
            <div className="w-full">
              <DailyForecastList 
                forecasts={currentData.daily} 
                theme={theme} 
                currentTemp={currentData.weather.currentTemp}
                currentCondition={currentData.weather.condition}
              />
            </div>

            {/* Active Airborne Pollen Panel */}
            <div className="w-full">
              <PollenPanel 
                pollenData={currentData.pollen || []} 
                airQuality={currentData.airQuality} 
                theme={theme} 
              />
            </div>
          </div>

        </div>
      </main>

      {/* DASHBOARD CALIBRATION CONTROLS (Can be fully hidden for a pristine physical test setup!) */}
      <footer className="w-full max-w-7xl mx-auto px-6 pb-6 select-none">
        {showControls ? (
          <div className={`p-4 md:p-6 rounded-lg ${statusBg} flex flex-col gap-4 md:flex-row md:items-center md:justify-between transition-all`}>
            {/* Information info */}
            <div className="flex flex-col gap-1">
              <span className="text-xs font-mono font-bold uppercase tracking-widest flex items-center gap-1.5">
                <Settings size={14} /> E-Ink Calibration Panel
              </span>
              <p className="text-[11px] font-sans opacity-60 leading-relaxed max-w-md">
                This simulated panel configures the display styling to perfectly align with various e-paper hardware modules (such as Waveshare, Inkplate, Kobo or Kindle).
              </p>
            </div>

            {/* Options group */}
            <div className="flex flex-wrap items-center gap-3">
              {/* Season Selection */}
              <div className="flex flex-col gap-1">
                <span className="text-[9px] font-mono uppercase tracking-wider opacity-60">Weather State</span>
                <select 
                  value={activeScenario} 
                  onChange={(e) => setActiveScenario(e.target.value)}
                  className={`px-3 py-1.5 text-xs font-mono tracking-wide rounded bg-transparent ${isDark ? 'text-white border border-neutral-800' : 'text-black border border-neutral-300'} outline-none`}
                >
                  <option className={isDark ? 'bg-black text-white' : 'bg-white text-black'} value="springShowers">🌦️ Spring Showers</option>
                  <option className={isDark ? 'bg-black text-white' : 'bg-white text-black'} value="mistyMorning">🌫️ Misty Morning</option>
                  <option className={isDark ? 'bg-black text-white' : 'bg-white text-black'} value="goldenAfternoon">☀️ Golden Afternoon</option>
                </select>
              </div>

              {/* Ink Style toggle */}
              <div className="flex flex-col gap-1">
                <span className="text-[9px] font-mono uppercase tracking-wider opacity-60">Ink Configuration</span>
                <div className="flex rounded overflow-hidden">
                  <button 
                    onClick={() => setTheme('light')}
                    className={`px-3 py-1.5 text-xs font-mono eink-button ${theme === 'light' ? (isDark ? 'bg-white text-black' : 'bg-black text-white font-bold') : (isDark ? 'bg-neutral-800 text-neutral-400' : 'bg-neutral-200 text-neutral-600')}`}
                  >
                    LIGHT (B/W)
                  </button>
                  <button 
                    onClick={() => setTheme('dark')}
                    className={`px-3 py-1.5 text-xs font-mono eink-button ${theme === 'dark' ? (isDark ? 'bg-white text-black font-bold' : 'bg-black text-white') : (isDark ? 'bg-neutral-800 text-neutral-400' : 'bg-neutral-200 text-neutral-600')}`}
                  >
                    DARK (W/B)
                  </button>
                </div>
              </div>

              {/* Calibration Page Link */}
              <button
                onClick={() => navigate('/calibration')}
                className={`self-end flex items-center justify-center gap-1.5 px-3 py-1.5 rounded text-xs font-mono eink-button ${isDark ? 'hover:bg-neutral-800 text-neutral-300' : 'hover:bg-neutral-200 text-neutral-800'}`}
                title="Go to display calibration tool"
              >
                <Sliders size={14} />
                CALIBRATE SCREEN
              </button>

              {/* Hide panel utility */}
              <button
                onClick={() => setShowControls(false)}
                className={`self-end flex items-center justify-center gap-1.5 px-3 py-1.5 rounded text-xs font-mono eink-button ${isDark ? 'hover:bg-neutral-800 text-neutral-300' : 'hover:bg-neutral-200 text-neutral-800'}`}
                title="Hide this panel to preview the pure paper layout"
              >
                <EyeOff size={14} />
                HIDE PANEL
              </button>
            </div>
          </div>
        ) : (
          <div className="flex justify-start pb-4">
            <button
              onClick={() => setShowControls(true)}
              className={`flex items-center gap-1.5 px-3 py-1 text-[10px] font-mono tracking-widest uppercase rounded opacity-30 hover:opacity-90 transition-opacity eink-button ${isDark ? 'bg-neutral-950 text-white' : 'bg-neutral-50 text-black'}`}
            >
              <Eye size={12} />
              SHOW CALIBRATION UTILITIES
            </button>
          </div>
        )}
      </footer>
    </div>
  );
}
