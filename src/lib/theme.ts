export type ThemePreference = 'light' | 'dark' | 'system';

const STORAGE_KEY = 'mekarayu-theme';
const THEME_COLOR_LIGHT = '#FB7185';
const THEME_COLOR_DARK = '#1c1917';

export function getStoredThemePreference(): ThemePreference {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored === 'light' || stored === 'dark' || stored === 'system' ? stored : 'system';
}

export function setStoredThemePreference(pref: ThemePreference): void {
  localStorage.setItem(STORAGE_KEY, pref);
}

export function resolveEffectiveTheme(pref: ThemePreference): 'light' | 'dark' {
  if (pref === 'system') {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  return pref;
}

export function applyTheme(pref: ThemePreference): void {
  const effective = resolveEffectiveTheme(pref);
  document.documentElement.classList.toggle('dark', effective === 'dark');
  document.getElementById('theme-color-meta')?.setAttribute('content', effective === 'dark' ? THEME_COLOR_DARK : THEME_COLOR_LIGHT);
}
