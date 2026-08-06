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

  // Passing true lets the plugin swap the controller and reload the page itself once
  // the new SW has taken over, instead of relying on us to time the reload.
  const applyUpdate = useCallback(() => updateServiceWorker(true), [updateServiceWorker]);

  return { needRefresh, offlineReady, applyUpdate, dismissNeedRefresh, dismissOfflineReady };
}
