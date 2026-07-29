import { db } from '../db/schema';

export async function deleteAllData(): Promise<void> {
  await db.transaction('rw', [db.cycles, db.dailyLogs, db.settings], async () => {
    await db.cycles.clear();
    await db.dailyLogs.clear();
    await db.settings.clear();
  });
}
