import { Sheet } from "./ui/Sheet";
import { Database, Lock, Share2, Trash2 } from "lucide-react";
import { useI18n } from "../lib/i18n";

interface PrivacyPolicySheetProps {
  open: boolean;
  onClose: () => void;
}

export function PrivacyPolicySheet({ open, onClose }: PrivacyPolicySheetProps) {
  const { t } = useI18n();
  return (
    <Sheet open={open} onClose={onClose} title={t.privacy.title}>
      <div className="space-y-5 pb-4">
        <p className="text-sm text-[var(--muted)]">{t.privacy.intro}</p>

        <section>
          <div className="mb-2 flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#FFA7DC] text-[#181818]">
              <Database size={18} />
            </span>
            <h3 className="text-sm font-semibold text-[var(--ink)]">{t.privacy.section1Title}</h3>
          </div>
          <p className="ml-11 text-sm text-[var(--muted)]">{t.privacy.section1Body}</p>
        </section>

        <section>
          <div className="mb-2 flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#FFA7DC] text-[#181818]">
              <Share2 size={18} />
            </span>
            <h3 className="text-sm font-semibold text-[var(--ink)]">{t.privacy.section2Title}</h3>
          </div>
          <ul className="ml-11 list-disc space-y-1 text-sm text-[var(--muted)]">
            {t.privacy.section2Items.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <p className="ml-11 mt-2 text-sm text-[var(--muted)]">{t.privacy.section2Footer}</p>
        </section>

        <section>
          <div className="mb-2 flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#FFA7DC] text-[#181818]">
              <Lock size={18} />
            </span>
            <h3 className="text-sm font-semibold text-[var(--ink)]">{t.privacy.section3Title}</h3>
          </div>
          <p className="ml-11 text-sm text-[var(--muted)]">{t.privacy.section3Body}</p>
        </section>

        <div className="flex gap-3 rounded-2xl bg-[var(--surface)] p-3">
          <Trash2
            size={18}
            className="mt-0.5 shrink-0 text-[var(--ink)]"
          />
          <p className="text-xs leading-relaxed text-[var(--muted)]">{t.privacy.deleteNote}</p>
        </div>
      </div>
    </Sheet>
  );
}
