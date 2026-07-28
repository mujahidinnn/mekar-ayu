import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import type { CycleEntry, DailyLog } from '../../db/schema';
import type { CycleStats } from '../cycleMath';
import { SYMPTOM_OPTIONS, MOOD_OPTIONS } from '../../data/phases';

function labelFor(list: readonly { key: string; label: string }[], key: string): string {
  return list.find((o) => o.key === key)?.label ?? key;
}

/** Builds a clean, gynecologist-friendly medical PDF report from local cycle & symptom history. */
export function generateMedicalReportPDF(cycles: CycleEntry[], dailyLogs: DailyLog[], stats: CycleStats): void {
  const doc = new jsPDF({ unit: 'pt', format: 'a4' });
  const marginX = 40;
  let cursorY = 50;

  doc.setFontSize(18);
  doc.setTextColor(190, 18, 60);
  doc.text('M-Project — Laporan Riwayat Siklus Menstruasi', marginX, cursorY);

  cursorY += 20;
  doc.setFontSize(10);
  doc.setTextColor(90, 90, 90);
  doc.text(`Dibuat pada: ${new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}`, marginX, cursorY);
  doc.text('Sumber data: 100% tercatat lokal oleh pengguna (self-reported, local-first).', marginX, cursorY + 14);

  cursorY += 36;
  doc.setFontSize(13);
  doc.setTextColor(30, 30, 30);
  doc.text('Ringkasan Klinis', marginX, cursorY);
  cursorY += 8;

  autoTable(doc, {
    startY: cursorY,
    theme: 'grid',
    styles: { fontSize: 9, cellPadding: 6 },
    headStyles: { fillColor: [244, 63, 94] },
    head: [['Parameter', 'Nilai', 'Rentang Normal (ACOG)']],
    body: [
      ['Rata-rata Panjang Siklus', `${stats.avgCycleLength} hari`, '21–35 hari'],
      ['Rata-rata Durasi Menstruasi', `${stats.avgPeriodLength} hari`, '2–7 hari'],
      ['Jumlah Siklus Tercatat', `${cycles.length}`, '-'],
      ['Estimasi Menstruasi Berikutnya', stats.predictedNextPeriodStart || '-', '-'],
      ['Estimasi Ovulasi', stats.ovulationDate || '-', '~14 hari sebelum menstruasi'],
    ],
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  cursorY = (doc as any).lastAutoTable.finalY + 24;

  if (stats.irregularityFlags.length > 0) {
    doc.setFontSize(13);
    doc.setTextColor(190, 18, 60);
    doc.text('Catatan Ketidakteraturan', marginX, cursorY);
    cursorY += 8;
    autoTable(doc, {
      startY: cursorY,
      theme: 'grid',
      styles: { fontSize: 9, cellPadding: 6 },
      headStyles: { fillColor: [251, 191, 36] },
      head: [['Indikator']],
      body: stats.irregularityFlags.map((f) => [f.message]),
    });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    cursorY = (doc as any).lastAutoTable.finalY + 24;
  }

  doc.setFontSize(13);
  doc.setTextColor(30, 30, 30);
  doc.text('Riwayat Siklus', marginX, cursorY);
  cursorY += 8;

  const sortedCycles = [...cycles].sort((a, b) => b.startDate.localeCompare(a.startDate));
  autoTable(doc, {
    startY: cursorY,
    theme: 'striped',
    styles: { fontSize: 9, cellPadding: 6 },
    headStyles: { fillColor: [190, 18, 60] },
    head: [['Mulai', 'Selesai', 'Durasi Menstruasi', 'Panjang Siklus']],
    body: sortedCycles.map((c) => [c.startDate, c.endDate || '-', c.periodLength ? `${c.periodLength} hari` : '-', c.cycleLength ? `${c.cycleLength} hari` : '-']),
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  cursorY = (doc as any).lastAutoTable.finalY + 24;

  const logsWithData = [...dailyLogs]
    .filter((l) => l.symptoms.length || l.moods.length || l.notes)
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 60);

  if (logsWithData.length > 0) {
    if (cursorY > 700) {
      doc.addPage();
      cursorY = 50;
    }
    doc.setFontSize(13);
    doc.setTextColor(30, 30, 30);
    doc.text('Catatan Gejala & Mood', marginX, cursorY);
    cursorY += 8;

    autoTable(doc, {
      startY: cursorY,
      theme: 'grid',
      styles: { fontSize: 8, cellPadding: 5 },
      headStyles: { fillColor: [190, 18, 60] },
      head: [['Tanggal', 'Flow', 'Gejala', 'Mood', 'Catatan']],
      body: logsWithData.map((l) => [
        l.date,
        l.flowIntensity || '-',
        l.symptoms.map((s) => labelFor(SYMPTOM_OPTIONS, s)).join(', ') || '-',
        l.moods.map((m) => labelFor(MOOD_OPTIONS, m)).join(', ') || '-',
        l.notes || '-',
      ]),
    });
  }

  doc.setFontSize(8);
  doc.setTextColor(140, 140, 140);
  doc.text('Dihasilkan oleh M-Project — 100% Local-First, Zero Backend, Zero Telemetry.', marginX, 820);

  doc.save(`m-project-laporan-medis-${new Date().toISOString().split('T')[0]}.pdf`);
}
