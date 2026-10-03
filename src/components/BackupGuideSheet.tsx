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
        <p className="text-sm text-[var(--muted)]">
          Karena Mekar Ayu tidak punya server, file <span className="font-semibold text-[var(--ink)]">JSON backup</span> adalah
          satu-satunya cara untuk memindahkan datamu ke HP lain atau menjaganya agar tidak hilang.
        </p>

        <section>
          <div className="mb-2 flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#FFA7DC] text-[#181818]">
              <Download size={18} />
            </span>
            <h3 className="text-sm font-semibold text-[var(--ink)]">Backup (Ekspor)</h3>
          </div>
          <ol className="ml-11 list-decimal space-y-1 text-sm text-[var(--muted)]">
            <li>Buka tab Lainnya → Backup & ekspor, lalu ketuk "Backup JSON".</li>
            <li>Pilih mau dikunci dengan kata sandi atau tidak, lalu file otomatis terunduh ke folder Download/File HP-mu, contoh: mekarayu-backup-2026-07-29.json.</li>
            <li>Pindahkan file itu ke tempat aman, misalnya Google Drive pribadi, email ke dirimu sendiri, atau simpan di HP baru.</li>
          </ol>
        </section>

        <section>
          <div className="mb-2 flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#FFA7DC] text-[#181818]">
              <Upload size={18} />
            </span>
            <h3 className="text-sm font-semibold text-[var(--ink)]">Restore (Impor)</h3>
          </div>
          <ol className="ml-11 list-decimal space-y-1 text-sm text-[var(--muted)]">
            <li>Buka tab Lainnya → Backup & ekspor, lalu ketuk "Pulihkan JSON".</li>
            <li>Pilih file backup yang sesuai (misalnya setelah ganti HP).</li>
            <li>Kalau file itu dikunci, masukkan kata sandi yang dipakai saat membuatnya.</li>
            <li>Konfirmasi saat diminta. Proses ini akan mengganti seluruh data yang ada saat ini.</li>
          </ol>
        </section>

        <div className="flex gap-3 rounded-2xl bg-[#FFE3A3] p-3">
          <ShieldAlert size={18} className="mt-0.5 shrink-0 text-[#181818]" />
          <p className="text-xs leading-relaxed text-[#181818]">
            <span className="font-semibold">Restore akan MENGGANTI, bukan menggabungkan.</span> Semua data saat ini akan dihapus dan diganti isi
            file backup. Jika ada data terbaru yang belum di-backup, backup dulu sebelum melakukan restore.
          </p>
        </div>

        <div className="flex gap-3 rounded-2xl bg-[var(--surface)] p-3">
          <FolderLock size={18} className="mt-0.5 shrink-0 text-[var(--ink)]" />
          <p className="text-xs leading-relaxed text-[var(--muted)]">
            <span className="font-semibold text-[var(--ink)]">Tanpa kata sandi, file ini tidak terenkripsi</span>, isinya berupa
            teks biasa yang bisa dibaca siapa saja yang membukanya. Pilih "Kunci file backup" saat ekspor kalau mau isinya terenkripsi, lalu
            simpan kata sandinya baik-baik karena hilang kata sandi berarti file itu tidak bisa dipulihkan lagi.
          </p>
        </div>
      </div>
    </Sheet>
  );
}
