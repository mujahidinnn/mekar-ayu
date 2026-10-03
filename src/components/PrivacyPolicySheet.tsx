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
        <p className="text-sm text-[var(--muted)]">
          Mekar Ayu dibuat dengan prinsip privasi dulu. Aplikasi ini tidak punya
          server, jadi data siklus dan catatan harianmu tidak pernah dikirim ke
          mana pun tanpa kamu memintanya sendiri.
        </p>

        <section>
          <div className="mb-2 flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#FFA7DC] text-[#181818]">
              <Database size={18} />
            </span>
            <h3 className="text-sm font-semibold text-[var(--ink)]">
              Data Disimpan di HP-mu Sendiri
            </h3>
          </div>
          <p className="ml-11 text-sm text-[var(--muted)]">
            Seluruh data siklus, catatan harian, dan pengaturan disimpan
            langsung di penyimpanan lokal browser HP atau komputermu. Tidak ada
            akun, tidak ada login, dan tidak ada database di server milik kami,
            karena memang tidak ada server sama sekali.
          </p>
        </section>

        <section>
          <div className="mb-2 flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#FFA7DC] text-[#181818]">
              <Share2 size={18} />
            </span>
            <h3 className="text-sm font-semibold text-[var(--ink)]">
              Kapan Data Bisa Keluar dari HP-mu
            </h3>
          </div>
          <ul className="ml-11 list-disc space-y-1 text-sm text-[var(--muted)]">
            <li>
              Saat kamu memilih Backup JSON, file diunduh ke HP-mu sendiri. Kamu
              yang menentukan mau disimpan atau dipindahkan ke mana.
            </li>
            <li>
              Saat kamu memilih Salin ringkasan ke WhatsApp, ringkasan dibuka
              lewat aplikasi WhatsApp-mu dan hanya terkirim kalau kamu sendiri
              yang mengirimnya.
            </li>
            <li>
              Menu Dukung pengembang membuka situs pihak ketiga (trakteer.id)
              di tab baru; halaman itu punya kebijakan privasinya sendiri.
            </li>
          </ul>
          <p className="ml-11 mt-2 text-sm text-[var(--muted)]">
            Di luar tiga hal di atas, aplikasi ini tidak mengirim data apa pun
            secara otomatis. Tidak ada analitik, tidak ada pelacak, dan tidak
            ada pihak ketiga yang diam-diam mengumpulkan datamu.
          </p>
        </section>

        <section>
          <div className="mb-2 flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#FFA7DC] text-[#181818]">
              <Lock size={18} />
            </span>
            <h3 className="text-sm font-semibold text-[var(--ink)]">
              Kendali Ada di Tanganmu
            </h3>
          </div>
          <p className="ml-11 text-sm text-[var(--muted)]">
            Kamu bisa mengunci file backup dengan kata sandi supaya isinya
            terenkripsi. Kalau HP-mu hilang atau dipakai orang lain, data hanya
            bisa dibaca lewat browser yang sama tempat data itu tersimpan,
            kecuali orang tersebut punya akses langsung ke perangkatmu.
          </p>
        </section>

        <div className="flex gap-3 rounded-2xl bg-[var(--surface)] p-3">
          <Trash2
            size={18}
            className="mt-0.5 shrink-0 text-[var(--ink)]"
          />
          <p className="text-xs leading-relaxed text-[var(--muted)]">
            <span className="font-semibold text-[var(--ink)]">
              Hapus data kapan saja lewat menu Hapus semua data di tab Lainnya.
            </span>{" "}
            Karena tidak ada salinan di server manapun, penghapusan itu bersifat
            permanen. Pastikan sudah backup dulu kalau masih membutuhkannya.
          </p>
        </div>
      </div>
    </Sheet>
  );
}
