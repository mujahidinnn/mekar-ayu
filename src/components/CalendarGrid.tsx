import { useMemo, useRef } from 'react';
import { addDays, endOfMonth, endOfWeek, format, isSameMonth, isToday, startOfMonth, startOfWeek } from 'date-fns';
import type { DailyLog } from '../db/schema';
import type { CycleStats } from '../lib/cycleMath';
import { getDayBadges } from '../lib/dayBadges';
import { MoodFace } from './MoodFace';

interface CalendarGridProps {
  visibleMonth: Date;
  stats: CycleStats;
  dailyLogs: DailyLog[];
  onSelectDate: (dateStr: string) => void;
  onSwipePrev: () => void;
  onSwipeNext: () => void;
  mode: 'mood' | 'cycle';
}

const WEEKDAYS = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];
const CELL = 'relative mx-auto flex h-11 w-11 items-center justify-center rounded-[16px] transition active:scale-95';

export function CalendarGrid({ visibleMonth, stats, dailyLogs, onSelectDate, onSwipePrev, onSwipeNext, mode }: CalendarGridProps) {
  const logsByDate = useMemo(() => new Map(dailyLogs.map((l) => [l.date, l])), [dailyLogs]);

  const days = useMemo(() => {
    const start = startOfWeek(startOfMonth(visibleMonth));
    const end = endOfWeek(endOfMonth(visibleMonth));
    const result: Date[] = [];
    for (let cursor = start; cursor <= end; cursor = addDays(cursor, 1)) result.push(cursor);
    return result;
  }, [visibleMonth]);

  const touchStartX = useRef<number | null>(null);
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const delta = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(delta) > 60) (delta > 0 ? onSwipePrev : onSwipeNext)();
    touchStartX.current = null;
  };

  return (
    <div className="px-5 py-4" onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
      <div className="mb-3 grid grid-cols-7 text-center text-sm font-bold text-[var(--muted)]">
        {WEEKDAYS.map((d) => (
          <div key={d}>{d}</div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-y-2">
        {days.map((day) => {
          const dateStr = format(day, 'yyyy-MM-dd');
          const log = logsByDate.get(dateStr);
          const badges = getDayBadges(dateStr, stats, log);
          const inMonth = isSameMonth(day, visibleMonth);
          const moodKey = log?.moods?.[0];
          const label = format(day, 'd MMMM');
          const ring = isToday(day) ? 'ring-2 ring-[var(--ink)] ring-offset-2 ring-offset-[var(--wash-mid)]' : '';

          if (mode === 'mood' && !inMonth) return <div key={dateStr} />;

          if (mode === 'mood' && moodKey) {
            return (
              <button key={dateStr} onClick={() => onSelectDate(dateStr)} aria-label={label} className={`${CELL} ${inMonth ? '' : 'opacity-50'} ${ring}`}>
                <MoodFace mood={moodKey} size={44} />
              </button>
            );
          }

          let tone = 'bg-white/70 text-[#9a9498] dark:bg-[var(--card)] dark:text-[#757074]';
          let content: React.ReactNode =
            mode === 'mood' ? <span className="h-0.5 w-4 rounded-full bg-current" /> : <span className="text-sm font-bold text-[var(--muted)]">{format(day, 'd')}</span>;

          if (mode === 'cycle') {
            if (badges.isLoggedPeriod) {
              tone = 'bg-[#E5484D] text-white';
              content = <span className="text-sm font-bold">{format(day, 'd')}</span>;
            } else if (badges.isPredictedPeriod) {
              tone = 'bg-[#FFC0DD] text-[#181818] border-2 border-dashed border-[#E5484D]';
              content = <span className="text-sm font-bold">{format(day, 'd')}</span>;
            } else if (badges.isOvulationDay) {
              tone = 'bg-[#D7C2F7] text-[#181818]';
              content = <span className="text-sm font-bold">{format(day, 'd')}</span>;
            } else if (badges.isFertileWindow) {
              tone = 'bg-[#F9B892] text-[#181818]';
              content = <span className="text-sm font-bold">{format(day, 'd')}</span>;
            }
          }

          return (
            <button key={dateStr} onClick={() => onSelectDate(dateStr)} aria-label={label} className={`${CELL} ${tone} ${inMonth ? '' : 'opacity-50'} ${ring}`}>
              {content}
              {mode === 'cycle' && badges.hasNote && <span className="absolute bottom-1 h-1 w-1 rounded-full bg-current" />}
            </button>
          );
        })}
      </div>

      {mode === 'cycle' && (
        <div className="mx-auto mt-5 flex w-fit flex-wrap items-center justify-center gap-x-4 gap-y-2 rounded-3xl bg-white/70 px-4 py-2 text-xs font-bold dark:bg-[var(--card)]">
          <LegendDot color="#E5484D" label="Haid" />
          <LegendDot color="#FFC0DD" label="Perkiraan haid" className="border border-dashed border-[#E5484D]" />
          <LegendDot color="#F9B892" label="Masa subur" />
          <LegendDot color="#D7C2F7" label="Ovulasi" />
          <span className="inline-flex items-center gap-1.5">
            <span className="mx-[3px] h-1 w-1 rounded-full bg-[var(--muted)]" />
            Ada catatan
          </span>
        </div>
      )}
    </div>
  );
}

function LegendDot({ color, label, className = '' }: { color: string; label: string; className?: string }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <span className={`h-2.5 w-2.5 rounded-full ${className}`} style={{ background: color }} />
      {label}
    </span>
  );
}
