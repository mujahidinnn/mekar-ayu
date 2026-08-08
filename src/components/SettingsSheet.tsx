import { useEffect, useRef, useState } from "react";
import { format } from "date-fns";
import { id as localeId } from "date-fns/locale";
import {
  AlertTriangle,
  BarChart3,
  BookOpen,
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
  ShieldCheck,
  ShieldOff,
  Smartphone,
  Sun,
  Trash2,
  Upload,
} from "lucide-react";
import { Sheet } from "./ui/Sheet";
import { ConfirmDialog } from "./ui/ConfirmDialog";
import { PasswordDialog } from "./ui/PasswordDialog";
import { PwaInstallSheet } from "./PwaInstallSheet";
import { BackupGuideSheet } from "./BackupGuideSheet";
import { HistorySheet } from "./HistorySheet";
import { FullGuideSheet } from "./FullGuideSheet";
import { PrivacyPolicySheet } from "./PrivacyPolicySheet";
import type { CycleEntry, DailyLog } from "../db/schema";
import type { CycleStats } from "../lib/cycleMath";
import {
  exportBackupJSON,
  importBackupJSON,
  isEncryptedBackup,
  readBackupFile,
} from "../lib/export/json";
import { generateWhatsAppSummary } from "../lib/export/whatsapp";
import { withSync } from "../lib/syncStatus";
import { formatStorageSize } from "../lib/formatStorageSize";
import { deleteAllData } from "../lib/deleteAllData";
import { useInstallPrompt } from "../hooks/useInstallPrompt";
import type { ThemePreference } from "../lib/theme";

interface SettingsSheetProps {
  open: boolean;
  onClose: () => void;
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

const THEME_OPTIONS: {
  key: ThemePreference;
  label: string;
  icon: React.ReactNode;
}[] = [
  { key: "light", label: "Terang", icon: <Sun size={14} /> },
  { key: "dark", label: "Gelap", icon: <Moon size={14} /> },
  { key: "system", label: "Sistem", icon: <Monitor size={14} /> },
];

export function SettingsSheet({
  open,
  onClose,
  onRefreshStorage,
  cycles,
  dailyLogs,
  stats,
  usageKB,
  recordCount,
  isPersisted,
  themePreference,
  onThemeChange,
}: SettingsSheetProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [importMessage, setImportMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [showEducation, setShowEducation] = useState(false);
  const [pwaGuideOpen, setPwaGuideOpen] = useState(false);
  const [backupGuideOpen, setBackupGuideOpen] = useState(false);
  const [fullGuideOpen, setFullGuideOpen] = useState(false);
  const [privacyPolicyOpen, setPrivacyPolicyOpen] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [confirmInstallOpen, setConfirmInstallOpen] = useState(false);
  const [pendingImport, setPendingImport] = useState<{
    text: string;
    cycleCount: number;
    logCount: number;
  } | null>(null);
  const [exportLockOpen, setExportLockOpen] = useState(false);
  const [exportBusy, setExportBusy] = useState(false);
  const [pendingLockedFile, setPendingLockedFile] = useState<string | null>(
    null,
  );
  const [unlockError, setUnlockError] = useState<string | null>(null);
  const [unlockBusy, setUnlockBusy] = useState(false);
  const [exportingReport, setExportingReport] = useState<"pdf" | "excel" | null>(null);
  const { isInstallable, isInstalled, promptInstall } = useInstallPrompt();

  useEffect(() => {
    if (open) onRefreshStorage();
  }, [open, onRefreshStorage]);

  const handleWhatsAppShare = () => {
    const monthName = format(new Date(), "MMMM yyyy", { locale: localeId });
    const url = generateWhatsAppSummary(monthName, cycles, dailyLogs);
    window.open(url, "_blank");
  };

  const handleImportClick = () => fileInputRef.current?.click();

  const handlePdfExport = async () => {
    if (exportingReport) return;
    setExportingReport("pdf");
    try {
      const { generateMedicalReportPDF } = await import("../lib/export/pdf");
      generateMedicalReportPDF(cycles, dailyLogs, stats);
    } catch (err) {
      console.error("Gagal membuat laporan PDF", err);
      setImportMessage({
        type: "error",
        text: "Gagal membuat laporan PDF. Coba lagi.",
      });
      setTimeout(() => setImportMessage(null), 4000);
    } finally {
      setExportingReport(null);
    }
  };

  const handleExcelExport = async () => {
    if (exportingReport) return;
    setExportingReport("excel");
    try {
      const { exportExcelReport } = await import("../lib/export/excel");
      exportExcelReport(cycles, dailyLogs);
    } catch (err) {
      console.error("Gagal membuat laporan Excel", err);
      setImportMessage({
        type: "error",
        text: "Gagal membuat laporan Excel. Coba lagi.",
      });
      setTimeout(() => setImportMessage(null), 4000);
    } finally {
      setExportingReport(null);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    try {
      const text = await file.text();
      const data = JSON.parse(text);
      if (isEncryptedBackup(data)) {
        setUnlockError(null);
        setPendingLockedFile(text);
        return;
      }
      if (!Array.isArray(data.cycles) || !Array.isArray(data.dailyLogs)) {
        throw new Error("invalid");
      }
      setPendingImport({
        text,
        cycleCount: data.cycles.length,
        logCount: data.dailyLogs.length,
      });
    } catch {
      setImportMessage({
        type: "error",
        text: "Gagal membaca file. Pastikan file backup JSON valid.",
      });
      setTimeout(() => setImportMessage(null), 4000);
    }
  };

  const handleUnlockSubmit = async (password: string) => {
    if (!pendingLockedFile) return;
    setUnlockBusy(true);
    try {
      const plainText = await readBackupFile(pendingLockedFile, password);
      const data = JSON.parse(plainText);
      setPendingImport({
        text: plainText,
        cycleCount: data.cycles.length,
        logCount: data.dailyLogs.length,
      });
      setPendingLockedFile(null);
      setUnlockError(null);
    } catch (err) {
      setUnlockError(
        err instanceof Error && err.message === "WRONG_PASSWORD"
          ? "Kata sandi salah. Coba lagi."
          : "File terkunci ini tidak valid.",
      );
    } finally {
      setUnlockBusy(false);
    }
  };

  const handleUnlockCancel = () => {
    setPendingLockedFile(null);
    setUnlockError(null);
  };

  const handleExportSubmit = async (password: string) => {
    setExportBusy(true);
    try {
      await exportBackupJSON(password);
      setExportLockOpen(false);
    } catch {
      setImportMessage({
        type: "error",
        text: "Gagal mengunci file. Coba lagi.",
      });
      setTimeout(() => setImportMessage(null), 4000);
    } finally {
      setExportBusy(false);
    }
  };

  const handleExportSkip = async () => {
    setExportLockOpen(false);
    await exportBackupJSON();
  };

  const confirmImport = async () => {
    if (!pendingImport) return;
    try {
      await withSync(() => importBackupJSON(pendingImport.text));
      onRefreshStorage();
      setImportMessage({
        type: "success",
        text: "Data berhasil dipulihkan dari file backup.",
      });
    } catch {
      setImportMessage({
        type: "error",
        text: "Gagal memulihkan data. Pastikan file backup valid.",
      });
    } finally {
      setPendingImport(null);
      setTimeout(() => setImportMessage(null), 4000);
    }
  };

  const confirmDelete = async () => {
    await withSync(() => deleteAllData());
    onRefreshStorage();
    setConfirmDeleteOpen(false);
    setImportMessage({ type: "success", text: "Semua data berhasil dihapus." });
    setTimeout(() => setImportMessage(null), 4000);
  };

  const handleConfirmInstall = async () => {
    setConfirmInstallOpen(false);
    if (!isInstallable) {
      // Browser doesn't support the native install prompt (e.g. iOS Safari), so fall back
      // to the manual step-by-step guide instead of pretending a button did something.
      setPwaGuideOpen(true);
      return;
    }
    const outcome = await promptInstall();
    if (outcome === "accepted") {
      setImportMessage({
        type: "success",
        text: "Mekar Ayu sedang dipasang ke perangkatmu.",
      });
      setTimeout(() => setImportMessage(null), 4000);
    }
  };

  return (
    <>
      <Sheet open={open} onClose={onClose} title="Pengaturan & Backup">
        <div className="space-y-6 pb-4">
          <section>
            <h3 className="mb-2 flex items-center gap-2 text-sm font-semibold text-rose-950 dark:text-rose-50">
              <Database size={16} /> Status Penyimpanan Lokal
            </h3>
            <div className="rounded-2xl border border-rose-100 bg-rose-50/60 p-4 text-sm text-rose-900/80 dark:border-stone-800 dark:bg-stone-900 dark:text-stone-300">
              <div className="flex justify-between py-0.5">
                <span>Total data tersimpan</span>
                <span className="font-medium text-rose-950 dark:text-rose-50">
                  {recordCount} entri
                </span>
              </div>
              <div className="flex justify-between py-0.5">
                <span>Ukuran data siklus & catatan</span>
                <span className="font-medium text-rose-950 dark:text-rose-50">
                  {formatStorageSize(usageKB)}
                </span>
              </div>
              <div
                className={`mt-3 flex items-center gap-2 rounded-xl bg-white p-3 dark:bg-stone-800 ${isPersisted ? "text-emerald-600 dark:text-emerald-400" : "text-rose-900/50 dark:text-stone-500"}`}
              >
                {isPersisted ? (
                  <ShieldCheck size={18} />
                ) : (
                  <ShieldOff size={18} />
                )}
                <span className="text-xs font-medium">
                  {isPersisted
                    ? "Data terlindungi dari penghapusan otomatis"
                    : "Menunggu izin penyimpanan dari browser"}
                </span>
              </div>
            </div>
          </section>

          <section>
            <h3 className="mb-2 text-sm font-semibold text-rose-950 dark:text-rose-50">
              Tampilan
            </h3>
            <div className="flex rounded-full bg-rose-50 p-1 dark:bg-stone-800">
              {THEME_OPTIONS.map((opt) => (
                <button
                  key={opt.key}
                  onClick={() => onThemeChange(opt.key)}
                  className={`flex flex-1 items-center justify-center gap-1.5 rounded-full py-2 text-xs font-semibold transition ${
                    themePreference === opt.key
                      ? "bg-white text-rose-950 shadow-sm dark:bg-stone-700 dark:text-rose-50"
                      : "text-rose-900/60 dark:text-stone-400"
                  }`}
                >
                  {opt.icon} {opt.label}
                </button>
              ))}
            </div>
          </section>

          {!isInstalled && (
            <section>
              <button
                onClick={() => setConfirmInstallOpen(true)}
                className="flex min-h-11 w-full items-center justify-center gap-2 rounded-2xl bg-rose-500 px-4 py-2.5 text-sm font-semibold text-white active:scale-95 hover:bg-rose-600 transition dark:bg-rose-600 dark:hover:bg-rose-500"
              >
                <Smartphone size={16} /> Install
              </button>
            </section>
          )}

          <section>
            <button
              onClick={() => setHistoryOpen(true)}
              className="flex min-h-11 w-full items-center justify-center gap-2 rounded-2xl bg-rose-500 px-4 py-2.5 text-sm font-semibold text-white active:scale-95 hover:bg-rose-600 transition dark:bg-rose-600 dark:hover:bg-rose-500"
            >
              <BarChart3 size={16} /> Riwayat & Tren Siklus
            </button>
          </section>

          <section>
            <h3 className="mb-2 text-sm font-semibold text-rose-950 dark:text-rose-50">
              Backup & Ekspor
            </h3>
            <div className="grid grid-cols-2 gap-2">
              <ActionButton
                icon={<Download size={16} />}
                label="Backup JSON"
                onClick={() => setExportLockOpen(true)}
              />
              <ActionButton
                icon={<Upload size={16} />}
                label="Pulihkan JSON"
                onClick={handleImportClick}
              />
              <ActionButton
                icon={
                  exportingReport === "pdf" ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <FileText size={16} />
                  )
                }
                label={
                  exportingReport === "pdf" ? "Memproses..." : "Unduh PDF"
                }
                onClick={handlePdfExport}
                disabled={exportingReport !== null}
              />
              <ActionButton
                icon={
                  exportingReport === "excel" ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <FileSpreadsheet size={16} />
                  )
                }
                label={
                  exportingReport === "excel" ? "Memproses..." : "Unduh Excel"
                }
                onClick={handleExcelExport}
                disabled={exportingReport !== null}
              />
            </div>
            <button
              onClick={handleWhatsAppShare}
              className="mt-2 flex min-h-11 w-full items-center justify-center gap-2 rounded-2xl bg-emerald-500 px-4 py-2.5 text-sm font-semibold text-white active:scale-95 transition dark:bg-emerald-600"
            >
              <MessageCircle size={16} /> Salin Ringkasan ke WhatsApp
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="application/json"
              className="hidden"
              onChange={handleFileChange}
            />
            {importMessage && (
              <p
                className={`mt-2 text-center text-xs ${importMessage.type === "success" ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"}`}
              >
                {importMessage.text}
              </p>
            )}
          </section>

          <section>
            <h3 className="mb-2 text-sm font-semibold text-rose-950 dark:text-rose-50">
              Panduan
            </h3>
            <div className="grid grid-cols-1 gap-2">
              <ActionButton
                icon={<BookOpen size={16} />}
                label="Panduan Lengkap Menstruasi"
                onClick={() => setFullGuideOpen(true)}
                fullWidth
              />
              <ActionButton
                icon={<HelpCircle size={16} />}
                label="Panduan Backup & Restore"
                onClick={() => setBackupGuideOpen(true)}
                fullWidth
              />
              <ActionButton
                icon={<Lock size={16} />}
                label="Kebijakan Privasi"
                onClick={() => setPrivacyPolicyOpen(true)}
                fullWidth
              />
            </div>
          </section>

          <section>
            <button
              onClick={() => setShowEducation((v) => !v)}
              className="flex w-full items-center gap-2 rounded-2xl border border-amber-200 bg-amber-50 p-3 text-left dark:border-amber-800 dark:bg-amber-950/40"
            >
              <AlertTriangle
                size={16}
                className="shrink-0 text-amber-600 dark:text-amber-400"
              />
              <span className="text-sm font-semibold text-amber-900 dark:text-amber-200">
                Edukasi Penting: Keamanan Data
              </span>
            </button>
            {showEducation && (
              <ul className="mt-2 space-y-2 text-xs text-rose-900/80 dark:text-stone-300">
                <li>
                  <span className="font-semibold text-rose-950 dark:text-rose-50">
                    Hapus Cache / Site Data:
                  </span>{" "}
                  Menekan tombol "Clear Browsing Data" atau "Hapus Cache
                  Website" di menu pengaturan Chrome/Safari akan menghapus
                  seluruh riwayat menstruasi Anda.
                </li>
                <li>
                  <span className="font-semibold text-rose-950 dark:text-rose-50">
                    Amankan Data Berkala:
                  </span>{" "}
                  Gunakan fitur Salin ke Catatan WhatsApp atau Backup File JSON
                  minimal satu bulan sekali.
                </li>
                <li>
                  <span className="font-semibold text-rose-950 dark:text-rose-50">
                    Ganti HP:
                  </span>{" "}
                  Sebelum berganti perangkat, unduh file .json melalui Backup,
                  lalu Import file tersebut di HP baru Anda.
                </li>
                <li>
                  <span className="font-semibold text-rose-950 dark:text-rose-50">
                    Kunci Memori (Storage Persistence):
                  </span>{" "}
                  Mekar Ayu otomatis meminta browser melindungi datamu dari
                  penghapusan saat memori HP penuh, jadi tidak perlu tindakan
                  apa pun darimu.
                </li>
              </ul>
            )}
          </section>

          <section>
            <h3 className="mb-2 text-sm font-semibold text-rose-950 dark:text-rose-50">
              Kelola Data
            </h3>
            <button
              onClick={() => setConfirmDeleteOpen(true)}
              className="flex min-h-11 w-full items-center justify-center gap-2 rounded-2xl border border-red-200 bg-red-50 px-4 py-2.5 text-sm font-semibold text-red-700 active:scale-95 hover:bg-red-100 transition dark:border-red-900 dark:bg-red-950/40 dark:text-red-400 dark:hover:bg-red-950/60"
            >
              <Trash2 size={16} /> Hapus Semua Data
            </button>
          </section>

          <section>
            <h3 className="mb-2 text-sm font-semibold text-rose-950 dark:text-rose-50">
              Dukung Pengembang
            </h3>
            <a
              href="https://trakteer.id/mujahidinnn/tip"
              target="_blank"
              rel="noopener noreferrer"
              className="flex min-h-11 w-full items-center justify-center gap-2 rounded-2xl bg-amber-500 px-4 py-2.5 text-sm font-semibold text-white active:scale-95 hover:bg-amber-600 transition dark:bg-amber-600 dark:hover:bg-amber-500"
            >
              <Coffee size={16} /> Trakteer Developer
            </a>
          </section>

          <p className="text-center text-[11px] leading-relaxed text-rose-900/50 dark:text-stone-500">
            Mekar Ayu adalah aplikasi 100% local-first. Tidak ada server, tidak
            ada akun, tidak ada pelacakan. Seluruh data hanya tersimpan di
            perangkat ini.
          </p>
        </div>
      </Sheet>

      <PwaInstallSheet
        open={pwaGuideOpen}
        onClose={() => setPwaGuideOpen(false)}
      />
      <BackupGuideSheet
        open={backupGuideOpen}
        onClose={() => setBackupGuideOpen(false)}
      />
      <FullGuideSheet
        open={fullGuideOpen}
        onClose={() => setFullGuideOpen(false)}
      />
      <PrivacyPolicySheet
        open={privacyPolicyOpen}
        onClose={() => setPrivacyPolicyOpen(false)}
      />
      <HistorySheet
        open={historyOpen}
        onClose={() => setHistoryOpen(false)}
        cycles={cycles}
        dailyLogs={dailyLogs}
        stats={stats}
      />

      <ConfirmDialog
        open={confirmInstallOpen}
        title="Install Mekar Ayu?"
        description={
          <>
            Mekar Ayu akan terpasang di layar utama HP-mu seperti aplikasi biasa,
            jadi lebih cepat dibuka dan bisa dipakai walau offline. Semua datamu
            tetap 100% tersimpan lokal di perangkat ini, tidak ada yang berubah
            soal privasi.
          </>
        }
        confirmLabel="Install"
        onConfirm={handleConfirmInstall}
        onCancel={() => setConfirmInstallOpen(false)}
      />

      <ConfirmDialog
        open={!!pendingImport}
        title="Ganti dengan data backup?"
        description={
          pendingImport && (
            <>
              File ini berisi{" "}
              <span className="font-semibold text-rose-950 dark:text-rose-50">
                {pendingImport.cycleCount} siklus
              </span>{" "}
              dan{" "}
              <span className="font-semibold text-rose-950 dark:text-rose-50">
                {pendingImport.logCount} catatan harian
              </span>
              . Melanjutkan akan{" "}
              <span className="font-semibold text-red-600 dark:text-red-400">
                menghapus dan mengganti seluruh data saat ini
              </span>{" "}
              dengan isi file ini. Tindakan ini tidak bisa dibatalkan.
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
        description="Tambahkan kata sandi supaya isi file ini tidak bisa dibaca orang lain kalau tersimpan di Drive, email, atau HP yang hilang. Simpan baik-baik karena tanpa kata sandi ini, file tidak bisa dipulihkan."
        busy={exportBusy}
        onSubmit={handleExportSubmit}
        onCancel={() => setExportLockOpen(false)}
        onSkip={handleExportSkip}
      />

      <PasswordDialog
        open={!!pendingLockedFile}
        mode="unlock"
        title="File ini terkunci"
        description="Masukkan kata sandi yang dipakai saat file backup ini dibuat."
        error={unlockError}
        busy={unlockBusy}
        onSubmit={handleUnlockSubmit}
        onCancel={handleUnlockCancel}
      />

      <ConfirmDialog
        open={confirmDeleteOpen}
        title="Hapus semua data?"
        description={
          <>
            Seluruh riwayat siklus, gejala, dan catatan harian di perangkat ini
            akan{" "}
            <span className="font-semibold text-red-600 dark:text-red-400">
              dihapus permanen dan tidak bisa dikembalikan
            </span>
            . Pastikan kamu sudah membackup data yang ingin disimpan sebelum
            melanjutkan.
          </>
        }
        confirmLabel="Ya, Hapus Semua"
        destructive
        onConfirm={confirmDelete}
        onCancel={() => setConfirmDeleteOpen(false)}
      />
    </>
  );
}

function ActionButton({
  icon,
  label,
  onClick,
  fullWidth,
  disabled,
}: {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  fullWidth?: boolean;
  disabled?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`flex min-h-11 items-center justify-center gap-2 rounded-2xl border border-rose-200 bg-white px-3 py-2.5 text-xs font-semibold text-rose-900 active:scale-95 hover:bg-rose-50 transition dark:border-stone-700 dark:bg-stone-800 dark:text-rose-100 dark:hover:bg-stone-700 disabled:opacity-50 disabled:active:scale-100 ${
        fullWidth ? "w-full" : ""
      }`}
    >
      {icon} {label}
    </button>
  );
}
