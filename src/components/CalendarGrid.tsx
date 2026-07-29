import { useMemo, useRef } from 'react';
import {
  addDays,
  endOfMonth,
  endOfWeek,
  format,
  isSameMonth,
  isToday,
  startOfMonth,
  startOfWeek,
} from 'date-fns';
import type { DailyLog } from '../db/schema';
import type { CycleStats } from '../lib/cycleMath';
import { getDayBadges } from '../lib/dayBadges';

interface CalendarGridProps {
  visibleMonth: Date;
  stats: CycleStats;
  dailyLogs: DailyLog[];
  onSelectDate: (dateStr: string) => void;
  onSwipePrev: () => void;
  onSwipeNext: () => void;
}

const WEEKDAYS = ['M', 'S', 'S', 'R', 'K', 'J', 'S'];

export function CalendarGrid({ visibleMonth, stats, dailyLogs, onSelectDate, onSwipePrev, onSwipeNext }: CalendarGridProps) {
  const logsByDate = useMemo(() => {
    const map = new Map<string, DailyLog>();
    for (const log of dailyLogs) map.set(log.date, log);
    return map;
  }, [dailyLogs]);

  const days = useMemo(() => {
    const start = startOfWeek(startOfMonth(visibleMonth), { weekStartsOn: 1 });
    const end = endOfWeek(endOfMonth(visibleMonth), { weekStartsOn: 1 });
    const result: Date[] = [];
    let cursor = start;
    while (cursor <= end) {
      result.push(cursor);
      cursor = addDays(cursor, 1);
    }
    return result;
  }, [visibleMonth]);

  const touchStartX = useRef<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const delta = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(delta) > 60) {
      if (delta > 0) onSwipePrev();
      else onSwipeNext();
    }
    touchStartX.current = null;
  };

  return (
    <div className="px-3 py-3" onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
      <div className="mb-1 grid grid-cols-7 text-center text-xs font-semibold text-rose-400">
        {WEEKDAYS.map((d, i) => (
          <div key={i}>{d}</div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-y-1">
        {days.map((day) => {
          const dateStr = format(day, 'yyyy-MM-dd');
          const badges = getDayBadges(dateStr, stats, logsByDate.get(dateStr));
          const inMonth = isSameMonth(day, visibleMonth);
          const today = isToday(day);

          let circleClasses = 'text-rose-950 dark:text-rose-100';
          if (badges.isLoggedPeriod) {
            circleClasses = 'bg-rose-500 text-white shadow-sm';
          } else if (badges.isPredictedPeriod) {
            circleClasses = 'bg-rose-200 text-rose-900';
          } else if (badges.isOvulationDay) {
            circleClasses = 'bg-purple-300 text-purple-950';
          } else if (badges.isFertileWindow) {
            circleClasses = 'bg-amber-200 text-amber-950';
          }

          return (
            <button
              key={dateStr}
              onClick={() => onSelectDate(dateStr)}
              className={`relative mx-auto flex h-11 w-11 flex-col items-center justify-center rounded-full text-sm font-medium transition active:scale-95 ${
                inMonth ? '' : 'opacity-30'
              } ${circleClasses} ${today && !badges.isLoggedPeriod ? 'ring-2 ring-rose-400 ring-offset-1' : ''}`}
            >
              {format(day, 'd')}
              {badges.hasNote && (
                <span className="absolute bottom-1 h-1 w-1 rounded-full bg-current opacity-70" />
              )}
            </button>
          );
        })}
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-[11px] text-rose-900/70 dark:text-stone-400">
        <LegendDot className="bg-rose-500" label="Menstruasi" />
        <LegendDot className="bg-rose-200" label="Estimasi" />
        <LegendDot className="bg-amber-200" label="Masa Subur" />
        <LegendDot className="bg-purple-300" label="Ovulasi" />
      </div>
    </div>
  );
}

function LegendDot({ className, label }: { className: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <span className={`h-2.5 w-2.5 rounded-full ${className}`} />
      {label}
    </span>
  );
}
