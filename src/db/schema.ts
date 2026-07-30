import Dexie, { type Table } from 'dexie';

export type FlowIntensity = 'heavy' | 'medium' | 'light' | 'spotting' | 'none';

export interface CycleEntry {
  id?: number;
  startDate: string; // ISO String format YYYY-MM-DD
  endDate?: string; // ISO String format YYYY-MM-DD
  cycleLength?: number; // Days between this start date and the previous one
  periodLength?: number; // Days of bleeding
  notes?: string;
}

export interface DailyLog {
  date: string; // Primary Key: ISO String YYYY-MM-DD
  flowIntensity?: FlowIntensity;
  symptoms: string[]; // e.g. ['cramps', 'headache', 'acne', 'bloating', 'fatigue', 'backache']
  moods: string[]; // e.g. ['happy', 'irritable', 'anxious', 'sad', 'energetic', 'calm']
  notes?: string;
  updatedAt: number; // Timestamp
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
  }
}

export const db = new MekarayuDatabase();
