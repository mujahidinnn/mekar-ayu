import { useSyncExternalStore } from 'react';
import { isSyncing, subscribeSyncStatus } from '../lib/syncStatus';

export function useSyncStatus(): boolean {
  return useSyncExternalStore(subscribeSyncStatus, isSyncing);
}
