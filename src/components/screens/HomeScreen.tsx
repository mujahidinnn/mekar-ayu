import { useState } from 'react';
import { differenceInCalendarDays, format, parseISO } from 'date-fns';
import { ArrowRight, CircleHelp, PenLine } from 'lucide-react';
import { db } from '../../db/schema';
import type { DailyLog } from '../../db/schema';
import { withSync } from '../../lib/syncStatus';
import { getMoodOptions, PHASE_ICON, PHASE_TINT, selfCareTips } from '../../data/phases';
import type { PhaseKey } from '../../data/phases';
import type { CycleStats } from '../../lib/cycleMath';
import { CareIcon } from '../CareIcon';
import { Logo } from '../Logo';
import { MoodFace } from '../MoodFace';
import { RedFlagBanner } from '../RedFlagBanner';
import { Flower } from '../WelcomeScreen';
import { Sheet } from '../ui/Sheet';
import { useI18n } from '../../lib/i18n';
import type { DateFnsLocale } from '../../lib/i18n';
import type { Translations } from '../../lib/i18n/locales/id';

interface HomeScreenProps {
  stats: CycleStats;
  todayLog: DailyLog | undefined;
  onOpenLogEditor: () => void;
  onSeeAll: () => void;
}

const TIP_TINT = ['#FFA7DC', '#FFB690', '#B5D3F9'];

async function toggleTodayMood(todayLog: DailyLog | undefined, dateStr: string, key: string) {
  const current = todayLog?.moods ?? [];
  const next = current.includes(key) ? current.filter((m) => m !== key) : [...current, key];
  await withSync(() =>
    db.dailyLogs.put({
      date: dateStr,
      flowIntensity: todayLog?.flowIntensity,
      symptoms: todayLog?.symptoms ?? [],
      moods: next,
      notes: todayLog?.notes,
      updatedAt: Date.now(),
    }),
  );
}

function fmt(iso: string, dateFnsLocale: DateFnsLocale, pattern = 'd MMM') {
  return format(parseISO(iso), pattern, { locale: dateFnsLocale });
}

export function HomeScreen({ stats, todayLog, onOpenLogEditor, onSeeAll }: HomeScreenProps) {
  const { t, dateFnsLocale } = useI18n();
  const todayStr = format(new Date(), 'yyyy-MM-dd');
  const [phaseOpen, setPhaseOpen] = useState(false);
  const phase = stats.currentPhase ? t.phases[stats.currentPhase] : null;
  const tips = selfCareTips(t, stats.currentPhase, todayLog?.symptoms, todayLog?.moods);
  const daysLeft = stats.predictedNextPeriodStart
    ? differenceInCalendarDays(parseISO(stats.predictedNextPeriodStart), new Date())
    : null;

  return (
    <main className="flex-1 space-y-6 px-5 pb-32 pt-[max(env(safe-area-inset-top),1.25rem)] lg:pb-10">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Logo size={48} />
          <div>
            <p className="text-base font-bold" translate="no">{t.common.appName}</p>
            <p className="text-xs text-[var(--muted)]">{t.home.appTagline}</p>
          </div>
        </div>
      </div>

      <TodayCard stats={stats} phase={phase} daysLeft={daysLeft} onOpenLogEditor={onOpenLogEditor} />

      <RedFlagBanner flags={stats.redFlags} />

      <div className="space-y-6 lg:grid lg:grid-cols-2 lg:items-start lg:gap-6 lg:space-y-0">
      <section>
        <h2 className="text-xl font-bold">{t.home.moodQuestion}</h2>
        <div className="no-scrollbar -mx-5 flex gap-3 overflow-x-auto px-5 pb-1 pt-4 md:mx-0 md:flex-wrap md:gap-y-6 md:overflow-visible md:px-0">
          {getMoodOptions(t).map((opt) => {
            const active = !!todayLog?.moods.includes(opt.key);
            return (
              <button
                key={opt.key}
                onClick={() => toggleTodayMood(todayLog, todayStr, opt.key)}
                aria-pressed={active}
                className={`relative shrink-0 rounded-full py-2.5 pl-5 pr-9 text-[0.9375rem] font-bold transition active:scale-95 ${
                  active ? 'bg-[var(--ink)] text-white dark:text-[#181818]' : 'bg-white text-[#181818] dark:bg-[var(--card)] dark:text-[var(--ink)]'
                }`}
              >
                <MoodFace mood={opt.key} size={36} className="absolute -top-4 right-1" />
                {opt.label}
              </button>
            );
          })}
        </div>
      </section>

      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-xl font-bold">{t.home.forecastTitle}</h2>
          <button onClick={onSeeAll} className="flex items-center gap-1.5 text-sm font-bold">
            {t.home.seeAll} <ArrowRight size={16} />
          </button>
        </div>
        {phase && stats.currentPhase ? (
          <div className="grid grid-cols-2 gap-3">
            <button onClick={() => setPhaseOpen(true)} className="card relative overflow-hidden p-4 text-left transition active:scale-[0.99]">
              <Flower
                className="pointer-events-none absolute -right-8 top-1/2 h-28 w-28 -translate-y-1/2 opacity-50"
                fill={PHASE_TINT[stats.currentPhase]}
                rotate={18}
              />
              <p className="relative text-xs text-[var(--muted)]">{phase.dayRange}</p>
              <p className="relative mt-1 text-base font-bold">{phase.label}</p>
              <p className="relative mt-1 text-xs leading-relaxed text-[var(--muted)]">{phase.summary}</p>
            </button>
            <div className="card p-4">
              <p className="text-xs text-[var(--muted)]">
                {daysLeft !== null && daysLeft > 0
                  ? t.home.daysLeft(daysLeft)
                  : daysLeft !== null && daysLeft < 0
                    ? t.home.overdue(-daysLeft)
                    : t.home.dueToday}
              </p>
              <p className="mt-1 text-base font-bold">{stats.predictedNextPeriodStart && t.home.periodOn(fmt(stats.predictedNextPeriodStart, dateFnsLocale))}</p>
              <p className="mt-4 text-xs text-[var(--muted)]">
                {stats.fertileWindowStart &&
                  stats.fertileWindowEnd &&
                  t.home.fertileOn(`${fmt(stats.fertileWindowStart, dateFnsLocale)}–${fmt(stats.fertileWindowEnd, dateFnsLocale)}`)}
              </p>
            </div>
          </div>
        ) : (
          <button onClick={onOpenLogEditor} className="card relative w-full overflow-hidden p-5 text-left transition active:scale-[0.99]">
            <Flower className="pointer-events-none absolute -right-8 top-1/2 h-28 w-28 -translate-y-1/2 opacity-50" fill="#F4EAEC" rotate={18} />
            <p className="relative text-base font-bold">{t.home.noForecastTitle}</p>
            <p className="relative mt-1 max-w-[80%] text-sm text-[var(--muted)]">{t.home.noForecastBody}</p>
          </button>
        )}
      </section>
      </div>

      <section>
        <h2 className="mb-3 text-xl font-bold">{t.home.selfCareTitle}</h2>
        {tips.length > 0 ? (
          <div className="no-scrollbar -mx-5 flex gap-3 overflow-x-auto px-5 pb-1 md:mx-0 md:grid md:grid-cols-2 md:overflow-visible md:px-0 lg:grid-cols-3">
            {tips.map((tip, i) => (
              <div key={`${tip.care}-${i}`} className="card w-[76%] shrink-0 p-4 md:w-auto">
                <span
                  className="flex h-14 w-14 items-center justify-center rounded-full text-[#181818]"
                  style={{ background: TIP_TINT[i % TIP_TINT.length] }}
                >
                  <CareIcon name={tip.care} size={34} />
                </span>
                <p className="mt-3 truncate text-xs text-[var(--muted)]">{tip.reason}</p>
                <p className="text-base font-bold">{tip.title}</p>
                <p className="mt-1 text-sm leading-relaxed text-[var(--muted)]">{tip.tip}</p>
              </div>
            ))}
          </div>
        ) : (
          <button onClick={onOpenLogEditor} className="card w-full p-5 text-left transition active:scale-[0.99]">
            <p className="text-base font-bold">{t.home.selfCareEmptyTitle}</p>
            <p className="mt-1 text-sm text-[var(--muted)]">{t.home.selfCareEmptyBody}</p>
          </button>
        )}
      </section>

      {phase && (
        <Sheet open={phaseOpen} onClose={() => setPhaseOpen(false)} title={phase.label}>
          <div className="space-y-4 text-sm">
            <p className="text-[var(--muted)]">{phase.dayRange}</p>
            <div>
              <p className="mb-1 font-bold">{t.home.phaseSheetBodyNow}</p>
              <p className="text-[var(--muted)]">{phase.hormonal}</p>
            </div>
            <div>
              <p className="mb-1 font-bold">{t.home.phaseSheetBodyFeel}</p>
              <p className="text-[var(--muted)]">{phase.bodyExperience}</p>
            </div>
            <div>
              <p className="mb-1 font-bold">{t.home.phaseSheetSelfCare}</p>
              <ul className="space-y-1.5">
                {phase.selfCare.map((tip) => (
                  <li key={tip.care} className="text-[var(--muted)]">
                    <span className="font-bold text-[var(--ink)]">{t.careTitles[tip.care]}:</span> {tip.tip}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Sheet>
      )}
    </main>
  );
}

function TodayCard({
  stats,
  phase,
  daysLeft,
  onOpenLogEditor,
}: {
  stats: CycleStats;
  phase: Translations['phases'][PhaseKey] | null;
  daysLeft: number | null;
  onOpenLogEditor: () => void;
}) {
  const { t, dateFnsLocale } = useI18n();
  const today = format(new Date(), 'EEEE, d MMMM', { locale: dateFnsLocale });
  const title = stats.isPeriodActive
    ? t.home.todayActive(stats.currentCycleDay ?? '–')
    : stats.predictedNextPeriodStart
      ? daysLeft !== null && daysLeft > 0
        ? t.home.todayCountdown(daysLeft)
        : daysLeft !== null && daysLeft < 0
          ? t.home.todayOverdue(-daysLeft)
          : t.home.todayDueToday
      : t.home.todayUnknown;

  return (
    <button
      onClick={onOpenLogEditor}
      className="w-full rounded-[24px] bg-[linear-gradient(135deg,#FFB49C_0%,#FFA9C8_50%,#EFB6E6_100%)] p-5 text-left text-[#181818] transition active:scale-[0.99]"
    >
      <p className="text-sm text-[#181818]/70">{today}</p>
      <p className="mt-1 text-[1.35rem] font-bold leading-tight">{title}</p>
      <div className="mt-5 flex items-center gap-3">
        <span
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white/60 text-[#181818]"
        >
          {stats.currentPhase ? <CareIcon name={PHASE_ICON[stats.currentPhase]} size={22} /> : <CircleHelp size={20} />}
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-base font-bold">{phase ? phase.label : t.home.noLogTitle}</p>
          <p className="text-sm text-[#181818]/70">{phase ? phase.dayRange : t.home.noLogSubtitle}</p>
        </div>
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#181818] text-white">
          <PenLine size={17} />
        </span>
      </div>
    </button>
  );
}
