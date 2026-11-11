import { useState, useEffect } from "react";
import { Battery } from "lucide-react";

interface DashboardHeaderProps {
  batteryPercent: number;
  theme: "light" | "dark";
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

      <div className="flex items-center gap-1.5 text-sm font-mono font-black tracking-tight self-center">
        <Battery size={20} strokeWidth={2.5} />
        <span>{batteryPercent}%</span>
      </div>
    </header>
  );
}
