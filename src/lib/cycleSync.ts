import { db } from '../db/schema';
import { rebuildCyclesFromLogs } from './cycleMath';

/**
 * Recomputes the `cycles` table from raw `dailyLogs` flow entries. Cycles are a derived
 * cache (not hand-edited), so the simplest correct strategy is to rebuild them wholesale
 * on every daily-log write rather than trying to diff/patch individual rows.
 */
export async function syncCyclesTable(): Promise<void> {
  const dailyLogs = await db.dailyLogs.toArray();
  const { cycles } = rebuildCyclesFromLogs(dailyLogs);

  await db.transaction('rw', db.cycles, async () => {
    await db.cycles.clear();
    if (cycles.length > 0) {
      await db.cycles.bulkAdd(cycles);
    }
  });
}
