import { useState } from 'react';
import { AlertTriangle, BookOpen, ChevronDown, ClipboardList, GraduationCap, Sparkles } from 'lucide-react';
import { Sheet } from './ui/Sheet';
import { PHASES } from '../data/phases';
import type { PhaseKey } from '../data/phases';

interface FullGuideSheetProps {
  open: boolean;
  onClose: () => void;
}

const PHASE_ORDER: PhaseKey[] = ['menstrual', 'follicular', 'ovulatory', 'luteal'];

// Proportional widths for a typical 28-day cycle: menstrual 5d, follicular 8d, ovulatory 1d, luteal 14d.
const CYCLE_DIAGRAM_SEGMENTS: { key: PhaseKey; widthPct: number; barColor: string }[] = [
  { key: 'menstrual', widthPct: (5 / 28) * 100, barColor: 'bg-rose-500' },
  { key: 'follicular', widthPct: (8 / 28) * 100, barColor: 'bg-emerald-400' },
  { key: 'ovulatory', widthPct: (1 / 28) * 100, barColor: 'bg-purple-400' },
  { key: 'luteal', widthPct: (14 / 28) * 100, barColor: 'bg-amber-400' },
];

const CLINICAL_PARAMETERS = [
  { parameter: 'Panjang Siklus', normal: '21–35 hari (rata-rata 28 hari)', warning: '<21 hari atau >35 hari' },
  { parameter: 'Durasi Menstruasi', normal: '2–7 hari (rata-rata 4–5 hari)', warning: '>8 hari' },
  { parameter: 'Variasi Antar Siklus', normal: '≤4–5 hari', warning: '>7–9 hari berturut-turut' },
  { parameter: 'Ovulasi & Masa Subur', normal: '~14 hari sebelum menstruasi berikutnya', warning: '-' },
];

const RED_FLAGS = [
  { title: 'Nyeri Hebat (Dismenore)', description: 'Nyeri panggul yang mengganggu aktivitas harian dan tidak mereda dengan obat pereda nyeri biasa.' },
  { title: 'Pendarahan Abnormal (Menorrhagia)', description: 'Mengganti pembalut/tampon setiap jam selama beberapa jam berturut-turut.' },
  { title: 'Siklus Tidak Teratur', description: 'Siklus konsisten lebih pendek dari 21 hari atau lebih panjang dari 35 hari.' },
  { title: 'Amenore Sekunder', description: 'Tidak menstruasi selama 90+ hari berturut-turut (dan bukan karena kehamilan).' },
  { title: 'Pendarahan Intermenstrual', description: 'Flek atau pendarahan yang muncul di antara periode menstruasi yang jelas.' },
];

export function FullGuideSheet({ open, onClose }: FullGuideSheetProps) {
  const [expandedPhase, setExpandedPhase] = useState<PhaseKey | null>('menstrual');

  return (
    <Sheet open={open} onClose={onClose} title="Panduan Lengkap Menstruasi">
      <div className="space-y-6 pb-4">
        <section className="flex gap-3">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-rose-100 text-rose-600 dark:bg-rose-900/40 dark:text-rose-400">
            <BookOpen size={18} />
          </span>
          <p className="text-sm leading-relaxed text-rose-900/80 dark:text-stone-300">
            Menurut ACOG (American College of Obstetricians and Gynecologists), siklus menstruasi sebaiknya dipantau sebagai{' '}
            <span className="font-semibold text-rose-950 dark:text-rose-50">tanda vital</span>, sama pentingnya dengan tekanan darah atau detak
            jantung. Perubahan pada panjang siklus atau durasi menstruasi bisa menjadi indikator awal kondisi seperti PCOS, gangguan tiroid, atau
            endometriosis.
          </p>
        </section>

        <section>
          <h3 className="mb-3 text-sm font-semibold text-rose-950 dark:text-rose-50">Perjalanan Satu Siklus (28 Hari)</h3>
          <div className="flex h-8 overflow-hidden rounded-full shadow-inner">
            {CYCLE_DIAGRAM_SEGMENTS.map((seg) => (
              <div key={seg.key} style={{ width: `${seg.widthPct}%` }} className={seg.barColor} title={PHASES[seg.key].label} />
            ))}
          </div>
          <div className="mt-3 grid grid-cols-2 gap-x-3 gap-y-2 text-xs">
            {PHASE_ORDER.map((key) => (
              <div key={key} className="flex items-center gap-1.5">
                <span className={`h-2.5 w-2.5 shrink-0 rounded-full ${CYCLE_DIAGRAM_SEGMENTS.find((s) => s.key === key)!.barColor}`} />
                <span className="text-rose-900/70 dark:text-stone-300">
                  <span className="font-medium text-rose-950 dark:text-rose-50">{PHASES[key].label}</span> · {PHASES[key].dayRange}
                </span>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h3 className="mb-2 flex items-center gap-2 text-sm font-semibold text-rose-950 dark:text-rose-50">
            <Sparkles size={16} /> 4 Fase Hormonal
          </h3>
          <div className="space-y-2">
            {PHASE_ORDER.map((key) => {
              const info = PHASES[key];
              const isExpanded = expandedPhase === key;
              return (
                <div
                  key={key}
                  className="overflow-hidden rounded-2xl border border-rose-100 bg-white shadow-sm dark:border-stone-800 dark:bg-stone-900"
                >
                  <button
                    onClick={() => setExpandedPhase(isExpanded ? null : key)}
                    className="flex w-full items-center justify-between gap-3 p-3 text-left active:scale-[0.99] transition"
                  >
                    <div className="flex items-center gap-3">
                      <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${info.color}/20 ${info.textColor}`}>
                        <Sparkles size={16} />
                      </span>
                      <div>
                        <p className="text-sm font-semibold text-rose-950 dark:text-rose-50">{info.label}</p>
                        <p className="text-xs text-rose-900/60 dark:text-stone-400">{info.dayRange}</p>
                      </div>
                    </div>
                    <ChevronDown size={16} className={`shrink-0 text-rose-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                  </button>

                  {isExpanded && (
                    <div className="space-y-2.5 border-t border-rose-50 px-3 pb-3 pt-2.5 text-sm dark:border-stone-800">
                      <div>
                        <p className="mb-0.5 font-semibold text-rose-950 dark:text-rose-50">Profil Hormon</p>
                        <p className="text-rose-900/80 dark:text-stone-300">{info.hormonal}</p>
                      </div>
                      <div>
                        <p className="mb-0.5 font-semibold text-rose-950 dark:text-rose-50">Yang Mungkin Dirasakan</p>
                        <p className="text-rose-900/80 dark:text-stone-300">{info.bodyExperience}</p>
                      </div>
                      <div>
                        <p className="mb-0.5 font-semibold text-rose-950 dark:text-rose-50">Tips Perawatan Diri</p>
                        <ul className="space-y-1">
                          {info.selfCare.map((tip) => (
                            <li key={tip.title} className="text-rose-900/80 dark:text-stone-300">
                              <span className="font-medium text-rose-950 dark:text-rose-50">{tip.title}:</span> {tip.tip}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        <section>
          <h3 className="mb-2 flex items-center gap-2 text-sm font-semibold text-rose-950 dark:text-rose-50">
            <ClipboardList size={16} /> Parameter Klinis Normal
          </h3>
          <div className="overflow-hidden rounded-2xl border border-rose-100 dark:border-stone-800">
            <table className="w-full text-left text-xs">
              <thead className="bg-rose-50 text-rose-900/70 dark:bg-stone-800 dark:text-stone-300">
                <tr>
                  <th className="px-3 py-2 font-semibold">Parameter</th>
                  <th className="px-3 py-2 font-semibold">Normal</th>
                  <th className="px-3 py-2 font-semibold">Perlu Diperhatikan</th>
                </tr>
              </thead>
              <tbody>
                {CLINICAL_PARAMETERS.map((p) => (
                  <tr key={p.parameter} className="border-t border-rose-50 dark:border-stone-800">
                    <td className="px-3 py-2 font-medium text-rose-950 dark:text-rose-50">{p.parameter}</td>
                    <td className="px-3 py-2 text-rose-900/80 dark:text-stone-300">{p.normal}</td>
                    <td className="px-3 py-2 text-amber-700 dark:text-amber-400">{p.warning}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section>
          <h3 className="mb-2 flex items-center gap-2 text-sm font-semibold text-rose-950 dark:text-rose-50">
            <AlertTriangle size={16} className="text-amber-600 dark:text-amber-400" /> Kapan Perlu ke Dokter (Sp.OG)
          </h3>
          <div className="space-y-2 rounded-2xl border border-amber-200 bg-amber-50 p-3 dark:border-amber-800 dark:bg-amber-950/40">
            {RED_FLAGS.map((flag) => (
              <div key={flag.title} className="text-xs">
                <p className="font-semibold text-amber-900 dark:text-amber-200">{flag.title}</p>
                <p className="text-amber-800 dark:text-amber-300">{flag.description}</p>
              </div>
            ))}
            <p className="pt-1 text-[11px] text-amber-700 dark:text-amber-400">
              Catatan ini bersifat edukatif dan bukan pengganti diagnosis medis profesional.
            </p>
          </div>
        </section>

        <section>
          <h3 className="mb-2 flex items-center gap-2 text-xs font-semibold text-rose-900/60 dark:text-stone-400">
            <GraduationCap size={14} /> Referensi Ilmiah
          </h3>
          <ul className="space-y-1 text-[11px] leading-relaxed text-rose-900/50 dark:text-stone-500">
            <li>
              ACOG Committee Opinion No. 651: <em>Menstruation in Girls and Adolescents: Using the Menstrual Cycle as a Vital Sign.</em>{' '}
              Obstetrics & Gynecology, 2015 (Reaffirmed 2023).
            </li>
            <li>World Health Organization (WHO): Menstrual Health and Rights Guidelines & Reproductive Health Standards.</li>
            <li>FIGO (International Federation of Gynecology and Obstetrics): System 1 Classification of Abnormal Uterine Bleeding (AUB).</li>
          </ul>
        </section>
      </div>
    </Sheet>
  );
}
