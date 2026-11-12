import { useState, useEffect } from 'react';
import { mockWeatherData } from './mockData';
import { useHomeAssistant } from './useHomeAssistant';
import { EInkTheme } from './types';
import CurrentWeather from './components/CurrentWeather';
import DashboardHeader from './components/DashboardHeader';
import WeatherSummary from './components/WeatherSummary';
import CombinedForecastChart from './components/CombinedForecastChart';
import DailyForecastList from './components/DailyForecastList';
import CalibrationPage from './components/CalibrationPage';
import { 
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
    const envTheme = import.meta.env.DEV 
      ? (import.meta.env.EINK_THEME || (window as any).EINK_ENV?.THEME)
      : ((window as any).EINK_ENV?.THEME);
    if (envTheme === 'light' || envTheme === 'dark') {
      return envTheme;
    }
    return 'light';
  });
  const [activeScenario, setActiveScenario] = useState<string>(() => {
    const envScenario = import.meta.env.DEV
      ? (import.meta.env.EINK_SCENARIO || (window as any).EINK_ENV?.SCENARIO)
      : ((window as any).EINK_ENV?.SCENARIO);
    if (envScenario && mockWeatherData[envScenario]) {
      return envScenario;
    }
    return 'springShowers';
  });
  const [showControls, setShowControls] = useState<boolean>(() => {
    const envShow = import.meta.env.DEV
      ? (import.meta.env.EINK_SHOW_CONTROLS || (window as any).EINK_ENV?.SHOW_CONTROLS)
      : ((window as any).EINK_ENV?.SHOW_CONTROLS);
    if (envShow === 'false') {
      return false;
    }
    return true;
  });

  const hideSettings = (() => {
    const envHide = import.meta.env.DEV
      ? (import.meta.env.EINK_HIDE_SETTINGS || (window as any).EINK_ENV?.HIDE_SETTINGS)
      : ((window as any).EINK_ENV?.HIDE_SETTINGS);
    return envHide === 'true';
  })();

  const { data: currentData, loading, error } = useHomeAssistant(activeScenario);
  const isDark = theme === 'dark';

  // Apply base styling according to E-Ink Theme
  const bgClass = isDark ? 'bg-eink-black text-eink-white' : 'bg-eink-white text-eink-black';
  
  // Custom headers or dividers using solid fills instead of borders
  const statusBg = isDark ? 'bg-eink-dark text-eink-mid-light' : 'bg-eink-light text-eink-dark';

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
      <main className="relative w-full max-w-7xl mx-auto px-6 py-6 md:px-10 md:py-7 flex-grow flex flex-col gap-7">
        
        {/* Full-width Masthead: Clock, Date, Battery */}
        <DashboardHeader
          batteryPercent={currentData.status.batteryPercent}
          theme={theme}
        />

        {/* TWO COLUMN GRID LAYOUT */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-12 items-start">
          
          {/* LEFT COLUMN: 5/12 grid columns - Current Weather (Outdoor + Indoor) & Summary */}
          <div className="md:col-span-5 flex flex-col gap-7">
            <CurrentWeather 
              weather={currentData.weather} 
              theme={theme} 
              isNight={currentData.sun?.isNight}
            />

            <WeatherSummary data={currentData} theme={theme} />
          </div>

          {/* RIGHT COLUMN: 7/12 grid columns - Hourly Forecast & 5-Day Forecast */}
          <div className="md:col-span-7 flex flex-col gap-7">
            {/* Hourly Forecast Chart */}
            <div className="w-full">
              <CombinedForecastChart 
                data={currentData.hourly} 
                theme={theme} 
                currentCondition={currentData.weather.condition}
                isNight={currentData.sun?.isNight}
              />
            </div>

            {/* 5-Day Forecast List */}
            <div className="w-full">
              <DailyForecastList 
                forecasts={currentData.daily} 
                theme={theme} 
                currentTemp={currentData.weather.currentTemp}
                currentCondition={currentData.weather.condition}
              />
            </div>
          </div>

        </div>
      </main>

      {/* DASHBOARD CALIBRATION CONTROLS (Can be fully hidden for a pristine physical test setup!) */}
      {!hideSettings && (
      <footer className="w-full max-w-7xl mx-auto px-6 pb-6 select-none">
        {showControls ? (
          <div className={`p-4 md:p-6 rounded-lg ${statusBg} flex flex-col gap-4 md:flex-row md:items-center md:justify-between transition-all`}>
            {/* Information info */}
            <div className="flex flex-col gap-1">
              <span className="text-xs font-mono font-bold uppercase tracking-widest flex items-center gap-1.5">
                <Settings size={14} /> E-Ink Kalibrierungspanel
              </span>
              <p className="text-[11px] font-sans opacity-60 leading-relaxed max-w-md">
                Dieses simulierte Panel konfiguriert das Display-Styling so, dass es perfekt auf verschiedene E-Paper-Hardwaremodule (wie Waveshare, Inkplate, Kobo oder Kindle) abgestimmt ist.
              </p>
            </div>

            {/* Options group */}
            <div className="flex flex-wrap items-center gap-3">
              {/* Season Selection */}
              <div className="flex flex-col gap-1">
                <span className="text-[9px] font-mono uppercase tracking-wider opacity-60">Wetterlage</span>
                <select 
                  value={activeScenario} 
                  onChange={(e) => setActiveScenario(e.target.value)}
                  className={`px-3 py-1.5 text-xs font-mono tracking-wide rounded bg-transparent ${isDark ? 'text-eink-white border border-eink-dark' : 'text-eink-black border border-eink-mid-light'} outline-none`}
                >
                  <option className={isDark ? 'bg-eink-black text-eink-white' : 'bg-eink-white text-eink-black'} value="springShowers">🌦️ Frühlingsregen</option>
                  <option className={isDark ? 'bg-eink-black text-eink-white' : 'bg-eink-white text-eink-black'} value="mistyMorning">🌫️ Nebeliger Morgen</option>
                  <option className={isDark ? 'bg-eink-black text-eink-white' : 'bg-eink-white text-eink-black'} value="goldenAfternoon">☀️ Goldener Nachmittag</option>
                </select>
              </div>

              {/* Ink Style toggle */}
              <div className="flex flex-col gap-1">
                <span className="text-[9px] font-mono uppercase tracking-wider opacity-60">eInk Konfiguration</span>
                <div className="flex rounded overflow-hidden">
                  <button 
                    onClick={() => setTheme('light')}
                    className={`px-3 py-1.5 text-xs font-mono eink-button ${theme === 'light' ? (isDark ? 'bg-eink-white text-eink-black' : 'bg-eink-black text-eink-white font-bold') : (isDark ? 'bg-eink-dark text-eink-mid-light' : 'bg-eink-light text-eink-mid-dark')}`}
                  >
                    HELL (S/W)
                  </button>
                  <button 
                    onClick={() => setTheme('dark')}
                    className={`px-3 py-1.5 text-xs font-mono eink-button ${theme === 'dark' ? (isDark ? 'bg-eink-white text-eink-black font-bold' : 'bg-eink-black text-eink-white') : (isDark ? 'bg-eink-dark text-eink-mid-light' : 'bg-eink-light text-eink-mid-dark')}`}
                  >
                    DUNKEL (W/S)
                  </button>
                </div>
              </div>

              {/* Calibration Page Link */}
              <button
                onClick={() => navigate('/calibration')}
                className={`self-end flex items-center justify-center gap-1.5 px-3 py-1.5 rounded text-xs font-mono eink-button ${isDark ? 'hover:bg-eink-dark text-eink-mid-light' : 'hover:bg-eink-light text-eink-dark'}`}
                title="Gehe zum Display-Kalibrierungstool"
              >
                <Sliders size={14} />
                BILDSCHIRM KALIBRIEREN
              </button>

              {/* Hide panel utility */}
              <button
                onClick={() => setShowControls(false)}
                className={`self-end flex items-center justify-center gap-1.5 px-3 py-1.5 rounded text-xs font-mono eink-button ${isDark ? 'hover:bg-eink-dark text-eink-mid-light' : 'hover:bg-eink-light text-eink-dark'}`}
                title="Dieses Panel ausblenden, um das reine Papier-Layout als Vorschau anzuzeigen"
              >
                <EyeOff size={14} />
                PANEL AUSBLENDEN
              </button>
            </div>
          </div>
        ) : (
          <div className="flex justify-start pb-4">
              <button
                onClick={() => setShowControls(true)}
                className={`flex items-center gap-1.5 px-3 py-1 text-[10px] font-mono tracking-widest uppercase rounded opacity-30 hover:opacity-90 transition-opacity eink-button ${isDark ? 'bg-eink-black text-eink-white' : 'bg-eink-white text-eink-black'}`}
              >
                <Eye size={12} />
                KALIBRIERUNGS-WERKZEUGE ANZEIGEN
              </button>
          </div>
        )}
      </footer>
      )}
    </div>
  );
}
