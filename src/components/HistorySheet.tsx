import { useMemo } from 'react';
import { format, parseISO } from 'date-fns';
import { Sheet } from './ui/Sheet';
import type { CycleEntry, DailyLog } from '../db/schema';
import type { CycleStats } from '../lib/cycleMath';
import { getSymptomOptions } from '../data/phases';
import { SymptomIcon } from './SymptomIcon';
import { useI18n } from '../lib/i18n';

interface HistorySheetProps {
  open: boolean;
  onClose: () => void;
  cycles: CycleEntry[];
  dailyLogs: DailyLog[];
  stats: CycleStats;
}

const NORMAL_MIN = 21;
const NORMAL_MAX = 35;
const MAX_CYCLES_SHOWN = 12;
const CHART_HEIGHT = 160;
const BAR_WIDTH = 28;
const BAR_GAP = 10;

export function HistorySheet({ open, onClose, cycles, dailyLogs, stats }: HistorySheetProps) {
  const { t, dateFnsLocale } = useI18n();
  const sortedCycles = useMemo(() => [...cycles].sort((a, b) => a.startDate.localeCompare(b.startDate)), [cycles]);

  const recentCyclesWithLength = useMemo(
    () => sortedCycles.filter((c): c is CycleEntry & { cycleLength: number } => typeof c.cycleLength === 'number').slice(-MAX_CYCLES_SHOWN),
    [sortedCycles],
  );

  const symptomCounts = useMemo(() => {
    const counts = new Map<string, number>();
    for (const log of dailyLogs) {
      for (const s of log.symptoms) counts.set(s, (counts.get(s) ?? 0) + 1);
    }
    return getSymptomOptions(t)
      .map((opt) => ({ ...opt, count: counts.get(opt.key) ?? 0 }))
      .filter((s) => s.count > 0)
      .sort((a, b) => b.count - a.count)
      .slice(0, 6);
  }, [dailyLogs, t]);

  const maxDay = Math.max(NORMAL_MAX + 5, ...recentCyclesWithLength.map((c) => c.cycleLength), 1);
  const maxSymptomCount = Math.max(1, ...symptomCounts.map((s) => s.count));
  const chartWidth = Math.max(recentCyclesWithLength.length * (BAR_WIDTH + BAR_GAP) + BAR_GAP, 280);

  return (
    <Sheet open={open} onClose={onClose} title={t.historySheet.title}>
      <div className="space-y-6 pb-4">
        <div className="grid grid-cols-3 gap-2 text-center">
          <StatTile label={t.historySheet.avgCycle} value={t.historySheet.daysSuffix(stats.avgCycleLength)} />
          <StatTile label={t.historySheet.avgPeriod} value={t.historySheet.daysSuffix(stats.avgPeriodLength)} />
          <StatTile label={t.historySheet.recordedCycles} value={`${cycles.length}`} />
        </div>

        <section>
          <h3 className="mb-1 text-sm font-semibold text-[var(--ink)]">{t.historySheet.cycleLengthTitle}</h3>
          <p className="mb-3 text-xs text-[var(--muted)]">{t.historySheet.cycleLengthHint}</p>
          {recentCyclesWithLength.length === 0 ? (
            <EmptyNote text={t.historySheet.emptyTrend} />
          ) : (
            <>
              <div className="overflow-x-auto">
                <svg width={chartWidth} height={CHART_HEIGHT + 30} role="img" aria-label={t.historySheet.chartAriaLabel}>
                  <rect
                    x={0}
                    y={CHART_HEIGHT - (NORMAL_MAX / maxDay) * CHART_HEIGHT}
                    width="100%"
                    height={((NORMAL_MAX - NORMAL_MIN) / maxDay) * CHART_HEIGHT}
                    className="fill-[var(--surface)]"
                  />
                  {recentCyclesWithLength.map((c, i) => {
                    const length = c.cycleLength;
                    const barHeight = (length / maxDay) * CHART_HEIGHT;
                    const x = BAR_GAP + i * (BAR_WIDTH + BAR_GAP);
                    const y = CHART_HEIGHT - barHeight;
                    const isAbnormal = length < NORMAL_MIN || length > NORMAL_MAX;
                    return (
                      <g key={c.startDate}>
                        <rect
                          x={x}
                          y={y}
                          width={BAR_WIDTH}
                          height={barHeight}
                          rx={4}
                          className={isAbnormal ? 'fill-amber-500' : 'fill-[#FFA7DC]'}
                        />
                        <text
                          x={x + BAR_WIDTH / 2}
                          y={y - 6}
                          textAnchor="middle"
                          fontSize="10"
                          fontWeight="600"
                          className="fill-[var(--ink)]"
                        >
                          {length}
                        </text>
                        <text
                          x={x + BAR_WIDTH / 2}
                          y={CHART_HEIGHT + 16}
                          textAnchor="middle"
                          fontSize="9"
                          className="fill-[var(--muted)]"
                        >
                          {format(parseISO(c.startDate), 'd/M')}
                        </text>
                      </g>
                    );
                  })}
                </svg>
              </div>
              <div className="mt-2 flex items-center justify-center gap-4 text-[0.6875rem] text-[var(--muted)]">
                <LegendDot className="bg-[#FFA7DC]" label={t.historySheet.legendNormal} />
                <LegendDot className="bg-amber-500" label={t.historySheet.legendAbnormal} />
              </div>
            </>
          )}
        </section>

        <section>
          <h3 className="mb-3 text-sm font-semibold text-[var(--ink)]">{t.historySheet.topSignalsTitle}</h3>
          {symptomCounts.length === 0 ? (
            <EmptyNote text={t.historySheet.emptySignals} />
          ) : (
            <div className="space-y-2">
              {symptomCounts.map((s) => (
                <div key={s.key} className="flex items-center gap-2 text-sm">
                  <span className="w-28 shrink-0 truncate text-[var(--muted)]">
                    <SymptomIcon symptom={s.key} size={14} className="mr-1 inline-block align-[-2px]" />
                    {s.label}
                  </span>
                  <div className="h-4 flex-1 overflow-hidden rounded-full bg-[var(--surface)]">
                    <div
                      className="h-full rounded-full bg-[#FFA7DC]"
                      style={{ width: `${(s.count / maxSymptomCount) * 100}%` }}
                    />
                  </div>
                  <span className="w-6 shrink-0 text-right text-xs font-semibold text-[var(--ink)]">{s.count}</span>
                </div>
              ))}
            </div>
          )}
        </section>

        <section>
          <h3 className="mb-2 text-sm font-semibold text-[var(--ink)]">{t.historySheet.historyListTitle}</h3>
          {sortedCycles.length === 0 ? (
            <EmptyNote text={t.historySheet.emptyHistory} />
          ) : (
            <div className="overflow-hidden rounded-2xl border border-[var(--line)]">
              <table className="w-full text-left text-xs">
                <thead className="bg-[var(--surface)] text-[var(--muted)]">
                  <tr>
                    <th className="px-3 py-2 font-semibold">{t.historySheet.colStart}</th>
                    <th className="px-3 py-2 font-semibold">{t.historySheet.colDuration}</th>
                    <th className="px-3 py-2 font-semibold">{t.historySheet.colCycle}</th>
                  </tr>
                </thead>
                <tbody>
                  {[...sortedCycles].reverse().map((c) => (
                    <tr key={c.startDate} className="border-t border-[var(--line)]">
                      <td className="px-3 py-2 text-[var(--ink)]">
                        {format(parseISO(c.startDate), 'd MMM yyyy', { locale: dateFnsLocale })}
                      </td>
                      <td className="px-3 py-2 text-[var(--muted)]">{c.periodLength ? t.historySheet.daysSuffix(c.periodLength) : '-'}</td>
                      <td className="px-3 py-2 text-[var(--muted)]">{c.cycleLength ? t.historySheet.daysSuffix(c.cycleLength) : '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </Sheet>
  );
}

function StatTile({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-[var(--surface)] p-3">
      <p className="text-lg font-bold text-[var(--ink)]">{value}</p>
      <p className="text-[0.625rem] text-[var(--muted)]">{label}</p>
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

function EmptyNote({ text }: { text: string }) {
  return (
    <p className="rounded-2xl border border-dashed border-[var(--line)] p-4 text-center text-xs text-[var(--muted)]">
      {text}
    </p>
  );
}
