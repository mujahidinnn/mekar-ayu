import Dexie, { type Table } from 'dexie';

export type FlowIntensity = 'h' | 'm' | 'l' | 's' | 'n';

const LEGACY_KEYS: Record<string, string> = {
  heavy: 'h', medium: 'm', light: 'l', spotting: 's', none: 'n',
  happy: 'hp', irritable: 'ir', anxious: 'ax', sad: 'sd', energetic: 'en', calm: 'cl', confident: 'cf', sensitive: 'ss', stressed: 'st', unmotivated: 'um',
  cramps: 'cr', headache: 'hd', acne: 'ac', bloating: 'bl', fatigue: 'ft', backache: 'bk', tender_breasts: 'tb', nausea: 'ns',
  cravings: 'cv', insomnia: 'in', discharge: 'dc', body_aches: 'ba', diarrhea: 'dr', severe_pain: 'sp',
};
const short = (k: string) => LEGACY_KEYS[k] ?? k;

export function shortenLogKeys(log: DailyLog): DailyLog {
  if (log.flowIntensity) log.flowIntensity = short(log.flowIntensity) as FlowIntensity;
  log.symptoms = (log.symptoms ?? []).map(short);
  log.moods = (log.moods ?? []).map(short);
  return log;
}

export interface CycleEntry {
  id?: number;
  startDate: string;
  endDate?: string;
  cycleLength?: number;
  periodLength?: number;
  notes?: string;
}

export interface DailyLog {
  date: string;
  flowIntensity?: FlowIntensity;
  symptoms: string[];
  moods: string[];
  notes?: string;
  updatedAt: number;
}

export interface AppSettings {
  key: string;
  value: unknown;
}

export class MekarayuDatabase extends Dexie {
  cycles!: Table<CycleEntry, number>;
  dailyLogs!: Table<DailyLog, string>;
  settings!: Table<AppSettings, string>;

  constructor() {
    super('MekarayuDB');
    this.version(1).stores({
      cycles: '++id, startDate, endDate',
      dailyLogs: 'date, flowIntensity, updatedAt',
    });
    this.version(2).stores({
      cycles: '++id, startDate, endDate',
      dailyLogs: 'date, flowIntensity, updatedAt',
      settings: 'key',
    });
    this.version(3).stores({}).upgrade((tx) => tx.table('dailyLogs').toCollection().modify(shortenLogKeys));
  }
}

export const db = new MekarayuDatabase();
