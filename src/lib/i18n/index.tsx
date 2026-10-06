import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { id as localeId, enUS as localeEn } from 'date-fns/locale';
import { id } from './locales/id';
import { en } from './locales/en';
import type { Translations } from './locales/id';

export type AppLocale = 'id' | 'en';
export type DateFnsLocale = typeof localeEn;

const DICTS: Record<AppLocale, Translations> = { id, en };
const DATE_FNS_LOCALES: Record<AppLocale, DateFnsLocale> = { id: localeId, en: localeEn };
const LOCALE_KEY = 'mekarayu_locale';

function detectLocale(): AppLocale {
  const stored = localStorage.getItem(LOCALE_KEY);
  if (stored === 'id' || stored === 'en') return stored;
  return navigator.language.toLowerCase().startsWith('id') ? 'id' : 'en';
}

interface I18nContextValue {
  locale: AppLocale;
  t: Translations;
  dateFnsLocale: DateFnsLocale;
  setLocale: (locale: AppLocale) => void;
}

const I18nContext = createContext<I18nContextValue | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<AppLocale>(detectLocale);

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  const setLocale = useCallback((next: AppLocale) => {
    localStorage.setItem(LOCALE_KEY, next);
    setLocaleState(next);
  }, []);

  const value = useMemo<I18nContextValue>(
    () => ({ locale, t: DICTS[locale], dateFnsLocale: DATE_FNS_LOCALES[locale], setLocale }),
    [locale, setLocale],
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error('useI18n must be used within I18nProvider');
  return ctx;
}
