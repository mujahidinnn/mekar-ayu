import type { CycleEntry, DailyLog } from '../../db/schema';
import { getFlowOptions, getMoodOptions, getSymptomOptions } from '../../data/phases';
import type { Translations } from '../i18n/locales/id';

function labelFor(list: readonly { key: string; label: string }[], key: string): string {
  return list.find((o) => o.key === key)?.label ?? key;
}

export function generateWhatsAppSummary(t: Translations, monthName: string, cycles: CycleEntry[], dailyLogs: DailyLog[], phone = ''): string {
  const symptomOptions = getSymptomOptions(t);
  const moodOptions = getMoodOptions(t);
  const flowOptions = getFlowOptions(t);
  const tr = t.export.whatsapp;

  const sortedCycles = [...cycles].sort((a, b) => b.startDate.localeCompare(a.startDate));
  const lastCycle = sortedCycles[0];
  const avgCycleLength = cycles.length
    ? Math.round(cycles.reduce((sum, c) => sum + (c.cycleLength ?? 28), 0) / cycles.filter((c) => c.cycleLength).length || 28)
    : 28;

  const sortedLogs = [...dailyLogs].sort((a, b) => a.date.localeCompare(b.date));

  const dailyNotes = sortedLogs.length
    ? sortedLogs
        .map((log) => {
          const symptoms = log.symptoms.map((s) => labelFor(symptomOptions, s)).join(', ') || '-';
          const moods = log.moods.map((m) => labelFor(moodOptions, m)).join(', ') || '-';
          const flow = log.flowIntensity ? labelFor(flowOptions, log.flowIntensity) : tr.noFlow;
          return tr.logLine(log.date, flow, symptoms, moods, log.notes || '-');
        })
        .join('\n')
    : tr.noDailyNotes;

  const text = `\u{1F338} ${tr.headerLine} \u{1F338}
${tr.periodLabel(monthName)}

\u{1F4CC} ${tr.summaryTitle}
• ${tr.totalDaysLogged(sortedLogs.length)}
• ${tr.lastPeriodStart(lastCycle?.startDate || tr.noDataYet)}
• ${tr.statusLabel(cycles.length >= 2 ? tr.avgDays(avgCycleLength) : tr.notEnoughData)}

\u{1F4A1} ${tr.dailyNotesTitle}
${dailyNotes}

---
\u{1F512} ${tr.footerPrivacy}`;

  const number = phone.replace(/\D/g, '').replace(/^0/, '62');
  return `https://wa.me/${number}?text=${encodeURIComponent(text)}`;
}
