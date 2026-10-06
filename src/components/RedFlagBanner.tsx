import { AlertTriangle } from 'lucide-react';
import type { Flag, RedFlagKey } from '../lib/cycleMath';
import { useI18n } from '../lib/i18n';

interface RedFlagBannerProps {
  flags: Flag<RedFlagKey>[];
}

export function RedFlagBanner({ flags }: RedFlagBannerProps) {
  const { t } = useI18n();
  if (flags.length === 0) return null;

  return (
    <div className="rounded-[24px] bg-[#FFE3A3] p-5 text-[#181818]">
      <div className="flex items-start gap-3">
        <AlertTriangle size={20} className="mt-0.5 shrink-0" />
        <div>
          <p className="text-sm font-bold">{t.redFlag.title}</p>
          <ul className="mt-1 space-y-1 text-sm">
            {flags.map((f) => (
              <li key={f.key}>• {t.flags.red[f.key]}</li>
            ))}
          </ul>
          <p className="mt-2 text-xs text-[#181818]/70">{t.redFlag.footer}</p>
        </div>
      </div>
    </div>
  );
}
