import { useState } from 'react';
import { format } from 'date-fns';
import { ChevronRight } from 'lucide-react';
import type { CycleEntry, DailyLog } from '../../db/schema';
import { MOOD_OPTIONS, SYMPTOM_OPTIONS } from '../../data/phases';
import { FaceDetails, MoodFace } from '../MoodFace';
import { SymptomIcon } from '../SymptomIcon';
import type { CycleStats } from '../../lib/cycleMath';
import { CalendarGrid } from '../CalendarGrid';
import { Header } from '../Header';
import { HistorySheet } from '../HistorySheet';

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

const MOOD_NOTE: Record<string, string> = {
  hp: 'Bulan ini kamu banyak happy-nya. Keep glowing, ya!',
  ir: 'Lagi gampang kesel? Wajar banget, kok. Ambil jeda dulu, ya.',
  ax: 'Lagi sering overthinking, ya? Tarik napas pelan, satu-satu aja.',
  sd: 'Bulan ini lagi sering sedih. Nggak apa-apa, kamu nggak sendirian.',
  en: 'Energimu lagi full! Pas banget buat coba hal baru.',
  cl: 'Vibes kamu lagi adem dan stabil. Nikmatin aja, ya.',
  cf: 'Lagi pede-pedenya, nih. Bawa terus energi itu, ya!',
  ss: 'Lagi gampang baper bulan ini. Perasaanmu valid, kok.',
  st: 'Bulan ini lumayan bikin stres, ya. Jangan lupa kasih jeda buat dirimu.',
  um: 'Lagi sering mager? Nggak apa-apa, tubuhmu mungkin butuh rehat.',
};

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
  const [historyOpen, setHistoryOpen] = useState(false);
  const monthPrefix = format(visibleMonth, 'yyyy-MM');
  const moodCount = countByKey(dailyLogs, monthPrefix, (l) => l.moods ?? []);
  const mood = topKey(moodCount);
  const symptomCount = countByKey(dailyLogs, monthPrefix, (l) => l.symptoms ?? []);
  const topSymptoms = SYMPTOM_OPTIONS.map((o) => ({ ...o, count: symptomCount.get(o.key) ?? 0 }))
    .filter((o) => o.count > 0)
    .sort((a, b) => b.count - a.count)
    .slice(0, 3);
  const maxSymptom = topSymptoms[0]?.count ?? 1;

  return (
    <>
      <Header title="Kalender Mood" visibleMonth={visibleMonth} onPrevMonth={onPrevMonth} onNextMonth={onNextMonth} onToday={onToday} />
      <main className="flex-1 space-y-4 pb-32 pt-2">
        <CalendarGrid
          mode="mood"
          visibleMonth={visibleMonth}
          stats={stats}
          dailyLogs={dailyLogs}
          onSelectDate={onSelectDate}
          onSwipePrev={onPrevMonth}
          onSwipeNext={onNextMonth}
        />

        <MoodSummaryCard
          className="mx-5"
          caption="Ringkasan mood bulan ini"
          mood={mood}
          emptyTitle="Belum ada"
          note={mood ? MOOD_NOTE[mood] : 'Pilih mood di Beranda tiap hari, nanti rekapnya muncul di sini.'}
        />

        <div className="card mx-5 p-4">
          <p className="text-base font-bold">Sebaran mood</p>
          <div className="mt-3 grid grid-cols-3 gap-2">
            {MOOD_OPTIONS.map((opt) => (
              <div key={opt.key} className="flex items-center gap-2 rounded-2xl bg-[var(--surface)] p-2">
                <MoodFace mood={opt.key} size={30} />
                <div className="min-w-0">
                  <p className="text-sm font-bold leading-none">{moodCount.get(opt.key) ?? 0}</p>
                  <p className="truncate text-[11px] text-[var(--muted)]">{opt.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card mx-5 p-4">
          <p className="text-base font-bold">Sinyal tubuh tersering</p>
          {topSymptoms.length === 0 ? (
            <p className="mt-2 text-sm text-[var(--muted)]">Belum ada sinyal tubuh yang tercatat bulan ini. Ketuk tanggal di kalender buat mulai catat.</p>
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

        <h2 className="px-5 pt-2 text-xl font-bold">Siklus kamu</h2>
        <div className="grid grid-cols-3 gap-3 px-5">
          <StatTile label="Siklus" value={stats.avgCycleLength || '–'} unit="Hari" />
          <StatTile label="Haid" value={stats.avgPeriodLength || '–'} unit="Hari" />
          <StatTile label="Tercatat" value={stats.cycleHistory.length} unit="Siklus" />
        </div>

        <button onClick={() => setHistoryOpen(true)} className="card mx-5 flex w-[calc(100%-2.5rem)] items-center justify-between p-4 text-left transition active:scale-[0.99]">
          <span>
            <span className="block text-base font-bold">Riwayat & tren siklus</span>
            <span className="block text-sm text-[var(--muted)]">Lihat semua siklus yang udah tercatat</span>
          </span>
          <ChevronRight size={18} className="shrink-0 text-[var(--muted)]" />
        </button>
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
  mood,
  emptyTitle,
  note,
  className = '',
}: {
  caption: string;
  mood: string | null;
  emptyTitle: string;
  note: string;
  className?: string;
}) {
  return (
    <div className={`relative overflow-hidden rounded-[24px] bg-[linear-gradient(135deg,#FFB49C_0%,#FFA9C8_50%,#EFB6E6_100%)] p-5 text-[#181818] ${className}`}>
      <p className="text-sm">{caption}</p>
      <p className="mt-6 text-[2rem] font-bold leading-none">{MOOD_OPTIONS.find((m) => m.key === mood)?.label ?? emptyTitle}</p>
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
