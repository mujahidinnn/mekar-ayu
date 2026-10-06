import { differenceInCalendarDays, format, parseISO } from 'date-fns';
import { CareIcon } from '../CareIcon';
import { Header } from '../Header';
import { CalendarGrid } from '../CalendarGrid';
import { StatTile } from './StatsScreen';
import type { DailyLog } from '../../db/schema';
import { BLEEDING_INTENSITIES } from '../../lib/cycleMath';
import type { CycleStats, CycleStatus } from '../../lib/cycleMath';
import { useI18n } from '../../lib/i18n';
import type { DateFnsLocale } from '../../lib/i18n';
import type { Translations } from '../../lib/i18n/locales/id';

function fmt(iso: string, dateFnsLocale: DateFnsLocale) {
  return format(parseISO(iso), 'd MMM', { locale: dateFnsLocale });
}

function countdown(iso: string, t: Translations) {
  const d = differenceInCalendarDays(parseISO(iso), new Date());
  return d > 0 ? t.calendar.countdownDaysLeft(d) : d === 0 ? t.calendar.countdownToday : t.calendar.countdownDaysAgo(-d);
}

function formatStatus(t: Translations, status: CycleStatus) {
  switch (status.kind) {
    case 'active':
      return t.cycleStatus.active(status.day);
    case 'countdown':
      return t.cycleStatus.countdown(status.days);
    case 'dueToday':
      return t.cycleStatus.dueToday;
    case 'overdue':
      return t.cycleStatus.overdue(status.days);
    default:
      return t.cycleStatus.unknown;
  }
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
  const { t, dateFnsLocale } = useI18n();
  const phase = stats.currentPhase ? t.phases[stats.currentPhase] : null;
  const monthPrefix = format(visibleMonth, 'yyyy-MM');
  const monthLogs = dailyLogs.filter((l) => l.date.startsWith(monthPrefix));
  const periodDays = monthLogs.filter((l) => l.flowIntensity && BLEEDING_INTENSITIES.has(l.flowIntensity)).length;
  const noteDays = monthLogs.filter((l) => l.notes).length;
  return (
    <>
      <Header title={t.calendar.title} visibleMonth={visibleMonth} onPrevMonth={onPrevMonth} onNextMonth={onNextMonth} onToday={onToday}>
        <div className="mt-4 flex items-center justify-center gap-2">
          <span className="inline-flex items-center rounded-full bg-[var(--ink)] px-3 py-1.5 text-xs font-bold text-white dark:text-[#181818]">
            {formatStatus(t, stats.status)}
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
            <h2 className="mb-3 text-xl font-bold">{t.calendar.agenda}</h2>
            {stats.predictedNextPeriodStart ? (
              <div className="card divide-y divide-[var(--line)]">
                <AgendaRow
                  tint="#FFC0DD"
                  icon={<CareIcon name="period" size={20} />}
                  label={t.calendar.nextPeriod}
                  value={fmt(stats.predictedNextPeriodStart, dateFnsLocale)}
                  sub={countdown(stats.predictedNextPeriodStart, t)}
                />
                {stats.fertileWindowStart && stats.fertileWindowEnd && (
                  <AgendaRow
                    tint="#F9B892"
                    icon={<CareIcon name="fertility" size={20} />}
                    label={t.calendar.fertileWindow}
                    value={`${fmt(stats.fertileWindowStart, dateFnsLocale)} – ${fmt(stats.fertileWindowEnd, dateFnsLocale)}`}
                    sub={countdown(stats.fertileWindowStart, t)}
                  />
                )}
                {stats.ovulationDate && (
                  <AgendaRow
                    tint="#D7C2F7"
                    icon={<CareIcon name="ovulation" size={20} />}
                    label={t.calendar.estimatedOvulation}
                    value={fmt(stats.ovulationDate, dateFnsLocale)}
                    sub={countdown(stats.ovulationDate, t)}
                  />
                )}
              </div>
            ) : (
              <div className="card p-5 text-sm text-[var(--muted)]">{t.calendar.agendaEmpty}</div>
            )}
          </div>

          <div className="grid grid-cols-3 gap-3">
            <StatTile label={t.calendar.periodDaysLabel} value={periodDays} unit={t.calendar.dayUnit} />
            <StatTile label={t.calendar.loggedLabel} value={monthLogs.length} unit={t.calendar.dayUnit} />
            <StatTile label={t.calendar.notesLabel} value={noteDays} unit={t.calendar.dayUnit} />
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
