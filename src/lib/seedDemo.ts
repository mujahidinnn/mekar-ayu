import { addDays, format, subDays } from 'date-fns';
import { db, type DailyLog, type FlowIntensity } from '../db/schema';
import { syncCyclesTable } from './cycleSync';

const MOODS = ['hp', 'ir', 'ax', 'sd', 'en', 'cl', 'cf', 'ss', 'st', 'um'];
const SYMPTOMS = ['cr', 'hd', 'ac', 'bl', 'ft', 'bk', 'tb', 'ns'];
const FLOW: FlowIntensity[] = ['m', 'h', 'h', 'm', 'l'];
const CYCLE_LENGTHS = [28, 30, 27, 29];

let seed = 7;
const rnd = () => ((seed = (seed * 9301 + 49297) % 233280) / 233280);
const pick = <T,>(arr: readonly T[]) => arr[Math.floor(rnd() * arr.length)];

export async function seedDemoData() {
  const logs: DailyLog[] = [];
  const today = new Date();
  const lastStart = subDays(today, 8);
  const starts = [lastStart];
  for (const len of CYCLE_LENGTHS) starts.unshift(subDays(starts[0], len));

  const periodDays = new Set<string>();
  for (const s of starts) for (let i = 0; i < FLOW.length; i++) periodDays.add(format(addDays(s, i), 'yyyy-MM-dd'));

  for (let d = starts[0]; d <= today; d = addDays(d, 1)) {
    const date = format(d, 'yyyy-MM-dd');
    const flowIdx = [...Array(FLOW.length).keys()].find((i) => starts.some((s) => format(addDays(s, i), 'yyyy-MM-dd') === date));
    const inPeriod = flowIdx !== undefined;
    if (!inPeriod && rnd() < 0.25) continue;
    logs.push({
      date,
      flowIntensity: inPeriod ? FLOW[flowIdx] : undefined,
      moods: [inPeriod ? pick(['sd', 'ir', 'cl']) : pick(MOODS)],
      symptoms: inPeriod ? ['cr', ...(rnd() < 0.5 ? ['ft'] : [])] : rnd() < 0.4 ? [pick(SYMPTOMS)] : [],
      notes: rnd() < 0.15 ? 'Tidur cukup, banyak minum air.' : undefined,
      updatedAt: Date.now(),
    });
  }

  await db.transaction('rw', db.cycles, db.dailyLogs, async () => {
    await db.cycles.clear();
    await db.dailyLogs.clear();
    await db.dailyLogs.bulkPut(logs);
  });
  await syncCyclesTable();
  localStorage.setItem('mekarayu_onboarded', '1');
}
