import { db } from '../db/schema';
import { BLEEDING_INTENSITIES, rebuildCyclesFromLogs } from './cycleMath';

let chain: Promise<void> = Promise.resolve();

export function syncCyclesTable(): Promise<void> {
  chain = chain.then(rebuildCyclesTable, rebuildCyclesTable);
  return chain;
}

async function rebuildCyclesTable(): Promise<void> {
  const bleedingLogs = await db.dailyLogs.where('flowIntensity').anyOf([...BLEEDING_INTENSITIES]).toArray();
  const { cycles } = rebuildCyclesFromLogs(bleedingLogs);

  await db.transaction('rw', db.cycles, async () => {
    await db.cycles.clear();
    if (cycles.length > 0) {
      await db.cycles.bulkAdd(cycles);
    }
  });
}
