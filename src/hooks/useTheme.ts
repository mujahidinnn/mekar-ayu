import { useCallback, useEffect, useState } from 'react';
import { applyTheme, getStoredThemePreference, resolveEffectiveTheme, setStoredThemePreference } from '../lib/theme';
import type { ThemePreference } from '../lib/theme';

export function useTheme() {
  const [preference, setPreference] = useState<ThemePreference>(() => getStoredThemePreference());

  useEffect(() => {
    applyTheme(preference);
    if (preference !== 'system') return;
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const onChange = () => applyTheme('system');
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, [preference]);

  const setTheme = useCallback((next: ThemePreference) => {
    setStoredThemePreference(next);
    setPreference(next);
  }, []);

  return { preference, effectiveTheme: resolveEffectiveTheme(preference), setTheme };
}
