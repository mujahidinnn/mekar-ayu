import * as XLSX from 'xlsx';
import type { CycleEntry, DailyLog } from '../../db/schema';
import { getFlowOptions, getMoodOptions, getSymptomOptions } from '../../data/phases';
import type { Translations } from '../i18n/locales/id';

function labelFor(list: readonly { key: string; label: string }[], key: string): string {
  return list.find((o) => o.key === key)?.label ?? key;
}

function isoToDate(iso: string): Date {
  const [year, month, day] = iso.split('-').map(Number);
  return new Date(year, month - 1, day);
}

function applyDateFormat(sheet: XLSX.WorkSheet, colIndexes: number[], rowCount: number) {
  for (let row = 1; row <= rowCount; row++) {
    for (const col of colIndexes) {
      const cell = sheet[XLSX.utils.encode_cell({ r: row, c: col })];
      if (cell && cell.t === 'd') cell.z = 'yyyy-mm-dd';
    }
  }
}

export function exportExcelReport(t: Translations, cycles: CycleEntry[], dailyLogs: DailyLog[]): void {
  const symptomOptions = getSymptomOptions(t);
  const moodOptions = getMoodOptions(t);
  const flowOptions = getFlowOptions(t);
  const tr = t.export.excel;

  const sortedCycles = [...cycles].sort((a, b) => b.startDate.localeCompare(a.startDate));
  const cycleSheet = XLSX.utils.json_to_sheet(
    sortedCycles.map((c) => ({
      [tr.colStartDate]: isoToDate(c.startDate),
      [tr.colEndDate]: c.endDate ? isoToDate(c.endDate) : '',
      [tr.colPeriodDuration]: c.periodLength ?? '',
      [tr.colCycleLength]: c.cycleLength ?? '',
      [tr.colNotes]: c.notes || '',
    })),
    { cellDates: true },
  );
  cycleSheet['!cols'] = [{ wch: 14 }, { wch: 14 }, { wch: 22 }, { wch: 20 }, { wch: 40 }];
  applyDateFormat(cycleSheet, [0, 1], sortedCycles.length);

  const sortedLogs = [...dailyLogs].sort((a, b) => b.date.localeCompare(a.date));
  const logSheet = XLSX.utils.json_to_sheet(
    sortedLogs.map((l) => ({
      [tr.colDate]: isoToDate(l.date),
      [tr.colFlow]: l.flowIntensity ? labelFor(flowOptions, l.flowIntensity) : '',
      [tr.colSymptoms]: l.symptoms.map((s) => labelFor(symptomOptions, s)).join(', '),
      [tr.colMood]: l.moods.map((m) => labelFor(moodOptions, m)).join(', '),
      [tr.colNotes]: l.notes || '',
    })),
    { cellDates: true },
  );
  logSheet['!cols'] = [{ wch: 14 }, { wch: 10 }, { wch: 40 }, { wch: 30 }, { wch: 40 }];
  applyDateFormat(logSheet, [0], sortedLogs.length);

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, cycleSheet, tr.sheetCycles);
  XLSX.utils.book_append_sheet(workbook, logSheet, tr.sheetLogs);

  XLSX.writeFile(workbook, `${tr.filenamePrefix}-${new Date().toISOString().split('T')[0]}.xlsx`);
}
