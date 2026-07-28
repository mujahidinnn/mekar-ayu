import { differenceInCalendarDays, parseISO } from 'date-fns';
import type { CycleStats } from './cycleMath';
import type { DailyLog } from '../db/schema';

export interface DayBadges {
  isLoggedPeriod: boolean; // actual bleeding logged that day
  isPredictedPeriod: boolean; // inside the predicted upcoming period window
  isFertileWindow: boolean;
  isOvulationDay: boolean;
  hasNote: boolean;
}

export function getDayBadges(dateStr: string, stats: CycleStats, log: DailyLog | undefined): DayBadges {
  const isLoggedPeriod = !!log?.flowIntensity && log.flowIntensity !== 'none';

  let isPredictedPeriod = false;
  if (!isLoggedPeriod && stats.predictedNextPeriodStart) {
    const diff = differenceInCalendarDays(parseISO(dateStr), parseISO(stats.predictedNextPeriodStart));
    isPredictedPeriod = diff >= 0 && diff < stats.avgPeriodLength;
  }

  let isFertileWindow = false;
  if (stats.fertileWindowStart && stats.fertileWindowEnd) {
    const d = parseISO(dateStr).getTime();
    isFertileWindow = d >= parseISO(stats.fertileWindowStart).getTime() && d <= parseISO(stats.fertileWindowEnd).getTime();
  }

  const isOvulationDay = stats.ovulationDate === dateStr;
  const hasNote = !!log?.notes;

  return { isLoggedPeriod, isPredictedPeriod, isFertileWindow, isOvulationDay, hasNote };
}
