import { useState } from 'react';
import { format } from 'date-fns';
import { ChevronRight } from 'lucide-react';
import type { CycleEntry, DailyLog } from '../../db/schema';
import { getMoodOptions, getSymptomOptions } from '../../data/phases';
import type { MoodKey } from '../../data/phases';
import { FaceDetails, MoodFace } from '../MoodFace';
import { SymptomIcon } from '../SymptomIcon';
import type { CycleStats } from '../../lib/cycleMath';
import { CalendarGrid } from '../CalendarGrid';
import { Header } from '../Header';
import { HistorySheet } from '../HistorySheet';
import { useI18n } from '../../lib/i18n';

interface StatsScreenProps {
  stats: CycleStats;
  cycles: CycleEntry[];
  dailyLogs: DailyLog[];
  visibleMonth: Date;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  onToday: () => void;
  onSelectDate: (dateStr: string) => void;
}

function countByKey(dailyLogs: DailyLog[], monthPrefix: string, pick: (log: DailyLog) => string[]) {
  const count = new Map<string, number>();
  for (const log of dailyLogs) {
    if (!log.date.startsWith(monthPrefix)) continue;
    for (const k of pick(log)) count.set(k, (count.get(k) ?? 0) + 1);
  }
  return count;
}

function topKey(count: Map<string, number>) {
  let best: string | null = null;
  for (const [k, v] of count) if (best === null || v > (count.get(best) ?? 0)) best = k;
  return best;
}

export function StatsScreen({ stats, cycles, dailyLogs, visibleMonth, onPrevMonth, onNextMonth, onToday, onSelectDate }: StatsScreenProps) {
  const { t } = useI18n();
  const [historyOpen, setHistoryOpen] = useState(false);
  const monthPrefix = format(visibleMonth, 'yyyy-MM');
  const moodCount = countByKey(dailyLogs, monthPrefix, (l) => l.moods ?? []);
  const mood = topKey(moodCount) as MoodKey | null;
  const symptomCount = countByKey(dailyLogs, monthPrefix, (l) => l.symptoms ?? []);
  const topSymptoms = getSymptomOptions(t)
    .map((o) => ({ ...o, count: symptomCount.get(o.key) ?? 0 }))
    .filter((o) => o.count > 0)
    .sort((a, b) => b.count - a.count)
    .slice(0, 3);
  const maxSymptom = topSymptoms[0]?.count ?? 1;

  return (
    <>
      <Header title={t.stats.title} visibleMonth={visibleMonth} onPrevMonth={onPrevMonth} onNextMonth={onNextMonth} onToday={onToday} />
      <main className="flex-1 pb-32 pt-2 lg:grid lg:grid-cols-2 lg:items-start lg:pb-10">
        <CalendarGrid
          mode="mood"
          visibleMonth={visibleMonth}
          stats={stats}
          dailyLogs={dailyLogs}
          onSelectDate={onSelectDate}
          onSwipePrev={onPrevMonth}
          onSwipeNext={onNextMonth}
        />

        <div className="space-y-4 pt-4">
        <MoodSummaryCard
          className="mx-5"
          caption={t.stats.moodSummaryCaption}
          label={mood ? t.moods[mood] : t.stats.moodSummaryEmptyTitle}
          mood={mood}
          note={mood ? t.stats.moodNotes[mood] : t.stats.moodSummaryDefaultNote}
        />

        <div className="card mx-5 p-4">
          <p className="text-base font-bold">{t.stats.moodDistribution}</p>
          <div className="mt-3 grid grid-cols-3 gap-2">
            {getMoodOptions(t).map((opt) => (
              <div key={opt.key} className="flex items-center gap-2 rounded-2xl bg-[var(--surface)] p-2">
                <MoodFace mood={opt.key} size={30} />
                <div className="min-w-0">
                  <p className="text-sm font-bold leading-none">{moodCount.get(opt.key) ?? 0}</p>
                  <p className="truncate text-[0.6875rem] text-[var(--muted)]">{opt.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card mx-5 p-4">
          <p className="text-base font-bold">{t.stats.topSignalsTitle}</p>
          {topSymptoms.length === 0 ? (
            <p className="mt-2 text-sm text-[var(--muted)]">{t.stats.topSignalsEmpty}</p>
          ) : (
            <div className="mt-3 space-y-2.5">
              {topSymptoms.map((s) => (
                <div key={s.key} className="flex items-center gap-3 text-sm">
                  <span className="flex w-28 shrink-0 items-center gap-1.5 truncate">
                    <SymptomIcon symptom={s.key} size={16} className="shrink-0" /> {s.label}
                  </span>
                  <div className="h-3 flex-1 overflow-hidden rounded-full bg-[var(--surface)]">
                    <div className="h-full rounded-full bg-[#FFA7DC]" style={{ width: `${(s.count / maxSymptom) * 100}%` }} />
                  </div>
                  <span className="w-5 shrink-0 text-right text-xs font-bold">{s.count}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <h2 className="px-5 pt-2 text-xl font-bold">{t.stats.yourCycleTitle}</h2>
        <div className="grid grid-cols-3 gap-3 px-5">
          <StatTile label={t.stats.cycleLabel} value={stats.avgCycleLength || '–'} unit={t.stats.dayUnit} />
          <StatTile label={t.stats.periodLabel} value={stats.avgPeriodLength || '–'} unit={t.stats.dayUnit} />
          <StatTile label={t.stats.recordedLabel} value={stats.cycleHistory.length} unit={t.stats.cycleUnit} />
        </div>

        <button onClick={() => setHistoryOpen(true)} className="card mx-5 flex w-[calc(100%-2.5rem)] items-center justify-between p-4 text-left transition active:scale-[0.99]">
          <span>
            <span className="block text-base font-bold">{t.stats.historyRowTitle}</span>
            <span className="block text-sm text-[var(--muted)]">{t.stats.historyRowSub}</span>
          </span>
          <ChevronRight size={18} className="shrink-0 text-[var(--muted)]" />
        </button>
        </div>
      </main>

      <HistorySheet open={historyOpen} onClose={() => setHistoryOpen(false)} cycles={cycles} dailyLogs={dailyLogs} stats={stats} />
    </>
  );
}

export function StatTile({ label, value, unit }: { label: string; value: string | number; unit: string }) {
  return (
    <div className="rounded-[20px] bg-[var(--card)] p-4">
      <p className="text-sm text-[var(--muted)]">{label}</p>
      <p className="mt-4 text-[1.4rem] font-bold leading-none">{value}</p>
      <p className="mt-1 text-sm font-bold">{unit}</p>
    </div>
  );
}

function MoodSummaryCard({
  caption,
  label,
  mood,
  note,
  className = '',
}: {
  caption: string;
  label: string;
  mood: MoodKey | null;
  note: string;
  className?: string;
}) {
  return (
    <div className={`relative overflow-hidden rounded-[24px] bg-[linear-gradient(135deg,#FFB49C_0%,#FFA9C8_50%,#EFB6E6_100%)] p-5 text-[#181818] ${className}`}>
      <p className="text-sm">{caption}</p>
      <p className="mt-6 text-[2rem] font-bold leading-none">{label}</p>
      <p className="mt-3 max-w-[62%] text-sm">{note}</p>
      <BigFace mood={mood} className="absolute -right-5 bottom-3 h-28 w-32" />
    </div>
  );
}

function BigFace({ mood, className }: { mood: string | null; className: string }) {
  return (
    <svg viewBox="12 10 66 66" className={className} fill="none" aria-hidden="true">
      <FaceDetails mood={mood ?? 'hp'} />
      {!mood && <path d="M59 20c0-4 6-4 6 0c0 2.7-3 2.7-3 5M62 29v.5" stroke="#181818" strokeWidth="3" strokeLinecap="round" />}
    </svg>
  );
}
