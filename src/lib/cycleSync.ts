import { db } from '../db/schema';
import { rebuildCyclesFromLogs } from './cycleMath';

let chain: Promise<void> = Promise.resolve();

/**
 * Recomputes the `cycles` table from raw `dailyLogs` flow entries. Cycles are a derived
 * cache (not hand-edited), so the simplest correct strategy is to rebuild them wholesale
 * on every daily-log write rather than trying to diff/patch individual rows.
 *
 * Callers may fire this off without awaiting it (it's a background cache rebuild, not
 * something the user needs to wait on). Runs are chained rather than run in parallel so two
 * overlapping rebuilds can't race and clear/bulkAdd against each other out of order.
 */
export function syncCyclesTable(): Promise<void> {
  chain = chain.then(rebuildCyclesTable, rebuildCyclesTable);
  return chain;
}

async function rebuildCyclesTable(): Promise<void> {
  const dailyLogs = await db.dailyLogs.toArray();
  const { cycles } = rebuildCyclesFromLogs(dailyLogs);

  await db.transaction('rw', db.cycles, async () => {
    await db.cycles.clear();
    if (cycles.length > 0) {
      await db.cycles.bulkAdd(cycles);
    }
  });
}
