import { db } from '../../db/schema';

export async function exportBackupJSON(): Promise<void> {
  const cycles = await db.cycles.toArray();
  const dailyLogs = await db.dailyLogs.toArray();

  const backupData = {
    app: 'mekarayu',
    version: 1,
    exportedAt: new Date().toISOString(),
    cycles,
    dailyLogs,
  };

  const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `mekarayu-backup-${new Date().toISOString().split('T')[0]}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

export async function importBackupJSON(jsonString: string): Promise<void> {
  const data = JSON.parse(jsonString);
  if (!Array.isArray(data.cycles) || !Array.isArray(data.dailyLogs)) {
    throw new Error('Format file backup JSON tidak valid.');
  }

  await db.transaction('rw', [db.cycles, db.dailyLogs], async () => {
    await db.cycles.clear();
    await db.dailyLogs.clear();
    if (data.cycles.length) await db.cycles.bulkAdd(data.cycles.map(({ id: _id, ...rest }: { id?: number }) => rest));
    if (data.dailyLogs.length) await db.dailyLogs.bulkAdd(data.dailyLogs);
  });
}
