import { useState } from 'react';
import { ChevronDown, Sparkles } from 'lucide-react';
import { PHASES } from '../data/phases';
import type { PhaseKey } from '../data/phases';

interface EducationCardProps {
  phase: PhaseKey | null;
}

export function EducationCard({ phase }: EducationCardProps) {
  const [expanded, setExpanded] = useState(false);

  if (!phase) {
    return (
      <div className="mx-4 rounded-2xl border border-rose-100 bg-white p-4 text-sm text-rose-900/70 dark:border-stone-800 dark:bg-stone-900 dark:text-stone-300">
        Mulai catat hari pertama menstruasimu untuk melihat fase siklus dan edukasi kesehatan yang sesuai.
      </div>
    );
  }

  const info = PHASES[phase];

  return (
    <div className="mx-4 overflow-hidden rounded-2xl border border-rose-100 bg-white shadow-sm dark:border-stone-800 dark:bg-stone-900">
      <button
        onClick={() => setExpanded((v) => !v)}
        className="flex w-full items-center justify-between gap-3 p-4 text-left active:scale-[0.99] transition"
      >
        <div className="flex items-center gap-3">
          <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${info.color}/20 ${info.textColor}`}>
            <Sparkles size={18} />
          </span>
          <div>
            <p className="text-sm font-semibold text-rose-950 dark:text-rose-50">{info.label}</p>
            <p className="text-xs text-rose-900/60 dark:text-stone-400">{info.dayRange}</p>
          </div>
        </div>
        <ChevronDown size={18} className={`text-rose-400 transition-transform ${expanded ? 'rotate-180' : ''}`} />
      </button>

      {expanded && (
        <div className="space-y-3 border-t border-rose-50 px-4 pb-4 pt-3 text-sm dark:border-stone-800">
          <div>
            <p className="mb-1 font-semibold text-rose-950 dark:text-rose-50">Profil Hormon</p>
            <p className="text-rose-900/80 dark:text-stone-300">{info.hormonal}</p>
          </div>
          <div>
            <p className="mb-1 font-semibold text-rose-950 dark:text-rose-50">Yang Mungkin Kamu Rasakan</p>
            <p className="text-rose-900/80 dark:text-stone-300">{info.bodyExperience}</p>
          </div>
          <div>
            <p className="mb-1 font-semibold text-rose-950 dark:text-rose-50">Tips Perawatan Diri</p>
            <ul className="space-y-1.5">
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
}
