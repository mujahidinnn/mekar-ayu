import { differenceInCalendarDays, format, parseISO } from 'date-fns';
import { id as localeId } from 'date-fns/locale';
import { CareIcon } from '../CareIcon';
import { Header } from '../Header';
import { CalendarGrid } from '../CalendarGrid';
import { StatTile } from './StatsScreen';
import { PHASES } from '../../data/phases';
import type { DailyLog } from '../../db/schema';
import { BLEEDING_INTENSITIES } from '../../lib/cycleMath';
import type { CycleStats } from '../../lib/cycleMath';

function fmt(iso: string) {
  return format(parseISO(iso), 'd MMM', { locale: localeId });
}

function countdown(iso: string) {
  const d = differenceInCalendarDays(parseISO(iso), new Date());
  return d > 0 ? `${d} hari lagi` : d === 0 ? 'Hari ini' : `${-d} hari lalu`;
}

interface CalendarScreenProps {
  visibleMonth: Date;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  onToday: () => void;
  stats: CycleStats;
  dailyLogs: DailyLog[];
  onSelectDate: (dateStr: string) => void;
}

export function CalendarScreen({ visibleMonth, onPrevMonth, onNextMonth, onToday, stats, dailyLogs, onSelectDate }: CalendarScreenProps) {
  const phase = stats.currentPhase ? PHASES[stats.currentPhase] : null;
  const monthPrefix = format(visibleMonth, 'yyyy-MM');
  const monthLogs = dailyLogs.filter((l) => l.date.startsWith(monthPrefix));
  const periodDays = monthLogs.filter((l) => l.flowIntensity && BLEEDING_INTENSITIES.has(l.flowIntensity)).length;
  const noteDays = monthLogs.filter((l) => l.notes).length;
  return (
    <>
      <Header title="Kalender Siklus" visibleMonth={visibleMonth} onPrevMonth={onPrevMonth} onNextMonth={onNextMonth} onToday={onToday}>
        <div className="mt-4 flex items-center justify-center gap-2">
          <span className="inline-flex items-center rounded-full bg-[var(--ink)] px-3 py-1.5 text-xs font-bold text-white dark:text-[#181818]">
            {stats.statusLabel}
          </span>
          {phase && (
            <span className="inline-flex items-center rounded-full bg-white/70 px-3 py-1.5 text-xs font-bold dark:bg-[var(--card)]">{phase.label}</span>
          )}
        </div>
      </Header>
      <main className="flex-1 pb-32 pt-2 lg:grid lg:grid-cols-2 lg:items-start lg:pb-10">
        <CalendarGrid
          mode="cycle"
          visibleMonth={visibleMonth}
          stats={stats}
          dailyLogs={dailyLogs}
          onSelectDate={onSelectDate}
          onSwipePrev={onPrevMonth}
          onSwipeNext={onNextMonth}
        />

        <section className="space-y-4 px-5 lg:pt-4">
          <div>
            <h2 className="mb-3 text-xl font-bold">Agenda</h2>
            {stats.predictedNextPeriodStart ? (
              <div className="card divide-y divide-[var(--line)]">
                <AgendaRow
                  tint="#FFC0DD"
                  icon={<CareIcon name="Haid" size={20} />}
                  label="Haid berikutnya"
                  value={fmt(stats.predictedNextPeriodStart)}
                  sub={countdown(stats.predictedNextPeriodStart)}
                />
                {stats.fertileWindowStart && stats.fertileWindowEnd && (
                  <AgendaRow
                    tint="#F9B892"
                    icon={<CareIcon name="Kesadaran Kesuburan" size={20} />}
                    label="Masa subur"
                    value={`${fmt(stats.fertileWindowStart)} – ${fmt(stats.fertileWindowEnd)}`}
                    sub={countdown(stats.fertileWindowStart)}
                  />
                )}
                {stats.ovulationDate && (
                  <AgendaRow tint="#D7C2F7" icon={<CareIcon name="Ovulasi" size={20} />} label="Perkiraan ovulasi" value={fmt(stats.ovulationDate)} sub={countdown(stats.ovulationDate)} />
                )}
              </div>
            ) : (
              <div className="card p-5 text-sm text-[var(--muted)]">
                Ketuk tanggal, terus pilih aliran haidmu. Begitu satu periode tercatat, perkiraan haid, masa subur, dan ovulasi langsung muncul di sini.
              </div>
            )}
          </div>

          <div className="grid grid-cols-3 gap-3">
            <StatTile label="Hari haid" value={periodDays} unit="Hari" />
            <StatTile label="Tercatat" value={monthLogs.length} unit="Hari" />
            <StatTile label="Catatan" value={noteDays} unit="Hari" />
          </div>
        </section>
      </main>
    </>
  );
}

function AgendaRow({ tint, icon, label, value, sub }: { tint: string; icon: React.ReactNode; label: string; value: string; sub: string }) {
  return (
    <div className="flex items-center gap-3 px-4 py-3.5">
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-[#181818]" style={{ background: tint }}>
        {icon}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-xs text-[var(--muted)]">{label}</span>
        <span className="block text-sm font-bold">{value}</span>
      </span>
      <span className="shrink-0 text-xs font-bold text-[var(--muted)]">{sub}</span>
    </div>
  );
}
