import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import type { CycleEntry, DailyLog } from '../../db/schema';
import type { CycleStats } from '../cycleMath';
import { getFlowOptions, getMoodOptions, getSymptomOptions } from '../../data/phases';
import type { Translations } from '../i18n/locales/id';
import type { AppLocale } from '../i18n';

function labelFor(list: readonly { key: string; label: string }[], key: string): string {
  return list.find((o) => o.key === key)?.label ?? key;
}

export function generateMedicalReportPDF(t: Translations, locale: AppLocale, cycles: CycleEntry[], dailyLogs: DailyLog[], stats: CycleStats): void {
  const symptomOptions = getSymptomOptions(t);
  const moodOptions = getMoodOptions(t);
  const flowOptions = getFlowOptions(t);
  const tr = t.export.pdf;

  const doc = new jsPDF({ unit: 'pt', format: 'a4' });
  const marginX = 40;
  let cursorY = 50;

  doc.setFontSize(18);
  doc.setTextColor(190, 18, 60);
  doc.text(tr.headerTitle, marginX, cursorY);

  cursorY += 20;
  doc.setFontSize(10);
  doc.setTextColor(90, 90, 90);
  doc.text(tr.generatedOn(new Date().toLocaleDateString(locale === 'id' ? 'id-ID' : 'en-US', { day: 'numeric', month: 'long', year: 'numeric' })), marginX, cursorY);
  doc.text(tr.dataSource, marginX, cursorY + 14);

  cursorY += 36;
  doc.setFontSize(13);
  doc.setTextColor(30, 30, 30);
  doc.text(tr.clinicalSummaryTitle, marginX, cursorY);
  cursorY += 8;

  autoTable(doc, {
    startY: cursorY,
    theme: 'grid',
    styles: { fontSize: 9, cellPadding: 6 },
    headStyles: { fillColor: [244, 63, 94] },
    head: [tr.paramHeaders],
    body: [
      [tr.rowAvgCycle, tr.daysUnit(stats.avgCycleLength), tr.normalCycleRange],
      [tr.rowAvgPeriod, tr.daysUnit(stats.avgPeriodLength), tr.normalPeriodRange],
      [tr.rowCycleCount, `${cycles.length}`, '-'],
      [tr.rowNextPeriod, stats.predictedNextPeriodStart || '-', '-'],
      [tr.rowOvulation, stats.ovulationDate || '-', tr.ovulationNormalNote],
    ],
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  cursorY = (doc as any).lastAutoTable.finalY + 24;

  if (stats.irregularityFlags.length > 0) {
    doc.setFontSize(13);
    doc.setTextColor(190, 18, 60);
    doc.text(tr.irregularityTitle, marginX, cursorY);
    cursorY += 8;
    autoTable(doc, {
      startY: cursorY,
      theme: 'grid',
      styles: { fontSize: 9, cellPadding: 6 },
      headStyles: { fillColor: [251, 191, 36] },
      head: [[tr.indicatorHeader]],
      body: stats.irregularityFlags.map((f) => [t.flags.irregularity[f.key]]),
    });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    cursorY = (doc as any).lastAutoTable.finalY + 24;
  }

  doc.setFontSize(13);
  doc.setTextColor(30, 30, 30);
  doc.text(tr.historyTitle, marginX, cursorY);
  cursorY += 8;

  const sortedCycles = [...cycles].sort((a, b) => b.startDate.localeCompare(a.startDate));
  autoTable(doc, {
    startY: cursorY,
    theme: 'striped',
    styles: { fontSize: 9, cellPadding: 6 },
    headStyles: { fillColor: [190, 18, 60] },
    head: [tr.historyHeaders],
    body: sortedCycles.map((c) => [c.startDate, c.endDate || '-', c.periodLength ? tr.daysUnit(c.periodLength) : '-', c.cycleLength ? tr.daysUnit(c.cycleLength) : '-']),
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
    doc.text(tr.symptomLogTitle, marginX, cursorY);
    cursorY += 8;

    autoTable(doc, {
      startY: cursorY,
      theme: 'grid',
      styles: { fontSize: 8, cellPadding: 5 },
      headStyles: { fillColor: [190, 18, 60] },
      head: [tr.symptomLogHeaders],
      body: logsWithData.map((l) => [
        l.date,
        l.flowIntensity ? labelFor(flowOptions, l.flowIntensity) : '-',
        l.symptoms.map((s) => labelFor(symptomOptions, s)).join(', ') || '-',
        l.moods.map((m) => labelFor(moodOptions, m)).join(', ') || '-',
        l.notes || '-',
      ]),
    });
  }

  doc.setFontSize(8);
  doc.setTextColor(140, 140, 140);
  doc.text(tr.footer, marginX, 820);

  doc.save(`${tr.filenamePrefix}-${new Date().toISOString().split('T')[0]}.pdf`);
}
