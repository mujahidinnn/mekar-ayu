import { useEffect, useRef, useState } from 'react';
import { format } from 'date-fns';
import {
  BookOpen,
  ChevronRight,
  Coffee,
  Database,
  Download,
  FileSpreadsheet,
  FileText,
  Globe,
  HelpCircle,
  Loader2,
  Lock,
  MessageCircle,
  Monitor,
  Moon,
  Palette,
  Send,
  ShieldAlert,
  ShieldCheck,
  ShieldOff,
  Smartphone,
  Sun,
  Trash2,
  Upload,
} from 'lucide-react';
import { Sheet } from '../ui/Sheet';
import { ConfirmDialog } from '../ui/ConfirmDialog';
import { PasswordDialog } from '../ui/PasswordDialog';
import { PwaInstallSheet } from '../PwaInstallSheet';
import { BackupGuideSheet } from '../BackupGuideSheet';
import { FullGuideSheet } from '../FullGuideSheet';
import { PrivacyPolicySheet } from '../PrivacyPolicySheet';
import type { CycleEntry, DailyLog } from '../../db/schema';
import type { CycleStats } from '../../lib/cycleMath';
import { exportBackupJSON, importBackupJSON, isEncryptedBackup, readBackupFile } from '../../lib/export/json';
import { generateWhatsAppSummary } from '../../lib/export/whatsapp';
import { withSync } from '../../lib/syncStatus';
import { formatStorageSize } from '../../lib/formatStorageSize';
import { deleteAllData } from '../../lib/deleteAllData';
import { useInstallPrompt } from '../../hooks/useInstallPrompt';
import type { ThemePreference } from '../../lib/theme';
import { useI18n } from '../../lib/i18n';
import type { AppLocale } from '../../lib/i18n';
import type { Translations } from '../../lib/i18n/locales/id';

interface MoreScreenProps {
  onRefreshStorage: () => void;
  cycles: CycleEntry[];
  dailyLogs: DailyLog[];
  stats: CycleStats;
  usageKB: number;
  recordCount: number;
  isPersisted: boolean;
  themePreference: ThemePreference;
  onThemeChange: (pref: ThemePreference) => void;
}

const WA_NUMBER_KEY = 'mekarayu_wa_number';

type Panel = 'storage' | 'theme' | 'language' | 'backup' | 'safety' | 'fullGuide' | 'backupGuide' | 'privacy' | null;

function getThemeOptions(t: Translations): { key: ThemePreference; label: string; icon: React.ReactNode }[] {
  return [
    { key: 'light', label: t.more.themeOptions.light, icon: <Sun size={16} /> },
    { key: 'dark', label: t.more.themeOptions.dark, icon: <Moon size={16} /> },
    { key: 'system', label: t.more.themeOptions.system, icon: <Monitor size={16} /> },
  ];
}

function getLanguageOptions(t: Translations): { key: AppLocale; label: string }[] {
  return [
    { key: 'id', label: t.more.languageOptions.id },
    { key: 'en', label: t.more.languageOptions.en },
  ];
}

export function MoreScreen({
  onRefreshStorage,
  cycles,
  dailyLogs,
  stats,
  usageKB,
  recordCount,
  isPersisted,
  themePreference,
  onThemeChange,
}: MoreScreenProps) {
  const { t, locale, setLocale, dateFnsLocale } = useI18n();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [panel, setPanel] = useState<Panel>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [pwaGuideOpen, setPwaGuideOpen] = useState(false);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [confirmInstallOpen, setConfirmInstallOpen] = useState(false);
  const [pendingImport, setPendingImport] = useState<{ text: string; cycleCount: number; logCount: number } | null>(null);
  const [exportLockOpen, setExportLockOpen] = useState<'download' | 'share' | null>(null);
  const [waNumber, setWaNumber] = useState(() => localStorage.getItem(WA_NUMBER_KEY) ?? '');
  const [exportBusy, setExportBusy] = useState(false);
  const [pendingLockedFile, setPendingLockedFile] = useState<string | null>(null);
  const [unlockError, setUnlockError] = useState<string | null>(null);
  const [unlockBusy, setUnlockBusy] = useState(false);
  const [exportingReport, setExportingReport] = useState<'pdf' | 'excel' | null>(null);
  const { isInstallable, isInstalled, promptInstall } = useInstallPrompt();

  useEffect(() => {
    onRefreshStorage();
  }, [onRefreshStorage]);

  const flash = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 4000);
  };

  const handleWhatsAppShare = () => {
    const monthName = format(new Date(), 'MMMM yyyy', { locale: dateFnsLocale });
    window.open(generateWhatsAppSummary(t, monthName, cycles, dailyLogs, waNumber), '_blank');
  };

  const handlePdfExport = async () => {
    if (exportingReport) return;
    setExportingReport('pdf');
    try {
      const { generateMedicalReportPDF } = await import('../../lib/export/pdf');
      generateMedicalReportPDF(t, locale, cycles, dailyLogs, stats);
    } catch (err) {
      console.error('Gagal membuat laporan PDF', err);
      flash('error', t.more.toasts.pdfError);
    } finally {
      setExportingReport(null);
    }
  };

  const handleExcelExport = async () => {
    if (exportingReport) return;
    setExportingReport('excel');
    try {
      const { exportExcelReport } = await import('../../lib/export/excel');
      exportExcelReport(t, cycles, dailyLogs);
    } catch (err) {
      console.error('Gagal membuat laporan Excel', err);
      flash('error', t.more.toasts.excelError);
    } finally {
      setExportingReport(null);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    try {
      const text = await file.text();
      const data = JSON.parse(text);
      if (isEncryptedBackup(data)) {
        setUnlockError(null);
        setPendingLockedFile(text);
        return;
      }
      if (!Array.isArray(data.cycles) || !Array.isArray(data.dailyLogs)) throw new Error('invalid');
      setPendingImport({ text, cycleCount: data.cycles.length, logCount: data.dailyLogs.length });
    } catch {
      flash('error', t.more.toasts.fileUnreadable);
    }
  };

  const handleUnlockSubmit = async (password: string) => {
    if (!pendingLockedFile) return;
    setUnlockBusy(true);
    try {
      const plainText = await readBackupFile(pendingLockedFile, password);
      const data = JSON.parse(plainText);
      setPendingImport({ text: plainText, cycleCount: data.cycles.length, logCount: data.dailyLogs.length });
      setPendingLockedFile(null);
      setUnlockError(null);
    } catch (err) {
      setUnlockError(
        err instanceof Error && err.message === 'WRONG_PASSWORD' ? t.more.toasts.wrongPassword : t.more.toasts.lockedFileInvalid,
      );
    } finally {
      setUnlockBusy(false);
    }
  };

  const handleExportSubmit = async (password: string) => {
    setExportBusy(true);
    try {
      await exportBackupJSON(password, exportLockOpen === 'share');
      setExportLockOpen(null);
    } catch {
      flash('error', t.more.toasts.exportLockFailed);
    } finally {
      setExportBusy(false);
    }
  };

  const confirmImport = async () => {
    if (!pendingImport) return;
    try {
      await withSync(() => importBackupJSON(pendingImport.text));
      onRefreshStorage();
      flash('success', t.more.toasts.importedSuccess);
    } catch {
      flash('error', t.more.toasts.importError);
    } finally {
      setPendingImport(null);
    }
  };

  const confirmDelete = async () => {
    await withSync(() => deleteAllData());
    localStorage.removeItem(WA_NUMBER_KEY);
    setWaNumber('');
    onRefreshStorage();
    setConfirmDeleteOpen(false);
    flash('success', t.more.toasts.deletedSuccess);
  };

  const handleConfirmInstall = async () => {
    setConfirmInstallOpen(false);
    if (!isInstallable) {
      setPwaGuideOpen(true);
      return;
    }
    if ((await promptInstall()) === 'accepted') flash('success', t.more.toasts.installSuccess);
  };

  const close = () => setPanel(null);
  const themeOptions = getThemeOptions(t);
  const languageOptions = getLanguageOptions(t);
  const themeLabel = themeOptions.find((o) => o.key === themePreference)?.label;
  const languageLabel = languageOptions.find((o) => o.key === locale)?.label;

  return (
    <main className="flex-1 space-y-6 px-5 pb-32 pt-[max(env(safe-area-inset-top),1.25rem)] lg:pb-10">
      <div className="text-center">
        <h1 className="text-base font-extrabold">{t.more.title}</h1>
        <p className="text-xs font-medium text-[var(--muted)]">{t.more.subtitle}</p>
      </div>

      {message && (
        <p
          role="status"
          className={`pointer-events-none fixed inset-x-5 top-[max(env(safe-area-inset-top),1rem)] z-[60] mx-auto !mt-0 max-w-[calc(28rem-2.5rem)] rounded-2xl px-4 py-3 text-center text-xs font-semibold text-[#181818] shadow-lg ${
            message.type === 'success' ? 'bg-[#C9F2D9]' : 'bg-[#FFB4B4]'
          }`}
        >
          {message.text}
        </p>
      )}

      <div className="space-y-6 lg:grid lg:grid-cols-2 lg:items-start lg:gap-6 lg:space-y-0">
      <Group title={t.more.groupApp}>
        <Row icon={<Palette size={18} />} tint="#D5C3FF" label={t.more.display} sub={themeLabel} onClick={() => setPanel('theme')} />
        <Row icon={<Globe size={18} />} tint="#B5D5FF" label={t.more.language} sub={languageLabel} onClick={() => setPanel('language')} />
        {!isInstalled && (
          <Row icon={<Smartphone size={18} />} tint="#FFB0C4" label={t.more.installApp} sub={t.more.installAppSub} onClick={() => setConfirmInstallOpen(true)} />
        )}
      </Group>

      <Group title={t.more.groupGuide}>
        <Row icon={<BookOpen size={18} />} tint="#FFB0C4" label={t.more.fullGuide} sub={t.more.fullGuideSub} onClick={() => setPanel('fullGuide')} />
        <Row icon={<HelpCircle size={18} />} tint="#B5D5FF" label={t.more.backupGuideTitle} sub={t.more.backupGuideSub} onClick={() => setPanel('backupGuide')} />
      </Group>

      <Group title={t.more.groupData}>
        <Row icon={<Download size={18} />} tint="#FFE3A3" label={t.more.backupExport} sub={t.more.backupExportSub} onClick={() => setPanel('backup')} />
        <Row icon={<Database size={18} />} tint="#B5D5FF" label={t.more.localStorage} sub={t.more.localStorageSub(recordCount, formatStorageSize(usageKB))} onClick={() => setPanel('storage')} />
        <Row icon={<ShieldAlert size={18} />} tint="#FF8A80" label={t.more.dataSafety} sub={t.more.dataSafetySub} onClick={() => setPanel('safety')} />
      </Group>

      <Group title={t.more.groupAbout}>
        <Row icon={<Lock size={18} />} tint="#D5C3FF" label={t.more.privacyPolicy} sub={t.more.privacyPolicySub} onClick={() => setPanel('privacy')} />
        <Row icon={<Coffee size={18} />} tint="#FFE3A3" label={t.more.supportDev} sub={t.more.supportDevSub} href="https://trakteer.id/mujahidinnn/tip" />
      </Group>

      <Group title={t.more.groupDanger}>
        <Row icon={<Trash2 size={18} />} tint="#FFB4B4" label={t.more.deleteAll} sub={t.more.deleteAllSub} danger onClick={() => setConfirmDeleteOpen(true)} />
      </Group>
      </div>

      <p className="text-center text-[0.6875rem] leading-relaxed text-[var(--muted)]">{t.more.footerNote}</p>

      <Sheet open={panel === 'storage'} onClose={close} title={t.more.storageSheetTitle}>
        <div className="space-y-3 text-sm">
          <KV k={t.more.totalStoredLabel} v={t.more.totalStored(recordCount)} />
          <KV k={t.more.dataSizeLabel} v={formatStorageSize(usageKB)} />
          <div className={`flex items-center gap-2 rounded-2xl p-4 text-xs font-semibold text-[#181818] ${isPersisted ? 'bg-[#C9F2D9]' : 'bg-[#FFE3A3]'}`}>
            {isPersisted ? <ShieldCheck size={18} /> : <ShieldOff size={18} />}
            {isPersisted ? t.more.persistedYes : t.more.persistedNo}
          </div>
        </div>
      </Sheet>

      <Sheet open={panel === 'theme'} onClose={close} title={t.more.display}>
        <div className="space-y-2">
          {themeOptions.map((opt) => {
            const active = themePreference === opt.key;
            return (
              <button
                key={opt.key}
                onClick={() => onThemeChange(opt.key)}
                aria-pressed={active}
                className={`flex w-full items-center gap-3 rounded-2xl px-4 py-3.5 text-sm font-semibold transition active:scale-[0.99] ${
                  active ? 'bg-[var(--ink)] text-white dark:text-[#181818]' : 'bg-[var(--surface)]'
                }`}
              >
                {opt.icon} {opt.label}
              </button>
            );
          })}
        </div>
      </Sheet>

      <Sheet open={panel === 'language'} onClose={close} title={t.more.language}>
        <div className="space-y-2">
          {languageOptions.map((opt) => {
            const active = locale === opt.key;
            return (
              <button
                key={opt.key}
                onClick={() => setLocale(opt.key)}
                aria-pressed={active}
                className={`flex w-full items-center gap-3 rounded-2xl px-4 py-3.5 text-sm font-semibold transition active:scale-[0.99] ${
                  active ? 'bg-[var(--ink)] text-white dark:text-[#181818]' : 'bg-[var(--surface)]'
                }`}
              >
                {opt.label}
              </button>
            );
          })}
        </div>
      </Sheet>

      <Sheet open={panel === 'backup'} onClose={close} title={t.more.backupSheetTitle}>
        <div className="space-y-2">
          <Action icon={<Download size={18} />} label={t.more.backupJSON} sub={t.more.backupJSONSub} onClick={() => setExportLockOpen('download')} />
          {'canShare' in navigator && (
            <Action icon={<Send size={18} />} label={t.more.shareWA} sub={t.more.shareWASub} onClick={() => setExportLockOpen('share')} />
          )}
          <Action
            icon={exportingReport === 'pdf' ? <Loader2 size={18} className="animate-spin" /> : <FileText size={18} />}
            label={exportingReport === 'pdf' ? t.common.processing : t.more.downloadPDF}
            sub={t.more.downloadPDFSub}
            onClick={handlePdfExport}
            disabled={exportingReport !== null}
          />
          <Action
            icon={exportingReport === 'excel' ? <Loader2 size={18} className="animate-spin" /> : <FileSpreadsheet size={18} />}
            label={exportingReport === 'excel' ? t.common.processing : t.more.downloadExcel}
            sub={t.more.downloadExcelSub}
            onClick={handleExcelExport}
            disabled={exportingReport !== null}
          />
          <Action icon={<MessageCircle size={18} />} label={t.more.copySummaryWA} sub={t.more.copySummaryWASub} onClick={handleWhatsAppShare} />
          <label className="block rounded-2xl bg-[var(--surface)] px-4 py-3">
            <span className="block text-xs text-[var(--muted)]">{t.more.waNumberLabel}</span>
            <span className="mt-1 block text-xs text-[var(--muted)]">{t.more.waNumberExample}</span>
            <input
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              placeholder={t.more.waNumberPlaceholder}
              value={waNumber}
              onChange={(e) => {
                setWaNumber(e.target.value);
                localStorage.setItem(WA_NUMBER_KEY, e.target.value);
              }}
              className="mt-2 w-full rounded-xl bg-[var(--card)] px-3 py-2.5 text-sm font-bold outline-none focus:ring-2 focus:ring-[var(--ink)]"
            />
          </label>
          <Action icon={<Upload size={18} />} label={t.more.restoreJSON} sub={t.more.restoreJSONSub} onClick={() => fileInputRef.current?.click()} />
          <input ref={fileInputRef} type="file" accept=".json,.txt,application/json,text/plain" className="hidden" onChange={handleFileChange} />
        </div>
      </Sheet>

      <Sheet open={panel === 'safety'} onClose={close} title={t.more.safetySheetTitle}>
        <ul className="space-y-3 text-sm text-[var(--muted)]">
          <li><b className="text-[var(--ink)]">{t.more.safetyItem1Title}</b> {t.more.safetyItem1Body}</li>
          <li><b className="text-[var(--ink)]">{t.more.safetyItem2Title}</b> {t.more.safetyItem2Body}</li>
          <li><b className="text-[var(--ink)]">{t.more.safetyItem3Title}</b> {t.more.safetyItem3Body}</li>
          <li><b className="text-[var(--ink)]">{t.more.safetyItem4Title}</b> {t.more.safetyItem4Body}</li>
        </ul>
      </Sheet>

      <PwaInstallSheet open={pwaGuideOpen} onClose={() => setPwaGuideOpen(false)} />
      <BackupGuideSheet open={panel === 'backupGuide'} onClose={close} />
      <FullGuideSheet open={panel === 'fullGuide'} onClose={close} />
      <PrivacyPolicySheet open={panel === 'privacy'} onClose={close} />

      <ConfirmDialog
        open={confirmInstallOpen}
        title={t.more.installConfirmTitle}
        description={t.more.installConfirmBody}
        confirmLabel={t.more.installConfirmLabel}
        onConfirm={handleConfirmInstall}
        onCancel={() => setConfirmInstallOpen(false)}
      />

      <ConfirmDialog
        open={!!pendingImport}
        title={t.more.importConfirmTitle}
        description={pendingImport && t.more.importConfirmBody(pendingImport.cycleCount, pendingImport.logCount)}
        confirmLabel={t.more.importConfirmLabel}
        destructive
        onConfirm={confirmImport}
        onCancel={() => setPendingImport(null)}
      />

      <PasswordDialog
        open={!!exportLockOpen}
        mode="set"
        title={t.more.lockExportTitle}
        description={t.more.lockExportBody}
        busy={exportBusy}
        onSubmit={handleExportSubmit}
        onCancel={() => setExportLockOpen(null)}
        onSkip={async () => {
          const share = exportLockOpen === 'share';
          setExportLockOpen(null);
          await exportBackupJSON(undefined, share);
        }}
      />

      <PasswordDialog
        open={!!pendingLockedFile}
        mode="unlock"
        title={t.more.unlockTitle}
        description={t.more.unlockBody}
        error={unlockError}
        busy={unlockBusy}
        onSubmit={handleUnlockSubmit}
        onCancel={() => {
          setPendingLockedFile(null);
          setUnlockError(null);
        }}
      />

      <ConfirmDialog
        open={confirmDeleteOpen}
        title={t.more.deleteConfirmTitle}
        description={t.more.deleteConfirmBody()}
        confirmLabel={t.more.deleteConfirmLabel}
        destructive
        requireText={t.more.deleteConfirmRequireText}
        onConfirm={confirmDelete}
        onCancel={() => setConfirmDeleteOpen(false)}
      />
    </main>
  );
}

function Group({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="mb-2 px-1 text-xs font-semibold text-[var(--muted)]">{title}</h2>
      <div className="card divide-y divide-[var(--surface)] overflow-hidden">{children}</div>
    </section>
  );
}

function Row({
  icon,
  tint,
  label,
  sub,
  onClick,
  href,
  danger,
}: {
  icon: React.ReactNode;
  tint: string;
  label: string;
  sub?: string;
  onClick?: () => void;
  href?: string;
  danger?: boolean;
}) {
  const cls = `flex w-full items-center gap-3 px-4 py-3.5 text-left transition active:bg-[var(--surface)] ${danger ? 'text-red-600 dark:text-red-400' : ''}`;
  const body = (
    <>
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-[#181818]" style={{ background: tint }}>
        {icon}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-sm font-bold">{label}</span>
        {sub && <span className="block truncate text-xs text-[var(--muted)]">{sub}</span>}
      </span>
      <ChevronRight size={18} className="shrink-0 text-[var(--muted)]" />
    </>
  );
  return href ? (
    <a href={href} target="_blank" rel="noopener noreferrer" className={cls}>
      {body}
    </a>
  ) : (
    <button onClick={onClick} className={cls}>
      {body}
    </button>
  );
}

function Action({
  icon,
  label,
  sub,
  onClick,
  disabled,
}: {
  icon: React.ReactNode;
  label: string;
  sub: string;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="flex w-full items-center gap-3 rounded-2xl bg-[var(--surface)] px-4 py-3.5 text-left transition active:scale-[0.99] disabled:opacity-50"
    >
      <span className="shrink-0">{icon}</span>
      <span className="min-w-0 flex-1">
        <span className="block text-sm font-bold">{label}</span>
        <span className="block text-xs text-[var(--muted)]">{sub}</span>
      </span>
    </button>
  );
}

function KV({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex justify-between rounded-2xl bg-[var(--surface)] px-4 py-3">
      <span className="text-[var(--muted)]">{k}</span>
      <span className="font-bold">{v}</span>
    </div>
  );
}
