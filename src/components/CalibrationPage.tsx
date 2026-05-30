import { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  LayoutGrid, 
  Columns, 
  Rows, 
  Grid, 
  Type, 
  Info,
  Sun,
  Moon
} from 'lucide-react';

interface CalibrationPageProps {
  onBack: () => void;
  currentTheme: 'light' | 'dark';
}

type ModeType = 'grid' | 'vertical' | 'horizontal' | 'checkerboard' | 'typography';

export default function CalibrationPage({ onBack, currentTheme }: CalibrationPageProps) {
  const [steps, setSteps] = useState<number>(16);
  const [mode, setMode] = useState<ModeType>('grid');
  const [isInverted, setIsInverted] = useState<boolean>(false);
  const [customText, setCustomText] = useState<string>("Quick brown fox jumps over the lazy dog");

  // Listen for Escape key to go back
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onBack();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onBack]);

  // Generate steps from 0 to N-1
  const listItems = Array.from({ length: steps }, (_, i) => {
    // If inverted, reverse the index progression
    const index = isInverted ? steps - 1 - i : i;
    const ratio = index / (steps - 1 || 1);
    
    const byteVal = Math.round(ratio * 255);
    const hexPart = byteVal.toString(16).padStart(2, '0').toUpperCase();
    const hex = `#${hexPart}${hexPart}${hexPart}`;
    const percent = Math.round(ratio * 100);
    
    return {
      index: i,
      displayIndex: index,
      hex,
      percent,
      byteVal,
      isDark: byteVal < 128
    };
  });

  return (
    <div className="min-h-screen w-full bg-neutral-950 text-white font-sans flex flex-col justify-between select-none relative">

      {/* HEADER BAR */}
      <header className="border-b border-neutral-800 bg-neutral-900/50 backdrop-blur px-6 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4 z-10">
        <div className="flex items-center gap-3">
          <button 
            onClick={onBack}
            className="flex items-center justify-center p-2 rounded-md hover:bg-neutral-800 border border-neutral-800 transition"
            title="Press ESC to return"
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono uppercase bg-emerald-950 text-emerald-400 border border-emerald-800 px-1.5 py-0.5 rounded font-bold tracking-widest">
                E-INK TOOL
              </span>
              <h1 className="text-lg font-display font-medium">Display Calibration Panel</h1>
            </div>
            <p className="text-xs text-neutral-400 font-sans mt-0.5">
              Calibrate and verify gray levels, dynamic range, and pixel bleed on e-paper screens.
            </p>
          </div>
        </div>

        {/* No active calibration controls in the header */}
      </header>

      {/* CONTROL TOOLBAR */}
      <section className="bg-neutral-900/30 border-b border-neutral-800/80 px-6 py-3 flex flex-wrap items-center justify-between gap-4 z-10">
        {/* Left tools: Mode Switches */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-mono font-bold text-neutral-500 uppercase mr-1">Pattern:</span>
          
          <button
            onClick={() => setMode('grid')}
            className={`flex items-center gap-1 px-3 py-1.5 text-xs font-mono rounded border transition ${
              mode === 'grid' 
                ? 'bg-white text-black border-white font-bold' 
                : 'bg-neutral-900 text-neutral-400 border-neutral-800 hover:text-white'
            }`}
          >
            <LayoutGrid size={13} />
            Grid
          </button>

          <button
            onClick={() => setMode('vertical')}
            className={`flex items-center gap-1 px-3 py-1.5 text-xs font-mono rounded border transition ${
              mode === 'vertical' 
                ? 'bg-white text-black border-white font-bold' 
                : 'bg-neutral-900 text-neutral-400 border-neutral-800 hover:text-white'
            }`}
          >
            <Columns size={13} />
            V-Bars
          </button>

          <button
            onClick={() => setMode('horizontal')}
            className={`flex items-center gap-1 px-3 py-1.5 text-xs font-mono rounded border transition ${
              mode === 'horizontal' 
                ? 'bg-white text-black border-white font-bold' 
                : 'bg-neutral-900 text-neutral-400 border-neutral-800 hover:text-white'
            }`}
          >
            <Rows size={13} />
            H-Bars
          </button>

          <button
            onClick={() => setMode('checkerboard')}
            className={`flex items-center gap-1 px-3 py-1.5 text-xs font-mono rounded border transition ${
              mode === 'checkerboard' 
                ? 'bg-white text-black border-white font-bold' 
                : 'bg-neutral-900 text-neutral-400 border-neutral-800 hover:text-white'
            }`}
          >
            <Grid size={13} />
            Checker
          </button>

          <button
            onClick={() => setMode('typography')}
            className={`flex items-center gap-1 px-3 py-1.5 text-xs font-mono rounded border transition ${
              mode === 'typography' 
                ? 'bg-white text-black border-white font-bold' 
                : 'bg-neutral-900 text-neutral-400 border-neutral-800 hover:text-white'
            }`}
          >
            <Type size={13} />
            Sharpness
          </button>
        </div>

        {/* Right tools: Divisions & Layout modifiers */}
        {mode !== 'checkerboard' && mode !== 'typography' && (
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-neutral-500 uppercase">Levels:</span>
              <div className="flex bg-neutral-950 border border-neutral-800 rounded overflow-hidden">
                {[4, 8, 16, 32].map((lv) => (
                  <button
                    key={lv}
                    onClick={() => setSteps(lv)}
                    className={`px-2.5 py-1 text-xs font-mono transition ${
                      steps === lv 
                        ? 'bg-neutral-100 text-black font-extrabold' 
                        : 'text-neutral-400 hover:text-white'
                    }`}
                  >
                    {lv}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={() => setIsInverted(!isInverted)}
              className="flex items-center gap-1 bg-neutral-900 border border-neutral-800 hover:bg-neutral-800 hover:text-white text-xs font-mono px-2.5 py-1 rounded transition text-neutral-400"
            >
              {isInverted ? <Sun size={12} className="text-amber-400" /> : <Moon size={12} />}
              {isInverted ? 'W → B (Normal)' : 'B → W (Inverted)'}
            </button>
          </div>
        )}
      </section>

      {/* MAIN VIEWPORT / CALIBRATION SCREEN AREA */}
      <div className="flex-grow w-full bg-neutral-950 flex flex-col justify-center items-center p-6 min-h-[50vh]">
        
        {/* MODE 1: GRID LAYOUT */}
        {mode === 'grid' && (
          <div className="w-full max-w-6xl grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
            {listItems.map((item) => (
              <div 
                key={item.index}
                style={{ backgroundColor: item.hex }}
                className="aspect-square flex flex-col justify-between p-3 rounded border border-neutral-900 text-left transition-shadow shadow-md"
              >
                {/* Luminance indicator at top */}
                <div className="flex items-center justify-between w-full">
                  <span 
                    style={{ color: item.isDark ? '#F5F5F5' : '#171717' }} 
                    className="text-[10px] font-mono leading-none tracking-tight font-extrabold"
                  >
                    L: {item.percent}%
                  </span>
                  <span 
                    style={{ color: item.isDark ? '#D4D4D4' : '#525252' }} 
                    className="text-[9px] font-mono leading-none tracking-tight"
                  >
                    #{item.displayIndex}
                  </span>
                </div>

                {/* Main dynamic labels at bottom */}
                <div className="flex flex-col gap-0.5 mt-auto">
                  <span 
                    style={{ color: item.isDark ? '#FFFFFF' : '#000000' }} 
                    className="text-sm font-mono font-extrabold tracking-wide"
                  >
                    {item.hex}
                  </span>
                  <div className="flex justify-between items-center">
                    <span 
                      style={{ color: item.isDark ? '#A3A3A3' : '#404040' }} 
                      className="text-[9px] font-mono font-medium leading-none"
                    >
                      D: {100 - item.percent}%
                    </span>
                    <span 
                      style={{ color: item.isDark ? '#D4D4D4' : '#525252' }} 
                      className="text-[9px] font-mono leading-none font-bold"
                    >
                      {item.byteVal}d
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* MODE 2: VERTICAL STRIPES */}
        {mode === 'vertical' && (
          <div className="w-full max-w-6xl h-[60vh] flex border border-neutral-900 rounded overflow-hidden shadow-lg">
            {listItems.map((item) => (
              <div 
                key={item.index}
                style={{ backgroundColor: item.hex }}
                className="flex-grow h-full flex flex-col justify-between py-6 px-1.5 text-center min-w-[20px] transition-all"
              >
                <div 
                  style={{ color: item.isDark ? '#FFFFFF' : '#000000' }} 
                  className="flex flex-col items-center justify-center gap-1 rotate-90 sm:rotate-0"
                >
                  <span className="text-[10px] font-mono font-bold leading-none select-none">
                    {item.percent}%
                  </span>
                </div>

                <div 
                  style={{ color: item.isDark ? '#FFFFFF' : '#000000' }} 
                  className="flex flex-col items-center justify-center gap-0.5"
                >
                  <span className="text-[10px] font-mono font-bold tracking-tight select-none truncate max-w-full block">
                    {item.hex}
                  </span>
                  <span className="text-[8px] font-mono select-none opacity-80 hidden sm:inline">
                    val: {item.byteVal}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* MODE 3: HORIZONTAL STRIPES */}
        {mode === 'horizontal' && (
          <div className="w-full max-w-5xl h-[65vh] flex flex-col border border-neutral-900 rounded overflow-hidden shadow-lg">
            {listItems.map((item) => (
              <div 
                key={item.index}
                style={{ backgroundColor: item.hex }}
                className="flex-grow w-full flex items-center justify-between px-6 transition-all"
              >
                <span 
                  style={{ color: item.isDark ? '#FFFFFF' : '#000000' }} 
                  className="text-xs font-mono font-extrabold select-none"
                >
                  L: {item.percent}% / D: {100 - item.percent}%
                </span>

                <div 
                  style={{ color: item.isDark ? '#FFFFFF' : '#000000' }}
                  className="flex justify-end gap-6 text-xs font-mono select-none"
                >
                  <span>Level #{item.displayIndex}</span>
                  <span className="font-bold">{item.hex}</span>
                  <span className="opacity-85 select-none hidden sm:inline">val: {item.byteVal}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* MODE 4: CHECKERBOARD LAYOUT (Tests bleed, fringing and adjacent-pixel halo effects) */}
        {mode === 'checkerboard' && (
          <div className="flex flex-col items-center gap-4 w-full">
            <p className="text-xs text-neutral-400 max-w-md text-center">
              Checkerboard pattern tests pixel fringing & sharpness. It flashes sharp pixel boundaries which are notoriously difficult for E-Ink framebuffers.
            </p>
            <div className="w-full max-w-md aspect-square grid grid-cols-8 grid-rows-8 border border-neutral-800 bg-white shadow-xl">
              {Array.from({ length: 64 }).map((_, i) => {
                const row = Math.floor(i / 8);
                const col = i % 8;
                const isBlack = (row + col) % 2 === 0;
                return (
                  <div 
                    key={i}
                    className={`w-full h-full transition ${isBlack ? 'bg-black' : 'bg-white'}`}
                  />
                );
              })}
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5 text-xs text-neutral-400 font-mono">
                <span className="w-3 h-3 bg-black border border-neutral-700 inline-block"/> Black (#000000)
              </div>
              <div className="flex items-center gap-1.5 text-xs text-neutral-400 font-mono">
                <span className="w-3 h-3 bg-white inline-block"/> White (#FFFFFF)
              </div>
            </div>
          </div>
        )}

        {/* MODE 5: TYPOGRAPHY & SHARPNESS TEST */}
        {mode === 'typography' && (
          <div className="w-full max-w-4xl bg-white text-black p-6 md:p-10 rounded border border-neutral-200 flex flex-col gap-8 shadow-md">
            
            {/* Custom string input */}
            <div className="no-print bg-neutral-100 border border-neutral-200 p-4 rounded flex flex-col sm:flex-row gap-3 items-center justify-between">
              <div className="flex flex-col gap-0.5 w-full sm:w-auto flex-grow">
                <label className="text-[10px] font-mono uppercase font-bold text-neutral-500">Test String Customizer</label>
                <input 
                  type="text" 
                  value={customText} 
                  onChange={(e) => setCustomText(e.target.value)}
                  className="bg-white border border-neutral-300 text-black px-3 py-1.5 rounded text-xs focus:outline-none w-full"
                  placeholder="Type anything to test typography limits..."
                />
              </div>
              <div className="flex gap-2 shrink-0">
                <button 
                  onClick={() => setCustomText("Quick brown fox jumps over the lazy dog")} 
                  className="px-2.5 py-1 text-[10px] font-mono border border-neutral-300 bg-white rounded cursor-pointer hover:bg-neutral-50"
                >
                  Fox Default
                </button>
                <button 
                  onClick={() => setCustomText("0123456789 !@#$%^&*()_+{}|:<>?`~[]\\;',./")} 
                  className="px-2.5 py-1 text-[10px] font-mono border border-neutral-300 bg-white rounded cursor-pointer hover:bg-neutral-50"
                >
                  Chars
                </button>
              </div>
            </div>

            {/* JetBrains Mono Test Column */}
            <div className="flex flex-col gap-4 border-b border-neutral-200 pb-8">
              <h2 className="text-xs font-mono font-bold tracking-widest uppercase text-neutral-400 select-none border-b border-neutral-100 pb-1">
                Font Face: JetBrains Mono (Tech/Strict)
              </h2>
              <div className="flex flex-col gap-3 font-mono">
                {[6, 8, 10, 12, 14, 16, 20, 24, 32].map((sz) => (
                  <div key={sz} className="flex flex-row items-baseline gap-4">
                    <span className="text-[8px] font-mono text-neutral-400 w-12 shrink-0 select-none">{sz}px / {Math.round(sz / 16 * 100) / 100}rem:</span>
                    <span style={{ fontSize: `${sz}px` }} className="leading-tight shrink-0 text-black truncate select-text">
                      {customText}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Space Grotesk / Inter Display Test Column */}
            <div className="flex flex-col gap-4">
              <h2 className="text-xs font-mono font-bold tracking-widest uppercase text-neutral-400 select-none border-b border-neutral-100 pb-1">
                Font Face: Space Grotesk (Display/Modern)
              </h2>
              <div className="flex flex-col gap-3 font-display">
                {[6, 8, 10, 12, 14, 16, 20, 24, 32].map((sz) => (
                  <div key={sz} className="flex flex-row items-baseline gap-4">
                    <span className="text-[8px] font-mono text-neutral-400 w-12 shrink-0 select-none">{sz}px / {Math.round(sz / 16 * 100) / 100}rem:</span>
                    <span style={{ fontSize: `${sz}px` }} className="leading-tight shrink-0 text-black truncate select-text">
                      {customText}
                    </span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

      </div>

      {/* FOOTER METADATA / GUIDANCE BAR */}
      <footer className="border-t border-neutral-800 bg-neutral-950 px-6 py-4 flex flex-col md:flex-row items-center justify-between text-[11px] text-neutral-500 font-mono gap-4 z-10">
        <div className="flex items-center gap-1.5">
          <Info size={12} className="text-neutral-400" />
          <span>E-Ink modules require pure monochrome hex references. Gradients help map anti-aliasing curve filters.</span>
        </div>
        <div className="flex items-center gap-4">
          <span>Format: 8-Bit Grayscale API</span>
          <button 
            onClick={onBack}
            className="text-neutral-400 hover:text-white border-b border-dotted border-neutral-500 hover:border-white transition cursor-pointer"
          >
            Exit calibration
          </button>
        </div>
      </footer>
    </div>
  );
}
