import { useEffect, useRef, useState } from 'react';
import { format } from 'date-fns';
import { id as localeId } from 'date-fns/locale';
import {
  BookOpen,
  ChevronRight,
  Coffee,
  Database,
  Download,
  FileSpreadsheet,
  FileText,
  HelpCircle,
  Loader2,
  Lock,
  MessageCircle,
  Monitor,
  Moon,
  Palette,
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

type Panel = 'storage' | 'theme' | 'backup' | 'safety' | 'fullGuide' | 'backupGuide' | 'privacy' | null;

const THEME_OPTIONS: { key: ThemePreference; label: string; icon: React.ReactNode }[] = [
  { key: 'light', label: 'Terang', icon: <Sun size={16} /> },
  { key: 'dark', label: 'Gelap', icon: <Moon size={16} /> },
  { key: 'system', label: 'Ikuti sistem', icon: <Monitor size={16} /> },
];

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
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [panel, setPanel] = useState<Panel>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [pwaGuideOpen, setPwaGuideOpen] = useState(false);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [confirmInstallOpen, setConfirmInstallOpen] = useState(false);
  const [pendingImport, setPendingImport] = useState<{ text: string; cycleCount: number; logCount: number } | null>(null);
  const [exportLockOpen, setExportLockOpen] = useState(false);
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
    const monthName = format(new Date(), 'MMMM yyyy', { locale: localeId });
    window.open(generateWhatsAppSummary(monthName, cycles, dailyLogs), '_blank');
  };

  const handlePdfExport = async () => {
    if (exportingReport) return;
    setExportingReport('pdf');
    try {
      const { generateMedicalReportPDF } = await import('../../lib/export/pdf');
      generateMedicalReportPDF(cycles, dailyLogs, stats);
    } catch (err) {
      console.error('Gagal membuat laporan PDF', err);
      flash('error', 'Laporan PDF-nya belum berhasil dibuat. Coba lagi, ya.');
    } finally {
      setExportingReport(null);
    }
  };

  const handleExcelExport = async () => {
    if (exportingReport) return;
    setExportingReport('excel');
    try {
      const { exportExcelReport } = await import('../../lib/export/excel');
      exportExcelReport(cycles, dailyLogs);
    } catch (err) {
      console.error('Gagal membuat laporan Excel', err);
      flash('error', 'Laporan Excel-nya belum berhasil dibuat. Coba lagi, ya.');
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
      flash('error', 'File-nya belum bisa dibaca. Pastikan itu file backup JSON dari Mekar Ayu, ya.');
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
        err instanceof Error && err.message === 'WRONG_PASSWORD' ? 'Kata sandinya belum cocok. Coba lagi, ya.' : 'File terkunci ini kayaknya rusak atau nggak valid.',
      );
    } finally {
      setUnlockBusy(false);
    }
  };

  const handleExportSubmit = async (password: string) => {
    setExportBusy(true);
    try {
      await exportBackupJSON(password);
      setExportLockOpen(false);
    } catch {
      flash('error', 'File-nya belum berhasil dikunci. Coba lagi, ya.');
    } finally {
      setExportBusy(false);
    }
  };

  const confirmImport = async () => {
    if (!pendingImport) return;
    try {
      await withSync(() => importBackupJSON(pendingImport.text));
      onRefreshStorage();
      flash('success', 'Datamu udah balik dari file backup.');
    } catch {
      flash('error', 'Data belum berhasil dipulihkan. Pastikan file backup-nya valid, ya.');
    } finally {
      setPendingImport(null);
    }
  };

  const confirmDelete = async () => {
    await withSync(() => deleteAllData());
    onRefreshStorage();
    setConfirmDeleteOpen(false);
    flash('success', 'Semua data udah dihapus.');
  };

  const handleConfirmInstall = async () => {
    setConfirmInstallOpen(false);
    if (!isInstallable) {
      setPwaGuideOpen(true);
      return;
    }
    if ((await promptInstall()) === 'accepted') flash('success', 'Mekar Ayu sedang dipasang ke perangkatmu.');
  };

  const close = () => setPanel(null);
  const themeLabel = THEME_OPTIONS.find((o) => o.key === themePreference)?.label;

  return (
    <main className="flex-1 space-y-6 px-5 pb-32 pt-[max(env(safe-area-inset-top),1.25rem)]">
      <div className="text-center">
        <h1 className="text-base font-extrabold">Lainnya</h1>
        <p className="text-xs font-medium text-[var(--muted)]">Pengaturan, backup, dan panduan</p>
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

      <Group title="Aplikasi">
        <Row icon={<Palette size={18} />} tint="#D5C3FF" label="Tampilan" sub={themeLabel} onClick={() => setPanel('theme')} />
        {!isInstalled && (
          <Row icon={<Smartphone size={18} />} tint="#FFB0C4" label="Pasang di layar utama" sub="Buka lebih cepat, bisa offline" onClick={() => setConfirmInstallOpen(true)} />
        )}
      </Group>

      <Group title="Panduan">
        <Row icon={<BookOpen size={18} />} tint="#FFB0C4" label="Panduan lengkap menstruasi" sub="Fase siklus, angka normal, kapan ke dokter" onClick={() => setPanel('fullGuide')} />
        <Row icon={<HelpCircle size={18} />} tint="#B5D5FF" label="Panduan backup & restore" sub="Cara simpan dan pindahin datamu" onClick={() => setPanel('backupGuide')} />
      </Group>

      <Group title="Data">
        <Row icon={<Download size={18} />} tint="#FFE3A3" label="Backup & ekspor" sub="JSON, PDF, Excel, WhatsApp" onClick={() => setPanel('backup')} />
        <Row icon={<Database size={18} />} tint="#B5D5FF" label="Penyimpanan lokal" sub={`${recordCount} entri · ${formatStorageSize(usageKB)}`} onClick={() => setPanel('storage')} />
        <Row icon={<ShieldAlert size={18} />} tint="#FF8A80" label="Keamanan data" sub="Biar datamu tetap aman" onClick={() => setPanel('safety')} />
      </Group>

      <Group title="Tentang">
        <Row icon={<Lock size={18} />} tint="#D5C3FF" label="Kebijakan privasi" sub="Datamu cuma ada di HP kamu" onClick={() => setPanel('privacy')} />
        <Row icon={<Coffee size={18} />} tint="#FFE3A3" label="Dukung pengembang" sub="Trakteer" href="https://trakteer.id/mujahidinnn/tip" />
      </Group>

      <Group title="Zona bahaya">
        <Row icon={<Trash2 size={18} />} tint="#FFB4B4" label="Hapus semua data" sub="Permanen, nggak bisa dibalikin" danger onClick={() => setConfirmDeleteOpen(true)} />
      </Group>

      <p className="text-center text-[11px] leading-relaxed text-[var(--muted)]">
        Datamu cuma punya kamu. Mekar Ayu 100% local-first: tanpa server, tanpa akun, tanpa pelacakan. Semuanya tersimpan di perangkat ini aja.
      </p>

      <Sheet open={panel === 'storage'} onClose={close} title="Penyimpanan lokal">
        <div className="space-y-3 text-sm">
          <KV k="Total data tersimpan" v={`${recordCount} entri`} />
          <KV k="Ukuran data siklus & catatan" v={formatStorageSize(usageKB)} />
          <div className={`flex items-center gap-2 rounded-2xl p-4 text-xs font-semibold text-[#181818] ${isPersisted ? 'bg-[#C9F2D9]' : 'bg-[#FFE3A3]'}`}>
            {isPersisted ? <ShieldCheck size={18} /> : <ShieldOff size={18} />}
            {isPersisted ? 'Datamu terlindungi dari penghapusan otomatis' : 'Menunggu izin penyimpanan dari browser'}
          </div>
        </div>
      </Sheet>

      <Sheet open={panel === 'theme'} onClose={close} title="Tampilan">
        <div className="space-y-2">
          {THEME_OPTIONS.map((opt) => {
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

      <Sheet open={panel === 'backup'} onClose={close} title="Backup & ekspor">
        <div className="space-y-2">
          <Action icon={<Download size={18} />} label="Backup JSON" sub="Simpan seluruh data, bisa dikunci kata sandi" onClick={() => setExportLockOpen(true)} />
          <Action
            icon={exportingReport === 'pdf' ? <Loader2 size={18} className="animate-spin" /> : <FileText size={18} />}
            label={exportingReport === 'pdf' ? 'Memproses…' : 'Unduh laporan PDF'}
            sub="Ringkasan untuk dibawa ke dokter"
            onClick={handlePdfExport}
            disabled={exportingReport !== null}
          />
          <Action
            icon={exportingReport === 'excel' ? <Loader2 size={18} className="animate-spin" /> : <FileSpreadsheet size={18} />}
            label={exportingReport === 'excel' ? 'Memproses…' : 'Unduh Excel'}
            sub="Tabel siklus dan catatan harian"
            onClick={handleExcelExport}
            disabled={exportingReport !== null}
          />
          <Action icon={<MessageCircle size={18} />} label="Salin ringkasan ke WhatsApp" sub="Kirim ke catatan pribadimu" onClick={handleWhatsAppShare} />
          <Action icon={<Upload size={18} />} label="Pulihkan JSON" sub="Ganti data saat ini dengan file backup" onClick={() => fileInputRef.current?.click()} />
          <input ref={fileInputRef} type="file" accept="application/json" className="hidden" onChange={handleFileChange} />
        </div>
      </Sheet>

      <Sheet open={panel === 'safety'} onClose={close} title="Keamanan data">
        <ul className="space-y-3 text-sm text-[var(--muted)]">
          <li><b className="text-[var(--ink)]">Hapus cache / site data.</b> Menekan "Clear Browsing Data" atau "Hapus Cache Website" di pengaturan Chrome/Safari bakal ikut menghapus semua riwayat siklusmu, jadi hati-hati, ya.</li>
          <li><b className="text-[var(--ink)]">Amankan data berkala.</b> Biasakan Backup JSON atau salin ringkasan ke WhatsApp minimal sebulan sekali.</li>
          <li><b className="text-[var(--ink)]">Ganti HP.</b> Sebelum pindah perangkat, unduh file .json lewat Backup, lalu pulihkan di HP barumu.</li>
          <li><b className="text-[var(--ink)]">Kunci memori.</b> Mekar Ayu otomatis meminta browser menjaga datamu saat memori HP penuh. Kamu nggak perlu ngapa-ngapain.</li>
        </ul>
      </Sheet>

      <PwaInstallSheet open={pwaGuideOpen} onClose={() => setPwaGuideOpen(false)} />
      <BackupGuideSheet open={panel === 'backupGuide'} onClose={close} />
      <FullGuideSheet open={panel === 'fullGuide'} onClose={close} />
      <PrivacyPolicySheet open={panel === 'privacy'} onClose={close} />

      <ConfirmDialog
        open={confirmInstallOpen}
        title="Pasang Mekar Ayu?"
        description="Mekar Ayu bakal muncul di layar utama HP-mu kayak aplikasi biasa, jadi lebih cepat dibuka dan tetap bisa dipakai pas offline. Semua datamu tetap 100% tersimpan di perangkat ini."
        confirmLabel="Pasang"
        onConfirm={handleConfirmInstall}
        onCancel={() => setConfirmInstallOpen(false)}
      />

      <ConfirmDialog
        open={!!pendingImport}
        title="Ganti dengan data backup?"
        description={
          pendingImport && (
            <>
              File ini berisi <b>{pendingImport.cycleCount} siklus</b> dan <b>{pendingImport.logCount} catatan harian</b>. Melanjutkan akan{' '}
              <b className="text-red-600 dark:text-red-400">menghapus dan mengganti seluruh data saat ini</b> dengan isi file ini. Tindakan ini tidak bisa dibatalkan.
            </>
          )
        }
        confirmLabel="Ya, Ganti Data"
        destructive
        onConfirm={confirmImport}
        onCancel={() => setPendingImport(null)}
      />

      <PasswordDialog
        open={exportLockOpen}
        mode="set"
        title="Kunci file backup?"
        description="Tambahkan kata sandi supaya isi file ini tidak bisa dibaca orang lain kalau tersimpan di Drive, email, atau HP yang hilang. Simpan baik-baik, ya, karena tanpa kata sandi ini file tidak bisa dipulihkan."
        busy={exportBusy}
        onSubmit={handleExportSubmit}
        onCancel={() => setExportLockOpen(false)}
        onSkip={async () => {
          setExportLockOpen(false);
          await exportBackupJSON();
        }}
      />

      <PasswordDialog
        open={!!pendingLockedFile}
        mode="unlock"
        title="File ini terkunci"
        description="Masukkan kata sandi yang dipakai saat file backup ini dibuat."
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
        title="Hapus semua data?"
        description={
          <>
            Seluruh riwayat siklus, gejala, dan catatan harian di perangkat ini akan{' '}
            <b className="text-red-600 dark:text-red-400">dihapus permanen dan tidak bisa dikembalikan</b>. Pastikan kamu sudah membackup data yang ingin disimpan.
          </>
        }
        confirmLabel="Ya, Hapus Semua"
        destructive
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
