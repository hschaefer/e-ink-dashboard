import { useState, useEffect } from "react";

interface DashboardHeaderProps {
  batteryPercent: number;
  theme: "light" | "dark";
}

function BatteryLevelIcon({ percent }: { percent: number }) {
  const clamped = Math.max(0, Math.min(100, percent));
  const maxBarWidth = 16.6;
  const barWidth = clamped > 0 ? Math.max(1.5, (clamped / 100) * maxBarWidth) : 0;

  return (
    <svg
      viewBox="0 0 28 16"
      aria-hidden="true"
      className="w-8 h-[19px] md:w-9 md:h-[22px] shrink-0"
    >
      <rect
        x="1.5"
        y="1.5"
        width="22"
        height="13"
        rx="2"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
      />
      <rect x="24.5" y="5" width="2.5" height="6" rx="0.75" fill="currentColor" />
      {barWidth > 0 && (
        <rect
          x="4.2"
          y="4.2"
          width={barWidth}
          height="7.6"
          rx="0.75"
          fill="currentColor"
        />
      )}
    </svg>
  );
}

/**
 * Full-width masthead displaying the 15-minute rounded clock, German date, and battery level.
 */
export default function DashboardHeader({
  batteryPercent,
  theme,
}: DashboardHeaderProps) {
  const isDark = theme === "dark";
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setNow(new Date());
    }, 15000);
    return () => clearInterval(interval);
  }, []);

  const roundedDate = new Date(now);
  const minutes = roundedDate.getMinutes();
  const roundedMinutes = Math.round(minutes / 15) * 15;
  if (roundedMinutes === 60) {
    roundedDate.setHours(roundedDate.getHours() + 1);
    roundedDate.setMinutes(0);
  } else {
    roundedDate.setMinutes(roundedMinutes);
  }

  const timeString = `${String(roundedDate.getHours()).padStart(2, "0")}:${String(roundedDate.getMinutes()).padStart(2, "0")}`;
  const weekdayString = roundedDate
    .toLocaleDateString("de-DE", { weekday: "long" })
    .toUpperCase();
  const dateDetailString = `${roundedDate.getDate()}. ${roundedDate
    .toLocaleDateString("de-DE", { month: "long" })
    .toUpperCase()}`;

  return (
    <header
      className={`flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2 pb-4 border-b-2 ${
        isDark ? "border-white text-white" : "border-black text-black"
      }`}
    >
      <div className="flex flex-wrap items-baseline gap-x-6 gap-y-1">
        <span className="text-6xl font-mono font-black tracking-tight tabular-nums leading-none">
          {timeString}
        </span>
        <span className="text-2xl md:text-3xl font-sans font-black tracking-wide uppercase leading-none whitespace-nowrap">
          {weekdayString}, {dateDetailString}
        </span>
      </div>

      <div
        className="flex items-center gap-2 text-xl md:text-2xl font-mono font-black tracking-tight tabular-nums leading-none self-center"
        aria-label={`Batteriestand ${batteryPercent}%`}
      >
        <BatteryLevelIcon percent={batteryPercent} />
        <span>{batteryPercent}%</span>
      </div>
    </header>
  );
}
