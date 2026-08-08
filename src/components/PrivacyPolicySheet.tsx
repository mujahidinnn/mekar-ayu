import { Sheet } from "./ui/Sheet";
import { Database, Lock, Share2, Trash2 } from "lucide-react";

interface PrivacyPolicySheetProps {
  open: boolean;
  onClose: () => void;
}

export function PrivacyPolicySheet({ open, onClose }: PrivacyPolicySheetProps) {
  return (
    <Sheet open={open} onClose={onClose} title="Kebijakan Privasi">
      <div className="space-y-5 pb-4">
        <p className="text-sm text-rose-900/70 dark:text-stone-300">
          Mekar Ayu dibuat dengan prinsip privasi dulu. Aplikasi ini tidak punya
          server, jadi data siklus dan catatan harianmu tidak pernah dikirim ke
          mana pun tanpa kamu memintanya sendiri.
        </p>

        <section>
          <div className="mb-2 flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-rose-100 text-rose-600 dark:bg-rose-900/40 dark:text-rose-400">
              <Database size={18} />
            </span>
            <h3 className="text-sm font-semibold text-rose-950 dark:text-rose-50">
              Data Disimpan di HP-mu Sendiri
            </h3>
          </div>
          <p className="ml-11 text-sm text-rose-900/70 dark:text-stone-300">
            Seluruh data siklus, catatan harian, dan pengaturan disimpan
            langsung di penyimpanan lokal browser HP atau komputermu. Tidak ada
            akun, tidak ada login, dan tidak ada database di server milik kami,
            karena memang tidak ada server sama sekali.
          </p>
        </section>

        <section>
          <div className="mb-2 flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-rose-100 text-rose-600 dark:bg-rose-900/40 dark:text-rose-400">
              <Share2 size={18} />
            </span>
            <h3 className="text-sm font-semibold text-rose-950 dark:text-rose-50">
              Kapan Data Bisa Keluar dari HP-mu
            </h3>
          </div>
          <ul className="ml-11 list-disc space-y-1 text-sm text-rose-900/70 dark:text-stone-300">
            <li>
              Saat kamu memilih Backup JSON, file diunduh ke HP-mu sendiri. Kamu
              yang menentukan mau disimpan atau dipindahkan ke mana.
            </li>
            <li>
              Saat kamu memilih Salin ke Catatan WhatsApp, ringkasan dibuka
              lewat aplikasi WhatsApp-mu dan hanya terkirim kalau kamu sendiri
              yang mengirimnya.
            </li>
            <li>
              Tombol Trakteer Developer membuka situs pihak ketiga (trakteer.id)
              di tab baru; halaman itu punya kebijakan privasinya sendiri.
            </li>
          </ul>
          <p className="ml-11 mt-2 text-sm text-rose-900/70 dark:text-stone-300">
            Di luar tiga hal di atas, aplikasi ini tidak mengirim data apa pun
            secara otomatis. Tidak ada analitik, tidak ada pelacak, dan tidak
            ada pihak ketiga yang diam-diam mengumpulkan datamu.
          </p>
        </section>

        <section>
          <div className="mb-2 flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-rose-100 text-rose-600 dark:bg-rose-900/40 dark:text-rose-400">
              <Lock size={18} />
            </span>
            <h3 className="text-sm font-semibold text-rose-950 dark:text-rose-50">
              Kendali Ada di Tanganmu
            </h3>
          </div>
          <p className="ml-11 text-sm text-rose-900/70 dark:text-stone-300">
            Kamu bisa mengunci file backup dengan kata sandi supaya isinya
            terenkripsi. Kalau HP-mu hilang atau dipakai orang lain, data hanya
            bisa dibaca lewat browser yang sama tempat data itu tersimpan,
            kecuali orang tersebut punya akses langsung ke perangkatmu.
          </p>
        </section>

        <div className="flex gap-3 rounded-2xl bg-rose-50 p-3 dark:bg-stone-800">
          <Trash2
            size={18}
            className="mt-0.5 shrink-0 text-rose-500 dark:text-rose-400"
          />
          <p className="text-xs leading-relaxed text-rose-900/70 dark:text-stone-300">
            <span className="font-semibold text-rose-950 dark:text-rose-50">
              Hapus data kapan saja lewat menu Kelola Data di Pengaturan.
            </span>{" "}
            Karena tidak ada salinan di server manapun, penghapusan itu bersifat
            permanen. Pastikan sudah backup dulu kalau masih membutuhkannya.
          </p>
        </div>
      </div>
    </Sheet>
  );
}
