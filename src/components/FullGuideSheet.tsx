import { useState } from 'react';
import { AlertTriangle, BookOpen, ChevronDown, ExternalLink } from 'lucide-react';
import { Sheet } from './ui/Sheet';
import { CareIcon } from './CareIcon';
import { PHASE_ICON, PHASE_TINT, PHASES } from '../data/phases';
import type { PhaseKey } from '../data/phases';

interface FullGuideSheetProps {
  open: boolean;
  onClose: () => void;
}

const PHASE_ORDER: PhaseKey[] = ['menstrual', 'follicular', 'ovulatory', 'luteal'];

const PHASE_DAYS: Record<PhaseKey, number> = { menstrual: 5, follicular: 8, ovulatory: 1, luteal: 14 };

const CLINICAL_PARAMETERS: { parameter: string; normal: string; warning?: string }[] = [
  { parameter: 'Panjang siklus', normal: '21–35 hari (rata-rata 28 hari)', warning: '<21 hari atau >35 hari' },
  { parameter: 'Durasi menstruasi', normal: '2–7 hari (rata-rata 4–5 hari)', warning: '>8 hari' },
  { parameter: 'Variasi antar siklus', normal: '≤4–5 hari', warning: '>7–9 hari berturut-turut' },
  { parameter: 'Ovulasi & masa subur', normal: '~14 hari sebelum menstruasi berikutnya' },
];

const RED_FLAGS = [
  { title: 'Nyeri hebat (dismenore)', description: 'Nyeri panggul yang mengganggu aktivitas harian dan tidak mereda dengan obat pereda nyeri biasa.' },
  { title: 'Pendarahan abnormal (menorrhagia)', description: 'Mengganti pembalut/tampon setiap jam selama beberapa jam berturut-turut.' },
  { title: 'Siklus tidak teratur', description: 'Siklus konsisten lebih pendek dari 21 hari atau lebih panjang dari 35 hari.' },
  { title: 'Amenore sekunder', description: 'Tidak menstruasi selama 90+ hari berturut-turut (dan bukan karena kehamilan).' },
  { title: 'Pendarahan intermenstrual', description: 'Flek atau pendarahan yang muncul di antara periode menstruasi yang jelas.' },
];

const REFERENCES = [
  {
    org: 'ACOG',
    title: 'Committee Opinion No. 651: Menstruation in Girls and Adolescents: Using the Menstrual Cycle as a Vital Sign',
    meta: 'Obstetrics & Gynecology 2015;126(6):e143–6 · Reaffirmed 2025',
    href: 'https://www.acog.org/clinical/clinical-guidance/committee-opinion/articles/2015/12/menstruation-in-girls-and-adolescents-using-the-menstrual-cycle-as-a-vital-sign',
  },
  {
    org: 'FIGO',
    title: 'The two FIGO systems for normal and abnormal uterine bleeding symptoms and classification of causes of abnormal uterine bleeding in the reproductive years: 2018 revisions',
    meta: 'Int J Gynaecol Obstet 2018;143(3):393–408',
    href: 'https://doi.org/10.1002/ijgo.12666',
  },
  {
    org: 'WHO',
    title: 'WHO statement on menstrual health and rights',
    meta: '22 Juni 2022',
    href: 'https://www.who.int/news/item/22-06-2022-who-statement-on-menstrual-health-and-rights',
  },
];

const H3 = 'mb-3 text-sm font-bold';

export function FullGuideSheet({ open, onClose }: FullGuideSheetProps) {
  const [expandedPhase, setExpandedPhase] = useState<PhaseKey | null>('menstrual');

  return (
    <Sheet open={open} onClose={onClose} title="Panduan Lengkap Menstruasi">
      <div className="space-y-7 pb-4">
        <section className="flex gap-3">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#FFA7DC] text-[#181818]">
            <BookOpen size={18} />
          </span>
          <p className="text-sm leading-relaxed text-[var(--muted)]">
            Menurut ACOG (American College of Obstetricians and Gynecologists), siklus menstruasi layak dipantau sebagai{' '}
            <span className="font-semibold text-[var(--ink)]">tanda vital</span>, sama pentingnya dengan tekanan darah atau detak
            jantung. Dengan mengenal ritmemu sendiri, perubahan pada panjang siklus atau durasi haid lebih cepat kamu sadari, termasuk yang bisa
            menjadi petunjuk awal kondisi seperti PCOS, gangguan tiroid, atau endometriosis.
          </p>
        </section>

        <section>
          <h3 className={H3}>Perjalanan satu siklus (28 hari)</h3>
          <div className="flex h-8 gap-0.5 overflow-hidden rounded-full">
            {PHASE_ORDER.map((key) => (
              <div key={key} style={{ flexGrow: PHASE_DAYS[key], background: PHASE_TINT[key] }} title={PHASES[key].label} />
            ))}
          </div>
          <div className="mt-3 grid grid-cols-2 gap-x-3 gap-y-2 text-xs">
            {PHASE_ORDER.map((key) => (
              <div key={key} className="flex items-start gap-2">
                <span className="mt-0.5 h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: PHASE_TINT[key] }} />
                <span>
                  <span className="block font-bold">{PHASES[key].label}</span>
                  <span className="block text-[var(--muted)]">{PHASES[key].dayRange}</span>
                </span>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h3 className={H3}>4 fase hormonal</h3>
          <div className="divide-y divide-[var(--line)] border-y border-[var(--line)]">
            {PHASE_ORDER.map((key) => {
              const info = PHASES[key];
              const isExpanded = expandedPhase === key;
              return (
                <div key={key}>
                  <button
                    onClick={() => setExpandedPhase(isExpanded ? null : key)}
                    aria-expanded={isExpanded}
                    className="flex w-full items-center gap-3 py-3 text-left transition active:opacity-70"
                  >
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-[#181818]" style={{ background: PHASE_TINT[key] }}>
                      <CareIcon name={PHASE_ICON[key]} size={20} />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-sm font-bold">{info.label}</span>
                      <span className="block text-xs text-[var(--muted)]">{info.dayRange}</span>
                    </span>
                    <ChevronDown size={18} className={`shrink-0 text-[var(--muted)] transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                  </button>

                  {isExpanded && (
                    <div className="space-y-3 pb-4 pl-[3.25rem] pt-1 text-sm leading-relaxed">
                      <div>
                        <p className="mb-0.5 font-bold">Yang terjadi di tubuhmu</p>
                        <p className="text-[var(--muted)]">{info.hormonal}</p>
                      </div>
                      <div>
                        <p className="mb-0.5 font-bold">Yang mungkin kamu rasakan</p>
                        <p className="text-[var(--muted)]">{info.bodyExperience}</p>
                      </div>
                      <div>
                        <p className="mb-0.5 font-bold">Cara merawat diri</p>
                        <ul className="space-y-1.5">
                          {info.selfCare.map((tip) => (
                            <li key={tip.title} className="text-[var(--muted)]">
                              <span className="font-bold text-[var(--ink)]">{tip.title}:</span> {tip.tip}
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
          <h3 className={H3}>Angka normalnya</h3>
          <div className="divide-y divide-[var(--line)] border-y border-[var(--line)]">
            {CLINICAL_PARAMETERS.map((p) => (
              <div key={p.parameter} className="py-3">
                <p className="text-xs text-[var(--muted)]">{p.parameter}</p>
                <p className="mt-0.5 text-sm font-bold">{p.normal}</p>
                {p.warning && (
                  <p className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-[#FFE3A3] px-2.5 py-1 text-xs font-semibold text-[#181818]">
                    <AlertTriangle size={12} className="shrink-0" /> Perlu diperhatikan: {p.warning}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>

        <section>
          <h3 className={H3}>Kapan perlu ke dokter (Sp.OG)</h3>
          <div className="rounded-2xl bg-[#FFE3A3] p-4 text-[#181818]">
            <ul className="space-y-3 text-sm">
              {RED_FLAGS.map((flag) => (
                <li key={flag.title}>
                  <p className="font-bold">{flag.title}</p>
                  <p className="text-[#181818]/80">{flag.description}</p>
                </li>
              ))}
            </ul>
            <p className="mt-4 border-t border-[#181818]/15 pt-3 text-xs text-[#181818]/70">
              Catatan ini bersifat edukatif dan bukan pengganti diagnosis medis profesional.
            </p>
          </div>
        </section>

        <section>
          <h3 className={H3}>Referensi</h3>
          <div className="divide-y divide-[var(--line)] border-y border-[var(--line)]">
            {REFERENCES.map((ref) => (
              <a key={ref.href} href={ref.href} target="_blank" rel="noopener noreferrer" className="flex items-start gap-3 py-3 transition active:opacity-70">
                <span className="min-w-0 flex-1">
                  <span className="block text-xs font-bold">{ref.org}</span>
                  <span className="block text-xs leading-relaxed text-[var(--muted)]">{ref.title}</span>
                  <span className="mt-0.5 block text-[0.6875rem] text-[var(--muted)]">{ref.meta}</span>
                </span>
                <ExternalLink size={16} className="mt-0.5 shrink-0 text-[var(--muted)]" />
              </a>
            ))}
          </div>
        </section>
      </div>
    </Sheet>
  );
}
