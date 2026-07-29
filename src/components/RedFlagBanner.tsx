import { AlertTriangle } from 'lucide-react';
import type { Flag, RedFlagKey } from '../lib/cycleMath';

interface RedFlagBannerProps {
  flags: Flag<RedFlagKey>[];
}

export function RedFlagBanner({ flags }: RedFlagBannerProps) {
  if (flags.length === 0) return null;

  return (
    <div className="mx-4 rounded-2xl border border-amber-300 bg-amber-50 p-4 dark:border-amber-800 dark:bg-amber-950/40">
      <div className="flex items-start gap-3">
        <AlertTriangle size={20} className="mt-0.5 shrink-0 text-amber-600 dark:text-amber-400" />
        <div>
          <p className="text-sm font-semibold text-amber-900 dark:text-amber-200">Perlu diperhatikan</p>
          <ul className="mt-1 space-y-1 text-sm text-amber-800 dark:text-amber-300">
            {flags.map((f) => (
              <li key={f.key}>• {f.message}</li>
            ))}
          </ul>
          <p className="mt-2 text-xs text-amber-700 dark:text-amber-400">
            Pertimbangkan untuk berkonsultasi dengan dokter spesialis kandungan (Sp.OG). Catatan ini bersifat edukatif, bukan diagnosis medis.
          </p>
        </div>
      </div>
    </div>
  );
}
