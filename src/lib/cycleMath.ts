import { addDays, differenceInCalendarDays, format, parseISO } from 'date-fns';
import type { CycleEntry, DailyLog } from '../db/schema';
import type { PhaseKey } from '../data/phases';

export const BLEEDING_INTENSITIES = new Set(['heavy', 'medium', 'light', 'spotting']);
// 'light' still counts as a genuine period day (just a lighter flow); only pure 'spotting' —
// with no heavier day anywhere in the streak — is treated as non-period, intermenstrual bleeding.
const TRUE_PERIOD_INTENSITIES = new Set(['heavy', 'medium', 'light']);

const DEFAULT_CYCLE_LENGTH = 28;
const DEFAULT_PERIOD_LENGTH = 5;
const MAX_GAP_WITHIN_PERIOD = 1; // allow a 1-day gap (e.g. logged light -> skipped -> spotting) inside one bleeding streak

export type IrregularityFlagKey =
  | 'short_cycle'
  | 'long_cycle'
  | 'high_variance'
  | 'prolonged_bleeding'
  | 'amenorrhea';

export type RedFlagKey =
  | 'severe_pain'
  | 'heavy_bleeding'
  | 'irregular_cycle'
  | 'amenorrhea'
  | 'intermenstrual_bleeding';

export interface Flag<K extends string> {
  key: K;
  message: string;
}

export interface CycleStats {
  today: string;
  lastPeriodStart: string | null;
  lastPeriodEnd: string | null;
  currentCycleDay: number | null;
  avgCycleLength: number;
  avgPeriodLength: number;
  predictedNextPeriodStart: string | null;
  ovulationDate: string | null;
  fertileWindowStart: string | null;
  fertileWindowEnd: string | null;
  currentPhase: PhaseKey | null;
  isPeriodActive: boolean;
  statusLabel: string;
  cycleHistory: CycleEntry[];
  irregularityFlags: Flag<IrregularityFlagKey>[];
  redFlags: Flag<RedFlagKey>[];
}

interface BleedingSegment {
  startDate: string;
  endDate: string;
  dates: string[];
  hasTrueFlow: boolean; // contains at least one 'medium'/'heavy' day
}

/** Groups consecutive (allowing a 1-day gap) bleeding-logged days into segments. */
function groupBleedingSegments(sortedLogs: DailyLog[]): BleedingSegment[] {
  const bleedingLogs = sortedLogs.filter((l) => l.flowIntensity && BLEEDING_INTENSITIES.has(l.flowIntensity));
  const segments: BleedingSegment[] = [];

  for (const log of bleedingLogs) {
    const last = segments[segments.length - 1];
    if (last) {
      const gap = differenceInCalendarDays(parseISO(log.date), parseISO(last.endDate));
      if (gap <= MAX_GAP_WITHIN_PERIOD + 1) {
        last.endDate = log.date;
        last.dates.push(log.date);
        if (log.flowIntensity && TRUE_PERIOD_INTENSITIES.has(log.flowIntensity)) last.hasTrueFlow = true;
        continue;
      }
    }
    segments.push({
      startDate: log.date,
      endDate: log.date,
      dates: [log.date],
      hasTrueFlow: !!log.flowIntensity && TRUE_PERIOD_INTENSITIES.has(log.flowIntensity),
    });
  }
  return segments;
}

/**
 * Rebuilds cycle (period) history from raw daily logs. A bleeding streak that never includes
 * a light/medium/heavy day — pure spotting throughout — is classified as intermenstrual
 * spotting rather than a new cycle, regardless of how long it's been since the last period.
 * That's what lets a stray spotting day mid-cycle surface as a red flag instead of silently
 * corrupting cycle-length stats by being counted as a (very short) new cycle.
 */
export function rebuildCyclesFromLogs(dailyLogs: DailyLog[]): {
  cycles: Omit<CycleEntry, 'id'>[];
  intermenstrualSpottingDates: string[];
} {
  const sorted = [...dailyLogs].sort((a, b) => a.date.localeCompare(b.date));
  const segments = groupBleedingSegments(sorted);

  const cycles: Omit<CycleEntry, 'id'>[] = [];
  const intermenstrualSpottingDates: string[] = [];
  let previousStart: string | null = null;

  for (const seg of segments) {
    if (!seg.hasTrueFlow) {
      intermenstrualSpottingDates.push(...seg.dates);
      continue;
    }

    const periodLength = differenceInCalendarDays(parseISO(seg.endDate), parseISO(seg.startDate)) + 1;
    const cycleLength = previousStart ? differenceInCalendarDays(parseISO(seg.startDate), parseISO(previousStart)) : undefined;

    cycles.push({
      startDate: seg.startDate,
      endDate: seg.endDate,
      periodLength,
      cycleLength,
    });
    previousStart = seg.startDate;
  }

  return { cycles, intermenstrualSpottingDates };
}

function average(nums: number[]): number | null {
  if (nums.length === 0) return null;
  return nums.reduce((a, b) => a + b, 0) / nums.length;
}

export function computeCycleStats(
  cycles: CycleEntry[],
  dailyLogs: DailyLog[],
  todayDate = new Date(),
  intermenstrualSpottingDates: string[] = [],
): CycleStats {
  const today = format(todayDate, 'yyyy-MM-dd');
  const sortedCycles = [...cycles].sort((a, b) => a.startDate.localeCompare(b.startDate));
  const lastCycle = sortedCycles[sortedCycles.length - 1] ?? null;

  const recentCycleLengths = sortedCycles
    .slice(-6)
    .map((c) => c.cycleLength)
    .filter((n): n is number => typeof n === 'number');
  const recentPeriodLengths = sortedCycles
    .slice(-6)
    .map((c) => c.periodLength)
    .filter((n): n is number => typeof n === 'number');

  const avgCycleLength = Math.round(average(recentCycleLengths) ?? DEFAULT_CYCLE_LENGTH);
  const avgPeriodLength = Math.round(average(recentPeriodLengths) ?? DEFAULT_PERIOD_LENGTH);

  const lastPeriodStart = lastCycle?.startDate ?? null;
  const lastPeriodEnd = lastCycle?.endDate ?? null;

  const currentCycleDay = lastPeriodStart ? differenceInCalendarDays(parseISO(today), parseISO(lastPeriodStart)) + 1 : null;

  const predictedNextPeriodStart = lastPeriodStart ? format(addDays(parseISO(lastPeriodStart), avgCycleLength), 'yyyy-MM-dd') : null;

  // ACOG: ovulation occurs ~14 days before the next menses starts — computed directly as a
  // calendar offset from the predicted next period, not from the last period start, to avoid
  // off-by-one drift between "days before next period" and a 1-indexed day-of-cycle number.
  const ovulationDate = predictedNextPeriodStart ? format(addDays(parseISO(predictedNextPeriodStart), -14), 'yyyy-MM-dd') : null;
  const fertileWindowStart = ovulationDate ? format(addDays(parseISO(ovulationDate), -5), 'yyyy-MM-dd') : null;
  const fertileWindowEnd = ovulationDate;
  // 1-indexed day-of-cycle on which ovulation falls, for phase-boundary comparisons below.
  const ovulationDayNumber = Math.max(avgCycleLength - 13, 1);

  const knownPeriodLength = lastCycle?.periodLength ?? avgPeriodLength;
  const isPeriodActive = currentCycleDay !== null && currentCycleDay >= 1 && currentCycleDay <= knownPeriodLength;

  let currentPhase: PhaseKey | null = null;
  if (currentCycleDay !== null) {
    if (currentCycleDay <= avgPeriodLength) currentPhase = 'menstrual';
    else if (currentCycleDay < ovulationDayNumber - 5) currentPhase = 'follicular';
    else if (currentCycleDay <= ovulationDayNumber) currentPhase = 'ovulatory';
    else currentPhase = 'luteal';
  }

  let statusLabel: string;
  if (isPeriodActive && currentCycleDay !== null) {
    statusLabel = `Hari ke-${currentCycleDay} Menstruasi`;
  } else if (predictedNextPeriodStart) {
    const daysUntil = differenceInCalendarDays(parseISO(predictedNextPeriodStart), parseISO(today));
    if (daysUntil > 0) statusLabel = `H-${daysUntil} Estimasi Menstruasi`;
    else if (daysUntil === 0) statusLabel = 'Estimasi Menstruasi Hari Ini';
    else statusLabel = `Terlambat ${Math.abs(daysUntil)} Hari`;
  } else {
    statusLabel = 'Mulai catat siklusmu';
  }

  // --- Irregularity flags (ACOG / clinical thresholds, Section 2.1) ---
  const irregularityFlags: Flag<IrregularityFlagKey>[] = [];

  const lastTwoCycleLengths = recentCycleLengths.slice(-2);
  if (lastTwoCycleLengths.some((n) => n < 21)) {
    irregularityFlags.push({ key: 'short_cycle', message: 'Siklus lebih pendek dari 21 hari (Polymenorrhea).' });
  }
  if (lastTwoCycleLengths.some((n) => n > 35)) {
    irregularityFlags.push({ key: 'long_cycle', message: 'Siklus lebih panjang dari 35 hari (Oligomenorrhea).' });
  }
  const variances: number[] = [];
  for (let i = 1; i < recentCycleLengths.length; i++) {
    variances.push(Math.abs(recentCycleLengths[i] - recentCycleLengths[i - 1]));
  }
  if (variances.some((v) => v > 7)) {
    irregularityFlags.push({ key: 'high_variance', message: 'Variasi antar siklus lebih dari 7 hari secara berturut-turut.' });
  }
  if (recentPeriodLengths.some((p) => p > 8)) {
    irregularityFlags.push({ key: 'prolonged_bleeding', message: 'Durasi menstruasi lebih dari 8 hari (Menorrhagia).' });
  }
  if (lastPeriodStart && differenceInCalendarDays(parseISO(today), parseISO(lastPeriodStart)) > 90) {
    irregularityFlags.push({ key: 'amenorrhea', message: 'Tidak ada menstruasi selama lebih dari 90 hari.' });
  }

  // --- Red flag banner (Section 3.2) ---
  const redFlags: Flag<RedFlagKey>[] = [];
  const recentLogs = dailyLogs.filter((l) => differenceInCalendarDays(parseISO(today), parseISO(l.date)) <= 3 && differenceInCalendarDays(parseISO(today), parseISO(l.date)) >= 0);

  if (recentLogs.some((l) => l.symptoms.includes('severe_pain'))) {
    redFlags.push({
      key: 'severe_pain',
      message: 'Nyeri hebat yang mengganggu aktivitas harian dan tidak mereda dengan obat pereda nyeri biasa.',
    });
  }

  const sortedLogsDesc = [...dailyLogs].sort((a, b) => b.date.localeCompare(a.date));
  let consecutiveHeavy = 0;
  for (const log of sortedLogsDesc) {
    if (log.flowIntensity === 'heavy') consecutiveHeavy++;
    else break;
  }
  if (consecutiveHeavy >= 3) {
    redFlags.push({
      key: 'heavy_bleeding',
      message: 'Pendarahan deras tercatat 3 hari berturut-turut. Waspadai tanda Menorrhagia.',
    });
  }

  if (irregularityFlags.some((f) => f.key === 'short_cycle' || f.key === 'long_cycle')) {
    redFlags.push({ key: 'irregular_cycle', message: 'Panjang siklus di luar rentang normal (21–35 hari) secara konsisten.' });
  }
  if (irregularityFlags.some((f) => f.key === 'amenorrhea')) {
    redFlags.push({ key: 'amenorrhea', message: 'Tidak menstruasi selama 90+ hari berturut-turut (dan bukan karena kehamilan).' });
  }

  if (intermenstrualSpottingDates.length > 0) {
    redFlags.push({
      key: 'intermenstrual_bleeding',
      message: 'Terdapat flek/bercak darah di luar periode menstruasi utama.',
    });
  }

  return {
    today,
    lastPeriodStart,
    lastPeriodEnd,
    currentCycleDay,
    avgCycleLength,
    avgPeriodLength,
    predictedNextPeriodStart,
    ovulationDate,
    fertileWindowStart,
    fertileWindowEnd,
    currentPhase,
    isPeriodActive,
    statusLabel,
    cycleHistory: sortedCycles,
    irregularityFlags,
    redFlags,
  };
}
