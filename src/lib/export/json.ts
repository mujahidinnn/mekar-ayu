import { db } from '../../db/schema';
import { encryptText, decryptText, type EncryptedEnvelope } from './crypto';

async function buildBackupPayload() {
  const cycles = await db.cycles.toArray();
  const dailyLogs = await db.dailyLogs.toArray();
  return { app: 'mekarayu', version: 1, exportedAt: new Date().toISOString(), cycles, dailyLogs };
}

function downloadJSON(data: unknown): void {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `mekarayu-backup-${new Date().toISOString().split('T')[0]}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

/** Exports the full backup as JSON. When `password` is given, the payload is AES-GCM encrypted. */
export async function exportBackupJSON(password?: string): Promise<void> {
  const payload = await buildBackupPayload();

  if (!password) {
    downloadJSON(payload);
    return;
  }

  const { salt, iv, ciphertext, iterations } = await encryptText(JSON.stringify(payload), password);
  downloadJSON({ app: 'mekarayu', version: 1, encrypted: true, kdf: 'PBKDF2-SHA256', iterations, salt, iv, ciphertext });
}

export function isEncryptedBackup(data: unknown): data is EncryptedEnvelope {
  return !!data && typeof data === 'object' && (data as Record<string, unknown>).encrypted === true;
}

/**
 * Parses a raw backup file's text. Plain backups are returned as-is; locked ones are
 * decrypted with `password` first. Throws 'PASSWORD_REQUIRED' or 'WRONG_PASSWORD' so callers
 * can prompt/retry, and the result is always plain JSON text ready for importBackupJSON.
 */
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
    if (data.dailyLogs.length) await db.dailyLogs.bulkAdd(data.dailyLogs);
  });
}
