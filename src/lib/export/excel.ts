import * as XLSX from 'xlsx';
import type { CycleEntry, DailyLog } from '../../db/schema';

export function exportExcelReport(cycles: CycleEntry[], dailyLogs: DailyLog[]): void {
  const cycleSheet = XLSX.utils.json_to_sheet(
    [...cycles]
      .sort((a, b) => b.startDate.localeCompare(a.startDate))
      .map((c) => ({
        'Tanggal Mulai': c.startDate,
        'Tanggal Selesai': c.endDate || '',
        'Durasi Menstruasi (hari)': c.periodLength ?? '',
        'Panjang Siklus (hari)': c.cycleLength ?? '',
        Catatan: c.notes || '',
      })),
  );

  const logSheet = XLSX.utils.json_to_sheet(
    [...dailyLogs]
      .sort((a, b) => b.date.localeCompare(a.date))
      .map((l) => ({
        Tanggal: l.date,
        Flow: l.flowIntensity || '',
        Gejala: l.symptoms.join(', '),
        Mood: l.moods.join(', '),
        Catatan: l.notes || '',
      })),
  );

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, cycleSheet, 'Riwayat Siklus');
  XLSX.utils.book_append_sheet(workbook, logSheet, 'Catatan Harian');

  XLSX.writeFile(workbook, `m-project-data-${new Date().toISOString().split('T')[0]}.xlsx`);
}
