import { Sheet } from './ui/Sheet';
import { Download, Upload, ShieldAlert, FolderLock } from 'lucide-react';
import { useI18n } from '../lib/i18n';

interface BackupGuideSheetProps {
  open: boolean;
  onClose: () => void;
}

export function BackupGuideSheet({ open, onClose }: BackupGuideSheetProps) {
  const { t } = useI18n();
  return (
    <Sheet open={open} onClose={onClose} title={t.backupGuide.title}>
      <div className="space-y-5 pb-4">
        <p className="text-sm text-[var(--muted)]">{t.backupGuide.intro}</p>

        <section>
          <div className="mb-2 flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#FFA7DC] text-[#181818]">
              <Download size={18} />
            </span>
            <h3 className="text-sm font-semibold text-[var(--ink)]">{t.backupGuide.backupTitle}</h3>
          </div>
          <ol className="ml-11 list-decimal space-y-1 text-sm text-[var(--muted)]">
            {t.backupGuide.backupSteps.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
        </section>

        <section>
          <div className="mb-2 flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#FFA7DC] text-[#181818]">
              <Upload size={18} />
            </span>
            <h3 className="text-sm font-semibold text-[var(--ink)]">{t.backupGuide.restoreTitle}</h3>
          </div>
          <ol className="ml-11 list-decimal space-y-1 text-sm text-[var(--muted)]">
            {t.backupGuide.restoreSteps.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
        </section>

        <div className="flex gap-3 rounded-2xl bg-[#FFE3A3] p-3">
          <ShieldAlert size={18} className="mt-0.5 shrink-0 text-[#181818]" />
          <p className="text-xs leading-relaxed text-[#181818]">{t.backupGuide.warningReplace}</p>
        </div>

        <div className="flex gap-3 rounded-2xl bg-[var(--surface)] p-3">
          <FolderLock size={18} className="mt-0.5 shrink-0 text-[var(--ink)]" />
          <p className="text-xs leading-relaxed text-[var(--muted)]">{t.backupGuide.noPasswordNote}</p>
        </div>
      </div>
    </Sheet>
  );
}
