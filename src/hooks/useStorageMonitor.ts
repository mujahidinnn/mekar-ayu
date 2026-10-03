import { useCallback, useEffect, useState } from 'react';
import { db } from '../db/schema';

interface ChromeStorageEstimate extends StorageEstimate {
  usageDetails?: { indexedDB?: number; caches?: number; serviceWorkerRegistrations?: number };
}

export function useStorageMonitor() {
  const [usageKB, setUsageKB] = useState<number>(0);
  const [recordCount, setRecordCount] = useState<number>(0);
  const [isPersisted, setIsPersisted] = useState<boolean>(false);

  const refreshStorage = useCallback(async () => {
    if (navigator.storage && navigator.storage.estimate) {
      const estimate = (await navigator.storage.estimate()) as ChromeStorageEstimate;
      const dataBytes = estimate.usageDetails?.indexedDB ?? estimate.usage ?? 0;
      setUsageKB(Math.round((dataBytes / 1024) * 100) / 100);
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
    requestPersistence();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshStorage]);

  return { usageKB, recordCount, isPersisted, requestPersistence, refreshStorage };
}
