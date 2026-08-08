import { Sheet } from './ui/Sheet';
import { Download, Upload, ShieldAlert, FolderLock } from 'lucide-react';

interface BackupGuideSheetProps {
  open: boolean;
  onClose: () => void;
}

export function BackupGuideSheet({ open, onClose }: BackupGuideSheetProps) {
  return (
    <Sheet open={open} onClose={onClose} title="Panduan Backup & Restore">
      <div className="space-y-5 pb-4">
        <p className="text-sm text-rose-900/70 dark:text-stone-300">
          Karena Mekar Ayu tidak punya server, file <span className="font-semibold text-rose-950 dark:text-rose-50">JSON backup</span> adalah
          satu-satunya cara untuk memindahkan datamu ke HP lain atau menyelamatkannya dari kehilangan data.
        </p>

        <section>
          <div className="mb-2 flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-rose-100 text-rose-600 dark:bg-rose-900/40 dark:text-rose-400">
              <Download size={18} />
            </span>
            <h3 className="text-sm font-semibold text-rose-950 dark:text-rose-50">Backup (Ekspor)</h3>
          </div>
          <ol className="ml-11 list-decimal space-y-1 text-sm text-rose-900/70 dark:text-stone-300">
            <li>Buka Pengaturan → ketuk "Backup JSON".</li>
            <li>Pilih mau dikunci dengan kata sandi atau tidak, lalu file otomatis terunduh ke folder Download/File HP-mu, contoh: mekarayu-backup-2026-07-29.json.</li>
            <li>Pindahkan file itu ke tempat aman, misalnya Google Drive pribadi, email ke dirimu sendiri, atau simpan di HP baru.</li>
          </ol>
        </section>

        <section>
          <div className="mb-2 flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-rose-100 text-rose-600 dark:bg-rose-900/40 dark:text-rose-400">
              <Upload size={18} />
            </span>
            <h3 className="text-sm font-semibold text-rose-950 dark:text-rose-50">Restore (Impor)</h3>
          </div>
          <ol className="ml-11 list-decimal space-y-1 text-sm text-rose-900/70 dark:text-stone-300">
            <li>Buka Pengaturan → ketuk "Pulihkan JSON".</li>
            <li>Pilih file backup yang sesuai (misalnya setelah ganti HP).</li>
            <li>Kalau file itu dikunci, masukkan kata sandi yang dipakai saat membuatnya.</li>
            <li>Konfirmasi saat diminta. Proses ini akan mengganti seluruh data yang ada saat ini.</li>
          </ol>
        </section>

        <div className="flex gap-3 rounded-2xl bg-amber-50 p-3 dark:bg-amber-950/40">
          <ShieldAlert size={18} className="mt-0.5 shrink-0 text-amber-600 dark:text-amber-400" />
          <p className="text-xs leading-relaxed text-amber-800 dark:text-amber-300">
            <span className="font-semibold">Restore akan MENGGANTI, bukan menggabungkan.</span> Semua data saat ini akan dihapus dan diganti isi
            file backup. Jika ada data terbaru yang belum di-backup, backup dulu sebelum melakukan restore.
          </p>
        </div>

        <div className="flex gap-3 rounded-2xl bg-rose-50 p-3 dark:bg-stone-800">
          <FolderLock size={18} className="mt-0.5 shrink-0 text-rose-500 dark:text-rose-400" />
          <p className="text-xs leading-relaxed text-rose-900/70 dark:text-stone-300">
            <span className="font-semibold text-rose-950 dark:text-rose-50">Tanpa kata sandi, file ini tidak terenkripsi</span>, isinya berupa
            teks biasa yang bisa dibaca siapa saja yang membukanya. Pilih "Kunci file backup" saat ekspor kalau mau isinya terenkripsi, lalu
            simpan kata sandinya baik-baik karena hilang kata sandi berarti file itu tidak bisa dipulihkan lagi.
          </p>
        </div>
      </div>
    </Sheet>
  );
}
