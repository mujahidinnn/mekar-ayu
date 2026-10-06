import { addDays, differenceInCalendarDays, format, parseISO } from 'date-fns';
import type { CycleEntry, DailyLog } from '../db/schema';
import type { PhaseKey } from '../data/phases';

export const BLEEDING_INTENSITIES = new Set(['h', 'm', 'l', 's']);
const TRUE_PERIOD_INTENSITIES = new Set(['h', 'm', 'l']);

const DEFAULT_CYCLE_LENGTH = 28;
const DEFAULT_PERIOD_LENGTH = 5;
const MAX_GAP_WITHIN_PERIOD = 1;

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
}

export type CycleStatus =
  | { kind: 'active'; day: number }
  | { kind: 'countdown'; days: number }
  | { kind: 'dueToday' }
  | { kind: 'overdue'; days: number }
  | { kind: 'unknown' };

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
  status: CycleStatus;
  cycleHistory: CycleEntry[];
  irregularityFlags: Flag<IrregularityFlagKey>[];
  redFlags: Flag<RedFlagKey>[];
}

interface BleedingSegment {
  startDate: string;
  endDate: string;
  dates: string[];
  hasTrueFlow: boolean;
}

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

  const ovulationDate = predictedNextPeriodStart ? format(addDays(parseISO(predictedNextPeriodStart), -14), 'yyyy-MM-dd') : null;
  const fertileWindowStart = ovulationDate ? format(addDays(parseISO(ovulationDate), -5), 'yyyy-MM-dd') : null;
  const fertileWindowEnd = ovulationDate;
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

  let status: CycleStatus;
  if (isPeriodActive && currentCycleDay !== null) {
    status = { kind: 'active', day: currentCycleDay };
  } else if (predictedNextPeriodStart) {
    const daysUntil = differenceInCalendarDays(parseISO(predictedNextPeriodStart), parseISO(today));
    if (daysUntil > 0) status = { kind: 'countdown', days: daysUntil };
    else if (daysUntil === 0) status = { kind: 'dueToday' };
    else status = { kind: 'overdue', days: Math.abs(daysUntil) };
  } else {
    status = { kind: 'unknown' };
  }

  const irregularityFlags: Flag<IrregularityFlagKey>[] = [];

  const lastTwoCycleLengths = recentCycleLengths.slice(-2);
  if (lastTwoCycleLengths.some((n) => n < 21)) {
    irregularityFlags.push({ key: 'short_cycle' });
  }
  if (lastTwoCycleLengths.some((n) => n > 35)) {
    irregularityFlags.push({ key: 'long_cycle' });
  }
  const variances: number[] = [];
  for (let i = 1; i < recentCycleLengths.length; i++) {
    variances.push(Math.abs(recentCycleLengths[i] - recentCycleLengths[i - 1]));
  }
  if (variances.some((v) => v > 7)) {
    irregularityFlags.push({ key: 'high_variance' });
  }
  if (recentPeriodLengths.some((p) => p > 8)) {
    irregularityFlags.push({ key: 'prolonged_bleeding' });
  }
  if (lastPeriodStart && differenceInCalendarDays(parseISO(today), parseISO(lastPeriodStart)) > 90) {
    irregularityFlags.push({ key: 'amenorrhea' });
  }

  const redFlags: Flag<RedFlagKey>[] = [];
  const recentLogs = dailyLogs.filter((l) => differenceInCalendarDays(parseISO(today), parseISO(l.date)) <= 3 && differenceInCalendarDays(parseISO(today), parseISO(l.date)) >= 0);

  if (recentLogs.some((l) => l.symptoms.includes('sp'))) {
    redFlags.push({ key: 'severe_pain' });
  }

  const sortedLogsDesc = [...dailyLogs].sort((a, b) => b.date.localeCompare(a.date));
  let consecutiveHeavy = 0;
  for (const log of sortedLogsDesc) {
    if (log.flowIntensity === 'h') consecutiveHeavy++;
    else break;
  }
  if (consecutiveHeavy >= 3) {
    redFlags.push({ key: 'heavy_bleeding' });
  }

  if (irregularityFlags.some((f) => f.key === 'short_cycle' || f.key === 'long_cycle')) {
    redFlags.push({ key: 'irregular_cycle' });
  }
  if (irregularityFlags.some((f) => f.key === 'amenorrhea')) {
    redFlags.push({ key: 'amenorrhea' });
  }

  if (intermenstrualSpottingDates.length > 0) {
    redFlags.push({ key: 'intermenstrual_bleeding' });
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
    status,
    cycleHistory: sortedCycles,
    irregularityFlags,
    redFlags,
  };
}
