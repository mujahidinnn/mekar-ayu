import { useState } from 'react';
import { differenceInCalendarDays, format, parseISO } from 'date-fns';
import { id as localeId } from 'date-fns/locale';
import { ArrowRight, CircleHelp, PenLine } from 'lucide-react';
import { db } from '../../db/schema';
import type { DailyLog } from '../../db/schema';
import { withSync } from '../../lib/syncStatus';
import { MOOD_OPTIONS, PHASE_ICON, PHASE_TINT, PHASES, selfCareTips } from '../../data/phases';
import type { CycleStats } from '../../lib/cycleMath';
import { CareIcon } from '../CareIcon';
import { Logo } from '../Logo';
import { MoodFace } from '../MoodFace';
import { RedFlagBanner } from '../RedFlagBanner';
import { Flower } from '../WelcomeScreen';
import { Sheet } from '../ui/Sheet';

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

function fmt(iso: string, pattern = 'd MMM') {
  return format(parseISO(iso), pattern, { locale: localeId });
}

export function HomeScreen({ stats, todayLog, onOpenLogEditor, onSeeAll }: HomeScreenProps) {
  const todayStr = format(new Date(), 'yyyy-MM-dd');
  const [phaseOpen, setPhaseOpen] = useState(false);
  const phase = stats.currentPhase ? PHASES[stats.currentPhase] : null;
  const tips = selfCareTips(stats.currentPhase, todayLog?.symptoms, todayLog?.moods);
  const daysLeft = stats.predictedNextPeriodStart
    ? differenceInCalendarDays(parseISO(stats.predictedNextPeriodStart), new Date())
    : null;

  return (
    <main className="flex-1 space-y-6 px-5 pb-32 pt-[max(env(safe-area-inset-top),1.25rem)] lg:pb-10">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Logo size={48} />
          <div>
            <p className="text-base font-bold">Mekar Ayu</p>
            <p className="text-xs text-[var(--muted)]">Memahami Siklusmu, Merawat Anggunmu.</p>
          </div>
        </div>
      </div>

      <TodayCard stats={stats} phase={phase} daysLeft={daysLeft} onOpenLogEditor={onOpenLogEditor} />

      <RedFlagBanner flags={stats.redFlags} />

      <div className="space-y-6 lg:grid lg:grid-cols-2 lg:items-start lg:gap-6 lg:space-y-0">
      <section>
        <h2 className="text-xl font-bold">Gimana mood kamu hari ini?</h2>
        <div className="no-scrollbar -mx-5 flex gap-3 overflow-x-auto px-5 pb-1 pt-4 md:mx-0 md:flex-wrap md:gap-y-6 md:overflow-visible md:px-0">
          {MOOD_OPTIONS.map((opt) => {
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
          <h2 className="text-xl font-bold">Perkiraan</h2>
          <button onClick={onSeeAll} className="flex items-center gap-1.5 text-sm font-bold">
            Lihat semua <ArrowRight size={16} />
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
              <p className="relative mt-1 text-base font-bold">{phase.label.replace('Fase ', '')}</p>
              <p className="relative mt-1 text-xs leading-relaxed text-[var(--muted)]">{phase.summary}</p>
            </button>
            <div className="card p-4">
              <p className="text-xs text-[var(--muted)]">{daysLeft !== null && daysLeft > 0 ? `${daysLeft} hari lagi` : 'Diperkirakan hari ini'}</p>
              <p className="mt-1 text-base font-bold">{stats.predictedNextPeriodStart && `Haid ${fmt(stats.predictedNextPeriodStart)}`}</p>
              <p className="mt-4 text-xs text-[var(--muted)]">
                {stats.fertileWindowStart && stats.fertileWindowEnd && `Subur ${fmt(stats.fertileWindowStart)}–${fmt(stats.fertileWindowEnd)}`}
              </p>
            </div>
          </div>
        ) : (
          <button onClick={onOpenLogEditor} className="card relative w-full overflow-hidden p-5 text-left transition active:scale-[0.99]">
            <Flower className="pointer-events-none absolute -right-8 top-1/2 h-28 w-28 -translate-y-1/2 opacity-50" fill="#F4EAEC" rotate={18} />
            <p className="relative text-base font-bold">Belum ada perkiraan</p>
            <p className="relative mt-1 max-w-[80%] text-sm text-[var(--muted)]">Catat haid pertamamu dulu, nanti fase, jadwal haid, dan masa subur muncul di sini.</p>
          </button>
        )}
      </section>
      </div>

      <section>
        <h2 className="mb-3 text-xl font-bold">Self-care</h2>
        {tips.length > 0 ? (
          <div className="no-scrollbar -mx-5 flex gap-3 overflow-x-auto px-5 pb-1 md:mx-0 md:grid md:grid-cols-2 md:overflow-visible md:px-0 lg:grid-cols-3">
            {tips.map((tip, i) => (
              <div key={tip.tip} className="card w-[76%] shrink-0 p-4 md:w-auto">
                <span
                  className="flex h-14 w-14 items-center justify-center rounded-full text-[#181818]"
                  style={{ background: TIP_TINT[i % TIP_TINT.length] }}
                >
                  <CareIcon name={tip.title} size={34} />
                </span>
                <p className="mt-3 truncate text-xs text-[var(--muted)]">{tip.reason}</p>
                <p className="text-base font-bold">{tip.title}</p>
                <p className="mt-1 text-sm leading-relaxed text-[var(--muted)]">{tip.tip}</p>
              </div>
            ))}
          </div>
        ) : (
          <button onClick={onOpenLogEditor} className="card w-full p-5 text-left transition active:scale-[0.99]">
            <p className="text-base font-bold">Yuk, catat hari pertama haidmu</p>
            <p className="mt-1 text-sm text-[var(--muted)]">Nanti tips self-care yang cocok sama fasemu muncul di sini.</p>
          </button>
        )}
      </section>

      {phase && (
        <Sheet open={phaseOpen} onClose={() => setPhaseOpen(false)} title={phase.label}>
          <div className="space-y-4 text-sm">
            <p className="text-[var(--muted)]">{phase.dayRange}</p>
            <div>
              <p className="mb-1 font-bold">Yang lagi terjadi di tubuhmu</p>
              <p className="text-[var(--muted)]">{phase.hormonal}</p>
            </div>
            <div>
              <p className="mb-1 font-bold">Yang mungkin kamu rasakan</p>
              <p className="text-[var(--muted)]">{phase.bodyExperience}</p>
            </div>
            <div>
              <p className="mb-1 font-bold">Tips self-care</p>
              <ul className="space-y-1.5">
                {phase.selfCare.map((tip) => (
                  <li key={tip.title} className="text-[var(--muted)]">
                    <span className="font-bold text-[var(--ink)]">{tip.title}:</span> {tip.tip}
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
  phase: (typeof PHASES)[keyof typeof PHASES] | null;
  daysLeft: number | null;
  onOpenLogEditor: () => void;
}) {
  const today = format(new Date(), 'EEEE, d MMMM', { locale: localeId });
  const title = stats.isPeriodActive
    ? `Menstruasi hari ke-${stats.currentCycleDay ?? '–'}`
    : stats.predictedNextPeriodStart
      ? daysLeft !== null && daysLeft > 0
        ? `${daysLeft} hari menuju haid`
        : 'Haid diperkirakan hari ini'
      : 'Yuk, kenali siklusmu';

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
          <p className="truncate text-base font-bold">{phase ? phase.label : 'Belum ada catatan'}</p>
          <p className="text-sm text-[#181818]/70">{phase ? phase.dayRange : 'Ketuk untuk mencatat hari pertamamu'}</p>
        </div>
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#181818] text-white">
          <PenLine size={17} />
        </span>
      </div>
    </button>
  );
}
