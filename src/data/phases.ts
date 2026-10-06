import type { Translations } from '../lib/i18n/locales/id';

export type PhaseKey = 'menstrual' | 'follicular' | 'ovulatory' | 'luteal';
export type CareIconKey = 'comfort' | 'nutrition' | 'hydration' | 'activity' | 'skincare' | 'fertility' | 'rest' | 'period' | 'follicular' | 'ovulation' | 'luteal';
export type SymptomKey = keyof Translations['symptoms'];
export type MoodKey = keyof Translations['moods'];
export type FlowKey = keyof Translations['flows'];

export const PHASE_TINT: Record<PhaseKey, string> = { menstrual: '#F47C7C', follicular: '#F9B892', ovulatory: '#D7C2F7', luteal: '#B5D3F9' };
export const PHASE_ICON: Record<PhaseKey, CareIconKey> = { menstrual: 'period', follicular: 'follicular', ovulatory: 'ovulation', luteal: 'luteal' };

export const SYMPTOM_KEYS: SymptomKey[] = ['cr', 'hd', 'ac', 'bl', 'ft', 'bk', 'tb', 'ns', 'cv', 'in', 'dc', 'ba', 'dr', 'sp'];
export const MOOD_KEYS: MoodKey[] = ['hp', 'ir', 'ax', 'sd', 'en', 'cl', 'cf', 'ss', 'st', 'um'];
export const FLOW_KEYS: FlowKey[] = ['n', 's', 'l', 'm', 'h'];

export const MOOD_COLOR: Record<MoodKey, string> = {
  hp: 'bg-amber-300',
  ir: 'bg-rose-400',
  ax: 'bg-sky-300',
  sd: 'bg-indigo-300',
  en: 'bg-orange-300',
  cl: 'bg-emerald-300',
  cf: 'bg-lime-300',
  ss: 'bg-teal-300',
  st: 'bg-yellow-300',
  um: 'bg-stone-300',
};

export function getSymptomOptions(t: Translations) {
  return SYMPTOM_KEYS.map((key) => ({ key, label: t.symptoms[key] }));
}

export function getMoodOptions(t: Translations) {
  return MOOD_KEYS.map((key) => ({ key, label: t.moods[key], color: MOOD_COLOR[key] }));
}

export function getFlowOptions(t: Translations) {
  return FLOW_KEYS.map((key) => ({ key, label: t.flows[key] }));
}

export function selfCareTips(t: Translations, phase: PhaseKey | null, symptoms: string[] = [], moods: string[] = []) {
  const signals = [...symptoms, ...moods].sort((a, b) => Number(b === 'sp') - Number(a === 'sp'));
  const signalLabel = (k: string) => (t.symptoms as Record<string, string>)[k] ?? (t.moods as Record<string, string>)[k];
  return [
    ...signals.flatMap((k) => {
      const care = (t.signalCare as Record<string, { care: CareIconKey; tip: string }>)[k];
      return care ? [{ ...care, title: t.careTitles[care.care as keyof Translations['careTitles']], reason: signalLabel(k) }] : [];
    }),
    ...(phase
      ? t.phases[phase].selfCare.map((c) => ({ ...c, title: t.careTitles[c.care as keyof Translations['careTitles']], reason: t.phases[phase].label }))
      : []),
  ];
}
