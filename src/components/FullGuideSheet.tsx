import { useState } from 'react';
import { AlertTriangle, BookOpen, ChevronDown, ExternalLink } from 'lucide-react';
import { Sheet } from './ui/Sheet';
import { CareIcon } from './CareIcon';
import { PHASE_ICON, PHASE_TINT } from '../data/phases';
import type { PhaseKey } from '../data/phases';
import { useI18n } from '../lib/i18n';

interface FullGuideSheetProps {
  open: boolean;
  onClose: () => void;
}

const PHASE_ORDER: PhaseKey[] = ['menstrual', 'follicular', 'ovulatory', 'luteal'];

const PHASE_DAYS: Record<PhaseKey, number> = { menstrual: 5, follicular: 8, ovulatory: 1, luteal: 14 };

function getReferences(whoDate: string) {
  return [
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
      meta: whoDate,
      href: 'https://www.who.int/news/item/22-06-2022-who-statement-on-menstrual-health-and-rights',
    },
  ];
}

const H3 = 'mb-3 text-sm font-bold';

export function FullGuideSheet({ open, onClose }: FullGuideSheetProps) {
  const { t } = useI18n();
  const [expandedPhase, setExpandedPhase] = useState<PhaseKey | null>('menstrual');
  const references = getReferences(t.fullGuide.whoDate);

  return (
    <Sheet open={open} onClose={onClose} title={t.fullGuide.title}>
      <div className="space-y-7 pb-4">
        <section className="flex gap-3">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#FFA7DC] text-[#181818]">
            <BookOpen size={18} />
          </span>
          <p className="text-sm leading-relaxed text-[var(--muted)]">{t.fullGuide.intro}</p>
        </section>

        <section>
          <h3 className={H3}>{t.fullGuide.cycleJourneyTitle}</h3>
          <div className="flex h-8 gap-0.5 overflow-hidden rounded-full">
            {PHASE_ORDER.map((key) => (
              <div key={key} style={{ flexGrow: PHASE_DAYS[key], background: PHASE_TINT[key] }} title={t.phases[key].label} />
            ))}
          </div>
          <div className="mt-3 grid grid-cols-2 gap-x-3 gap-y-2 text-xs">
            {PHASE_ORDER.map((key) => (
              <div key={key} className="flex items-start gap-2">
                <span className="mt-0.5 h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: PHASE_TINT[key] }} />
                <span>
                  <span className="block font-bold">{t.phases[key].label}</span>
                  <span className="block text-[var(--muted)]">{t.phases[key].dayRange}</span>
                </span>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h3 className={H3}>{t.fullGuide.hormonalPhasesTitle}</h3>
          <div className="divide-y divide-[var(--line)] border-y border-[var(--line)]">
            {PHASE_ORDER.map((key) => {
              const info = t.phases[key];
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
                        <p className="mb-0.5 font-bold">{t.fullGuide.bodyNowLabel}</p>
                        <p className="text-[var(--muted)]">{info.hormonal}</p>
                      </div>
                      <div>
                        <p className="mb-0.5 font-bold">{t.fullGuide.bodyFeelLabel}</p>
                        <p className="text-[var(--muted)]">{info.bodyExperience}</p>
                      </div>
                      <div>
                        <p className="mb-0.5 font-bold">{t.fullGuide.selfCareLabel}</p>
                        <ul className="space-y-1.5">
                          {info.selfCare.map((tip) => (
                            <li key={tip.care} className="text-[var(--muted)]">
                              <span className="font-bold text-[var(--ink)]">{t.careTitles[tip.care]}:</span> {tip.tip}
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
          <h3 className={H3}>{t.fullGuide.normalNumbersTitle}</h3>
          <div className="divide-y divide-[var(--line)] border-y border-[var(--line)]">
            {t.fullGuide.clinicalParameters.map((p) => (
              <div key={p.parameter} className="py-3">
                <p className="text-xs text-[var(--muted)]">{p.parameter}</p>
                <p className="mt-0.5 text-sm font-bold">{p.normal}</p>
                {p.warning && (
                  <p className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-[#FFE3A3] px-2.5 py-1 text-xs font-semibold text-[#181818]">
                    <AlertTriangle size={12} className="shrink-0" /> {t.fullGuide.warningPrefix} {p.warning}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>

        <section>
          <h3 className={H3}>{t.fullGuide.docTitle}</h3>
          <div className="rounded-2xl bg-[#FFE3A3] p-4 text-[#181818]">
            <ul className="space-y-3 text-sm">
              {t.fullGuide.redFlags.map((flag) => (
                <li key={flag.title}>
                  <p className="font-bold">{flag.title}</p>
                  <p className="text-[#181818]/80">{flag.description}</p>
                </li>
              ))}
            </ul>
            <p className="mt-4 border-t border-[#181818]/15 pt-3 text-xs text-[#181818]/70">{t.fullGuide.educationalNote}</p>
          </div>
        </section>

        <section>
          <h3 className={H3}>{t.fullGuide.referencesTitle}</h3>
          <div className="divide-y divide-[var(--line)] border-y border-[var(--line)]">
            {references.map((ref) => (
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
