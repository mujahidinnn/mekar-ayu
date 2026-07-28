import { useEffect, useRef, useState } from 'react';
import { format } from 'date-fns';
import { id as localeId } from 'date-fns/locale';
import { AlertTriangle, Database, Download, FileSpreadsheet, FileText, MessageCircle, ShieldCheck, ShieldOff, Upload } from 'lucide-react';
import { Sheet } from './ui/Sheet';
import type { CycleEntry, DailyLog } from '../db/schema';
import type { CycleStats } from '../lib/cycleMath';
import { exportBackupJSON, importBackupJSON } from '../lib/export/json';
import { generateWhatsAppSummary } from '../lib/export/whatsapp';
import { withSync } from '../lib/syncStatus';
import { formatStorageSize } from '../lib/formatStorageSize';

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
}

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
}: SettingsSheetProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [importMessage, setImportMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    if (open) onRefreshStorage();
  }, [open, onRefreshStorage]);
  const [showEducation, setShowEducation] = useState(false);

  const handleWhatsAppShare = () => {
    const monthName = format(new Date(), 'MMMM yyyy', { locale: localeId });
    const url = generateWhatsAppSummary(monthName, cycles, dailyLogs);
    window.open(url, '_blank');
  };

  const handleImportClick = () => fileInputRef.current?.click();

  const handlePdfExport = async () => {
    const { generateMedicalReportPDF } = await import('../lib/export/pdf');
    generateMedicalReportPDF(cycles, dailyLogs, stats);
  };

  const handleExcelExport = async () => {
    const { exportExcelReport } = await import('../lib/export/excel');
    exportExcelReport(cycles, dailyLogs);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const text = await file.text();
      await withSync(() => importBackupJSON(text));
      onRefreshStorage();
      setImportMessage({ type: 'success', text: 'Data berhasil dipulihkan dari file backup.' });
    } catch {
      setImportMessage({ type: 'error', text: 'Gagal memulihkan data. Pastikan file backup valid.' });
    } finally {
      e.target.value = '';
      setTimeout(() => setImportMessage(null), 4000);
    }
  };

  return (
    <Sheet open={open} onClose={onClose} title="Pengaturan & Backup">
      <div className="space-y-6 pb-4">
        <section>
          <h3 className="mb-2 flex items-center gap-2 text-sm font-semibold text-rose-950">
            <Database size={16} /> Status Penyimpanan Lokal
          </h3>
          <div className="rounded-2xl border border-rose-100 bg-rose-50/60 p-4 text-sm text-rose-900/80">
            <div className="flex justify-between py-0.5">
              <span>Total data tersimpan</span>
              <span className="font-medium text-rose-950">{recordCount} entri</span>
            </div>
            <div className="flex justify-between py-0.5">
              <span>Ukuran penyimpanan browser</span>
              <span className="font-medium text-rose-950">{formatStorageSize(usageKB)}</span>
            </div>
            <div className={`mt-3 flex items-center gap-2 rounded-xl bg-white p-3 ${isPersisted ? 'text-emerald-600' : 'text-rose-900/50'}`}>
              {isPersisted ? <ShieldCheck size={18} /> : <ShieldOff size={18} />}
              <span className="text-xs font-medium">
                {isPersisted ? 'Data terlindungi dari penghapusan otomatis' : 'Menunggu izin penyimpanan dari browser'}
              </span>
            </div>
          </div>
        </section>

        <section>
          <h3 className="mb-2 text-sm font-semibold text-rose-950">Backup & Ekspor</h3>
          <div className="grid grid-cols-2 gap-2">
            <ActionButton icon={<Download size={16} />} label="Backup JSON" onClick={exportBackupJSON} />
            <ActionButton icon={<Upload size={16} />} label="Pulihkan JSON" onClick={handleImportClick} />
            <ActionButton icon={<FileText size={16} />} label="Laporan PDF" onClick={handlePdfExport} />
            <ActionButton icon={<FileSpreadsheet size={16} />} label="Ekspor Excel" onClick={handleExcelExport} />
          </div>
          <button
            onClick={handleWhatsAppShare}
            className="mt-2 flex min-h-11 w-full items-center justify-center gap-2 rounded-2xl bg-emerald-500 px-4 py-2.5 text-sm font-semibold text-white active:scale-95 transition"
          >
            <MessageCircle size={16} /> Salin Ringkasan ke WhatsApp
          </button>
          <input ref={fileInputRef} type="file" accept="application/json" className="hidden" onChange={handleFileChange} />
          {importMessage && (
            <p className={`mt-2 text-center text-xs ${importMessage.type === 'success' ? 'text-emerald-600' : 'text-red-600'}`}>
              {importMessage.text}
            </p>
          )}
        </section>

        <section>
          <button
            onClick={() => setShowEducation((v) => !v)}
            className="flex w-full items-center gap-2 rounded-2xl border border-amber-200 bg-amber-50 p-3 text-left"
          >
            <AlertTriangle size={16} className="shrink-0 text-amber-600" />
            <span className="text-sm font-semibold text-amber-900">Edukasi Penting: Keamanan Data</span>
          </button>
          {showEducation && (
            <ul className="mt-2 space-y-2 text-xs text-rose-900/80">
              <li>
                <span className="font-semibold text-rose-950">Hapus Cache / Site Data:</span> Menekan tombol "Clear Browsing Data" atau "Hapus
                Cache Website" di menu pengaturan Chrome/Safari akan menghapus seluruh riwayat menstruasi Anda.
              </li>
              <li>
                <span className="font-semibold text-rose-950">Amankan Data Berkala:</span> Gunakan fitur Salin ke Catatan WhatsApp atau Backup File
                JSON minimal satu bulan sekali.
              </li>
              <li>
                <span className="font-semibold text-rose-950">Ganti HP:</span> Sebelum berganti perangkat, unduh file .json melalui Backup, lalu
                Import file tersebut di HP baru Anda.
              </li>
              <li>
                <span className="font-semibold text-rose-950">Kunci Memori (Storage Persistence):</span> M-Project otomatis meminta browser
                melindungi datamu dari penghapusan saat memori HP penuh — tidak perlu tindakan apa pun darimu.
              </li>
            </ul>
          )}
        </section>

        <p className="text-center text-[11px] leading-relaxed text-rose-900/50">
          M-Project adalah aplikasi 100% local-first. Tidak ada server, tidak ada akun, tidak ada pelacakan. Seluruh data hanya tersimpan di
          perangkat ini.
        </p>
      </div>
    </Sheet>
  );
}

function ActionButton({ icon, label, onClick }: { icon: React.ReactNode; label: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex min-h-11 items-center justify-center gap-2 rounded-2xl border border-rose-200 bg-white px-3 py-2.5 text-xs font-semibold text-rose-900 active:scale-95 hover:bg-rose-50 transition"
    >
      {icon} {label}
    </button>
  );
}
