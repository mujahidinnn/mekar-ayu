import { useCallback, useEffect, useState } from 'react';
import { db } from '../db/schema';

export function useStorageMonitor() {
  const [usageKB, setUsageKB] = useState<number>(0);
  const [recordCount, setRecordCount] = useState<number>(0);
  const [isPersisted, setIsPersisted] = useState<boolean>(false);

  const refreshStorage = useCallback(async () => {
    if (navigator.storage && navigator.storage.estimate) {
      const estimate = await navigator.storage.estimate();
      setUsageKB(Math.round(((estimate.usage || 0) / 1024) * 100) / 100);
    }

    const logCount = await db.dailyLogs.count();
    const cycleCount = await db.cycles.count();
    setRecordCount(logCount + cycleCount);

    if (navigator.storage && navigator.storage.persisted) {
      setIsPersisted(await navigator.storage.persisted());
    }
  }, []);

  const requestPersistence = useCallback(async () => {
    if (navigator.storage && navigator.storage.persist) {
      const granted = await navigator.storage.persist();
      setIsPersisted(granted);
      return granted;
    }
    return false;
  }, []);

  useEffect(() => {
    refreshStorage();
    // Request persistence automatically, the same way Docs/Sheets just syncs without asking —
    // no button for the user to remember to tap. Browsers decide silently whether to grant it.
    requestPersistence();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshStorage]);

  return { usageKB, recordCount, isPersisted, requestPersistence, refreshStorage };
}
