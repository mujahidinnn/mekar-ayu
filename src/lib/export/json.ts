import { db, shortenLogKeys } from '../../db/schema';
import { encryptText, decryptText, type EncryptedEnvelope } from './crypto';

async function buildBackupPayload() {
  const cycles = await db.cycles.toArray();
  const dailyLogs = await db.dailyLogs.toArray();
  return { app: 'mekarayu', version: 1, exportedAt: new Date().toISOString(), cycles, dailyLogs };
}

async function saveJSON(data: unknown, share: boolean): Promise<void> {
  const text = JSON.stringify(data, null, 2);
  const name = `mekarayu-backup-${new Date().toISOString().split('T')[0]}`;

  if (share) {
    const file = new File([text], `${name}.txt`, { type: 'text/plain' });
    if (navigator.canShare?.({ files: [file] })) {
      try {
        await navigator.share({ files: [file] });
        return;
      } catch (err) {
        if ((err as Error).name === 'AbortError') return;
      }
    }
  }

  const url = URL.createObjectURL(new Blob([text], { type: 'application/json' }));
  const a = document.createElement('a');
  a.href = url;
  a.download = `${name}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

export async function exportBackupJSON(password?: string, share = false): Promise<void> {
  const payload = await buildBackupPayload();

  if (!password) {
    await saveJSON(payload, share);
    return;
  }

  const { salt, iv, ciphertext, iterations } = await encryptText(JSON.stringify(payload), password);
  await saveJSON({ app: 'mekarayu', version: 1, encrypted: true, kdf: 'PBKDF2-SHA256', iterations, salt, iv, ciphertext }, share);
}

export function isEncryptedBackup(data: unknown): data is EncryptedEnvelope {
  return !!data && typeof data === 'object' && (data as Record<string, unknown>).encrypted === true;
}

export async function readBackupFile(rawText: string, password?: string): Promise<string> {
  const data = JSON.parse(rawText);
  if (!isEncryptedBackup(data)) return rawText;

  if (!password) throw new Error('PASSWORD_REQUIRED');
  try {
    return await decryptText(data, password);
  } catch {
    throw new Error('WRONG_PASSWORD');
  }
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
    if (data.dailyLogs.length) await db.dailyLogs.bulkAdd(data.dailyLogs.map(shortenLogKeys));
  });
}
