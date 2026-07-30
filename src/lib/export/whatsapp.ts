import type { CycleEntry, DailyLog } from '../../db/schema';
import { SYMPTOM_OPTIONS, MOOD_OPTIONS } from '../../data/phases';

function labelFor(list: readonly { key: string; label: string }[], key: string): string {
  return list.find((o) => o.key === key)?.label ?? key;
}

export function generateWhatsAppSummary(monthName: string, cycles: CycleEntry[], dailyLogs: DailyLog[]): string {
  const sortedCycles = [...cycles].sort((a, b) => b.startDate.localeCompare(a.startDate));
  const lastCycle = sortedCycles[0];
  const avgCycleLength = cycles.length
    ? Math.round(cycles.reduce((sum, c) => sum + (c.cycleLength ?? 28), 0) / cycles.filter((c) => c.cycleLength).length || 28)
    : 28;

  const sortedLogs = [...dailyLogs].sort((a, b) => a.date.localeCompare(b.date));

  const text = `\u{1F338} *REKAP SIKLUS MENSTRUASI (MEKAR AYU)* \u{1F338}
Periode: ${monthName}

\u{1F4CC} *Ringkasan Siklus:*
• Total Hari Dicatat: ${sortedLogs.length} hari
• Hari Pertama Menstruasi Terakhir: ${lastCycle?.startDate || 'Belum ada data'}
• Status Siklus: ${cycles.length >= 2 ? `Rata-rata ${avgCycleLength} Hari` : 'Data belum cukup untuk rata-rata'}

\u{1F4A1} *Catatan Harian Bulan Ini:*
${
    sortedLogs.length
      ? sortedLogs
          .map((log) => {
            const symptoms = log.symptoms.map((s) => labelFor(SYMPTOM_OPTIONS, s)).join(', ') || '-';
            const moods = log.moods.map((m) => labelFor(MOOD_OPTIONS, m)).join(', ') || '-';
            return `• ${log.date}: Flow (${log.flowIntensity || 'tidak ada'}), Gejala (${symptoms}), Mood (${moods}), Catatan: ${log.notes || '-'}`;
          })
          .join('\n')
      : 'Belum ada catatan harian pada bulan ini.'
  }

---
\u{1F512} Data ini dicatat privat di Mekar Ayu (100% Local-First, Tanpa Server).`;

  return `https://wa.me/?text=${encodeURIComponent(text)}`;
}
