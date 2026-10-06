import { useState } from 'react';
import { Sheet } from './ui/Sheet';
import { Share, ListPlus, LayoutGrid, Menu, DownloadCloud, Smartphone } from 'lucide-react';
import { useI18n } from '../lib/i18n';

interface PwaInstallSheetProps {
  open: boolean;
  onClose: () => void;
}

type Platform = 'ios' | 'android';

const STEP_ICONS: Record<Platform, React.ReactNode[]> = {
  ios: [<Share size={20} />, <ListPlus size={20} />, <Smartphone size={20} />, <LayoutGrid size={20} />],
  android: [<Menu size={20} />, <DownloadCloud size={20} />, <Smartphone size={20} />, <LayoutGrid size={20} />],
};

export function PwaInstallSheet({ open, onClose }: PwaInstallSheetProps) {
  const { t } = useI18n();
  const [platform, setPlatform] = useState<Platform>('ios');
  const steps = t.pwaInstall[platform];

  return (
    <Sheet open={open} onClose={onClose} title={t.pwaInstall.title}>
      <div className="space-y-5 pb-4">
        <p className="text-sm text-[var(--muted)]">{t.pwaInstall.intro}</p>

        <div className="flex rounded-full bg-[var(--surface)] p-1">
          <button
            onClick={() => setPlatform('ios')}
            className={`flex-1 rounded-full py-2 text-sm font-semibold transition ${
              platform === 'ios' ? 'bg-[var(--card)] text-[var(--ink)] shadow-sm' : 'text-[var(--muted)]'
            }`}
          >
            {t.pwaInstall.iosTab}
          </button>
          <button
            onClick={() => setPlatform('android')}
            className={`flex-1 rounded-full py-2 text-sm font-semibold transition ${
              platform === 'android'
                ? 'bg-[var(--card)] text-[var(--ink)] shadow-sm'
                : 'text-[var(--muted)]'
            }`}
          >
            {t.pwaInstall.androidTab}
          </button>
        </div>

        <ol className="space-y-4">
          {steps.map((step, i) => (
            <li key={step.title} className="flex gap-3">
              <div className="flex shrink-0 flex-col items-center">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#FFA7DC] text-[#181818]">
                  {STEP_ICONS[platform][i]}
                </span>
                {i < steps.length - 1 && <span className="mt-1 h-full w-px flex-1 bg-[var(--line)]" />}
              </div>
              <div className="pb-2">
                <p className="text-xs font-semibold uppercase tracking-wide text-[var(--muted)]">{t.pwaInstall.stepLabel(i + 1)}</p>
                <p className="text-sm font-semibold text-[var(--ink)]">{step.title}</p>
                <p className="mt-0.5 text-sm text-[var(--muted)]">{step.description}</p>
              </div>
            </li>
          ))}
        </ol>

        <p className="rounded-2xl bg-[#FFE3A3] p-3 text-xs text-[#181818]">{t.pwaInstall.footerNote}</p>
      </div>
    </Sheet>
  );
}
