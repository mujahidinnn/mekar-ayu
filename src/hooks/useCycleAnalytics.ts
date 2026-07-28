import { useMemo } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db/schema';
import { computeCycleStats, rebuildCyclesFromLogs } from '../lib/cycleMath';

export function useCycleAnalytics() {
  const cycles = useLiveQuery(() => db.cycles.toArray(), [], []);
  const dailyLogs = useLiveQuery(() => db.dailyLogs.toArray(), [], []);

  // Computed once per dailyLogs change and reused for the spotting-date red flag,
  // instead of computeCycleStats re-deriving cycles from scratch a second time.
  const { intermenstrualSpottingDates } = useMemo(() => rebuildCyclesFromLogs(dailyLogs ?? []), [dailyLogs]);

  const stats = useMemo(
    () => computeCycleStats(cycles ?? [], dailyLogs ?? [], new Date(), intermenstrualSpottingDates),
    [cycles, dailyLogs, intermenstrualSpottingDates],
  );

  return { stats, cycles: cycles ?? [], dailyLogs: dailyLogs ?? [], isLoading: cycles === undefined || dailyLogs === undefined };
}
