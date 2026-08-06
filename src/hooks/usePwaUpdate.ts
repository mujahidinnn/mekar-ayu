import { useCallback } from 'react';
import { useRegisterSW } from 'virtual:pwa-register/react';

export function usePwaUpdate() {
  const {
    needRefresh: [needRefresh, setNeedRefresh],
    offlineReady: [offlineReady, setOfflineReady],
    updateServiceWorker,
  } = useRegisterSW({
    onRegisterError: (error) => console.error('SW registration failed', error),
  });

  const dismissOfflineReady = useCallback(() => setOfflineReady(false), [setOfflineReady]);
  const dismissNeedRefresh = useCallback(() => setNeedRefresh(false), [setNeedRefresh]);

  const applyUpdate = useCallback(() => updateServiceWorker(), [updateServiceWorker]);

  return { needRefresh, offlineReady, applyUpdate, dismissNeedRefresh, dismissOfflineReady };
}
