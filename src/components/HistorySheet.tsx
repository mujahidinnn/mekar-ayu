import { useMemo } from 'react';
import { format, parseISO } from 'date-fns';
import { id as localeId } from 'date-fns/locale';
import { Sheet } from './ui/Sheet';
import type { CycleEntry, DailyLog } from '../db/schema';
import type { CycleStats } from '../lib/cycleMath';
import { SYMPTOM_OPTIONS } from '../data/phases';

interface HistorySheetProps {
  open: boolean;
  onClose: () => void;
  cycles: CycleEntry[];
  dailyLogs: DailyLog[];
  stats: CycleStats;
}

const NORMAL_MIN = 21; // ACOG: cycle length normal range
const NORMAL_MAX = 35;
const MAX_CYCLES_SHOWN = 12;
const CHART_HEIGHT = 160;
const BAR_WIDTH = 28;
const BAR_GAP = 10;

export function HistorySheet({ open, onClose, cycles, dailyLogs, stats }: HistorySheetProps) {
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
    return SYMPTOM_OPTIONS.map((opt) => ({ ...opt, count: counts.get(opt.key) ?? 0 }))
      .filter((s) => s.count > 0)
      .sort((a, b) => b.count - a.count)
      .slice(0, 6);
  }, [dailyLogs]);

  const maxDay = Math.max(NORMAL_MAX + 5, ...recentCyclesWithLength.map((c) => c.cycleLength), 1);
  const maxSymptomCount = Math.max(1, ...symptomCounts.map((s) => s.count));
  const chartWidth = Math.max(recentCyclesWithLength.length * (BAR_WIDTH + BAR_GAP) + BAR_GAP, 280);

  return (
    <Sheet open={open} onClose={onClose} title="Riwayat & Tren Siklus">
      <div className="space-y-6 pb-4">
        <div className="grid grid-cols-3 gap-2 text-center">
          <StatTile label="Rata-rata Siklus" value={`${stats.avgCycleLength}h`} />
          <StatTile label="Rata-rata Menstruasi" value={`${stats.avgPeriodLength}h`} />
          <StatTile label="Siklus Tercatat" value={`${cycles.length}`} />
        </div>

        <section>
          <h3 className="mb-1 text-sm font-semibold text-rose-950 dark:text-rose-50">Panjang Siklus (hari)</h3>
          <p className="mb-3 text-xs text-rose-900/60 dark:text-stone-400">Rentang normal menurut ACOG: 21–35 hari (area terang di grafik).</p>
          {recentCyclesWithLength.length === 0 ? (
            <EmptyNote text="Belum ada cukup data siklus untuk menampilkan tren." />
          ) : (
            <>
              <div className="overflow-x-auto">
                <svg width={chartWidth} height={CHART_HEIGHT + 30} role="img" aria-label="Grafik panjang siklus per periode">
                  <rect
                    x={0}
                    y={CHART_HEIGHT - (NORMAL_MAX / maxDay) * CHART_HEIGHT}
                    width="100%"
                    height={((NORMAL_MAX - NORMAL_MIN) / maxDay) * CHART_HEIGHT}
                    className="fill-rose-100 dark:fill-stone-800"
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
                          className={isAbnormal ? 'fill-amber-500' : 'fill-rose-400 dark:fill-rose-500'}
                        />
                        <text
                          x={x + BAR_WIDTH / 2}
                          y={y - 6}
                          textAnchor="middle"
                          fontSize="10"
                          fontWeight="600"
                          className="fill-rose-950 dark:fill-rose-50"
                        >
                          {length}
                        </text>
                        <text
                          x={x + BAR_WIDTH / 2}
                          y={CHART_HEIGHT + 16}
                          textAnchor="middle"
                          fontSize="9"
                          className="fill-rose-900/50 dark:fill-stone-500"
                        >
                          {format(parseISO(c.startDate), 'd/M')}
                        </text>
                      </g>
                    );
                  })}
                </svg>
              </div>
              <div className="mt-2 flex items-center justify-center gap-4 text-[11px] text-rose-900/70 dark:text-stone-400">
                <LegendDot className="bg-rose-400 dark:bg-rose-500" label="Normal (21–35 hari)" />
                <LegendDot className="bg-amber-500" label="Di luar rentang normal" />
              </div>
            </>
          )}
        </section>

        <section>
          <h3 className="mb-3 text-sm font-semibold text-rose-950 dark:text-rose-50">Gejala Paling Sering</h3>
          {symptomCounts.length === 0 ? (
            <EmptyNote text="Belum ada gejala tercatat." />
          ) : (
            <div className="space-y-2">
              {symptomCounts.map((s) => (
                <div key={s.key} className="flex items-center gap-2 text-sm">
                  <span className="w-28 shrink-0 truncate text-rose-900/80 dark:text-stone-300">
                    {s.emoji} {s.label}
                  </span>
                  <div className="h-4 flex-1 overflow-hidden rounded-full bg-rose-50 dark:bg-stone-800">
                    <div
                      className="h-full rounded-full bg-rose-400 dark:bg-rose-500"
                      style={{ width: `${(s.count / maxSymptomCount) * 100}%` }}
                    />
                  </div>
                  <span className="w-6 shrink-0 text-right text-xs font-semibold text-rose-950 dark:text-rose-50">{s.count}</span>
                </div>
              ))}
            </div>
          )}
        </section>

        <section>
          <h3 className="mb-2 text-sm font-semibold text-rose-950 dark:text-rose-50">Daftar Riwayat Siklus</h3>
          {sortedCycles.length === 0 ? (
            <EmptyNote text="Belum ada siklus tercatat." />
          ) : (
            <div className="overflow-hidden rounded-2xl border border-rose-100 dark:border-stone-800">
              <table className="w-full text-left text-xs">
                <thead className="bg-rose-50 text-rose-900/70 dark:bg-stone-800 dark:text-stone-300">
                  <tr>
                    <th className="px-3 py-2 font-semibold">Mulai</th>
                    <th className="px-3 py-2 font-semibold">Durasi</th>
                    <th className="px-3 py-2 font-semibold">Siklus</th>
                  </tr>
                </thead>
                <tbody>
                  {[...sortedCycles].reverse().map((c) => (
                    <tr key={c.startDate} className="border-t border-rose-50 dark:border-stone-800">
                      <td className="px-3 py-2 text-rose-950 dark:text-rose-50">
                        {format(parseISO(c.startDate), 'd MMM yyyy', { locale: localeId })}
                      </td>
                      <td className="px-3 py-2 text-rose-900/80 dark:text-stone-300">{c.periodLength ? `${c.periodLength} hari` : '-'}</td>
                      <td className="px-3 py-2 text-rose-900/80 dark:text-stone-300">{c.cycleLength ? `${c.cycleLength} hari` : '-'}</td>
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
    <div className="rounded-2xl border border-rose-100 bg-rose-50/60 p-3 dark:border-stone-800 dark:bg-stone-900">
      <p className="text-lg font-bold text-rose-950 dark:text-rose-50">{value}</p>
      <p className="text-[10px] text-rose-900/60 dark:text-stone-400">{label}</p>
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
    <p className="rounded-2xl border border-dashed border-rose-200 p-4 text-center text-xs text-rose-900/50 dark:border-stone-700 dark:text-stone-500">
      {text}
    </p>
  );
}
