import * as XLSX from 'xlsx';
import type { CycleEntry, DailyLog } from '../../db/schema';
import { SYMPTOM_OPTIONS, MOOD_OPTIONS, FLOW_OPTIONS } from '../../data/phases';

function labelFor(list: readonly { key: string; label: string }[], key: string): string {
  return list.find((o) => o.key === key)?.label ?? key;
}

// Built from y/m/d parts (not `new Date(iso)`) so the date lands on the same calendar day
// regardless of the browser's timezone offset.
function isoToDate(iso: string): Date {
  const [year, month, day] = iso.split('-').map(Number);
  return new Date(year, month - 1, day);
}

// json_to_sheet with cellDates only marks a cell as a real Excel date (type 'd'); it still needs
// an explicit number format, otherwise Excel/LibreOffice fall back to a locale-default one.
function applyDateFormat(sheet: XLSX.WorkSheet, colIndexes: number[], rowCount: number) {
  for (let row = 1; row <= rowCount; row++) {
    for (const col of colIndexes) {
      const cell = sheet[XLSX.utils.encode_cell({ r: row, c: col })];
      if (cell && cell.t === 'd') cell.z = 'yyyy-mm-dd';
    }
  }
}

export function exportExcelReport(cycles: CycleEntry[], dailyLogs: DailyLog[]): void {
  const sortedCycles = [...cycles].sort((a, b) => b.startDate.localeCompare(a.startDate));
  const cycleSheet = XLSX.utils.json_to_sheet(
    sortedCycles.map((c) => ({
      'Tanggal Mulai': isoToDate(c.startDate),
      'Tanggal Selesai': c.endDate ? isoToDate(c.endDate) : '',
      'Durasi Menstruasi (hari)': c.periodLength ?? '',
      'Panjang Siklus (hari)': c.cycleLength ?? '',
      Catatan: c.notes || '',
    })),
    { cellDates: true },
  );
  cycleSheet['!cols'] = [{ wch: 14 }, { wch: 14 }, { wch: 22 }, { wch: 20 }, { wch: 40 }];
  applyDateFormat(cycleSheet, [0, 1], sortedCycles.length);

  const sortedLogs = [...dailyLogs].sort((a, b) => b.date.localeCompare(a.date));
  const logSheet = XLSX.utils.json_to_sheet(
    sortedLogs.map((l) => ({
      Tanggal: isoToDate(l.date),
      Flow: l.flowIntensity ? labelFor(FLOW_OPTIONS, l.flowIntensity) : '',
      Gejala: l.symptoms.map((s) => labelFor(SYMPTOM_OPTIONS, s)).join(', '),
      Mood: l.moods.map((m) => labelFor(MOOD_OPTIONS, m)).join(', '),
      Catatan: l.notes || '',
    })),
    { cellDates: true },
  );
  logSheet['!cols'] = [{ wch: 14 }, { wch: 10 }, { wch: 40 }, { wch: 30 }, { wch: 40 }];
  applyDateFormat(logSheet, [0], sortedLogs.length);

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, cycleSheet, 'Riwayat Siklus');
  XLSX.utils.book_append_sheet(workbook, logSheet, 'Catatan Harian');

  XLSX.writeFile(workbook, `mekarayu-data-${new Date().toISOString().split('T')[0]}.xlsx`);
}
